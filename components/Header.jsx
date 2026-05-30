"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cartChangeEvent, cartQuantity, readCart } from "../lib/cart-storage";

const navItems = [
  { href: "/", label: "Home", match: "/" },
  { href: "/products", label: "Products", match: "/products" },
  { href: "/about", label: "About", match: "/about" },
  { href: "/articles", label: "Articles", match: "/articles" },
  { href: "/cart", label: "Cart", match: "/cart" },
  { href: "/inquiry", label: "Inquiry", match: "/inquiry" }
];

export default function Header({ logo = "/assets/yankun-logo.svg" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const sync = () => setCartCount(cartQuantity(readCart()));
    sync();
    window.addEventListener(cartChangeEvent, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(cartChangeEvent, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`} data-header>
      <Link className="brand" href="/" aria-label="Yankun home" onClick={() => setOpen(false)}>
        <img src={logo} alt="Yankun Metal Products logo" />
      </Link>

      <button
        className="nav-toggle"
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="primary-nav"
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={`primary-nav ${open ? "is-open" : ""}`} id="primary-nav" aria-label="Primary navigation">
        {navItems.map((item) => {
          const active = item.match === "/" ? pathname === "/" : pathname.startsWith(item.match);
          const label = item.href === "/cart" && cartCount ? `${item.label} (${cartCount})` : item.label;
          return (
            <Link key={item.href} className={active ? "is-active" : ""} href={item.href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          );
        })}
      </nav>

      <Link className="header-cta" href="/inquiry">
        Request Quote
      </Link>
    </header>
  );
}
