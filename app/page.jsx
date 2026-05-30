import HeroCarousel from "../components/HeroCarousel";
import ProductLineCards from "../components/ProductLineCards";
import { getCategories, getHeroSlides } from "../lib/catalog";
import { homeMainParts } from "../lib/legacy";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const categories = getCategories();
  const slides = getHeroSlides();
  const { before, after } = homeMainParts();

  return (
    <main id="top">
      <HeroCarousel slides={slides} />
      <div dangerouslySetInnerHTML={{ __html: before }} />
      <section className="section product-section" id="products">
        <div className="section-head reveal">
          <div>
            <div className="section-label">Product Lines</div>
            <h2>Six PDF catalog categories for household, pet and outdoor ranges.</h2>
          </div>
          <p>
            Each series links to a database-backed category product list with real model images, dimensions, product weight and PDF
            source page for B2B sourcing.
          </p>
        </div>
        <ProductLineCards categories={categories} />
      </section>
      <div dangerouslySetInnerHTML={{ __html: after }} />
    </main>
  );
}
