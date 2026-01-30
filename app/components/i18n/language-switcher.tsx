// components/language-switcher.tsx
import { useParams, useNavigate, useLocation } from "react-router";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"; // Assuming you use shadcn/ui

export function LanguageSwitcher() {
    const { lang } = useParams();
    const navigate = useNavigate();
    const { pathname, search } = useLocation();

    function switchLang(nextLang: string) {
        if (nextLang === lang) return;

        // Safely replace only the first segment (the language code)
        const segments = pathname.split("/");
        segments[1] = nextLang;
        const newPath = segments.join("/") + search;

        navigate(newPath, { replace: true });
    }

    return (
        <Select value={lang} onValueChange={switchLang}>
            <SelectTrigger className="w-[70px] border-none shadow-none focus:ring-0">
                <SelectValue placeholder="Lang" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="fr">FR</SelectItem>
                <SelectItem value="es">ES</SelectItem>
            </SelectContent>
        </Select>
    );
}