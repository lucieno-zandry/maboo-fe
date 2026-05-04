import { useTranslation } from "react-i18next";
import { SearchPage } from "./components/search-page";

export default function SearchRoute() {
    return <SearchPage />;
}

export function meta() {
    const { t } = useTranslation("search");
    return [
        { title: t("search.meta.title") },
        { name: "description", content: t("search.meta.description") },
    ];
}