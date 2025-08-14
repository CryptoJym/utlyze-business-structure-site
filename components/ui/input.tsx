import * as React from "react";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={(
        "flex h-11 sm:h-9 min-h-[44px] w-full rounded-md border bg-background px-3 py-1.5 text-base sm:text-sm shadow-sm transition-colors placeholder:text-foreground/50 focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 " +
        (className ?? "")
      ).trim()}
      {...props}
    />
  );
}
