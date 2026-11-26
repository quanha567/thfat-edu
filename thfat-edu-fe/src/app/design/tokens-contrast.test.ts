import { readFileSync } from "node:fs";
import { join } from "node:path";

import { contrastRatio, parseOklch, type TRgb } from "@/lib/color/oklch";
import { describe, expect, it } from "vitest";

const CSS = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

type TTokenMap = Map<string, string>;

function readBlock(selector: string): string {
  const start = CSS.indexOf(`${selector} {`);

  if (start === -1) return "";

  const end = CSS.indexOf("\n}", start);

  return CSS.slice(start, end);
}

function readTokens(block: string): TTokenMap {
  const tokens: TTokenMap = new Map();

  for (const match of block.matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
    const name = match[1];
    const value = match[2];

    if (name && value) tokens.set(name, value.trim());
  }

  return tokens;
}

const LIGHT = readTokens(readBlock(":root"));
const DARK = new Map([...LIGHT, ...readTokens(readBlock(".dark"))]);

function resolve(tokens: TTokenMap, name: string): TRgb {
  let value = tokens.get(name);

  for (let depth = 0; value && depth < 8; depth++) {
    const ref = /^var\((--[\w-]+)\)$/.exec(value);

    if (!ref || !ref[1]) break;

    value = tokens.get(ref[1]);
  }

  const rgb = value ? parseOklch(value) : null;

  if (!rgb) throw new Error(`Cannot resolve token ${name} to an oklch colour`);

  return rgb;
}

type TPair = { foreground: string; background: string; min: number };

/** WCAG 2.2 AA: 4.5 for body text, 3 for large text / UI components. */
const SEMANTIC_PAIRS: TPair[] = [
  { foreground: "--foreground", background: "--background", min: 4.5 },
  { foreground: "--card-foreground", background: "--card", min: 4.5 },
  { foreground: "--popover-foreground", background: "--popover", min: 4.5 },
  { foreground: "--primary-foreground", background: "--primary", min: 4.5 },
  { foreground: "--secondary-foreground", background: "--secondary", min: 4.5 },
  { foreground: "--muted-foreground", background: "--background", min: 4.5 },
  { foreground: "--muted-foreground", background: "--muted", min: 4.5 },
  { foreground: "--accent-foreground", background: "--accent", min: 4.5 },
  { foreground: "--destructive-foreground", background: "--destructive", min: 4.5 },
  { foreground: "--highlight-foreground", background: "--highlight", min: 4.5 },
  { foreground: "--primary", background: "--background", min: 4.5 },
  { foreground: "--primary", background: "--card", min: 4.5 },
  { foreground: "--ring", background: "--background", min: 3 },
];

describe("design tokens: WCAG 2.2 AA contrast", () => {
  for (const [theme, tokens] of [
    ["light", LIGHT],
    ["dark", DARK],
  ] as const) {
    for (const pair of SEMANTIC_PAIRS) {
      it(`${theme}: ${pair.foreground} on ${pair.background} >= ${pair.min}`, () => {
        const ratio = contrastRatio(
          resolve(tokens, pair.foreground),
          resolve(tokens, pair.background),
        );

        expect(ratio).toBeGreaterThanOrEqual(pair.min);
      });
    }
  }

  it("gold text is only allowed from gold-700 up on light surfaces", () => {
    const white = resolve(LIGHT, "--card");

    expect(contrastRatio(resolve(LIGHT, "--gold-700"), white)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(resolve(LIGHT, "--gold-500"), white)).toBeLessThan(4.5);
  });

  it("logo-safe surfaces stay dark (surface-dark-mid and below)", () => {
    const black = { r: 0, g: 0, b: 0 };
    const white = { r: 1, g: 1, b: 1 };

    for (const name of ["--surface-dark", "--surface-dark-mid"]) {
      const surface = resolve(LIGHT, name);

      expect(contrastRatio(white, surface)).toBeGreaterThanOrEqual(10);
      expect(contrastRatio(black, surface)).toBeLessThan(3);
    }
  });

  it("primary-on-dark reads on fixed dark surfaces", () => {
    const onDark = resolve(LIGHT, "--primary-on-dark");

    expect(contrastRatio(onDark, resolve(LIGHT, "--surface-dark-mid"))).toBeGreaterThanOrEqual(4.5);
  });
});
