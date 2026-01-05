import { useLoaderData, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
    Package,
    ChevronRight,
    MapPin,
    Ticket,
    CheckCircle2,
    Clock,
    ArrowRight,
    Wallet
} from "lucide-react";
import formatMoney from "~/lib/format-money";
import { getOrders } from "~/api/http-requests";

export const clientLoader = async () => {
    const response = await getOrders();
    return response.data;
}

export default function OrdersPage() {
    const { orders } = useLoaderData<{ orders: Order[] }>();

    if (orders.length === 0) {
        return (
            <div className="container mx-auto p-10 text-center space-y-4">
                <Package className="w-16 h-16 mx-auto text-muted-foreground opacity-20" />
                <h2 className="text-2xl font-bold">No orders yet</h2>
                <p className="text-muted-foreground">When you buy items, they will appear here.</p>
                <Button asChild><Link to="/products">Start Shopping</Link></Button>
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

    const transactions = order.transactions ?? [];
    const hasSucceeded = transactions.some(t => t.status === 'SUCCESS');
    const hasPending = transactions.some(t => t.status === 'PENDING');

    // UI Configuration based on payment status
    let statusConfig = {
        label: "Awaiting Payment",
        variant: "secondary" as "secondary" | "default" | "outline", // Neutral but distinct
        icon: Wallet,
        colorClass: "text-muted-foreground",
        requiresReview: true
    };

    if (hasSucceeded) {
        statusConfig = {
            label: "Paid",
            variant: "default" as const,
            icon: CheckCircle2,
            colorClass: "text-primary",
            requiresReview: false
        };
    } else if (hasPending) {
        statusConfig = {
            label: "Processing",
            variant: "outline" as const,
            icon: Clock,
            colorClass: "text-orange-500",
            requiresReview: false
        };
    }

    return (
        <Card className="overflow-hidden transition-all hover:shadow-md border-muted/60">
            {/* Header */}
            <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-background rounded-lg border shadow-sm">
                            <Package className={`w-5 h-5 ${statusConfig.colorClass}`} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider leading-none">
                                    Order Number
                                </p>
                                <Badge variant={statusConfig.variant} className="text-[10px] px-1.5 py-0 h-4 uppercase font-semibold">
                                    {statusConfig.label}
                                </Badge>
                            </div>
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
                            <Link to={`/order/${order.uuid}`}><ChevronRight className="w-5 h-5" /></Link>
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
                    {/* Items Preview */}
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
                                    <span className="absolute -top-2 -right-2 bg-primary text-[10px] text-white font-bold px-1.5 py-0.5 rounded-full ring-2 ring-background shadow-sm">
                                        x{item.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Column */}
                    <div className={`p-6 flex flex-col justify-between space-y-4 ${statusConfig.requiresReview ? 'bg-primary/[0.03]' : 'bg-muted/10'}`}>
                        <div className="space-y-3">
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                <div className="text-xs text-muted-foreground">
                                    <p className="font-semibold text-foreground/80">Shipping to</p>
                                    <p className="line-clamp-1">{order.address_snapshot.fullname}</p>
                                </div>
                            </div>

                            {order.coupon_snapshot && (
                                <div className="flex items-start gap-2">
                                    <Ticket className="w-4 h-4 text-emerald-600 mt-0.5" />
                                    <div className="text-xs">
                                        <p className="font-semibold text-emerald-700">Coupon Used</p>
                                        <p className="text-muted-foreground">{order.coupon_snapshot.code}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {statusConfig.requiresReview ? (
                            <Button size="sm" className="w-full text-xs gap-2 group" asChild>
                                <Link to={`/order/${order.uuid}`}>
                                    Review & Pay
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        ) : (
                            <Button variant="outline" size="sm" className="w-full text-xs text-muted-foreground" asChild>
                                <Link to={`/order/${order.uuid}`}>View Order</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}