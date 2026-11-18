import { cn } from "@/lib/utils";
import { type ComponentProps } from "react";

function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-neutral-200/70 dark:bg-neutral-800 animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
