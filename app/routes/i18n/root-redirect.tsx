// routes/root-redirect.tsx
import i18n from "~/i18n/i18n";
import { redirect } from "react-router";

export function loader() {
    const lang = i18n.resolvedLanguage ?? "en";
    return redirect(`/${lang}`);
}