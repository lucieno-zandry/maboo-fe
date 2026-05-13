import { useTranslation } from "react-i18next";
import { useSettings } from "~/hooks/use-settings";

export default function Footer() {
    const { t } = useTranslation();
    const { get } = useSettings();
    const appName = get('app_name');


    return (
        <footer className="border-t bg-muted/50 text-muted-foreground dark:bg-muted/30 py-10 text-center">
            <p>{t("common:footerRights", { year: new Date().getFullYear(), appName })}</p>
        </footer>
    );
}