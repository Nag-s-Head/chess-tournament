import { type ComponentPropsWithoutRef, type ElementType } from "react";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type HeadingSize = "xl" | "lg" | "md" | "sm";

const headingSizeClasses: Record<HeadingSize, string> = {
  xl: "text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight",
  lg: "text-3xl sm:text-4xl font-bold tracking-tight",
  md: "text-2xl sm:text-3xl font-semibold tracking-tight",
  sm: "text-xl sm:text-2xl font-semibold",
};

interface HeadingProps extends ComponentPropsWithoutRef<"h1"> {
  as?: HeadingLevel;
  size?: HeadingSize;
}

export function Heading({
  as: Tag = "h2",
  size = "md",
  className = "",
  children,
  ...rest
}: HeadingProps) {
  return (
    <Tag className={`${headingSizeClasses[size]} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

type TextSize = "lg" | "base" | "sm";
type TextVariant = "default" | "muted" | "accent";

const textSizeClasses: Record<TextSize, string> = {
  lg: "text-lg sm:text-xl leading-relaxed",
  base: "text-base leading-relaxed",
  sm: "text-sm leading-normal",
};

const textVariantClasses: Record<TextVariant, string> = {
  default: "text-foreground",
  muted: "text-foreground/60",
  accent: "text-amber-400",
};

type TextTag = "p" | "span" | "div";

interface TextProps extends ComponentPropsWithoutRef<"p"> {
  as?: TextTag;
  size?: TextSize;
  variant?: TextVariant;
}

export function Text({
  as: Tag = "p",
  size = "base",
  variant = "default",
  className = "",
  children,
  ...rest
}: TextProps) {
  return (
    <Tag
      className={`${textSizeClasses[size]} ${textVariantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
