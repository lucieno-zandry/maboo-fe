import { Button } from '~/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select';
import { Grid, List } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProductsToolbarProps {
    loading: boolean;
    products: Product[];
    totalProducts: number;
    viewMode: 'grid' | 'list';
    sortBy: 'created_at' | 'title';
    sortDirection: 'ASC' | 'DESC';
    onViewModeChange: (mode: 'grid' | 'list') => void;
    onSortChange: (sortBy: 'created_at' | 'title', dir: 'ASC' | 'DESC') => void;
}

export function ProductsToolbar({
    loading,
    products,
    totalProducts,
    viewMode,
    sortBy,
    sortDirection,
    onViewModeChange,
    onSortChange,
}: ProductsToolbarProps) {
    const { t } = useTranslation('search_results');

    const combinedSort = `${sortBy}-${sortDirection}`;

    const handleCombinedSort = (value: string) => {
        const [by, dir] = value.split('-');
        onSortChange(by as 'created_at' | 'title', dir as 'ASC' | 'DESC');
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => onViewModeChange('grid')}
                        aria-label="Grid view"
                    >
                        <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => onViewModeChange('list')}
                        aria-label="List view"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                    {loading
                        ? t('loading')
                        : t('showingProducts', { count: products.length, total: totalProducts })}
                </span>
            </div>

            {/* Mobile sort — desktop sort is inside the sidebar */}
            <div className="lg:hidden">
                <Select value={combinedSort} onValueChange={handleCombinedSort}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder={t('sortBy')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="created_at-DESC">{t('newestFirst')}</SelectItem>
                        <SelectItem value="created_at-ASC">{t('oldestFirst')}</SelectItem>
                        <SelectItem value="title-ASC">{t('nameAZ')}</SelectItem>
                        <SelectItem value="title-DESC">{t('nameZA')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}