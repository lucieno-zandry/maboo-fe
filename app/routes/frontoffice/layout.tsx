import React from "react";
import { Outlet, useLoaderData } from "react-router";
import { getAuthUser, getCartItems } from "~/api/httpRequests";
import Footer from "~/components/footer";
import Navbar from "~/components/navbar";
import useCartStore, { useRefreshCart } from "~/hooks/use-cart";
import { useUserStore } from "~/hooks/use-user";

export const clientLoader = async () => {
    const auth = await getAuthUser();

    return {
        user: auth.data?.user || null,
    };
}

export default function () {
    const { setUser } = useUserStore();
    const refreshCart = useRefreshCart();

    const loaderData = useLoaderData<{ user: User | null }>();
    const loaderUser = loaderData?.user;

    React.useEffect(() => {
        setUser(loaderUser);
        if(loaderUser){
            refreshCart();
        }
    }, [loaderUser, setUser]);

    return <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-100">
        <Navbar />
        <Outlet />
        <Footer />
    </div>
}