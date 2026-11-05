"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit3, FileQuestion, FileUp, MoreVertical, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { EXAM_STATUS_CONFIG } from "../constants/exam.constants";
import { useDeleteExam } from "../hooks/use-delete-exam";
import { useExams } from "../hooks/use-exams";
import { type TExamStatus, type TQuizListItem } from "../types";
import { ExamMetricsBar } from "./exam-metrics-bar";

export function ExamListTable() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TExamStatus | "all">("all");

  const filterParams = {
    search: search.trim() || undefined,
    status: status === "all" ? undefined : status,
  };

  const { data, isLoading, error } = useExams(filterParams);
  const deleteMutation = useDeleteExam();

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa đề thi "${title}"?`)) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success(`Đã xóa thành công đề thi "${title}"`);
      } catch (err) {
        toast.error((err as Error).message);
      }
    }
  };

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-muted-foreground h-32 text-center">
            Đang tải danh sách đề thi...
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-destructive h-32 text-center">
            {(error as Error).message}
          </TableCell>
        </TableRow>
      );
    }

    if (items.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-44 text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <FileQuestion className="text-muted-foreground/50 size-10" />
              <p className="text-foreground text-sm font-medium">Chưa có đề thi nào</p>
              <p className="text-muted-foreground text-xs">
                Bắt đầu bằng cách nhập file PDF đề thi Hóa học hoặc tạo đề mới thủ công.
              </p>
              <Button asChild size="sm" variant="outline" className="mt-2">
                <Link href="/admin/exams/create">
                  <FileUp className="mr-1 size-3.5" /> Nhập đề PDF ngay
                </Link>
              </Button>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return items.map((exam: TQuizListItem) => {
      const statusMeta = EXAM_STATUS_CONFIG[exam.status];

      return (
        <TableRow key={exam.id}>
          <TableCell>
            <div className="flex flex-col">
              <Link
                href={`/admin/exams/${exam.id}/edit`}
                className="text-foreground hover:text-primary font-medium transition-colors hover:underline"
              >
                {exam.title}
              </Link>
              {exam.description && (
                <span className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
                  {exam.description}
                </span>
              )}
            </div>
          </TableCell>

          <TableCell>
            <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
          </TableCell>

          <TableCell>
            <div className="space-y-0.5 text-xs">
              <span className="font-medium">{exam.durationMinutes} phút</span>
              <span className="text-muted-foreground block">{exam.totalPoints} điểm thô</span>
            </div>
          </TableCell>

          <TableCell>
            <div className="space-y-0.5 text-xs">
              <span className="font-medium">{exam.totalQuestions} câu lớn</span>
              <span className="text-muted-foreground block">
                {exam.totalSubItems} tiểu mục (4 phần)
              </span>
            </div>
          </TableCell>

          <TableCell className="text-muted-foreground text-xs">
            {new Date(exam.updatedAt).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </TableCell>

          <TableCell className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/exams/${exam.id}/edit`} className="cursor-pointer">
                    <Edit3 className="mr-2 size-4" /> Soát & Chỉnh sửa
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(exam.id, exam.title)}
                  className="text-destructive cursor-pointer"
                >
                  <Trash2 className="mr-2 size-4" /> Xóa đề thi
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <div className="space-y-6">
      <ExamMetricsBar items={items} total={total} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="Tìm kiếm đề thi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-9"
            />
          </div>

          <Select value={status} onValueChange={(val) => setStatus(val as TExamStatus | "all")}>
            <SelectTrigger className="h-9 w-[160px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="draft">Bản nháp</SelectItem>
              <SelectItem value="published">Đã xuất bản</SelectItem>
              <SelectItem value="archived">Đã lưu trữ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="h-9 gap-1.5">
            <Link href="/admin/exams/create">
              <FileUp className="size-4" />
              <span>Nhập từ PDF (AI)</span>
            </Link>
          </Button>

          <Button asChild size="sm" className="h-9 gap-1.5 bg-[#1C3480] hover:bg-[#1C3480]/90">
            <Link href="/admin/exams/create?mode=manual">
              <Plus className="size-4" />
              <span>Tạo đề mới</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="border-border/60 bg-card overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[380px]">Tên đề thi</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thời lượng & Điểm</TableHead>
              <TableHead>Cấu trúc câu hỏi</TableHead>
              <TableHead>Ngày cập nhật</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderTableBody()}</TableBody>
        </Table>
      </div>
    </div>
  );
}
