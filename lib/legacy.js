import { readFileSync } from "node:fs";
import { join } from "node:path";
import { applySiteMedia } from "./catalog";

const legacyHtml = {
  home: readFileSync(join(process.cwd(), "legacy-html", "home.html"), "utf8"),
  about: readFileSync(join(process.cwd(), "legacy-html", "about.html"), "utf8"),
  articles: readFileSync(join(process.cwd(), "legacy-html", "articles.html"), "utf8"),
  articleDetail: readFileSync(join(process.cwd(), "legacy-html", "article-detail.html"), "utf8")
};

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

  return applySiteMedia(output);
}

export function legacyMain(name) {
  const html = legacyHtml[name];
  if (!html) {
    throw new Error(`Unknown legacy page: ${name}`);
  }

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
