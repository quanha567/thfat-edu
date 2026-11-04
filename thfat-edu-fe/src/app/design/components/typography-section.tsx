import { TYPE_SCALE } from "../design.constants";
import { Section } from "./section-wrapper";

export function TypographySection() {
  return (
    <Section id="typography" title="Typography">
      <div className="space-y-1 divide-y divide-neutral-100">
        {TYPE_SCALE.map(({ cls, label, spec, sample }) => (
          <div
            key={cls}
            className="flex flex-col gap-2 py-5 sm:flex-row sm:items-baseline sm:gap-6"
          >
            <div className="flex w-32 shrink-0 flex-col gap-0.5">
              <p className="text-label text-neutral-900">{label}</p>
              <p className="text-caption font-mono text-neutral-400">.{cls}</p>
              <p className="text-caption text-neutral-400">{spec}</p>
            </div>
            <p className={`${cls} min-w-0 text-neutral-900`}>{sample}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
