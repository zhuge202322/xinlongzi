import argparse
import re
import sqlite3
import zipfile
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageOps, ImageStat


ROOT = Path(__file__).resolve().parents[1]
DB_PATH = ROOT / "data/yankun_catalog.sqlite"
PRIMARY_ASSET_DIRS = [
    ROOT / "assets/catalog/products",
    ROOT / "public/assets/catalog/products",
]
GALLERY_ASSET_DIRS = [
    ROOT / "assets/catalog/product-gallery",
    ROOT / "public/assets/catalog/product-gallery",
]
IMAGE_PATTERN = re.compile(r"^All_Products/(YK-\d{3})/(.+\.(?:jpe?g|png|webp|tiff?))$", re.I)
SUFFIX_PATTERN = re.compile(r"-(\d+)\.[^.]+$", re.I)


def suffix_number(path: str) -> int:
    match = SUFFIX_PATTERN.search(path)
    return int(match.group(1)) if match else 999


def sorted_images(paths):
    return sorted(paths, key=lambda path: (suffix_number(path), path.lower()))


def image_record(zip_file, path):
    info = zip_file.getinfo(path)
    with Image.open(BytesIO(zip_file.read(path))) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        stat_image = image.copy()
        stat_image.thumbnail((96, 96), Image.Resampling.LANCZOS)
        saturation = ImageStat.Stat(stat_image.convert("HSV")).mean[1]
        width, height = image.size
    return {
        "path": path,
        "width": width,
        "height": height,
        "file_size": info.file_size,
        "suffix": suffix_number(path),
        "saturation": saturation,
    }


def primary_score(record):
    width = record["width"]
    height = record["height"]
    max_dim = max(width, height)
    min_dim = min(width, height)
    aspect = width / height if height else 1

    score = 0
    if max_dim <= 1400 and min_dim >= 420:
        score += 70
    elif max_dim <= 1800 and min_dim >= 420:
        score += 35
    else:
        score += 8

    if 0.62 <= aspect <= 1.75:
        score += 16
    elif 0.45 <= aspect <= 2.15:
        score += 6
    else:
        score -= 8

    score += max(0, 26 - record["saturation"] / 3)
    score -= min(record["suffix"], 12) * 0.65
    if record["suffix"] == 1:
        score += 5
    if max_dim >= 3000:
        score -= 4
    return score


def choose_primary(records):
    return max(records, key=lambda record: (primary_score(record), -record["suffix"], -record["file_size"]))


def save_web_jpg(zip_file, source_path, target_path, max_size=1600, quality=86):
    target_path.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(BytesIO(zip_file.read(source_path))) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        image.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
        image.save(target_path, "JPEG", quality=quality, optimize=True, progressive=True)


def save_web_jpg_many(zip_file, source_path, target_paths, max_size=1600, quality=86):
    with Image.open(BytesIO(zip_file.read(source_path))) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        image.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
        output = BytesIO()
        image.save(output, "JPEG", quality=quality, optimize=True, progressive=True)
        payload = output.getvalue()

    for target_path in target_paths:
        target_path.parent.mkdir(parents=True, exist_ok=True)
        target_path.write_bytes(payload)


def build_archive_index(zip_file):
    archive = {}
    for path in zip_file.namelist():
        if "__MACOSX/" in path or "/._" in path or path.endswith(".DS_Store"):
            continue
        match = IMAGE_PATTERN.match(path)
        if not match:
            continue
        model = match.group(1).upper()
        archive.setdefault(model, []).append(path)
    return {model: sorted_images(paths) for model, paths in archive.items()}


def ensure_schema(connection):
    connection.execute(
        """
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
        )
        """
    )
    connection.execute(
        "CREATE INDEX IF NOT EXISTS idx_product_images_model ON product_images(product_model, sort_order)"
    )
    existing_columns = {row[1] for row in connection.execute("PRAGMA table_info(product_images)").fetchall()}
    for column, definition in {
        "source_file": "TEXT NOT NULL DEFAULT ''",
        "width": "INTEGER NOT NULL DEFAULT 0",
        "height": "INTEGER NOT NULL DEFAULT 0",
        "file_size": "INTEGER NOT NULL DEFAULT 0",
    }.items():
        if column not in existing_columns:
            connection.execute(f"ALTER TABLE product_images ADD COLUMN {column} {definition}")


def main():
    parser = argparse.ArgumentParser(description="Import product photos from 归档.zip into the Longzi catalog database.")
    parser.add_argument("archive", nargs="?", default=str(ROOT / "归档.zip"))
    args = parser.parse_args()

    archive_path = Path(args.archive)
    if not archive_path.exists():
        raise SystemExit(f"Archive not found: {archive_path}")

    for path in PRIMARY_ASSET_DIRS + GALLERY_ASSET_DIRS:
        path.mkdir(parents=True, exist_ok=True)

    connection = sqlite3.connect(DB_PATH)
    connection.execute("PRAGMA foreign_keys = ON")
    ensure_schema(connection)
    products = {
        row[0]: row[1]
        for row in connection.execute("SELECT model, display_name FROM products ORDER BY model_number").fetchall()
    }

    updated = []
    missing = []
    gallery_rows = []

    with zipfile.ZipFile(archive_path) as zip_file:
        archive = build_archive_index(zip_file)

        connection.execute("DELETE FROM product_images")

        for model, display_name in products.items():
            paths = archive.get(model)
            if not paths:
                missing.append(model)
                continue

            records = [image_record(zip_file, path) for path in paths]
            primary = choose_primary(records)
            primary_filename = f"{model.lower()}.jpg"
            primary_src = f"/assets/catalog/products/{primary_filename}"

            save_web_jpg_many(zip_file, primary["path"], [target_dir / primary_filename for target_dir in PRIMARY_ASSET_DIRS])

            connection.execute("UPDATE products SET image = ? WHERE model = ?", (primary_src, model))

            for index, record in enumerate(records, start=1):
                gallery_filename = f"{model.lower()}-{index:02d}.jpg"
                gallery_src = f"/assets/catalog/product-gallery/{gallery_filename}"
                save_web_jpg_many(zip_file, record["path"], [target_dir / gallery_filename for target_dir in GALLERY_ASSET_DIRS])
                gallery_rows.append(
                    (
                        model,
                        gallery_src,
                        f"{display_name} {model} product image {index}",
                        index,
                        1 if record["path"] == primary["path"] else 0,
                        record["path"],
                        record["width"],
                        record["height"],
                        record["file_size"],
                    )
                )

            updated.append((model, primary["path"], len(records)))

    connection.executemany(
        """
        INSERT INTO product_images (
          product_model, src, alt, sort_order, is_primary, source_file, width, height, file_size
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        gallery_rows,
    )
    connection.commit()
    connection.close()

    print(f"Updated primary images: {len(updated)}")
    print(f"Inserted gallery images: {len(gallery_rows)}")
    print(f"Missing archive folders: {', '.join(missing) if missing else 'none'}")
    print("Sample primary choices:")
    for model, source, count in updated[:12]:
        print(f"  {model}: {Path(source).name} ({count} archive images)")


if __name__ == "__main__":
    main()
