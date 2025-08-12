"use client";
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

export const Tabs = TabsPrimitive.Root;
export const TabsList = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.List ref={ref} className={"inline-flex items-center rounded-lg bg-background p-1 border w-full overflow-x-auto " + (className ?? "")} {...props} />
  )
);
TabsList.displayName = "TabsList";

export const TabsTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-foreground data-[state=active]:text-background border"
        + (className ? " " + className : "")
      }
      {...props}
    />
  )
);
TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Content ref={ref} className={className} {...props} />
  )
);
TabsContent.displayName = "TabsContent";
