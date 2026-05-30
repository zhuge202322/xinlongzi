import sqlite3
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DB_PATH = ROOT / "data/yankun_catalog.sqlite"


HERO_SLIDES = [
    (
        1,
        "Cross-Border Channel",
        "Wire products shown for export buyers",
        "High-resolution exhibition booth view for importers and marketplace sourcing teams.",
        "/about#exhibitions",
        "/assets/gallery/shenzhen-cross-border.jpg",
        "Yankun wire product booth at Shenzhen Cross-Border E-commerce Expo",
    ),
    (
        2,
        "Hardware Fair",
        "Sample-ready shelf and basket programs",
        "Clear booth photography for buyers reviewing product scale, finish and display fit.",
        "/about#exhibitions",
        "/assets/gallery/hangzhou-hardware.jpg",
        "Yankun display booth at Hangzhou Hardware Fair",
    ),
    (
        3,
        "Global Buyers",
        "Export booth, sample desk and MOQ support",
        "Seven recent exhibitions across China trade channels.",
        "/about#exhibitions",
        "/assets/gallery/canton-fair-booth.jpg",
        "Yankun booth at Canton Fair",
    ),
    (
        4,
        "2025 Catalog",
        "Bathroom, kitchen, home and outdoor lines",
        "Download the latest product catalog and shortlist SKUs.",
        "/products",
        "/assets/products/catalog-cover.png",
        "Yankun catalog cover with bathroom shelf products",
    ),
    (
        5,
        "Household Goods Fair",
        "Retail storage ranges in a real booth setting",
        "Bathroom, kitchen and household wire products presented for offline buyer review.",
        "/about#exhibitions",
        "/assets/gallery/shanghai-household-fair.jpg",
        "Yankun booth at Shanghai International Household Goods Fair",
    ),
]


SITE_MEDIA = [
    ("site_logo", "Site logo", "/assets/yankun-logo.svg", "image", "Global", 1),
    ("products_page_hero", "Products page hero", "/assets/gallery/canton-fair-booth.jpg", "image", "Page hero", 10),
    ("inquiry_page_hero", "Inquiry page hero", "/assets/factory/raw-material-area.jpg", "image", "Page hero", 11),
    ("articles_page_hero", "Articles page hero", "/assets/gallery/shenzhen-cross-border.jpg", "image", "Page hero", 12),
    ("article_detail_hero", "Article detail hero", "/assets/products/storage-baskets.jpg", "image", "Page hero", 13),
    ("about_page_hero", "About page hero", "/assets/factory/wire-forming-workshop.jpg", "image", "Page hero", 14),
    ("home_quick_products", "Home quick entry products image", "/assets/products/storage-baskets.jpg", "image", "Home", 20),
    ("home_quick_factory", "Home quick entry factory image", "/assets/factory/raw-material-area.jpg", "image", "Home", 21),
    ("home_quick_catalog", "Home quick entry catalog image", "/assets/products/catalog-cover.png", "image", "Home", 22),
    ("home_contact_background", "Home contact section background", "/assets/factory/raw-material-area.jpg", "image", "Home", 23),
    ("about_exhibition_image", "About overview exhibition image", "/assets/gallery/shanghai-household-fair.jpg", "image", "About", 24),
    ("workflow_video", "Manufacturing workflow video", "/assets/factory/factory-tour.mp4", "video", "Factory", 30),
    ("workflow_poster", "Manufacturing workflow poster", "/assets/factory/wire-forming-workshop.jpg", "image", "Factory", 31),
    ("powder_coating_line", "Powder coating line image", "/assets/factory/powder-coating-line.jpg", "image", "Factory", 32),
    ("raw_material_area", "Raw material area image", "/assets/factory/raw-material-area.jpg", "image", "Factory", 33),
    ("wire_forming_workshop", "Wire forming workshop image", "/assets/factory/wire-forming-workshop.jpg", "image", "Factory", 34),
    ("welding_workshop", "Welding workshop image", "/assets/factory/welding-workshop.jpg", "image", "Factory", 35),
    ("semi_finished_area", "Semi-finished area image", "/assets/factory/semi-finished-area.jpg", "image", "Factory", 36),
    ("gallery_canton", "Canton Fair booth image", "/assets/gallery/canton-fair-booth.jpg", "image", "Exhibitions", 40),
    ("gallery_shanghai", "Shanghai Household Fair image", "/assets/gallery/shanghai-household-fair.jpg", "image", "Exhibitions", 41),
    ("gallery_shenzhen", "Shenzhen Cross-Border Expo image", "/assets/gallery/shenzhen-cross-border.jpg", "image", "Exhibitions", 42),
    ("gallery_hangzhou", "Hangzhou Hardware Fair image", "/assets/gallery/hangzhou-hardware.jpg", "image", "Exhibitions", 43),
    ("gallery_yiwu", "Yiwu Factory Expo image", "/assets/gallery/yiwu-factory-expo.jpg", "image", "Exhibitions", 44),
    ("certificate_yankun", "Yankun ISO certificate", "/assets/certificates/iso9001-yankun-2025.jpg", "image", "Certificates", 50),
    ("certificate_bset", "BSET ISO certificate", "/assets/certificates/iso9001-bset-home-2025.jpg", "image", "Certificates", 51),
    ("catalog_pdf", "Downloadable PDF catalog", "/assets/downloads/yankun-metal-catalog.pdf", "file", "Resources", 60),
]


POSTS = [
    {
        "slug": "wire-storage-basket-rfq",
        "title": "How to Source Stackable Wire Storage Baskets from a China Factory",
        "category": "Sourcing Guide",
        "excerpt": "A step-by-step guide for buyers comparing basket structure, coating, packaging and inspection requirements.",
        "featured_image": "/assets/products/storage-baskets.jpg",
        "date": "2026-05-01",
        "content": """
<p>Stackable wire storage baskets look simple, but a good sourcing brief needs more than an outside dimension and a target price. The buyer and factory need to align on frame strength, stacking detail, coating, carton protection and the way the product will be sold.</p>
<blockquote>Treat the approved sample as the production standard: structure, finish, label and carton should all be confirmed before mass production.</blockquote>
<h2>1. Start from the usage scenario</h2>
<p>A pantry basket, a laundry basket and a closet organizer may use a similar wire structure, but their load expectation, surface finish and packaging strategy can be different. Tell the factory whether the product is for retail shelves, ecommerce delivery, wholesale bundles or a private-label storage system.</p>
<ul><li>For pantry and kitchen use, discuss coating durability and cleaning expectations.</li><li>For closet and laundry use, check handle comfort, stacking stability and carton efficiency.</li><li>For ecommerce, focus on drop protection, inner separators and barcode label accuracy.</li></ul>
<h2>2. Define the basket structure</h2>
<p>Important structural details include wire diameter, mesh pitch, rim reinforcement, base frame, foot design, handle shape and stacking clearance. If the buyer already has a market sample, sending photos from multiple angles can reduce misunderstanding before drawing work begins.</p>
<h2>3. Choose the finish by market position</h2>
<p>Powder coating is common for black and white household storage baskets. Dipping, chrome-like plating and polishing can be selected for different price bands or application needs.</p>
<h2>4. Do not leave packaging until the end</h2>
<p>Packaging affects cost, carton weight, loading quantity and buyer complaints. Confirm whether the product needs a kraft ecommerce box, color retail box, private-label sleeve, barcode label, instruction sheet or bulk master carton.</p>
<h2>5. Inspect the details that create returns</h2>
<p>Before shipment, buyers should ask for checks on frame dimension, weld joints, coating coverage, sharp edges, product cleanliness, label content, carton marks and shipment photos.</p>
""",
    },
    {
        "slug": "wire-product-surface-treatment",
        "title": "Powder coating, dipping, plating or polishing?",
        "category": "Surface Treatment",
        "excerpt": "How to choose a finish for bathroom shelves, kitchen racks and outdoor mesh products.",
        "featured_image": "/assets/factory/powder-coating-line.jpg",
        "date": "2026-04-18",
        "content": "<p>Surface treatment should be chosen by use environment, target price band and retail appearance. Powder coating is common for household products, while dipping, plating and polishing can be selected for special use cases.</p>",
    },
    {
        "slug": "retail-carton-wire-products",
        "title": "Retail carton details that reduce claims",
        "category": "Packaging",
        "excerpt": "Carton strength, barcode labels, inner protection and master carton planning for wire products.",
        "featured_image": "/assets/products/catalog-cover.png",
        "date": "2026-04-02",
        "content": "<p>Packaging affects claims as much as the product itself. Buyers should confirm inner protection, barcode placement, carton mark, carton strength and mixed-SKU loading before mass production.</p>",
    },
    {
        "slug": "wire-product-sample-approval",
        "title": "What to confirm before approving a wire product sample",
        "category": "Sampling",
        "excerpt": "Use a sample as the production contract for structure, finish, label and packing requirements.",
        "featured_image": "/assets/gallery/hangzhou-hardware.jpg",
        "date": "2026-03-21",
        "content": "<p>The approved sample should define structure, coating, edge treatment, accessories, label and packaging. Photos and written notes reduce production ambiguity.</p>",
    },
]


def ensure_column(connection: sqlite3.Connection, table: str, column: str, definition: str) -> None:
    existing = {row[1] for row in connection.execute(f"PRAGMA table_info({table})")}
    if column not in existing:
        connection.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")


def main() -> None:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")

    ensure_column(connection, "products", "short_description", "TEXT NOT NULL DEFAULT ''")
    ensure_column(connection, "products", "description", "TEXT NOT NULL DEFAULT ''")
    ensure_column(connection, "products", "sort_order", "INTEGER NOT NULL DEFAULT 0")
    ensure_column(connection, "products", "featured", "INTEGER NOT NULL DEFAULT 0")

    connection.executescript(
        """
        CREATE TABLE IF NOT EXISTS hero_slides (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          sort_order INTEGER NOT NULL DEFAULT 0,
          label TEXT NOT NULL DEFAULT '',
          title TEXT NOT NULL DEFAULT '',
          text TEXT NOT NULL DEFAULT '',
          href TEXT NOT NULL DEFAULT '/',
          image TEXT NOT NULL DEFAULT '',
          alt TEXT NOT NULL DEFAULT '',
          active INTEGER NOT NULL DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS site_media (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          media_key TEXT NOT NULL UNIQUE,
          label TEXT NOT NULL,
          default_src TEXT NOT NULL,
          src TEXT NOT NULL,
          kind TEXT NOT NULL DEFAULT 'image',
          group_name TEXT NOT NULL DEFAULT 'General',
          sort_order INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          slug TEXT NOT NULL UNIQUE,
          title TEXT NOT NULL,
          category TEXT NOT NULL DEFAULT 'Article',
          excerpt TEXT NOT NULL DEFAULT '',
          content TEXT NOT NULL DEFAULT '',
          featured_image TEXT NOT NULL DEFAULT '',
          date TEXT NOT NULL DEFAULT '',
          published INTEGER NOT NULL DEFAULT 1,
          sort_order INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS media_library (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          src TEXT NOT NULL UNIQUE,
          alt TEXT NOT NULL DEFAULT '',
          kind TEXT NOT NULL DEFAULT 'image',
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_products_sort ON products(sort_order, model_number);
        CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published, date);
        """
    )

    for order, label, title, text, href, image, alt in HERO_SLIDES:
        connection.execute(
            """
            INSERT INTO hero_slides (sort_order, label, title, text, href, image, alt, active)
            SELECT ?, ?, ?, ?, ?, ?, ?, 1
            WHERE NOT EXISTS (SELECT 1 FROM hero_slides WHERE sort_order = ? AND title = ?)
            """,
            (order, label, title, text, href, image, alt, order, title),
        )

    for key, label, src, kind, group_name, sort_order in SITE_MEDIA:
        connection.execute(
            """
            INSERT INTO site_media (media_key, label, default_src, src, kind, group_name, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(media_key) DO UPDATE SET
              label = excluded.label,
              default_src = excluded.default_src,
              kind = excluded.kind,
              group_name = excluded.group_name,
              sort_order = excluded.sort_order
            """,
            (key, label, src, src, kind, group_name, sort_order),
        )

    for index, post in enumerate(POSTS, start=1):
        connection.execute(
            """
            INSERT INTO posts (slug, title, category, excerpt, content, featured_image, date, published, sort_order)
            VALUES (:slug, :title, :category, :excerpt, :content, :featured_image, :date, 1, :sort_order)
            ON CONFLICT(slug) DO UPDATE SET
              category = excluded.category,
              sort_order = excluded.sort_order
            """,
            {**post, "sort_order": index},
        )

    for src in {item[2] for item in SITE_MEDIA} | {slide[5] for slide in HERO_SLIDES}:
        kind = "video" if src.endswith(".mp4") else "file" if src.endswith(".pdf") else "image"
        connection.execute(
            "INSERT OR IGNORE INTO media_library (src, alt, kind) VALUES (?, ?, ?)",
            (src, Path(src).name, kind),
        )

    connection.commit()
    print("CMS tables synced into", DB_PATH)


if __name__ == "__main__":
    main()
