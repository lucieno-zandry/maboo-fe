"use client"

import { Link, Outlet } from "react-router"
import { useUserStore } from "~/hooks/use-user"
import { Button } from "./ui/button";
import UserDropdown from "./user-dropdown";
import Cart from "./cart/cart";
import Notifications from "./notifications/notifications";
import { ProductSearch } from "./product-search";
import { LanguageSwitcher } from "~/components/i18n/language-switcher";

export default function Navbar() {
    const { user } = useUserStore();

    return (
        <header className="flex justify-between items-center px-8 py-4 shadow-sm bg-white sticky top-0 z-25 gap-4">
            <div className="flex items-center gap-8">
                <h1>
                    <Link to="/" className="text-2xl font-bold text-gray-800">ShopEase</Link>
                </h1>
                <nav className="space-x-6 hidden lg:block">
                    {/* Note: In your routing, links should probably include the :lang prefix */}
                    <Link to="products" className="text-sm font-medium text-gray-600 hover:text-gray-900">Products</Link>
                </nav>
            </div>

            <div className="flex-1 max-w-md hidden sm:block">
                <ProductSearch />
            </div>

            <div className="flex gap-4 items-center">
                {/* 🌍 Language Switcher placed here */}
                <LanguageSwitcher />

                <div className="h-6 w-[1px] bg-gray-200 hidden sm:block" />

                {!user ? (
                    <Button variant="default" asChild>
                        <Link to="auth">Log in</Link>
                    </Button>
                ) : (
                    <div className="flex gap-2 items-center">
                        <Cart />
                        <Notifications />
                        <UserDropdown />
                    </div>
                )}
            </div>
        </header>
    );
}