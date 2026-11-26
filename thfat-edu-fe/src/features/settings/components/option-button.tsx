import { type WithChildren } from "@thfat-edu/shared";

type TOptionButtonProps = WithChildren<{
  selected: boolean;
  onSelect: () => void;
}>;

export function OptionButton({ selected, onSelect, children }: TOptionButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`flex flex-col items-start gap-1 rounded-lg border p-3.5 text-left transition-colors ${
        selected
          ? "border-primary-500 bg-primary-50/50 dark:border-primary-600 dark:bg-primary-950/30"
          : "border-border/70 hover:bg-muted/30"
      }`}
    >
      {children}
    </button>
  );
}

type TPresetChipsProps = {
  presets: ReadonlyArray<{ label: string; value: number }>;
  current: number;
  onSelect: (value: number) => void;
};

export function PresetChips({ presets, current, onSelect }: TPresetChipsProps) {
  return (
    <div className="flex flex-wrap gap-1.5 pt-1">
      {presets.map((preset) => (
        <button
          key={preset.value}
          type="button"
          onClick={() => onSelect(preset.value)}
          className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
            current === preset.value
              ? "bg-primary-100 text-primary-800 dark:bg-primary-950 dark:text-primary-300"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}
