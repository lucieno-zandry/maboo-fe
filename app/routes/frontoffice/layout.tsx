import React from "react";
import { Outlet, useLoaderData, useNavigate } from "react-router";
import { HttpException } from "~/api/app-fetch";
import { getAuthUser, getCartItems } from "~/api/http-requests";
import Footer from "~/components/footer";
import Navbar from "~/components/navbar";
import { useRefreshCart } from "~/hooks/use-cart";
import { useUserStore } from "~/hooks/use-user";
import handleHttpExceptionError from "~/lib/handle-http-exception-error";

export default function () {
    const { setUser, clearUser } = useUserStore();
    const refreshCart = useRefreshCart();
    const navigate = useNavigate();

    React.useEffect(() => {
        getAuthUser()
            .then((response) => {
                if (response.data?.user) {
                    setUser(response.data.user);
                    refreshCart();
                }

            }).catch((error) => {
                clearUser();
                if (error instanceof HttpException) {
                    handleHttpExceptionError({ status: error.status, navigate });
                }
            });
    }, []);

    return <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-100">
        <Navbar />
        <Outlet />
        <Footer />
    </div>
}