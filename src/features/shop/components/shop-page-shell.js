import { PageIntro } from "@/components/shared/page-intro";
import { SectionBlock } from "@/components/shared/section-block";
import { ShopCatalog } from "@/features/shop/components/shop-catalog";
import { partCategories, shopProducts } from "@/features/shop/data/parts-catalog";

export function ShopPageShell() {
  const brands = new Set(shopProducts.map((product) => product.compatibleBrand));

  return (
    <>
      <PageIntro
        eyebrow="Parts Shop"
        title="Workshop parts and service essentials in one place."
        description="Browse commonly stocked oils, filters, brakes, ignition parts, lighting, and workshop consumables selected for routine maintenance and repair jobs."
        aside={
          <div className="space-y-5">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-white/45">Catalog snapshot</p>
              <p className="mt-3 text-3xl font-semibold text-white">{shopProducts.length} stocked parts</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-white/42">Categories</p>
                <p className="mt-2 text-sm font-medium text-white">{partCategories.length} organized shelves</p>
              </div>
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-white/42">Vehicle brands</p>
                <p className="mt-2 text-sm font-medium text-white">{brands.size} fitment groups</p>
              </div>
              {partCategories.slice(0, 4).map((category) => (
                <div
                  key={category.slug}
                  className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3"
                >
                  <p className="text-sm font-medium text-white">{category.name}</p>
                </div>
              ))}
            </div>
          </div>
        }
      />

      <SectionBlock
        title="Shop Shelves"
        description="Products are grouped by category first, then narrowed by fitment so drivers can quickly find the right service parts."
      >
        <ShopCatalog products={shopProducts} categories={partCategories} />
      </SectionBlock>
    </>
  );
}
