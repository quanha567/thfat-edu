"use client";

import { ChemRenderer } from "@/components/chemistry/chem-renderer";

export type TGroupMcqOptionsProps = {
  subItemId: string;
  options: string[] | null | undefined;
  selectedAnswer: string;
  onAnswerChange: (subItemId: string, value: string) => void;
};

export function GroupMcqOptions({
  subItemId,
  options,
  selectedAnswer,
  onAnswerChange,
}: TGroupMcqOptionsProps) {
  const optionsList = options && options.length > 0 ? options : ["A", "B", "C", "D"];

  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {optionsList.map((optText, optIndex) => {
        const letter = String.fromCharCode(65 + optIndex);
        const isSelected =
          selectedAnswer.toUpperCase() === letter ||
          selectedAnswer.trim().toLowerCase() === optText.trim().toLowerCase();

        return (
          <button
            key={letter}
            type="button"
            onClick={() => onAnswerChange(subItemId, letter)}
            className={`flex items-start gap-3 rounded-xl border p-3.5 text-left text-sm transition-all ${
              isSelected
                ? "border-primary-600 bg-primary-50/80 text-primary-950 ring-primary-600/30 font-semibold ring-2"
                : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300 hover:bg-neutral-50"
            }`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                isSelected
                  ? "bg-primary-700 text-white"
                  : "border border-neutral-300 bg-neutral-100 text-neutral-700"
              }`}
            >
              {letter}
            </span>
            <div className="flex-1 pt-0.5 text-sm leading-relaxed">
              <ChemRenderer content={optText} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
