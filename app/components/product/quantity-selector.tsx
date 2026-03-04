// app/components/product/quantity-selector.tsx
import { Button } from "~/components/ui/button";
import { Minus, Plus } from "lucide-react";

type Props = {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    max?: number;
    disabled?: boolean;
    t: (key: string) => string;
};

export function QuantitySelector({
    quantity,
    onIncrease,
    onDecrease,
    max,
    disabled,
    t,
}: Props) {
    return (
        <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700">{t("quantity")}</label>
            <div className="flex items-center bg-white border border-gray-200 rounded-full p-1.5 shadow-sm">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8 text-gray-500"
                    onClick={onDecrease}
                    disabled={disabled || quantity <= 1}
                >
                    <Minus className="w-3 h-3" />
                </Button>
                <span className="w-10 text-center font-bold text-gray-900">{quantity}</span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8 text-gray-500"
                    onClick={onIncrease}
                    disabled={disabled || (max !== undefined && quantity >= max)}
                >
                    <Plus className="w-3 h-3" />
                </Button>
            </div>
        </div>
    );
}