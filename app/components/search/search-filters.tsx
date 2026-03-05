// components/search/SearchFilters.tsx
import { Skeleton } from '~/components/ui/skeleton';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Separator } from '~/components/ui/separator';
import { Slider } from '~/components/ui/slider';
import { ScrollArea } from '~/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '~/components/ui/sheet';
import { Badge } from '~/components/ui/badge';
import { Filter, X } from 'lucide-react';
import { CategoryRadioItem } from '~/components/category-radio-item';
import { useTranslation } from 'react-i18next';
import formatMoney from '~/lib/format-money';
import type { CategoryWithChildren } from '~/lib/organize-categories';

interface SearchFiltersProps {
    organizedCategories: CategoryWithChildren[];
    loadingCategories: boolean;
    selectedCategory: number | undefined;
    priceRange: [number, number];
    sortBy: 'created_at' | 'title';
    sortDirection: 'ASC' | 'DESC';
    hasActiveFilters: boolean;
    onCategoryChange: (id: number | undefined) => void;
    onPriceRangeChange: (range: [number, number]) => void;
    onSortByChange: (value: 'created_at' | 'title') => void;
    onSortDirectionChange: (value: 'ASC' | 'DESC') => void;
    onClearFilters: () => void;
    rangeConfig?: { min: number, max: number, step: number };
}

function CategorySection({
    organizedCategories,
    loadingCategories,
    selectedCategory,
    onCategoryChange,
    idPrefix,
    t,
}: {
    organizedCategories: CategoryWithChildren[];
    loadingCategories: boolean;
    selectedCategory: number | undefined;
    onCategoryChange: (id: number | undefined) => void;
    idPrefix: string;
    t: (key: string) => string;
}) {
    return (
        <div className="space-y-4">
            <h4 className="font-medium">{t('category')}</h4>
            {loadingCategories ? (
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-6 w-full" />)}
                </div>
            ) : organizedCategories.length > 0 ? (
                <RadioGroup
                    value={selectedCategory?.toString() ?? ''}
                    onValueChange={(value) => onCategoryChange(value ? parseInt(value) : undefined)}
                >
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="" id={`${idPrefix}-all-categories`} />
                            <Label htmlFor={`${idPrefix}-all-categories`} className="cursor-pointer">
                                {t('allCategories')}
                            </Label>
                        </div>
                        {organizedCategories.map((category) => (
                            <CategoryRadioItem
                                key={category.id}
                                category={category}
                                selectedCategory={selectedCategory}
                                onSelect={onCategoryChange}
                            />
                        ))}
                    </div>
                </RadioGroup>
            ) : (
                <p className="text-sm text-muted-foreground">{t('noCategoriesAvailable')}</p>
            )}
        </div>
    );
}

function SortSection({
    sortBy,
    sortDirection,
    onSortByChange,
    onSortDirectionChange,
    t,
}: {
    sortBy: 'created_at' | 'title';
    sortDirection: 'ASC' | 'DESC';
    onSortByChange: (v: 'created_at' | 'title') => void;
    onSortDirectionChange: (v: 'ASC' | 'DESC') => void;
    t: (key: string) => string;
}) {
    return (
        <div className="space-y-4">
            <h4 className="font-medium">{t('sortBy')}</h4>
            <Select value={sortBy} onValueChange={onSortByChange}>
                <SelectTrigger><SelectValue placeholder={t('sortBy')} /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="created_at">{t('newest')}</SelectItem>
                    <SelectItem value="title">{t('name')}</SelectItem>
                </SelectContent>
            </Select>
            <Select value={sortDirection} onValueChange={onSortDirectionChange}>
                <SelectTrigger><SelectValue placeholder={t('direction')} /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="DESC">{t('descending')}</SelectItem>
                    <SelectItem value="ASC">{t('ascending')}</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}

export function SearchFilters({
    organizedCategories,
    loadingCategories,
    selectedCategory,
    priceRange,
    sortBy,
    sortDirection,
    hasActiveFilters,
    onCategoryChange,
    onPriceRangeChange,
    onSortByChange,
    onSortDirectionChange,
    onClearFilters,
    rangeConfig
}: SearchFiltersProps) {
    const { t } = useTranslation('search_results');

    const filterContent = (idPrefix: string) => (
        <div className="space-y-6">
            <CategorySection
                organizedCategories={organizedCategories}
                loadingCategories={loadingCategories}
                selectedCategory={selectedCategory}
                onCategoryChange={onCategoryChange}
                idPrefix={idPrefix}
                t={t}
            />

            <Separator />

            {rangeConfig &&
                <div className="space-y-4">
                    <h4 className="font-medium">{t('priceRange')}</h4>
                    <div className="px-1">
                        <Slider
                            value={priceRange}
                            onValueChange={(s) => onPriceRangeChange(s as [number, number])}
                            min={rangeConfig.min}
                            max={rangeConfig.max}
                            step={rangeConfig.step}
                            className="w-full"
                        />
                        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                            <span>{formatMoney(priceRange[0], 0)}</span>
                            <span>{formatMoney(priceRange[1], 0)}</span>
                        </div>
                    </div>
                </div>}

            <Separator />

            <SortSection
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortByChange={onSortByChange}
                onSortDirectionChange={onSortDirectionChange}
                t={t}
            />
        </div>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{t('filters')}</h3>
                        <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-8 px-2">
                            <X className="h-4 w-4 mr-1" />
                            {t('clear')}
                        </Button>
                    </div>
                    <ScrollArea className="h-[200px] pr-4">
                        <CategorySection
                            organizedCategories={organizedCategories}
                            loadingCategories={loadingCategories}
                            selectedCategory={selectedCategory}
                            onCategoryChange={onCategoryChange}
                            idPrefix="desktop"
                            t={t}
                        />
                    </ScrollArea>
                    <Separator />
                    <div className="space-y-4">
                        <h4 className="font-medium">{t('priceRange')}</h4>
                        <div className="px-1">
                            <Slider
                                value={priceRange}
                                onValueChange={(s) => onPriceRangeChange(s as [number, number])}
                                max={1000}
                                step={10}
                                className="w-full"
                            />
                            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                                <span>{formatMoney(priceRange[0], 0)}</span>
                                <span>{formatMoney(priceRange[1], 0)}</span>
                            </div>
                        </div>
                    </div>
                    <Separator />
                    <SortSection
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                        onSortByChange={onSortByChange}
                        onSortDirectionChange={onSortDirectionChange}
                        t={t}
                    />
                </div>
            </div>

            {/* Mobile sheet */}
            <div className="lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="gap-2">
                            <Filter className="h-4 w-4" />
                            {t('filters')}
                            {hasActiveFilters && (
                                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                                    !
                                </Badge>
                            )}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full sm:w-96">
                        <SheetHeader className="border-b pb-4">
                            <SheetTitle>{t('filters')}</SheetTitle>
                        </SheetHeader>
                        <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
                            <div className="py-6 space-y-6">
                                {filterContent('mobile')}
                                <div className="pt-4">
                                    <Button className="w-full" onClick={onClearFilters}>
                                        {t('clearAllFilters')}
                                    </Button>
                                </div>
                            </div>
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}