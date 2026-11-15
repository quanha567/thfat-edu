"use client";

import { ChemRenderer } from "@/components/chemistry/chem-renderer";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Check } from "lucide-react";

import { type TMatchingOption } from "./matching.types";

export type TMatchingMobileDrawerProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  subItemLabel: string;
  subItemContent: string;
  options: TMatchingOption[];
  selectedLetter: string;
  onSelect: (letter: string) => void;
};

export function MatchingMobileDrawer({
  isOpen,
  onOpenChange,
  subItemLabel,
  subItemContent,
  options,
  selectedLetter,
  onSelect,
}: TMatchingMobileDrawerProps) {
  const selectedUpper = selectedLetter.trim().toUpperCase();

  const handleSelect = (letter: string) => {
    onSelect(letter);
    onOpenChange(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b border-neutral-100 pb-3 text-left">
          <DrawerTitle className="text-base font-bold text-neutral-900">
            Ghép phương án cho Ý {subItemLabel}
          </DrawerTitle>
          <DrawerDescription asChild>
            <div className="mt-1 line-clamp-2 text-xs text-neutral-600">
              <ChemRenderer content={subItemContent} />
            </div>
          </DrawerDescription>
        </DrawerHeader>

        <div className="max-h-[55vh] space-y-2 overflow-y-auto p-4">
          {options.map((opt) => {
            const isSelected = selectedUpper === opt.letter;

            return (
              <button
                key={opt.letter}
                type="button"
                onClick={() => handleSelect(opt.letter)}
                className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all active:scale-[0.99] ${
                  isSelected
                    ? "border-primary-500 bg-primary-50/80 ring-primary-500 shadow-xs ring-1"
                    : "border-neutral-200 bg-white hover:bg-neutral-50"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                    isSelected ? "bg-primary-600 text-white" : "bg-neutral-100 text-neutral-700"
                  }`}
                >
                  {opt.letter}
                </span>

                <div className="min-w-0 flex-1 text-xs leading-relaxed text-neutral-900">
                  <ChemRenderer content={opt.content || opt.raw} />
                </div>

                {isSelected && <Check className="text-primary-600 mt-0.5 h-4 w-4 shrink-0" />}
              </button>
            );
          })}
        </div>

        <DrawerFooter className="border-t border-neutral-100 pt-3">
          {selectedUpper && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSelect("")}
              className="text-neutral-600 hover:text-neutral-900"
            >
              Bỏ chọn phương án
            </Button>
          )}
          <DrawerClose asChild>
            <Button variant="ghost" size="sm">
              Đóng
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
