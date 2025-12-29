import { create } from "zustand";

type AddressStore = {
    selectedAddresses: Address[],
    setSelectedAddresses: (addresses: AddressStore['selectedAddresses']) => void,
    authAddresses: Address[] | null,
    setAuthAddresses: (addresses: Address[] | null) => void,
    selectedAddressId: number | null,
    setSelectedAddressId: (selectedAddressId: AddressStore['selectedAddressId']) => void,
}

const useAddressStore = create<AddressStore>(set => ({
    selectedAddresses: [],
    setSelectedAddresses: (addresses) => {
        set({ selectedAddresses: addresses })
    },
    authAddresses: null,
    setAuthAddresses: (addresses) => {
        set({ authAddresses: addresses })
    },
    selectedAddressId: null,
    setSelectedAddressId: (selectedAddressId) => set({ selectedAddressId }),
}))

export default useAddressStore;