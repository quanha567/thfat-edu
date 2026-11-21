import { ChemRenderer } from "@/components/chemistry/chem-renderer";

import { type TMatchingOption } from "./matching.types";

export type TMatchingOptionsPanelProps = {
  options: TMatchingOption[];
  assignedMap: Record<string, string[]>;
  title: string;
  hoveredLetter: string | null;
  onHoverLetter: (letter: string | null) => void;
};

function getOptionCardStyle(isHighlighted: boolean, isAssigned: boolean): string {
  if (isHighlighted) {
    return "border-primary-500 bg-primary-50/90 shadow-xs ring-2 ring-primary-500/30";
  }

  if (isAssigned) {
    return "border-primary-200 bg-primary-50/30 hover:border-primary-300";
  }

  return "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/60";
}

export function MatchingOptionsPanel({
  options,
  assignedMap,
  title,
  hoveredLetter,
  onHoverLetter,
}: TMatchingOptionsPanelProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-3.5 shadow-2xs">
      <div className="mb-2.5 flex items-center gap-1.5 border-b border-neutral-200/80 pb-2">
        <span className="bg-primary-700 text-xxs flex h-5 w-5 items-center justify-center rounded-full font-bold text-white">
          B
        </span>
        <h4 className="text-xs font-bold text-neutral-800">{title}</h4>
      </div>

      <div className="flex flex-col gap-2">
        {options.map((opt) => {
          const assignedList = assignedMap[opt.letter];
          const isAssigned = Boolean(assignedList && assignedList.length > 0);
          const isHighlighted = hoveredLetter === opt.letter;
          const cardStyle = getOptionCardStyle(isHighlighted, isAssigned);

          return (
            <div
              key={opt.letter}
              onMouseEnter={() => onHoverLetter(opt.letter)}
              onMouseLeave={() => onHoverLetter(null)}
              className={`flex items-start gap-2.5 rounded-lg border p-2.5 text-xs transition-all ${cardStyle}`}
            >
              <span
                className={`text-xxs flex h-5 w-5 shrink-0 items-center justify-center rounded-md font-bold transition-colors ${
                  isHighlighted || isAssigned
                    ? "bg-primary-600 text-white"
                    : "bg-neutral-100 text-neutral-700"
                }`}
              >
                {opt.letter}
              </span>

              <div className="min-w-0 flex-1 leading-relaxed text-neutral-800">
                <ChemRenderer content={opt.content || opt.raw} />

                {isAssigned && assignedList && (
                  <div className="text-primary-700 text-xxs mt-1 flex flex-wrap items-center gap-1 font-medium">
                    <span>Đã ghép với:</span>
                    <span className="bg-primary-100/80 py-0.2 rounded px-1.5 font-semibold">
                      Ý {assignedList.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
