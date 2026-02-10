// stores/routerStore.ts
import { create } from 'zustand';

type RouterStore = {
    navigate: ((path: string) => void);
    setRouterContext: (ctx: {
        navigate: (path: string) => void;
    }) => void;
    lang: string,
    setLang: (lang: RouterStore['lang']) => void,
};

export default create<RouterStore>((set) => ({
    navigate: (path) => location.pathname = path,
    setRouterContext: (ctx) => set({ ...ctx }),
    lang: 'en',
    setLang: (lang) => set({ lang })
}));
