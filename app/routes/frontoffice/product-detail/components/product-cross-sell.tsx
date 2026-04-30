// routes/frontoffice/product-detail/components/product-cross-sell.tsx

import { useState, useEffect } from "react";
import { getProducts } from "~/api/http-requests";
import { useFormatMoney } from "~/lib/format-money";
import { Link } from "react-router";
import { useAppPathname } from "~/lib/app-pathname";
import { useTranslation } from "react-i18next";
import { ArrowRight, ImageIcon } from "lucide-react";

// ── Dumb (View) ──────────────────────────────────────────────────────────────
interface CrossSellProduct {
    product: Product;
    cheapestVariant?: Variant;
}

interface ProductCrossSellViewProps {
    products: CrossSellProduct[];
    loading: boolean;
    formatMoney: (n?: number) => string;
    getProductUrl: (slug: string) => string;
    title: string;
    noImageLabel: string;
    fromPriceLabel: string;
}

export function ProductCrossSellView({
    products,
    loading,
    formatMoney,
    getProductUrl,
    title,
    noImageLabel,
    fromPriceLabel,
}: ProductCrossSellViewProps) {
    if (loading) {
        return (
            <section className="space-y-4">
                <div className="h-6 w-40 animate-pulse rounded-lg bg-neutral-100" />
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="space-y-2 animate-pulse">
                            <div className="aspect-square w-full rounded-2xl bg-neutral-100" />
                            <div className="h-3.5 w-3/4 rounded bg-neutral-100" />
                            <div className="h-3 w-1/2 rounded bg-neutral-100" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (!products.length) return null;

    return (
        <section>
            <div className="flex items-center justify-between mb-5">
                <h2
                    className="text-xl font-bold text-neutral-900"
                    style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                    {title}
                </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {products.map(({ product, cheapestVariant }) => (
                    <Link
                        key={product.id}
                        to={getProductUrl(product.slug)}
                        className="group"
                    >
                        {/* Image */}
                        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100 mb-3">
                            {product.images?.[0] ? (
                                <img
                                    src={product.images[0].url}
                                    alt={product.title}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div className="h-full w-full flex flex-col items-center justify-center text-neutral-300 gap-2">
                                    <ImageIcon className="h-8 w-8" />
                                    <span className="text-xs">{noImageLabel}</span>
                                </div>
                            )}
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200 rounded-2xl" />
                            <div className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <ArrowRight className="h-3.5 w-3.5 text-neutral-700" />
                            </div>
                        </div>

                        {/* Info */}
                        <p className="text-sm font-medium text-neutral-800 line-clamp-2 leading-snug mb-1">
                            {product.title}
                        </p>
                        {cheapestVariant && (
                            <p className="text-sm font-semibold text-neutral-600">
                                {fromPriceLabel.replace("{{money}}", formatMoney(cheapestVariant.price))}
                            </p>
                        )}
                    </Link>
                ))}
            </div>
        </section>
    );
}

// ── Smart (Container) ────────────────────────────────────────────────────────
interface ProductCrossSellProps {
    product: Product;
}

export function ProductCrossSell({ product }: ProductCrossSellProps) {
    const { t } = useTranslation("product-detail");
    const [products, setProducts] = useState<CrossSellProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const formatMoney = useFormatMoney();
    const appPath = useAppPathname();
    const getProductUrl = (slug: string) => appPath(`/product/${slug}`);

    useEffect(() => {
        if (!product.category_id) {
            setLoading(false);
            return;
        }

        getProducts({
            category_id: product.category_id,
            limit: 8,
            with: ["images", "variants"],
        })
            .then((res) => {
                const data = res.data?.data ?? [];
                setProducts(
                    data
                        .filter((p) => p.id !== product.id)
                        .map((p) => ({
                            product: p,
                            cheapestVariant: p.variants?.reduce(
                                (min, v) => (v.price < min.price ? v : min),
                                p.variants[0]
                            ),
                        }))
                );
            })
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, [product.category_id, product.id]);

    return (
        <ProductCrossSellView
            products={products}
            loading={loading}
            formatMoney={formatMoney}
            getProductUrl={getProductUrl}
            title={t("crossSell.title")}
            noImageLabel={t("crossSell.noImage")}
            fromPriceLabel={t("crossSell.fromPrice")}
        />
    );
}