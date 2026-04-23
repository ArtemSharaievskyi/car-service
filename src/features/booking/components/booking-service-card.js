export function BookingServiceCard({ service, isSelected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(service.id)}
      className={[
        "rounded-lg border p-5 text-left transition",
        isSelected
          ? "border-[var(--color-accent)] bg-[linear-gradient(180deg,rgba(77,163,255,0.22),rgba(255,255,255,0.04))] shadow-[0_0_30px_rgba(77,163,255,0.12)]"
          : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]",
      ].join(" ")}
      aria-pressed={isSelected}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-white">{service.name}</p>
          <p className="mt-2 text-sm leading-6 text-white/58">{service.description}</p>
        </div>
        <span
          className={[
            "rounded-full px-3 py-1 text-xs font-medium",
            isSelected
              ? "bg-slate-950 text-[var(--color-accent-strong)]"
              : "border border-white/[0.08] text-white/62",
          ].join(" ")}
        >
          {service.duration}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {service.highlights.map((highlight) => (
          <span
            key={highlight}
            className="rounded-full border border-white/[0.08] px-3 py-1 text-xs font-medium text-white/65"
          >
            {highlight}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 text-sm">
        <span className="text-[var(--color-accent-strong)]">{service.availability}</span>
        <span className="font-medium text-white/78">{service.price}</span>
      </div>
    </button>
  );
}
