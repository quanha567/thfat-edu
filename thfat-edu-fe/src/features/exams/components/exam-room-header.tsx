"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Clock, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type TExamRoomHeaderProps = {
  title: string;
  initialRemainingSeconds: number;
  onTimeout: () => void;
  onSubmitClick: () => void;
  onBack?: () => void;
  isSubmitting?: boolean;
};

function getTimerClassName(isLowTime: boolean, isMediumTime: boolean): string {
  if (isLowTime) {
    return "bg-red-50 text-red-600 animate-pulse border border-red-200";
  }

  if (isMediumTime) {
    return "bg-amber-50 text-amber-600 border border-amber-200";
  }

  return "bg-neutral-100 text-neutral-800";
}

export function ExamRoomHeader({
  title,
  initialRemainingSeconds,
  onTimeout,
  onSubmitClick,
  onBack,
  isSubmitting = false,
}: TExamRoomHeaderProps) {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(initialRemainingSeconds);
  const [isBackDialogOpen, setIsBackDialogOpen] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeout();

      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeout();

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, onTimeout]);

  const handleConfirmBack = () => {
    setIsBackDialogOpen(false);
    if (onBack) {
      onBack();
    } else {
      router.push("/exams");
    }
  };

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const formattedTime = `${hours > 0 ? `${hours}:` : ""}${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;

  const isLowTime = secondsLeft <= 300; // < 5 minutes
  const isMediumTime = secondsLeft <= 600 && !isLowTime; // < 10 minutes

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/95 shadow-xs backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-3 py-4 sm:px-6">
          <div className="flex items-center gap-2 overflow-hidden sm:gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsBackDialogOpen(true)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <h1 className="truncate text-sm font-bold text-neutral-900 sm:text-base md:text-lg">
              {title}
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-2.5 sm:gap-4">
            <div
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold tracking-wider transition-colors sm:gap-2 sm:px-3.5 sm:text-sm ${getTimerClassName(
                isLowTime,
                isMediumTime,
              )}`}
            >
              {isLowTime ? (
                <AlertCircle className="h-4 w-4 text-red-600" />
              ) : (
                <Clock className="h-4 w-4 text-neutral-500" />
              )}
              <span>{formattedTime}</span>
            </div>

            <Button
              onClick={onSubmitClick}
              disabled={isSubmitting}
              className="bg-primary-700 hover:bg-primary-800 gap-2 font-semibold"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Nộp bài</span>
            </Button>
          </div>
        </div>
      </header>

      <AlertDialog open={isBackDialogOpen} onOpenChange={setIsBackDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rời phòng thi?</AlertDialogTitle>
            <AlertDialogDescription className="leading-relaxed">
              Các câu trả lời của bạn đã được hệ thống tự động lưu. Thời gian làm bài vẫn tiếp tục
              đếm ngược. Bạn có thể quay lại phòng thi bất cứ lúc nào trước khi hết giờ.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tiếp tục làm bài</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmBack}
              className="bg-neutral-800 hover:bg-neutral-900"
            >
              Rời phòng thi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
