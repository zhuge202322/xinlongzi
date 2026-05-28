import Link from "next/link";
import { getProducts, sourceLabel } from "../lib/catalog";

function sampleProducts(products, representativeModel) {
  const representative = products.find((product) => product.model === representativeModel) || products[0];
  return [representative, ...products]
    .filter((product, index, list) => product && list.findIndex((item) => item?.model === product.model) === index)
    .slice(0, 3);
}

export default function ProductLineCards({ categories, compact = false, activeCategory = "all" }) {
  const products = getProducts("all");

  return (
    <>
      <div className="product-filters reveal" aria-label="Product category filters">
        <Link href="/products#category-products" className={activeCategory === "all" ? "active" : ""}>
          All PDF Series
        </Link>
        {categories.map((category) => (
          <Link
            className={activeCategory === category.slug ? "active" : ""}
            key={category.slug}
            href={`/products?category=${category.slug}#category-products`}
          >
            {category.short_name} ({category.product_count})
          </Link>
        ))}
      </div>

      <div className="product-grid">
        {categories.map((category) => {
          const categoryProducts = products.filter((product) => product.category_slug === category.slug);
          const samples = sampleProducts(categoryProducts, category.representative_model);

          return (
            <Link
              className="product-card product-line-card reveal"
              data-category={category.slug}
              href={`/products?category=${category.slug}#category-products`}
              key={category.slug}
            >
              <img src={category.image} alt={`${category.name} catalog products`} />
              <div>
                <span>
                  {category.catalog_no} / {category.name}
                </span>
                <h3>
                  {category.model_range} | {category.product_count} PDF models
                </h3>
                <p>{category.summary}</p>
                {!compact ? (
                  <dl>
                    <dt>Buyer scenario</dt>
                    <dd>{category.buyer_scenario}</dd>
                    <dt>Sample PDF data</dt>
                    <dd>
                      {samples.map((product) => (
                        <span className="sample-line" key={product.model}>
                          {product.model}: {product.dimensions}, {product.weight}
                        </span>
                      ))}
                    </dd>
                    <dt>RFQ focus</dt>
                    <dd>{category.rfq_focus}</dd>
                  </dl>
                ) : (
                  <dl>
                    <dt>PDF source</dt>
                    <dd>{samples[0] ? sourceLabel(samples[0].source_page) : "PDF catalog"}</dd>
                  </dl>
                )}
                <span className="text-link">View {category.name} list</span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
