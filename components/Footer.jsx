import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <img src="/assets/yankun-logo.svg" alt="Yankun Metal Products logo" />
        <p>Wire metal products manufacturer for global B2B buyers.</p>
      </div>
      <div>
        <strong>Product lines</strong>
        <Link href="/products?category=bathroom#category-products">Bathroom Shelf Series</Link>
        <Link href="/products?category=storage#category-products">Storage Basket Series</Link>
        <Link href="/products?category=home#category-products">Home Storage Shelf Series</Link>
        <Link href="/products?category=kitchen#category-products">Kitchen Storage Basket Series</Link>
        <Link href="/products?category=pet#category-products">Pet Products Series</Link>
        <Link href="/products?category=mesh#category-products">Mesh Rack Series</Link>
      </div>
      <div>
        <strong>Factory</strong>
        <Link href="/about#factory">Manufacturing workflow</Link>
        <Link href="/about#quality">Quality control</Link>
        <Link href="/inquiry#resources">Download catalog</Link>
      </div>
      <div>
        <strong>Contact</strong>
        <a href="mailto:will526394@gmail.com">will526394@gmail.com</a>
        <a href="tel:+8613065891326">+86 13065891326</a>
      </div>
    </footer>
  );
}
