import { readFileSync } from "node:fs";
import path from "node:path";

const routeMap = [
  [/index\.html/g, "/"],
  [/products\.html/g, "/products"],
  [/product-detail\.html/g, "/products/YK-040"],
  [/about\.html/g, "/about"],
  [/articles\.html/g, "/articles"],
  [/article-detail\.html/g, "/articles/wire-storage-basket-rfq"],
  [/inquiry\.html/g, "/inquiry"]
];

export function normalizeLegacyHtml(html) {
  let output = html
    .replaceAll('href="assets/', 'href="/assets/')
    .replaceAll("href='assets/", "href='/assets/")
    .replaceAll('src="assets/', 'src="/assets/')
    .replaceAll("src='assets/", "src='/assets/")
    .replaceAll("url('assets/", "url('/assets/")
    .replaceAll('url("assets/', 'url("/assets/');

  for (const [pattern, replacement] of routeMap) {
    output = output.replace(pattern, replacement);
  }

  return output;
}

export function legacyMain(name) {
  let filePath;

  switch (name) {
    case "home":
      filePath = path.join(process.cwd(), "legacy-html", "home.html");
      break;
    case "about":
      filePath = path.join(process.cwd(), "legacy-html", "about.html");
      break;
    case "articles":
      filePath = path.join(process.cwd(), "legacy-html", "articles.html");
      break;
    case "articleDetail":
      filePath = path.join(process.cwd(), "legacy-html", "article-detail.html");
      break;
    default:
      throw new Error(`Unknown legacy page: ${name}`);
  }

  const html = readFileSync(filePath, "utf8");
  return normalizeLegacyHtml(html);
}

export function homeMainParts() {
  const main = legacyMain("home").replace(/^\s*<section id="banner"[\s\S]*?<\/section>\s*/i, "");
  const start = main.indexOf('<section class="section product-section" id="products">');
  const endMarker = '<section class="section odm-section reveal" id="odm">';
  const end = main.indexOf(endMarker);

  if (start === -1 || end === -1 || end <= start) {
    return { before: main, after: "" };
  }

  return {
    before: main.slice(0, start),
    after: main.slice(end)
  };
}
