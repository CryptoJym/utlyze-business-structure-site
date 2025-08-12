import * as React from "react";

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 border bg-foreground text-background hover:opacity-90 h-9 px-4 py-2 " +
        (className ?? "")
      ).trim()}
      {...props}
    />
  );
}
