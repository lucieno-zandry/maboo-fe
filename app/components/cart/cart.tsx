"use client"

import CartButton from "./cart-button";
import useCartStore from "~/hooks/use-cart";
import CartSheet from "./cart-sheet";
import React from "react";

export default React.memo(function () {
    const { items } = useCartStore();
    const [open, setOpen] = React.useState(false);

    return <>
        <CartButton count={items?.length || 0} onClick={() => { setOpen(true) }} />
        <CartSheet
            items={items || []}
            open={open}
            setOpen={setOpen} />
    </>
});