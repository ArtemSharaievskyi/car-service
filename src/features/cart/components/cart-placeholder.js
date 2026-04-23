import { PageIntro } from "@/components/shared/page-intro";
import { SectionBlock } from "@/components/shared/section-block";

const summaryRows = [
  "Parts subtotal",
  "Workshop services",
  "Estimated delivery or pickup",
];

export function CartPlaceholder() {
  return (
    <>
      <PageIntro
        eyebrow="Cart"
        title="A clean cart route for mixed service and parts orders."
        description="The cart page is prepared as a review step for future line items, service bundles, and delivery or pickup summaries. Nothing here is wired to state or checkout yet."
        aside={
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.18em] text-white/45">Order summary</p>
            {summaryRows.map((row) => (
              <div key={row} className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                <span className="text-sm text-white/65">{row}</span>
                <span className="text-sm font-semibold text-white/95">Pending</span>
              </div>
            ))}
          </div>
        }
      />

      <SectionBlock
        title="Cart layout"
        description="The future state can split into editable line items on the left and a sticky summary on the right without restructuring the route."
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_320px]">
          <div className="panel rounded-lg p-6">
            <p className="text-lg font-semibold text-white">Line items area</p>
            <p className="mt-3 text-sm leading-6 text-white/55">
              Reserve this space for product rows, labor bundles, quantity controls, and stock messaging.
            </p>
          </div>
          <div className="panel rounded-lg p-6">
            <p className="text-lg font-semibold text-white">Summary sidebar</p>
            <p className="mt-3 text-sm leading-6 text-white/55">
              Totals, scheduling notes, and a future checkout handoff can live here.
            </p>
          </div>
        </div>
      </SectionBlock>
    </>
  );
}
