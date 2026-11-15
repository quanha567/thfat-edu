"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MoreHorizontal } from "lucide-react";

import { type TDataTableAction } from "./data-table.types";

type TDataTableRowActionsProps<TData> = {
  row: TData;
  actions: TDataTableAction<TData>[];
};

export function DataTableRowActions<TData>({ row, actions }: TDataTableRowActionsProps<TData>) {
  const visibleActions = actions.filter((act) => {
    if (typeof act.hidden === "function") return !act.hidden(row);

    return !act.hidden;
  });

  if (visibleActions.length === 0) return null;

  // Rule: If > 3 actions, render dropdown menu
  if (visibleActions.length > 3) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground size-8"
            aria-label="Tùy chọn thao tác"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44 shadow-md">
          {visibleActions.map((act) => {
            const isDisabled =
              typeof act.disabled === "function" ? act.disabled(row) : act.disabled;

            return (
              <DropdownMenuItem
                key={act.id}
                disabled={isDisabled}
                onClick={() => act.onClick(row)}
                className={`cursor-pointer gap-2 text-xs font-medium ${
                  act.variant === "destructive" ? "text-destructive focus:text-destructive" : ""
                }`}
              >
                {act.icon}
                <span>{act.label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // If <= 3 actions, render inline icon buttons with tooltip
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center justify-end gap-1">
        {visibleActions.map((act) => {
          const isDisabled = typeof act.disabled === "function" ? act.disabled(row) : act.disabled;

          return (
            <Tooltip key={act.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isDisabled}
                  onClick={() => act.onClick(row)}
                  className={`text-muted-foreground size-8 transition-colors ${
                    act.variant === "destructive"
                      ? "hover:bg-destructive/10 hover:text-destructive"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                  aria-label={act.label}
                >
                  {act.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {act.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
