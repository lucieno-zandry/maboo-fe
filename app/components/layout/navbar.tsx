import { Link, useLoaderData, useLocation } from "react-router"
import { useUserStore } from "~/hooks/use-user"
import { Button } from "../ui/button";
import UserDropdown from "./user-dropdown";
import Cart from "../cart/cart";
import { LanguageSwitcher } from "~/components/layout/language-switcher";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { CurrencySelector } from "./currency-selector";
import appPathname, { useAppPathname } from "~/lib/app-pathname";
import { ThemeSelector } from "./theme-selector";
import { useMemo } from "react";
import { NavSearch } from "./nav-search";
import { NotificationsPopover } from "../notifications/notifications-popover";
import type { loader } from "~/routes/frontoffice/layout";

type NavbarProps = {
    isUnAuthenticated: boolean,
    isAuthenticated: boolean,
    t: TFunction;
    navbarSearchVisible: boolean,
    appPathname: typeof appPathname,
    name: string,
    appLogoUrl: string,
}

export function NavbarView({ isAuthenticated, isUnAuthenticated, t, navbarSearchVisible, appPathname, name, appLogoUrl }: NavbarProps) {
    return (
        <header className="flex flex-wrap justify-between items-center px-4 sm:px-8 py-3 shadow-sm bg-background/95 backdrop-blur-md sticky top-0 z-50 gap-4 border-b border-border">
            
            {/* Left Section: Logo, Brand Name & Desktop Links */}
            <div className="flex items-center gap-6 md:gap-8">
                <h1>
                    <Link 
                        to={appPathname('/')} 
                        className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
                    >
                        {appLogoUrl && (
                            <img 
                                src={appLogoUrl} 
                                alt={`${name} logo`} 
                                className="h-8 w-auto object-contain" 
                            />
                        )}
                        <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                            {name}
                        </span>
                    </Link>
                </h1>
                
                <nav className="hidden lg:block space-x-6">
                    <Link
                        to={appPathname('/products')}
                        className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
                    >
                        {t('common:products')}
                    </Link>
                </nav>
            </div>

            {/* Middle Section: Desktop Search */}
            {navbarSearchVisible && (
                <div className="flex-1 max-w-md hidden md:block">
                    <NavSearch />
                </div>
            )}

            {/* Right Section: Settings & Auth/User Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
                {isUnAuthenticated && (
                    <>
                        {/* Desktop Selectors: Hidden on mobile (sm breakpoint and below) */}
                        <div className="hidden sm:flex items-center gap-2">
                            <LanguageSwitcher />
                            <CurrencySelector />
                            <ThemeSelector />
                        </div>
                        
                        {/* Login Button: Always visible top right */}
                        <Button variant="default" size="sm" className="shadow-sm" asChild>
                            <Link to={appPathname('/auth')}>{t('common:logIn')}</Link>
                        </Button>
                    </>
                )}

                {isAuthenticated && (
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Cart />
                        <NotificationsPopover />
                        <UserDropdown />
                    </div>
                )}
            </div>

            {/* --- Mobile Bottom Sections --- */}
            
            {/* Mobile Search */}
            {navbarSearchVisible && (
                <div className="w-full block md:hidden mt-1">
                    <NavSearch />
                </div>
            )}

            {/* Mobile Selectors (Unauthenticated) */}
            {isUnAuthenticated && (
                <div className="w-full flex sm:hidden justify-center items-center gap-6 mt-1 pt-3 border-t border-border/50">
                    <LanguageSwitcher />
                    <CurrencySelector />
                    <ThemeSelector />
                </div>
            )}
            
        </header>
    )
}

export default function Navbar() {
    const { settings } = useLoaderData<typeof loader>();

    const { authStatus } = useUserStore();
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const appPathname = useAppPathname();

    const name: string = settings.app_name || 'Alofo';
    const appLogoUrl: string = settings.app_logo || '';

    const isUnAuthenticated = useMemo(() => authStatus === "unauthenticated", [authStatus])
    const isAuthenticated = useMemo(() => authStatus === "authenticated", [authStatus])
    const navbarSearchVisible = useMemo(() => (!pathname.includes('/search')) && (isAuthenticated || isUnAuthenticated), [pathname, isAuthenticated, isUnAuthenticated]);

    return <NavbarView
        t={t}
        isAuthenticated={isAuthenticated}
        isUnAuthenticated={isUnAuthenticated}
        navbarSearchVisible={navbarSearchVisible}
        appPathname={appPathname}
        name={name}
        appLogoUrl={appLogoUrl}
    />
}