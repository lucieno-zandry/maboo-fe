import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addVariantToCart, getProduct } from "~/api/http-requests";
import {
    useLoaderData,
    useNavigation,
    useFetcher,
    type ActionFunctionArgs,
    type LoaderFunctionArgs,
    redirect
} from "react-router";
import { Loader2, Minus, Plus, ShoppingCart, CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import NotFound from "~/components/not-found";
import { useRefreshCart } from "~/hooks/use-cart";
import formatMoney from "~/lib/format-money";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import useCheckoutStore from "~/hooks/use-checkout-store";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const { slug } = params;
    const response = slug ? await getProduct(slug) : null;
    return response?.data?.product || null;
}

export const clientAction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const variantId = formData.get('variant_id')?.toString();
    const count = formData.get('count')?.toString();
    const isBuyNow = formData.get('buy_now')?.toString() === "true";
    const refreshCart = useRefreshCart();

    if (variantId && count) {
        const response = await addVariantToCart({
            variant_id: parseInt(variantId),
            count: parseInt(count)
        });

        if (response.data?.cart_item) {
            // Logic: If "Buy Now" was clicked, skip the toast and go to checkout
            if (isBuyNow) {
                const { setCartItemsIds } = useCheckoutStore.getState();
                setCartItemsIds([response.data.cart_item.id]);
                return redirect("/checkout");
            }

            await refreshCart();
            toast.success("Product added to cart!");
            return { success: true };
        }
    }

    toast.error("Failed to add product to cart.");
    return { status: 422 };
}

export default function ProductPage() {
    const product = useLoaderData<Product | null>();
    const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [count, setCount] = useState<number>(1);

    // We use fetcher instead of submit to keep the user on the page 
    // without a full page reload unless we redirect (Buy Now)
    const fetcher = useFetcher();
    const navigation = useNavigation();
    const refreshCart = useRefreshCart();

    const isSubmitting = fetcher.state !== "idle" || navigation.state !== "idle";

    // 🧮 Subtotal computation
    const subtotal = useMemo(() => {
        if (!selectedVariant) return 0;
        const unitPrice = selectedVariant.special_price || selectedVariant.price;
        return unitPrice * count;
    }, [selectedVariant, count]);

    if (!product) return <NotFound />;

    const handleOptionSelect = (groupId: number, optionId: number) => {
        const updated = { ...selectedOptions, [groupId]: optionId };
        setSelectedOptions(updated);

        const matchingVariant = product.variants?.find((variant) =>
            variant.variant_options?.every((opt) =>
                Object.values(updated).includes(opt.id)
            )
        );

        setSelectedVariant(matchingVariant || null);
        setCount(1);
    };

    // This handles the "Buy Now" logic specifically
    const onBuyNow = () => {
        if (!selectedVariant) return;
        fetcher.submit(
            {
                variant_id: selectedVariant.id.toString(),
                count: count.toString(),
                buy_now: "true"
            },
            { method: "POST" }
        );
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-10">
                <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">

                    {/* Left Column: Image Gallery */}
                    <div className="space-y-6">
                        <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted border border-gray-100">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={selectedVariant?.id || 'default'}
                                    src={selectedVariant?.image || product.images?.[0]?.filename || "/placeholder.png"}
                                    alt={product.title}
                                    className="h-full w-full object-cover"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </AnimatePresence>
                            {selectedVariant?.special_price && (
                                <Badge className="absolute top-6 left-6 bg-emerald-500 text-white border-none px-4 py-1.5 text-sm font-bold shadow-lg">
                                    SALE
                                </Badge>
                            )}
                        </div>

                        <div className="hidden lg:block space-y-4 pt-8 border-t">
                            <h2 className="text-xl font-bold tracking-tight text-gray-900">About this product</h2>
                            <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
                                {product.description}
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Purchase Info */}
                    <div className="flex flex-col">
                        <div className="lg:sticky lg:top-24 space-y-8">
                            <header className="space-y-4">
                                <Badge variant="outline" className="rounded-full px-4 py-1 text-gray-500 border-gray-200">
                                    {product.category?.title || 'Featured Product'}
                                </Badge>
                                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                                    {product.title}
                                </h1>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-gray-900">
                                            {formatMoney(selectedVariant?.special_price || selectedVariant?.price || 0)}
                                        </span>
                                        {selectedVariant?.special_price && (
                                            <span className="text-xl text-gray-400 line-through">
                                                {formatMoney(selectedVariant.price)}
                                            </span>
                                        )}
                                    </div>
                                    <Separator orientation="vertical" className="h-6" />
                                    <span className={cn(
                                        "text-sm font-semibold flex items-center gap-1.5",
                                        selectedVariant && selectedVariant.stock > 0 ? "text-emerald-600" : "text-red-500"
                                    )}>
                                        {selectedVariant && selectedVariant.stock > 0 ? (
                                            <><CheckCircle2 className="w-4 h-4" /> In Stock</>
                                        ) : "Out of Stock"}
                                    </span>
                                </div>
                            </header>

                            {/* Variant Selectors */}
                            <div className="space-y-6">
                                {product.variant_groups?.map((group) => (
                                    <div key={group.id} className="space-y-3">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                                            {group.name}
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {group.variant_options?.map((option) => (
                                                <button
                                                    key={option.id}
                                                    onClick={() => handleOptionSelect(group.id, option.id)}
                                                    className={cn(
                                                        "px-6 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200",
                                                        selectedOptions[group.id] === option.id
                                                            ? "border-black bg-black text-white shadow-md"
                                                            : "border-gray-100 bg-white text-gray-600 hover:border-gray-300"
                                                    )}
                                                >
                                                    {option.value}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Cart Interaction Area */}
                            <div className="p-6 rounded-[2.5rem] border border-gray-100 bg-gray-50/50 space-y-6">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold text-gray-700">Quantity</label>
                                    <div className="flex items-center bg-white border border-gray-200 rounded-full p-1.5 shadow-sm">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full h-8 w-8 text-gray-500"
                                            onClick={() => setCount(c => Math.max(1, c - 1))}
                                            disabled={count <= 1 || !selectedVariant}
                                        >
                                            <Minus className="w-3 h-3" />
                                        </Button>
                                        <span className="w-10 text-center font-bold text-gray-900">{count}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full h-8 w-8 text-gray-500"
                                            onClick={() => setCount(c => c + 1)}
                                            disabled={!selectedVariant || count >= (selectedVariant?.stock || 0)}
                                        >
                                            <Plus className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {/* MAIN ADD TO CART */}
                                    <fetcher.Form method="post">
                                        <input type="hidden" name="variant_id" value={selectedVariant?.id} />
                                        <input type="hidden" name="count" value={count} />
                                        <Button
                                            type="submit"
                                            className="w-full h-16 rounded-2xl text-lg font-bold shadow-lg bg-black text-white hover:bg-gray-800 transition-all"
                                            disabled={!selectedVariant || selectedVariant.stock <= 0 || isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                            ) : (
                                                <div className="flex items-center justify-between w-full px-2">
                                                    <div className="flex items-center">
                                                        <ShoppingCart className="w-5 h-5 mr-3" />
                                                        <span>Add to Cart</span>
                                                    </div>
                                                    <span className="text-sm opacity-80">{formatMoney(subtotal)}</span>
                                                </div>
                                            )}
                                        </Button>
                                    </fetcher.Form>

                                    {/* BUY NOW BUTTON */}
                                    <Button
                                        variant="outline"
                                        onClick={onBuyNow}
                                        className="w-full h-16 rounded-2xl text-lg font-bold border-2 border-gray-200 hover:border-black transition-all"
                                        disabled={!selectedVariant || selectedVariant.stock <= 0 || isSubmitting}
                                    >
                                        Buy it now
                                    </Button>
                                </div>
                            </div>

                            {/* Extra Trust Info */}
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
                                    <Truck className="w-5 h-5 text-gray-400" />
                                    <div className="text-[11px] leading-tight font-bold text-gray-900">FREE SHIPPING<br /><span className="text-gray-400 font-medium">On all local orders</span></div>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
                                    <ShieldCheck className="w-5 h-5 text-gray-400" />
                                    <div className="text-[11px] leading-tight font-bold text-gray-900">2 YEAR WARRANTY<br /><span className="text-gray-400 font-medium">Full replacement</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}