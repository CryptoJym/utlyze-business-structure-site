import * as React from "react";

type BadgeVariant = "default" | "secondary";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const base = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium";
  const styles: Record<BadgeVariant, string> = {
    default: "bg-foreground text-background border-transparent",
    secondary: "bg-muted text-foreground border-foreground/15",
  };
  return <span className={(base + " " + styles[variant] + (className ? " " + className : "")).trim()} {...props} />;
}
