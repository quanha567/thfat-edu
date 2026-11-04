import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">ThFat Edu</h1>
        <p className="text-muted-foreground text-sm">
          Cổng thi thử & kiểm tra trực tuyến chuyên sâu môn Hóa học (Computer-Based Testing).
        </p>
        <div className="pt-4">
          <Button asChild>
            <Link href="/design">Xem Design System</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
