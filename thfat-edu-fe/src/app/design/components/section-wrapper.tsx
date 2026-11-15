import { Separator } from "@/components/ui/separator";
import type { ReactNode } from "react";

export type TSectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

export function Section({ id, title, children }: TSectionProps) {
  return (
    <section id={id} className="scroll-mt-8 space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-h2 text-neutral-900">{title}</h2>
        <Separator className="flex-1" />
      </div>
      {children}
    </section>
  );
}

export type TDemoProps = {
  label: string;
  children: ReactNode;
};

export function Demo({ label, children }: TDemoProps) {
  return (
    <div className="space-y-3">
      <p className="text-label text-neutral-500">{label}</p>
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">{children}</div>
    </div>
  );
}
