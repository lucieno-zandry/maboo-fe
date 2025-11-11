"use client"

import CartButton from "./cart-button";
import useCartStore from "~/hooks/use-cart";
import CartDrawer from "./cart-sheet";
import React from "react";

export default function () {
    const { items, setItems } = useCartStore();
    const [open, setOpen] = React.useState(false);

    return <>
        <CartButton count={items?.length || 0} onClick={() => { setOpen(true) }} />
        {items &&
            <CartDrawer
                items={items}
                onCountChange={() => { }}
                onRemove={() => { }}
                open={open}
                setOpen={setOpen} />}
    </>
}