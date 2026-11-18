"use client";

import { ChemRenderer } from "@/components/chemistry/chem-renderer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Flag } from "lucide-react";
import { useState } from "react";

import { type TExamRoomSubItem } from "../types";
import { MatchingMobileDrawer } from "./matching-mobile-drawer";
import { MatchingOptionsPanel } from "./matching-options-panel";
import { MatchingSlot } from "./matching-slot";
import { extractMatchingHeaders, parseMatchingOption } from "./matching.types";

export type { TMatchingOption } from "./matching.types";
export { extractMatchingHeaders, parseMatchingOption } from "./matching.types";

export type TMatchingTableProps = {
  subItems: TExamRoomSubItem[];
  answersMap: Record<string, { selectedAnswer: string | null; isFlagged: boolean }>;
  onAnswerChange: (subItemId: string, value: string) => void;
  onToggleFlag: (subItemId: string) => void;
  contextContent?: string;
};

const DEFAULT_MATCHING_OPTIONS = ["A", "B", "C", "D"];

export function MatchingTable({
  subItems,
  answersMap,
  onAnswerChange,
  onToggleFlag,
  contextContent,
}: TMatchingTableProps) {
  const isMobile = useIsMobile();
  const [hoveredLetter, setHoveredLetter] = useState<string | null>(null);
  const [mobileSubItem, setMobileSubItem] = useState<TExamRoomSubItem | null>(null);

  const firstWithOptions = subItems.find((s) => s.options && s.options.length > 0);
  const referenceRawOptions = firstWithOptions?.options ?? DEFAULT_MATCHING_OPTIONS;
  const referenceOptions = referenceRawOptions.map((opt, idx) => parseMatchingOption(opt, idx));
  const hasDescriptiveOptions = referenceOptions.some((opt) => opt.content.length > 0);

  const assignedMap: Record<string, string[]> = {};
  subItems.forEach((si, idx) => {
    const selected = answersMap[si.id]?.selectedAnswer?.trim().toUpperCase();

    if (selected) {
      if (!assignedMap[selected]) {
        assignedMap[selected] = [];
      }
      assignedMap[selected].push(si.label || `${idx + 1}`);
    }
  });

  const { col1Title, col2Title } = extractMatchingHeaders(contextContent);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-start">
        {/* Cột A: Bảng câu hỏi & slot ghép phương án */}
        <div className={hasDescriptiveOptions ? "lg:col-span-7" : "lg:col-span-12"}>
          <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-2xs">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50/90 text-xs font-semibold text-neutral-600">
                <tr>
                  <th scope="col" className="w-10 px-3 py-2.5 text-center">
                    Ý
                  </th>
                  <th scope="col" className="px-3 py-2.5">
                    {col1Title}
                  </th>
                  <th scope="col" className="w-24 px-2 py-2.5 text-center">
                    Ghép
                  </th>
                  <th scope="col" className="w-10 px-2 py-2.5 text-center">
                    <Flag className="mx-auto h-3.5 w-3.5 text-neutral-400" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 bg-white">
                {subItems.map((si, sIdx) => {
                  const state = answersMap[si.id];
                  const selectedAnswer = state?.selectedAnswer ?? "";
                  const isFlagged = state?.isFlagged ?? false;
                  const selectedUpper = selectedAnswer.trim().toUpperCase();

                  const isRowHighlighted =
                    Boolean(hoveredLetter) && selectedUpper === hoveredLetter;

                  const optionsList =
                    si.options && si.options.length > 0 ? si.options : referenceRawOptions;
                  const parsedOptions = optionsList.map((opt, oIdx) =>
                    parseMatchingOption(opt, oIdx),
                  );

                  return (
                    <tr
                      key={si.id}
                      id={`subitem-${si.id}`}
                      className={`scroll-mt-24 transition-colors ${
                        isRowHighlighted ? "bg-primary-50/50" : "hover:bg-neutral-50/70"
                      }`}
                    >
                      <td className="px-3 py-3 text-center align-middle text-xs font-bold text-neutral-800">
                        {si.label || `${sIdx + 1}`}
                      </td>

                      <td className="px-3 py-3 align-middle text-sm leading-relaxed text-neutral-900">
                        <ChemRenderer content={si.content} />
                      </td>

                      <td className="px-2 py-3 text-center align-middle">
                        <MatchingSlot
                          subItemId={si.id}
                          selectedLetter={selectedAnswer}
                          options={parsedOptions}
                          onSelect={(letter) => onAnswerChange(si.id, letter)}
                          onHover={setHoveredLetter}
                          isMobile={isMobile}
                          onOpenMobileDrawer={() => setMobileSubItem(si)}
                        />
                      </td>

                      <td className="px-2 py-3 text-center align-middle">
                        <button
                          type="button"
                          onClick={() => onToggleFlag(si.id)}
                          title={isFlagged ? "Bỏ đánh dấu" : "Đánh dấu ý này"}
                          className={`rounded-md p-1.5 transition-colors ${
                            isFlagged
                              ? "bg-warning-100 text-warning-700 hover:bg-warning-200"
                              : "text-neutral-300 hover:bg-neutral-100 hover:text-neutral-500"
                          }`}
                        >
                          <Flag
                            className={`h-4 w-4 ${isFlagged ? "fill-current text-warning-500" : ""}`}
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cột B: Danh sách các phương án đối chiếu (Desktop ghim sticky) */}
        {hasDescriptiveOptions && (
          <div className="lg:sticky lg:top-20 lg:col-span-5">
            <MatchingOptionsPanel
              options={referenceOptions}
              assignedMap={assignedMap}
              title={`Phương án đối chiếu (${col2Title})`}
              hoveredLetter={hoveredLetter}
              onHoverLetter={setHoveredLetter}
            />
          </div>
        )}
      </div>

      {/* Mobile Drawer khi học sinh tap vào ô Chọn */}
      {mobileSubItem && (
        <MatchingMobileDrawer
          isOpen={Boolean(mobileSubItem)}
          onOpenChange={(open) => {
            if (!open) {
              setMobileSubItem(null);
            }
          }}
          subItemLabel={mobileSubItem.label || "1"}
          subItemContent={mobileSubItem.content}
          options={
            mobileSubItem.options && mobileSubItem.options.length > 0
              ? mobileSubItem.options.map((opt, oIdx) => parseMatchingOption(opt, oIdx))
              : referenceOptions
          }
          selectedLetter={answersMap[mobileSubItem.id]?.selectedAnswer ?? ""}
          onSelect={(letter) => onAnswerChange(mobileSubItem.id, letter)}
        />
      )}
    </div>
  );
}
