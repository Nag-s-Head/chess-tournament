import Link from "next/link";
import { Heading, Text } from "./Typography";

export type VariantType =
  "success" | "error" | "warning" | "info" | "security" | "neutral";

export interface VariantConfig {
  emoji: string;
  cardStyles: string;
  iconStyles: string;
  titleStyles: string;
}

export const STATUS_VARIANTS: Record<VariantType, VariantConfig> = {
  success: {
    emoji: "✅",
    cardStyles: "border-emerald-500/20 bg-emerald-500/5",
    iconStyles: "bg-emerald-500/10 border-emerald-500/20",
    titleStyles: "text-emerald-400",
  },
  error: {
    emoji: "⛔",
    cardStyles: "border-rose-500/20 bg-rose-500/5",
    iconStyles: "bg-rose-500/10 border-rose-500/20",
    titleStyles: "text-rose-400",
  },
  warning: {
    emoji: "⚠️",
    cardStyles: "border-amber-500/20 bg-amber-500/5",
    iconStyles: "bg-amber-500/10 border-amber-500/20",
    titleStyles: "text-amber-400",
  },
  info: {
    emoji: "💡",
    cardStyles: "border-blue-500/20 bg-blue-500/5",
    iconStyles: "bg-blue-500/10 border-blue-500/20",
    titleStyles: "text-blue-400",
  },
  security: {
    emoji: "🔐",
    cardStyles: "border-violet-500/20 bg-violet-500/5",
    iconStyles: "bg-violet-500/10 border-violet-500/20",
    titleStyles: "text-violet-400",
  },
  neutral: {
    emoji: "⏳",
    cardStyles: "border-zinc-500/20 bg-zinc-500/5",
    iconStyles: "bg-zinc-500/10 border-zinc-500/20",
    titleStyles: "text-zinc-400",
  },
};

interface StatusCardProps {
  variant?: VariantType;
  emoji?: string; // Optional override
  title?: string;
  description?: string;
  children?: React.ReactNode;
  href?: string;
}

export function StatusCard({
  variant = "success",
  emoji,
  title,
  description,
  children,
  href,
}: StatusCardProps) {
  const config = STATUS_VARIANTS[variant];
  const activeEmoji = emoji ?? config.emoji;

  const body = (
    <div
      className={`w-full max-w-md p-8 rounded-3xl border-2 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center ${config.cardStyles}`}
    >
      <div
        className={`w-16 h-16 mb-6 rounded-2xl border-2 flex items-center justify-center text-3xl shrink-0 ${config.iconStyles}`}
      >
        {activeEmoji}
      </div>

      {title && (
        <Heading as="h2" size="md" className={`mb-3 ${config.titleStyles}`}>
          {title}
        </Heading>
      )}

      {description && (
        <Text size="sm" variant="muted" className="text-zinc-400">
          {description}
        </Text>
      )}

      {children}
    </div>
  );

  if (href) {
    return <Link href={href}>{body}</Link>;
  } else {
    return body;
  }
}
