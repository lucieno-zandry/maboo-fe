// components/search/ActiveFilters.tsx
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ActiveFiltersProps {
    selectedCategory: number | undefined;
    categories: Category[];
    priceRange: [number, number];
    onRemoveCategory: () => void;
    onRemovePrice: () => void;
    onClearAll: () => void;
}

export function ActiveFilters({
    selectedCategory,
    categories,
    priceRange,
    onRemoveCategory,
    onRemovePrice,
    onClearAll,
}: ActiveFiltersProps) {
    const { t } = useTranslation('search_results');

    const hasCategoryFilter = Boolean(selectedCategory && categories.find((c) => c.id === selectedCategory));
    const hasPriceFilter = priceRange[0] > 0 || priceRange[1] < 1000;

    if (!hasCategoryFilter && !hasPriceFilter) return null;

    return (
        <div className="mb-6 flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium">{t('activeFilters')}</span>

            {hasCategoryFilter && (
                <Badge variant="secondary" className="gap-1">
                    {t('categoryLabel')}: {categories.find((c) => c.id === selectedCategory)?.title}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-3 w-3 ml-1 hover:bg-transparent"
                        onClick={onRemoveCategory}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </Badge>
            )}

            {hasPriceFilter && (
                <Badge variant="secondary" className="gap-1">
                    {t('priceLabel')}: ${priceRange[0]} - ${priceRange[1]}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-3 w-3 ml-1 hover:bg-transparent"
                        onClick={onRemovePrice}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </Badge>
            )}

            <Button variant="ghost" size="sm" onClick={onClearAll} className="ml-2">
                {t('clearAll')}
            </Button>
        </div>
    );
}