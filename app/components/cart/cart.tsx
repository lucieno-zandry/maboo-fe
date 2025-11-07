"use client"

import CartButton from "./cart-button";
import useCartStore from "~/hooks/use-cart";
import CartDrawer from "./cart-sheet";
import React from "react";

export default function () {
    const { items } = useCartStore();
    const [open, setOpen] = React.useState(false);

    if (!items) return;

    return <>
        <CartButton count={items.length} onClick={() => { console.log('clicked'); setOpen(true) }} />
        <CartDrawer
            items={items}
            onDecrease={() => { }}
            onIncrease={() => { }}
            onRemove={() => { }}
            open={open}
            setOpen={setOpen} />
    </>
}