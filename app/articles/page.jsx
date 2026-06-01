import Link from "next/link";
import { getPosts, getSectionCopy, getSiteMediaValue } from "../../lib/catalog";

export const metadata = {
  title: "Articles",
  description: "Wire storage product sourcing guides and Yankun factory export articles."
};

export const dynamic = "force-dynamic";

export default function ArticlesPage() {
  const posts = getPosts();
  const heroImage = getSiteMediaValue("articles_page_hero", "/assets/gallery/shenzhen-cross-border.jpg");
  const heroCopy = getSectionCopy("articles_hero");
  const latestCopy = getSectionCopy("articles_latest");
  const ctaCopy = getSectionCopy("articles_cta");

  return (
    <main>
      <section className="page-hero" style={{ "--hero-image": `url('${heroImage}')` }}>
        <div>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Articles</span>
          </nav>
          <h1>{heroCopy.title}</h1>
          <p>{heroCopy.intro}</p>
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
            <div className="section-label">{latestCopy.eyebrow}</div>
            <h2>{latestCopy.title}</h2>
          </div>
          <p>{latestCopy.intro}</p>
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
          <h2>{ctaCopy.title}</h2>
          <p>{ctaCopy.intro}</p>
        </div>
        <Link className="button-light" href="/inquiry">
          Ask Yankun
        </Link>
      </section>
    </main>
  );
}
