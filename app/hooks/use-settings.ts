import { useCallback } from "react";
import { useRouteLoaderData } from "react-router";
import type { loader } from "~/routes/config/config-boundary";

export function useSettings() {
    const { settings } = useRouteLoaderData<typeof loader>('routes/config/config-boundary')!;

    const get = useCallback(<T = unknown>(key: string, fallback?: T) => {
        const value = settings[key as keyof typeof settings];
        return (value || fallback) as T
    }, [settings]);

    return {
        get,
    }
}