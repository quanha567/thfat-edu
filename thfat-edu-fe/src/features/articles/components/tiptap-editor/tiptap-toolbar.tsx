"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from "lucide-react";
import { useState } from "react";

export type TTiptapToolbarProps = {
  editor: Editor | null;
};

export function TiptapToolbar({ editor }: TTiptapToolbarProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  if (!editor) return null;

  const handleSetLink = () => {
    if (!linkUrl.trim()) {
      editor.chain().focus().unsetLink().run();
      setIsLinkOpen(false);

      return;
    }
    const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
    editor.chain().focus().setLink({ href: url }).run();
    setLinkUrl("");
    setIsLinkOpen(false);
  };

  const handleSetImage = () => {
    if (imageUrl.trim()) {
      editor.chain().focus().setImage({ src: imageUrl.trim() }).run();
      setImageUrl("");
      setIsImageOpen(false);
    }
  };

  return (
    <div className="border-border/80 bg-muted/30 flex flex-wrap items-center gap-0.5 border-b p-1.5">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={`size-8 ${editor.isActive("bold") ? "bg-muted font-bold text-foreground" : "text-muted-foreground"}`}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="In đậm (Ctrl+B)"
      >
        <Bold className="size-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={`size-8 ${editor.isActive("italic") ? "bg-muted font-bold text-foreground" : "text-muted-foreground"}`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="In nghiêng (Ctrl+I)"
      >
        <Italic className="size-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={`size-8 ${editor.isActive("strike") ? "bg-muted font-bold text-foreground" : "text-muted-foreground"}`}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Gạch ngang"
      >
        <Strikethrough className="size-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-5" />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={`size-8 ${editor.isActive("heading", { level: 1 }) ? "bg-muted font-bold text-foreground" : "text-muted-foreground"}`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        title="Tiêu đề 1"
      >
        <Heading1 className="size-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={`size-8 ${editor.isActive("heading", { level: 2 }) ? "bg-muted font-bold text-foreground" : "text-muted-foreground"}`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Tiêu đề 2"
      >
        <Heading2 className="size-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={`size-8 ${editor.isActive("heading", { level: 3 }) ? "bg-muted font-bold text-foreground" : "text-muted-foreground"}`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        title="Tiêu đề 3"
      >
        <Heading3 className="size-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-5" />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={`size-8 ${editor.isActive("bulletList") ? "bg-muted font-bold text-foreground" : "text-muted-foreground"}`}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Danh sách dấu chấm"
      >
        <List className="size-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={`size-8 ${editor.isActive("orderedList") ? "bg-muted font-bold text-foreground" : "text-muted-foreground"}`}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Danh sách số"
      >
        <ListOrdered className="size-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={`size-8 ${editor.isActive("blockquote") ? "bg-muted font-bold text-foreground" : "text-muted-foreground"}`}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Trích dẫn"
      >
        <Quote className="size-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={`size-8 ${editor.isActive("codeBlock") ? "bg-muted font-bold text-foreground" : "text-muted-foreground"}`}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        title="Khối mã (Code block)"
      >
        <Code className="size-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-muted-foreground size-8"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Đường kẻ ngang"
      >
        <Minus className="size-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-5" />

      {/* Insert Link Popover */}
      <Popover open={isLinkOpen} onOpenChange={setIsLinkOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`size-8 ${editor.isActive("link") ? "bg-muted font-bold text-foreground" : "text-muted-foreground"}`}
            title="Chèn liên kết"
          >
            <LinkIcon className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3" align="start">
          <div className="space-y-2">
            <span className="text-xs font-semibold">Chèn liên kết URL</span>
            <div className="flex gap-2">
              <Input
                placeholder="https://..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="h-8 text-xs"
                onKeyDown={(e) => e.key === "Enter" && handleSetLink()}
              />
              <Button size="sm" className="h-8 px-2.5 text-xs" onClick={handleSetLink}>
                Áp dụng
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Insert Image Popover */}
      <Popover open={isImageOpen} onOpenChange={setIsImageOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground size-8"
            title="Chèn ảnh qua URL"
          >
            <ImageIcon className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3" align="start">
          <div className="space-y-2">
            <span className="text-xs font-semibold">Nhập đường dẫn hình ảnh (URL)</span>
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="h-8 text-xs"
                onKeyDown={(e) => e.key === "Enter" && handleSetImage()}
              />
              <Button size="sm" className="h-8 px-2.5 text-xs" onClick={handleSetImage}>
                Chèn
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <div className="ml-auto flex items-center gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-muted-foreground size-8"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
          title="Hoàn tác (Ctrl+Z)"
        >
          <Undo className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-muted-foreground size-8"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
          title="Làm lại (Ctrl+Y)"
        >
          <Redo className="size-4" />
        </Button>
      </div>
    </div>
  );
}
