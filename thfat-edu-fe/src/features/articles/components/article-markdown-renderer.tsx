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
    <h1 className="mt-8 mb-4 font-black tracking-tight text-foreground text-2xl sm:text-3xl">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-6 mb-3 border-b border-border pb-2 font-bold tracking-tight text-foreground text-xl sm:text-2xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-5 mb-2 font-bold text-foreground text-lg sm:text-xl">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="my-3 leading-relaxed text-foreground/90 text-base">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="my-3 list-disc space-y-1.5 pl-6 text-foreground/90">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-3 list-decimal space-y-1.5 pl-6 text-foreground/90">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-4 border-primary bg-primary/5 py-2.5 px-4 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    const isInline = !className?.includes("language-");
    if (isInline) {
      return (
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs sm:text-sm text-foreground">
          {children}
        </code>
      );
    }

    return (
      <div className="my-4 overflow-x-auto rounded-xl border border-border bg-muted/70 p-4">
        <code className="font-mono text-xs sm:text-sm text-foreground">{children}</code>
      </div>
    );
  },
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto rounded-xl border border-border shadow-xs">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b border-border bg-muted/80 font-semibold">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-border bg-background">{children}</tbody>
  ),
  tr: ({ children }) => <tr className="hover:bg-muted/40 transition-colors">{children}</tr>,
  th: ({ children }) => (
    <th className="border-r border-border px-4 py-2.5 font-semibold text-foreground last:border-r-0">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-r border-border px-4 py-2.5 text-foreground last:border-r-0">
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
