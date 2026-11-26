import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const SRC = join(process.cwd(), "src");
const COLOR_LITERAL = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/;
const EXCEPTION_MARKER = "color-exception:";

function collectSources(dir: string): string[] {
  const files: string[] = [];

  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);

    if (statSync(full).isDirectory()) {
      files.push(...collectSources(full));
      continue;
    }

    const isSource = /\.(tsx?|jsx?)$/.test(entry) && !/\.test\.tsx?$/.test(entry);

    if (isSource) files.push(full);
  }

  return files;
}

function findOffenders(): string[] {
  const offenders: string[] = [];

  for (const file of collectSources(SRC)) {
    const content = readFileSync(file, "utf8");

    if (!COLOR_LITERAL.test(content)) continue;
    if (content.includes(EXCEPTION_MARKER)) continue;

    offenders.push(file.slice(SRC.length + 1).replaceAll("\\", "/"));
  }

  return offenders;
}

describe("design system: no hardcoded colours", () => {
  it("uses tokens (var(--*) / Tailwind token classes) instead of hex, rgb() or hsl()", () => {
    // Illustration / brand-asset / third-party files may opt out with a
    // `color-exception: <reason>` comment (see docs/adr/0001).
    expect(findOffenders()).toEqual([]);
  });
});
