"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function NotFoundGoBackButton() {
  const router = useRouter();

  function handleGoBack() {
    router.back();
  }

  return (
    <Button variant="outline" size="lg" onClick={handleGoBack} className="gap-2">
      <ArrowLeft className="size-4" />
      <span>Quay lại trang trước</span>
    </Button>
  );
}
