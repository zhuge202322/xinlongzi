import ProductCatalog from "../../components/ProductCatalog";
import ProductLineCards from "../../components/ProductLineCards";
import { getCatalogStats, getCategories, getProducts, getSectionCopy, getSiteMediaValue } from "../../lib/catalog";

export const metadata = {
  title: "Products",
  description:
    "Browse Yankun bathroom shelves, storage baskets, home storage shelves, kitchen racks, pet cages and mesh rack product lines from the SQLite product catalog."
};

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const categories = getCategories();
  const products = getProducts("all");
  const stats = getCatalogStats();
  const heroImage = getSiteMediaValue("products_page_hero", "/assets/gallery/canton-fair-booth.jpg");
  const heroCopy = getSectionCopy("products_hero");
  const directoryCopy = getSectionCopy("products_directory");
  const catalogCopy = getSectionCopy("products_catalog");
  const modelIndexCopy = getSectionCopy("products_model_index");
  const ctaCopy = getSectionCopy("products_cta");
  const requestedCategory = params?.category || "all";
  const initialCategory = categories.some((category) => category.slug === requestedCategory) ? requestedCategory : "all";

  return (
    <main>
      <section className="page-hero" style={{ "--hero-image": `url('${heroImage}')` }}>
        <div>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>Products</span>
          </nav>
          <h1>{heroCopy.title}</h1>
          <p>{heroCopy.intro}</p>
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
            <div className="section-label">{directoryCopy.eyebrow}</div>
            <h2>{directoryCopy.title}</h2>
          </div>
          <p>{directoryCopy.intro}</p>
        </div>
        <ProductLineCards categories={categories} activeCategory={initialCategory} />
      </section>

      <section className="section intro-section" id="category-products">
        <ProductCatalog
          categories={categories}
          products={products}
          initialCategory={initialCategory}
          sectionCopy={catalogCopy}
          modelIndexCopy={modelIndexCopy}
        />
      </section>

      <section className="cta-band">
        <div>
          <h2>{ctaCopy.title}</h2>
          <p>{ctaCopy.intro}</p>
        </div>
        <a className="button-light" href="/inquiry">
          Start Inquiry
        </a>
      </section>
    </main>
  );
}
