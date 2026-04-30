// components/ui/location-selector.tsx
import { Input } from "~/components/ui/input";

export interface LocationSelectorProps {
    country: string;
    city: string;
    onCountryChange: (val: string) => void;
    onCityChange: (val: string) => void;
    countryPlaceholder?: string;
    cityPlaceholder?: string;
}

export function LocationSelector({
    country,
    city,
    onCountryChange,
    onCityChange,
    countryPlaceholder = "Country Code (e.g., US)",
    cityPlaceholder = "City (e.g., New York)"
}: LocationSelectorProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row">
            <div className="w-full">
                <Input
                    placeholder={countryPlaceholder}
                    value={country}
                    onChange={(e) => onCountryChange(e.target.value)}
                    maxLength={2}
                    className="uppercase"
                />
            </div>
            <div className="w-full">
                <Input
                    placeholder={cityPlaceholder}
                    value={city}
                    onChange={(e) => onCityChange(e.target.value)}
                />
            </div>
        </div>
    );
}