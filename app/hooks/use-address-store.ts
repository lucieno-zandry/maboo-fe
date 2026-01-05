import { create } from "zustand";

type AddressStore = {
    selectedAddresses: Address[],
    setSelectedAddresses: (addresses: AddressStore['selectedAddresses']) => void,
    authAddresses: Address[] | null,
    setAuthAddresses: (
        updater: Address[] | null | ((prev: Address[] | null) => Address[] | null)
    ) => void;
    selectedAddressId: number | null,
    setSelectedAddressId: (selectedAddressId: AddressStore['selectedAddressId']) => void,
}

const useAddressStore = create<AddressStore>((set) => ({
    selectedAddresses: [],
    setSelectedAddresses: (addresses) => set({ selectedAddresses: addresses }),

    authAddresses: null,
    setAuthAddresses: (updater) =>
        set((state) => ({
            authAddresses:
                typeof updater === "function"
                    ? updater(state.authAddresses)
                    : updater,
        })),

    selectedAddressId: null,
    setSelectedAddressId: (selectedAddressId) => set({ selectedAddressId }),
}));

export default useAddressStore;