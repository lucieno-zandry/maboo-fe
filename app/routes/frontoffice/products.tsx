import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { motion } from "framer-motion";
import { Link, redirect, useLoaderData } from "react-router";
import { getProducts } from "~/api/http-requests";
import formatMoney from "~/lib/format-money";
import { Badge } from "~/components/ui/badge";
import { ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { HttpException } from "~/api/app-fetch";
import handleHttpExceptionError from "~/lib/handle-http-exception-error";

export const loader = async () => {
    try {
        const response = await getProducts();
        return response.data?.products;
    } catch (error) {
        if (error instanceof HttpException) {
            return handleHttpExceptionError({ status: error.status, navigate: redirect })
        }
    }
}

export default function ProductsPage() {
    const products = useLoaderData() as Product[];

    return (
        <div className="container mx-auto px-4 md:px-6 py-12 space-y-10">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight">Our Collection</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Discover quality variants tailored for your professional and lifestyle needs.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Badge variant="secondary" className="px-4 py-1.5 h-fit text-sm">
                        {products.length} Products Found
                    </Badge>
                </div>
            </header>

            {/* Grid Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product, i) => {
                    const variantCount = product.variants?.length || 0;
                    const prices = (product.variants || []).map((v) => v.price);
                    const specialPrices = (product.variants || [])
                        .map((v) => v.special_price)
                        .filter((p): p is number => p != null);

                    const minPrice = prices.length ? Math.min(...prices) : undefined;
                    const minSpecial = specialPrices.length ? Math.min(...specialPrices) : undefined;
                    const displayPrice = minSpecial ?? minPrice;
                    const originalPrice = minPrice;

                    const hasSale = minSpecial != null && originalPrice != null && originalPrice > minSpecial;
                    const discountPercent = hasSale ? Math.round(((originalPrice! - minSpecial!) / originalPrice!) * 100) : 0;

                    const variant = product.variants?.[0];
                    const imgSrc = (variant?.image as string) || product.images?.[0]?.filename;

                    return (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05, duration: 0.4 }}
                        >
                            <Card className="group relative h-full overflow-hidden border-none shadow-none hover:shadow-2xl transition-all duration-500 bg-transparent">
                                {/* Image Container */}
                                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                                    <Link to={`/product/${product.slug}`}>
                                        <img
                                            src={imgSrc}
                                            alt={product.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </Link>

                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        {hasSale && (
                                            <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none px-3 py-1 font-bold">
                                                -{discountPercent}% OFF
                                            </Badge>
                                        )}
                                        <Badge variant="outline" className="bg-background/80 backdrop-blur-md border-none px-3 py-1 text-xs">
                                            {variantCount > 1 ? `${variantCount} Options` : 'Single Item'}
                                        </Badge>
                                    </div>

                                    {/* Quick Hover Action */}
                                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        <Button className="w-full shadow-xl bg-primary text-primary-foreground font-bold" asChild>
                                            <Link to={`/product/${product.slug}`}>
                                                Quick View <ArrowRight className="ml-2 w-4 h-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>

                                <CardContent className="pt-4 px-1 pb-2">
                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                                            {product.category?.title || 'General'}
                                        </p>
                                        <Link to={`/product/${product.slug}`} className="block">
                                            <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">
                                                {product.title}
                                            </h3>
                                        </Link>

                                        <div className="flex items-center gap-2 pt-1">
                                            <span className="text-xl font-extrabold text-foreground">
                                                {displayPrice ? formatMoney(displayPrice) : "—"}
                                            </span>
                                            {hasSale && (
                                                <span className="text-sm text-muted-foreground line-through">
                                                    {formatMoney(originalPrice!)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}