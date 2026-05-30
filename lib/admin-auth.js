import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "longzi_admin";

function secret() {
  return process.env.ADMIN_SECRET || process.env.NEXTAUTH_SECRET || "longzi-local-admin-secret";
}

function adminPassword() {
  return process.env.ADMIN_PASSWORD || "admin123";
}

function sign(value) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function createAdminToken() {
  const value = `admin.${Date.now()}`;
  return `${value}.${sign(value)}`;
}

export function verifyAdminToken(token = "") {
  const parts = token.split(".");
  if (parts.length < 3) return false;
  const signature = parts.pop();
  const value = parts.join(".");
  const expected = sign(value);
  const actualBuffer = Buffer.from(signature || "");
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

export function validatePassword(password) {
  return String(password || "") === adminPassword();
}

export function adminCookieName() {
  return COOKIE_NAME;
}
