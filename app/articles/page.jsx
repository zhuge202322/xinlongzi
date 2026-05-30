import Link from "next/link";
import { getPosts, getSiteMediaValue } from "../../lib/catalog";

export const metadata = {
  title: "Articles",
  description: "Wire storage product sourcing guides and Yankun factory export articles."
};

export const dynamic = "force-dynamic";

export default function ArticlesPage() {
  const posts = getPosts();
  const heroImage = getSiteMediaValue("articles_page_hero", "/assets/gallery/shenzhen-cross-border.jpg");

  return (
    <main>
      <section className="page-hero" style={{ "--hero-image": `url('${heroImage}')` }}>
        <div>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Articles</span>
          </nav>
          <h1>Practical sourcing notes for wire metal product buyers.</h1>
          <p>Articles for importers, private labels and ecommerce sellers who need better questions before asking for price.</p>
        </div>
        <div className="page-hero-card">
          <span>Knowledge center</span>
          <strong>Surface treatment, packaging, sample review and QC topics for B2B buyers.</strong>
          <p>Use these notes to prepare a clearer RFQ and reduce sample revisions.</p>
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <div>
            <div className="section-label">Latest Articles</div>
            <h2>Designed around decisions buyers actually make.</h2>
          </div>
          <p>
            The article section is now database-backed, so the admin can update article titles, categories, content and cover images.
          </p>
        </div>

        <div className="article-grid">
          {posts.map((post, index) => (
            <article className={`article-card reveal ${index === 0 ? "featured" : ""}`} key={post.slug}>
              <div>
                <span>{post.category}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <Link className="text-link" href={`/articles/${post.slug}`}>
                  Read article
                </Link>
              </div>
              {index === 0 && post.featured_image ? <img src={post.featured_image} alt={`${post.title} cover`} /> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <div>
          <h2>Have a sourcing question about wire products?</h2>
          <p>Send the product category and target market, and Yankun can help translate the requirement into factory terms.</p>
        </div>
        <Link className="button-light" href="/inquiry">
          Ask Yankun
        </Link>
      </section>
    </main>
  );
}
