import type { TFunction } from "i18next";
import { BellOff } from "lucide-react";
import { useTranslation } from "react-i18next";

type NotificationsEmptyProps = {
    t: TFunction
}

export function NotificationsEmpty({ t }: NotificationsEmptyProps) {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-4 py-10 text-center">
            <BellOff className="h-8 w-8 text-muted-foreground" />

            <div className="space-y-1">
                <p className="text-sm font-medium">
                    {t('common:noNotifications')}
                </p>
                <p className="text-xs text-muted-foreground">
                    {t('common:allCaughtUp')}
                </p>
            </div>
        </div>
    );
}

export default function () {
    const { t } = useTranslation();
    return <NotificationsEmpty t={t} />;
}