import { redirect, type LoaderFunctionArgs } from "react-router";
import appPathname, { getPreferencesFromLoaderFunctionArgs } from "~/lib/app-pathname";
import { ALLOWED_LANGUAGES, langIsValid } from "~/lib/lang-helpers";

export function loader(args: LoaderFunctionArgs) {
    let { language } = getPreferencesFromLoaderFunctionArgs(args);

    if (!langIsValid(language)) {
        language = ALLOWED_LANGUAGES[0];
    }

    return redirect(`/${language}`);
}