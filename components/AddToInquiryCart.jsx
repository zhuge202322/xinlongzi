"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { addCartItem, cartChangeEvent, cartQuantity, readCart } from "../lib/cart-storage";

export default function AddToInquiryCart({ product }) {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const sync = () => setCount(cartQuantity(readCart()));
    sync();
    window.addEventListener(cartChangeEvent, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(cartChangeEvent, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  function addToCart() {
    const next = addCartItem(product);
    setCount(cartQuantity(next));
    setStatus(`${product.model} added to multi-product RFQ form.`);
  }

  return (
    <div className="cart-add-control">
      <button className="button-dark cart-add-button" type="button" onClick={addToCart}>
        Add to RFQ Form
      </button>
      <Link className="button-light cart-link-button" href="/cart">
        View RFQ Form{count ? ` (${count})` : ""}
      </Link>
      {status ? <span>{status}</span> : null}
    </div>
  );
}
