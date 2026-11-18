"use client";

import { preprocessChemContent } from "@/components/chemistry/chem-renderer";
import { cn } from "@/lib/utils";
import Markdown, { type Components } from "react-markdown";
import rehypeKatex from "rehype-katex";
import "katex/contrib/mhchem";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

export type TArticleMarkdownRendererProps = {
  content: string;
  className?: string;
};

const ARTICLE_MARKDOWN_COMPONENTS: Components = {
  h1: ({ children }) => (
    <h1 className="text-foreground mt-8 mb-4 text-2xl font-black tracking-tight sm:text-3xl">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="border-border text-foreground mt-6 mb-3 border-b pb-2 text-xl font-bold tracking-tight sm:text-2xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-foreground mt-5 mb-2 text-lg font-bold sm:text-xl">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-foreground/90 my-3 text-base leading-relaxed">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="text-foreground/90 my-3 list-disc space-y-1.5 pl-6">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="text-foreground/90 my-3 list-decimal space-y-1.5 pl-6">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-primary bg-primary/5 text-muted-foreground my-4 border-l-4 px-4 py-2.5 italic">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    const isInline = !className?.includes("language-");
    if (isInline) {
      return (
        <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs sm:text-sm">
          {children}
        </code>
      );
    }

    return (
      <div className="border-border bg-muted/70 my-4 overflow-x-auto rounded-xl border p-4">
        <code className="text-foreground font-mono text-xs sm:text-sm">{children}</code>
      </div>
    );
  },
  table: ({ children }) => (
    <div className="border-border my-4 overflow-x-auto rounded-xl border shadow-xs">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-border bg-muted/80 border-b font-semibold">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-border bg-background divide-y">{children}</tbody>
  ),
  tr: ({ children }) => <tr className="hover:bg-muted/40 transition-colors">{children}</tr>,
  th: ({ children }) => (
    <th className="border-border text-foreground border-r px-4 py-2.5 font-semibold last:border-r-0">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-border text-foreground border-r px-4 py-2.5 last:border-r-0">
      {children}
    </td>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-primary underline underline-offset-4 hover:opacity-80"
    >
      {children}
    </a>
  ),
};

export function ArticleMarkdownRenderer({ content, className }: TArticleMarkdownRendererProps) {
  const processed = preprocessChemContent(content);

  return (
    <div className={cn("article-markdown max-w-none leading-relaxed", className)}>
      <Markdown
        remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
        rehypePlugins={[[rehypeKatex, { throwOnError: false }]]}
        components={ARTICLE_MARKDOWN_COMPONENTS}
      >
        {processed}
      </Markdown>
    </div>
  );
}
