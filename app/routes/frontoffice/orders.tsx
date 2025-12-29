import { useLoaderData, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Package, Calendar, ChevronRight, MapPin, Ticket } from "lucide-react";
import formatMoney from "~/lib/format-money";
import { getOrders } from "~/api/http-requests";

export const clientLoader = async () => {
    const response = await getOrders();
    return response.data?.orders;
}

// Assuming your loader fetches Orders joined with their CartItems
export default function OrdersPage() {
    const { orders } = useLoaderData<{ orders: (Order)[] }>();

    if (orders.length === 0) {
        return (
            <div className="container mx-auto p-10 text-center space-y-4">
                <Package className="w-16 h-16 mx-auto text-muted-foreground opacity-20" />
                <h2 className="text-2xl font-bold">No orders yet</h2>
                <p className="text-muted-foreground">When you buy items, they will appear here.</p>
                <Button asChild><Link to="/shop">Start Shopping</Link></Button>
            </div>
        );
    }

    return (
        <div className="container max-w-5xl mx-auto p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
                <p className="text-muted-foreground text-sm">Manage and track your recent purchases.</p>
            </div>

            <div className="grid gap-6">
                {orders.map((order) => (
                    <OrderCard key={order.uuid} order={order} />
                ))}
            </div>
        </div>
    );
}

function OrderCard({ order }: { order: Order }) {
    const date = new Date(order.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <Card className="overflow-hidden transition-all hover:shadow-md border-muted/60">
            {/* Header: Order ID and Global Stats */}
            <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-background rounded-lg border shadow-sm">
                            <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider leading-none mb-1">
                                Order Number
                            </p>
                            <CardTitle className="text-base font-mono">#{order.uuid.split("-")[0]}</CardTitle>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:block text-right">
                            <p className="text-xs text-muted-foreground uppercase mb-1">Date Placed</p>
                            <p className="text-sm font-medium">{date}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground uppercase mb-1">Total Amount</p>
                            <p className="text-sm font-bold text-primary">{formatMoney(order.total)}</p>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                            <Link to={`/orders/${order.uuid}`}><ChevronRight className="w-5 h-5" /></Link>
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
                    {/* Left Column: Product Snapshots */}
                    <div className="md:col-span-2 p-6 space-y-4">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">Items in this order</p>
                        <div className="flex flex-wrap gap-4">
                            {order.cart_items?.map((item) => (
                                <div key={item.id} className="group relative">
                                    <div className="w-16 h-16 rounded-md border bg-muted overflow-hidden">
                                        <img
                                            src={item.variant_snapshot.image || item.product_snapshot.main_image || ""}
                                            alt={item.product_snapshot.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                        />
                                    </div>
                                    <span className="absolute -top-2 -right-2 bg-primary text-[10px] text-white font-bold px-1.5 py-0.5 rounded-full ring-2 ring-background">
                                        x{item.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Address & Coupon Summary */}
                    <div className="p-6 bg-muted/10 space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                <div className="text-xs">
                                    <p className="font-semibold text-foreground/80">Shipping to</p>
                                    <p className="text-muted-foreground line-clamp-1">{order.address_snapshot.fullname}</p>
                                    <p className="text-muted-foreground line-clamp-1">{order.address_snapshot.line1}</p>
                                </div>
                            </div>

                            {order.coupon_snapshot && (
                                <div className="flex items-start gap-2">
                                    <Ticket className="w-4 h-4 text-emerald-600 mt-0.5" />
                                    <div className="text-xs">
                                        <p className="font-semibold text-emerald-700">Coupon Applied</p>
                                        <p className="text-muted-foreground">
                                            {order.coupon_snapshot.code} (-{formatMoney(order.coupon_discount_applied)})
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                            <Link to={`/orders/${order.uuid}`}>View Order Details</Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}