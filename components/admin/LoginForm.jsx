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
      setError("密码不正确，请重新输入。");
      return;
    }
    window.location.href = "/admin";
  }

  return (
    <main className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <img src={logo} alt="Yankun Metal Products logo" />
        <h1>网站后台管理</h1>
        <p>管理产品、分类、文章、首页轮播、页面图片和媒体文件。</p>
        <label>
          后台密码
          <input
            autoFocus
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="默认：admin123"
          />
        </label>
        {error ? <span className="admin-error">{error}</span> : null}
        <button type="submit" disabled={busy}>
          {busy ? "正在登录..." : "登录"}
        </button>
      </form>
    </main>
  );
}
