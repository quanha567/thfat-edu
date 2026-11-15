import { AdminPageHeader } from "@/components/layout/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, FileQuestion, Sparkles, Users } from "lucide-react";
import Link from "next/link";

const STAT_ITEMS = [
  {
    title: "Ngân hàng đề CBT",
    value: "128",
    change: "+12 đề tháng này",
    icon: FileQuestion,
    iconWrapper:
      "bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 border-primary-100 dark:border-primary-900",
  },
  {
    title: "Học viên hoạt động",
    value: "1,420",
    change: "+8.4% tuần này",
    icon: Users,
    iconWrapper:
      "bg-success-50 text-success-700 dark:bg-success-950 dark:text-success-300 border-success-100 dark:border-success-900",
  },
  {
    title: "Lượt thi hôm nay",
    value: "385",
    change: "98.2% nộp bài đúng hạn",
    icon: CheckCircle2,
    iconWrapper:
      "bg-warning-50 text-warning-700 dark:bg-warning-950 dark:text-warning-300 border-warning-100 dark:border-warning-900",
  },
  {
    title: "Hạ tầng máy chủ",
    value: "Hoạt động tốt",
    change: "Uptime 99.98%",
    icon: Sparkles,
    iconWrapper:
      "bg-highlight-50 text-highlight-700 dark:bg-highlight-950 dark:text-highlight-300 border-highlight-100 dark:border-highlight-900",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:px-8 lg:py-6">
      <AdminPageHeader
        title="Dashboard Quản trị"
        description="Chào mừng bạn đến với trung tâm điều hành và khảo thí trực tuyến THFAT EDU."
      />

      {/* Metric Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              className="border-neutral-200 bg-white shadow-2xs dark:border-neutral-800 dark:bg-neutral-900"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <span className="text-body-sm font-medium text-neutral-500 dark:text-neutral-400">
                  {item.title}
                </span>
                <div
                  className={`flex size-9 items-center justify-center rounded-lg border ${item.iconWrapper}`}
                >
                  <Icon className="size-4.5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                  {item.value}
                </div>
                <p className="text-caption mt-1 text-neutral-500 dark:text-neutral-400">
                  {item.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Overview Panel */}
      <Card className="border-neutral-200 bg-white shadow-2xs dark:border-neutral-800 dark:bg-neutral-900">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Lối tắt thao tác nhanh
              </CardTitle>
              <Badge className="border-primary-200 bg-primary-100 text-primary-700 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-300">
                Nổi bật
              </Badge>
            </div>
            <CardDescription className="mt-1 text-neutral-500 dark:text-neutral-400">
              Truy cập nhanh các phân hệ nghiệp vụ chính của nền tảng đào tạo.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/admin/exams"
              className="group hover:border-primary-300 hover:bg-primary-50/50 dark:hover:border-primary-700 dark:hover:bg-primary-950/30 flex flex-col justify-between rounded-xl border border-neutral-200 p-4 transition-all dark:border-neutral-800"
            >
              <div>
                <div className="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 mb-3 flex size-8 items-center justify-center rounded-lg">
                  <FileQuestion className="size-4" />
                </div>
                <h4 className="group-hover:text-primary-700 dark:group-hover:text-primary-300 text-sm font-semibold text-neutral-900 transition-colors dark:text-neutral-100">
                  Ngân hàng đề thi
                </h4>
                <p className="text-caption mt-1 text-neutral-500 dark:text-neutral-400">
                  Biên tập câu hỏi Hóa học, công thức LaTeX và đề thi thử V-SAT.
                </p>
              </div>
              <div className="text-primary-700 dark:text-primary-400 mt-4 flex items-center gap-1 text-xs font-semibold">
                <span>Vào quản lý</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link
              href="/admin/users"
              className="group hover:border-primary-300 hover:bg-primary-50/50 dark:hover:border-primary-700 dark:hover:bg-primary-950/30 flex flex-col justify-between rounded-xl border border-neutral-200 p-4 transition-all dark:border-neutral-800"
            >
              <div>
                <div className="bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300 mb-3 flex size-8 items-center justify-center rounded-lg">
                  <Users className="size-4" />
                </div>
                <h4 className="group-hover:text-primary-700 dark:group-hover:text-primary-300 text-sm font-semibold text-neutral-900 transition-colors dark:text-neutral-100">
                  Danh sách người dùng
                </h4>
                <p className="text-caption mt-1 text-neutral-500 dark:text-neutral-400">
                  Tra cứu hồ sơ học viên, giáo viên và phân quyền vai trò.
                </p>
              </div>
              <div className="text-primary-700 dark:text-primary-400 mt-4 flex items-center gap-1 text-xs font-semibold">
                <span>Vào quản lý</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 dark:border-neutral-800 dark:bg-neutral-900/60">
              <div>
                <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                  <Sparkles className="size-4" />
                </div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Học Hóa – Luyện Thi V-SAT
                </h4>
                <p className="text-caption mt-1 text-neutral-500 dark:text-neutral-400">
                  Xem giao diện học tập công khai dành cho học viên.
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                <Link href="/">Mở trang chủ</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
