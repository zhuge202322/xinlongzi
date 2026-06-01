import { getCategories, getProduct, getSectionCopy, getSiteMediaValue } from "../../lib/catalog";

export const metadata = {
  title: "Inquiry",
  description: "Send a structured RFQ to Yankun for wire storage baskets, shelves, kitchen racks, pet cages and mesh rack products."
};

export const dynamic = "force-dynamic";

export default async function InquiryPage({ searchParams }) {
  const params = await searchParams;
  const categories = getCategories();
  const selectedProduct = params?.product ? getProduct(params.product) : null;
  const heroImage = getSiteMediaValue("inquiry_page_hero", "/assets/factory/raw-material-area.jpg");
  const catalogHref = getSiteMediaValue("catalog_pdf", "/assets/downloads/yankun-metal-catalog.pdf");
  const heroCopy = getSectionCopy("inquiry_hero");
  const resourcesCopy = getSectionCopy("inquiry_resources");
  const nextStepsCopy = getSectionCopy("inquiry_next_steps");

  return (
    <main>
      <section className="page-hero" style={{ "--hero-image": `url('${heroImage}')` }}>
        <div>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>Inquiry</span>
          </nav>
          <h1>{heroCopy.title}</h1>
          <p>{heroCopy.intro}</p>
        </div>
        <div className="page-hero-card">
          <span>Direct contact</span>
          <strong>
            will526394@gmail.com
            <br />
            +86 13065891326
          </strong>
          <p>Ningbo Yankun Metal Products Co., LTD, Yuyao City, Zhejiang Province, China.</p>
        </div>
      </section>

      <section className="section">
        <div className="inquiry-layout">
          <form className="inquiry-form inquiry-page-form reveal" data-inquiry-form>
            <label>
              Name
              <input required name="name" autoComplete="name" placeholder="Your name" />
            </label>
            <label>
              Company email
              <input required type="email" name="email" autoComplete="email" placeholder="name@company.com" />
            </label>
            <label>
              Product interest
              <select name="product" defaultValue={selectedProduct ? `${selectedProduct.model} ${selectedProduct.category_name}` : ""}>
                {selectedProduct ? (
                  <option value={`${selectedProduct.model} ${selectedProduct.category_name}`}>
                    {selectedProduct.model} {selectedProduct.category_name} - {selectedProduct.dimensions}, {selectedProduct.weight}
                  </option>
                ) : null}
                {categories.map((category) => (
                  <option key={category.slug} value={`${category.name} (${category.model_range})`}>
                    {category.name} ({category.model_range})
                  </option>
                ))}
                <option value="Other / custom product">Other / custom product</option>
              </select>
            </label>
            <label>
              Target quantity
              <input name="quantity" inputMode="numeric" placeholder="Example: 3,000 pcs" />
            </label>
            <label>
              Finish preference
              <select name="finish">
                <option>Matte black powder coating</option>
                <option>White powder coating</option>
                <option>Chrome plating</option>
                <option>Dipping coating</option>
                <option>To be confirmed</option>
              </select>
            </label>
            <label>
              Packaging
              <select name="packaging">
                <option>Retail color box</option>
                <option>Kraft ecommerce box</option>
                <option>Private label sleeve</option>
                <option>Bulk master carton</option>
                <option>To be confirmed</option>
              </select>
            </label>
            <label className="span-2">
              Requirement
              <textarea
                required
                name="message"
                rows="6"
                placeholder="Share model, dimensions, photos, finish, packaging, target market, compliance concerns and expected ship date."
              />
            </label>
            <button type="submit">Prepare Email Inquiry</button>
            <p className="form-status" data-form-status />
          </form>

          <aside className="inquiry-side reveal">
            <h3>RFQ checklist</h3>
            <p>For faster feedback, include these details in your first message:</p>
            <ul className="check-list">
              <li>
                <strong>Product</strong> PDF model, photo, drawing or application scenario.
              </li>
              <li>
                <strong>Quantity</strong> First order quantity and expected repeat volume.
              </li>
              <li>
                <strong>Finish</strong> Powder color, chrome, dipping, plating or polishing requirement.
              </li>
              <li>
                <strong>Packaging</strong> Color box, kraft box, label, barcode and carton mark.
              </li>
              <li>
                <strong>Market</strong> Destination country and any retailer or platform requirements.
              </li>
            </ul>
            <a href={catalogHref} download>
              Download catalog first
            </a>
          </aside>
        </div>
      </section>

      <section className="section resources-section" id="resources">
        <div className="section-head reveal">
          <div>
            <div className="section-label">{resourcesCopy.eyebrow}</div>
            <h2>{resourcesCopy.title}</h2>
          </div>
          <p>{resourcesCopy.intro}</p>
        </div>
        <div className="resource-grid">
          <a className="resource-item reveal" href={catalogHref} download>
            <span>PDF Catalog</span>
            <strong>Yankun Metal Catalog 2025</strong>
            <p>Six product lines covering bathroom, storage, home, kitchen, pet and mesh rack products.</p>
          </a>
          <a className="resource-item reveal" href="/products">
            <span>Product Directory</span>
            <strong>Browse category details</strong>
            <p>Compare product cards, dimensions, weights and RFQ focus before sending a requirement.</p>
          </a>
          <a className="resource-item reveal" href="/articles/wire-storage-basket-rfq">
            <span>Sourcing Guide</span>
            <strong>How to write a better RFQ</strong>
            <p>Learn what import buyers should confirm when sourcing wire storage baskets.</p>
          </a>
        </div>
      </section>

      <section className="section intro-section">
        <div className="section-head reveal">
          <div>
            <div className="section-label">{nextStepsCopy.eyebrow}</div>
            <h2>{nextStepsCopy.title}</h2>
          </div>
          <p>{nextStepsCopy.intro}</p>
        </div>
        <div className="package-flow">
          <article className="reveal">
            <span>01</span>
            <h3>Requirement review</h3>
            <p>Product use, quantity, finish, package and market details are checked for quotation feasibility.</p>
          </article>
          <article className="reveal">
            <span>02</span>
            <h3>Sample alignment</h3>
            <p>Catalog sample, adjusted drawing or buyer sample is confirmed before production planning.</p>
          </article>
          <article className="reveal">
            <span>03</span>
            <h3>Quotation</h3>
            <p>Price, MOQ, lead time, packaging and payment terms are aligned with the buyer&apos;s order plan.</p>
          </article>
          <article className="reveal">
            <span>04</span>
            <h3>Production and QC</h3>
            <p>Mass production, inspection, packing and shipment photos are prepared for export delivery.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
