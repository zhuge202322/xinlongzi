import { mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { NextResponse } from "next/server";
import { adminCookieName, verifyAdminToken } from "../../../../lib/admin-auth";
import { addMedia } from "../../../../lib/cms-admin";

function requireAdmin(request) {
  const token = request.cookies.get(adminCookieName())?.value;
  return verifyAdminToken(token);
}

export async function POST(request) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: "登录已失效，请重新登录" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "请选择要上传的文件" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = extname(file.name || "") || ".bin";
  const safeName = `${Date.now()}-${Math.random().toString(16).slice(2)}${extension}`.toLowerCase();
  const uploadDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, safeName), buffer);

  const url = `/uploads/${safeName}`;
  const kind = file.type?.startsWith("video/") ? "video" : file.type === "application/pdf" ? "file" : "image";
  const media = addMedia(url, file.name || safeName, kind);
  return NextResponse.json({ ok: true, url, kind, media });
}
