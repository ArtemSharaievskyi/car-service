"use client";

import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/shared/page-intro";
import { SectionBlock } from "@/components/shared/section-block";
import { useCart } from "@/features/cart/components/cart-provider";
import { formatPrice, parsePrice } from "@/features/cart/lib/cart-utils";

function CartSummaryCard() {
  const { items, totalItems, totalPrice } = useCart();

  const summaryRows = [
    { label: "Line items", value: items.length },
    { label: "Parts in cart", value: totalItems },
    { label: "Subtotal", value: formatPrice(totalPrice) },
  ];

  return (
    <div className="space-y-3">
      <p className="text-sm uppercase tracking-[0.18em] text-white/45">Order summary</p>
      {summaryRows.map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3"
        >
          <span className="text-sm text-white/65">{row.label}</span>
          <span className="text-sm font-semibold text-white/95">{row.value}</span>
        </div>
      ))}
      <p className="text-sm leading-6 text-white/58">
        This cart stays entirely on the client. There is no payment flow or checkout handoff attached yet.
      </p>
    </div>
  );
}

function EmptyCartState() {
  return (
    <div className="panel rounded-lg p-6">
      <p className="text-lg font-semibold text-white">Your cart is empty.</p>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/58">
        Add parts from the shop to build a parts order, then come back here to review quantities and subtotal.
      </p>
      <Link
        href="/shop"
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-accent)] px-5 text-sm font-semibold text-slate-950 transition hover:bg-[var(--color-accent-strong)]"
      >
        Browse parts
      </Link>
    </div>
  );
}

function CartLineItem({ item, onQuantityChange, onRemove }) {
  const lineTotal = parsePrice(item.price) * item.quantity;

  return (
    <article className="panel rounded-lg p-5">
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-white/[0.08] bg-black/20 md:w-44">
          <Image src={item.image} alt={item.name} fill sizes="176px" className="object-cover" />
        </div>

        <div className="flex flex-1 flex-col gap-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-strong)]">
                {item.category}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">{item.name}</h3>
              <p className="mt-2 text-sm leading-6 text-white/58">
                Compatible with {item.compatibleBrand} {item.compatibleModel}
              </p>
            </div>

            <div className="text-left md:text-right">
              <p className="text-sm text-white/52">Unit price</p>
              <p className="mt-1 text-lg font-semibold text-white">{item.price}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/[0.08] pt-4 sm:flex-row sm:items-end sm:justify-between">
            <label className="space-y-2 text-sm">
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/44">
                Quantity
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onQuantityChange(item.quantity - 1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-lg text-white transition hover:border-white/20 hover:bg-white/[0.06]"
                  aria-label={`Decrease quantity for ${item.name}`}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(event) => onQuantityChange(event.target.value)}
                  className="h-11 w-20 rounded-lg border border-white/[0.08] bg-black/20 px-3 text-center text-white outline-none transition focus:border-[var(--color-accent)]"
                  aria-label={`Quantity for ${item.name}`}
                />
                <button
                  type="button"
                  onClick={() => onQuantityChange(item.quantity + 1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-lg text-white transition hover:border-white/20 hover:bg-white/[0.06]"
                  aria-label={`Increase quantity for ${item.name}`}
                >
                  +
                </button>
              </div>
            </label>

            <div className="flex flex-col gap-3 sm:items-end">
              <div>
                <p className="text-sm text-white/52">Line total</p>
                <p className="mt-1 text-xl font-semibold text-white">{formatPrice(lineTotal)}</p>
              </div>
              <button
                type="button"
                onClick={onRemove}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 px-4 text-sm font-semibold text-white/80 transition hover:border-white/24 hover:text-white"
              >
                Remove part
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function CartPageShell() {
  const { items, totalItems, totalPrice, updateQuantity, removePart, hasLoaded } = useCart();

  return (
    <>
      <PageIntro
        eyebrow="Cart"
        title="Review parts, adjust quantities, and keep the order clean before checkout exists."
        description="This route is a simple client-side cart for the parts shop. You can add items, remove them, change quantities, and verify the running subtotal without involving any payment system."
        actions={
          <Link
            href="/shop"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-accent)] px-5 text-sm font-semibold text-slate-950 transition hover:bg-[var(--color-accent-strong)]"
          >
            Continue shopping
          </Link>
        }
        aside={<CartSummaryCard />}
      />

      <SectionBlock
        title="Cart Items"
        description="Quantities update instantly on the client and the subtotal recalculates from the selected parts only."
      >
        {hasLoaded && items.length === 0 ? (
          <EmptyCartState />
        ) : (
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_320px]">
            <div className="space-y-4">
              {hasLoaded ? (
                items.map((item) => (
                  <CartLineItem
                    key={item.sku}
                    item={item}
                    onQuantityChange={(quantity) => updateQuantity(item.sku, quantity)}
                    onRemove={() => removePart(item.sku)}
                  />
                ))
              ) : (
                <div className="panel rounded-lg p-6">
                  <p className="text-lg font-semibold text-white">Loading cart...</p>
                </div>
              )}
            </div>

            <aside className="panel rounded-lg p-6 xl:sticky xl:top-24 xl:self-start">
              <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-accent-strong)]">
                Parts total
              </p>
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between text-sm text-white/65">
                  <span>Parts selected</span>
                  <span>{totalItems}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-white/65">
                  <span>Distinct products</span>
                  <span>{items.length}</span>
                </div>
                <div className="border-t border-white/[0.08] pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm uppercase tracking-[0.18em] text-white/45">Subtotal</span>
                    <span className="text-2xl font-semibold text-white">{formatPrice(totalPrice)}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/58">
                    No payment, shipping, or workshop labor is included here. This page only tracks selected
                    parts and their quantities.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </SectionBlock>
    </>
  );
}
