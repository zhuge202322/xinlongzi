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
        ORDER BY p.model_number
      `,
      { categorySlug }
    );
  }

  return rows(`
    SELECT p.*, c.model_range, c.short_name, c.buyer_scenario, c.rfq_focus
    FROM products p
    JOIN categories c ON c.slug = p.category_slug
    ORDER BY p.model_number
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
