export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  if (process.env.TELEGRAM_POLLING === "false") return;
  const { startBot } = await import("./cms/telegram/bot");
  startBot(async () => {
    const [{ getPayload }, { default: config }] = await Promise.all([import("payload"), import("@payload-config")]);
    return getPayload({ config });
  });
}
