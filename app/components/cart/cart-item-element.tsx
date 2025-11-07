import { Button } from "~/components/ui/button";
import { X } from "lucide-react"; // Using an icon for 'Remove'

interface CartItemElementProps {
    item: CartItem;
    onIncrease: (id: number) => void;
    onDecrease: (id: number) => void;
    onRemove: (id: number) => void;
}

const CartItemElement = ({ item, onIncrease, onDecrease, onRemove }: CartItemElementProps) => {
    const { variant_snapshot, product_snapshot, variant_options_snapshot } = item;

    const variant = JSON.parse(variant_snapshot || '{}') as VariantSnapshot;
    const product = JSON.parse(product_snapshot || '{}') as ProductSnapshot;
    const options = JSON.parse(variant_options_snapshot || '{}') as VariantOptionsSnapshot;

    return (
        <div className="flex gap-4 p-3 border rounded-lg hover:shadow-sm transition-shadow relative">
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={() => onRemove(item.id)}
                aria-label="Remove item"
            >
                <X className="h-4 w-4" />
            </Button>

            <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border">
                {variant.image ? (
                    <img
                        src={variant.image}
                        alt={product.title}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <span className="text-xs opacity-60 text-center p-2">No Image</span>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="font-semibold text-base truncate pr-8">{product.title}</div>

                <div className="text-xs opacity-70 mt-1 space-y-0.5">
                    {Object.entries(options).map(([group, value]) => (
                        <div key={group}>
                            <span className="font-medium capitalize">{group}</span>: {value}
                        </div>
                    ))}
                </div>

                <div className="mt-2 flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="text-xs opacity-80">Unit Price: {item.unit_price.toLocaleString()} Ar</span>
                        <span className="text-sm font-bold mt-0.5">Total: {item.total.toLocaleString()} Ar</span>
                    </div>

                    <div className="flex items-center gap-1.5 border rounded-md p-0.5 bg-white">
                        <Button size="icon" variant="outline" onClick={() => onDecrease(item.id)} className="h-6 w-6 p-0 text-lg">
                            -
                        </Button>
                        <span className="text-sm w-5 text-center font-medium">{item.count}</span>
                        <Button size="icon" variant="outline" onClick={() => onIncrease(item.id)} className="h-6 w-6 p-0 text-lg">
                            +
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItemElement;