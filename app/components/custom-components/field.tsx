import React, { type ChangeEventHandler } from "react";
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
    onValidationErrorsChange?: (validationErrors: string[] | null, e: any) => void,
    validateOnBlur?: boolean,
    validateOnChange?: boolean,
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export default function ({
    validationErrors,
    label,
    dataFormat,
    children,
    onValidationErrorsChange,
    onBlur,
    onChange,
    validateOnBlur = true,
    validateOnChange = true,
    ...inputProps }: AppFieldInputProps) {
    const [stateValidationErrors, setStateValidationErrors] = React.useState<string[] | null>(null);

    React.useEffect(() => {
        setStateValidationErrors(validationErrors || null);
    }, [validationErrors]);

    const validateInput = React.useCallback(function <T extends { target: { name: string, value: string } }>(e: T) {
        if (dataFormat) {
            const newValidationErrors = getValidationError({ value: e.target.value, dataFormat });

            if (onValidationErrorsChange) {
                onValidationErrorsChange?.(newValidationErrors, e);

                // State is handled differently
                if (validationErrors !== undefined) return;
            }

            setStateValidationErrors(newValidationErrors);
        };
    }, [dataFormat, onValidationErrorsChange, validationErrors]);

    const handleBlur: React.FocusEventHandler<HTMLInputElement> = React.useCallback((e) => {
        if (validateOnBlur)
            validateInput(e);
        onBlur?.(e);
    }, [validateInput, onBlur, validateOnBlur]);

    const handleChange: ChangeEventHandler<HTMLInputElement> = React.useCallback((e) => {
        if (validateOnChange)
            validateInput(e);
        onChange?.(e);
    }, [validateInput, onChange, validateOnChange]);

    return <Field data-invalid={!!stateValidationErrors}>
        {label &&
            <FieldLabel htmlFor={inputProps.id}>{label}</FieldLabel>}
        {children}
        <Input
            aria-invalid={!!stateValidationErrors}
            onBlur={handleBlur}
            onChange={handleChange}
            {...inputProps}
        />
        {stateValidationErrors &&
            <FieldError>{stateValidationErrors.join('. ')}</FieldError>}
    </Field>
}