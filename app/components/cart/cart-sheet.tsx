import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { CartEmpty } from "./cart-empty";

interface CartSheetProps {
    items: CartItem[];
    onIncrease: (id: number) => void;
    onDecrease: (id: number) => void;
    onRemove: (id: number) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function CartSheet({ items, onIncrease, onDecrease, onRemove, open, setOpen }: CartSheetProps) {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side="right" className="p-4 w-[400px] sm:w-[450px]">
                <SheetHeader>
                    <SheetTitle>Your Cart</SheetTitle>
                    <SheetDescription className="sr-only">
                        Cart contents and checkout options
                    </SheetDescription>
                </SheetHeader>

                {items.length === 0 ? (
                    <CartEmpty />
                ) : (
                    <ScrollArea className="h-[70vh] pr-2 mt-4">
                        <div className="flex flex-col gap-4">
                            {items.map((item) => {
                                const variantSnapshot: VariantSnapshot = JSON.parse(item.variant_snapshot);
                                const productSnapshot: ProductSnapshot = JSON.parse(item.product_snapshot);
                                const variantOptionsSnapshot: VariantOptionsSnapshot = JSON.parse(item.variant_options_snapshot);

                                return (
                                    <div key={item.id} className="flex gap-3 rounded-xl border p-3">
                                        <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                                            {variantSnapshot.image ? (
                                                <img
                                                    src={variantSnapshot.image}
                                                    alt={productSnapshot.title}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <span className="text-xs opacity-60">No Image</span>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <div className="font-medium text-sm">{productSnapshot.title}</div>

                                            <div className="text-xs opacity-70 mt-1">
                                                {Object.entries(variantOptionsSnapshot).map(([group, value]) => (
                                                    <div key={group}>
                                                        {group}: {value}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="text-sm font-semibold mt-2">
                                                {item.unit_price.toLocaleString()} Ar
                                            </div>

                                            <div className="flex items-center gap-2 mt-3">
                                                <Button size="sm" variant="outline" onClick={() => onDecrease(item.id)}>
                                                    -
                                                </Button>
                                                <span className="text-sm w-6 text-center">{item.count}</span>
                                                <Button size="sm" variant="outline" onClick={() => onIncrease(item.id)}>
                                                    +
                                                </Button>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                className="text-red-500 mt-2 px-0"
                                                onClick={() => onRemove(item.id)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                )}

                <div className="mt-4 border-t pt-4 flex justify-between text-lg font-semibold">
                    <span>Subtotal:</span>
                    <span>{subtotal.toLocaleString()} Ar</span>
                </div>

                <Button className="w-full mt-4" disabled={items.length === 0}>
                    Checkout
                </Button>
            </SheetContent>
        </Sheet>
    );
}
