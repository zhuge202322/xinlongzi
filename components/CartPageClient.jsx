"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cartQuantity, clearCart, readCart, removeCartItem, updateCartItemQuantity } from "../lib/cart-storage";

const salesEmail = "will526394@gmail.com";

function formatCopy(text, values = {}) {
  return String(text || "").replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) => {
    const value = values[key];
    return value === undefined || value === null ? match : String(value);
  });
}

function productUrl(model) {
  if (typeof window === "undefined") return `/products/${model}`;
  return `${window.location.origin}/products/${model}`;
}

function buildMailBody(items, form) {
  const lines = [
    `Name: ${form.get("name")}`,
    `Company: ${form.get("company") || "To be confirmed"}`,
    `Email: ${form.get("email")}`,
    `Destination market: ${form.get("market") || "To be confirmed"}`,
    "",
    "Batch inquiry products:"
  ];

  items.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.model} - ${item.display_name}`,
      `   Category: ${item.category_name || "To be confirmed"}`,
      `   Dimensions: ${item.dimensions || "To be confirmed"}`,
      `   Weight: ${item.weight || "To be confirmed"}`,
      `   Target quantity: ${item.quantity || 1}`,
      `   Product page: ${productUrl(item.model)}`
    );
  });

  lines.push("", "Requirement:", form.get("message") || "Please quote the selected products with MOQ, lead time, finish and packaging options.");
  return lines.join("\n");
}

export default function CartPageClient({ emptyCopy = {}, selectedCopy = {} }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setItems(readCart());
  }, []);

  const totalQuantity = useMemo(() => cartQuantity(items), [items]);

  function updateQuantity(model, quantity) {
    const next = updateCartItemQuantity(model, quantity);
    setItems(next);
  }

  function remove(model) {
    const next = removeCartItem(model);
    setItems(next);
  }

  function clear() {
    const next = clearCart();
    setItems(next);
    setStatus("");
  }

  function submit(event) {
    event.preventDefault();
    if (!items.length) {
      setStatus("Please add at least one product before preparing a batch inquiry.");
      return;
    }
    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }

    const form = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Yankun batch inquiry - ${items.length} products`);
    const body = encodeURIComponent(buildMailBody(items, form));
    setStatus("Opening your email client with the batch inquiry details.");
    window.location.href = `mailto:${salesEmail}?subject=${subject}&body=${body}`;
  }

  if (!items.length) {
    return (
      <section className="section cart-section">
        <div className="cart-empty">
          <div className="section-label">{emptyCopy.eyebrow || "Multi-Product RFQ Form"}</div>
          <h2>{emptyCopy.title || "No products have been selected yet."}</h2>
          <p>{emptyCopy.intro || "Open product detail pages and add the SKUs you want to compare before sending a batch RFQ."}</p>
          <Link className="button-dark" href="/products">
            Browse Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section cart-section">
      <div className="section-head">
        <div>
          <div className="section-label">{selectedCopy.eyebrow || "Multi-Product RFQ Form"}</div>
          <h2>{formatCopy(selectedCopy.title || "{count} selected models prepared for one batch RFQ.", { count: items.length })}</h2>
        </div>
        <p>{formatCopy(selectedCopy.intro || "Confirm quantities, remove unwanted models and prepare one email inquiry with product model, dimensions, weight and product links included automatically.", { count: items.length })}</p>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <article className="cart-item" key={item.model}>
              <Link href={`/products/${item.model}`} className="cart-item-media">
                <img src={item.image} alt={`${item.display_name} product image`} />
              </Link>
              <div className="cart-item-copy">
                <span>{item.category_name}</span>
                <h3>{item.display_name}</h3>
                <dl>
                  <div>
                    <dt>Model</dt>
                    <dd>{item.model}</dd>
                  </div>
                  <div>
                    <dt>Dimensions</dt>
                    <dd>{item.dimensions || "To be confirmed"}</dd>
                  </div>
                  <div>
                    <dt>Weight</dt>
                    <dd>{item.weight || "To be confirmed"}</dd>
                  </div>
                </dl>
                <div className="cart-item-actions">
                  <label>
                    Target quantity
                    <input
                      min="1"
                      type="number"
                      value={item.quantity || 1}
                      onChange={(event) => updateQuantity(item.model, event.target.value)}
                    />
                  </label>
                  <button type="button" onClick={() => remove(item.model)}>
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="cart-rfq">
          <div>
            <span>Batch RFQ</span>
            <strong>{totalQuantity} pcs / units planned across selected models</strong>
            <p>The generated email will include all selected model data and detail-page links.</p>
          </div>

          <form className="cart-rfq-form" onSubmit={submit}>
            <label>
              Name
              <input required name="name" autoComplete="name" placeholder="Your name" />
            </label>
            <label>
              Company email
              <input required type="email" name="email" autoComplete="email" placeholder="name@company.com" />
            </label>
            <label>
              Company
              <input name="company" autoComplete="organization" placeholder="Company name" />
            </label>
            <label>
              Destination market
              <input name="market" placeholder="Example: US, Germany, UAE" />
            </label>
            <label>
              Requirement
              <textarea
                name="message"
                rows="5"
                placeholder="Finish, packaging, target delivery date, compliance request or private-label notes."
              />
            </label>
            <button type="submit">Prepare Batch Inquiry</button>
            <button type="button" className="cart-clear" onClick={clear}>
              Clear Form
            </button>
            {status ? <p className="form-status">{status}</p> : null}
          </form>
        </aside>
      </div>
    </section>
  );
}
