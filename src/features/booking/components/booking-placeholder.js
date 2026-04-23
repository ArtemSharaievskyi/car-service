import { PageIntro } from "@/components/shared/page-intro";
import { SectionBlock } from "@/components/shared/section-block";

const bookingStages = [
  "Vehicle and service selection",
  "Preferred date and workshop slot",
  "Contact details and special notes",
];

export function BookingPlaceholder() {
  return (
    <>
      <PageIntro
        eyebrow="Service Booking"
        title="Booking flow placeholder with room for a proper workshop intake experience."
        description="This page is intentionally static for now. It establishes layout, hierarchy, and content zones for a future service booking journey without wiring in any booking logic."
        aside={
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.18em] text-white/45">Planned flow</p>
            {bookingStages.map((stage, index) => (
              <div key={stage} className="flex items-center gap-4 rounded-lg border border-white/[0.08] bg-white/[0.03] p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-accent)] font-semibold text-slate-950">
                  {index + 1}
                </span>
                <p className="text-sm text-white/75">{stage}</p>
              </div>
            ))}
          </div>
        }
      />

      <SectionBlock
        title="Planned modules"
        description="These content areas can become forms, slot selectors, and workshop status panels in later iterations."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="panel rounded-lg p-5">
            <p className="text-lg font-semibold text-white">Visit details</p>
            <p className="mt-3 text-sm leading-6 text-white/55">
              Service package, vehicle profile, mileage, and urgency.
            </p>
          </div>
          <div className="panel rounded-lg p-5">
            <p className="text-lg font-semibold text-white">Schedule</p>
            <p className="mt-3 text-sm leading-6 text-white/55">
              Available bays, mechanic assignment hints, and date selection.
            </p>
          </div>
          <div className="panel rounded-lg p-5">
            <p className="text-lg font-semibold text-white">Customer notes</p>
            <p className="mt-3 text-sm leading-6 text-white/55">
              Symptom details, pickup preferences, and attachments later on.
            </p>
          </div>
        </div>
      </SectionBlock>
    </>
  );
}
