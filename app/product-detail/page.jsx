import { redirect } from "next/navigation";

export default async function LegacyProductDetailPage({ searchParams }) {
  const params = await searchParams;
  const model = params?.model || params?.product || "YK-040";
  redirect(`/products/${String(model).toUpperCase()}`);
}
