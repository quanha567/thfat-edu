import { MainFooter, MainNavbar } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

import { NotFoundGoBackButton } from "./not-found.client";

export default function NotFound() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <MainNavbar />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <span className="text-primary-700 dark:text-primary-400 text-7xl font-bold tracking-tight sm:text-8xl">
          404
        </span>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-50">
          Không tìm thấy trang
        </h1>

        <p className="text-body mt-2 max-w-md text-neutral-600 dark:text-neutral-400">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được chuyển sang địa chỉ khác.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="size-4" />
              <span>Về trang chủ</span>
            </Link>
          </Button>

          <NotFoundGoBackButton />
        </div>
      </main>

      <MainFooter />
    </div>
  );
}
