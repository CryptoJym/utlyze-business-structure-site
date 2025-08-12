"use client";
import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

export function ScrollArea({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root className={("relative overflow-hidden " + (className ?? "")).trim()} {...props}>
      <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">{children}</ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar orientation="vertical" className="flex select-none touch-none p-0.5 bg-transparent">
        <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-foreground/20" />
      </ScrollAreaPrimitive.Scrollbar>
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}
