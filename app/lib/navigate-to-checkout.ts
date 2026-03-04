import type { NavigateFunction, RedirectFunction } from "react-router";
import useRouterStore from "~/hooks/use-router-store";

export default (cartItemIds: number[], navigate: NavigateFunction | RedirectFunction) => {
    const { lang } = useRouterStore.getState();

    return navigate(`/${lang}/checkout?cartItemIds=${Array.from(cartItemIds).join(',')}`);
}