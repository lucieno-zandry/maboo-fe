import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import useRouterStore from "./use-router-store";

type RedirectActionStore = {
    successPathname: string | null,
    action: Function | null,
    setAction: (props: {
        action?: RedirectActionStore['action'],
        tryWhen?: RedirectActionStore['tryWhen'],
        successPathname?: RedirectActionStore['successPathname'],
    }) => void,
    tryWhen: (() => boolean) | null,
    clearSuccessPathname: () => void,
    redirect: (path: string, successPathname?: string) => void;
}

export default create<RedirectActionStore>()(
    persist(
        set => ({
            successPathname: null,
            action: null,
            tryWhen: null,
            setAction: ({ action = null, tryWhen = null, successPathname = null }) => {
                set({ action, tryWhen, successPathname })
            },
            clearSuccessPathname: () => {
                set({ successPathname: null });
            },
            redirect: (path, successPathname: string = location.pathname) => {
                const { navigate } = useRouterStore.getState();
                set({ successPathname });
                navigate(path);
            }
        }),
        {
            name: "redirect-storage",
            storage: createJSONStorage(() => localStorage)
        }
    )
)