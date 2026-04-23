import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import type { PaginatedResponse } from "~/api/app-fetch";
import { ProductGrid } from "~/components/products/product-grid";
import { ProductGridSkeleton } from "~/components/products/product-grid-skeleton";
import { Button } from "~/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

interface FeaturedProductsViewProps {
  products: Product[];
  isLoading: boolean;
}

export function FeaturedProductsView({
  products,
  isLoading,
}: FeaturedProductsViewProps) {
  return (
    <section className="featured-products" id="featured">
      {/* Header */}
      <div className="featured-products__header">
        <p className="section-eyebrow">Hand-picked for you</p>
        <h2 className="section-title">Bestsellers</h2>
        <p className="section-subtitle">
          The products our customers reorder most.
        </p>
      </div>

      {/* Grid — reuses the existing ProductGrid component */}
      {isLoading ? (
        <ProductGridSkeleton count={4} />
      ) : (
        <ProductGrid products={products} />
      )}

      {/* View all CTA */}
      <div className="featured-products__footer">
        <Button asChild variant="outline" className="featured-products__view-all">
          <Link to="/products">
            View all products
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

/**
 * FeaturedProducts (Smart)
 *
 * Fetches featured/bestseller products client-side using React Router's
 * useFetcher — matching the pattern in products.tsx.
 *
 * The loader at `routes/api/featured-products.tsx` should return:
 *   getProducts({ page: 1, limit: 4, featured: true }, { headers })
 *
 * If products are already available from the parent route loader,
 * pass them as `initialProducts` to avoid an extra network round-trip.
 */
interface FeaturedProductsProps {
  initialProducts?: Product[];
}

export function FeaturedProducts({ initialProducts }: FeaturedProductsProps) {
  const fetcher = useFetcher<PaginatedResponse<Product>>();
  const [products, setProducts] = useState<Product[]>(initialProducts ?? []);
  const isLoading = fetcher.state === "loading";

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) return; // already have data
    // Load from a dedicated resource route:
    // app/routes/api/featured-products.tsx  →  loader returns paginated products
    fetcher.load("/api/featured-products?limit=4&featured=true");
  }, []);

  useEffect(() => {
    if (fetcher.data) {
      setProducts(fetcher.data.data);
    }
  }, [fetcher.data]);

  return <FeaturedProductsView products={products} isLoading={isLoading} />;
}