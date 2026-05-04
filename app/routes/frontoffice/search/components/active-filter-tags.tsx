import { useTranslation } from "react-i18next";
import { SORT_OPTIONS, useSearchStore } from "~/routes/frontoffice/search/stores/use-search-store";
import { X } from "lucide-react";
import { useFormatMoney } from "~/lib/format-money";
import { Badge } from "~/components/ui/badge";

export interface ActiveFilterTag {
  key: string;
  label: string;
  onRemove: () => void;
}

export interface ActiveFilterTagsViewProps {
  tags: ActiveFilterTag[];
}

export function ActiveFilterTagsView({ tags }: ActiveFilterTagsViewProps) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <Badge key={tag.key} variant="secondary" className="gap-1 pr-1 text-xs font-normal">
          {tag.label}
          <button
            onClick={tag.onRemove}
            className="ml-0.5 rounded-full p-0.5 hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <X className="size-2.5" />
          </button>
        </Badge>
      ))}
    </div>
  );
}

export function ActiveFilterTags() {
  const { t } = useTranslation("search");
  const { filters, categories, priceRangeMeta, setFilter } = useSearchStore();
  const formatMoney = useFormatMoney();
  const tags: ActiveFilterTag[] = [];

  if (filters.search) {
    tags.push({
      key: "search",
      label: `"${filters.search}"`,
      onRemove: () => setFilter("search", ""),
    });
  }

  if (filters.category_id !== undefined) {
    const cat = categories.find((c) => c.id === filters.category_id);
    tags.push({
      key: "category",
      label: cat?.title ?? t("search.filter.category_fallback", { id: filters.category_id }),
      onRemove: () => setFilter("category_id", undefined),
    });
  }

  const hasMinPrice = filters.min_price !== undefined && priceRangeMeta && filters.min_price > priceRangeMeta.min;
  const hasMaxPrice = filters.max_price !== undefined && priceRangeMeta && filters.max_price < priceRangeMeta.max;

  if (hasMinPrice || hasMaxPrice) {
    const minLabel = hasMinPrice ? formatMoney(filters.min_price) : t("search.filter.price_min");
    const maxLabel = hasMaxPrice ? formatMoney(filters.max_price) : t("search.filter.price_max");
    tags.push({
      key: "price",
      label: t("search.filter.price_range_label", { min: minLabel, max: maxLabel }),
      onRemove: () => {
        setFilter("min_price", undefined);
        setFilter("max_price", undefined);
      },
    });
  }

  if (filters.sortIndex !== 0) {
    const sortKey = `sort.${filters.sortIndex}`;
    tags.push({
      key: "sort",
      label: t("search.filter.sort_label", { label: t(sortKey) }),
      onRemove: () => setFilter("sortIndex", 0),
    });
  }

  return <ActiveFilterTagsView tags={tags} />;
}