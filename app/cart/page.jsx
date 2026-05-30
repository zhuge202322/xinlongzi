import Link from "next/link";
import CartPageClient from "../../components/CartPageClient";
import { getSiteMediaValue } from "../../lib/catalog";

export const metadata = {
  title: "Inquiry Cart",
  description: "Review selected Yankun metal wire products and prepare one batch inquiry."
};

export const dynamic = "force-dynamic";

export default function CartPage() {
  const heroImage = getSiteMediaValue("products_page_hero", "/assets/gallery/canton-fair-booth.jpg");

  return (
    <main>
      <section className="page-hero" style={{ "--hero-image": `url('${heroImage}')` }}>
        <div>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Inquiry Cart</span>
          </nav>
          <h1>Build a multi-product RFQ before contacting the factory.</h1>
          <p>
            Add several catalog models, confirm target quantities and prepare a single structured email inquiry for faster
            quotation feedback.
          </p>
        </div>
        <div className="page-hero-card">
          <span>Batch inquiry</span>
          <strong>Designed for B2B buyers comparing multiple SKUs, finishes and packaging plans.</strong>
          <p>The inquiry cart stays in this browser while buyers continue browsing product detail pages.</p>
        </div>
      </section>
      <CartPageClient />
    </main>
  );
}
