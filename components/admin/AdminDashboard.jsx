"use client";

import { useEffect, useMemo, useState } from "react";

const tabs = [
  { id: "siteMedia", label: "Page Images" },
  { id: "heroSlides", label: "Hero Carousel" },
  { id: "products", label: "Products" },
  { id: "categories", label: "Categories" },
  { id: "posts", label: "Articles" },
  { id: "mediaLibrary", label: "Media Library" }
];

const fieldConfig = {
  products: [
    ["model", "Model"],
    ["display_name", "Display name"],
    ["category_slug", "Category", "category"],
    ["dimensions", "Dimensions"],
    ["weight", "Weight"],
    ["source_page", "PDF source"],
    ["image", "Product image", "image"],
    ["short_description", "Short description", "textarea"],
    ["description", "Description", "textarea"],
    ["sort_order", "Sort order", "number"],
    ["featured", "Featured", "checkbox"]
  ],
  categories: [
    ["slug", "Slug"],
    ["sort_order", "Sort order", "number"],
    ["catalog_no", "Catalog no."],
    ["name", "Name"],
    ["cn_name", "Chinese name"],
    ["short_name", "Short name"],
    ["model_range", "Model range"],
    ["summary", "Summary", "textarea"],
    ["buyer_scenario", "Buyer scenario", "textarea"],
    ["rfq_focus", "RFQ focus", "textarea"],
    ["image", "Category image", "image"],
    ["representative_model", "Representative model"]
  ],
  posts: [
    ["slug", "Slug"],
    ["title", "Title"],
    ["category", "Article category"],
    ["excerpt", "Excerpt", "textarea"],
    ["featured_image", "Featured image", "image"],
    ["date", "Date"],
    ["content", "Content HTML", "textarea-large"],
    ["sort_order", "Sort order", "number"],
    ["published", "Published", "checkbox"]
  ],
  heroSlides: [
    ["sort_order", "Sort order", "number"],
    ["label", "Small label"],
    ["title", "Slide title"],
    ["text", "Slide copy", "textarea"],
    ["href", "Link"],
    ["image", "Slide image", "image"],
    ["alt", "Image alt text"],
    ["active", "Active", "checkbox"]
  ],
  siteMedia: [
    ["group_name", "Group"],
    ["label", "Label"],
    ["kind", "Kind"],
    ["src", "Current URL", "image"],
    ["default_src", "Default URL", "readonly"],
    ["sort_order", "Sort order", "number"]
  ]
};

function blankFor(tab, content) {
  if (tab === "products") {
    const category = content.categories?.[0];
    return {
      model: "",
      display_name: "",
      category_slug: category?.slug || "",
      dimensions: "",
      weight: "",
      source_page: "CMS",
      image: "",
      short_description: "",
      description: "",
      sort_order: 0,
      featured: 0
    };
  }
  if (tab === "categories") {
    return {
      slug: "",
      catalog_no: "",
      name: "",
      cn_name: "",
      short_name: "",
      model_range: "",
      summary: "",
      buyer_scenario: "",
      rfq_focus: "",
      image: "",
      representative_model: "",
      sort_order: 0
    };
  }
  if (tab === "posts") {
    return {
      slug: "",
      title: "",
      category: "Article",
      excerpt: "",
      content: "",
      featured_image: "",
      date: new Date().toISOString().slice(0, 10),
      published: 1,
      sort_order: 0
    };
  }
  if (tab === "heroSlides") {
    return { sort_order: 0, label: "", title: "", text: "", href: "/", image: "", alt: "", active: 1 };
  }
  return {};
}

function titleFor(tab, item) {
  if (!item) return "New item";
  if (tab === "products") return `${item.model || "Product"} ${item.display_name || ""}`;
  if (tab === "categories") return item.name || item.slug;
  if (tab === "posts") return item.title || item.slug;
  if (tab === "heroSlides") return item.title || item.label;
  if (tab === "siteMedia") return `${item.group_name}: ${item.label}`;
  return item.src || item.id;
}

export default function AdminDashboard() {
  const [content, setContent] = useState(null);
  const [tab, setTab] = useState("siteMedia");
  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const response = await fetch("/api/admin/content", { cache: "no-store" });
    if (response.status === 401) {
      window.location.href = "/admin/login";
      return;
    }
    const data = await response.json();
    setContent(data);
    const first = data[tab]?.[0] || null;
    setSelectedId(first?.id || null);
    setDraft(first);
  }

  const list = content?.[tab] || [];
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return list;
    return list.filter((item) => JSON.stringify(item).toLowerCase().includes(needle));
  }, [list, query]);

  function select(nextTab, item = null) {
    setTab(nextTab);
    const target = item || content?.[nextTab]?.[0] || null;
    setSelectedId(target?.id || null);
    setDraft(target);
    setQuery("");
    setStatus("");
  }

  function update(key, value) {
    setDraft((current) => ({ ...(current || {}), [key]: value }));
  }

  async function save() {
    if (!draft) return;
    setBusy(true);
    setStatus("");
    const method = draft.id ? "PATCH" : "POST";
    const response = await fetch("/api/admin/content", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: tab, data: draft })
    });
    const payload = await response.json();
    setBusy(false);
    if (!response.ok) {
      setStatus(payload.error || "Save failed");
      return;
    }
    setContent(payload.content);
    setDraft(payload.item);
    setSelectedId(payload.item?.id || null);
    setStatus("Saved.");
  }

  async function remove() {
    if (!draft?.id || !confirm("Delete this item?")) return;
    setBusy(true);
    const response = await fetch("/api/admin/content", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: tab, id: draft.id })
    });
    const payload = await response.json();
    setBusy(false);
    if (!response.ok) {
      setStatus(payload.error || "Delete failed");
      return;
    }
    setContent(payload.content);
    const first = payload.content[tab]?.[0] || null;
    setDraft(first);
    setSelectedId(first?.id || null);
    setStatus("Deleted.");
  }

  async function upload(key, file) {
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    setBusy(true);
    const response = await fetch("/api/admin/upload", { method: "POST", body: form });
    const payload = await response.json();
    setBusy(false);
    if (!response.ok) {
      setStatus(payload.error || "Upload failed");
      return;
    }
    if (key !== "unused") update(key, payload.url);
    if (payload.media) {
      setContent((current) => ({
        ...current,
        mediaLibrary: [payload.media, ...(current?.mediaLibrary || []).filter((item) => item.src !== payload.media.src)]
      }));
    }
    setStatus(`Uploaded ${payload.url}`);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  if (!content) {
    return (
      <main className="admin-shell">
        <p className="admin-loading">Loading CMS...</p>
      </main>
    );
  }

  const canCreate = ["products", "categories", "posts", "heroSlides"].includes(tab);
  const canDelete = ["products", "posts", "heroSlides"].includes(tab) && draft?.id;
  const fields = fieldConfig[tab] || [];
  const logo = content.siteMedia?.find((item) => item.media_key === "site_logo")?.src || "/assets/yankun-logo.svg";

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <img src={logo} alt="Yankun Metal Products logo" />
        <strong>Yankun CMS</strong>
        <nav>
          {tabs.map((item) => (
            <button className={tab === item.id ? "active" : ""} type="button" onClick={() => select(item.id)} key={item.id}>
              {item.label}
              <span>{content[item.id]?.length || 0}</span>
            </button>
          ))}
        </nav>
        <a href="/" target="_blank">Open website</a>
        <button type="button" onClick={logout}>Logout</button>
      </aside>

      <section className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <span>Admin Dashboard</span>
            <h1>{tabs.find((item) => item.id === tab)?.label}</h1>
          </div>
          <div className="admin-actions">
            {canCreate ? (
              <button type="button" onClick={() => { setDraft(blankFor(tab, content)); setSelectedId(null); }}>
                New
              </button>
            ) : null}
            {canDelete ? <button type="button" className="danger" onClick={remove}>Delete</button> : null}
            {tab !== "mediaLibrary" ? <button type="button" onClick={save} disabled={busy || !draft}>Save</button> : null}
          </div>
        </header>

        {status ? <p className={`admin-status ${status.includes("failed") || status.includes("required") ? "error" : ""}`}>{status}</p> : null}

        <div className="admin-grid">
          <div className="admin-list">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search current panel" />
            <div>
              {filtered.map((item) => (
                <button
                  className={selectedId === item.id ? "active" : ""}
                  type="button"
                  onClick={() => { setSelectedId(item.id); setDraft(item); }}
                  key={item.id || item.src}
                >
                  <strong>{titleFor(tab, item)}</strong>
                  <span>{item.slug || item.media_key || item.group_name || item.kind || item.date}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="admin-editor">
            {tab === "mediaLibrary" ? (
              <MediaPanel upload={upload} media={content.mediaLibrary} />
            ) : draft ? (
              <>
                <div className="admin-editor-head">
                  <h2>{titleFor(tab, draft)}</h2>
                  <p>Changes save to SQLite and are read by the public website immediately on the next request.</p>
                </div>
                {fields.map(([key, label, type]) => (
                  <Field
                    key={key}
                    fieldKey={key}
                    label={label}
                    type={type}
                    value={draft[key]}
                    kind={draft.kind}
                    categories={content.categories}
                    onChange={update}
                    onUpload={upload}
                  />
                ))}
              </>
            ) : (
              <p className="admin-empty">No item selected.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({ fieldKey, label, type, value, kind, categories, onChange, onUpload }) {
  if (type === "readonly") {
    return (
      <label className="admin-field">
        <span>{label}</span>
        <input value={value || ""} readOnly />
      </label>
    );
  }
  if (type === "checkbox") {
    return (
      <label className="admin-check">
        <input type="checkbox" checked={!!value} onChange={(event) => onChange(fieldKey, event.target.checked ? 1 : 0)} />
        <span>{label}</span>
      </label>
    );
  }
  if (type === "category") {
    return (
      <label className="admin-field">
        <span>{label}</span>
        <select value={value || ""} onChange={(event) => onChange(fieldKey, event.target.value)}>
          {categories.map((category) => (
            <option value={category.slug} key={category.slug}>{category.name}</option>
          ))}
        </select>
      </label>
    );
  }
  if (type === "image") {
    const valueString = String(value || "");
    const isVideo = valueString.match(/\.(mp4|webm|mov)$/i);
    const isFile = kind === "file" || valueString.match(/\.(pdf|zip|doc|docx|xls|xlsx)$/i);

    return (
      <label className="admin-field admin-image-field">
        <span>{label}</span>
        <div>
          <input value={value || ""} onChange={(event) => onChange(fieldKey, event.target.value)} placeholder="/assets/... or /uploads/..." />
          <input type="file" accept="image/*,video/*,application/pdf" onChange={(event) => onUpload(fieldKey, event.target.files?.[0])} />
        </div>
        {value ? (
          isVideo ? (
            <video src={value} muted controls />
          ) : isFile ? (
            <a className="admin-file-preview" href={value} target="_blank">Open file</a>
          ) : (
            <img src={value} alt={label} />
          )
        ) : null}
      </label>
    );
  }
  if (type === "textarea" || type === "textarea-large") {
    return (
      <label className="admin-field">
        <span>{label}</span>
        <textarea
          className={type === "textarea-large" ? "large" : ""}
          value={value || ""}
          onChange={(event) => onChange(fieldKey, event.target.value)}
        />
      </label>
    );
  }
  return (
    <label className="admin-field">
      <span>{label}</span>
      <input
        type={type === "number" ? "number" : "text"}
        value={value ?? ""}
        onChange={(event) => onChange(fieldKey, type === "number" ? Number(event.target.value) : event.target.value)}
      />
    </label>
  );
}

function MediaPanel({ media, upload }) {
  return (
    <>
      <div className="admin-editor-head">
        <h2>Media Library</h2>
        <p>Upload images, PDFs or videos, then copy the returned URL into any image field.</p>
      </div>
      <label className="admin-field">
        <span>Upload new media</span>
        <input type="file" accept="image/*,video/*,application/pdf" onChange={(event) => upload("unused", event.target.files?.[0])} />
      </label>
      <div className="admin-media-grid">
        {media.map((item) => (
          <article key={item.id}>
            {item.kind === "video" ? <video src={item.src} muted controls /> : item.kind === "image" ? <img src={item.src} alt={item.alt} /> : <div>FILE</div>}
            <strong>{item.alt || item.src}</strong>
            <code>{item.src}</code>
          </article>
        ))}
      </div>
    </>
  );
}
