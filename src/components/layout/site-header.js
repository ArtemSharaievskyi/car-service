"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/features/cart/components/cart-provider";
import { brand } from "@/lib/brand";
import { navigationItems } from "@/lib/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-slate-950/85 backdrop-blur-xl">
      <div className="app-shell flex min-h-18 items-center justify-between gap-6 py-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-sm border border-white/10 bg-white/[0.04] text-sm font-semibold text-[var(--color-accent-strong)]">
            <span className="absolute inset-y-2 left-2 w-1 rounded-full bg-[var(--color-accent)]/80" />
            <span className="relative">{brand.initials}</span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
              {brand.name}
            </p>
            <p className="truncate text-base font-semibold text-white">
              {brand.tagline}
            </p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-2 text-sm font-medium">
          {navigationItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 transition ${
                  active
                    ? "bg-[var(--color-accent)] text-slate-950"
                    : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <span>{item.label}</span>
                  {item.href === "/cart" && totalItems > 0 ? (
                    <span
                      className={`inline-flex min-w-6 items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        active ? "bg-slate-950/12 text-slate-950" : "bg-[var(--color-accent-soft)] text-white"
                      }`}
                    >
                      {totalItems}
                    </span>
                  ) : null}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
