"use client";

import katex from "katex";
import { useMemo } from "react";
import "katex/contrib/mhchem";

export type TChemProps = {
  /** Chemical formula in mhchem format, e.g. "2H2 + O2 -> 2H2O" or "Fe^{3+}" */
  formula?: string;
  /** Generic math expression in LaTeX format */
  math?: string;
  /** Whether to render in display (block) mode or inline mode */
  display?: boolean;
  className?: string;
};

/**
 * Component to render chemical formulas and reactions with KaTeX and mhchem extension. Example:
 * <Chem formula="2H2 + O2 -> 2H2O" /> Example: <Chem formula="Fe + 2HCl -> FeCl2 + H2 ^" display
 * />
 */
export function Chem({ formula, math, display = false, className = "" }: TChemProps) {
  const latex = formula ? `\\ce{${formula}}` : math || "";

  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode: display,
        throwOnError: false,
      });
    } catch (e) {
      console.error("Failed to render chemical formula:", e);

      return latex;
    }
  }, [latex, display]);

  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
