import { legacyMain } from "../../lib/legacy";

export const metadata = {
  title: "Articles",
  description: "Wire storage product sourcing guides and Yankun factory export articles."
};

export default function ArticlesPage() {
  return <main dangerouslySetInnerHTML={{ __html: legacyMain("articles") }} />;
}
