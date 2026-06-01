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
    ("site_logo", "Site logo", "/assets/yankun-logo-new.png", "image", "Global", 1),
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
    ("exhibition_carousel_1", "Exhibition carousel image 1", "/assets/gallery/canton-fair-booth.jpg", "image", "Exhibitions", 45),
    ("exhibition_carousel_2", "Exhibition carousel image 2", "/assets/gallery/shanghai-household-fair.jpg", "image", "Exhibitions", 46),
    ("exhibition_carousel_3", "Exhibition carousel image 3", "/assets/gallery/shenzhen-cross-border.jpg", "image", "Exhibitions", 47),
    ("exhibition_carousel_4", "Exhibition carousel image 4", "/assets/gallery/hangzhou-hardware.jpg", "image", "Exhibitions", 48),
    ("exhibition_carousel_5", "Exhibition carousel image 5", "/assets/gallery/yiwu-factory-expo.jpg", "image", "Exhibitions", 49),
    ("exhibition_carousel_6", "Exhibition carousel image 6", "/assets/gallery/canton-fair-booth.jpg", "image", "Exhibitions", 50),
    ("exhibition_carousel_7", "Exhibition carousel image 7", "/assets/gallery/shanghai-household-fair.jpg", "image", "Exhibitions", 51),
    ("exhibition_carousel_8", "Exhibition carousel image 8", "/assets/gallery/shenzhen-cross-border.jpg", "image", "Exhibitions", 52),
    ("certificate_yankun", "Yankun ISO certificate", "/assets/certificates/iso9001-yankun-2025.jpg", "image", "Certificates", 50),
    ("certificate_bset", "BSET ISO certificate", "/assets/certificates/iso9001-bset-home-2025.jpg", "image", "Certificates", 51),
    ("quality_compliance_1", "Quality carousel image 1", "/assets/certificates/iso9001-yankun-2025.jpg", "image", "Quality", 55),
    ("quality_compliance_2", "Quality carousel image 2", "/assets/certificates/iso9001-bset-home-2025.jpg", "image", "Quality", 56),
    ("quality_compliance_3", "Quality carousel image 3", "/assets/factory/raw-material-area.jpg", "image", "Quality", 57),
    ("quality_compliance_4", "Quality carousel image 4", "/assets/factory/welding-workshop.jpg", "image", "Quality", 58),
    ("quality_compliance_5", "Quality carousel image 5", "/assets/factory/powder-coating-line.jpg", "image", "Quality", 59),
    ("quality_compliance_6", "Quality carousel image 6", "/assets/factory/semi-finished-area.jpg", "image", "Quality", 60),
    ("catalog_pdf", "Downloadable PDF catalog", "/assets/downloads/yankun-metal-catalog.pdf", "file", "Resources", 60),
]

SECTION_CONTENT = [
    ("home_intro", "首页", "首页介绍", "What Yankun Builds", "Wire metal storage systems engineered for B2B volume programs.", "Yankun supplies importers, wholesalers, cross-border sellers and retail private labels with wire mesh products that move cleanly from sample approval to batch production.", 10),
    ("home_products", "首页", "产品线", "Product Lines", "Six PDF catalog categories for household, pet and outdoor ranges.", "Each series links to a database-backed category product list with real model images, dimensions, product weight and PDF source page for B2B sourcing.", 20),
    ("home_odm", "首页", "OEM/ODM", "OEM and ODM Desk", "Build your wire product program before sample tooling starts.", "Yankun supports catalog selection, small structure adjustments, surface treatment planning and packaging discussion for importers and private labels.", 30),
    ("home_factory", "首页", "生产流程", "Manufacturing Workflow", "From raw wire to finished export cartons under one factory rhythm.", "Yankun's workflow is designed for repeatable B2B production: controlled material intake, wire forming, welding, coating, assembly and export packing.", 40),
    ("home_quality", "首页", "质量合规", "Quality and Compliance", "Inspection logic built for overseas buyers, not only factory output.", "Quality work focuses on batch consistency, coating reliability, product safety, package integrity and buyer documents.", 50),
    ("home_exhibitions", "首页", "展会足迹", "Exhibition Footprint", "Visible to domestic, export and cross-border buyer channels.", "Yankun keeps product samples visible through regional manufacturing shows, household goods fairs, cross-border channels and Canton Fair buyer meetings.", 60),
    ("home_resources", "首页", "买家资料", "Buyer Resources", "Materials your purchasing team can use before the first call.", "Download the catalog, shortlist product lines and send a structured inquiry with target quantity, finish, packaging and market details.", 70),
    ("home_contact", "首页", "联系询盘", "Contact Yankun", "Send a clear product requirement and get the factory conversation started.", "The more specific the first message is, the faster the team can align model, finish, MOQ, package and sample timing.", 80),

    ("about_hero", "About", "首屏", "", "A Yuyao wire metal factory built around practical export work.", "Ningbo Yankun Metal Products focuses on metal wire shelves, baskets, kitchen racks, pet products and mesh products for importers, wholesalers and private-label buyers.", 110),
    ("about_story", "About", "公司故事", "Company Story", "Small enough to respond, structured enough to support repeat orders.", "Yankun focuses on wire metal products that need hands-on factory control: shelves, baskets, kitchen racks, pet cages and outdoor mesh products.", 120),
    ("about_workflow", "About", "工厂流程", "Factory Workflow", "Production is organized around material, forming, welding, coating, assembly and packing.", "Buyers can discuss the workflow early so product structure, finishing choice and packaging plan are aligned before mass production starts.", 130),
    ("about_photos", "About", "工厂照片", "Factory Photos", "Real workshop scenes from raw wire to surface-treated components.", "The site uses actual project materials and factory photos so buyers can inspect the production environment instead of only reading capability claims.", 140),
    ("about_quality", "About", "质量体系", "Quality System", "Inspection work follows the concerns of overseas buyers.", "Yankun's quality work focuses on approved samples, repeatable batch checks, finish quality, packaging strength and shipment documentation.", 150),
    ("about_exhibitions", "About", "展会", "Exhibitions", "Trade show activity gives buyers a direct sample-review path.", "Yankun has displayed wire metal product lines at household goods, factory expo, cross-border ecommerce, Canton Fair and hardware trade channels.", 160),
    ("about_cta", "About", "底部联系", "", "Want to review factory capability for your product line?", "Send the product category and market requirements, and the team will align samples, documents and timeline.", 170),

    ("products_hero", "产品页", "首屏", "", "Wire metal product lines for repeatable B2B sourcing.", "Browse Yankun's six PDF catalog categories, compare buyer-fit details and open model-level product cards before sending a structured inquiry.", 210),
    ("products_directory", "产品页", "分类目录", "Product Directory", "Choose a category, then browse that category as product cards.", "Category cards jump directly to the matching product list. Each product card uses the SQLite database and PDF-derived product imagery.", 220),
    ("products_catalog", "产品页", "分类产品列表", "Category Product List", "Browse real Yankun catalog products as image cards.", "The product cards below are built from the SQLite catalog database. Use filters, search and pagination to shortlist exact models before opening a detail page or sending an RFQ.", 230),
    ("products_model_index", "产品页", "技术型号索引", "Technical Model Index", "Technical Model Index", "The card list above is the primary category view. The table below keeps a compact purchasing index for quick comparison.", 240),
    ("products_cta", "产品页", "底部询盘", "", "Need a product sheet with dimensions and cartons?", "Send target market, quantity and finish preference. Yankun will align samples, pricing and packaging options.", 250),

    ("product_detail_hero", "产品详情", "首屏", "SQLite Catalog Product", "{display_name}", "{model} is a real model from the Yankun Metal PDF catalog under {category_name}. Extracted catalog data: {dimensions}, {weight}, {source_page}.", 300),
    ("product_detail_positioning", "产品详情", "产品定位", "Product Positioning", "{category_name} model data prepared for importer comparison.", "{model} belongs to {model_range}. Buyers can compare the PDF dimensions and weight against target retail use, then confirm finish, packaging, carton data and MOQ with the factory.", 310),
    ("product_detail_customization", "产品详情", "定制菜单", "Customization Menu", "Define the product by usage, not only by size.", "The best RFQs include target use, expected retail price band, package style and compliance concerns. That allows the factory to balance material, finish and carton cost.", 320),
    ("product_detail_quality", "产品详情", "质检重点", "Quality Control Points", "Inspection focuses on the details that affect buyer returns.", "Dimension consistency, weld quality, coating coverage, edge treatment and packaging integrity are reviewed around the approved sample.", 330),
    ("product_detail_related", "产品详情", "相关型号", "Related PDF Models", "Continue comparing nearby models from the same catalog series.", "These related products are pulled from the same SQLite category, so buyers can compare dimensions and weight before asking for a sample set.", 340),
    ("product_detail_cta", "产品详情", "底部询盘", "", "Ready to quote {model}?", "Send target quantity, finish, packaging preference and destination market for factory review.", 350),

    ("inquiry_hero", "询盘页", "首屏", "", "Send a product requirement that a factory can quote clearly.", "Include target product, quantity, finish, packaging and destination market. Yankun will use the details to align sample review, pricing and production timeline.", 410),
    ("inquiry_resources", "询盘页", "买家资料", "Buyer Resources", "Documents and context that help before the first quote.", "Use these resources to align product category, factory capability and expected buying process before contacting Yankun.", 420),
    ("inquiry_next_steps", "询盘页", "后续流程", "What Happens Next", "A practical path from inquiry to shipment.", "Yankun's communication path is designed for B2B buyers who need clarity on price, sample timeline and export readiness.", 430),

    ("articles_hero", "文章列表", "首屏", "", "Practical sourcing notes for wire metal product buyers.", "Articles for importers, private labels and ecommerce sellers who need better questions before asking for price.", 510),
    ("articles_latest", "文章列表", "最新文章", "Latest Articles", "Designed around decisions buyers actually make.", "The article section is database-backed, so the admin can update article titles, categories, content and cover images.", 520),
    ("articles_cta", "文章列表", "底部询盘", "", "Have a sourcing question about wire products?", "Send the product category and target market, and Yankun can help translate the requirement into factory terms.", 530),

    ("article_detail_related", "文章详情", "相关文章", "Related Topics", "Continue preparing your sourcing brief.", "These article cards are pulled from the same SQLite CMS table used by the admin backend.", 610),
    ("article_detail_cta", "文章详情", "底部询盘", "", "Have a basket project ready for quotation?", "Send photos, quantity, finish and packaging plan to start a practical factory discussion.", 620),

    ("cart_hero", "批量询盘", "首屏", "", "Multi-product inquiry form for batch factory quotation.", "Add several catalog models, confirm target quantities and prepare a single structured email inquiry for faster quotation feedback.", 710),
    ("cart_empty", "批量询盘", "空状态", "Multi-Product RFQ Form", "No products have been selected yet.", "Open product detail pages and add the SKUs you want to compare before sending a batch RFQ.", 720),
    ("cart_selected", "批量询盘", "已选产品", "Multi-Product RFQ Form", "{count} selected models prepared for one batch RFQ.", "Confirm quantities, remove unwanted models and prepare one email inquiry with product model, dimensions, weight and product links included automatically.", 730),
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

        CREATE TABLE IF NOT EXISTS section_content (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          content_key TEXT NOT NULL UNIQUE,
          page_name TEXT NOT NULL DEFAULT '',
          section_name TEXT NOT NULL DEFAULT '',
          eyebrow TEXT NOT NULL DEFAULT '',
          title TEXT NOT NULL DEFAULT '',
          intro TEXT NOT NULL DEFAULT '',
          default_title TEXT NOT NULL DEFAULT '',
          default_intro TEXT NOT NULL DEFAULT '',
          sort_order INTEGER NOT NULL DEFAULT 0
        );

        CREATE INDEX IF NOT EXISTS idx_products_sort ON products(sort_order, model_number);
        CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published, date);
        CREATE INDEX IF NOT EXISTS idx_section_content_sort ON section_content(sort_order, id);
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

    for key, page_name, section_name, eyebrow, title, intro, sort_order in SECTION_CONTENT:
        connection.execute(
            """
            INSERT INTO section_content (
              content_key, page_name, section_name, eyebrow, title, intro,
              default_title, default_intro, sort_order
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(content_key) DO UPDATE SET
              page_name = excluded.page_name,
              section_name = excluded.section_name,
              sort_order = excluded.sort_order,
              default_title = excluded.default_title,
              default_intro = excluded.default_intro
            """,
            (key, page_name, section_name, eyebrow, title, intro, title, intro, sort_order),
        )

    connection.commit()
    print("CMS tables synced into", DB_PATH)


if __name__ == "__main__":
    main()
