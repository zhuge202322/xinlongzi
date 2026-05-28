import { legacyMain } from "../../../lib/legacy";

export const metadata = {
  title: "Wire Storage Basket RFQ Guide",
  description: "A sourcing guide for import buyers preparing RFQs for wire storage baskets and metal rack products."
};

export default function ArticleDetailPage() {
  return <main dangerouslySetInnerHTML={{ __html: legacyMain("articleDetail") }} />;
}
