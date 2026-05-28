import json
import sqlite3
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CATALOG_JSON = ROOT / "assets/data/catalog-products.json"
DB_PATH = ROOT / "data/yankun_catalog.sqlite"

CATEGORY_EXTRAS = {
    "bathroom": {
        "short_name": "Bathroom",
        "image": "/assets/catalog/bathroom-cover.jpg",
        "buyer": "Bathroom retail, hotel supply and apartment storage kits",
        "rfq": "Mounting style, load target, coating color and humid-space corrosion expectations",
        "representative_model": "YK-001",
    },
    "storage": {
        "short_name": "Storage",
        "image": "/assets/catalog/storage-cover.jpg",
        "buyer": "Pantry, closet, laundry, utility and ecommerce storage programs",
        "rfq": "Stacking fit, handle style, wire pitch, carton efficiency and private-label packing",
        "representative_model": "YK-040",
    },
    "home": {
        "short_name": "Home Shelf",
        "image": "/assets/catalog/home-cover.jpg",
        "buyer": "Household shelving, desktop organizers, fruit stands and multi-tier rack ranges",
        "rfq": "Tier count, caster option, shelf spacing, retail pack and mixed-SKU assortment",
        "representative_model": "YK-090",
    },
    "kitchen": {
        "short_name": "Kitchen",
        "image": "/assets/catalog/kitchen-cover.jpg",
        "buyer": "Dish racks, draining racks, sink-side storage and kitchen drawer basket ranges",
        "rfq": "Drainage layout, coating choice, utensil accessories, food-contact review and carton artwork",
        "representative_model": "YK-177",
    },
    "pet": {
        "short_name": "Pet",
        "image": "/assets/catalog/pet-cover.jpg",
        "buyer": "Pet supply distributors, crate programs and wire pet accessory sourcing",
        "rfq": "Door style, latch safety, tray fit, folding structure, weld strength and edge treatment",
        "representative_model": "YK-209",
    },
    "mesh": {
        "short_name": "Mesh Rack",
        "image": "/assets/catalog/mesh-cover.jpg",
        "buyer": "Outdoor mesh racks, grill racks, wire panels, fences and project cages",
        "rfq": "Wire diameter, mesh pitch, handle design, heat exposure and corrosion requirements",
        "representative_model": "YK-230",
    },
}

DETAIL_IMAGES = {
    "YK-040": "/assets/catalog/yk040-card.jpg",
    "YK-177": "/assets/catalog/yk177-card.jpg",
    "YK-209": "/assets/catalog/yk209-card.jpg",
    "YK-230": "/assets/catalog/yk230-card.jpg",
}


def product_image(model: str) -> str:
    return DETAIL_IMAGES.get(model, f"/assets/catalog/products/{model.lower()}.jpg")


def main() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with CATALOG_JSON.open(encoding="utf-8") as file:
        catalog = json.load(file)

    if DB_PATH.exists():
        DB_PATH.unlink()

    connection = sqlite3.connect(DB_PATH)
    connection.execute("PRAGMA foreign_keys = ON")
    connection.executescript(
        """
        CREATE TABLE categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          slug TEXT NOT NULL UNIQUE,
          sort_order INTEGER NOT NULL,
          catalog_no TEXT NOT NULL,
          name TEXT NOT NULL,
          cn_name TEXT NOT NULL,
          short_name TEXT NOT NULL,
          model_range TEXT NOT NULL,
          summary TEXT NOT NULL,
          buyer_scenario TEXT NOT NULL,
          rfq_focus TEXT NOT NULL,
          image TEXT NOT NULL,
          representative_model TEXT NOT NULL
        );

        CREATE TABLE products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          model TEXT NOT NULL UNIQUE,
          model_number INTEGER NOT NULL,
          category_slug TEXT NOT NULL,
          category_name TEXT NOT NULL,
          category_cn_name TEXT NOT NULL,
          display_name TEXT NOT NULL,
          dimensions TEXT NOT NULL,
          weight TEXT NOT NULL,
          source_page TEXT NOT NULL,
          image TEXT NOT NULL,
          FOREIGN KEY (category_slug) REFERENCES categories(slug)
        );

        CREATE INDEX idx_products_category ON products(category_slug, model_number);
        CREATE INDEX idx_products_model_number ON products(model_number);
        """
    )

    for index, category in enumerate(catalog["categories"], start=1):
        extra = CATEGORY_EXTRAS[category["slug"]]
        connection.execute(
            """
            INSERT INTO categories (
              slug, sort_order, catalog_no, name, cn_name, short_name, model_range,
              summary, buyer_scenario, rfq_focus, image, representative_model
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                category["slug"],
                index,
                category["no"],
                category["name"],
                category["cn"],
                extra["short_name"],
                category["range"],
                category["summary"],
                extra["buyer"],
                extra["rfq"],
                extra["image"],
                extra["representative_model"],
            ),
        )

    for product in catalog["products"]:
        connection.execute(
            """
            INSERT INTO products (
              model, model_number, category_slug, category_name, category_cn_name,
              display_name, dimensions, weight, source_page, image
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                product["model"],
                product["number"],
                product["categorySlug"],
                product["category"],
                product["categoryCn"],
                product["displayName"],
                product["dimensions"],
                product["weight"],
                product["sourcePage"],
                product_image(product["model"]),
            ),
        )

    connection.commit()
    category_count = connection.execute("SELECT COUNT(*) FROM categories").fetchone()[0]
    product_count = connection.execute("SELECT COUNT(*) FROM products").fetchone()[0]
    connection.close()
    print(f"Seeded {category_count} categories and {product_count} products into {DB_PATH}")


if __name__ == "__main__":
    main()
