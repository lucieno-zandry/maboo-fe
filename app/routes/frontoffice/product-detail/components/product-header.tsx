// routes/frontoffice/product-detail/components/product-header.tsx

import { Link } from "react-router";
import { useAppPathname } from "~/lib/app-pathname";
import { useTranslation } from "react-i18next";
import { ChevronRight, Tag } from "lucide-react";

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
            <nav className="flex flex-wrap items-center gap-1 text-xs text-neutral-400">
                {breadcrumbs.map((crumb, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1">
                        {crumb.href ? (
                            <Link
                                to={crumb.href}
                                className="hover:text-neutral-700 transition-colors duration-150"
                            >
                                {crumb.label}
                            </Link>
                        ) : (
                            <span className="text-neutral-600 font-medium">{crumb.label}</span>
                        )}
                        {idx < breadcrumbs.length - 1 && (
                            <ChevronRight className="h-3 w-3 text-neutral-300" />
                        )}
                    </span>
                ))}
            </nav>

            {/* Title */}
            <h1
                className="text-3xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-4xl"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
                {title}
            </h1>

            {/* Description */}
            {description && (
                <div
                    className="prose prose-sm max-w-none text-neutral-500 sm:prose-base leading-relaxed
                        prose-p:my-2 prose-headings:text-neutral-700 prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline"
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            )}

            {/* Category link */}
            {category && (
                <Link
                    to={appPath(`/products?category_id=${category.id}`)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 hover:bg-amber-100 transition-colors duration-150"
                >
                    <Tag className="h-3 w-3" />
                    {seeMoreLabel.replace("{{category}}", category.title)}
                </Link>
            )}
        </div>
    );
}

// ── Smart (Container) ────────────────────────────────────────────────────────
interface ProductHeaderProps {
    product: Product;
    categories: Category[] | null;
}

export function ProductHeader({ product, categories }: ProductHeaderProps) {
    const { t } = useTranslation("product-detail");
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

function buildBreadcrumbs(params: {
    category?: Category;
    allCategories: Category[];
    t: (key: string) => string;
}) {
    const { allCategories = [], t, category } = params;

    const crumbs: { label: string; href?: string }[] = [
        { label: t("header.home"), href: "/" },
    ];

    if (!category) {
        crumbs.push({ label: t("header.products") });
        return crumbs;
    }

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