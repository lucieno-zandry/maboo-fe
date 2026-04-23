import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import type { CollectionCard } from "../../types/landing-types";
import type formatMoney from "~/lib/format-money";
import { useFormatMoney } from "~/lib/format-money";
import { COLLECTIONS } from "../../helpers/landing-data";
import { CollectionItem } from "./collection-item";

interface CollectionsViewProps {
  collections: LandingBlock[];
  formatPrice: typeof formatMoney
}

export function CollectionsView({ collections, formatPrice }: CollectionsViewProps) {
  return (
    <section className="collections" id="collections">
      {/* Section header */}
      <div className="collections__header">
        <p className="section-eyebrow">Explore the range</p>
        <h2 className="section-title">Spices of the Red Island</h2>
        <p className="section-subtitle">
          Three families of flavour, one island of origin.
        </p>
      </div>

      {/* Grid */}
      <div className="collections__grid">
        {collections.map((block, i) => (
          <CollectionItem block={block} index={i} />
        ))}
      </div>
    </section>
  );
}

/**
 * Collections (Smart)
 * In production, collection data (with real `startingPrice`) would come
 * from the route loader, querying the Category + Variant models.
 * Currently uses static seed data from landing-data.ts.
 */
export function Collections({ blocks }: { blocks: LandingBlock[] }) {
  const formatMoney = useFormatMoney();

  return <CollectionsView collections={blocks} formatPrice={formatMoney} />;
}