import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SiteEffects from "../components/SiteEffects";

export const metadata = {
  title: {
    default: "Yankun Metal Products | Wire Storage and Metal Rack Manufacturer",
    template: "%s | Yankun Metal Products"
  },
  description:
    "Ningbo Yankun Metal Products Co., LTD manufactures wire storage baskets, bathroom shelves, home organizers, kitchen racks, pet crates and mesh racks for global B2B buyers."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
        <SiteEffects />
      </body>
    </html>
  );
}
