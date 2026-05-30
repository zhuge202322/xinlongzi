import { join } from "node:path";
import Database from "better-sqlite3";

const dbPath = join(process.cwd(), "data/yankun_catalog.sqlite");
let database;

function db() {
  if (!database) {
    database = new Database(dbPath, { fileMustExist: true });
    database.pragma("foreign_keys = ON");
  }
  return database;
}

function plain(record) {
  return record ? Object.fromEntries(Object.entries(record)) : null;
}

function rows(statement, params = {}) {
  return db().prepare(statement).all(params).map(plain);
}

function row(statement, params = {}) {
  return plain(db().prepare(statement).get(params));
}

function modelNumber(model) {
  return Number(String(model || "").match(/(\d+)/)?.[1] || 0);
}

function categoryFor(slug) {
  return row("SELECT * FROM categories WHERE slug = ?", [slug]);
}

export function getAdminContent() {
  return {
    categories: rows("SELECT *, (SELECT COUNT(*) FROM products p WHERE p.category_slug = categories.slug) AS product_count FROM categories ORDER BY sort_order, id"),
    products: rows("SELECT * FROM products ORDER BY sort_order, model_number, id"),
    posts: rows("SELECT * FROM posts ORDER BY date DESC, sort_order, id"),
    heroSlides: rows("SELECT * FROM hero_slides ORDER BY sort_order, id"),
    siteMedia: rows("SELECT * FROM site_media ORDER BY group_name, sort_order, id"),
    mediaLibrary: rows("SELECT * FROM media_library ORDER BY id DESC")
  };
}

export function saveProduct(data) {
  const category = categoryFor(data.category_slug);
  if (!category) throw new Error("Category is required");
  const payload = {
    id: data.id || null,
    model: String(data.model || "").trim(),
    model_number: modelNumber(data.model),
    category_slug: category.slug,
    category_name: category.name,
    category_cn_name: category.cn_name,
    display_name: data.display_name || `${data.model} ${category.short_name}`,
    dimensions: data.dimensions || "",
    weight: data.weight || "",
    source_page: data.source_page || "CMS",
    image: data.image || "",
    short_description: data.short_description || "",
    description: data.description || "",
    sort_order: Number(data.sort_order || 0),
    featured: data.featured ? 1 : 0
  };

  if (!payload.model) throw new Error("Model is required");

  if (payload.id) {
    db()
      .prepare(
        `
        UPDATE products SET
          model = :model,
          model_number = :model_number,
          category_slug = :category_slug,
          category_name = :category_name,
          category_cn_name = :category_cn_name,
          display_name = :display_name,
          dimensions = :dimensions,
          weight = :weight,
          source_page = :source_page,
          image = :image,
          short_description = :short_description,
          description = :description,
          sort_order = :sort_order,
          featured = :featured
        WHERE id = :id
      `
      )
      .run(payload);
    return row("SELECT * FROM products WHERE id = ?", [payload.id]);
  }

  const result = db()
    .prepare(
      `
      INSERT INTO products (
        model, model_number, category_slug, category_name, category_cn_name,
        display_name, dimensions, weight, source_page, image,
        short_description, description, sort_order, featured
      )
      VALUES (
        :model, :model_number, :category_slug, :category_name, :category_cn_name,
        :display_name, :dimensions, :weight, :source_page, :image,
        :short_description, :description, :sort_order, :featured
      )
    `
    )
    .run(payload);
  return row("SELECT * FROM products WHERE id = ?", [result.lastInsertRowid]);
}

export function deleteProduct(id) {
  db().prepare("DELETE FROM products WHERE id = ?").run(id);
}

export function saveCategory(data) {
  const payload = {
    id: data.id || null,
    slug: String(data.slug || "").trim(),
    sort_order: Number(data.sort_order || 0),
    catalog_no: data.catalog_no || "",
    name: data.name || "",
    cn_name: data.cn_name || "",
    short_name: data.short_name || "",
    model_range: data.model_range || "",
    summary: data.summary || "",
    buyer_scenario: data.buyer_scenario || "",
    rfq_focus: data.rfq_focus || "",
    image: data.image || "",
    representative_model: data.representative_model || ""
  };

  if (!payload.slug || !payload.name) throw new Error("Slug and name are required");

  if (payload.id) {
    db()
      .prepare(
        `
        UPDATE categories SET
          slug = :slug,
          sort_order = :sort_order,
          catalog_no = :catalog_no,
          name = :name,
          cn_name = :cn_name,
          short_name = :short_name,
          model_range = :model_range,
          summary = :summary,
          buyer_scenario = :buyer_scenario,
          rfq_focus = :rfq_focus,
          image = :image,
          representative_model = :representative_model
        WHERE id = :id
      `
      )
      .run(payload);
    return row("SELECT * FROM categories WHERE id = ?", [payload.id]);
  }

  const result = db()
    .prepare(
      `
      INSERT INTO categories (
        slug, sort_order, catalog_no, name, cn_name, short_name, model_range,
        summary, buyer_scenario, rfq_focus, image, representative_model
      )
      VALUES (
        :slug, :sort_order, :catalog_no, :name, :cn_name, :short_name, :model_range,
        :summary, :buyer_scenario, :rfq_focus, :image, :representative_model
      )
    `
    )
    .run(payload);
  return row("SELECT * FROM categories WHERE id = ?", [result.lastInsertRowid]);
}

export function savePost(data) {
  const payload = {
    id: data.id || null,
    slug: String(data.slug || "").trim(),
    title: data.title || "",
    category: data.category || "Article",
    excerpt: data.excerpt || "",
    content: data.content || "",
    featured_image: data.featured_image || "",
    date: data.date || new Date().toISOString().slice(0, 10),
    published: data.published === false || data.published === 0 ? 0 : 1,
    sort_order: Number(data.sort_order || 0)
  };
  if (!payload.slug || !payload.title) throw new Error("Slug and title are required");

  if (payload.id) {
    db()
      .prepare(
        `
        UPDATE posts SET
          slug = :slug,
          title = :title,
          category = :category,
          excerpt = :excerpt,
          content = :content,
          featured_image = :featured_image,
          date = :date,
          published = :published,
          sort_order = :sort_order
        WHERE id = :id
      `
      )
      .run(payload);
    return row("SELECT * FROM posts WHERE id = ?", [payload.id]);
  }

  const result = db()
    .prepare(
      `
      INSERT INTO posts (slug, title, category, excerpt, content, featured_image, date, published, sort_order)
      VALUES (:slug, :title, :category, :excerpt, :content, :featured_image, :date, :published, :sort_order)
    `
    )
    .run(payload);
  return row("SELECT * FROM posts WHERE id = ?", [result.lastInsertRowid]);
}

export function deletePost(id) {
  db().prepare("DELETE FROM posts WHERE id = ?").run(id);
}

export function saveHeroSlide(data) {
  const payload = {
    id: data.id || null,
    sort_order: Number(data.sort_order || 0),
    label: data.label || "",
    title: data.title || "",
    text: data.text || "",
    href: data.href || "/",
    image: data.image || "",
    alt: data.alt || "",
    active: data.active === false || data.active === 0 ? 0 : 1
  };
  if (!payload.title) throw new Error("Title is required");

  if (payload.id) {
    db()
      .prepare(
        `
        UPDATE hero_slides SET
          sort_order = :sort_order,
          label = :label,
          title = :title,
          text = :text,
          href = :href,
          image = :image,
          alt = :alt,
          active = :active
        WHERE id = :id
      `
      )
      .run(payload);
    return row("SELECT * FROM hero_slides WHERE id = ?", [payload.id]);
  }

  const result = db()
    .prepare(
      `
      INSERT INTO hero_slides (sort_order, label, title, text, href, image, alt, active)
      VALUES (:sort_order, :label, :title, :text, :href, :image, :alt, :active)
    `
    )
    .run(payload);
  return row("SELECT * FROM hero_slides WHERE id = ?", [result.lastInsertRowid]);
}

export function deleteHeroSlide(id) {
  db().prepare("DELETE FROM hero_slides WHERE id = ?").run(id);
}

export function saveSiteMedia(data) {
  const payload = {
    id: data.id,
    src: data.src || "",
    label: data.label || "",
    kind: data.kind || "image",
    group_name: data.group_name || "General",
    sort_order: Number(data.sort_order || 0)
  };
  db()
    .prepare(
      `
      UPDATE site_media SET
        src = :src,
        label = :label,
        kind = :kind,
        group_name = :group_name,
        sort_order = :sort_order
      WHERE id = :id
    `
    )
    .run(payload);
  return row("SELECT * FROM site_media WHERE id = ?", [payload.id]);
}

export function addMedia(src, alt = "", kind = "image") {
  db()
    .prepare("INSERT OR IGNORE INTO media_library (src, alt, kind) VALUES (?, ?, ?)")
    .run(src, alt, kind);
  return row("SELECT * FROM media_library WHERE src = ?", [src]);
}
