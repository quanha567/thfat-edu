"use client";

import { Button } from "@/components/ui/button";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Sigma,
  Table as TableIcon,
} from "lucide-react";

export type TMarkdownToolbarProps = {
  onInsert: (prefix: string, suffix?: string, defaultText?: string) => void;
  disabled?: boolean;
};

export function MarkdownToolbar({ onInsert, disabled = false }: TMarkdownToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/30 p-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={() => onInsert("## ", "", "Tiêu đề mục")}
        title="Tiêu đề H2"
        className="h-8 px-2"
      >
        <Heading2 className="size-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={() => onInsert("### ", "", "Tiêu đề phụ")}
        title="Tiêu đề H3"
        className="h-8 px-2"
      >
        <Heading3 className="size-4" />
      </Button>

      <div className="mx-1 h-4 w-px bg-border" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={() => onInsert("**", "**", "chữ đậm")}
        title="In đậm"
        className="h-8 px-2"
      >
        <Bold className="size-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={() => onInsert("*", "*", "chữ nghiêng")}
        title="In nghiêng"
        className="h-8 px-2"
      >
        <Italic className="size-4" />
      </Button>

      <div className="mx-1 h-4 w-px bg-border" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={() => onInsert("$", "$", "\\ce{H2SO4}")}
        title="Công thức KaTeX nội dòng"
        className="h-8 gap-1 px-2 text-xs font-semibold text-primary"
      >
        <Sigma className="size-3.5" />
        <span>Inline</span>
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={() => onInsert("\n$$\n", "\n$$\n", "\\Delta = b^2 - 4ac")}
        title="Khối công thức KaTeX"
        className="h-8 gap-1 px-2 text-xs font-semibold text-primary"
      >
        <Sigma className="size-3.5" />
        <span>Block</span>
      </Button>

      <div className="mx-1 h-4 w-px bg-border" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={() => onInsert("- ", "", "Mục danh sách")}
        title="Danh sách gạch đầu dòng"
        className="h-8 px-2"
      >
        <List className="size-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={() => onInsert("1. ", "", "Mục thứ nhất")}
        title="Danh sách đánh số"
        className="h-8 px-2"
      >
        <ListOrdered className="size-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={() => onInsert("> ", "", "Đoạn trích dẫn hoặc lưu ý")}
        title="Trích dẫn"
        className="h-8 px-2"
      >
        <Quote className="size-4" />
      </Button>

      <div className="mx-1 h-4 w-px bg-border" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={() => onInsert("`", "`", "code")}
        title="Mã nguồn inline"
        className="h-8 px-2"
      >
        <Code className="size-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={() =>
          onInsert("\n| Cột 1 | Cột 2 |\n| :--- | :--- |\n| ", " | Dữ liệu |\n", "Dữ liệu")
        }
        title="Chèn bảng"
        className="h-8 px-2"
      >
        <TableIcon className="size-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={() => onInsert("[", "](https://example.com)", "văn bản liên kết")}
        title="Chèn liên kết"
        className="h-8 px-2"
      >
        <LinkIcon className="size-4" />
      </Button>
    </div>
  );
}
