import { join } from "node:path";
import Database from "better-sqlite3";

const dbPath = join(process.cwd(), "data/yankun_catalog.sqlite");
let database;

function db() {
  if (!database) {
    database = new Database(dbPath, { fileMustExist: true });
    database.pragma("foreign_keys = ON");
    ensureProductImagesSchema(database);
  }
  return database;
}

function ensureProductImagesSchema(connection) {
  connection.exec(`
    CREATE TABLE IF NOT EXISTS product_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_model TEXT NOT NULL,
      src TEXT NOT NULL UNIQUE,
      alt TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_primary INTEGER NOT NULL DEFAULT 0,
      source_file TEXT NOT NULL DEFAULT '',
      width INTEGER NOT NULL DEFAULT 0,
      height INTEGER NOT NULL DEFAULT 0,
      file_size INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (product_model) REFERENCES products(model) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_product_images_model ON product_images(product_model, sort_order);
  `);

  const existingColumns = new Set(connection.prepare("PRAGMA table_info(product_images)").all().map((column) => column.name));
  for (const [column, definition] of Object.entries({
    source_file: "TEXT NOT NULL DEFAULT ''",
    width: "INTEGER NOT NULL DEFAULT 0",
    height: "INTEGER NOT NULL DEFAULT 0",
    file_size: "INTEGER NOT NULL DEFAULT 0"
  })) {
    if (!existingColumns.has(column)) connection.prepare(`ALTER TABLE product_images ADD COLUMN ${column} ${definition}`).run();
  }
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
    productImages: rows("SELECT * FROM product_images ORDER BY product_model, sort_order, id"),
    posts: rows("SELECT * FROM posts ORDER BY date DESC, sort_order, id"),
    heroSlides: rows("SELECT * FROM hero_slides ORDER BY sort_order, id"),
    siteMedia: rows("SELECT * FROM site_media ORDER BY group_name, sort_order, id"),
    sectionContent: rows("SELECT * FROM section_content ORDER BY sort_order, id"),
    mediaLibrary: rows("SELECT * FROM media_library ORDER BY id DESC")
  };
}

export function saveProduct(data) {
  const category = categoryFor(data.category_slug);
  if (!category) throw new Error("必须选择产品分类");
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

  if (!payload.model) throw new Error("必须填写产品型号");

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

function productForModel(model) {
  return row("SELECT * FROM products WHERE UPPER(model) = UPPER(?)", [model]);
}

function syncPrimaryImage(productModel) {
  const primary =
    row(
      "SELECT * FROM product_images WHERE product_model = ? AND is_primary = 1 ORDER BY sort_order, id LIMIT 1",
      [productModel]
    ) || row("SELECT * FROM product_images WHERE product_model = ? ORDER BY sort_order, id LIMIT 1", [productModel]);

  if (primary) {
    db().prepare("UPDATE product_images SET is_primary = CASE WHEN id = ? THEN 1 ELSE 0 END WHERE product_model = ?").run(primary.id, productModel);
    db().prepare("UPDATE products SET image = ? WHERE model = ?").run(primary.src, productModel);
  }
}

export function saveProductImage(data) {
  const productModel = String(data.product_model || data.model || "").trim().toUpperCase();
  const product = productForModel(productModel);
  if (!product) throw new Error("必须选择有效的产品型号");

  const payload = {
    id: data.id || null,
    product_model: product.model,
    src: String(data.src || "").trim(),
    alt: data.alt || `${product.display_name} ${product.model} product image`,
    sort_order: Number(data.sort_order || 0),
    is_primary: data.is_primary ? 1 : 0,
    source_file: data.source_file || "",
    width: Number(data.width || 0),
    height: Number(data.height || 0),
    file_size: Number(data.file_size || 0)
  };

  if (!payload.src) throw new Error("必须填写产品图片地址");

  const transaction = db().transaction(() => {
    if (payload.is_primary) {
      db().prepare("UPDATE product_images SET is_primary = 0 WHERE product_model = ?").run(payload.product_model);
    }

    if (payload.id) {
      db()
        .prepare(
          `
          UPDATE product_images SET
            product_model = :product_model,
            src = :src,
            alt = :alt,
            sort_order = :sort_order,
            is_primary = :is_primary,
            source_file = :source_file,
            width = :width,
            height = :height,
            file_size = :file_size
          WHERE id = :id
        `
        )
        .run(payload);
    } else {
      const result = db()
        .prepare(
          `
          INSERT INTO product_images (
            product_model, src, alt, sort_order, is_primary, source_file, width, height, file_size
          )
          VALUES (
            :product_model, :src, :alt, :sort_order, :is_primary, :source_file, :width, :height, :file_size
          )
        `
        )
        .run(payload);
      payload.id = result.lastInsertRowid;
    }

    syncPrimaryImage(payload.product_model);
  });
  transaction();

  return row("SELECT * FROM product_images WHERE id = ?", [payload.id]);
}

export function deleteProductImage(id) {
  const image = row("SELECT * FROM product_images WHERE id = ?", [id]);
  if (!image) return;

  const transaction = db().transaction(() => {
    db().prepare("DELETE FROM product_images WHERE id = ?").run(id);
    syncPrimaryImage(image.product_model);
  });
  transaction();
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

  if (!payload.slug || !payload.name) throw new Error("必须填写分类标识和分类名称");

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
  if (!payload.slug || !payload.title) throw new Error("必须填写文章标识和文章标题");

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
  if (!payload.title) throw new Error("必须填写轮播标题");

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

export function saveSectionContent(data) {
  const payload = {
    id: data.id,
    content_key: data.content_key || "",
    page_name: data.page_name || "",
    section_name: data.section_name || "",
    eyebrow: data.eyebrow || "",
    title: data.title || "",
    intro: data.intro || "",
    default_title: data.default_title || "",
    default_intro: data.default_intro || "",
    sort_order: Number(data.sort_order || 0)
  };
  if (!payload.id) throw new Error("页面文案只能编辑已有板块");

  db()
    .prepare(
      `
      UPDATE section_content SET
        page_name = :page_name,
        section_name = :section_name,
        eyebrow = :eyebrow,
        title = :title,
        intro = :intro,
        default_title = :default_title,
        default_intro = :default_intro,
        sort_order = :sort_order
      WHERE id = :id
    `
    )
    .run(payload);
  return row("SELECT * FROM section_content WHERE id = ?", [payload.id]);
}

export function addMedia(src, alt = "", kind = "image") {
  db()
    .prepare("INSERT OR IGNORE INTO media_library (src, alt, kind) VALUES (?, ?, ?)")
    .run(src, alt, kind);
  return row("SELECT * FROM media_library WHERE src = ?", [src]);
}
