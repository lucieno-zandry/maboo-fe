"use client"

import { Link, Outlet } from "react-router"
import { useUserStore } from "~/hooks/use-user"
import { Button } from "./ui/button";
import UserDropdown from "./user-dropdown";
import Cart from "./cart/cart";
import Notifications from "./notifications/notifications";
import { ProductSearch } from "./product-search";

export default function Navbar() {
    const { user } = useUserStore();

    return (
        <header className="flex justify-between items-center px-8 py-4 shadow-sm bg-white sticky top-0 z-25 gap-4">
            <div className="flex items-center gap-8">
                <h1>
                    <Link to="/" className="text-2xl font-bold text-gray-800">ShopEase</Link>
                </h1>

                <nav className="space-x-6 hidden lg:block">
                    <Link to="/products" className="text-sm font-medium text-gray-600 hover:text-gray-900">Products</Link>
                    <a href="#about" className="text-sm font-medium text-gray-600 hover:text-gray-900">About</a>
                </nav>
            </div>

            {/* SEARCH COMPONENT ADDED HERE */}
            <div className="flex-1 max-w-md hidden sm:block">
                <ProductSearch />
            </div>

            <div className="flex gap-2 items-center">
                {!user ? (
                    <Button variant="default" asChild>
                        <Link to="/auth">Log in</Link>
                    </Button>
                ) : (
                    <>
                        <Cart />
                        <Notifications />
                        <UserDropdown />
                    </>
                )}
            </div>
        </header>
    )
}