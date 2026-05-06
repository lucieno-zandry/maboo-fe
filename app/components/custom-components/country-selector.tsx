import getValidationError from "~/lib/get-validation-error";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect, useRef, useState } from "react";
import type { z } from "zod";

// ISO 3166-1 alpha-2 country codes (complete list)
const COUNTRY_CODES = [
    "AF", "AX", "AL", "DZ", "AS", "AD", "AO", "AI", "AQ", "AG", "AR", "AM", "AW", "AU", "AT", "AZ",
    "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BQ", "BA", "BW", "BV", "BR",
    "IO", "BN", "BG", "BF", "BI", "KH", "CM", "CA", "CV", "KY", "CF", "TD", "CL", "CN", "CX", "CC",
    "CO", "KM", "CG", "CD", "CK", "CR", "CI", "HR", "CU", "CW", "CY", "CZ", "DK", "DJ", "DM", "DO",
    "EC", "EG", "SV", "GQ", "ER", "EE", "ET", "FK", "FO", "FJ", "FI", "FR", "GF", "PF", "TF", "GA",
    "GM", "GE", "DE", "GH", "GI", "GR", "GL", "GD", "GP", "GU", "GT", "GG", "GN", "GW", "GY", "HT",
    "HM", "VA", "HN", "HK", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IM", "IL", "IT", "JM", "JP",
    "JE", "JO", "KZ", "KE", "KI", "KP", "KR", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI",
    "LT", "LU", "MO", "MK", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MQ", "MR", "MU", "YT", "MX",
    "FM", "MD", "MC", "MN", "ME", "MS", "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "NC", "NZ", "NI",
    "NE", "NG", "NU", "NF", "MP", "NO", "OM", "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PN",
    "PL", "PT", "PR", "QA", "RE", "RO", "RU", "RW", "BL", "SH", "KN", "LC", "MF", "PM", "VC", "WS",
    "SM", "ST", "SA", "SN", "RS", "SC", "SL", "SG", "SX", "SK", "SI", "SB", "SO", "ZA", "GS", "SS",
    "ES", "LK", "SD", "SR", "SJ", "SZ", "SE", "CH", "SY", "TW", "TJ", "TZ", "TH", "TL", "TG", "TK",
    "TO", "TT", "TN", "TR", "TM", "TC", "TV", "UG", "UA", "AE", "GB", "US", "UM", "UY", "UZ", "VU",
    "VE", "VN", "VG", "VI", "WF", "EH", "YE", "ZM", "ZW"
] as const;

type CountryCode = typeof COUNTRY_CODES[number];

interface CountrySelectorProps {
    name: string;
    label: string;
    defaultValue?: string;
    required?: boolean;
    onValidationErrorsChange: (errors: string[] | null, fieldName: string) => void;
    validationErrors?: string[];
    dataFormat?: z.ZodTypeAny;
    t?: (key: string) => string; // optional, for placeholder translation
}

export function CountrySelector({
    name,
    label,
    defaultValue = "",
    required = false,
    onValidationErrorsChange,
    validationErrors,
    dataFormat,
    t,
}: CountrySelectorProps) {
    const [selectedCode, setSelectedCode] = useState<string>(defaultValue);
    const [localErrors, setLocalErrors] = useState<string[] | null>(null);
    const onValidationErrorsChangeRef = useRef(onValidationErrorsChange);

    // Get localized country names using Intl.DisplayNames
    const getCountryName = (code: string): string => {
        try {
            const displayNames = new Intl.DisplayNames([document.documentElement.lang || "en"], { type: "region" });
            return displayNames.of(code) || code;
        } catch {
            return code;
        }
    };

    // Build sorted list of countries by localized name
    const countries = COUNTRY_CODES.map(code => ({
        code,
        name: getCountryName(code),
    })).sort((a, b) => a.name.localeCompare(b.name));

    useEffect(() => {
        onValidationErrorsChangeRef.current = onValidationErrorsChange;
    }, [onValidationErrorsChange]);

    useEffect(() => {
        if (!dataFormat) {
            setLocalErrors(null);
            onValidationErrorsChangeRef.current(null, name);
            return;
        }
        const errors = getValidationError({ value: selectedCode, dataFormat });
        setLocalErrors(errors);
        onValidationErrorsChangeRef.current(errors, name);
    }, [selectedCode, dataFormat, name]); // ✅ No callback dependency

    const handleValueChange = (value: string) => {
        setSelectedCode(value);
    };

    const displayErrors = validationErrors ?? localErrors;

    return (
        <Field data-invalid={!!displayErrors} className="w-full">
            <FieldLabel>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
            </FieldLabel>
            <Select name={name} value={selectedCode} onValueChange={handleValueChange}>
                <SelectTrigger>
                    <SelectValue placeholder={t?.("addresses:country_placeholder") ?? "Select a country"} />
                </SelectTrigger>
                <SelectContent>
                    {countries.map(({ code, name }) => (
                        <SelectItem key={code} value={code}>
                            {name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {displayErrors && <FieldError>{displayErrors[0]}</FieldError>}
        </Field>
    );
}