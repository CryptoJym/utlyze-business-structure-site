"use client";
import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

export function Switch({ className, ...props }: React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>) {
  return (
    <SwitchPrimitives.Root
      className={("peer inline-flex h-8 w-14 sm:h-6 sm:w-10 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-1 data-[state=checked]:bg-foreground data-[state=unchecked]:bg-muted " + (className ?? "")).trim()}
      {...props}
    >
      <SwitchPrimitives.Thumb className="pointer-events-none block h-7 w-7 sm:h-5 sm:w-5 rounded-full bg-background shadow-lg transition-transform data-[state=checked]:translate-x-6 sm:data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0" />
    </SwitchPrimitives.Root>
  );
}
