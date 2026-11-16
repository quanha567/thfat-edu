"use client";

import { AdminPageHeader } from "@/components/layout/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExamStatusBadge } from "@/features/exams/components/exam-status-badge";
import { useExams } from "@/features/exams/hooks/use-exams";
import { useUsers } from "@/features/users/hooks/use-users";
import { format, parseISO } from "date-fns";
import { ArrowRight, CheckCircle2, FileQuestion, Plus, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { data: allExamsData, isLoading: isLoadingExams } = useExams({ limit: 5 });
  const { data: publishedExamsData } = useExams({ status: "published", limit: 1 });
  const { data: studentsData } = useUsers({ role: "student", limit: 1 });
  const { data: allUsersData } = useUsers({ limit: 1 });

  const totalExams = allExamsData?.total ?? 0;
  const publishedExams = publishedExamsData?.total ?? 0;
  const totalStudents = studentsData?.total ?? 0;
  const totalStaff = Math.max(0, (allUsersData?.total ?? 0) - totalStudents);

  const statItems = [
    {
      title: "Tổng số đề thi",
      value: isLoadingExams ? "—" : totalExams.toLocaleString(),
      sub: `${publishedExams} đề đang hoạt động`,
      icon: FileQuestion,
    },
    {
      title: "Đề đang hoạt động",
      value: isLoadingExams ? "—" : publishedExams.toLocaleString(),
      sub: "Sẵn sàng cho thí sinh",
      icon: CheckCircle2,
    },
    {
      title: "Học viên",
      value: totalStudents.toLocaleString(),
      sub: "Tài khoản học sinh",
      icon: Users,
    },
    {
      title: "Nhân sự vận hành",
      value: totalStaff.toLocaleString(),
      sub: "Giáo viên và quản trị viên",
      icon: ShieldCheck,
    },
  ];

  const recentExams = allExamsData?.items ?? [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:px-8 lg:py-6">
      <AdminPageHeader
        title="Tổng quan"
        description="Thống kê vận hành và hoạt động khảo thí toàn hệ thống"
        actions={
          <Button asChild size="sm" className="gap-1.5 text-xs font-semibold">
            <Link href="/admin/exams/create">
              <Plus className="size-3.5" />
              <span>Tạo đề thi mới</span>
            </Link>
          </Button>
        }
      />

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title} className="border-border bg-card shadow-2xs">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <span className="text-muted-foreground text-xs font-medium">{item.title}</span>
                <div className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-md border">
                  <Icon className="size-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-foreground text-2xl font-bold tracking-tight">
                  {item.value}
                </div>
                <p className="text-muted-foreground mt-1 text-xs">{item.sub}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Exams Table */}
      <Card className="border-border bg-card shadow-2xs">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-bold">Đề thi cập nhật gần đây</CardTitle>
            <CardDescription className="text-xs">
              5 đề thi được tạo hoặc cập nhật mới nhất trong hệ thống
            </CardDescription>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-1 text-xs">
            <Link href="/admin/exams">
              <span>Xem tất cả</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoadingExams ? (
            <div className="space-y-3 py-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : recentExams.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground text-sm">Chưa có đề thi nào trong hệ thống.</p>
              <Button asChild variant="outline" size="sm" className="mt-3 text-xs">
                <Link href="/admin/exams/create">Tạo đề thi đầu tiên</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Tên đề thi</TableHead>
                    <TableHead className="text-xs">Thời lượng & Điểm</TableHead>
                    <TableHead className="text-xs">Trạng thái</TableHead>
                    <TableHead className="text-xs">Ngày tạo</TableHead>
                    <TableHead className="text-right text-xs">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentExams.map((exam) => {
                    const formattedDate = exam.createdAt
                      ? format(parseISO(exam.createdAt), "dd/MM/yyyy HH:mm")
                      : "—";

                    return (
                      <TableRow key={exam.id}>
                        <TableCell className="font-medium">
                          <Link
                            href={`/admin/exams/${exam.id}/edit`}
                            className="text-foreground line-clamp-1 text-sm font-semibold hover:underline"
                          >
                            {exam.title}
                          </Link>
                          <span className="text-muted-foreground text-xs">
                            {exam.totalQuestions} câu hỏi
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {exam.durationMinutes} phút • {exam.totalPoints}đ
                        </TableCell>
                        <TableCell>
                          <ExamStatusBadge status={exam.status} />
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {formattedDate}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs">
                            <Link href={`/admin/exams/${exam.id}/edit`}>Chỉnh sửa</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
