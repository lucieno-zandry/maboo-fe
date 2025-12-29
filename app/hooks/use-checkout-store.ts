import { create } from "zustand";

type CheckoutStore = {
    cartItemsIds: number[],
    setCartItemsIds: (cartItemIds: CheckoutStore['cartItemsIds']) => void;
    appliedCoupon: Coupon | null;
    setAppliedCoupon: (appliedCoupon: CheckoutStore['appliedCoupon']) => void;
}

const useCheckoutStore = create<CheckoutStore>(
    (set) => ({
        cartItemsIds: [],
        setCartItemsIds: cartItemsIds => set({ cartItemsIds }),
        appliedCoupon: null,
        setAppliedCoupon: (appliedCoupon) => set({ appliedCoupon })
    })
);

export default useCheckoutStore;