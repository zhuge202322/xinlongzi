import ProductCatalog from "../../components/ProductCatalog";
import ProductLineCards from "../../components/ProductLineCards";
import { getCatalogStats, getCategories, getProducts } from "../../lib/catalog";

export const metadata = {
  title: "Products",
  description:
    "Browse Yankun bathroom shelves, storage baskets, home storage shelves, kitchen racks, pet cages and mesh rack product lines from the SQLite product catalog."
};

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const categories = getCategories();
  const products = getProducts("all");
  const stats = getCatalogStats();
  const requestedCategory = params?.category || "all";
  const initialCategory = categories.some((category) => category.slug === requestedCategory) ? requestedCategory : "all";

  return (
    <main>
      <section className="page-hero" style={{ "--hero-image": "url('/assets/gallery/canton-fair-booth.jpg')" }}>
        <div>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>Products</span>
          </nav>
          <h1>Wire metal product lines for repeatable B2B sourcing.</h1>
          <p>
            Browse Yankun&apos;s six PDF catalog categories, compare buyer-fit details and open model-level product cards before
            sending a structured inquiry.
          </p>
        </div>
        <div className="page-hero-card">
          <span>Factory direct range</span>
          <strong>Bathroom, storage, kitchen, pet and outdoor wire products.</strong>
          <p>Catalog SKUs, private label adjustments and ODM development are supported from the Yuyao factory.</p>
        </div>
      </section>

      <section className="page-kpis" aria-label="Product sourcing signals">
        <div>
          <span>{stats.product_count}</span>
          <p>Catalog models stored in SQLite with model, size, weight, image and source page.</p>
        </div>
        <div>
          <span>{categories.length}</span>
          <p>PDF product series: bathroom shelf, storage basket, home shelf, kitchen basket, pet products and mesh rack.</p>
        </div>
        <div>
          <span>YK</span>
          <p>
            Continuous model range from {stats.first_model} to {stats.last_model} for sourcing, sampling and quotation conversations.
          </p>
        </div>
      </section>

      <section className="section product-section">
        <div className="section-head reveal">
          <div>
            <div className="section-label">Product Directory</div>
            <h2>Choose a category, then browse that category as product cards.</h2>
          </div>
          <p>
            Category cards jump directly to the matching product list. Each product card uses the SQLite database and PDF-derived
            product imagery.
          </p>
        </div>
        <ProductLineCards categories={categories} activeCategory={initialCategory} />
      </section>

      <section className="section intro-section" id="category-products">
        <ProductCatalog categories={categories} products={products} initialCategory={initialCategory} />
      </section>

      <section className="cta-band">
        <div>
          <h2>Need a product sheet with dimensions and cartons?</h2>
          <p>Send target market, quantity and finish preference. Yankun will align samples, pricing and packaging options.</p>
        </div>
        <a className="button-light" href="/inquiry">
          Start Inquiry
        </a>
      </section>
    </main>
  );
}
