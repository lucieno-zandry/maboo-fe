import useRedirectAction from "~/hooks/use-redirect-action";
import redirectPathnames from "./redirect-pathnames";
import useRouterStore from "~/hooks/use-router-store";
import isCsr from "./is-csr";

let redirectLock: ReturnType<typeof setTimeout> | null = null;

const REDIRECT_THROTTLE_MS = 10_000;

const handleActionRedirection = (
    json: any
) => {
    const redirectPathname =
        redirectPathnames[json.action as keyof typeof redirectPathnames];

    if (!redirectPathname) return;

    const { redirect } = useRedirectAction.getState();

    const lang =
        useRouterStore.getState().lang ??
        (isCsr()
            ? window.location.pathname.split("/")[1]
            : "en");

    if (redirectLock) {
        return;
    }

    redirect(`/${lang}${redirectPathname}`);

    redirectLock = setTimeout(() => {
        redirectLock = null;
    }, REDIRECT_THROTTLE_MS);

};

export default handleActionRedirection;