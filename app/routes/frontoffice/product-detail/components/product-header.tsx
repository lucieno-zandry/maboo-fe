// routes/frontoffice/product-detail/components/product-header.tsx

import { Link } from "react-router";
import { useAppPathname } from "~/lib/app-pathname";
import { useTranslation } from "react-i18next";

// ── Dumb (View) ──────────────────────────────────────────────────────────────
interface ProductHeaderViewProps {
    title: string;
    description: string;
    breadcrumbs: { label: string; href?: string }[];
    category?: Category | null;
    seeMoreLabel: string;
}

export function ProductHeaderView({
    title,
    description,
    breadcrumbs,
    category,
    seeMoreLabel,
}: ProductHeaderViewProps) {
    const appPath = useAppPathname();

    return (
        <div className="space-y-4">
            {/* Breadcrumb */}
            <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground sm:text-sm">
                {breadcrumbs.map((crumb, idx) => (
                    <span key={idx} className="inline-flex items-center gap-2">
                        {crumb.href ? (
                            <Link to={crumb.href} className="hover:text-foreground hover:underline">
                                {crumb.label}
                            </Link>
                        ) : (
                            <span>{crumb.label}</span>
                        )}
                        {idx < breadcrumbs.length - 1 && <span>/</span>}
                    </span>
                ))}
            </nav>

            {/* Title */}
            <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{title}</h1>

            {/* Description (rich text) */}
            {description && (
                <div
                    className="prose prose-sm max-w-none text-muted-foreground sm:prose-base"
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            )}

            {/* Category link (if any) */}
            {category && (
                <Link
                    to={appPath(`/products?category_id=${category.id}`)}
                    className="inline-flex text-sm text-primary underline underline-offset-2 hover:opacity-80"
                >
                    {seeMoreLabel.replace("{{category}}", category.title)}
                </Link>
            )}
        </div>
    );
}

// ── Smart (Container) ────────────────────────────────────────────────────────
interface ProductHeaderProps {
    product: Product;
    categories: Category[] | null; // all categories from store or fetched
}

export function ProductHeader({ product, categories }: ProductHeaderProps) {
    const { t } = useTranslation("product-detail");
    // Build breadcrumb from category hierarchy
    const breadcrumbs = buildBreadcrumbs({ category: product.category, allCategories: categories || [], t });

    return (
        <ProductHeaderView
            title={product.title}
            description={product.description}
            breadcrumbs={breadcrumbs}
            category={product.category}
            seeMoreLabel={t("header.seeMoreCategory")}
        />
    );
}

// Helper: traverse parent chain, now with translations
function buildBreadcrumbs(params: {
    category?: Category,
    allCategories: Category[],
    t: (key: string) => string
}) {
    const { allCategories = [], t, category } = params;

    const crumbs: { label: string; href?: string }[] = [
        { label: t("header.home"), href: "/" },
    ];

    if (!category) {
        crumbs.push({ label: t("header.products") });
        return crumbs;
    }

    // Build path from current category up to root
    const path: Category[] = [];
    let current: Category | undefined = category;
    while (current) {
        path.unshift(current);
        current = allCategories.find((c) => c.id === current!.parent_id);
    }

    path.forEach((cat) => {
        crumbs.push({
            label: cat.title,
            href: `/products?category_id=${cat.id}`,
        });
    });

    return crumbs;
}