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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Nullable } from "@thfat-edu/shared";
import { Check, Copy, KeyRound, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useResetPasswordUser } from "../hooks/use-user-mutations";
import { type TUser } from "../types";

export type TResetPasswordModalProps = {
  user: Nullable<TUser>;
  isOpen: boolean;
  onClose: () => void;
};

function generateRandomPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$";
  let pass = "";
  for (let i = 0; i < 10; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `${pass}1A@`;
}

export function ResetPasswordModal({ user, isOpen, onClose }: TResetPasswordModalProps) {
  const [activeTab, setActiveTab] = useState<"manual" | "link">("manual");
  const [newPassword, setNewPassword] = useState("");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  const resetMutation = useResetPasswordUser();

  if (!user) return null;

  const handleGeneratePassword = () => {
    const pass = generateRandomPassword();
    setNewPassword(pass);
  };

  const handleCopyLink = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setHasCopied(true);
    toast.success("Đã sao chép liên kết vào bộ nhớ tạm");
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleSubmitManual = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");

      return;
    }

    await resetMutation.mutateAsync({
      id: user.id,
      data: { newPassword },
    });
    setNewPassword("");
    onClose();
  };

  const handleGenerateLink = async () => {
    const res = await resetMutation.mutateAsync({
      id: user.id,
      data: { sendResetEmail: true },
    });
    if (res.resetLink) {
      setGeneratedLink(res.resetLink);
    }
  };

  const handleClose = () => {
    setNewPassword("");
    setGeneratedLink(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <KeyRound className="text-primary h-5 w-5" />
            <DialogTitle>Đặt lại mật khẩu</DialogTitle>
          </div>
          <DialogDescription>
            Tài khoản: <strong className="text-foreground">{user.fullName}</strong> ({user.email})
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "manual" | "link")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Mật khẩu mới</TabsTrigger>
            <TabsTrigger value="link">Liên kết gửi Email</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4 pt-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="new-password">Nhập mật khẩu mới</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleGeneratePassword}
                  className="text-primary h-7 gap-1 px-2 text-xs"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Tự sinh
                </Button>
              </div>
              <Input
                id="new-password"
                type="text"
                placeholder="Ít nhất 6 ký tự..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <DialogFooter className="pt-2">
              <Button variant="outline" onClick={handleClose} disabled={resetMutation.isPending}>
                Hủy
              </Button>
              <Button
                onClick={handleSubmitManual}
                disabled={resetMutation.isPending || newPassword.length < 6}
              >
                {resetMutation.isPending ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="link" className="space-y-4 pt-3">
            <p className="text-muted-foreground text-xs leading-relaxed">
              Tạo liên kết đặt lại mật khẩu của Firebase để gửi riêng cho người dùng tự thiết lập
              mật khẩu mới an toàn.
            </p>

            {generatedLink ? (
              <div className="space-y-2">
                <Label className="text-xs">Liên kết reset mật khẩu:</Label>
                <div className="flex items-center gap-2">
                  <Input readOnly value={generatedLink} className="font-mono text-xs" />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleCopyLink}
                    className="shrink-0"
                  >
                    {hasCopied ? (
                      <Check className="text-success-600 h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                className="w-full"
                variant="outline"
                onClick={handleGenerateLink}
                disabled={resetMutation.isPending}
              >
                {resetMutation.isPending ? "Đang khởi tạo..." : "Tạo liên kết ngay"}
              </Button>
            )}

            <DialogFooter className="pt-2">
              <Button variant="outline" onClick={handleClose}>
                Đóng
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
