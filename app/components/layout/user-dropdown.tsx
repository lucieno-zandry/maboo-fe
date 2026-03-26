import { Button } from "~/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { useUserStore } from "~/hooks/use-user"
import UserAvatar from "./user-avatar";
import { LogoutDialog } from "./logout-dialog";
import React from "react";
import { Link } from "react-router";
import useClientCodeDialogStore from "~/hooks/use-client-code-dialog-store";
import { MapPin, Package, Settings, TicketPercent } from "lucide-react";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import appPathname from "~/lib/app-pathname";

type UserDropdownProps = {
    user: User,
    setIsOpen: (open: boolean) => void,
    setLogoutOpen: (open: boolean) => void,
    logoutOpen: boolean,
    t: TFunction,
}

export function UserDropdown({ user, setIsOpen, setLogoutOpen, logoutOpen, t }: UserDropdownProps) {
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        <UserAvatar
                            avatarFallBack={user.name.substring(0, 2)}
                            avatarImageUrl={user.avatar_image?.url || undefined} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuLabel>{t('common:myAccount')}</DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link to={appPathname('/addresses')} className="flex items-center">
                                <MapPin className="mr-2 h-4 w-4" />
                                <span>{t('common:addresses')}</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to={appPathname("/settings")} className="flex items-center">
                                <Settings className="mr-2 h-4 w-4" />
                                <span>{t('common:settings')}</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to={appPathname("/orders")} className="flex items-center">
                                <Package className="mr-2 h-4 w-4" />
                                <span>{t('common:orders')}</span>
                            </Link>
                        </DropdownMenuItem>

                        {/* Clean "Unlock" Item */}
                        {user && !user.permissions?.can_use_effective_prices && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => setIsOpen(true)}
                                    className="text-primary focus:text-primary focus:bg-primary/5 cursor-pointer font-medium"
                                >
                                    <TicketPercent className="mr-2 h-4 w-4" />
                                    <span>{t('common:unlockPartnerPrices')}</span>
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>{t('common:support')}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onSelect={() => setLogoutOpen(true)}>
                        {t('common:logOut')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
        </>
    )
}

export default function () {
    const { user } = useUserStore();
    const { setIsOpen } = useClientCodeDialogStore();
    const { t } = useTranslation();

    const [logoutOpen, setLogoutOpen] = React.useState(false);

    if (!user) return;

    return <UserDropdown
        user={user}
        setIsOpen={setIsOpen}
        setLogoutOpen={setLogoutOpen}
        logoutOpen={logoutOpen}
        t={t} />
}