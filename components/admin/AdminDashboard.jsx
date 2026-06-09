"use client";

import { useEffect, useMemo, useState } from "react";

const tabs = [
  { id: "sectionContent", label: "页面文案" },
  { id: "siteMedia", label: "页面图片" },
  { id: "heroSlides", label: "首页轮播" },
  { id: "products", label: "产品管理" },
  { id: "categories", label: "分类管理" },
  { id: "posts", label: "文章管理" },
  { id: "mediaLibrary", label: "媒体库" }
];

const fieldConfig = {
  products: [
    ["model", "产品型号"],
    ["display_name", "产品名称"],
    ["category_slug", "所属分类", "category"],
    ["dimensions", "尺寸参数"],
    ["weight", "产品重量"],
    ["source_page", "PDF来源页"],
    ["image", "产品主图", "image"],
    ["short_description", "简短描述", "textarea"],
    ["description", "详情描述", "textarea"],
    ["sort_order", "排序值", "number"],
    ["featured", "推荐产品", "checkbox"]
  ],
  categories: [
    ["slug", "分类标识"],
    ["sort_order", "排序值", "number"],
    ["catalog_no", "目录编号"],
    ["name", "分类名称"],
    ["cn_name", "中文名称"],
    ["short_name", "分类简称"],
    ["model_range", "型号范围"],
    ["summary", "分类简介", "textarea"],
    ["buyer_scenario", "买家场景", "textarea"],
    ["rfq_focus", "询盘重点", "textarea"],
    ["image", "分类图片", "image"],
    ["representative_model", "代表型号"]
  ],
  posts: [
    ["slug", "文章标识"],
    ["title", "文章标题"],
    ["category", "文章分类"],
    ["excerpt", "摘要", "textarea"],
    ["featured_image", "封面图片", "image"],
    ["date", "发布日期"],
    ["content", "正文HTML", "textarea-large"],
    ["sort_order", "排序值", "number"],
    ["published", "发布状态", "checkbox"]
  ],
  heroSlides: [
    ["sort_order", "排序值", "number"],
    ["label", "小标签"],
    ["title", "轮播标题"],
    ["text", "轮播文案", "textarea"],
    ["href", "跳转链接"],
    ["image", "轮播图片", "image"],
    ["alt", "图片说明"],
    ["active", "启用", "checkbox"]
  ],
  siteMedia: [
    ["group_name", "分组"],
    ["label", "名称"],
    ["kind", "类型"],
    ["src", "当前文件地址", "image"],
    ["default_src", "默认文件地址", "readonly"],
    ["sort_order", "排序值", "number"]
  ],
  sectionContent: [
    ["page_name", "所属页面"],
    ["section_name", "板块名称"],
    ["content_key", "文案标识", "readonly"],
    ["eyebrow", "小标签"],
    ["title", "标题", "textarea"],
    ["intro", "介绍", "textarea"],
    ["default_title", "默认标题", "readonly-textarea"],
    ["default_intro", "默认介绍", "readonly-textarea"],
    ["sort_order", "排序值", "number"]
  ]
};

const mediaGroupLabels = {
  About: "关于页面",
  Certificates: "证书",
  Exhibitions: "展会",
  Factory: "工厂",
  Global: "全站",
  Home: "首页",
  "Page hero": "页面首屏",
  Quality: "质量与合规",
  Resources: "资料下载"
};

const mediaLabels = {
  about_exhibition_image: "关于页展会图片",
  about_page_hero: "关于页首屏图",
  article_detail_hero: "文章详情首屏图",
  articles_page_hero: "文章列表首屏图",
  catalog_pdf: "下载目录PDF",
  certificate_bset: "BSET ISO证书",
  certificate_yankun: "Yankun ISO证书",
  gallery_canton: "广交会展位图",
  gallery_hangzhou: "杭州五金展图片",
  gallery_shanghai: "上海百货展图片",
  gallery_shenzhen: "深圳跨境电商展图片",
  gallery_yiwu: "义乌工厂展图片",
  exhibition_carousel_1: "展会轮播图1",
  exhibition_carousel_2: "展会轮播图2",
  exhibition_carousel_3: "展会轮播图3",
  exhibition_carousel_4: "展会轮播图4",
  exhibition_carousel_5: "展会轮播图5",
  exhibition_carousel_6: "展会轮播图6",
  exhibition_carousel_7: "展会轮播图7",
  exhibition_carousel_8: "展会轮播图8",
  home_contact_background: "首页联系区背景图",
  home_quick_catalog: "首页目录入口图片",
  home_quick_factory: "首页工厂入口图片",
  home_quick_products: "首页产品入口图片",
  inquiry_page_hero: "询盘页首屏图",
  powder_coating_line: "喷塑线图片",
  products_page_hero: "产品页首屏图",
  quality_compliance_1: "质量合规轮播图1",
  quality_compliance_2: "质量合规轮播图2",
  quality_compliance_3: "质量合规轮播图3",
  quality_compliance_4: "质量合规轮播图4",
  quality_compliance_5: "质量合规轮播图5",
  quality_compliance_6: "质量合规轮播图6",
  raw_material_area: "原材料区图片",
  semi_finished_area: "半成品区图片",
  site_logo: "网站Logo",
  welding_workshop: "焊接车间图片",
  wire_forming_workshop: "铁线成型车间图片",
  workflow_poster: "生产流程视频封面",
  workflow_video: "生产流程视频"
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
  if (!item) return "新建内容";
  if (tab === "products") return `${item.model || "产品"} ${item.display_name || ""}`;
  if (tab === "categories") return item.name || item.slug;
  if (tab === "posts") return item.title || item.slug;
  if (tab === "heroSlides") return item.title || item.label;
  if (tab === "siteMedia") return `${mediaGroupLabels[item.group_name] || item.group_name}: ${mediaLabels[item.media_key] || item.label}`;
  if (tab === "sectionContent") return `${item.page_name || "页面"}: ${item.section_name || item.content_key}`;
  return item.src || item.id;
}

export default function AdminDashboard() {
  const [content, setContent] = useState(null);
  const [tab, setTab] = useState("sectionContent");
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
  const selectedProductImages = useMemo(() => {
    if (tab !== "products" || !draft?.model) return [];
    return (content?.productImages || [])
      .filter((image) => String(image.product_model).toUpperCase() === String(draft.model).toUpperCase())
      .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0) || Number(a.id || 0) - Number(b.id || 0));
  }, [content?.productImages, draft?.model, tab]);

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
      setStatus(payload.error || "保存失败");
      return;
    }
    setContent(payload.content);
    setDraft(payload.item);
    setSelectedId(payload.item?.id || null);
    setStatus("已保存");
  }

  async function remove() {
    if (!draft?.id || !confirm("确定删除这条内容吗？")) return;
    setBusy(true);
    const response = await fetch("/api/admin/content", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: tab, id: draft.id })
    });
    const payload = await response.json();
    setBusy(false);
    if (!response.ok) {
      setStatus(payload.error || "删除失败");
      return;
    }
    setContent(payload.content);
    const first = payload.content[tab]?.[0] || null;
    setDraft(first);
    setSelectedId(first?.id || null);
    setStatus("已删除");
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
      setStatus(payload.error || "上传失败");
      return;
    }
    if (key !== "unused") update(key, payload.url);
    if (payload.media) {
      setContent((current) => ({
        ...current,
        mediaLibrary: [payload.media, ...(current?.mediaLibrary || []).filter((item) => item.src !== payload.media.src)]
      }));
    }
    setStatus(`已上传：${payload.url}`);
    return payload;
  }

  function refreshContentAfter(payload) {
    setContent(payload.content);
    if (tab === "products" && draft?.id) {
      const nextProduct = payload.content.products?.find((item) => item.id === draft.id);
      if (nextProduct) setDraft(nextProduct);
    }
  }

  function updateProductImage(id, key, value) {
    setContent((current) => ({
      ...current,
      productImages: (current?.productImages || []).map((image) => (image.id === id ? { ...image, [key]: value } : image))
    }));
  }

  async function saveProductImage(image) {
    setBusy(true);
    setStatus("");
    const response = await fetch("/api/admin/content", {
      method: image.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "productImages", data: image })
    });
    const payload = await response.json();
    setBusy(false);
    if (!response.ok) {
      setStatus(payload.error || "保存产品图片失败");
      return false;
    }
    refreshContentAfter(payload);
    setStatus("产品图片已保存");
    return true;
  }

  async function removeProductImage(image) {
    if (!image?.id || !confirm("确定删除这张产品图片吗？")) return;
    setBusy(true);
    setStatus("");
    const response = await fetch("/api/admin/content", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "productImages", id: image.id })
    });
    const payload = await response.json();
    setBusy(false);
    if (!response.ok) {
      setStatus(payload.error || "删除产品图片失败");
      return;
    }
    refreshContentAfter(payload);
    setStatus("产品图片已删除");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  if (!content) {
    return (
      <main className="admin-shell">
        <p className="admin-loading">正在加载后台数据...</p>
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
        <strong>网站后台</strong>
        <nav>
          {tabs.map((item) => (
            <button className={tab === item.id ? "active" : ""} type="button" onClick={() => select(item.id)} key={item.id}>
              {item.label}
              <span>{content[item.id]?.length || 0}</span>
            </button>
          ))}
        </nav>
        <a href="/" target="_blank">打开网站</a>
        <button type="button" onClick={logout}>退出登录</button>
      </aside>

      <section className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <span>后台管理</span>
            <h1>{tabs.find((item) => item.id === tab)?.label}</h1>
          </div>
          <div className="admin-actions">
            {canCreate ? (
              <button type="button" onClick={() => { setDraft(blankFor(tab, content)); setSelectedId(null); }}>
                新建
              </button>
            ) : null}
            {canDelete ? <button type="button" className="danger" onClick={remove}>删除</button> : null}
            {tab !== "mediaLibrary" ? <button type="button" onClick={save} disabled={busy || !draft}>{busy ? "处理中..." : "保存"}</button> : null}
          </div>
        </header>

        {status ? <p className={`admin-status ${status.includes("失败") || status.includes("错误") || status.includes("必须") || status.includes("请") ? "error" : ""}`}>{status}</p> : null}

        <div className="admin-grid">
          <div className="admin-list">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索当前栏目" />
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
                  <p>修改会保存到 SQLite 数据库，前台页面下次访问时会立即读取最新内容。</p>
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
                {tab === "products" ? (
                  <ProductImagesPanel
                    product={draft}
                    images={selectedProductImages}
                    busy={busy}
                    onChange={updateProductImage}
                    onSave={saveProductImage}
                    onDelete={removeProductImage}
                    onUpload={upload}
                  />
                ) : null}
              </>
            ) : (
              <p className="admin-empty">请选择一条内容进行编辑。</p>
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
  if (type === "readonly-textarea") {
    return (
      <label className="admin-field">
        <span>{label}</span>
        <textarea value={value || ""} readOnly />
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
            <a className="admin-file-preview" href={value} target="_blank">打开文件</a>
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

function ProductImagesPanel({ product, images, busy, onChange, onSave, onDelete, onUpload }) {
  const [newImage, setNewImage] = useState({
    src: "",
    alt: "",
    sort_order: images.length + 1,
    is_primary: images.length ? 0 : 1
  });

  useEffect(() => {
    setNewImage({
      src: "",
      alt: "",
      sort_order: images.length + 1,
      is_primary: images.length ? 0 : 1
    });
  }, [product?.model, images.length]);

  async function uploadNew(file) {
    const payload = await onUpload("unused", file);
    if (payload?.url) setNewImage((current) => ({ ...current, src: payload.url }));
  }

  async function createImage() {
    const ok = await onSave({
      ...newImage,
      product_model: product.model,
      alt: newImage.alt || `${product.display_name} ${product.model} product image`,
      source_file: newImage.source_file || "后台上传"
    });
    if (ok) {
      setNewImage({
        src: "",
        alt: "",
        sort_order: images.length + 2,
        is_primary: 0
      });
    }
  }

  if (!product?.model) return null;

  return (
    <section className="admin-product-images">
      <div className="admin-editor-head">
        <h2>产品图片组</h2>
        <p>
          当前型号共有 {images.length} 张图片。主图会同步到产品主图字段，其他图片会显示在产品详情页图库中。
        </p>
      </div>

      {images.length ? (
        <div className="admin-product-image-grid">
          {images.map((image, index) => (
            <article className={image.is_primary ? "primary" : ""} key={image.id}>
              <img src={image.src} alt={image.alt || `${product.model} product image ${index + 1}`} />
              <div className="admin-product-image-fields">
                <label>
                  <span>图片地址</span>
                  <input value={image.src || ""} onChange={(event) => onChange(image.id, "src", event.target.value)} />
                </label>
                <label>
                  <span>图片说明</span>
                  <input value={image.alt || ""} onChange={(event) => onChange(image.id, "alt", event.target.value)} />
                </label>
                <div className="admin-product-image-row">
                  <label>
                    <span>排序</span>
                    <input
                      type="number"
                      value={image.sort_order ?? 0}
                      onChange={(event) => onChange(image.id, "sort_order", Number(event.target.value))}
                    />
                  </label>
                  <label className="admin-mini-check">
                    <input
                      type="checkbox"
                      checked={!!image.is_primary}
                      onChange={(event) => onChange(image.id, "is_primary", event.target.checked ? 1 : 0)}
                    />
                    <span>主图</span>
                  </label>
                </div>
                <dl>
                  <div>
                    <dt>压缩包文件</dt>
                    <dd>{image.source_file || "后台上传"}</dd>
                  </div>
                  <div>
                    <dt>原图尺寸</dt>
                    <dd>{image.width && image.height ? `${image.width}x${image.height}px` : "未记录"}</dd>
                  </div>
                  <div>
                    <dt>原文件大小</dt>
                    <dd>{image.file_size ? `${Math.round(Number(image.file_size) / 1024)} KB` : "未记录"}</dd>
                  </div>
                </dl>
              </div>
              <div className="admin-product-image-actions">
                <button type="button" onClick={() => onSave(image)} disabled={busy}>
                  保存图片
                </button>
                {!image.is_primary ? (
                  <button type="button" onClick={() => onSave({ ...image, is_primary: 1 })} disabled={busy}>
                    设为主图
                  </button>
                ) : null}
                <button type="button" className="danger" onClick={() => onDelete(image)} disabled={busy}>
                  删除
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="admin-empty">这个型号还没有图片。可以从下方新增图片。</p>
      )}

      <div className="admin-product-image-new">
        <strong>新增产品图片</strong>
        <div>
          <input
            value={newImage.src}
            onChange={(event) => setNewImage((current) => ({ ...current, src: event.target.value }))}
            placeholder="/assets/catalog/product-gallery/..."
          />
          <input type="file" accept="image/*" onChange={(event) => uploadNew(event.target.files?.[0])} />
        </div>
        <input
          value={newImage.alt}
          onChange={(event) => setNewImage((current) => ({ ...current, alt: event.target.value }))}
          placeholder="图片说明"
        />
        <div>
          <label>
            <span>排序</span>
            <input
              type="number"
              value={newImage.sort_order}
              onChange={(event) => setNewImage((current) => ({ ...current, sort_order: Number(event.target.value) }))}
            />
          </label>
          <label className="admin-mini-check">
            <input
              type="checkbox"
              checked={!!newImage.is_primary}
              onChange={(event) => setNewImage((current) => ({ ...current, is_primary: event.target.checked ? 1 : 0 }))}
            />
            <span>设为主图</span>
          </label>
          <button type="button" onClick={createImage} disabled={busy || !newImage.src}>
            添加图片
          </button>
        </div>
      </div>
    </section>
  );
}

function MediaPanel({ media, upload }) {
  return (
    <>
      <div className="admin-editor-head">
        <h2>媒体库</h2>
        <p>上传图片、PDF 或视频后，可以把生成的文件地址复制到任意图片/文件字段中。</p>
      </div>
      <label className="admin-field">
        <span>上传新媒体</span>
        <input type="file" accept="image/*,video/*,application/pdf" onChange={(event) => upload("unused", event.target.files?.[0])} />
      </label>
      <div className="admin-media-grid">
        {media.map((item) => (
          <article key={item.id}>
            {item.kind === "video" ? <video src={item.src} muted controls /> : item.kind === "image" ? <img src={item.src} alt={item.alt} /> : <div>文件</div>}
            <strong>{item.alt || item.src}</strong>
            <code>{item.src}</code>
          </article>
        ))}
      </div>
    </>
  );
}
