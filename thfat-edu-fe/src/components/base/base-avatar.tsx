"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "cn";
import { type ReactNode } from "react";

export type TBaseAvatarSize = "sm" | "default" | "md" | "lg" | "xl";

export type TBaseAvatarProps = {
  src?: string | null;
  alt?: string;
  name?: string;
  fallback?: ReactNode;
  size?: TBaseAvatarSize;
  className?: string;
  fallbackClassName?: string;
};

const SIZE_CLASSES: Record<TBaseAvatarSize, string> = {
  sm: "h-6 w-6 text-xs",
  default: "h-8 w-8 text-xs",
  md: "h-9 w-9 text-xs",
  lg: "h-10 w-10 text-sm",
  xl: "h-12 w-12 text-base",
};

function getInitials(name?: string, defaultFallback = "TF"): string {
  if (!name || !name.trim()) return defaultFallback;

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  const first = parts[0][0];
  const last = parts[parts.length - 1][0];

  return `${first}${last}`.toUpperCase();
}

export function BaseAvatar({
  src,
  alt,
  name,
  fallback,
  size = "default",
  className,
  fallbackClassName,
}: TBaseAvatarProps) {
  const resolvedFallback = fallback ?? getInitials(name);
  const sizeClass = SIZE_CLASSES[size];

  return (
    <Avatar className={cn(sizeClass, className)}>
      {src && <AvatarImage src={src} alt={alt || name || "Avatar"} />}
      <AvatarFallback
        className={cn("bg-primary text-primary-foreground font-bold", fallbackClassName)}
      >
        {resolvedFallback}
      </AvatarFallback>
    </Avatar>
  );
}
