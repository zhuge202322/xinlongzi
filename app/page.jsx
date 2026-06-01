import HeroCarousel from "../components/HeroCarousel";
import ProductLineCards from "../components/ProductLineCards";
import { getCategories, getHeroSlides, getSectionCopy } from "../lib/catalog";
import { homeMainParts } from "../lib/legacy";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const categories = getCategories();
  const slides = getHeroSlides();
  const productsCopy = getSectionCopy("home_products");
  const { before, after } = homeMainParts();

  return (
    <main id="top">
      <HeroCarousel slides={slides} />
      <div dangerouslySetInnerHTML={{ __html: before }} />
      <section className="section product-section" id="products">
        <div className="section-head reveal">
          <div>
            <div className="section-label">{productsCopy.eyebrow}</div>
            <h2>{productsCopy.title}</h2>
          </div>
          <p>{productsCopy.intro}</p>
        </div>
        <ProductLineCards categories={categories} />
      </section>
      <div dangerouslySetInnerHTML={{ __html: after }} />
    </main>
  );
}
