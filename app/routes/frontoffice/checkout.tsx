import { useState, useMemo, useEffect } from "react";
import { Card } from "~/components/ui/card";
import { AddressForm } from "~/components/address/address-form";
import { PaymentMethod } from "~/components/checkout/payment-method";
import { OrderReview } from "~/components/checkout/order-review";
import Button from "~/components/custom-components/button";
import StepWrapper from "~/components/custom-components/step-wrapper";
import { redirect, useLoaderData, useNavigate, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import formatMoney from "~/lib/format-money";
import { createAddress, createOrder, getCartItems } from "~/api/http-requests";
import useAddressStore from "~/hooks/use-address-store";
import { toast } from "sonner";
import { useUserStore } from "~/hooks/use-user";
import useCheckoutStore from "~/hooks/use-checkout-store";
import OrderSummary from "~/components/checkout/order-summary";
import useCartStore from "~/hooks/use-cart";

type Step = "address" | "payment" | "review";

export const clientLoader = async ({ }: LoaderFunctionArgs) => {
    const { cartItemsIds } = useCheckoutStore.getState();
    if (cartItemsIds.length === 0) return redirect('/');
    const cartItems = await getCartItems({ whereIn: { id: cartItemsIds } });
    return cartItems.data?.cart_items;
}

export const clientAction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const intent = formData.get('_intent');
    const module = formData.get('_module');

    try {
        if (module === 'address') {
            const isDefault = formData.get('is_default');
            const { setAuthAddresses, authAddresses } = useAddressStore.getState();
            const { setUser } = useUserStore();

            if (!isDefault)
                formData.set('is_default', '0');

            if (intent === 'create-address') {
                const response = await createAddress(formData);

                if (authAddresses && response.data) {
                    setAuthAddresses([...authAddresses, response.data.address]);
                    setUser(response.data.user);
                }

                toast.success("Address saved successfully!")
            }
        }
    } catch (e) {
        return e;
    }
}

export default function CheckoutPage() {
    const [activeStep, setActiveStep] = useState<Step>("address");
    const [completed, setCompleted] = useState<Record<Step, boolean>>({
        address: false,
        payment: false,
        review: false,
    });
    const [loading, setLoading] = useState(false);

    const cartItems = useLoaderData<CartItem[]>();
    const { selectedAddressId } = useAddressStore();
    const { cartItemsIds, appliedCoupon, setAppliedCoupon, setCartItemsIds } = useCheckoutStore();
    const { setItems } = useCartStore();

    const navigate = useNavigate();

    const subtotal = useMemo(() => {
        if (!cartItems || cartItems.length === 0) return 0;
        return cartItems.reduce((sum, it) => sum + (it.total || 0), 0);
    }, [cartItems]);

    const itemsCount = useMemo(() => {
        if (!cartItems || cartItems.length === 0) return 0;
        return cartItems.reduce((sum, it) => sum + (it.count || 0), 0);
    }, [cartItems]);

    const cleanupFunction = () => {
        setAppliedCoupon(null);
        setCartItemsIds([]);
    }

    const handleStepComplete = (current: Step, next: Step) => {
        setCompleted(prev => ({ ...prev, [current]: true }));
        setActiveStep(next);
    };

    const handlePlaceOrder = () => {
        if (!selectedAddressId || cartItemsIds.length === 0) return;
        setLoading(true);
        createOrder({ address_id: selectedAddressId, cart_item_ids: cartItemsIds, coupon_id: appliedCoupon?.id })
            .then(() => {
                cleanupFunction();
                setItems(null);
                navigate('/orders');
            })
            .catch((error) => {
                toast.error(`Failed to create order with status: ${error.message} `)
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => cleanupFunction, [])

    return (
        <div className="container max-w-4xl mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Checkout Flow */}
                <div className="lg:col-span-2 space-y-4">

                    {/* STEP 1: ADDRESS */}
                    <StepWrapper
                        number={1}
                        title="Shipping Address"
                        isActive={activeStep === "address"}
                        isCompleted={completed.address}
                        onEdit={() => setActiveStep("address")}
                    >
                        <AddressForm onNext={() => handleStepComplete("address", "payment")} />
                    </StepWrapper>

                    {/* STEP 2: PAYMENT */}
                    <StepWrapper
                        number={2}
                        title="Payment Method"
                        isActive={activeStep === "payment"}
                        isCompleted={completed.payment}
                        onEdit={() => setActiveStep("payment")}
                    >
                        <PaymentMethod onNext={() => handleStepComplete("payment", "review")} />
                    </StepWrapper>

                    {/* STEP 3: REVIEW */}
                    <StepWrapper
                        number={3}
                        title="Review & Place Order"
                        isActive={activeStep === "review"}
                        isCompleted={completed.review}
                    >
                        {cartItems && (
                            <OrderReview cartItems={cartItems}>
                                <Button className="w-full h-12 text-lg" type="button" isLoading={loading} onClick={handlePlaceOrder}>Place Order</Button>
                            </OrderReview>
                        )}
                    </StepWrapper>
                </div>

                {/* Sticky Order Summary Sidebar */}
                <div className="lg:col-span-1">
                    <OrderSummary cartItems={cartItems} itemsCount={itemsCount} subtotal={subtotal} />
                </div>
            </div>
        </div>
    );
}