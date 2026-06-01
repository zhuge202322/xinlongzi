import Link from "next/link";
import CartPageClient from "../../components/CartPageClient";
import { getSectionCopy, getSiteMediaValue } from "../../lib/catalog";

export const metadata = {
  title: "Multi-Product RFQ Form",
  description: "Review selected Yankun metal wire products and prepare one batch inquiry."
};

export const dynamic = "force-dynamic";

export default function CartPage() {
  const heroImage = getSiteMediaValue("products_page_hero", "/assets/gallery/canton-fair-booth.jpg");
  const heroCopy = getSectionCopy("cart_hero");
  const emptyCopy = getSectionCopy("cart_empty");
  const selectedCopy = getSectionCopy("cart_selected");

  return (
    <main>
      <section className="page-hero" style={{ "--hero-image": `url('${heroImage}')` }}>
        <div>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Multi-Product RFQ</span>
          </nav>
          <h1>{heroCopy.title}</h1>
          <p>{heroCopy.intro}</p>
        </div>
        <div className="page-hero-card">
          <span>Batch inquiry</span>
          <strong>Designed for B2B buyers comparing multiple SKUs, finishes and packaging plans.</strong>
          <p>The selected product list stays in this browser while buyers continue browsing product detail pages.</p>
        </div>
      </section>
      <CartPageClient emptyCopy={emptyCopy} selectedCopy={selectedCopy} />
    </main>
  );
}
