"use client";

import Image from "next/image";
import { useCart } from "@/features/cart/components/cart-provider";

export function PartCard({ part }) {
  const { addPart, items } = useCart();
  const cartItem = items.find((item) => item.sku === part.sku);

  return (
    <article className="panel flex h-full flex-col overflow-hidden rounded-lg shadow-lg shadow-black/15">
      <div className="relative aspect-[4/3] border-b border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]">
        <Image
          src={part.image}
          alt={part.name}
          fill
          sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-strong)]">
              {part.category}
            </p>
            <div>
              <h3 className="text-xl font-semibold text-white">{part.name}</h3>
              <p className="mt-2 text-sm leading-6 text-white/58">
                Compatible with {part.compatibleBrand} {part.compatibleModel}
              </p>
            </div>
          </div>
          <p className="shrink-0 text-lg font-semibold text-white">{part.price}</p>
        </div>

        <dl className="mt-6 grid gap-3 text-sm text-white/68 sm:grid-cols-2">
          <div className="rounded-lg border border-white/[0.08] bg-black/15 p-3">
            <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/42">Brand</dt>
            <dd className="mt-2 text-sm font-medium text-white">{part.compatibleBrand}</dd>
          </div>
          <div className="rounded-lg border border-white/[0.08] bg-black/15 p-3">
            <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/42">Model</dt>
            <dd className="mt-2 text-sm font-medium text-white">{part.compatibleModel}</dd>
          </div>
          <div className="rounded-lg border border-white/[0.08] bg-black/15 p-3 sm:col-span-2">
            <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/42">Category</dt>
            <dd className="mt-2 text-sm font-medium text-white">{part.category}</dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={() => addPart(part)}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-accent)] px-4 text-sm font-semibold text-slate-950 transition hover:bg-[var(--color-accent-strong)]"
        >
          {cartItem ? `Add another (${cartItem.quantity} in cart)` : "Add to cart"}
        </button>
      </div>
    </article>
  );
}
