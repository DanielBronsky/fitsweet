import type { CSSProperties } from "react";
import { FeatureIcon } from "./Icons";
import { lucideIcons } from "./lucideIcons";

export function SiteIcon({ name, className, style }: { name: string; className?: string; style?: CSSProperties }) {
  if (name.startsWith("lucide:")) {
    const Icon = lucideIcons[name.slice(7)];
    if (Icon) return <Icon className={className} style={style} strokeWidth={1.5} aria-hidden />;
  }
  return <FeatureIcon name={name} className={className} style={style} />;
}
