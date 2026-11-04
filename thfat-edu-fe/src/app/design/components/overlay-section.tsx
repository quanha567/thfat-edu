"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { Demo, Section } from "./section-wrapper";

export function OverlaySection() {
  return (
    <Section id="overlays" title="Overlays">
      <Demo label="Tooltip">
        <div className="flex flex-wrap gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover để xem tooltip</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Đây là tooltip hướng dẫn người dùng</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </Demo>

      <Demo label="Dialog">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Mở dialog xác nhận</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận nộp bài</DialogTitle>
              <DialogDescription>
                Bạn có chắc muốn nộp bài? Còn 3 câu chưa trả lời. Sau khi nộp bạn không thể sửa đáp
                án.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline">Quay lại</Button>
              <Button>Nộp bài</Button>
            </div>
          </DialogContent>
        </Dialog>
      </Demo>
    </Section>
  );
}
