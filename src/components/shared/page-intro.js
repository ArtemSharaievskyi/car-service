export function PageIntro({ eyebrow, title, description, actions, aside }) {
  return (
    <section className="grid-lines overflow-hidden border-b border-white/[0.08]">
      <div className="app-shell grid gap-12 py-16 lg:grid-cols-[minmax(0,1.4fr)_360px] lg:items-end lg:py-24">
        <div className="space-y-6">
          <p className="eyebrow">{eyebrow}</p>
          <div className="space-y-4">
            <h1 className="section-title max-w-4xl">{title}</h1>
            <p className="section-copy">{description}</p>
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>

        {aside ? (
          <div className="panel rounded-lg p-6 shadow-2xl shadow-black/20">{aside}</div>
        ) : null}
      </div>
    </section>
  );
}
