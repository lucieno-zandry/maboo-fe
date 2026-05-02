import React from "react"
import { toast } from "sonner"
import { logout } from "~/api/http-requests"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog"
import { useUserStore } from "~/hooks/use-user"
import Button from "../custom-components/button"
import { useTranslation } from "react-i18next";

export type LogoutDialogProps = {
    open: boolean,
    onOpenChange: (open: boolean) => void,
}

export function LogoutDialog({ open, onOpenChange }: LogoutDialogProps) {
    const { setUser } = useUserStore();
    const { t } = useTranslation();

    const handleLogout = React.useCallback(() => {
        const loading = toast.loading(t('common:loggingOutLoading'));

        logout()
            .then(res => {
                toast.success(res.data?.message || t('common:loggedOutSuccess'));
                onOpenChange(false);
            })
            .catch(() => {
                toast.error(t('common:logoutFailedWarning'));
            })
            .finally(() => {
                setUser(null);
                localStorage.removeItem('token');
                toast.dismiss(loading);
            });
    }, [setUser, onOpenChange, t]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md" aria-describedby={t('common:confirmLogout')}>
                <DialogHeader>
                    <DialogTitle>{t('common:logoutTitle')}</DialogTitle>
                    <DialogDescription>
                        {t('common:logoutDescription')}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            {t('common:close')}
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleLogout}>{t('common:logOut')}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}