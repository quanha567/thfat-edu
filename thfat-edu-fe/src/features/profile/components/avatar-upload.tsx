"use client";

import { Button } from "@/components/ui/button";
import { useUploadAvatar } from "@/hooks/use-upload";
import { Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

export type TAvatarUploadProps = {
  currentAvatarUrl: string | null;
  userInitials: string;
  onUploadSuccess: (url: string) => void;
};

export function AvatarUpload({
  currentAvatarUrl,
  userInitials,
  onUploadSuccess,
}: TAvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadAvatar = useUploadAvatar({
    onSuccess: (result) => {
      onUploadSuccess(result.url);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    uploadAvatar.mutate(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative inline-block">
      <div className="border-border bg-muted size-20 overflow-hidden rounded-full border-2">
        {currentAvatarUrl ? (
          <Image
            src={currentAvatarUrl}
            alt="Avatar"
            width={80}
            height={80}
            className="size-full object-cover"
          />
        ) : (
          <div className="text-muted-foreground flex size-full items-center justify-center text-xl font-semibold">
            {userInitials}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      <Button
        type="button"
        size="icon"
        variant="secondary"
        className="border-background absolute -right-1 -bottom-1 size-7 rounded-full border-2 shadow-sm"
        disabled={uploadAvatar.isPending}
        onClick={() => fileInputRef.current?.click()}
        title="Thay đổi ảnh đại diện"
      >
        {uploadAvatar.isPending ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Camera className="size-3.5" />
        )}
      </Button>
    </div>
  );
}
