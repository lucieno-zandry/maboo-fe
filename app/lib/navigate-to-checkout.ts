import type { NavigateFunction, RedirectFunction } from "react-router";

export default (cartItemIds: number[], navigate: NavigateFunction | RedirectFunction) => {
    return navigate(`checkout?cartItemIds=${Array.from(cartItemIds).join(',')}`);
}