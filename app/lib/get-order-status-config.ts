import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

// lib/order-utils.ts
export function getOrderStatusConfig(order: Order) {
    const transactions = order?.transactions ?? [];
    const hasSucceeded = transactions.some(t => t.status === 'SUCCESS');
    const hasPending = transactions.some(t => t.status === 'PENDING');

    if (hasSucceeded) return { labelKey: "status.paid", variant: "default", icon: CheckCircle2, showCTA: false };
    if (hasPending) return { labelKey: "status.paymentPending", variant: "outline", icon: Clock, showCTA: false };
    return { labelKey: "status.paymentRequired", variant: "destructive", icon: AlertCircle, showCTA: true };
}