import { NAV_SECTIONS } from "../design.constants";

export function DesignSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 overflow-auto border-r border-neutral-200 bg-neutral-50 lg:block">
      {/* Brand */}
      <div className="border-b border-neutral-200 px-6 py-5">
        <p className="text-label tracking-widest text-neutral-500 uppercase">ThFat Edu</p>
        <p className="text-h3 text-primary-700 mt-0.5">Design System</p>
      </div>

      {/* Nav */}
      <nav className="space-y-1 p-4">
        {NAV_SECTIONS.map(({ id, label, icon: Icon }) => (
          <a
            key={id}
            href={`#${id}`}
            className="text-label hover:bg-primary-50 hover:text-primary-700 flex items-center gap-2.5 rounded-lg px-3 py-2 text-neutral-600 transition-colors"
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </a>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute right-0 bottom-0 left-0 border-t border-neutral-200 px-6 py-4">
        <p className="text-caption text-neutral-400">v0.1.0 · React 19 · Next.js 16</p>
      </div>
    </aside>
  );
}
