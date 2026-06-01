import { NextResponse } from "next/server";
import { adminCookieName, verifyAdminToken } from "../../../../lib/admin-auth";
import {
  deleteHeroSlide,
  deletePost,
  deleteProduct,
  getAdminContent,
  saveCategory,
  saveHeroSlide,
  savePost,
  saveProduct,
  saveSectionContent,
  saveSiteMedia
} from "../../../../lib/cms-admin";

function unauthorized() {
  return NextResponse.json({ error: "登录已失效，请重新登录" }, { status: 401 });
}

function requireAdmin(request) {
  const token = request.cookies.get(adminCookieName())?.value;
  return verifyAdminToken(token);
}

function saveResource(resource, data) {
  if (resource === "products") return saveProduct(data);
  if (resource === "categories") return saveCategory(data);
  if (resource === "posts") return savePost(data);
  if (resource === "heroSlides") return saveHeroSlide(data);
  if (resource === "siteMedia") return saveSiteMedia(data);
  if (resource === "sectionContent") return saveSectionContent(data);
  throw new Error("未知的数据类型");
}

function deleteResource(resource, id) {
  if (resource === "products") return deleteProduct(id);
  if (resource === "posts") return deletePost(id);
  if (resource === "heroSlides") return deleteHeroSlide(id);
  throw new Error("当前数据类型不支持删除");
}

export async function GET(request) {
  if (!requireAdmin(request)) return unauthorized();
  return NextResponse.json(getAdminContent());
}

export async function POST(request) {
  if (!requireAdmin(request)) return unauthorized();
  try {
    const body = await request.json();
    const saved = saveResource(body.resource, body.data || {});
    return NextResponse.json({ ok: true, item: saved, content: getAdminContent() });
  } catch (error) {
    return NextResponse.json({ error: error.message || "保存失败" }, { status: 400 });
  }
}

export async function PATCH(request) {
  if (!requireAdmin(request)) return unauthorized();
  try {
    const body = await request.json();
    const saved = saveResource(body.resource, body.data || {});
    return NextResponse.json({ ok: true, item: saved, content: getAdminContent() });
  } catch (error) {
    return NextResponse.json({ error: error.message || "保存失败" }, { status: 400 });
  }
}

export async function DELETE(request) {
  if (!requireAdmin(request)) return unauthorized();
  try {
    const body = await request.json();
    deleteResource(body.resource, body.id);
    return NextResponse.json({ ok: true, content: getAdminContent() });
  } catch (error) {
    return NextResponse.json({ error: error.message || "删除失败" }, { status: 400 });
  }
}
