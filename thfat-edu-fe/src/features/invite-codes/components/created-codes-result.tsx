"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { buildInviteLink } from "../invite-link";
import { type TInviteCode } from "../types";

export type TCreatedCodesResultProps = {
  items: TInviteCode[];
  onDone: () => void;
};

export function CreatedCodesResult({ items, onDone }: TCreatedCodesResultProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const links = items.map((item) => buildInviteLink(item.code)).join("\n");

  async function handleCopyAll() {
    await navigator.clipboard.writeText(links);
    setHasCopied(true);
    toast.success("Đã sao chép toàn bộ link mời");
    setTimeout(() => setHasCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        Mỗi link chỉ dùng được một lần. Bạn vẫn xem lại được link của mã chưa dùng trong danh sách.
      </p>
      <Textarea
        readOnly
        value={links}
        rows={Math.min(items.length, 8)}
        className="font-mono text-xs"
        onFocus={(e) => e.currentTarget.select()}
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onDone}>
          Đóng
        </Button>
        <Button type="button" onClick={handleCopyAll} className="gap-1.5">
          {hasCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
          <span>Sao chép tất cả link</span>
        </Button>
      </div>
    </div>
  );
}
