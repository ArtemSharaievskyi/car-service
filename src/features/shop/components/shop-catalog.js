"use client";

import { useMemo, useState } from "react";
import { PartCard } from "@/features/shop/components/part-card";

export function ShopCatalog({ products, categories }) {
  const [selectedBrand, setSelectedBrand] = useState("All brands");
  const [selectedModel, setSelectedModel] = useState("All models");
  const [selectedCategory, setSelectedCategory] = useState("All categories");

  const brands = useMemo(
    () => ["All brands", ...new Set(products.map((product) => product.compatibleBrand))],
    [products]
  );

  const models = useMemo(() => {
    const scopedProducts =
      selectedBrand === "All brands"
        ? products
        : products.filter((product) => product.compatibleBrand === selectedBrand);

    return ["All models", ...new Set(scopedProducts.map((product) => product.compatibleModel))];
  }, [products, selectedBrand]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const brandMatch = selectedBrand === "All brands" || product.compatibleBrand === selectedBrand;
      const modelMatch = selectedModel === "All models" || product.compatibleModel === selectedModel;
      const categoryMatch =
        selectedCategory === "All categories" || product.category === selectedCategory;

      return brandMatch && modelMatch && categoryMatch;
    });
  }, [products, selectedBrand, selectedModel, selectedCategory]);

  const groupedProducts = useMemo(() => {
    return categories
      .map((category) => ({
        ...category,
        products: filteredProducts.filter((product) => product.category === category.name),
      }))
      .filter((category) => category.products.length > 0);
  }, [categories, filteredProducts]);

  const resetModelIfHidden = (brand) => {
    const availableModels =
      brand === "All brands"
        ? products.map((product) => product.compatibleModel)
        : products
            .filter((product) => product.compatibleBrand === brand)
            .map((product) => product.compatibleModel);

    if (!availableModels.includes(selectedModel)) {
      setSelectedModel("All models");
    }
  };

  return (
    <div className="space-y-8">
      <div className="panel rounded-lg p-5">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-accent-strong)]">
                Browse the catalog
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
                Every part type sits on its own shelf. Use brand, model, and category filters to narrow the
                catalog without losing the grouped storefront structure.
              </p>
            </div>
            <p className="text-sm font-medium text-white/62">{filteredProducts.length} products shown</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm">
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/44">
                Car brand
              </span>
              <select
                value={selectedBrand}
                onChange={(event) => {
                  const brand = event.target.value;
                  setSelectedBrand(brand);
                  resetModelIfHidden(brand);
                }}
                className="min-h-11 w-full rounded-lg border border-white/[0.08] bg-black/20 px-3 text-white outline-none transition focus:border-[var(--color-accent)]"
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand} className="bg-slate-950 text-white">
                    {brand}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm">
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/44">
                Car model
              </span>
              <select
                value={selectedModel}
                onChange={(event) => setSelectedModel(event.target.value)}
                className="min-h-11 w-full rounded-lg border border-white/[0.08] bg-black/20 px-3 text-white outline-none transition focus:border-[var(--color-accent)]"
              >
                {models.map((model) => (
                  <option key={model} value={model} className="bg-slate-950 text-white">
                    {model}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm">
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/44">
                Category
              </span>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="min-h-11 w-full rounded-lg border border-white/[0.08] bg-black/20 px-3 text-white outline-none transition focus:border-[var(--color-accent)]"
              >
                <option value="All categories" className="bg-slate-950 text-white">
                  All categories
                </option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.name} className="bg-slate-950 text-white">
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setSelectedCategory("All categories")}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            selectedCategory === "All categories"
              ? "border-transparent bg-[var(--color-accent)] text-slate-950"
              : "border-white/10 bg-white/[0.03] text-white/72 hover:border-white/24 hover:text-white"
          }`}
        >
          All shelves
        </button>
        {categories.map((category) => (
          <button
            key={category.slug}
            type="button"
            onClick={() => setSelectedCategory(category.name)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              selectedCategory === category.name
                ? "border-transparent bg-[var(--color-accent)] text-slate-950"
                : "border-white/10 bg-white/[0.03] text-white/72 hover:border-white/24 hover:text-white"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="space-y-10">
        {groupedProducts.length > 0 ? (
          groupedProducts.map((category) => (
            <section key={category.slug} className="space-y-5">
              <div className="flex flex-col gap-3 border-b border-white/[0.08] pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-strong)]">
                    Shelf
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{category.name}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/58">{category.description}</p>
                </div>
                <p className="text-sm font-medium text-white/48">{category.products.length} items</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {category.products.map((product) => (
                  <PartCard key={product.sku} part={product} />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="panel rounded-lg p-6 text-center">
            <p className="text-lg font-semibold text-white">No matching parts found.</p>
            <p className="mt-3 text-sm leading-6 text-white/58">
              Try a different brand, model, or category to bring the catalog back into view.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
