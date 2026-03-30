import { Loader2, PackageSearch } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { addVariantToCart, getProducts } from "~/api/http-requests";
import { useSearchStore } from "~/hooks/use-search-store";
import { Button } from "../ui/button";
import { cn } from "~/lib/utils";
import { ProductCardView } from "./product-card";

export function ProductGrid() {
    const products = useSearchStore((s) => s.products);
    const viewMode = useSearchStore((s) => s.viewMode);
    const loading = useSearchStore((s) => s.productsLoading);
    const loadingMore = useSearchStore((s) => s.productsLoadingMore);
    const error = useSearchStore((s) => s.productsError);
    const hasMore = useSearchStore((s) => s.hasMore);
    const currentPage = useSearchStore((s) => s.currentPage);
    const totalProducts = useSearchStore((s) => s.totalProducts);
    const setProductsLoading = useSearchStore((s) => s.setProductsLoading);
    const setProductsLoadingMore = useSearchStore((s) => s.setProductsLoadingMore);
    const setProductsError = useSearchStore((s) => s.setProductsError);
    const setProducts = useSearchStore((s) => s.setProducts);
    const appendProducts = useSearchStore((s) => s.appendProducts);
    const buildQueryParams = useSearchStore((s) => s.buildQueryParams);
    const filters = useSearchStore((s) => s.filters);

    const sentinelRef = useRef<HTMLDivElement>(null);
    const isFetchingRef = useRef(false);

    // ── Initial / filter-change fetch ──────────────────────────────────────────
    const fetchInitial = useCallback(async () => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;
        setProductsLoading(true);
        setProductsError(null);

        const params = buildQueryParams();
        const { data, error } = await getProducts({ ...params, page: 1 });

        if (error || !data) {
            setProductsError("Failed to load products. Please try again.");
        } else {
            setProducts(data.data, data.current_page, data.last_page, data.total);
        }

        setProductsLoading(false);
        isFetchingRef.current = false;
    }, [filters]); // re-run whenever filters change

    useEffect(() => {
        fetchInitial();
    }, [fetchInitial]);

    // ── Load more ─────────────────────────────────────────────────────────────
    const fetchMore = useCallback(async () => {
        if (isFetchingRef.current || !hasMore) return;
        isFetchingRef.current = true;
        setProductsLoadingMore(true);

        const params = buildQueryParams();
        const nextPage = currentPage + 1;
        const { data, error } = await getProducts({ ...params, page: nextPage });

        if (!error && data) {
            appendProducts(data.data, data.current_page, data.last_page);
        }

        setProductsLoadingMore(false);
        isFetchingRef.current = false;
    }, [hasMore, currentPage, filters]);

    // ── Intersection observer for infinite scroll ──────────────────────────────
    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchMore();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [fetchMore]);

    // ── Cart handler ──────────────────────────────────────────────────────────
    const handleAddToCart = async (variantId: number) => {
        const { error } = await addVariantToCart({ variant_id: variantId, count: 1 });
        if (error) {
            toast.error("Couldn't add to cart. Please try again.");
        } else {
            toast.success("Added to cart!");
        }
    };

    return (
        <ProductGridView
            products={products}
            viewMode={viewMode}
            loading={loading}
            loadingMore={loadingMore}
            error={error}
            hasMore={hasMore}
            totalProducts={totalProducts}
            sentinelRef={sentinelRef}
            onAddToCart={handleAddToCart}
            onRetry={fetchInitial}
        />
    );
}


export interface ProductGridViewProps {
    products: Product[];
    viewMode: "grid" | "list";
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    hasMore: boolean;
    totalProducts: number;
    sentinelRef: React.RefObject<HTMLDivElement | null>;
    onAddToCart?: (variantId: number) => void;
    onRetry?: () => void;
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard({ mode }: { mode: "grid" | "list" }) {
    if (mode === "list") {
        return (
            <div className="flex h-[140px] animate-pulse overflow-hidden rounded-xl border border-border/50 bg-card">
                <div className="h-full w-36 shrink-0 bg-muted" />
                <div className="flex flex-1 flex-col justify-between p-4">
                    <div className="space-y-2">
                        <div className="h-4 w-3/4 rounded bg-muted" />
                        <div className="h-3 w-full rounded bg-muted" />
                        <div className="h-3 w-2/3 rounded bg-muted" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="h-5 w-20 rounded bg-muted" />
                        <div className="h-8 w-24 rounded-md bg-muted" />
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="animate-pulse overflow-hidden rounded-xl border border-border/50 bg-card">
            <div className="h-44 bg-muted" />
            <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted" />
                <div className="flex items-center justify-between pt-1">
                    <div className="h-5 w-16 rounded bg-muted" />
                    <div className="h-8 w-16 rounded-md bg-muted" />
                </div>
            </div>
        </div>
    );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ hasFilters }: { hasFilters: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 rounded-full bg-muted p-6">
                <PackageSearch className="size-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No products found</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                {hasFilters
                    ? "Try adjusting or clearing your filters to see more results."
                    : "There are no products available at this time."}
            </p>
        </div>
    );
}

// ─── Error state ──────────────────────────────────────────────────────────────
function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-sm text-destructive">{message}</p>
            {onRetry && (
                <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
                    Try again
                </Button>
            )}
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function ProductGridView({
    products,
    viewMode,
    loading,
    loadingMore,
    error,
    hasMore,
    totalProducts,
    sentinelRef,
    onAddToCart,
    onRetry,
}: ProductGridViewProps) {
    if (loading) {
        return (
            <div
                className={cn(
                    viewMode === "grid"
                        ? "grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                        : "flex flex-col gap-3"
                )}
            >
                {Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonCard key={i} mode={viewMode} />
                ))}
            </div>
        );
    }

    if (error) {
        return <ErrorState message={error} onRetry={onRetry} />;
    }

    if (products.length === 0) {
        return <EmptyState hasFilters={false} />;
    }

    return (
        <div>
            {/* Result count */}
            <p className="mb-4 text-sm text-muted-foreground">
                {totalProducts} product{totalProducts !== 1 ? "s" : ""} found
            </p>

            {/* Product items */}
            <div
                className={cn(
                    viewMode === "grid"
                        ? "grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                        : "flex flex-col gap-3"
                )}
            >
                {products.map((product) => (
                    <ProductCardView
                        key={product.id}
                        product={product}
                        viewMode={viewMode}
                        onAddToCart={onAddToCart}
                    />
                ))}
            </div>

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="mt-8 flex items-center justify-center h-8">
                {loadingMore && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" />
                        Loading more…
                    </div>
                )}
                {!hasMore && products.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                        All {totalProducts} product{totalProducts !== 1 ? "s" : ""} loaded
                    </p>
                )}
            </div>
        </div>
    );
}