// stores/routerStore.ts
import { create } from 'zustand';

type RouterStore = {
    navigate: ((path: string) => void) | null;
    setRouterContext: (ctx: {
        navigate: (path: string) => void;
    }) => void;
};

export default create<RouterStore>((set) => ({
    navigate: null,
    setRouterContext: (ctx) => set({ ...ctx }),
}));
