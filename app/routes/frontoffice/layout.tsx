import { useEffect, useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { HttpException } from "~/api/app-fetch";
import { getAuthUser } from "~/api/http-requests";
import Footer from "~/components/layout/footer";
import Navbar from "~/components/layout/navbar";
import { useRefreshCart } from "~/hooks/use-cart";
import { useUserStore } from "~/hooks/use-user";
import handleHttpExceptionError from "~/lib/handle-http-exception-error";
import { ClientCodeDialog } from "../../components/layout/client-code-dialog";
import { usePreferencesStore } from "~/hooks/use-user-preference-store";

export default function () {
    const { setUser, clearUser } = useUserStore();
    const { setPreferences, preferences } = usePreferencesStore();
    const { pathname, search } = useLocation();

    const searchParams = useMemo(() => new URLSearchParams(search), [search]);

    const refreshCart = useRefreshCart();
    const navigate = useNavigate();

    useEffect(() => {
        const urlCurrency = searchParams.get('currency');
        let shouldReload = false;

        if (!urlCurrency) {
            searchParams.append('currency', preferences.currency);
            shouldReload = true;
        } else if (urlCurrency !== preferences.currency) {
            searchParams.set('currency', preferences.currency);
            shouldReload = true;
        }

        if (shouldReload) location.href = (`${pathname}?${searchParams.toString()}`)
    }, [searchParams, pathname, preferences.currency]);

    useEffect(() => {
        getAuthUser()
            .then((response) => {
                if (response.data?.user) {
                    setUser(response.data.user);
                    refreshCart();

                    if (response.data.user.preferences) {
                        setPreferences(response.data.user.preferences);
                    }
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
        <main className="flex-1">
            <Outlet />
        </main>
        <Footer />
        <ClientCodeDialog />
    </div>
}