import "./globals.css";
import SiteShell from "../components/SiteShell";
import { getSiteMediaValue } from "../lib/catalog";

export const dynamic = "force-dynamic";

export const metadata = {
  title: {
    default: "Yankun Metal Products | Wire Storage and Metal Rack Manufacturer",
    template: "%s | Yankun Metal Products"
  },
  description:
    "Ningbo Yankun Metal Products Co., LTD manufactures wire storage baskets, bathroom shelves, home organizers, kitchen racks, pet crates and mesh racks for global B2B buyers."
};

export default function RootLayout({ children }) {
  const logo = getSiteMediaValue("site_logo", "/assets/yankun-logo.svg");
  const catalogHref = getSiteMediaValue("catalog_pdf", "/assets/downloads/yankun-metal-catalog.pdf");

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <SiteShell logo={logo} catalogHref={catalogHref}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
