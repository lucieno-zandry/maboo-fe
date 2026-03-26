import { useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select';

import { usePreferencesStore } from '~/hooks/use-user-preference-store';
import { useUserStore } from '~/hooks/use-user';

// List of supported currencies (ISO 4217 codes)
const CURRENCIES = [
    { code: 'USD', label: 'USD - US Dollar' },
    { code: 'EUR', label: 'EUR - Euro' },
    { code: 'GBP', label: 'GBP - British Pound' },
    { code: 'JPY', label: 'JPY - Japanese Yen' },
    { code: 'CAD', label: 'CAD - Canadian Dollar' },
    { code: 'AUD', label: 'AUD - Australian Dollar' },
    { code: 'CHF', label: 'CHF - Swiss Franc' },
    { code: 'CNY', label: 'CNY - Chinese Yuan' },
    { code: 'INR', label: 'INR - Indian Rupee' },
    { code: 'BRL', label: 'BRL - Brazilian Real' },
];

// Dumb presentational component
interface CurrencySelectProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

const CurrencySelect = ({ value, onChange, disabled }: CurrencySelectProps) => (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Currency" />
        </SelectTrigger>
        <SelectContent>
            {CURRENCIES.map((curr) => (
                <SelectItem key={curr.code} value={curr.code}>
                    {curr.label}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
);

// Smart component that chooses the right store based on auth status
export const CurrencySelector = () => {
    const { user } = useUserStore();
    const { preferences, updatePreferences, fetchPreferences } = usePreferencesStore();

    // When user logs in, fetch preferencess
    useEffect(() => {
        if (user) {
            fetchPreferences();
        }
    }, [user, fetchPreferences]);

    const handleCurrencyChange = (newCurrency: string) => {
        updatePreferences({ currency: newCurrency });
    };

    return (
        <CurrencySelect
            value={preferences?.currency || 'USD'}
            onChange={handleCurrencyChange}
            disabled={user ? !preferences : false} // Disabled while loading for authenticated user
        />
    );
};