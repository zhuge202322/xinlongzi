import { notFound } from "next/navigation";
import Link from "next/link";
import AddToInquiryCart from "../../../components/AddToInquiryCart";
import ProductImageGallery from "../../../components/ProductImageGallery";
import {
  formatCopy,
  getProduct,
  getProductImages,
  getRelatedProducts,
  getSectionCopy,
  getSiteMediaValue,
  sourceLabel
} from "../../../lib/catalog";

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

  const productImages = getProductImages(product.model);
  const galleryImages = productImages.length
    ? productImages
    : [
        {
          src: product.image,
          alt: `${product.display_name} ${product.model} product image`,
          sort_order: 1,
          is_primary: 1
        }
      ];
  const related = getRelatedProducts(product.model, product.category_slug, 4);
  const catalogHref = getSiteMediaValue("catalog_pdf", "/assets/downloads/yankun-metal-catalog.pdf");
  const copyValues = {
    model: product.model,
    display_name: product.display_name,
    model_range: product.model_range,
    category_name: product.category_name,
    dimensions: product.dimensions,
    weight: product.weight,
    source_page: sourceLabel(product.source_page)
  };
  const heroCopy = getSectionCopy("product_detail_hero");
  const positioningCopy = getSectionCopy("product_detail_positioning");
  const customizationCopy = getSectionCopy("product_detail_customization");
  const qualityCopy = getSectionCopy("product_detail_quality");
  const relatedCopy = getSectionCopy("product_detail_related");
  const ctaCopy = getSectionCopy("product_detail_cta");

  return (
    <main>
      <section className="detail-hero">
        <ProductImageGallery images={galleryImages} product={product} />
        <div className="detail-summary">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/products">Products</Link>
            <span>/</span>
            <span>{product.model}</span>
          </nav>
          <div className="section-label">{formatCopy(heroCopy.eyebrow, copyValues)}</div>
          <h1>{formatCopy(heroCopy.title, copyValues)}</h1>
          <p>{formatCopy(heroCopy.intro, copyValues)}</p>
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

      <section className="section product-gallery-section">
        <div className="section-head reveal">
          <div>
            <div className="section-label">Archive Image Set</div>
            <h2>{product.model} complete product photos from the ZIP archive.</h2>
          </div>
          <p>
            This section displays every matched product photo imported from the latest archive, including the selected main image
            and all detail or usage-scene images.
          </p>
        </div>
        <div className="product-image-gallery">
          {galleryImages.map((image, index) => (
            <a href={image.src} target="_blank" rel="noreferrer" className="product-gallery-item" key={image.src}>
              <img src={image.src} alt={image.alt || `${product.display_name} product image ${index + 1}`} loading="lazy" />
              <span>{image.is_primary ? "Main product image" : `Detail image ${String(index + 1).padStart(2, "0")}`}</span>
              {image.source_file || image.width ? (
                <small>
                  {image.source_file ? image.source_file.split("/").pop() : ""}
                  {image.width && image.height ? ` · ${image.width}x${image.height}px` : ""}
                </small>
              ) : null}
            </a>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="detail-grid">
          <div className="reveal">
            <div className="section-label">{positioningCopy.eyebrow}</div>
            <h2>{formatCopy(positioningCopy.title, copyValues)}</h2>
            <p>{formatCopy(positioningCopy.intro, copyValues)}</p>
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
            <div className="section-label">{customizationCopy.eyebrow}</div>
            <h2>{formatCopy(customizationCopy.title, copyValues)}</h2>
          </div>
          <p>{formatCopy(customizationCopy.intro, copyValues)}</p>
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
            <div className="section-label">{qualityCopy.eyebrow}</div>
            <h2>{formatCopy(qualityCopy.title, copyValues)}</h2>
            <p>{formatCopy(qualityCopy.intro, copyValues)}</p>
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
            <div className="section-label">{relatedCopy.eyebrow}</div>
            <h2>{formatCopy(relatedCopy.title, copyValues)}</h2>
          </div>
          <p>{formatCopy(relatedCopy.intro, copyValues)}</p>
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
          <h2>{formatCopy(ctaCopy.title, copyValues)}</h2>
          <p>{formatCopy(ctaCopy.intro, copyValues)}</p>
        </div>
        <Link className="button-light" href={`/inquiry?product=${product.model}`}>
          Start Inquiry
        </Link>
      </section>
    </main>
  );
}
