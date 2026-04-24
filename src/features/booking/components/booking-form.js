"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { createBookingAction } from "@/features/booking/actions";
import { BookingServiceCard } from "@/features/booking/components/booking-service-card";
import { getBookingStatusClasses } from "@/features/booking/lib/booking-status";

const initialBookingState = {
  status: "idle",
  message: "",
  errors: {},
  booking: null,
  businessNotificationSent: false,
  customerNotificationSent: false,
};

const timeOptions = ["07:30", "08:30", "09:30", "11:00", "12:30", "14:00", "16:30", "17:30"];

function formatDateLabel(date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatInputDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function BookingForm({ services }) {
  const dateOptions = useMemo(() => {
    const baseDate = new Date();
    baseDate.setHours(0, 0, 0, 0);

    return Array.from({ length: 8 }, (_, index) => {
      const optionDate = new Date(baseDate);
      optionDate.setDate(baseDate.getDate() + index);

      return {
        value: formatInputDate(optionDate),
        label: formatDateLabel(optionDate),
      };
    });
  }, []);

  const [selectedService, setSelectedService] = useState(services[0]?.id ?? "");
  const [selectedDate, setSelectedDate] = useState(dateOptions[1]?.value ?? dateOptions[0]?.value ?? "");
  const [selectedTime, setSelectedTime] = useState(timeOptions[0] ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, formAction, pending] = useActionState(createBookingAction, initialBookingState);

  const activeService =
    services.find((service) => String(service.id) === String(selectedService)) ?? services[0] ?? null;
  const activeDate = dateOptions.find((option) => option.value === selectedDate) ?? null;
  const serviceError = state.errors?.serviceId?.[0];
  const dateError = state.errors?.bookingDate?.[0];
  const timeError = state.errors?.bookingTime?.[0];
  const nameError = state.errors?.name?.[0];
  const emailError = state.errors?.email?.[0];
  const phoneError = state.errors?.phone?.[0];

  if (!services.length) {
    return (
      <div className="panel rounded-lg p-6">
        <p className="text-lg font-semibold text-white">No services available</p>
        <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
          The booking form is ready, but no workshop services are currently available in the database.
        </p>
      </div>
    );
  }

  if (state.status === "success" && state.booking) {
    return (
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_340px]">
        <section className="panel overflow-hidden rounded-2xl border border-emerald-400/20 bg-[linear-gradient(135deg,rgba(5,46,22,0.95),rgba(15,23,42,0.98))]">
          <div className="border-b border-white/10 px-6 py-6 md:px-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Booking confirmed</p>
                <h3 className="mt-3 text-3xl font-semibold text-white">Your service request is in the workshop queue.</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-50/80">
                  {state.message}
                </p>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${getBookingStatusClasses(
                  state.booking.status
                )}`}
              >
                {state.booking.statusLabel}
              </span>
            </div>
          </div>

          <div className="px-6 py-6 md:px-8">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Selected service</p>
                <p className="mt-3 text-lg font-semibold text-white">{state.booking.serviceName}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Date</p>
                <p className="mt-3 text-lg font-semibold text-white">{state.booking.bookingDateLabel}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Time</p>
                <p className="mt-3 text-lg font-semibold text-white">{state.booking.bookingTimeLabel}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Customer name</p>
                <p className="mt-3 text-lg font-semibold text-white">{state.booking.customerName}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Phone</p>
                <p className="mt-3 text-lg font-semibold text-white">{state.booking.phone}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Email</p>
                <p className="mt-3 text-lg font-semibold text-white break-all">{state.booking.email}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Workshop notification</p>
                <p className="mt-3 text-sm leading-6 text-white/78">
                  {state.businessNotificationSent
                    ? "The service desk received the booking details at the business inbox and can review your request immediately."
                    : "The booking was saved successfully. If email delivery was unavailable, the workshop can still process the request from the saved booking record."}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Customer confirmation</p>
                <p className="mt-3 text-sm leading-6 text-white/78">
                  {state.customerNotificationSent
                    ? `A confirmation email has been sent to ${state.booking.email}.`
                    : "Your booking is saved even if confirmation email delivery is temporarily unavailable."}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/booking"
                className="rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[var(--color-accent-strong)]"
              >
                Book another service
              </Link>
              <p className="text-sm text-white/55">A service advisor will contact you directly to confirm the final appointment details.</p>
            </div>
          </div>
        </section>

        <aside className="panel rounded-2xl p-6 xl:sticky xl:top-24 xl:self-start">
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-accent-strong)]">What happens next</p>
          <div className="mt-5 space-y-5">
            <div className="border-b border-white/[0.08] pb-5">
              <p className="text-base font-semibold text-white">1. Request received</p>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Your preferred service, date, time, and contact details have been captured.
              </p>
            </div>
            <div className="border-b border-white/[0.08] pb-5">
              <p className="text-base font-semibold text-white">2. Workshop review</p>
              <p className="mt-2 text-sm leading-6 text-white/60">
                The service desk reviews capacity and checks the requested intake window.
              </p>
            </div>
            <div>
              <p className="text-base font-semibold text-white">3. Final confirmation</p>
              <p className="mt-2 text-sm leading-6 text-white/60">
                A service advisor confirms the final appointment details with you directly by phone or email.
              </p>
            </div>
          </div>
        </aside>
      </div>
    );
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.25fr)_320px]">
      <form action={formAction} className="space-y-8">
        <input type="hidden" name="serviceId" value={selectedService} />
        <input type="hidden" name="bookingDate" value={selectedDate} />
        <input type="hidden" name="bookingTime" value={selectedTime} />

        {state.message ? (
          <div
            className={[
              "rounded-lg border px-4 py-3 text-sm",
              "border-red-400/25 bg-red-500/10 text-red-100",
            ].join(" ")}
          >
            {state.message}
          </div>
        ) : null}

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-accent-strong)]">
                Service
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Select a service</h3>
            </div>
            <p className="text-sm text-white/45">Choose the work you want booked in</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {services.map((service) => (
              <BookingServiceCard
                key={service.id}
                service={service}
                isSelected={String(service.id) === String(selectedService)}
                onSelect={(value) => setSelectedService(String(value))}
              />
            ))}
          </div>
          {serviceError ? <p className="text-sm text-red-300">{serviceError}</p> : null}
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-accent-strong)]">
              Preferred time
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white">Choose your preferred slot</h3>
          </div>

          <div className="max-w-sm space-y-2">
            <select
              value={selectedTime}
              onChange={(event) => setSelectedTime(event.target.value)}
              aria-invalid={Boolean(timeError)}
              className="h-12 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 text-white outline-none transition focus:border-[var(--color-accent)] focus:bg-white/[0.05]"
            >
              {timeOptions.map((time) => (
                <option key={time} value={time} className="bg-slate-950 text-white">
                  {time}
                </option>
              ))}
            </select>
            {timeError ? <p className="text-sm text-red-300">{timeError}</p> : null}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-accent-strong)]">
              Preferred date
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white">Choose your preferred day</h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {dateOptions.map((option) => {
              const isActive = option.value === selectedDate;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedDate(option.value)}
                  className={[
                    "min-h-20 rounded-lg border px-4 py-4 text-left transition",
                    isActive
                      ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] shadow-[0_0_30px_rgba(77,163,255,0.12)]"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]",
                  ].join(" ")}
                  aria-pressed={isActive}
                >
                  <span className="block text-sm font-medium text-white">{option.label}</span>
                  <span className="mt-2 block text-xs uppercase tracking-[0.18em] text-white/45">
                    Preferred intake
                  </span>
                </button>
              );
            })}
          </div>
          {dateError ? <p className="text-sm text-red-300">{dateError}</p> : null}
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-accent-strong)]">
              Contact
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white">Your details</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-white/82">Name</span>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Daniel Weber"
                aria-invalid={Boolean(nameError)}
                className="h-12 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 text-white outline-none transition placeholder:text-white/28 focus:border-[var(--color-accent)] focus:bg-white/[0.05]"
              />
              {nameError ? <span className="text-sm text-red-300">{nameError}</span> : null}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-white/82">Email</span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="daniel.weber@example.com"
                aria-invalid={Boolean(emailError)}
                className="h-12 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 text-white outline-none transition placeholder:text-white/28 focus:border-[var(--color-accent)] focus:bg-white/[0.05]"
              />
              {emailError ? <span className="text-sm text-red-300">{emailError}</span> : null}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-white/82">Phone</span>
              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+49 171 2345 678"
                aria-invalid={Boolean(phoneError)}
                className="h-12 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 text-white outline-none transition placeholder:text-white/28 focus:border-[var(--color-accent)] focus:bg-white/[0.05]"
              />
              {phoneError ? <span className="text-sm text-red-300">{phoneError}</span> : null}
            </label>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-4 border-t border-white/[0.08] pt-6">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[var(--color-accent-strong)] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/55"
          >
            {pending ? "Saving request..." : "Book service"}
          </button>
          <p className="text-sm text-white/45">
            Final appointment confirmation is provided by the service team.
          </p>
        </div>
      </form>

      <aside className="panel rounded-lg p-6 xl:sticky xl:top-24 xl:self-start">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-accent-strong)]">
          Summary
        </p>

        <div className="mt-6 space-y-5">
          <div className="border-b border-white/[0.08] pb-5">
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">Selected service</p>
            <p className="mt-3 text-xl font-semibold text-white">{activeService?.name ?? "Choose service"}</p>
            <p className="mt-2 text-sm text-white/58">
              {activeService?.description || "Professional workshop service prepared for booking intake and advisor follow-up."}
            </p>
          </div>

          <div className="border-b border-white/[0.08] pb-5">
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">Preferred date</p>
            <p className="mt-3 text-lg font-semibold text-white">{activeDate?.label ?? "Pick a date"}</p>
            <p className="mt-2 text-sm text-white/58">Requested arrival time: {selectedTime || "Choose a time"}.</p>
          </div>

          <div className="border-b border-white/[0.08] pb-5">
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">Contact preview</p>
            <div className="mt-3 space-y-2 text-sm text-white/68">
              <p>{name || "No name entered yet"}</p>
              <p>{email || "No email entered yet"}</p>
              <p>{phone || "No phone number entered yet"}</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">Expected visit</p>
            <div className="flex items-center justify-between text-sm text-white/68">
              <span>Duration</span>
              <span>{activeService?.duration ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-white/68">
              <span>Starting price</span>
              <span>{activeService?.price ?? "Advisor quote"}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-white/68">
              <span>Availability</span>
              <span>{activeService?.availability ?? "Available to request"}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
