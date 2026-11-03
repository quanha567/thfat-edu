"use client";

import React from "react";
import Markdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/contrib/mhchem";

import { cn } from "@/lib/utils";

interface ChemRendererProps {
  content: string;
  className?: string;
}

/**
 * Rich markdown renderer supporting KaTeX math and mhchem chemical equations.
 * Supports inline chemistry: $\ce{H2SO4}$
 * Supports display equations: $$\ce{2Al + 6HCl -> 2AlCl3 + 3H2 ^}$$
 */
export function ChemRenderer({ content, className }: ChemRendererProps) {
  return (
    <div className={cn("prose prose-slate max-w-none text-foreground leading-relaxed", className)}>
      <Markdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[[rehypeKatex, { throwOnError: false }]]}
      >
        {content}
      </Markdown>
    </div>
  );
}
