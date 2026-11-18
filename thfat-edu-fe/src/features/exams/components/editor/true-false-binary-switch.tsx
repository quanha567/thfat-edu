"use client";

import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

export type TTrueFalseBinarySwitchProps = {
  isTrue: boolean;
  onChange: (value: "Đúng" | "Sai") => void;
  className?: string;
};

export function TrueFalseBinarySwitch({
  isTrue,
  onChange,
  className,
}: TTrueFalseBinarySwitchProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center rounded-lg border border-border/60 bg-muted/60 p-0.5 shadow-2xs",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onChange("Đúng")}
        className={cn(
          "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
          isTrue
            ? "bg-success-500/20 font-bold text-success-700 shadow-2xs dark:bg-success-500/30 dark:text-success-300"
            : "text-muted-foreground hover:text-foreground hover:bg-background/40",
        )}
      >
        <Check className="size-3" />
        Đúng
      </button>

      <button
        type="button"
        onClick={() => onChange("Sai")}
        className={cn(
          "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
          !isTrue
            ? "bg-error-500/20 font-bold text-error-700 shadow-2xs dark:bg-error-500/30 dark:text-error-300"
            : "text-muted-foreground hover:text-foreground hover:bg-background/40",
        )}
      >
        <X className="size-3" />
        Sai
      </button>
    </div>
  );
}
