import { PageIntro } from "@/components/shared/page-intro";
import { SectionBlock } from "@/components/shared/section-block";
import { BookingForm } from "@/features/booking/components/booking-form";

const services = [
  {
    id: "oil-service",
    name: "Oil Service",
    duration: "45 min",
    price: "from 129 EUR",
    availability: "Open this week",
    description: "Synthetic oil replacement, filter change, and a quick mechanical check before handoff.",
    highlights: ["OEM-grade fluids", "Reset service interval"],
  },
  {
    id: "brake-inspection",
    name: "Brake Inspection",
    duration: "60 min",
    price: "from 159 EUR",
    availability: "Best availability",
    description: "Pad and rotor wear check, brake fluid review, and a road-ready safety inspection.",
    highlights: ["Front and rear inspection", "Workshop report"],
  },
  {
    id: "diagnostics",
    name: "Diagnostics Scan",
    duration: "50 min",
    price: "from 99 EUR",
    availability: "Limited Friday slots",
    description: "Computer-assisted fault scan with technician notes for warning lights or rough running.",
    highlights: ["Fault-code summary", "Recommended next steps"],
  },
  {
    id: "seasonal-check",
    name: "Seasonal Check",
    duration: "75 min",
    price: "from 189 EUR",
    availability: "Morning slots available",
    description: "Tyres, battery, fluids, climate system, and underbody visual inspection for daily driving.",
    highlights: ["Battery health check", "Fluid top-up review"],
  },
];

const serviceWindows = [
  {
    title: "Early drop-off",
    detail: "07:30 to 09:00",
    description: "Ideal if you want the car in the workshop before the day gets busy.",
  },
  {
    title: "Midday intake",
    detail: "11:00 to 13:30",
    description: "Balanced option for diagnostics, inspections, and shorter service visits.",
  },
  {
    title: "After-work arrival",
    detail: "16:30 to 18:00",
    description: "Useful for securing the next available bay without leaving work early.",
  },
];

const workshopNotes = [
  "Service advisor confirmation happens after you choose a preferred date.",
  "Booking submission is intentionally disabled in this iteration.",
  "Contact details stay local to the form for now and are not sent anywhere.",
];

export function BookingPageShell() {
  return (
    <>
      <PageIntro
        eyebrow="Service Booking"
        title="Book workshop time around the service your car actually needs."
        description="Choose a service, pick a preferred visit date, and leave the contact details the team needs for a callback. Final booking confirmation stays switched off for now."
        aside={
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-accent-strong)]">
              Available now
            </p>
            {services.slice(0, 3).map((service) => (
              <div
                key={service.id}
                className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-4 last:border-b-0 last:pb-0"
              >
                <div>
                  <p className="text-base font-semibold text-white">{service.name}</p>
                  <p className="mt-1 text-sm text-white/55">{service.duration}</p>
                </div>
                <span className="rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-medium text-[var(--color-accent-strong)]">
                  {service.availability}
                </span>
              </div>
            ))}
          </div>
        }
      />

      <SectionBlock
        title="Schedule Request"
        description="Build a service request with a preferred date and callback details. The page is ready for selection flows, while submission remains intentionally inactive."
      >
        <BookingForm services={services} />
      </SectionBlock>

      <SectionBlock
        title="Workshop Hours"
        description="Typical intake windows for service visits. Final slot confirmation still happens with the service team."
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="grid gap-4 md:grid-cols-3">
            {serviceWindows.map((window) => (
              <div key={window.title} className="panel rounded-lg p-5">
                <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-accent-strong)]">
                  {window.title}
                </p>
                <p className="mt-4 text-2xl font-semibold text-white">{window.detail}</p>
                <p className="mt-3 text-sm leading-6 text-white/58">{window.description}</p>
              </div>
            ))}
          </div>

          <div className="panel rounded-lg p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-accent-strong)]">
              Booking status
            </p>
            <div className="mt-5 space-y-4">
              {workshopNotes.map((note, index) => (
                <div key={note} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-sm font-semibold text-slate-950">
                    {index + 1}
                  </span>
                  <p className="pt-1 text-sm leading-6 text-white/65">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionBlock>
    </>
  );
}
