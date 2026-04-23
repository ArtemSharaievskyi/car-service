export function SectionBlock({ title, description, children }) {
  return (
    <section className="border-b border-white/[0.08]">
      <div className="app-shell grid gap-8 py-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12 lg:py-16">
        <div className="space-y-3">
          <div className="accent-line pt-4">
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
          </div>
          {description ? <p className="section-copy text-sm">{description}</p> : null}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}
