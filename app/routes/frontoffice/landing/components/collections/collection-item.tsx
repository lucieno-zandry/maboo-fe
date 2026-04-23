import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { useFormatMoney } from "~/lib/format-money";
import { isCategory } from "../../helpers/landing-able-guards";
import appPathname, { useAppPathname } from "~/lib/app-pathname";

// ----------------------------------------------------------------------------
// View Component (dumb)
// ----------------------------------------------------------------------------
type CollectionItemViewProps = {
    id: number;                 // category id
    slug: string;              // category slug for the link
    title: string;             // category title
    subtitle: string | null;   // from block.subtitle
    imageUrl: string | null;   // from block.image.url
    startingPrice: number;     // cheapest variant's effective price (or price)
    index: number;             // animation delay index
    formatMoney: (value: number) => string;
    appPathname: typeof appPathname;
};

export function CollectionItemView({
    slug,
    title,
    subtitle,
    imageUrl,
    startingPrice,
    index,
    formatMoney,
    appPathname
}: CollectionItemViewProps) {
    return (
        <Link
            to={appPathname(`/search/${title}`)}
            className="collection-card"
            style={{ animationDelay: `${index * 120}ms` }}
        >
            {/* Image */}
            <div className="collection-card__img-wrap">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="collection-card__img"
                        loading="lazy"
                    />
                ) : (
                    <div className="collection-card__img collection-card__img--placeholder" />
                )}
                <div className="collection-card__img-overlay" />
            </div>

            {/* Body */}
            <div className="collection-card__body">
                <div>
                    {subtitle && (
                        <p className="collection-card__subtitle">
                            {subtitle}
                        </p>
                    )}
                    <h3 className="collection-card__title">
                        {title}
                    </h3>
                </div>

                <div className="collection-card__footer">
                    <span className="collection-card__price">
                        From {formatMoney(startingPrice)}
                    </span>

                    <span className="collection-card__cta">
                        Shop{" "}
                        <ArrowRight className="w-3.5 h-3.5 ml-1 inline-block" />
                    </span>
                </div>
            </div>
        </Link>
    );
}

// ----------------------------------------------------------------------------
// Smart Component – connects to the actual LandingBlock
// ----------------------------------------------------------------------------
type CollectionItemProps = {
    block: LandingBlock;   // must be block_type = 'collection_grid'
    index: number;
};

export function CollectionItem({ block, index }: CollectionItemProps) {
    const formatMoney = useFormatMoney();
    const appPathname = useAppPathname();

    // Validate block type and relation
    if (block.block_type !== 'collection_grid') return null;
    if (!block.landing_able || !isCategory(block.landing_able)) return null;

    const category = block.landing_able;
    const cheapestVariant = category.cheapest_variant;

    // Compute starting price (if no variant, fallback to 0)
    let startingPrice = 0;
    if (cheapestVariant) {
        startingPrice = cheapestVariant.effective_price ?? cheapestVariant.price;
    }

    // Subtitle: use block.subtitle, otherwise fallback to a generic text
    const subtitle = block.subtitle ?? `Discover our ${category.title} collection`;

    return (
        <CollectionItemView
            id={category.id}
            slug={String(category.id)} // if no slug, use id as fallback
            title={category.title}
            subtitle={subtitle}
            imageUrl={block.image?.url ?? null}
            startingPrice={startingPrice}
            index={index}
            formatMoney={formatMoney}
            appPathname={appPathname}
        />
    );
}