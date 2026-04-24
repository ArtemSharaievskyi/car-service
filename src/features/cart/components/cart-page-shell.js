"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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
        Review the parts you have selected before contacting the workshop or continuing your order.
      </p>
    </div>
  );
}

function EmptyCartState() {
  return (
    <div className="panel rounded-lg p-6">
      <p className="text-lg font-semibold text-white">Your cart is empty.</p>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/58">
        Add service parts from the shop, then return here to review quantities and your current subtotal.
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

function CheckoutStatusNotice({ checkoutStatus, errorMessage }) {
  if (!checkoutStatus && !errorMessage) {
    return null;
  }

  if (checkoutStatus === "success") {
    return (
      <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-100">
        Stripe confirmed your payment. Your parts cart has been cleared, and you can continue browsing if
        you need anything else.
      </div>
    );
  }

  if (checkoutStatus === "cancelled") {
    return (
      <div className="rounded-lg border border-amber-300/20 bg-amber-300/10 px-5 py-4 text-sm text-amber-100">
        Checkout was canceled before payment completed. Your cart is still here whenever you are ready.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-rose-300/20 bg-rose-300/10 px-5 py-4 text-sm text-rose-100">
      {errorMessage}
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

export function CartPageShell({ checkoutStatus }) {
  const { items, totalItems, totalPrice, updateQuantity, removePart, clearCart, hasLoaded } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  useEffect(() => {
    if (checkoutStatus === "success" && hasLoaded && items.length > 0) {
      clearCart();
    }
  }, [checkoutStatus, clearCart, hasLoaded, items.length]);

  const handleCheckout = async () => {
    setCheckoutError("");
    setIsCheckingOut(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            sku: item.sku,
            quantity: item.quantity,
          })),
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.url) {
        throw new Error(payload?.error || "Unable to start Stripe Checkout.");
      }

      window.location.assign(payload.url);
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Unable to start Stripe Checkout right now."
      );
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      <PageIntro
        eyebrow="Cart"
        title="Review your selected parts before finalizing service needs."
        description="Adjust quantities, remove items, and check your subtotal before discussing the order with the workshop."
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
        description="Quantities update instantly and the subtotal recalculates from the parts currently selected."
      >
        {(checkoutStatus || checkoutError) && (
          <div className="mb-4">
          <CheckoutStatusNotice checkoutStatus={checkoutStatus} errorMessage={checkoutError} />
          </div>
        )}

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
                    Labour, taxes, and final workshop pricing are not included here. This view only tracks
                    selected parts and their quantities.
                  </p>
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={!hasLoaded || items.length === 0 || isCheckingOut}
                    className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[var(--color-accent)] px-5 text-sm font-semibold text-slate-950 transition hover:bg-[var(--color-accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isCheckingOut ? "Redirecting to Stripe..." : "Checkout with Stripe"}
                  </button>
                  <p className="mt-3 text-xs leading-5 text-white/45">
                    You&apos;ll be redirected to Stripe&apos;s hosted checkout to pay securely for the parts in
                    your cart.
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
