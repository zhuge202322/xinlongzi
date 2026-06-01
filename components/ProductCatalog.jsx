"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const PRODUCTS_PER_PAGE = 16;

function sourceLabel(sourcePage) {
  const page = String(sourcePage || "").match(/page-(\d+)/i)?.[1];
  return page ? `PDF image page ${page} (${sourcePage})` : sourcePage || "PDF catalog";
}

function pageItems(currentPage, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  if (currentPage <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }
  if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 3);
    pages.add(totalPages - 2);
    pages.add(totalPages - 1);
  }

  const sorted = Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  return sorted.reduce((items, page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) items.push("ellipsis");
    items.push(page);
    return items;
  }, []);
}

export default function ProductCatalog({ categories, products, initialCategory = "all", sectionCopy = {}, modelIndexCopy = {} }) {
  const [activeCategory, setActiveCategory] = useState(initialCategory || "all");
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setActiveCategory(initialCategory || "all");
    setCurrentPage(1);
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = filtered.length ? (safePage - 1) * PRODUCTS_PER_PAGE : 0;
  const pageEnd = Math.min(pageStart + PRODUCTS_PER_PAGE, filtered.length);
  const paginatedProducts = filtered.slice(pageStart, pageEnd);
  const pagination = pageItems(safePage, totalPages);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, query]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (window.location.hash === "#category-products") {
      document.querySelector("#category-products")?.scrollIntoView({ block: "start" });
    }
  }, [initialCategory]);

  const setFilter = (slug) => {
    setActiveCategory(slug);
    setCurrentPage(1);
    const url = new URL(window.location.href);
    if (slug === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", slug);
    url.hash = "category-products";
    window.history.replaceState({}, "", url);
  };

  const goToPage = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);
    document.querySelector("#category-products")?.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  return (
    <>
      <div className="section-head reveal">
        <div>
          <div className="section-label">{sectionCopy.eyebrow || "Category Product List"}</div>
          <h2>{sectionCopy.title || (category ? `${category.name} product list: ${category.model_range}` : "Browse real Yankun catalog products as image cards.")}</h2>
        </div>
        <p>{sectionCopy.intro || "The product cards below are built from the SQLite catalog database. Use filters or search to shortlist exact models before opening a detail page or sending an RFQ."}</p>
      </div>

      <div className="catalog-toolbar reveal">
        <label className="catalog-search">
          <span>Search model or size</span>
          <input
            type="search"
            placeholder="Example: YK-040, 260x110, pet"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setCurrentPage(1);
            }}
          />
        </label>
        <div className="catalog-count">
          Showing {filtered.length ? pageStart + 1 : 0}-{pageEnd} of {filtered.length} matched models
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
        {paginatedProducts.map((product) => (
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

      {totalPages > 1 ? (
        <nav className="catalog-pagination" aria-label="Product list pagination">
          <button
            className="catalog-page-button"
            type="button"
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage === 1}
          >
            Previous
          </button>
          <div className="catalog-page-numbers">
            {pagination.map((item, index) =>
              item === "ellipsis" ? (
                <span className="catalog-page-ellipsis" key={`ellipsis-${index}`}>
                  ...
                </span>
              ) : (
                <button
                  className={`catalog-page-button ${safePage === item ? "active" : ""}`}
                  type="button"
                  onClick={() => goToPage(item)}
                  aria-current={safePage === item ? "page" : undefined}
                  key={item}
                >
                  {item}
                </button>
              )
            )}
          </div>
          <button
            className="catalog-page-button"
            type="button"
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage === totalPages}
          >
            Next
          </button>
          <span className="catalog-page-summary">
            Page {safePage} / {totalPages}
          </span>
        </nav>
      ) : null}

      <div className="catalog-index-note">
        <strong>{modelIndexCopy.title || "Technical Model Index"}</strong>
        <p>{modelIndexCopy.intro || "The card list above is the primary category view. The table below keeps a compact purchasing index for quick comparison."}</p>
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
