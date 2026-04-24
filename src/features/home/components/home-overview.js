import Image from "next/image";
import Link from "next/link";
import { SectionBlock } from "@/components/shared/section-block";
import { brand } from "@/lib/brand";

const serviceSignals = [
  { value: "Diagnostics", label: "Accurate fault finding and warning-light checks" },
  { value: "Oil Service", label: "Quality oil, filters, and service interval resets" },
  { value: "Maintenance", label: "Routine servicing to keep your car road-ready" },
];

const detailRows = [
  "Modern diagnostics for engine, battery, and electronic systems",
  "Scheduled maintenance including oil, filters, fluids, and inspection work",
  "Straightforward booking and a parts catalog for common service items",
];

export function HomeOverview() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-white/[0.08]">
        <div className="absolute inset-0">
          <div className="hero-image-wrap absolute inset-0">
            <Image
              src="/images/home-hero-bmw-v2.png"
              alt="Black BMW sedan inside a premium repair garage"
              fill
              priority
              className="hero-image object-cover object-center"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,5,10,0.94)_0%,rgba(2,5,10,0.74)_38%,rgba(2,5,10,0.42)_62%,rgba(2,5,10,0.76)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(88,166,255,0.24),transparent_20%),radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.08),transparent_18%)]" />
          <div className="hero-scanline absolute inset-x-0 top-[24%] h-px bg-gradient-to-r from-transparent via-sky-300/70 to-transparent" />
          <div className="hero-scanline hero-scanline-delayed absolute inset-x-0 top-[72%] h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>

        <div className="app-shell relative grid min-h-[calc(100svh-73px)] items-end py-10 sm:py-14 lg:grid-cols-[minmax(0,1.15fr)_360px] lg:gap-10 lg:py-16">
          <div className="max-w-3xl self-center py-16 sm:py-20 lg:py-24">
            <p className="eyebrow">{brand.shortName}</p>
            <h1 className="mt-5 max-w-4xl text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.92] text-white">
              Professional Car Service & Maintenance
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
              {brand.name} provides dependable workshop care for everyday vehicles, from diagnostics and
              oil changes to scheduled maintenance and replacement parts support.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/booking"
                className="rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(88,166,255,0.28)] transition hover:bg-[var(--color-accent-strong)]"
              >
                Book a service
              </Link>
              <Link
                href="/shop"
                className="rounded-full border border-white/15 bg-black/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-black/35"
              >
                Browse parts
              </Link>
            </div>

            <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
              {serviceSignals.map((item) => (
                <div key={item.value} className="panel hero-float rounded-lg p-4">
                  <p className="text-xl font-semibold text-white">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-white/58">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="relative self-end pb-4 lg:pb-10">
            <div className="hero-float-delayed panel rounded-lg p-6 shadow-2xl shadow-black/30">
              <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-accent-strong)]">Key services</p>
              <div className="mt-5 grid gap-4">
                {detailRows.map((row, index) => (
                  <div
                    key={row}
                    className="flex items-start gap-4 border-b border-white/[0.08] pb-4 last:border-b-0 last:pb-0"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-sm font-semibold text-slate-950">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-6 text-white/68">{row}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <SectionBlock
        title="Workshop Services"
        description="Clear service information for drivers who need professional maintenance, fast diagnostics, and practical repair support."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="panel rounded-lg p-5">
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-accent-strong)]">Diagnostics</p>
            <p className="mt-3 text-sm leading-6 text-white/60">
              Computer-based fault checks, warning-light scans, and troubleshooting for drivability issues.
            </p>
          </div>
          <div className="panel rounded-lg p-5">
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-accent-strong)]">Oil Change</p>
            <p className="mt-3 text-sm leading-6 text-white/60">
              Engine oil and filter replacement using quality parts, with service reset where required.
            </p>
          </div>
          <div className="panel rounded-lg p-5">
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-accent-strong)]">Maintenance</p>
            <p className="mt-3 text-sm leading-6 text-white/60">
              Routine inspections, fluid checks, and service work designed to keep vehicles reliable year-round.
            </p>
          </div>
        </div>
      </SectionBlock>
    </>
  );
}
