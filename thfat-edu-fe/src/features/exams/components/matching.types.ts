export type TMatchingOption = {
  letter: string;
  content: string;
  raw: string;
};

export type TMatchingHeaders = {
  col1Title: string;
  col2Title: string;
};

export function parseMatchingOption(opt: string, index: number): TMatchingOption {
  const trimmed = opt.trim();
  const match = trimmed.match(/^([A-Za-z0-9]+)[.:\-)]\s*([\s\S]*)$/);

  if (match && match[1]) {
    return { letter: match[1].toUpperCase(), content: match[2]?.trim() ?? "", raw: opt };
  }

  if (/^[A-Za-z0-9]$/.test(trimmed)) {
    return { letter: trimmed.toUpperCase(), content: "", raw: opt };
  }

  const defaultLetter = String.fromCharCode(65 + index);

  return { letter: defaultLetter, content: trimmed, raw: opt };
}

export function extractMatchingHeaders(contextContent?: string): TMatchingHeaders {
  const fallback = {
    col1Title: "Nội dung vế ghép (Cột 1)",
    col2Title: "Phương án đối chiếu (Cột 2)",
  };

  if (!contextContent) {
    return fallback;
  }

  const colMatch = contextContent.match(
    /(?:Cột\s*([A1])\s*(?:\(([^)]+)\)|:\s*([^\n\-|]+))\s*(?:[-–|và,]\s*)?Cột\s*([B2])\s*(?:\(([^)]+)\)|:\s*([^\n\-|]+)))/i,
  );

  if (!colMatch) {
    return fallback;
  }

  const rawCol1 = (colMatch[2] || colMatch[3] || "").trim();
  const rawCol2 = (colMatch[5] || colMatch[6] || "").trim();
  const col1Label = `Cột ${colMatch[1]?.toUpperCase() || "1"}${rawCol1 ? `: ${rawCol1}` : ""}`;
  const col2Label = `Cột ${colMatch[4]?.toUpperCase() || "2"}${rawCol2 ? `: ${rawCol2}` : ""}`;

  return {
    col1Title: col1Label || fallback.col1Title,
    col2Title: col2Label || fallback.col2Title,
  };
}
