import { brand } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-slate-950/80">
      <div className="app-shell flex flex-col gap-2 py-6 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <p>{brand.footerNote}</p>
        <p>{brand.name} | Service booking and parts ordering</p>
      </div>
    </footer>
  );
}
