import { cache } from "react";
import { join } from "node:path";
import Database from "better-sqlite3";

const dbPath = join(process.cwd(), "data/yankun_catalog.sqlite");
let database;

function db() {
  if (!database) {
    database = new Database(dbPath, { readonly: true, fileMustExist: true });
    database.pragma("query_only = ON");
  }
  return database;
}

function plain(record) {
  return record ? Object.fromEntries(Object.entries(record)) : null;
}

function rows(statement, params = {}) {
  return db()
    .prepare(statement)
    .all(params)
    .map((record) => plain(record));
}

function row(statement, params = {}) {
  return plain(db().prepare(statement).get(params));
}

export const sourceLabel = (sourcePage) => {
  const page = String(sourcePage || "").match(/page-(\d+)/i)?.[1];
  return page ? `PDF image page ${page} (${sourcePage})` : sourcePage || "PDF catalog";
};

export const getCategories = cache(() =>
  rows(`
    SELECT
      c.*,
      COUNT(p.id) AS product_count
    FROM categories c
    LEFT JOIN products p ON p.category_slug = c.slug
    GROUP BY c.id
    ORDER BY c.sort_order
  `)
);

export const getCategory = cache((slug) =>
  row(
    `
      SELECT
        c.*,
        COUNT(p.id) AS product_count
      FROM categories c
      LEFT JOIN products p ON p.category_slug = c.slug
      WHERE c.slug = :slug
      GROUP BY c.id
    `,
    { slug }
  )
);

export const getProducts = cache((categorySlug = "all") => {
  if (categorySlug && categorySlug !== "all") {
    return rows(
      `
        SELECT p.*, c.model_range, c.short_name, c.buyer_scenario, c.rfq_focus
        FROM products p
        JOIN categories c ON c.slug = p.category_slug
        WHERE p.category_slug = :categorySlug
        ORDER BY p.sort_order, p.model_number
      `,
      { categorySlug }
    );
  }

  return rows(`
    SELECT p.*, c.model_range, c.short_name, c.buyer_scenario, c.rfq_focus
    FROM products p
    JOIN categories c ON c.slug = p.category_slug
    ORDER BY p.sort_order, p.model_number
  `);
});

export const getProduct = cache((model) =>
  row(
    `
      SELECT p.*, c.model_range, c.summary AS category_summary, c.short_name,
             c.buyer_scenario, c.rfq_focus, c.image AS category_image
      FROM products p
      JOIN categories c ON c.slug = p.category_slug
      WHERE UPPER(p.model) = UPPER(:model)
    `,
    { model }
  )
);

export const getRelatedProducts = cache((model, categorySlug, limit = 4) =>
  rows(
    `
      SELECT p.*
      FROM products p
      WHERE p.category_slug = :categorySlug AND UPPER(p.model) != UPPER(:model)
      ORDER BY ABS(p.model_number - (
        SELECT model_number FROM products WHERE UPPER(model) = UPPER(:model)
      )), p.model_number
      LIMIT :limit
    `,
    { model, categorySlug, limit }
  )
);

export const getCatalogStats = cache(() =>
  row(`
    SELECT
      COUNT(*) AS product_count,
      MIN(model) AS first_model,
      MAX(model) AS last_model
    FROM products
  `)
);

export const getHeroSlides = cache(() =>
  rows(`
    SELECT *
    FROM hero_slides
    WHERE active = 1
    ORDER BY sort_order, id
  `)
);

export const getSiteMedia = cache(() =>
  rows(`
    SELECT *
    FROM site_media
    ORDER BY group_name, sort_order, id
  `)
);

export const getSectionContent = cache(() => {
  try {
    return rows(`
      SELECT *
      FROM section_content
      ORDER BY sort_order, id
    `);
  } catch {
    return [];
  }
});

export const getSectionContentMap = cache(() => {
  const sections = getSectionContent();
  return Object.fromEntries(sections.map((item) => [item.content_key, item]));
});

export function getSectionCopy(key, fallback = {}) {
  const item = getSectionContentMap()[key] || {};
  return {
    eyebrow: item.eyebrow || fallback.eyebrow || "",
    title: item.title || fallback.title || "",
    intro: item.intro || fallback.intro || ""
  };
}

export function formatCopy(text, values = {}) {
  return String(text || "").replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) => {
    const value = values[key];
    return value === undefined || value === null ? match : String(value);
  });
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export const getSiteMediaMap = cache(() => {
  const media = getSiteMedia();
  return Object.fromEntries(media.map((item) => [item.media_key, item.src || item.default_src]));
});

export function getSiteMediaValue(key, fallback = "") {
  return getSiteMediaMap()[key] || fallback;
}

export function applySiteMedia(html) {
  let output = html;
  const mediaMap = getSiteMediaMap();

  for (const item of getSiteMedia()) {
    if (!item.default_src || !item.src || item.default_src === item.src) continue;
    output = output.replaceAll(item.default_src, item.src);
  }
  output = output.replace(/\{\{media:([a-zA-Z0-9_-]+)\}\}/g, (_, key) => mediaMap[key] || "");
  return output;
}

export function applySectionContent(html) {
  const copyMap = getSectionContentMap();
  return html.replace(/\{\{copy:([a-zA-Z0-9_-]+):(eyebrow|title|intro)\}\}/g, (_, key, field) =>
    escapeHtml(copyMap[key]?.[field] || "")
  );
}

export const getPosts = cache(() =>
  rows(`
    SELECT *
    FROM posts
    WHERE published = 1
    ORDER BY date DESC, sort_order, id
  `)
);

export const getPost = cache((slug) =>
  row(
    `
      SELECT *
      FROM posts
      WHERE slug = :slug AND published = 1
    `,
    { slug }
  )
);
