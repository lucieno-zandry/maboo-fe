import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { Badge } from "~/components/ui/badge";

interface ProductsHeaderProps {
    productCount: number;
    t: TFunction
}

export function ProductsHeader({ productCount, t }: ProductsHeaderProps) {
    return (
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8">
            <div className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight">{t('ourCollection')}</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    {t('collectionDescription')}
                </p>
            </div>
            <div className="flex gap-2">
                <Badge variant="secondary" className="px-4 py-1.5 h-fit text-sm">
                    {t('productsFound', { count: productCount })}
                </Badge>
            </div>
        </header>
    );
}

export default function ({ productCount }: Pick<ProductsHeaderProps, 'productCount'>) {
    const { t } = useTranslation("products");
    return <ProductsHeader productCount={productCount} t={t} />
}