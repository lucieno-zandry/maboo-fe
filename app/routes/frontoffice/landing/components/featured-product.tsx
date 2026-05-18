import { ProductGrid } from "~/components/product-grid";
import { Button } from "~/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import appPathname from "~/lib/app-pathname";
import { useTranslation } from "react-i18next";

interface FeaturedProductsViewProps {
  eyebrow?: string;
  title: string;
  subtitle?: string | null;
  products: Product[];
  viewAllProductsLabel: string;
}

export function FeaturedProductsView({ eyebrow, title, subtitle, products, viewAllProductsLabel }: FeaturedProductsViewProps) {
  return (
    <section className="featured-products" id="featured">
      <div className="featured-products__header">
        {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>

      <ProductGrid products={products} />

      <div className="featured-products__footer">
        <Button asChild variant="outline" className="featured-products__view-all">
          <Link to={appPathname('/products')}>
            {viewAllProductsLabel}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

export function FeaturedProducts({ block }: { block: LandingBlock<FeaturedProductsContent> }) {
  const { t } = useTranslation("landing");
  const content = block.content ?? {} as FeaturedProductsContent;
  const products = content.products ?? [];

  return (
    <FeaturedProductsView
      eyebrow={content.eyebrow}
      title={block.title ?? t("landing:featured.bestsellers")}
      subtitle={block.subtitle ?? t("landing:featured.reorderedMost")}
      products={products}
      viewAllProductsLabel={t("landing:featured.viewAllProducts")}
    />
  );
}