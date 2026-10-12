import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const env = process.env;
const TOKENS = [...new Set([env.TELEGRAM_ADMIN_BOT_TOKEN, env.TELEGRAM_BOT_TOKEN].map((t) => t?.trim()).filter(Boolean))];
const HEALTH_URL = env.HEALTH_URL ?? "http://app:3000/api/health";
const DB_FILE = env.DATABASE_FILE ?? "/data/fitsweet.db";
const BACKUP_DIR = env.BACKUP_DIR ?? "/data/backups";
const KEEP_DAYS = Number(env.BACKUP_KEEP_DAYS ?? 14);
const BACKUP_HOUR = Number(env.BACKUP_HOUR ?? 3);
const REPORT_HOUR = Number(env.REPORT_HOUR ?? 9);
const MORNING_REPORT = env.MORNING_REPORT !== "off";
const DISK_WARN = Number(env.DISK_WARN_PCT ?? 85);
const MEMORY_WARN = Number(env.MEMORY_WARN_PCT ?? 90);
const HEALTHCHECKS_URL = env.HEALTHCHECKS_URL ?? "";
const CONTAINER = env.APP_CONTAINER ?? "fitsweet-app";
const DRY_RUN = env.WATCHDOG_DRY_RUN === "1";
const TZ = "Europe/Chisinau";
const TICK_MS = 60_000;
const REMIND_MS = 30 * 60_000;

const log = (...a) => console.log(new Date().toISOString(), "[watchdog]", ...a);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function localParts(date = new Date()) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(date)
      .map((x) => [x.type, x.value]),
  );
  return { day: `${p.year}-${p.month}-${p.day}`, hour: Number(p.hour), time: `${p.hour}:${p.minute}` };
}

function withDb(fn) {
  const db = new DatabaseSync(DB_FILE, { readOnly: true });
  try {
    return fn(db);
  } finally {
    db.close();
  }
}

function recipients() {
  const fromEnv = (env.ALERT_CHAT_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  let fromDb = [];
  try {
    fromDb = withDb((db) => db.prepare("SELECT chat_id FROM users WHERE chat_id IS NOT NULL AND chat_id != ''").all().map((r) => String(r.chat_id)));
  } catch (err) {
    log("не удалось прочитать администраторов из базы:", err.message);
  }
  return [...new Set([...fromEnv, ...fromDb])];
}

async function send(text) {
  const chats = recipients();
  if (DRY_RUN || !TOKENS.length || !chats.length) {
    log(`СООБЩЕНИЕ${DRY_RUN ? " (dry-run)" : !TOKENS.length ? " (нет токена)" : " (некому)"}:\n${text.replace(/<[^>]+>/g, "")}`);
    return;
  }
  for (const chat_id of chats) {
    let delivered = false;
    for (const token of TOKENS) {
      try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id, text, parse_mode: "HTML", link_preview_options: { is_disabled: true } }),
          signal: AbortSignal.timeout(15_000),
        });
        if (res.ok) {
          delivered = true;
          break;
        }
      } catch {}
    }
    if (!delivered) log(`не удалось доставить сообщение в чат ${chat_id}`);
  }
}

function docker(pathname) {
  return new Promise((resolve, reject) => {
    const req = http.request({ socketPath: "/var/run/docker.sock", path: pathname, method: "GET", timeout: 10_000 }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => (res.statusCode && res.statusCode < 300 ? resolve(Buffer.concat(chunks)) : reject(new Error(`docker ${res.statusCode}`))));
    });
    req.on("timeout", () => req.destroy(new Error("docker timeout")));
    req.on("error", reject);
    req.end();
  });
}

function demux(buf) {
  const out = [];
  let i = 0;
  while (i + 8 <= buf.length) {
    const size = buf.readUInt32BE(i + 4);
    out.push(buf.subarray(i + 8, i + 8 + size).toString("utf8"));
    i += 8 + size;
  }
  return out.join("") || buf.toString("utf8");
}

async function containerInfo() {
  try {
    const info = JSON.parse((await docker(`/containers/${CONTAINER}/json`)).toString());
    const stats = JSON.parse((await docker(`/containers/${CONTAINER}/stats?stream=false`)).toString());
    const usage = (stats.memory_stats?.usage ?? 0) - (stats.memory_stats?.stats?.inactive_file ?? 0);
    const limit = stats.memory_stats?.limit ?? 0;
    return { restarts: info.RestartCount ?? 0, startedAt: info.State?.StartedAt, running: info.State?.Running, memoryPct: limit ? Math.round((usage / limit) * 100) : null };
  } catch (err) {
    return { error: err.message };
  }
}

async function lastLogs(lines = 12) {
  try {
    return demux(await docker(`/containers/${CONTAINER}/logs?stdout=1&stderr=1&tail=${lines}`))
      .replace(/\x1b\[[0-9;]*m/g, "")
      .trim()
      .slice(-1500);
  } catch {
    return "";
  }
}

async function checkHealth() {
  try {
    const res = await fetch(HEALTH_URL, { signal: AbortSignal.timeout(10_000) });
    const body = await res.json().catch(() => null);
    return { ok: res.ok && Boolean(body?.ok), status: res.status, body };
  } catch (err) {
    return { ok: false, status: 0, error: err.cause?.code ?? err.message };
  }
}

const incidents = new Map();

async function raise(key, text) {
  const now = Date.now();
  const open = incidents.get(key);
  if (!open) {
    incidents.set(key, { since: now, notifiedAt: now });
    await send(text);
  } else if (now - open.notifiedAt >= REMIND_MS) {
    open.notifiedAt = now;
    await send(`${text}\n\n⏱ Не решено уже ${Math.round((now - open.since) / 60_000)} мин.`);
  }
}

async function resolve(key, text) {
  const open = incidents.get(key);
  if (!open) return;
  incidents.delete(key);
  await send(`${text} (проблема длилась ${Math.max(1, Math.round((Date.now() - open.since) / 60_000))} мин)`);
}

function backupName(day) {
  return path.join(BACKUP_DIR, `fitsweet-${day}.db`);
}

async function backup() {
  const { day } = localParts();
  const target = backupName(day);
  await fs.mkdir(BACKUP_DIR, { recursive: true });
  await fs.rm(target, { force: true });
  withDb((db) => db.exec(`VACUUM INTO '${target.replace(/'/g, "''")}'`));
  const { size } = await fs.stat(target);
  const cutoff = Date.now() - KEEP_DAYS * 86_400_000;
  for (const file of await fs.readdir(BACKUP_DIR)) {
    const full = path.join(BACKUP_DIR, file);
    const stat = await fs.stat(full).catch(() => null);
    if (stat && file.startsWith("fitsweet-") && stat.mtimeMs < cutoff) await fs.rm(full, { force: true });
  }
  log(`бэкап готов: ${target} (${(size / 1e6).toFixed(1)} МБ)`);
  return { file: target, size };
}

async function lastBackup() {
  try {
    const files = (await fs.readdir(BACKUP_DIR)).filter((f) => f.startsWith("fitsweet-")).sort();
    if (!files.length) return null;
    const file = files.at(-1);
    const { size, mtimeMs } = await fs.stat(path.join(BACKUP_DIR, file));
    return { file, size, mtimeMs };
  } catch {
    return null;
  }
}

function yesterdayOrders() {
  const since = new Date(Date.now() - 48 * 3_600_000).toISOString();
  const yesterday = localParts(new Date(Date.now() - 86_400_000)).day;
  const rows = withDb((db) => db.prepare("SELECT status, total, created_at FROM orders WHERE created_at > ?").all(since));
  const list = rows.filter((r) => localParts(new Date(r.created_at)).day === yesterday && r.status !== "cancelled");
  return { count: list.length, sum: list.reduce((s, r) => s + Number(r.total ?? 0), 0) };
}

async function diskUsage() {
  const stat = await fs.statfs(path.dirname(DB_FILE));
  return Math.round((1 - stat.bavail / stat.blocks) * 100);
}

const state = { healthFails: 0, lastRestarts: null, memoryHighSince: null, backupDay: null, reportDay: null, lastHealth: null };

async function tick() {
  if (HEALTHCHECKS_URL) await fetch(HEALTHCHECKS_URL, { signal: AbortSignal.timeout(10_000) }).catch(() => {});
  const health = await checkHealth();
  state.lastHealth = health;
  if (health.ok) {
    state.healthFails = 0;
    await resolve("site", "✅ <b>Сайт снова работает</b>");
  } else {
    state.healthFails += 1;
    if (state.healthFails >= 2) {
      const reason = health.status ? `ответ ${health.status}${health.body?.db?.error ? ` · база: ${health.body.db.error}` : ""}` : `нет ответа (${health.error})`;
      const logs = await lastLogs();
      await raise("site", `🔴 <b>Сайт не отвечает</b> · ${esc(reason)}${logs ? `\n\nПоследние строки лога:\n<pre>${esc(logs)}</pre>` : ""}`);
    }
  }

  const bot = health.body?.bot;
  if (health.ok && bot?.enabled && !bot.ok) {
    const which = bot.orders && !bot.orders.ok ? "Бот заказов" : "Админ-бот";
    await raise("bot", `🟠 <b>${which} не принимает обновления</b> — заказы сохраняются в админке, но кнопки в Telegram могут не работать.`);
  } else if (health.ok) {
    await resolve("bot", "✅ <b>Бот заказов снова работает</b>");
  }

  try {
    const disk = await diskUsage();
    if (disk >= DISK_WARN) await raise("disk", `🟠 <b>Диск заполнен на ${disk}%</b> — пора почистить старые бэкапы или увеличить диск.`);
    else await resolve("disk", `✅ <b>Место на диске освободилось</b> · занято ${disk}%`);
  } catch (err) {
    log("диск:", err.message);
  }

  const c = await containerInfo();
  if (!c.error) {
    if (state.lastRestarts !== null && c.restarts > state.lastRestarts) {
      const logs = await lastLogs(20);
      await send(`🔴 <b>Контейнер сайта перезапустился</b> (всего перезапусков: ${c.restarts})${logs ? `\n\nПоследние строки лога:\n<pre>${esc(logs)}</pre>` : ""}`);
    }
    state.lastRestarts = c.restarts;
    if (c.memoryPct !== null && c.memoryPct >= MEMORY_WARN) {
      state.memoryHighSince ??= Date.now();
      if (Date.now() - state.memoryHighSince >= 10 * 60_000) await raise("memory", `🟠 <b>Сайт занимает ${c.memoryPct}% памяти</b> уже больше 10 минут.`);
    } else {
      state.memoryHighSince = null;
      await resolve("memory", "✅ <b>Память в норме</b>");
    }
  }

  const now = localParts();
  if (now.hour === BACKUP_HOUR && state.backupDay !== now.day) {
    state.backupDay = now.day;
    try {
      await backup();
      await resolve("backup", "✅ <b>Бэкап базы снова делается</b>");
    } catch (err) {
      await raise("backup", `🟠 <b>Бэкап базы не удался</b>: ${esc(err.message)}`);
    }
  }

  if (MORNING_REPORT && now.hour === REPORT_HOUR && state.reportDay !== now.day) {
    state.reportDay = now.day;
    await send(await morningReport());
  }
}

async function morningReport() {
  const lines = [];
  const health = state.lastHealth;
  lines.push(health?.ok ? "☀️ <b>Доброе утро! Сайт работает</b>" : "☀️ <b>Доброе утро.</b> ⚠️ Сайт сейчас не отвечает");
  try {
    const o = yesterdayOrders();
    lines.push(`🛍 Заказов вчера: <b>${o.count}</b>${o.count ? ` на <b>${o.sum} MDL</b>` : ""}`);
  } catch (err) {
    lines.push(`🛍 Заказы: не удалось посчитать (${esc(err.message)})`);
  }
  try {
    lines.push(`💾 Диск занят на ${await diskUsage()}%`);
  } catch {}
  const b = await lastBackup();
  lines.push(b ? `🗄 Последний бэкап: ${esc(b.file)} · ${(b.size / 1e6).toFixed(1)} МБ` : "🗄 Бэкапов ещё нет");
  if (health?.body?.bot?.enabled) lines.push(health.body.bot.ok ? "🤖 Боты работают" : "🤖 ⚠️ Бот не отвечает");
  return lines.join("\n");
}

const [command, ...rest] = process.argv.slice(2);

if (command === "notify") {
  await send(rest.join(" "));
  process.exit(0);
} else if (command === "backup") {
  const b = await backup();
  console.log(b.file);
  process.exit(0);
} else if (command === "report") {
  state.lastHealth = await checkHealth();
  await send(await morningReport());
  process.exit(0);
} else {
  log(`запущен · проверка раз в минуту · бэкап в ${BACKUP_HOUR}:00 · сводка ${MORNING_REPORT ? `в ${REPORT_HOUR}:00` : "выключена"} · получателей: ${recipients().length}${DRY_RUN ? " · DRY RUN" : ""}`);
  const loop = async () => {
    try {
      await tick();
    } catch (err) {
      log("ошибка проверки:", err.message);
    }
    setTimeout(loop, TICK_MS);
  };
  setTimeout(loop, 30_000);
}
