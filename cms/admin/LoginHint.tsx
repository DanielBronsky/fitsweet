import { adminBotUsername } from "../telegram/api";
import { LoginWaiting } from "./LoginWaiting";

export function LoginHint() {
  const bot = adminBotUsername();
  if (!bot || process.env.ADMIN_2FA === "off") return null;
  return (
    <>
      <p style={{ margin: "20px 0 0", fontSize: 13, lineHeight: 1.5, color: "var(--theme-elevation-500)", textAlign: "center" }}>
        🔐 Если к аккаунту подключён Telegram, после ввода пароля подтвердите вход в боте @{bot} — у вас будет 90 секунд.
      </p>
      <LoginWaiting bot={bot} />
    </>
  );
}
