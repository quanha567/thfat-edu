"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "cn";
import { type ReactNode } from "react";

export type TBaseAvatarSize = "sm" | "default" | "md" | "lg" | "xl";

export type TBaseAvatarProps = {
  src?: string | null;
  alt?: string;
  name?: string;
  gender?: "male" | "female" | "other" | null;
  useDefaultAvatar?: boolean;
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

// Decorative per-user colour: every gradient stays inside the brand palette.
export const AVATAR_GRADIENTS = [
  "from-primary-600 via-primary-500 to-primary-700",
  "from-success-500 via-success-600 to-info-600",
  "from-gold-500 via-gold-600 to-gold-700",
  "from-primary-700 via-primary-600 to-info-600",
  "from-cyan-500 via-primary-600 to-primary-800",
  "from-gold-400 via-gold-500 to-primary-600",
  "from-primary-500 via-primary-700 to-primary-900",
  "from-info-500 via-info-600 to-primary-700",
] as const;

export const DEFAULT_BOY_AVATARS = [
  "/images/avatars/avatar-boy-1.jpg",
  "/images/avatars/avatar-boy-2.jpg",
] as const;

export const DEFAULT_GIRL_AVATARS = [
  "/images/avatars/avatar-girl-1.jpg",
  "/images/avatars/avatar-girl-2.jpg",
] as const;

export const DEFAULT_AVATARS = [...DEFAULT_BOY_AVATARS, ...DEFAULT_GIRL_AVATARS] as const;

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }

  return hash;
}

export function getDefaultAvatar(
  name?: string,
  gender?: "male" | "female" | "other" | null,
): string | null {
  if (gender === "male") {
    const hash = hashString(name ?? "boy");

    return DEFAULT_BOY_AVATARS[Math.abs(hash) % DEFAULT_BOY_AVATARS.length];
  }

  if (gender === "female") {
    const hash = hashString(name ?? "girl");

    return DEFAULT_GIRL_AVATARS[Math.abs(hash) % DEFAULT_GIRL_AVATARS.length];
  }

  return null;
}

export function getAvatarGradient(name?: string): string {
  if (!name || !name.trim()) {
    return AVATAR_GRADIENTS[0];
  }

  const hash = hashString(name);
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
  gender,
  useDefaultAvatar = true,
  fallback,
  size = "default",
  className,
  fallbackClassName,
}: TBaseAvatarProps) {
  const resolvedSrc = src || (useDefaultAvatar ? getDefaultAvatar(name, gender) : undefined);
  const resolvedFallback = fallback ?? getInitials(name);
  const sizeClass = SIZE_CLASSES[size];
  const gradient = getAvatarGradient(name);

  return (
    <Avatar className={cn(sizeClass, className)}>
      {resolvedSrc && <AvatarImage src={resolvedSrc} alt={alt || name || "Avatar"} />}
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
