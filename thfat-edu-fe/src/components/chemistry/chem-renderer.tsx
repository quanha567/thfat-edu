"use client";

import { cn } from "@/lib/utils";
import Markdown, { type Components } from "react-markdown";
import rehypeKatex from "rehype-katex";
import "katex/contrib/mhchem";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

export type TChemRendererProps = {
  content: string;
  className?: string;
};

/**
 * Normalizes bare LaTeX symbols and chemical expressions into KaTeX math blocks so teachers can
 * write either `\rightarrow` or `$\rightarrow$` seamlessly.
 */
export function preprocessChemContent(raw: string): string {
  if (!raw) return "";

  // 1. Protect all existing KaTeX math segments ($...$ and $$...$$) from any regex mutation
  const mathBlocks: string[] = [];
  let res = raw.replace(/\$\$[\s\S]*?\$\$|\$[^$\n]+\$/g, (match) => {
    const idx = mathBlocks.length;
    mathBlocks.push(match);

    return `___MATH_PROTECTED_${idx}___`;
  });

  // 2. Auto-wrap bare \ce{...} outside of $ (supporting 1 level of nested braces e.g. \ce{Cu^{2+}})
  res = res.replace(/\\ce\{((?:[^{}]|\{[^{}]*\})*)\}/g, (_m, inner) => `$\\ce{${inner}}$`);

  // 3. Auto-wrap bare arrows and symbols: \rightarrow, \rightleftharpoons, \uparrow, \downarrow, \Delta
  res = res.replace(
    /\\(rightarrow|rightleftharpoons|leftarrow|uparrow|downarrow|Delta|approx|le|ge|times|div|cdot)\b/g,
    (_m, sym) => `$\\${sym}$`,
  );

  // 4. Restore protected math blocks
  for (let i = 0; i < mathBlocks.length; i++) {
    res = res.replace(`___MATH_PROTECTED_${i}___`, mathBlocks[i] ?? "");
  }

  return res;
}

const MARKDOWN_COMPONENTS: Components = {
  table: ({ children }) => (
    <div className="border-border/80 my-2.5 overflow-x-auto rounded-lg border shadow-2xs">
      <table className="w-full border-collapse text-xs sm:text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-border bg-muted/60 border-b font-semibold">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-border/60 bg-background/50 divide-y">{children}</tbody>
  ),
  tr: ({ children }) => <tr className="hover:bg-muted/30 transition-colors">{children}</tr>,
  th: ({ children }) => (
    <th className="border-border/60 text-foreground border-r px-3 py-2 text-left font-bold last:border-r-0">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-border/60 text-foreground border-r px-3 py-2 last:border-r-0">
      {children}
    </td>
  ),
  h1: ({ children }) => (
    <h1 className="text-foreground mt-3 mb-1.5 text-base font-bold sm:text-lg">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-foreground mt-2.5 mb-1 text-sm font-bold sm:text-base">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-foreground mt-2 mb-1 text-xs font-bold sm:text-sm">{children}</h3>
  ),
  ul: ({ children }) => (
    <ul className="text-foreground my-1.5 list-inside list-disc space-y-1 pl-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="text-foreground my-1.5 list-inside list-decimal space-y-1 pl-1">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-primary/60 bg-muted/20 text-muted-foreground my-2 border-l-3 py-1 pr-2 pl-3 italic">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
      {children}
    </code>
  ),
};

export function ChemRenderer({ content, className }: TChemRendererProps) {
  const processed = preprocessChemContent(content);

  return (
    <div className={cn("text-foreground text-sm leading-relaxed", className)}>
      <Markdown
        remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
        rehypePlugins={[[rehypeKatex, { throwOnError: false }]]}
        components={MARKDOWN_COMPONENTS}
      >
        {processed}
      </Markdown>
    </div>
  );
}
