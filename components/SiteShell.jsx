"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import SiteEffects from "./SiteEffects";

export default function SiteShell({ children, logo, catalogHref }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return children;

  return (
    <>
      <Header logo={logo} />
      {children}
      <Footer logo={logo} catalogHref={catalogHref} />
      <SiteEffects />
    </>
  );
}
