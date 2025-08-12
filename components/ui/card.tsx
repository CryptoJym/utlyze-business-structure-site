import * as React from "react";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={("rounded-2xl border bg-background text-foreground shadow-sm " + (className ?? "")).trim()} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={("flex flex-col space-y-1.5 p-4 " + (className ?? "")).trim()} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={("tracking-tight text-base font-semibold " + (className ?? "")).trim()} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={("p-4 pt-0 " + (className ?? "")).trim()} {...props} />;
}
