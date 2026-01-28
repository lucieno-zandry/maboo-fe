import { cn } from "~/lib/utils";

// NotificationItem.tsx
import { CheckCircle, Package, Truck, X } from "lucide-react";
import { Button } from "../ui/button";

export const TransactionItem = ({
    data,
    isUnread,
    onRemove
}: {
    data: TransactionNotificationData;
    isUnread: boolean;
    onRemove?: () => void; // Pass remove handler down
}) => {
    return (
        <div className="flex items-start justify-between gap-4 group">
            <div className="space-y-1 flex-1">
                <p className={cn("font-medium leading-none", isUnread && "text-primary")}>
                    {data.type === "payment_success" ? "Payment Successful" : "Payment Failed"}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">{data.message}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                    <span>Order #{data.order_uuid.split('-')[0]}</span>
                    <span>•</span>
                    <span>${data.amount}</span>
                </div>
            </div>

            <div className="flex flex-col items-end gap-2">
                {isUnread && <div className="h-2 w-2 mt-1 rounded-full bg-blue-600" />}
                {/* The "StopPropagation" is key here so clicking X doesn't trigger MarkAsRead/Navigate */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove?.();
                    }}
                >
                    <X className="h-3 w-3" />
                </Button>
            </div>
        </div>
    );
};

export const SystemItem = ({ data }: { data: OtherNotificationData }) => (
    <div className="space-y-1">
        <p className="font-medium leading-none">{data.title}</p>
        <p className="text-sm text-muted-foreground">{data.message}</p>
    </div>
);

const getStatusConfig = (status: ShipmentNotificationData['status']) => {
    switch (status) {
        case 'PROCESSING':
            return {
                icon: Package,
                label: 'Order Processing',
                color: 'text-blue-600',
            };
        case 'SHIPPED':
            return {
                icon: Truck,
                label: 'Order Shipped',
                color: 'text-orange-600',
            };
        case 'DELIVERED':
            return {
                icon: CheckCircle,
                label: 'Order Delivered',
                color: 'text-green-600',
            };
    }
};

export const ShipmentItem = ({
    data,
    isUnread,
    onRemove
}: {
    data: ShipmentNotificationData;
    isUnread: boolean;
    onRemove?: () => void;
}) => {
    const statusConfig = getStatusConfig(data.status);
    const Icon = statusConfig.icon;

    return (
        <div className="flex items-start justify-between gap-4 group">
            <div className="flex items-start gap-3 flex-1">
                <Icon className={cn("h-5 w-5 mt-0.5", statusConfig.color)} />
                <div className="space-y-1 flex-1">
                    <p className={cn("font-medium leading-none", isUnread && "text-primary")}>
                        {statusConfig.label}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{data.message}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                        <span>Order #{data.order_uuid.split('-')[0]}</span>
                        {data.status === 'SHIPPED' && data.shipment_data?.carrier && (
                            <>
                                <span>•</span>
                                <span>{data.shipment_data.carrier}</span>
                            </>
                        )}
                        {data.status === 'SHIPPED' && data.shipment_data?.tracking_number && (
                            <>
                                <span>•</span>
                                <span className="font-mono">{data.shipment_data.tracking_number}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-end gap-2">
                {isUnread && <div className="h-2 w-2 mt-1 rounded-full bg-blue-600" />}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove?.();
                    }}
                >
                    <X className="h-3 w-3" />
                </Button>
            </div>
        </div>
    );
};