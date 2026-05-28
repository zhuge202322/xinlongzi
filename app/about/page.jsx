import { legacyMain } from "../../lib/legacy";

export const metadata = {
  title: "About",
  description: "Learn about Ningbo Yankun Metal Products factory workflow, quality controls and export sourcing support."
};

export default function AboutPage() {
  return <main dangerouslySetInnerHTML={{ __html: legacyMain("about") }} />;
}
