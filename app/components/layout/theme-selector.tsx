import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select';
import { usePreferencesStore } from '~/stores/use-user-preference-store';
import { useUserStore } from '~/hooks/use-user';
import { Sun, Moon, Laptop, Palette } from 'lucide-react';
import { useUpdatePreferences } from '~/hooks/use-update-preferences';
import { useTranslation } from 'react-i18next';

interface ThemeSelectProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

const DropdownThemeSelect = ({ value, onChange, disabled }: ThemeSelectProps) => {
    const { t } = useTranslation();
    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <span>{t('common:theme')}</span>
            </div>
            <Select value={value} onValueChange={onChange} disabled={disabled}>
                <SelectTrigger className="w-[90px] h-8">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="light">{t('common:light')}</SelectItem>
                    <SelectItem value="dark">{t('common:dark')}</SelectItem>
                    <SelectItem value="system">{t('common:system')}</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

const ThemeSelect = ({ value, onChange, disabled }: ThemeSelectProps) => {
    const { t } = useTranslation();
    const TriggerIcon = value === 'dark' ? Moon : value === 'light' ? Sun : Laptop;
    return (
        <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger className="w-[80px] sm:w-[110px] h-9 flex items-center gap-2 bg-transparent">
                <TriggerIcon className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
                <SelectValue placeholder={t('common:theme')} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="light">{t('common:light')}</SelectItem>
                <SelectItem value="dark">{t('common:dark')}</SelectItem>
                <SelectItem value="system">{t('common:system')}</SelectItem>
            </SelectContent>
        </Select>
    );
};

export const ThemeSelector = ({ type = 'navbar' }: { type?: 'navbar' | 'dropdown' }) => {
    const { authStatus } = useUserStore();
    const { preferences } = usePreferencesStore();

    const updatePreferences = useUpdatePreferences();

    const handleThemeChange = (newTheme: string) => {
        updatePreferences({ theme: newTheme as 'light' | 'dark' | 'system' });
    };

    const Component = type === 'dropdown' ? DropdownThemeSelect : ThemeSelect;

    return (
        <Component
            value={preferences?.theme || 'system'}
            onChange={handleThemeChange}
            disabled={authStatus === 'unknown'}
        />
    );
};