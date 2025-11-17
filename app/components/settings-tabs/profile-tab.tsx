import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { TabsContent } from "../ui/tabs";
import React from "react";
import { useUserStore } from "~/hooks/use-user";
import ConfirmEmailChangeDialog from "../confirm-email-change-dialog";
import { updateAuthUser } from "~/api/http-requests";
import { toast } from "sonner";
import Field from "../custom-components/field";
import Button from "../custom-components/button";
import z from "zod";
import getUpdatedFormErrors from "~/lib/get-updated-form-errors";
import useRedirectAction from "~/hooks/use-redirect-action";

const dataFormat = {
    email: z.email(),
    name: z.string().min(4)
}

type ValidationMessages = {
    name?: string[],
    email?: string[],
    current_password?: string[],
}

export default function () {
    const user = useUserStore((state) => state.user!);
    const { setUser } = useUserStore();
    const { redirect } = useRedirectAction();

    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
    })

    const [showPasswordDialog, setShowPasswordDialog] = React.useState(false);
    const [pendingEmail, setPendingEmail] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [validationMessages, setValidationMessages] = React.useState<ValidationMessages | null>(null);
    
    const userCanSubmit = React.useMemo(() => (formData.name !== user.name || formData.email !== user.email) && !validationMessages, [formData, user, validationMessages]);

    React.useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
            })
        }
    }, [user])

    const handleError = (error: any) => {
        if (error.errors) {
            setValidationMessages(error.errors);
        }
    }

    const handleProfileUpdate: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();


        // Check if email has changed
        if (formData.email !== user.email) {
            setPendingEmail(formData.email);
            setShowPasswordDialog(true);
            return;
        }

        setIsLoading(true);

        updateAuthUser({ name: formData.name, })
            .then(response => {
                if (response.data?.user) {
                    setUser(response.data.user);
                    toast.success("Profile updated successfully!");
                }
            }).catch(handleError)
            .finally(() => setIsLoading(false));
    };

    const cancelEmailChange = () => {
        setFormData({ ...formData, email: user.email });
        setShowPasswordDialog(false);
        setPendingEmail("");
    };

    const confirmEmailChange = React.useCallback((current_password: string) => {
        setIsLoading(true);

        updateAuthUser({ name: formData.name, email: pendingEmail, current_password })
            .then(response => {
                if (response.data?.user) {
                    setUser(response.data.user);
                    toast.success("Profile updated successfully!");
                    return redirect('/auth/verify-email');
                }
            })
            .catch(error => {
                handleError(error);
                if ((error.errors.email || error.errors.name)) {
                    setShowPasswordDialog(false);
                    toast.error("Check the field errors and try again.");
                }
            })
            .finally(() => setIsLoading(false));
    }, [formData.name, pendingEmail]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleValidationErrorsChange = (validationErrors: string[] | null, e: React.FocusEvent<HTMLInputElement, Element>) => {
        // delete current_password if set
        if (validationMessages?.current_password && e.target.name !== "current_password") {
            delete validationMessages.current_password;
        }

        let updatedValidationMessages = getUpdatedFormErrors({
            formErrors: validationMessages,
            name: e.target.name as keyof ValidationMessages,
            validationErrors
        })

        setValidationMessages(updatedValidationMessages);
    }

    return <>
        <TabsContent value="profile" className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-4 flex flex-col gap-3 items-end">
                        <Field
                            label="Full Name"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            validationErrors={validationMessages?.name}
                            dataFormat={dataFormat.name}
                            onValidationErrorsChange={handleValidationErrorsChange}
                        />

                        <Field
                            label="Email Address"
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            validationErrors={validationMessages?.email}
                            dataFormat={dataFormat.email}
                            onValidationErrorsChange={handleValidationErrorsChange}
                        />
                        <Button
                            type="submit"
                            disabled={!userCanSubmit}
                            isLoading={!showPasswordDialog && isLoading}>Save Changes</Button>
                    </form>
                </CardContent>
            </Card>
        </TabsContent>

        <ConfirmEmailChangeDialog
            cancelEmailChange={cancelEmailChange}
            confirmEmailChange={confirmEmailChange}
            pendingEmail={pendingEmail}
            setShowPasswordDialog={setShowPasswordDialog}
            showPasswordDialog={showPasswordDialog}
            currentPasswordValidationErrors={validationMessages?.current_password}
            isLoading={showPasswordDialog && isLoading}
        />
    </>
}