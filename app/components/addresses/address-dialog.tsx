import { Form, useActionData, useNavigation } from "react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { FieldGroup } from "../ui/field";
import CustomField from "~/components/custom-components/field"; // Using your validation-ready field
import Button from "../custom-components/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { useState, useMemo, type FocusEvent, useEffect } from "react";
import z from "zod";
import getUpdatedFormErrors from "~/lib/get-updated-form-errors";
import { ValidationException } from "~/api/app-fetch";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

// Define the validation schema inside or outside the component
const addressSchema = {
    fullname: z.string().min(2, "Name is required"),
    line1: z.string().min(5, "Address is too short"),
    line2: z.string().optional(),
    line3: z.string().optional(),
    phone_number: z.string().regex(/^\+?[0-9]{10,15}$/, "Invalid phone number"),
};

type AddressDialogProps = {
    address?: Address;
    isLoading?: boolean;
    isEdit: boolean;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onValidationChange: (errors: string[] | null, e: FocusEvent<HTMLInputElement, Element>) => void;
    formErrors: Record<string, string[]> | null;
    canSubmit: boolean;
    t: TFunction<"translation", undefined>,
}

export function AddressDialog({
    address,
    isEdit,
    isLoading = false,
    onOpenChange,
    open,
    canSubmit,
    formErrors,
    onValidationChange,
    t
}: AddressDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]" aria-describedby="Add or edit an address">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        {isEdit ? t('addresses:edit') : t('addresses:add_new')}
                    </DialogTitle>
                </DialogHeader>

                <Form method="post" className="space-y-6 pt-2">
                    {/* Action Intent */}
                    <input type="hidden" name="_intent" value={isEdit ? "update-address" : "create-address"} />
                    <input type="hidden" name="_module" value="address" />

                    {isEdit && <input type="hidden" name="id" value={address!.id} />}

                    <FieldGroup>
                        <CustomField
                            name="fullname"
                            label={t('addresses:full_name')}
                            defaultValue={address?.fullname}
                            dataFormat={addressSchema.fullname}
                            onValidationErrorsChange={onValidationChange}
                            validationErrors={formErrors?.fullname}
                            required
                        />

                        <CustomField
                            name="line1"
                            label={t('addresses:line1')}
                            placeholder="Street address, P.O. box"
                            defaultValue={address?.line1}
                            dataFormat={addressSchema.line1}
                            onValidationErrorsChange={onValidationChange}
                            validationErrors={formErrors?.line1}
                            required
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <CustomField
                                name="line2"
                                label={t('addresses:line2_optional')}
                                placeholder="Apt, suite"
                                defaultValue={address?.line2 ?? ""}
                                dataFormat={addressSchema.line2}
                                onValidationErrorsChange={onValidationChange}
                                validationErrors={formErrors?.line2}
                            />
                            <CustomField
                                name="line3"
                                label={t('addresses:line3_optional')}
                                defaultValue={address?.line3 ?? ""}
                                dataFormat={addressSchema.line3}
                                onValidationErrorsChange={onValidationChange}
                                validationErrors={formErrors?.line3}
                            />
                        </div>

                        <CustomField
                            name="phone_number"
                            label={t('addresses:phone_number')}
                            type="tel"
                            defaultValue={address?.phone_number}
                            dataFormat={addressSchema.phone_number}
                            onValidationErrorsChange={onValidationChange}
                            validationErrors={formErrors?.phone_number}
                            required
                        />
                    </FieldGroup>

                    {/* Improved Switch UI */}
                    <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                        <div className="space-y-0.5">
                            <Label htmlFor="is_default" className="text-base font-medium">
                                {t("addresses:dialog.set_default_label")}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                {t("addresses:dialog.set_default_description")}
                            </p>
                        </div>
                        <Switch
                            id="is_default"
                            name="is_default"
                            value="1"
                            defaultChecked={address?.is_default ?? false}
                        />
                    </div>

                    <div className="flex justify-end gap-3 border-t pt-6">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => onOpenChange(false)}
                        >
                            {t("common:cancel")}
                        </Button>
                        <Button
                            type="submit"
                            isLoading={isLoading}
                            disabled={!canSubmit}
                        >
                            {isEdit ? t("addresses:dialog.save_changes") : t("addresses:dialog.create_address")}
                        </Button>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default function ({ address, ...props }: Pick<AddressDialogProps, "address" | "open" | "onOpenChange">) {
    const isEdit = useMemo(() => Boolean(address), [address]);
    const navigation = useNavigation();
    const isLoading = useMemo(() => navigation.state === "submitting" || navigation.state === "loading", [navigation.state]);

    const [formErrors, setFormErrors] = useState<Record<string, string[]> | null>(null);
    const actionData = useActionData();

    useEffect(() => {
        if (actionData && actionData instanceof ValidationException) {
            setFormErrors(actionData.errors);
        }
    }, [actionData]);

    const handleValidationChange = (errors: string[] | null, e: FocusEvent<HTMLInputElement>) => {
        const updatedErrors = getUpdatedFormErrors({
            formErrors: formErrors,
            name: e.target.name as any,
            validationErrors: errors
        });
        setFormErrors(updatedErrors);
    };

    const canSubmit = useMemo(() => !formErrors, [formErrors]);
    const { t } = useTranslation(["addresses", "common"]);

    return (
        <AddressDialog
            address={address}
            isEdit={isEdit}
            isLoading={isLoading}
            canSubmit={canSubmit}
            formErrors={formErrors}
            onValidationChange={handleValidationChange}
            t={t}
            {...props}
        />
    );
}