import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "../../components/admin/AdminDashboard";
import { adminCookieName, verifyAdminToken } from "../../lib/admin-auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin"
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminCookieName())?.value;
  if (!verifyAdminToken(token)) redirect("/admin/login");

  return <AdminDashboard />;
}
