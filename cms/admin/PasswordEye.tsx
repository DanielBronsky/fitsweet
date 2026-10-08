"use client";

import { useEffect, type ReactNode } from "react";

const EYE =
  '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>';
const EYE_OFF =
  '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10.6 5.1A9.7 9.7 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.1 4M6.6 6.6A17.4 17.4 0 0 0 2 12s3.6 7 10 7a9.6 9.6 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/><path d="M3 3l18 18"/></svg>';

function attach(input: HTMLInputElement) {
  if (input.dataset.eye) return;
  input.dataset.eye = "1";
  const holder = input.parentElement;
  if (!holder) return;
  holder.style.position = "relative";
  input.style.paddingRight = "44px";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "fs-eye";
  button.setAttribute("aria-label", "Показать пароль");
  button.innerHTML = EYE;
  button.addEventListener("mousedown", (e) => e.preventDefault());
  button.addEventListener("click", () => {
    const hidden = input.type === "password";
    input.type = hidden ? "text" : "password";
    button.innerHTML = hidden ? EYE_OFF : EYE;
    button.setAttribute("aria-label", hidden ? "Скрыть пароль" : "Показать пароль");
    input.focus();
  });
  holder.appendChild(button);
}

export function PasswordEye({ children }: { children?: ReactNode }) {
  useEffect(() => {
    const scan = () => document.querySelectorAll<HTMLInputElement>('input[type="password"]').forEach(attach);
    scan();
    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}
