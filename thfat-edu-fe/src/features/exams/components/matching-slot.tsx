"use client";

import { ChemRenderer } from "@/components/chemistry/chem-renderer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown, X } from "lucide-react";
import { type MouseEvent, useState } from "react";

import { type TMatchingOption } from "./matching.types";

export type TMatchingSlotProps = {
  subItemId: string;
  selectedLetter: string;
  options: TMatchingOption[];
  onSelect: (letter: string) => void;
  onHover: (letter: string | null) => void;
  isMobile: boolean;
  onOpenMobileDrawer: () => void;
};

export function MatchingSlot({
  selectedLetter,
  options,
  onSelect,
  onHover,
  isMobile,
  onOpenMobileDrawer,
}: TMatchingSlotProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedUpper = selectedLetter.trim().toUpperCase();

  const handleClear = (e: MouseEvent) => {
    e.stopPropagation();
    onSelect("");
    onHover(null);
  };

  const handleSelect = (letter: string) => {
    onSelect(letter);
    setIsOpen(false);
  };

  if (isMobile) {
    if (selectedUpper) {
      return (
        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={onOpenMobileDrawer}
            className="bg-primary-600 hover:bg-primary-700 inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-bold text-white shadow-2xs transition-all active:scale-95"
          >
            <span>{selectedUpper}</span>
            <ChevronDown className="h-3 w-3 opacity-70" />
          </button>
          <button
            type="button"
            onClick={handleClear}
            title="Bỏ chọn"
            className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={onOpenMobileDrawer}
        className="hover:border-primary-400 hover:bg-primary-50/30 hover:text-primary-700 inline-flex h-8 items-center gap-1.5 rounded-lg border border-dashed border-neutral-300 bg-white px-2.5 text-xs font-medium text-neutral-600 shadow-2xs transition-all active:scale-95"
      >
        <span>Chọn</span>
        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
      </button>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {selectedUpper ? (
          <div
            className="inline-flex items-center gap-1"
            onMouseEnter={() => onHover(selectedUpper)}
            onMouseLeave={() => onHover(null)}
          >
            <button
              type="button"
              className="bg-primary-600 hover:bg-primary-700 ring-primary-600/20 inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-bold text-white shadow-2xs transition-all hover:ring-2"
            >
              <span>{selectedUpper}</span>
              <ChevronDown className="h-3 w-3 opacity-80" />
            </button>
            <button
              type="button"
              onClick={handleClear}
              title="Bỏ chọn phương án"
              className="rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="hover:border-primary-400 hover:bg-primary-50/30 hover:text-primary-700 inline-flex h-8 items-center gap-1.5 rounded-lg border border-dashed border-neutral-300 bg-white px-2.5 text-xs font-medium text-neutral-600 shadow-2xs transition-all"
          >
            <span>Chọn</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>
        )}
      </PopoverTrigger>

      <PopoverContent align="start" className="max-h-72 w-80 overflow-y-auto p-2 sm:w-96">
        <div className="mb-2 px-2 py-1 text-xs font-semibold text-neutral-500">
          Chọn phương án đối chiếu:
        </div>

        <div className="flex flex-col gap-1.5">
          {options.map((opt) => {
            const isSelected = selectedUpper === opt.letter;

            return (
              <button
                key={opt.letter}
                type="button"
                onClick={() => handleSelect(opt.letter)}
                onMouseEnter={() => onHover(opt.letter)}
                onMouseLeave={() => onHover(null)}
                className={`flex w-full items-start gap-2.5 rounded-lg p-2 text-left text-xs transition-colors ${
                  isSelected
                    ? "bg-primary-50 text-primary-950 ring-primary-500 ring-1"
                    : "text-neutral-800 hover:bg-neutral-100"
                }`}
              >
                <span
                  className={`text-xxs flex h-5 w-5 shrink-0 items-center justify-center rounded font-bold ${
                    isSelected ? "bg-primary-600 text-white" : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {opt.letter}
                </span>

                <div className="min-w-0 flex-1 leading-relaxed">
                  <ChemRenderer content={opt.content || opt.raw} />
                </div>

                {isSelected && <Check className="text-primary-600 mt-0.5 h-4 w-4 shrink-0" />}
              </button>
            );
          })}
        </div>

        {selectedUpper && (
          <div className="mt-2 border-t border-neutral-100 pt-2">
            <button
              type="button"
              onClick={() => handleSelect("")}
              className="w-full rounded-md py-1.5 text-center text-xs text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
            >
              Bỏ chọn phương án
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
