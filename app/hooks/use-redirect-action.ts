import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type RedirectActionStore = {
    successPathname: string | null,
    action: Function | null,
    setAction: (props: {
        action?: RedirectActionStore['action'],
        tryWhen?: RedirectActionStore['tryWhen'],
        successPathname?: RedirectActionStore['successPathname'],
    }) => void,
    tryWhen: (() => boolean) | null,
}

export default create<RedirectActionStore>()(
    persist(
        set => ({
            successPathname: null,
            action: null,
            tryWhen: null,
            setAction: ({ action = null, tryWhen = null, successPathname = null }) => {
                set({ action, tryWhen, successPathname })
            }
        }),
        {
            name: "redirect-storage",
            storage: createJSONStorage(() => localStorage)
        }
    )
)