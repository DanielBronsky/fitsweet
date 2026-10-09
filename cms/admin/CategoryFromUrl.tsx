"use client";

import { useEffect, useRef } from "react";
import { useField, useFormInitializing } from "@payloadcms/ui";

export function CategoryFromUrl() {
  const { value, setValue } = useField<number | null>({ path: "category" });
  const initializing = useFormInitializing();
  const done = useRef(false);

  useEffect(() => {
    if (done.current || initializing) return;
    done.current = true;
    if (value) return;
    const fromUrl = Number(new URLSearchParams(window.location.search).get("category"));
    if (fromUrl) setValue(fromUrl);
  }, [initializing, value, setValue]);

  return null;
}
