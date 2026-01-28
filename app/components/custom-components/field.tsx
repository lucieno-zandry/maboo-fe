import React from "react";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import getValidationError from "~/lib/get-validation-error";
import type { ZodType } from "zod";
import type { $ZodTypeInternals } from "zod/v4/core";

export type AppFieldInputProps = {
    validationErrors?: string[] | null,
    label?: React.ReactNode,
    dataFormat?: ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>>,
    children?: React.ReactNode,
    onValidationErrorsChange?: (validationErrors: string[] | null, e: React.FocusEvent<HTMLInputElement, Element>) => void,
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export default function ({ validationErrors, label, dataFormat, children, onValidationErrorsChange, onBlur, ...inputProps }: AppFieldInputProps) {
    const [stateValidationErrors, setStateValidationErrors] = React.useState<string[] | null>(null);

    React.useEffect(() => {
        setStateValidationErrors(validationErrors || null);
    }, [validationErrors]);

    const handleBlur: React.FocusEventHandler<HTMLInputElement> = React.useCallback((e) => {
        const { value } = e.target;

        if (dataFormat) {
            const newValidationErrors = getValidationError({ value, dataFormat });

            if (onValidationErrorsChange) {
                onValidationErrorsChange?.(newValidationErrors, e);

                // State is handled differently
                if (validationErrors !== undefined) return;
            }

            setStateValidationErrors(newValidationErrors);
        };

        onBlur?.(e);
    }, [dataFormat, onValidationErrorsChange, validationErrors, onBlur]);

    return <Field data-invalid={!!stateValidationErrors}>
        {label &&
            <FieldLabel htmlFor={inputProps.id}>{label}</FieldLabel>}
        {children}
        <Input
            aria-invalid={!!stateValidationErrors}
            onBlur={handleBlur}
            {...inputProps}
        />
        {stateValidationErrors &&
            <FieldError>{stateValidationErrors.join('. ')}</FieldError>}
    </Field>
}