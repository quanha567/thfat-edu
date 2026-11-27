"use client";

import { DataTableRowActions, getDataTableSelectColumn } from "@/components/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import { ExternalLink, PauseCircle, Pencil, PlayCircle, Trash2 } from "lucide-react";

import { formatExamCode, getExamAttempts, getExamDifficulty } from "../constants/exam.constants";
import { type TQuizListItem } from "../types";
import { ExamDifficultyBadge } from "./exam-difficulty-badge";
import { ExamStatusBadge } from "./exam-status-badge";

type TCreateExamColumnsOptions = {
  onDelete: (exam: TQuizListItem) => void;
  onToggleStatus: (exam: TQuizListItem) => void;
};

export function createExamColumns({
  onDelete,
  onToggleStatus,
}: TCreateExamColumnsOptions): ColumnDef<TQuizListItem>[] {
  return [
    getDataTableSelectColumn<TQuizListItem>((exam) => exam.title),
    {
      id: "code",
      header: "Mã đề",
      cell: ({ row }) => {
        const code = formatExamCode(row.original.id, row.index);

        return (
          <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 font-mono text-xs">
            {code}
          </span>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Tên đề thi",
      cell: ({ row }) => (
        <span className="text-foreground line-clamp-1 font-semibold" title={row.original.title}>
          {row.original.title}
        </span>
      ),
    },
    {
      id: "difficulty",
      header: "Độ khó",
      cell: ({ row }) => {
        const difficulty = getExamDifficulty(row.original, row.index);

        return <ExamDifficultyBadge difficulty={difficulty} />;
      },
    },
    {
      id: "structure",
      header: "Cấu trúc đề",
      cell: ({ row }) => (
        <div className="space-y-0.5 text-xs">
          <div className="text-foreground font-medium">
            {row.original.durationMinutes} phút • {row.original.totalPoints} điểm
          </div>
          <div className="text-muted-foreground text-xxs">
            {row.original.totalQuestions} câu hỏi • {row.original.totalSubItems} ý trả lời
          </div>
        </div>
      ),
    },
    {
      id: "attempts",
      header: "Lượt thi",
      cell: ({ row }) => {
        const attempts = getExamAttempts(row.original);

        return <span className="text-foreground text-xs font-semibold">{attempts}</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => <ExamStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: () => <div className="text-right">Thao tác</div>,
      cell: ({ row }) => {
        const exam = row.original;
        const isArchived = exam.status === "archived";

        const actions = [
          {
            id: "edit",
            label: "Chỉnh sửa",
            icon: <Pencil className="size-4" />,
            onClick: () => {
              window.location.href = `/admin/exams/${exam.id}/edit`;
            },
          },
          {
            id: "toggle-status",
            label: isArchived ? "Kích hoạt" : "Tạm dừng",
            icon: isArchived ? (
              <PlayCircle className="size-4" />
            ) : (
              <PauseCircle className="size-4" />
            ),
            onClick: () => onToggleStatus(exam),
          },
          {
            id: "view",
            label: "Xem chi tiết",
            icon: <ExternalLink className="size-4" />,
            onClick: () => {
              window.open(`/exams/${exam.id}`, "_blank");
            },
          },
          {
            id: "delete",
            label: "Xóa",
            icon: <Trash2 className="size-4" />,
            variant: "destructive" as const,
            onClick: () => onDelete(exam),
          },
        ];

        return <DataTableRowActions row={exam} actions={actions} />;
      },
    },
  ];
}
