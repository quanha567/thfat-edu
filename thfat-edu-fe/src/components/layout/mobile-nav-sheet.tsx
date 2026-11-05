"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAuthUser } from "@/features/auth/hooks/use-auth-user";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { HOME_NAV_LINKS } from "@/features/home/constants/home.data";
import Link from "next/link";
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
  const [open, setOpen] = useState(false);
  const { data: user } = useAuthUser();
  const logoutMutation = useLogout();

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen((prev) => !prev),
    isOpen: () => open,
  }));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="bg-primary-950 w-72 border-white/10 p-6 text-white">
        <SheetHeader className="mb-6 text-left">
          <SheetTitle className="text-h3 font-bold text-white">ThFat Edu</SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-3">
          {HOME_NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                item.active
                  ? "bg-white/15 font-semibold text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <Separator className="my-4 bg-white/10" />

          <div>
            {user ? (
              <Button
                variant="outline"
                onClick={() => {
                  logoutMutation.mutate();
                  setOpen(false);
                }}
                className="border-error-500/30 text-error-400 hover:bg-error-500/10 w-full"
              >
                Đăng xuất
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
        </nav>
      </SheetContent>
    </Sheet>
  );
}
