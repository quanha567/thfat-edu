"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Nullable } from "@thfat-edu/shared";
import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";

import { DEFAULT_INVITE_CODE_EXPIRES_IN_DAYS, MAX_INVITE_CODE_BATCH_SIZE } from "../constants";
import { useCreateInviteCodes } from "../hooks/use-invite-code-mutations";
import { type TInviteCode } from "../types";
import { CreatedCodesResult } from "./created-codes-result";

export type TCreateInviteCodesDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CreateInviteCodesDialog({ isOpen, onClose }: TCreateInviteCodesDialogProps) {
  const [count, setCount] = useState("10");
  const [note, setNote] = useState("");
  const [expiresInDays, setExpiresInDays] = useState(String(DEFAULT_INVITE_CODE_EXPIRES_IN_DAYS));
  const [created, setCreated] = useState<Nullable<TInviteCode[]>>(null);

  const createMutation = useCreateInviteCodes();

  const countValue = Number(count);
  const daysValue = Number(expiresInDays);
  const isCountValid =
    Number.isInteger(countValue) && countValue >= 1 && countValue <= MAX_INVITE_CODE_BATCH_SIZE;
  const isDaysValid = Number.isInteger(daysValue) && daysValue >= 1 && daysValue <= 365;

  function handleClose() {
    setCreated(null);
    createMutation.reset();
    onClose();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!isCountValid || !isDaysValid) return;

    const result = await createMutation.mutateAsync({
      count: countValue,
      note: note.trim() || null,
      expiresInDays: daysValue,
    });

    setCreated(result.items);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{created ? "Đã tạo mã mời" : "Tạo mã mời"}</DialogTitle>
          <DialogDescription>
            {created
              ? `${created.length} link mời đã sẵn sàng để gửi cho học sinh.`
              : "Mỗi mã dùng một lần và chỉ tạo tài khoản học sinh."}
          </DialogDescription>
        </DialogHeader>

        {created ? (
          <CreatedCodesResult items={created} onDone={handleClose} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="invite-count">Số lượng mã</Label>
                <Input
                  id="invite-count"
                  type="number"
                  min={1}
                  max={MAX_INVITE_CODE_BATCH_SIZE}
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                />
                {!isCountValid && (
                  <p className="text-destructive text-xs">
                    Nhập số nguyên từ 1 đến {MAX_INVITE_CODE_BATCH_SIZE}.
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="invite-days">Hiệu lực (ngày)</Label>
                <Input
                  id="invite-days"
                  type="number"
                  min={1}
                  max={365}
                  value={expiresInDays}
                  onChange={(e) => setExpiresInDays(e.target.value)}
                />
                {!isDaysValid && (
                  <p className="text-destructive text-xs">Nhập số nguyên từ 1 đến 365.</p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invite-note">Ghi chú chung (tùy chọn)</Label>
              <Input
                id="invite-note"
                maxLength={255}
                placeholder="Ví dụ: Lớp 12A1"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={!isCountValid || !isDaysValid || createMutation.isPending}
                className="gap-1.5"
              >
                {createMutation.isPending && <Loader2 className="size-4 animate-spin" />}
                <span>Tạo mã</span>
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
