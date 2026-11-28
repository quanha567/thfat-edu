export type TCertificateStatProps = {
  label: string;
  value: string;
  mono?: boolean;
};

export function CertificateStat({ label, value, mono }: TCertificateStatProps) {
  return (
    <div className="text-center">
      <p className="text-xs text-neutral-600">{label}</p>
      <p
        className={`mt-0.5 text-sm font-bold text-neutral-900 sm:text-base ${mono ? "font-mono" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}
