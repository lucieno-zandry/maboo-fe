import { create } from "zustand";

// ─── Landing UI Store ─────────────────────────────────────────────────────────
// Handles transient UI state for the landing page:
//  - active FAQ item (accordion)
//  - sticky CTA visibility (hero scroll trigger)
//  - selected hero variant (pack size toggle)

interface LandingUIState {
    // FAQ accordion
    openFaqId: string | null;
    setOpenFaqId: (id: string | null) => void;
    toggleFaq: (id: string) => void;

    // Sticky CTA bar (shows after scrolling past hero)
    isStickyCTAVisible: boolean;
    setStickyCTAVisible: (visible: boolean) => void;

    // Hero variant selector (e.g. "5 pods" | "10 pods" | "20 pods")
    selectedHeroVariantId: string | null;
    setSelectedHeroVariantId: (id: string) => void;
}

export const useLandingUIStore = create<LandingUIState>((set, get) => ({
    openFaqId: null,
    setOpenFaqId: (id) => set({ openFaqId: id }),
    toggleFaq: (id) =>
        set({ openFaqId: get().openFaqId === id ? null : id }),

    isStickyCTAVisible: false,
    setStickyCTAVisible: (visible) => set({ isStickyCTAVisible: visible }),

    selectedHeroVariantId: null,
    setSelectedHeroVariantId: (id) => set({ selectedHeroVariantId: id }),
}));