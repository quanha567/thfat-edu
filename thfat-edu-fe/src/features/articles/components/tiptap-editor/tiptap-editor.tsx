"use client";

import { Image as TiptapImage } from "@tiptap/extension-image";
import { Link as TiptapLink } from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useEffect } from "react";

import { TiptapToolbar } from "./tiptap-toolbar";

export type TTiptapEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
};

export function TiptapEditor({
  value,
  onChange,
  className = "",
  editable = true,
}: TTiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    editable,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary-600 dark:text-primary-400 underline underline-offset-2",
        },
      }),
      TiptapImage.configure({
        inline: true,
        HTMLAttributes: {
          class: "rounded-lg max-w-full my-4 shadow-2xs mx-auto",
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base dark:prose-invert max-w-none min-h-[360px] p-4 sm:p-6 focus:outline-none focus-visible:outline-none",
      },
    },
    onUpdate: ({ editor: activeEditor }) => {
      onChange(activeEditor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  return (
    <div
      className={`border-border/80 bg-card focus-within:ring-primary-500/20 focus-within:border-primary-500 flex flex-col overflow-hidden rounded-xl border shadow-2xs transition-all focus-within:ring-2 ${className}`}
    >
      {editable && <TiptapToolbar editor={editor} />}
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
