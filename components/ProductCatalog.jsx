"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function sourceLabel(sourcePage) {
  const page = String(sourcePage || "").match(/page-(\d+)/i)?.[1];
  return page ? `PDF image page ${page} (${sourcePage})` : sourcePage || "PDF catalog";
}

export default function ProductCatalog({ categories, products, initialCategory = "all" }) {
  const [activeCategory, setActiveCategory] = useState(initialCategory || "all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    setActiveCategory(initialCategory || "all");
  }, [initialCategory]);

  const category = categories.find((item) => item.slug === activeCategory);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return products.filter((product) => {
      const categoryMatch = activeCategory === "all" || product.category_slug === activeCategory;
      const searchTarget = [
        product.model,
        product.display_name,
        product.category_name,
        product.category_cn_name,
        product.dimensions,
        product.weight,
        product.source_page
      ]
        .join(" ")
        .toLowerCase();

      return categoryMatch && (!normalized || searchTarget.includes(normalized));
    });
  }, [activeCategory, products, query]);

  useEffect(() => {
    if (window.location.hash === "#category-products") {
      document.querySelector("#category-products")?.scrollIntoView({ block: "start" });
    }
  }, [initialCategory]);

  const setFilter = (slug) => {
    setActiveCategory(slug);
    const url = new URL(window.location.href);
    if (slug === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", slug);
    url.hash = "category-products";
    window.history.replaceState({}, "", url);
  };

  return (
    <>
      <div className="section-head reveal">
        <div>
          <div className="section-label">Category Product List</div>
          <h2>
            {category
              ? `${category.name} product list: ${category.model_range}`
              : "Browse real Yankun catalog products as image cards."}
          </h2>
        </div>
        <p>
          {category
            ? `${filtered.length} products are shown from the ${category.name} PDF category. Each card includes product image, model name, dimensions, weight and source page for RFQ shortlisting.`
            : "The product cards below are built from the SQLite catalog database. Use filters or search to shortlist exact models before opening a detail page or sending an RFQ."}
        </p>
      </div>

      <div className="catalog-toolbar reveal">
        <label className="catalog-search">
          <span>Search model or size</span>
          <input
            type="search"
            placeholder="Example: YK-040, 260x110, pet"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="catalog-count">
          {filtered.length} of {products.length} SQLite catalog models shown
        </div>
      </div>

      <div className="product-filters reveal" aria-label="PDF model filters">
        <button className={activeCategory === "all" ? "active" : ""} type="button" onClick={() => setFilter("all")}>
          All models
        </button>
        {categories.map((item) => (
          <button
            className={activeCategory === item.slug ? "active" : ""}
            type="button"
            onClick={() => setFilter(item.slug)}
            key={item.slug}
          >
            {item.short_name} ({item.product_count})
          </button>
        ))}
      </div>

      <div className="catalog-product-grid">
        {filtered.map((product) => (
          <Link className="catalog-product-card" href={`/products/${product.model}`} key={product.model}>
            <img src={product.image} alt={`${product.display_name} product image`} loading="lazy" />
            <div>
              <span>{product.model}</span>
              <h3>{product.display_name}</h3>
              <dl>
                <div>
                  <dt>Dimensions</dt>
                  <dd>{product.dimensions}</dd>
                </div>
                <div>
                  <dt>Weight</dt>
                  <dd>{product.weight}</dd>
                </div>
                <div>
                  <dt>Series</dt>
                  <dd>{product.category_name}</dd>
                </div>
                <div>
                  <dt>Source</dt>
                  <dd>{sourceLabel(product.source_page)}</dd>
                </div>
              </dl>
              <strong>View product detail</strong>
            </div>
          </Link>
        ))}
      </div>

      <div className="catalog-index-note">
        <strong>Technical Model Index</strong>
        <p>The card list above is the primary category view. The table below keeps a compact purchasing index for quick comparison.</p>
      </div>

      <div className="catalog-table-wrap">
        <table className="catalog-table">
          <thead>
            <tr>
              <th>Model</th>
              <th>Series</th>
              <th>Dimensions</th>
              <th>Weight</th>
              <th>PDF source</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.model}>
                <td data-label="Model">
                  <Link className="catalog-model-link" href={`/products/${product.model}`}>
                    {product.model}
                  </Link>
                  <span className="category-mark">{product.display_name}</span>
                </td>
                <td data-label="Series">
                  {product.category_name}
                  <span className="category-mark">{product.category_cn_name}</span>
                </td>
                <td data-label="Dimensions">{product.dimensions}</td>
                <td data-label="Weight">{product.weight}</td>
                <td data-label="PDF source">{sourceLabel(product.source_page)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
