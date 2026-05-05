import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { logout } from "~/api/http-requests";
import { useUserStore } from "./use-user";

type LogoutHandler = ((options?: {
    onSuccess?: (() => void) | undefined;
} | undefined) => void) & {
    loading: boolean
}

export function useLogout() {
    const { t } = useTranslation();
    const { setUser } = useUserStore();

    const [loading, setLoading] = useState(false);

    const handleLogout: LogoutHandler = (options?: { onSuccess?: () => void }) => {
        const loading = toast.loading(t('common:loggingOutLoading'));
        setLoading(true);
        logout()
            .then(res => {
                toast.success(t('common:loggedOutSuccess'));
                options?.onSuccess?.();
            })
            .catch(() => {
                toast.error(t('common:logoutFailedWarning'));
            })
            .finally(() => {
                setUser(null);
                localStorage.removeItem('token');
                toast.dismiss(loading);
                setLoading(false);
            });
    }

    handleLogout.loading = loading;

    return handleLogout;
}