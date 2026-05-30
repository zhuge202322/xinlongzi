import { notFound } from "next/navigation";
import Link from "next/link";
import AddToInquiryCart from "../../../components/AddToInquiryCart";
import { getProduct, getRelatedProducts, getSiteMediaValue, sourceLabel } from "../../../lib/catalog";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const routeParams = await params;
  const product = getProduct(routeParams.model);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.model} ${product.category_name}`,
    description: `${product.model} from Yankun ${product.category_name}: ${product.dimensions}, ${product.weight}, sourced from ${product.source_page}.`
  };
}

export default async function ProductDetailPage({ params }) {
  const routeParams = await params;
  const product = getProduct(routeParams.model);
  if (!product) notFound();

  const related = getRelatedProducts(product.model, product.category_slug, 4);
  const catalogHref = getSiteMediaValue("catalog_pdf", "/assets/downloads/yankun-metal-catalog.pdf");

  return (
    <main>
      <section className="detail-hero">
        <div className="detail-media">
          <img src={product.image} alt={`${product.display_name} catalog image`} />
        </div>
        <div className="detail-summary">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/products">Products</Link>
            <span>/</span>
            <span>{product.model}</span>
          </nav>
          <div className="section-label">SQLite Catalog Product</div>
          <h1>{product.display_name}</h1>
          <p>
            {product.model} is a real model from the Yankun Metal PDF catalog under {product.category_name}. Extracted catalog
            data: {product.dimensions}, {product.weight}, {sourceLabel(product.source_page)}.
          </p>
          <div className="pill-row" aria-label="Product tags">
            <span>{product.category_name}</span>
            <span>{product.model_range}</span>
            <span>{product.dimensions}</span>
            <span>{product.weight}</span>
          </div>
          <div className="detail-actions">
            <Link className="button-dark" href={`/inquiry?product=${product.model}`}>
              Request Quote
            </Link>
            <AddToInquiryCart
              product={{
                model: product.model,
                display_name: product.display_name,
                category_name: product.category_name,
                dimensions: product.dimensions,
                weight: product.weight,
                image: product.image,
                source_page: product.source_page
              }}
            />
            <a className="button-light" href={catalogHref} download>
              Download Catalog
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="detail-grid">
          <div className="reveal">
            <div className="section-label">Product Positioning</div>
            <h2>{product.category_name} model data prepared for importer comparison.</h2>
            <p>
              {product.model} belongs to {product.model_range}. Buyers can compare the PDF dimensions and weight against target
              retail use, then confirm finish, packaging, carton data and MOQ with the factory.
            </p>
            <ul className="feature-list">
              <li>
                <strong>Exact catalog reference</strong>
                The model, series, size, weight and PDF source page are stored together in SQLite for sourcing alignment.
              </li>
              <li>
                <strong>ODM adjustment path</strong>
                Dimensions, wire pitch, handle, coating color and packing can still be adjusted after the baseline model is selected.
              </li>
              <li>
                <strong>Private-label workflow</strong>
                Support for hangtags, labels, barcode placement, instruction sheets, kraft or color boxes and master cartons.
              </li>
            </ul>
          </div>
          <aside className="spec-panel reveal">
            <h3>Database Catalog Data</h3>
            <p>Use these extracted values when sending the first inquiry. Carton and MOQ data should be confirmed with the factory.</p>
            <table className="spec-table">
              <tbody>
                <tr>
                  <th>Model</th>
                  <td>{product.model}</td>
                </tr>
                <tr>
                  <th>Category</th>
                  <td>{product.category_name}</td>
                </tr>
                <tr>
                  <th>Dimensions</th>
                  <td>{product.dimensions}</td>
                </tr>
                <tr>
                  <th>Weight</th>
                  <td>{product.weight}</td>
                </tr>
                <tr>
                  <th>Series range</th>
                  <td>{product.model_range}</td>
                </tr>
                <tr>
                  <th>PDF source</th>
                  <td>{sourceLabel(product.source_page)}</td>
                </tr>
                <tr>
                  <th>Packaging</th>
                  <td>Color box, kraft ecommerce box, sleeve, bulk master carton</td>
                </tr>
              </tbody>
            </table>
          </aside>
        </div>
      </section>

      <section className="section intro-section">
        <div className="section-head reveal">
          <div>
            <div className="section-label">Customization Menu</div>
            <h2>Define the product by usage, not only by size.</h2>
          </div>
          <p>
            The best RFQs include target use, expected retail price band, package style and compliance concerns. That allows the
            factory to balance material, finish and carton cost.
          </p>
        </div>
        <div className="package-flow">
          <article className="reveal">
            <span>01</span>
            <h3>Structure</h3>
            <p>Length, width, height, wire diameter, mesh pitch, rim height, feet and stacking detail.</p>
          </article>
          <article className="reveal">
            <span>02</span>
            <h3>Finish</h3>
            <p>Matte black, white, chrome, dipping coating, electroplating or special color references.</p>
          </article>
          <article className="reveal">
            <span>03</span>
            <h3>Branding</h3>
            <p>Logo label, color box artwork, barcode, insert sheet, carton mark and market language.</p>
          </article>
          <article className="reveal">
            <span>04</span>
            <h3>Shipment</h3>
            <p>Stacking count, inner protection, carton weight, pallet plan and mixed-SKU loading.</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="two-column-section">
          <div className="reveal">
            <div className="section-label">Quality Control Points</div>
            <h2>Inspection focuses on the details that affect buyer returns.</h2>
            <ul className="check-list">
              <li>
                <strong>Dimension consistency</strong> Frame size, base flatness and stacking fit are checked against the approved
                sample.
              </li>
              <li>
                <strong>Weld and edge quality</strong> Joints, burrs and contact points are reviewed before finishing and packing.
              </li>
              <li>
                <strong>Surface finish</strong> Color consistency, coating coverage, gloss level and adhesion are checked by batch.
              </li>
              <li>
                <strong>Packaging integrity</strong> Carton strength, product protection, label content and barcode placement are
                checked before shipment.
              </li>
            </ul>
          </div>
          <div className="quote-panel reveal">
            <h3>What to send for pricing</h3>
            <p>
              Send the catalog model, target quantity, finish, packaging type, destination market and whether you need an adjusted
              size, buyer color or exclusive retail pack.
            </p>
            <Link className="text-link" href={`/inquiry?product=${product.model}`}>
              Prepare RFQ
            </Link>
          </div>
        </div>
      </section>

      <section className="section intro-section">
        <div className="section-head reveal">
          <div>
            <div className="section-label">Related PDF Models</div>
            <h2>Continue comparing nearby models from the same catalog series.</h2>
          </div>
          <p>
            These related products are pulled from the same SQLite category, so buyers can compare dimensions and weight before
            asking for a sample set.
          </p>
        </div>
        <div className="catalog-related">
          {related.map((item) => (
            <article className="small-card reveal" key={item.model}>
              <span>{item.model}</span>
              <h3>{item.display_name}</h3>
              <p>
                {item.dimensions} / {item.weight}
                <br />
                {sourceLabel(item.source_page)}
              </p>
              <Link className="text-link" href={`/products/${item.model}`}>
                View detail
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <div>
          <h2>Ready to quote {product.model}?</h2>
          <p>Send target quantity, finish, packaging preference and destination market for factory review.</p>
        </div>
        <Link className="button-light" href={`/inquiry?product=${product.model}`}>
          Start Inquiry
        </Link>
      </section>
    </main>
  );
}
