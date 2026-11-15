"use client";

import { ChemRenderer } from "@/components/chemistry/chem-renderer";
import { Flag } from "lucide-react";

import { type TExamRoomSubItem } from "../types";

export type TTrueFalseTableProps = {
  subItems: TExamRoomSubItem[];
  answersMap: Record<string, { selectedAnswer: string | null; isFlagged: boolean }>;
  onAnswerChange: (subItemId: string, value: string) => void;
  onToggleFlag: (subItemId: string) => void;
};

export function TrueFalseTable({
  subItems,
  answersMap,
  onAnswerChange,
  onToggleFlag,
}: TTrueFalseTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-600">
          <tr>
            <th scope="col" className="w-10 px-3 py-2.5 text-center">
              Ý
            </th>
            <th scope="col" className="px-3 py-2.5">
              Nội dung phát biểu
            </th>
            <th scope="col" className="w-20 px-2 py-2.5 text-center">
              Đúng
            </th>
            <th scope="col" className="w-20 px-2 py-2.5 text-center">
              Sai
            </th>
            <th scope="col" className="w-10 px-2 py-2.5 text-center">
              <Flag className="mx-auto h-3.5 w-3.5 text-neutral-400" />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 bg-white">
          {subItems.map((si) => {
            const state = answersMap[si.id];
            const selectedAnswer = state?.selectedAnswer ?? "";
            const isFlagged = state?.isFlagged ?? false;

            return (
              <tr
                key={si.id}
                id={`subitem-${si.id}`}
                className="scroll-mt-24 transition-colors hover:bg-neutral-50/70"
              >
                <td className="px-3 py-3 text-center align-top text-xs font-bold text-neutral-800">
                  {si.label}
                </td>
                <td className="px-3 py-3 align-top text-sm leading-relaxed text-neutral-900">
                  <ChemRenderer content={si.content} />
                </td>
                <td className="px-2 py-2.5 text-center align-middle">
                  <button
                    type="button"
                    onClick={() => onAnswerChange(si.id, "true")}
                    className={`w-full rounded-md px-2 py-1.5 text-xs font-bold transition-all ${
                      selectedAnswer === "true"
                        ? "bg-green-600 text-white shadow-xs ring-2 ring-green-600/30"
                        : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    Đúng
                  </button>
                </td>
                <td className="px-2 py-2.5 text-center align-middle">
                  <button
                    type="button"
                    onClick={() => onAnswerChange(si.id, "false")}
                    className={`w-full rounded-md px-2 py-1.5 text-xs font-bold transition-all ${
                      selectedAnswer === "false"
                        ? "bg-red-600 text-white shadow-xs ring-2 ring-red-600/30"
                        : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    Sai
                  </button>
                </td>
                <td className="px-2 py-2.5 text-center align-middle">
                  <button
                    type="button"
                    onClick={() => onToggleFlag(si.id)}
                    title={isFlagged ? "Bỏ cắm cờ" : "Cắm cờ ý này"}
                    className={`rounded-md p-1.5 transition-colors ${
                      isFlagged
                        ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
                        : "text-neutral-300 hover:bg-neutral-100 hover:text-neutral-500"
                    }`}
                  >
                    <Flag className={`h-4 w-4 ${isFlagged ? "fill-current text-amber-500" : ""}`} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
