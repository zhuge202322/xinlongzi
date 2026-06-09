"use client";

import { useMemo, useState } from "react";

export default function ProductImageGallery({ images, product }) {
  const gallery = useMemo(() => {
    const safeImages = Array.isArray(images) && images.length ? images : [{ src: product.image, alt: product.display_name }];
    return safeImages.map((image, index) => ({
      ...image,
      alt: image.alt || `${product.display_name} ${product.model} product image ${index + 1}`,
      label: image.is_primary ? "Main" : `Image ${String(index + 1).padStart(2, "0")}`
    }));
  }, [images, product.display_name, product.image, product.model]);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = gallery[activeIndex] || gallery[0];

  const step = (direction) => {
    setActiveIndex((current) => (current + direction + gallery.length) % gallery.length);
  };

  return (
    <div className="detail-gallery">
      <figure className="detail-media">
        <img src={active.src} alt={active.alt} />
        <figcaption>
          <span>{active.label}</span>
          <strong>
            {activeIndex + 1} / {gallery.length}
          </strong>
        </figcaption>
        {gallery.length > 1 ? (
          <div className="detail-gallery-controls" aria-label="Product image controls">
            <button type="button" onClick={() => step(-1)} aria-label="Previous product image">
              Prev
            </button>
            <button type="button" onClick={() => step(1)} aria-label="Next product image">
              Next
            </button>
          </div>
        ) : null}
      </figure>

      {gallery.length > 1 ? (
        <div className="detail-thumbnails" aria-label={`${product.model} product image thumbnails`}>
          {gallery.map((image, index) => (
            <button
              className={activeIndex === index ? "active" : ""}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${product.model} product image ${index + 1}`}
              key={image.src}
            >
              <img src={image.src} alt="" />
              <span>{image.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
