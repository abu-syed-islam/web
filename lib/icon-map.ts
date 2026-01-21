import {
  Code2,
  Palette,
  Cloud,
  ShieldCheck,
  Rocket,
  Sparkles,
  Database,
  LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  code: Code2,
  development: Code2,
  design: Palette,
  ui: Palette,
  ux: Palette,
  cloud: Cloud,
  devops: Cloud,
  security: ShieldCheck,
  launch: Rocket,
  deploy: Rocket,
  data: Database,
};

export function resolveIcon(iconName?: string | null): LucideIcon {
  if (!iconName) return Sparkles;

  const normalized = iconName.toLowerCase();
  return iconMap[normalized] ?? Sparkles;
}
