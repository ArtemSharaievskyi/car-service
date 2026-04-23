import { PageIntro } from "@/components/shared/page-intro";
import { SectionBlock } from "@/components/shared/section-block";

const collections = [
  "Brakes and handling",
  "Performance filters",
  "Lighting and electrical",
  "Interior essentials",
];

export function ShopPlaceholder() {
  return (
    <>
      <PageIntro
        eyebrow="Parts Shop"
        title="Catalog structure ready for products, fitment, and storefront merchandising."
        description="The shop route is set up as a flexible catalog shell. Later, this can expand into search, categories, product details, and inventory-backed browsing."
        aside={
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.18em] text-white/45">Featured collections</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {collections.map((item) => (
                <div key={item} className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-4">
                  <p className="text-sm font-medium text-white">{item}</p>
                </div>
              ))}
            </div>
          </div>
        }
      />

      <SectionBlock
        title="Catalog zones"
        description="These placeholders define the visual rhythm for the storefront without introducing product logic yet."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="panel rounded-lg p-5">
            <p className="text-lg font-semibold text-white">Hero collection rail</p>
            <p className="mt-3 text-sm leading-6 text-white/55">
              Space for top categories, campaign parts, or seasonal promotions.
            </p>
          </div>
          <div className="panel rounded-lg p-5">
            <p className="text-lg font-semibold text-white">Filter sidebar</p>
            <p className="mt-3 text-sm leading-6 text-white/55">
              Future fitment, brand, stock, and price controls.
            </p>
          </div>
          <div className="panel rounded-lg p-5">
            <p className="text-lg font-semibold text-white">Product grid</p>
            <p className="mt-3 text-sm leading-6 text-white/55">
              Responsive cards can plug in here once data models exist.
            </p>
          </div>
        </div>
      </SectionBlock>
    </>
  );
}
