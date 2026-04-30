// stores/use-checkout-store.ts
import { create } from "zustand";

type CheckoutState = {
    step: number;
    selectedAddressId: number | null;
    selectedShippingMethodId: number | null;
    shippingCost: number | null;
    paymentMethod: string | null;
    // actions
    setStep: (step: number) => void;
    setSelectedAddressId: (id: number | null) => void;
    setSelectedShippingMethodId: (id: number | null) => void;
    setShippingCost: (cost: number | null) => void;
    setPaymentMethod: (method: string | null) => void;
};

const useCheckoutStore = create<CheckoutState>((set) => ({
    step: 0,
    selectedAddressId: null,
    selectedShippingMethodId: null,
    shippingCost: null,
    paymentMethod: null,
    setStep: (step) => set({ step }),
    setSelectedAddressId: (id) => set({ selectedAddressId: id }),
    setSelectedShippingMethodId: (id) => set({ selectedShippingMethodId: id }),
    setShippingCost: (cost) => set({ shippingCost: cost }),
    setPaymentMethod: (method) => set({ paymentMethod: method }),
}));

export default useCheckoutStore;