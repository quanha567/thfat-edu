type TSectionBadgeProps = {
  children: string;
  className?: string;
};

export function SectionBadge({ children, className = "" }: TSectionBadgeProps) {
  return (
    <p
      className={`text-label text-primary mb-2 font-bold tracking-wider uppercase ${className}`.trim()}
    >
      {children}
    </p>
  );
}
