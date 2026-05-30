import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost, getPosts, getSiteMediaValue } from "../../../lib/catalog";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const routeParams = await params;
  const post = getPost(routeParams.slug);
  if (!post) return { title: "Article Not Found" };

  return {
    title: post.title,
    description: post.excerpt
  };
}

export default async function ArticleDetailPage({ params }) {
  const routeParams = await params;
  const post = getPost(routeParams.slug);
  if (!post) notFound();

  const related = getPosts().filter((item) => item.slug !== post.slug).slice(0, 3);
  const heroImage = post.featured_image || getSiteMediaValue("article_detail_hero", "/assets/products/storage-baskets.jpg");
  const catalogHref = getSiteMediaValue("catalog_pdf", "/assets/downloads/yankun-metal-catalog.pdf");

  return (
    <main>
      <section className="page-hero" style={{ "--hero-image": `url('${heroImage}')` }}>
        <div>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/articles">Articles</Link>
            <span>/</span>
            <span>{post.category}</span>
          </nav>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
        </div>
        <div className="page-hero-card">
          <span>{post.category}</span>
          <strong>Buyer-focused sourcing note from Yankun&apos;s wire product knowledge base.</strong>
          <p>{post.date ? `Published ${post.date}` : "Updated by the admin dashboard."}</p>
        </div>
      </section>

      <section className="section">
        <div className="article-layout">
          <article className="article-body reveal" dangerouslySetInnerHTML={{ __html: post.content }} />

          <aside className="article-sidebar reveal">
            <h3>Article summary</h3>
            <p>{post.excerpt}</p>
            <Link href="/products?category=storage#category-products">Browse products</Link>
            <Link href="/inquiry">Send RFQ</Link>
            <a href={catalogHref} download>
              Download catalog
            </a>
          </aside>
        </div>
      </section>

      <section className="section intro-section">
        <div className="section-head reveal">
          <div>
            <div className="section-label">Related Topics</div>
            <h2>Continue preparing your sourcing brief.</h2>
          </div>
          <p>These article cards are pulled from the same SQLite CMS table used by the admin backend.</p>
        </div>
        <div className="resource-grid">
          {related.map((item) => (
            <Link className="resource-item reveal" href={`/articles/${item.slug}`} key={item.slug}>
              <span>{item.category}</span>
              <strong>{item.title}</strong>
              <p>{item.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <div>
          <h2>Have a basket project ready for quotation?</h2>
          <p>Send photos, quantity, finish and packaging plan to start a practical factory discussion.</p>
        </div>
        <Link className="button-light" href="/inquiry">
          Prepare RFQ
        </Link>
      </section>
    </main>
  );
}
