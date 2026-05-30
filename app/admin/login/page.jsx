import LoginForm from "../../../components/admin/LoginForm";
import { getSiteMediaValue } from "../../../lib/catalog";

export const metadata = {
  title: "Admin Login"
};

export default function AdminLoginPage() {
  const logo = getSiteMediaValue("site_logo", "/assets/yankun-logo.svg");
  return <LoginForm logo={logo} />;
}
