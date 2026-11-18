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

export const AVATAR_GRADIENTS = [
  "from-blue-600 via-indigo-600 to-blue-700",
  "from-emerald-500 via-teal-600 to-cyan-700",
  "from-amber-500 via-orange-500 to-rose-600",
  "from-purple-600 via-violet-600 to-indigo-700",
  "from-cyan-500 via-blue-600 to-indigo-700",
  "from-rose-500 via-pink-600 to-purple-600",
  "from-indigo-600 via-blue-700 to-purple-800",
  "from-teal-500 via-emerald-600 to-teal-700",
] as const;

export function getAvatarGradient(name?: string): string {
  if (!name || !name.trim()) {
    return AVATAR_GRADIENTS[0];
  }

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }

  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;

  return AVATAR_GRADIENTS[index];
}

export function getInitials(name?: string, defaultFallback = "TF"): string {
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
  const gradient = getAvatarGradient(name);

  return (
    <Avatar className={cn(sizeClass, className)}>
      {src && <AvatarImage src={src} alt={alt || name || "Avatar"} />}
      <AvatarFallback
        className={cn(
          "bg-gradient-to-br text-white font-extrabold shadow-inner ring-1 ring-white/20 select-none",
          gradient,
          fallbackClassName,
        )}
      >
        {resolvedFallback}
      </AvatarFallback>
    </Avatar>
  );
}
