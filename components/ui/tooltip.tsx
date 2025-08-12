"use client";
import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export const TooltipProvider = TooltipPrimitive.Provider;

export function Tooltip({ children, ...props }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root {...props}>{children}</TooltipPrimitive.Root>;
}

export function TooltipTrigger({ className, ...props }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger className={className} {...props} />;
}

export function TooltipContent({ className, ...props }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Content sideOffset={6} className={("z-50 overflow-hidden rounded-md border bg-background px-3 py-1.5 text-xs shadow-md " + (className ?? "")).trim()} {...props} />
  );
}
