import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { CartEmpty } from "./cart-empty";
import CartSheetItem from "./cart-sheet-item";
import formatMoney from "~/lib/format-money";

interface CartSheetProps {
    items: CartItem[];
    onCountChange: (id: number, currentValue: number) => void;
    onRemove: (id: number) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function CartSheet({ items, onRemove, onCountChange, open, setOpen }: CartSheetProps) {
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
                    <CartEmpty onClose={() => setOpen(false)} />
                ) : (
                    <ScrollArea className="h-[70vh] pr-2 mt-4">
                        <div className="flex flex-col gap-4">
                            {items.map((item, key) => <CartSheetItem key={key} item={item} />)}
                        </div>
                    </ScrollArea>
                )}

                <div className="mt-4 border-t pt-4 flex justify-between text-lg font-semibold">
                    <span>Subtotal:</span>
                    <span>{formatMoney(subtotal)}</span>
                </div>

                <Button className="w-full mt-4" disabled={items.length === 0}>
                    Checkout
                </Button>
            </SheetContent>
        </Sheet>
    );
}
