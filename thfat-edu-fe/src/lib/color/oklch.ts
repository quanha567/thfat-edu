export type TRgb = { r: number; g: number; b: number };

const OKLCH_PATTERN = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*[\d.%]+)?\s*\)$/;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function toSrgbChannel(linear: number): number {
  const clamped = clamp01(linear);

  return clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055;
}

export function oklchToSrgb(lightness: number, chroma: number, hue: number): TRgb {
  const hueRad = (hue * Math.PI) / 180;
  const a = chroma * Math.cos(hueRad);
  const b = chroma * Math.sin(hueRad);

  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return {
    r: toSrgbChannel(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    g: toSrgbChannel(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    b: toSrgbChannel(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  };
}

export function parseOklch(value: string): TRgb | null {
  const match = OKLCH_PATTERN.exec(value.trim());

  if (!match) return null;

  return oklchToSrgb(Number(match[1]), Number(match[2]), Number(match[3]));
}

function toLinear(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(rgb: TRgb): number {
  return 0.2126 * toLinear(rgb.r) + 0.7152 * toLinear(rgb.g) + 0.0722 * toLinear(rgb.b);
}

/** WCAG 2.x contrast ratio computed on the rendered (clipped) sRGB colour. */
export function contrastRatio(foreground: TRgb, background: TRgb): number {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const [light, dark] = a > b ? [a, b] : [b, a];

  return (light + 0.05) / (dark + 0.05);
}
