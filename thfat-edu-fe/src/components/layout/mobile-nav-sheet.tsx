"use client";

import { BaseAvatar } from "@/components/base";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useArticles } from "@/features/articles/hooks/use-articles";
import { useAuthUser } from "@/features/auth/hooks/use-auth-user";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { HOME_NAV_LINKS } from "@/features/home/constants/home.data";
import { ArrowRight, ChevronDown, LogOut, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useImperativeHandle, useState, type Ref } from "react";

export type TMobileNavHandle = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
};

type TMobileNavSheetProps = {
  ref?: Ref<TMobileNavHandle>;
};

export function MobileNavSheet({ ref }: TMobileNavSheetProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [resourcesExpanded, setResourcesExpanded] = useState(false);
  const { data: user } = useAuthUser();
  const logoutMutation = useLogout();

  const { data: articlesData } = useArticles({
    query: { page: 1, limit: 5 },
    isAdmin: false,
  });
  const latestArticles = articlesData?.items ?? [];

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen((prev) => !prev),
    isOpen: () => open,
  }));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="bg-primary-950 flex w-72 flex-col justify-between border-white/10 p-6 text-white"
      >
        <div>
          <SheetHeader className="mb-6 text-left">
            <SheetTitle className="text-h3 font-bold text-white">ThFat Edu</SheetTitle>
          </SheetHeader>

          {/* User Profile Card on Mobile */}
          {user && (
            <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-3">
                <div className="ring-primary-400/40 ring-offset-primary-950 relative rounded-full ring-2 ring-offset-1">
                  <BaseAvatar
                    src={user.avatarUrl}
                    name={user.fullName ?? undefined}
                    gender={user.gender}
                    size="md"
                    fallbackClassName="bg-gradient-to-tr from-primary-600 to-primary-400 text-white font-bold text-xs"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="truncate text-sm font-semibold text-white">
                    {user.fullName || "Học viên"}
                  </p>
                  <p className="text-primary-200/70 truncate text-xs">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          <nav className="flex flex-col gap-2">
            {HOME_NAV_LINKS.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);

              if (item.href === "/articles" || item.isResourceDropdown) {
                return (
                  <div key={item.label} className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => setResourcesExpanded((prev) => !prev)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-white/15 font-semibold text-white"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          resourcesExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {resourcesExpanded && (
                      <div className="ml-3 flex flex-col gap-1.5 border-l border-white/15 pt-1 pl-3">
                        {latestArticles.length === 0 ? (
                          <span className="py-1 text-xs text-white/50">Chưa có bài viết nào</span>
                        ) : (
                          latestArticles.slice(0, 5).map((article) => (
                            <Link
                              key={article.id}
                              href={`/articles/${article.slug}`}
                              onClick={() => setOpen(false)}
                              className="line-clamp-1 py-1 text-xs text-white/80 transition-colors hover:text-white"
                            >
                              {article.title}
                            </Link>
                          ))
                        )}

                        <Link
                          href="/articles"
                          onClick={() => setOpen(false)}
                          className="text-primary-300 flex items-center gap-1 pt-1 text-xs font-semibold hover:text-white"
                        >
                          <span>Xem tất cả bài viết</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white/15 font-semibold text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {user?.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ShieldCheck className="h-4 w-4 text-white/60" />
                <span>Quản trị hệ thống</span>
              </Link>
            )}
          </nav>
        </div>

        <div>
          <Separator className="my-4 bg-white/10" />

          {user ? (
            <Button
              variant="outline"
              onClick={() => {
                logoutMutation.mutate();
                setOpen(false);
              }}
              className="border-error-500/30 text-error-400 hover:bg-error-500/10 flex w-full items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </Button>
          ) : (
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary-800 w-full"
            >
              <Link href="/login" onClick={() => setOpen(false)}>
                Đăng nhập
              </Link>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
