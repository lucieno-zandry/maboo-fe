import { useTranslation } from "react-i18next";

export default function Footer() {
    const { t } = useTranslation();
    return (
        <footer className="border-t bg-muted/50 text-muted-foreground dark:bg-muted/30 py-10 text-center">
            <p>{t("common:footerRights", { year: new Date().getFullYear(), appName: "Alofo" })}</p>
        </footer>
    );
}