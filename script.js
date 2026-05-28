const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const slides = Array.from(document.querySelectorAll("#banner .piclink_pic a"));
const heroTabs = Array.from(document.querySelectorAll("#banner .piclink_text button"));
const briefInputs = Array.from(document.querySelectorAll("[data-brief]"));
const briefOutput = document.querySelector("[data-brief-output]");
const processButtons = Array.from(document.querySelectorAll("[data-process]"));
const processCopy = document.querySelector("[data-process-copy]");
const form = document.querySelector("[data-inquiry-form]");
const formStatus = document.querySelector("[data-form-status]");
const lightboxPanel = document.querySelector("[data-lightbox-panel]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxClose = document.querySelector("[data-lightbox-close]");

let activeSlide = 0;
let heroTimer;
let revealObserver;

const categoryImages = {
  bathroom: "assets/catalog/bathroom-cover.jpg",
  storage: "assets/catalog/storage-cover.jpg",
  home: "assets/catalog/home-cover.jpg",
  kitchen: "assets/catalog/kitchen-cover.jpg",
  pet: "assets/catalog/pet-cover.jpg",
  mesh: "assets/catalog/mesh-cover.jpg"
};

const detailImages = {
  "YK-040": "assets/catalog/yk040-card.jpg",
  "YK-177": "assets/catalog/yk177-card.jpg",
  "YK-209": "assets/catalog/yk209-card.jpg",
  "YK-230": "assets/catalog/yk230-card.jpg"
};

const preferredModels = {
  bathroom: "YK-001",
  storage: "YK-040",
  home: "YK-090",
  kitchen: "YK-177",
  pet: "YK-209",
  mesh: "YK-230"
};

const categoryCopy = {
  bathroom: {
    short: "Bathroom",
    buyer: "Bathroom retail, hotel supply and apartment storage kits",
    rfq: "Mounting style, load target, coating color and humid-space corrosion expectations"
  },
  storage: {
    short: "Storage",
    buyer: "Pantry, closet, laundry, utility and ecommerce storage programs",
    rfq: "Stacking fit, handle style, wire pitch, carton efficiency and private-label packing"
  },
  home: {
    short: "Home Shelf",
    buyer: "Household shelving, desktop organizers, fruit stands and multi-tier rack ranges",
    rfq: "Tier count, caster option, shelf spacing, retail pack and mixed-SKU assortment"
  },
  kitchen: {
    short: "Kitchen",
    buyer: "Dish racks, draining racks, sink-side storage and kitchen drawer basket ranges",
    rfq: "Drainage layout, coating choice, utensil accessories, food-contact review and carton artwork"
  },
  pet: {
    short: "Pet",
    buyer: "Pet supply distributors, crate programs and wire pet accessory sourcing",
    rfq: "Door style, latch safety, tray fit, folding structure, weld strength and edge treatment"
  },
  mesh: {
    short: "Mesh Rack",
    buyer: "Outdoor mesh racks, grill racks, wire panels, fences and project cages",
    rfq: "Wire diameter, mesh pitch, handle design, heat exposure and corrosion requirements"
  }
};

function setHeaderState() {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}

function closeNav() {
  nav?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Open navigation");
  document.body.classList.remove("nav-open");
}

function openNav() {
  nav?.classList.add("is-open");
  navToggle?.setAttribute("aria-expanded", "true");
  navToggle?.setAttribute("aria-label", "Close navigation");
  document.body.classList.add("nav-open");
}

function showSlide(index) {
  if (slides.length === 0) return;
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === activeSlide);
  });
  heroTabs.forEach((tab, tabIndex) => {
    const isActive = tabIndex === activeSlide;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
}

function startHeroTimer() {
  if (slides.length <= 1) return;
  window.clearInterval(heroTimer);
  heroTimer = window.setInterval(() => showSlide(activeSlide + 1), 7000);
}

function html(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sourceLabel(sourcePage) {
  const page = String(sourcePage || "").match(/page-(\d+)/i)?.[1];
  return page ? `PDF image page ${page} (${sourcePage})` : sourcePage || "PDF catalog";
}

function productImage(product) {
  return detailImages[product.model] || `assets/catalog/products/${product.model.toLowerCase()}.jpg`;
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function setHTML(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.innerHTML = value;
}

function observeReveal(element) {
  if (!element || !element.classList?.contains("reveal")) return;
  if (revealObserver) {
    revealObserver.observe(element);
  } else {
    element.classList.add("is-visible");
  }
}

function observeRevealTree(root = document) {
  root.querySelectorAll(".reveal").forEach(observeReveal);
}

function setupProductFilters() {
  document.querySelectorAll("[data-filter]").forEach((button) => {
    if (button.dataset.filterReady === "true") return;
    button.dataset.filterReady = "true";
    button.addEventListener("click", () => {
      const section = button.closest(".product-section") || document;
      const filterGroup = button.closest(".product-filters") || document;
      const filter = button.dataset.filter || "all";
      filterGroup.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      section.querySelectorAll(".product-card").forEach((card) => {
        const categories = card.dataset.category || "";
        const isVisible = filter === "all" || categories.split(" ").includes(filter);
        card.classList.toggle("is-hidden", !isVisible);
      });
    });
  });
}

function updateBrief() {
  if (!briefOutput || briefInputs.length === 0) return;

  const values = Object.fromEntries(briefInputs.map((input) => [input.dataset.brief, input.value]));
  briefOutput.textContent = `We are preparing a ${values.order.toLowerCase()} for ${values.category.toLowerCase()} with ${values.finish.toLowerCase()} and ${values.packaging.toLowerCase()}. Please review dimensions, target quantity, destination market and sample timeline.`;
}

function openLightbox(src) {
  if (!lightboxPanel || !lightboxImage) return;
  lightboxImage.src = src;
  lightboxPanel.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightboxPanel || !lightboxImage) return;
  lightboxPanel.hidden = true;
  lightboxImage.src = "";
  document.body.style.overflow = "";
}

function prepareEmailInquiry(event) {
  event.preventDefault();
  if (!form || !formStatus) return;

  if (!form.checkValidity()) {
    formStatus.textContent = "Please complete the required fields before preparing the email.";
    form.reportValidity();
    return;
  }

  const data = new FormData(form);
  const subject = encodeURIComponent(`Yankun inquiry - ${data.get("product")}`);
  const bodyLines = [
    `Name: ${data.get("name")}`,
    `Email: ${data.get("email")}`,
    `Product interest: ${data.get("product")}`,
    `Target quantity: ${data.get("quantity") || "To be confirmed"}`
  ];

  if (data.get("finish")) bodyLines.push(`Finish preference: ${data.get("finish")}`);
  if (data.get("packaging")) bodyLines.push(`Packaging: ${data.get("packaging")}`);
  bodyLines.push("", "Requirement:", data.get("message"));

  formStatus.textContent = "Opening your email client with the inquiry details.";
  window.location.href = `mailto:will526394@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
}

async function loadCatalog() {
  const response = await fetch("assets/data/catalog-products.json", { cache: "no-store" });
  if (!response.ok) throw new Error(`Catalog request failed: ${response.status}`);
  return response.json();
}

function getProductsByCategory(catalog, slug) {
  return catalog.products.filter((product) => product.categorySlug === slug);
}

function getRepresentativeProduct(catalog, slug) {
  const preferred = preferredModels[slug];
  return catalog.products.find((product) => product.model === preferred) || getProductsByCategory(catalog, slug)[0];
}

function renderCardFilters(catalog) {
  document.querySelectorAll("[data-catalog-card-filters]").forEach((container) => {
    const buttons = [
      '<button class="active" type="button" data-filter="all">All PDF Series</button>',
      ...catalog.categories.map((category) => {
        const label = categoryCopy[category.slug]?.short || category.name;
        return `<button type="button" data-filter="${html(category.slug)}">${html(label)} (${html(category.count)})</button>`;
      })
    ];
    container.innerHTML = buttons.join("");
  });
  setupProductFilters();
}

function renderCatalogCards(catalog) {
  document.querySelectorAll("[data-catalog-cards]").forEach((container) => {
    container.innerHTML = catalog.categories
      .map((category) => {
        const products = getProductsByCategory(catalog, category.slug);
        const representative = getRepresentativeProduct(catalog, category.slug);
        const sampleProducts = [representative, ...products]
          .filter((product, index, list) => product && list.findIndex((item) => item?.model === product.model) === index)
          .slice(0, 3);
        const copy = categoryCopy[category.slug] || {};
        const samples = sampleProducts
          .map((product) => `${html(product.model)}: ${html(product.dimensions)}, ${html(product.weight)}`)
          .join("<br>");

        return `
          <a class="product-card product-line-card reveal" data-category="${html(category.slug)}" href="products.html?category=${html(category.slug)}#category-products">
            <img src="${html(categoryImages[category.slug] || categoryImages.storage)}" alt="${html(category.name)} catalog products">
            <div>
              <span>${html(category.no)} / ${html(category.name)}</span>
              <h3>${html(category.range)} | ${html(category.count)} PDF models</h3>
              <p>${html(category.summary)}</p>
              <dl>
                <dt>Buyer scenario</dt>
                <dd>${html(copy.buyer || "B2B retail, distributor and private-label sourcing")}</dd>
                <dt>Sample PDF data</dt>
                <dd>${samples}</dd>
                <dt>RFQ focus</dt>
                <dd>${html(copy.rfq || "Size, finish, wire specification, packaging and order quantity")}</dd>
              </dl>
              <span class="text-link">View ${html(category.name)} list</span>
            </div>
          </a>
        `;
      })
      .join("");
    observeRevealTree(container);
  });
  setupProductFilters();
}

function renderCatalogTable(catalog) {
  const tableBody = document.querySelector("[data-catalog-table]");
  if (!tableBody) return;

  const productGrid = document.querySelector("[data-product-grid]");
  const filterControls = document.querySelector("[data-catalog-filter-controls]");
  const searchInput = document.querySelector("[data-catalog-search]");
  const countElement = document.querySelector("[data-catalog-count]");
  const requestedCategory = new URLSearchParams(window.location.search).get("category");
  let activeCategory = catalog.categories.some((category) => category.slug === requestedCategory) ? requestedCategory : "all";

  const updateCategoryCopy = (filteredCount) => {
    const category = catalog.categories.find((item) => item.slug === activeCategory);
    const title = document.querySelector("[data-category-title]");
    const copy = document.querySelector("[data-category-copy]");
    if (!title || !copy) return;

    if (category) {
      title.textContent = `${category.name} product list: ${category.range}`;
      copy.textContent = `${filteredCount} products are shown from the ${category.name} PDF category. Each card includes the product image, model name, dimensions, weight and source page for RFQ shortlisting.`;
    } else {
      title.textContent = "Browse real Yankun catalog products as image cards.";
      copy.textContent =
        "The product cards below are built from the PDF catalog data in this project. Use filters or search to shortlist exact models before opening a detail page or sending an RFQ.";
    }
  };

  const syncUrl = () => {
    if (!filterControls) return;
    const url = new URL(window.location.href);
    if (activeCategory === "all") {
      url.searchParams.delete("category");
    } else {
      url.searchParams.set("category", activeCategory);
    }
    url.hash = "category-products";
    window.history.replaceState({}, "", url);
  };

  if (filterControls) {
    filterControls.innerHTML = [
      `<button class="${activeCategory === "all" ? "active" : ""}" type="button" data-catalog-filter="all">All models</button>`,
      ...catalog.categories.map((category) => {
        const label = categoryCopy[category.slug]?.short || category.name;
        const active = activeCategory === category.slug ? "active" : "";
        return `<button class="${active}" type="button" data-catalog-filter="${html(category.slug)}">${html(label)} (${html(category.count)})</button>`;
      })
    ].join("");

    filterControls.addEventListener("click", (event) => {
      const button = event.target.closest("[data-catalog-filter]");
      if (!button) return;
      activeCategory = button.dataset.catalogFilter || "all";
      filterControls.querySelectorAll("[data-catalog-filter]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      syncUrl();
      renderRows();
    });
  }

  const renderProductCards = (products) => {
    if (!productGrid) return;
    productGrid.innerHTML =
      products
        .map(
          (product) => `
            <a class="catalog-product-card" href="product-detail.html?model=${html(product.model)}">
              <img src="${html(productImage(product))}" alt="${html(product.displayName)} product image" loading="lazy">
              <div>
                <span>${html(product.model)}</span>
                <h3>${html(product.displayName)}</h3>
                <dl>
                  <div>
                    <dt>Dimensions</dt>
                    <dd>${html(product.dimensions)}</dd>
                  </div>
                  <div>
                    <dt>Weight</dt>
                    <dd>${html(product.weight)}</dd>
                  </div>
                  <div>
                    <dt>Series</dt>
                    <dd>${html(product.category)}</dd>
                  </div>
                  <div>
                    <dt>Source</dt>
                    <dd>${html(sourceLabel(product.sourcePage))}</dd>
                  </div>
                </dl>
                <strong>View product detail</strong>
              </div>
            </a>
          `
        )
        .join("") || '<article class="small-card"><span>No result</span><h3>No matching products</h3><p>Try another category or model keyword.</p></article>';
  };

  const renderRows = () => {
    const query = (searchInput?.value || "").trim().toLowerCase();
    const filtered = catalog.products.filter((product) => {
      const categoryMatch = activeCategory === "all" || product.categorySlug === activeCategory;
      const searchTarget = [
        product.model,
        product.displayName,
        product.category,
        product.categoryCn,
        product.dimensions,
        product.weight,
        product.sourcePage
      ]
        .join(" ")
        .toLowerCase();
      return categoryMatch && (!query || searchTarget.includes(query));
    });

    if (countElement) {
      countElement.textContent = `${filtered.length} of ${catalog.products.length} PDF catalog models shown`;
    }

    updateCategoryCopy(filtered.length);
    renderProductCards(filtered);

    tableBody.innerHTML =
      filtered
        .map(
          (product) => `
            <tr>
              <td data-label="Model">
                <a class="catalog-model-link" href="product-detail.html?model=${html(product.model)}">${html(product.model)}</a>
                <span class="category-mark">${html(product.displayName)}</span>
              </td>
              <td data-label="Series">${html(product.category)}<span class="category-mark">${html(product.categoryCn)}</span></td>
              <td data-label="Dimensions">${html(product.dimensions)}</td>
              <td data-label="Weight">${html(product.weight)}</td>
              <td data-label="PDF source">${html(sourceLabel(product.sourcePage))}</td>
            </tr>
          `
        )
        .join("") || '<tr><td colspan="5">No matching catalog products found.</td></tr>';
  };

  searchInput?.addEventListener("input", renderRows);
  renderRows();
}

function hydrateProductSelects(catalog) {
  const selectedProduct = new URLSearchParams(window.location.search).get("product");
  const selectedModel = selectedProduct
    ? catalog.products.find((product) => product.model.toLowerCase() === selectedProduct.toLowerCase())
    : null;

  document.querySelectorAll("[data-product-select]").forEach((select) => {
    const keepsCustom = Array.from(select.options).some((option) => /custom/i.test(option.textContent));
    const options = catalog.categories.map(
      (category) => `<option value="${html(category.name)} (${html(category.range)})">${html(category.name)} (${html(category.range)})</option>`
    );

    if (selectedModel) {
      options.unshift(
        `<option selected value="${html(selectedModel.model)} ${html(selectedModel.category)}">${html(selectedModel.model)} ${html(selectedModel.category)} - ${html(selectedModel.dimensions)}, ${html(selectedModel.weight)}</option>`
      );
    }

    if (keepsCustom) {
      options.push('<option value="Custom wire product">Custom wire product</option>');
    }

    select.innerHTML = options.join("");
  });
}

function renderProductDetail(catalog) {
  const title = document.querySelector("[data-detail-title]");
  if (!title) return;

  const params = new URLSearchParams(window.location.search);
  const requestedModel = (params.get("model") || params.get("product") || "YK-040").toUpperCase();
  const product =
    catalog.products.find((item) => item.model.toUpperCase() === requestedModel) ||
    catalog.products.find((item) => item.model === "YK-040") ||
    catalog.products[0];
  const category = catalog.categories.find((item) => item.slug === product.categorySlug);
  const copy = categoryCopy[product.categorySlug] || {};
  const image = detailImages[product.model] || categoryImages[product.categorySlug] || categoryImages.storage;
  const source = sourceLabel(product.sourcePage);
  const inquiryUrl = `inquiry.html?product=${encodeURIComponent(product.model)}`;

  document.title = `${product.model} ${copy.short || product.category} | Yankun Product Detail`;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute(
      "content",
      `${product.model} from Yankun ${product.category}: ${product.dimensions}, ${product.weight}, sourced from ${product.sourcePage}.`
    );
  }

  const imageElement = document.querySelector("[data-detail-image]");
  if (imageElement) {
    imageElement.src = image;
    imageElement.alt = `${product.displayName} catalog image`;
  }

  setText("[data-detail-breadcrumb]", product.model);
  setText("[data-detail-title]", product.displayName);
  setText(
    "[data-detail-description]",
    `${product.model} is a real model from the Yankun Metal PDF catalog under ${product.category}. Extracted catalog data: ${product.dimensions}, ${product.weight}, ${source}.`
  );
  setHTML(
    "[data-detail-tags]",
    [
      product.category,
      category?.range,
      product.dimensions,
      product.weight
    ]
      .filter(Boolean)
      .map((item) => `<span>${html(item)}</span>`)
      .join("")
  );
  setText("[data-detail-model]", product.model);
  setText("[data-detail-category]", product.category);
  setText("[data-detail-dimensions]", product.dimensions);
  setText("[data-detail-weight]", product.weight);
  setText("[data-detail-range]", category?.range || "");
  setText("[data-detail-source]", source);
  setText("[data-detail-position-title]", `${product.category} model data prepared for importer comparison.`);
  setText(
    "[data-detail-position-copy]",
    `${product.model} belongs to ${category?.range || product.category}. Buyers can compare the PDF dimensions and weight against target retail use, then confirm finish, packaging, carton data and MOQ with the factory.`
  );
  setText("[data-detail-cta-title]", `Ready to quote ${product.model}?`);
  setText(
    "[data-detail-cta-copy]",
    `Send ${product.model}, target quantity, finish, packaging preference and destination market for factory review.`
  );
  document.querySelectorAll("[data-detail-inquiry]").forEach((link) => {
    link.href = inquiryUrl;
  });

  const relatedContainer = document.querySelector("[data-related-products]");
  if (relatedContainer) {
    const sameCategory = getProductsByCategory(catalog, product.categorySlug);
    const currentIndex = Math.max(0, sameCategory.findIndex((item) => item.model === product.model));
    const related = [
      ...sameCategory.slice(Math.max(0, currentIndex - 2), currentIndex),
      ...sameCategory.slice(currentIndex + 1, currentIndex + 4),
      ...sameCategory
    ]
      .filter((item, index, list) => item.model !== product.model && list.findIndex((candidate) => candidate.model === item.model) === index)
      .slice(0, 4);

    relatedContainer.innerHTML = related
      .map(
        (item) => `
          <article class="small-card reveal">
            <span>${html(item.model)}</span>
            <h3>${html(item.displayName)}</h3>
            <p>${html(item.dimensions)} / ${html(item.weight)}<br>${html(sourceLabel(item.sourcePage))}</p>
            <a class="text-link" href="product-detail.html?model=${html(item.model)}">View detail</a>
          </article>
        `
      )
      .join("");
    observeRevealTree(relatedContainer);
  }
}

function showCatalogError(error) {
  console.error(error);
  document.querySelectorAll("[data-catalog-cards]").forEach((container) => {
    container.innerHTML =
      '<article class="product-card reveal"><div><span>Catalog data</span><h3>Open through the local preview server</h3><p>The PDF product data could not be loaded from assets/data/catalog-products.json.</p></div></article>';
    observeRevealTree(container);
  });
  setText("[data-catalog-count]", "Catalog data could not be loaded.");
}

function scrollToCatalogHash() {
  if (window.location.hash !== "#category-products") return;
  window.requestAnimationFrame(() => {
    document.querySelector("#category-products")?.scrollIntoView({ block: "start" });
  });
}

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  if (isOpen) {
    closeNav();
  } else {
    openNav();
  }
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    closeNav();
  }
});

heroTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    showSlide(index);
    startHeroTimer();
  });
});

briefInputs.forEach((input) => {
  input.addEventListener("change", updateBrief);
});

processButtons.forEach((button) => {
  button.addEventListener("click", () => {
    processButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    if (processCopy) {
      processCopy.textContent = button.dataset.process || "";
    }
  });
});

document.querySelectorAll("[data-lightbox]").forEach((button) => {
  button.addEventListener("click", () => openLightbox(button.dataset.lightbox));
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxPanel?.addEventListener("click", (event) => {
  if (event.target === lightboxPanel) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
    closeNav();
  }
});

form?.addEventListener("submit", prepareEmailInquiry);
window.addEventListener("scroll", setHeaderState, { passive: true });

if ("IntersectionObserver" in window) {
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );
}

observeRevealTree();
setupProductFilters();

if (slides.length > 0) {
  showSlide(0);
  startHeroTimer();
}
setHeaderState();
updateBrief();

loadCatalog()
  .then((catalog) => {
    setText("[data-catalog-total]", catalog.products.length);
    renderCardFilters(catalog);
    renderCatalogCards(catalog);
    renderCatalogTable(catalog);
    hydrateProductSelects(catalog);
    renderProductDetail(catalog);
    scrollToCatalogHash();
  })
  .catch(showCatalogError);
