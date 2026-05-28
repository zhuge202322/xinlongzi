"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    href: "/about#exhibitions",
    image: "/assets/gallery/shenzhen-cross-border.jpg",
    alt: "Yankun wire product booth at Shenzhen Cross-Border E-commerce Expo",
    label: "Cross-Border Channel",
    title: "Wire products shown for export buyers",
    text: "High-resolution exhibition booth view for importers and marketplace sourcing teams."
  },
  {
    href: "/about#exhibitions",
    image: "/assets/gallery/hangzhou-hardware.jpg",
    alt: "Yankun display booth at Hangzhou Hardware Fair",
    label: "Hardware Fair",
    title: "Sample-ready shelf and basket programs",
    text: "Clear booth photography for buyers reviewing product scale, finish and display fit."
  },
  {
    href: "/about#exhibitions",
    image: "/assets/gallery/canton-fair-booth.jpg",
    alt: "Yankun booth at Canton Fair",
    label: "Global Buyers",
    title: "Export booth, sample desk and MOQ support",
    text: "Seven recent exhibitions across China trade channels."
  },
  {
    href: "/products",
    image: "/assets/products/catalog-cover.png",
    alt: "Yankun catalog cover with bathroom shelf products",
    label: "2025 Catalog",
    title: "Bathroom, kitchen, home and outdoor lines",
    text: "Download the latest product catalog and shortlist SKUs."
  },
  {
    href: "/about#exhibitions",
    image: "/assets/gallery/shanghai-household-fair.jpg",
    alt: "Yankun booth at Shanghai International Household Goods Fair",
    label: "Household Goods Fair",
    title: "Retail storage ranges in a real booth setting",
    text: "Bathroom, kitchen and household wire products presented for offline buyer review."
  }
];

export default function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((index) => (index + 1) % slides.length), 7000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="banner" className="hero-carousel" aria-label="Featured Yankun programs">
      <div className="piclink_pic" id="container">
        {slides.map((slide, index) => (
          <Link className={index === active ? "active" : ""} href={slide.href} aria-label={slide.title} key={slide.title}>
            <img src={slide.image} alt={slide.alt} />
          </Link>
        ))}
      </div>

      <div className="hero-kicker">
        <span>Factory direct</span>
        <strong>Wire metal solutions for importers, distributors and private labels</strong>
      </div>

      <div className="piclink_text" role="tablist" aria-label="Hero slides">
        {slides.map((slide, index) => (
          <button
            className={index === active ? "active" : ""}
            type="button"
            role="tab"
            aria-selected={index === active}
            onClick={() => setActive(index)}
            key={slide.title}
          >
            <span>{slide.label}</span>
            <strong>{slide.title}</strong>
            <small>{slide.text}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
