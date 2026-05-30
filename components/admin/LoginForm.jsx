"use client";

import { useState } from "react";

export default function LoginForm({ logo = "/assets/yankun-logo.svg" }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    setBusy(false);
    if (!response.ok) {
      setError("Password is incorrect.");
      return;
    }
    window.location.href = "/admin";
  }

  return (
    <main className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <img src={logo} alt="Yankun Metal Products logo" />
        <h1>Yankun CMS Admin</h1>
        <p>Manage products, articles, homepage carousel and page section media.</p>
        <label>
          Admin password
          <input
            autoFocus
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Default: admin123"
          />
        </label>
        {error ? <span className="admin-error">{error}</span> : null}
        <button type="submit" disabled={busy}>
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
