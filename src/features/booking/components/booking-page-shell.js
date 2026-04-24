import { PageIntro } from "@/components/shared/page-intro";
import { SectionBlock } from "@/components/shared/section-block";
import { BookingForm } from "@/features/booking/components/booking-form";
import { db } from "@/lib/db";

const servicePresentation = {
  DIAGNOSTICS: {
    duration: "50 min",
    price: "from 99 EUR",
    availability: "Open this week",
    highlights: ["Fault-code summary", "Advisor review"],
  },
  OIL_CHANGE: {
    duration: "45 min",
    price: "from 129 EUR",
    availability: "Best availability",
    highlights: ["OEM-grade fluids", "Service reset"],
  },
  MAINTENANCE: {
    duration: "75 min",
    price: "from 189 EUR",
    availability: "Morning slots available",
    highlights: ["Workshop check", "Follow-up notes"],
  },
};

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
  "A service advisor reviews each request and confirms the final appointment by phone.",
  "Booking requests are saved as soon as your details pass validation.",
  "If extra inspection time is needed, the team will contact you before the visit.",
];

async function getBookingServices() {
  const services = await db.service.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      description: true,
      type: true,
    },
  });

  return services.map((service) => ({
    ...service,
    ...servicePresentation[service.type],
  }));
}

export async function BookingPageShell() {
  const services = await getBookingServices();

  return (
    <>
      <PageIntro
        eyebrow="Service Booking"
        title="Book trusted workshop service for your vehicle."
        description="Choose the service you need, select a preferred day, and leave your contact details. DriveFix Auto Service will review the request and confirm the appointment with you directly."
        aside={
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-accent-strong)]">
              This week
            </p>
            {services.length ? (
              services.slice(0, 3).map((service) => (
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
              ))
            ) : (
              <p className="text-sm leading-6 text-white/60">
                No services are available right now. Please add workshop services before accepting bookings.
              </p>
            )}
          </div>
        }
      />

      <SectionBlock
        title="Request an Appointment"
        description="Send your preferred service date and callback details. The form validates your information on the server and stores each booking request securely."
      >
        <BookingForm services={services} />
      </SectionBlock>

      <SectionBlock
        title="Workshop Hours"
        description="Typical vehicle intake windows for service visits. Final timing is always confirmed by the workshop team."
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
