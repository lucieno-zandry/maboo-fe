import React from 'react'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { getCartItems } from '~/api/httpRequests'

// Define the Zustand store type
export interface CartStore {
    items: CartItem[] | null,
    setItems: (items: CartStore['items']) => void
}

// Create the store
const useCartStore = create<CartStore>(set => ({
    items: null,
    setItems: (items) => {
        set({ items })
    }
}))

export const useRefreshCart = () => {
    const { setItems } = useCartStore.getState();

    return () => {
        getCartItems()
            .then((response) => {
                const cartItems = response.data?.cart_items || null;
                setItems(cartItems);
            });
    }
}

export default useCartStore;