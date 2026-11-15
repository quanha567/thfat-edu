import { COLOR_SCALES, SEMANTIC_TOKENS, SHADES } from "../design.constants";
import { Section } from "./section-wrapper";

export function ColorSection() {
  return (
    <Section id="colors" title="Colors">
      <div className="space-y-8">
        {COLOR_SCALES.map(({ name, key, desc }) => (
          <div key={key} className="space-y-2">
            <div className="flex items-baseline gap-3">
              <p className="text-label text-neutral-900">{name}</p>
              <p className="text-caption text-neutral-400">{desc}</p>
            </div>
            <div className="grid grid-cols-11 gap-1.5">
              {SHADES.map((shade) => (
                <div key={shade} className="space-y-1.5">
                  <div
                    className="h-10 w-full rounded-lg border border-black/5"
                    style={{ backgroundColor: `var(--${key}-${shade})` }}
                  />
                  <p className="text-caption text-center text-neutral-500">{shade}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Semantic tokens quick ref */}
      <div className="mt-8 space-y-2">
        <p className="text-label text-neutral-500">Semantic Tokens</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {SEMANTIC_TOKENS.map(({ token, label }) => (
            <div
              key={token}
              className="flex items-center gap-2.5 rounded-lg border border-neutral-200 bg-white p-3"
            >
              <div
                className="size-8 shrink-0 rounded-md border border-black/10"
                style={{ backgroundColor: `var(${token})` }}
              />
              <div>
                <p className="text-label text-neutral-900">{label}</p>
                <p className="text-caption font-mono text-neutral-400">{token}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
