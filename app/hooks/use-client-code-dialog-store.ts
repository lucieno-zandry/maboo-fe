import { create } from "zustand";

type ClientCodeDialogStore = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default create<ClientCodeDialogStore>((set) => ({
    isOpen: false,
    setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));