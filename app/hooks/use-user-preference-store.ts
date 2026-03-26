// stores/userPreferencesStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchUserPreferences, updateUserPreferences } from '~/api/http-requests';
import { useUserStore } from './use-user';


// Partial type for updates (all fields optional)
export type StorePreference = Omit<UserPreference, 'user_id' | 'created_at' | 'updated_at'>;
export type UserPreferenceUpdates = Partial<StorePreference>;

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const defaultPreference: StorePreference = {
    id: 0, // User has not yet fetched it's preferences
    currency: 'USD',
    language: 'en',
    theme: 'system',
    timezone
};

interface PreferencesState {
    preferences: StorePreference;

    updatePreferences: (updates: UserPreferenceUpdates) => Promise<unknown>;
    clearPreferences: () => void;
    setLanguage: (language: string) => void;
    setPreferences: (preference: StorePreference) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
    persist(
        (set, get) => ({
            preferences: defaultPreference,
            updatePreferences: async (updates: UserPreferenceUpdates) => {
                const { user } = useUserStore.getState();

                if (!user) {
                    const current = get().preferences;
                    const preferences: StorePreference = { ...current, ...updates };

                    return set({ preferences });
                }

                try {
                    const response = await updateUserPreferences(updates);
                    set({ preferences: response.data!.preferences });
                } catch (err: any) {
                    console.error(err.response?.data?.message || 'Failed to update preferences');
                    throw err;
                }
            },

            clearPreferences: () => {
                set({ preferences: defaultPreference});
            },
            setLanguage: (language) => {
                get().updatePreferences({ language });
            },
            setPreferences: (preferences) => {
                set({ preferences });
            }
        }),
        {
            name: 'user-preferences-storage', // unique name for localStorage key
            partialize: (state) => ({ preferences: state.preferences }), // only persist preferences, not loading/error
        }
    )
);