import { useLoaderData, Link, type LoaderFunctionArgs, redirect } from "react-router";

// Local Sub-components
import OrderHeader from "~/components/order-details/order-header";
import OrderItemList from "~/components/order-details/order-item-list";
import OrderSummary from "~/components/order-details/order-summary";

import { getOrder } from "~/api/http-requests";
import NotFound from "~/components/not-found";
import useCheckoutStore from "~/hooks/use-checkout-store";
import { getOrderStatusConfig } from "~/lib/get-order-status-config";
import { ShippingAddress } from "~/components/order-details/shipping-address";
import PaymentMethodSelector from "~/components/order-details/payment-method-selector";
import PaymentIncompleteAlert from "~/components/order-details/payment-incomplete-alert";
import ShipmentStatus from "~/components/order-details/shipment-status";
import useRouterStore from "~/hooks/use-router-store";

export const clientLoader = async ({ params }: LoaderFunctionArgs) => {
    if (!params.uuid) return redirect(`/${params.lang}/403`);
    const response = await getOrder(params.uuid);
    return response.data;
}

export default function OrderDetails() {
    const { order } = useLoaderData<{ order?: Order }>();
    const { method, setMethod } = useCheckoutStore();
    const { lang } = useRouterStore();

    if (!order) return <NotFound />;

    const statusConfig = getOrderStatusConfig(order);

    return (
        <div className="container max-w-6xl mx-auto p-4 md:p-10 space-y-8">
            {/* 1. Header Section */}
            <OrderHeader order={order} statusConfig={statusConfig} lang={lang} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Column (Items) */}
                {order.cart_items &&
                    <div className="lg:col-span-2 space-y-6">
                        {statusConfig.showCTA && <PaymentIncompleteAlert />}
                        <OrderItemList lang={lang} items={order.cart_items} />
                    </div>}

                {/* Sidebar Column (Details & Summary) */}
                <div className="space-y-6">
                    <ShippingAddress address={order.address_snapshot} />

                    {order.shipments && order.shipments.length > 0 && (
                        <ShipmentStatus shipments={order.shipments} />
                    )}

                    {statusConfig.showCTA && (
                        <PaymentMethodSelector
                            currentMethod={method}
                            onMethodChange={setMethod}
                        />
                    )}

                    <OrderSummary
                        order={order}
                        statusConfig={statusConfig}
                        method={method}
                    />
                </div>
            </div>
        </div>
    );
}