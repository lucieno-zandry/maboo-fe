import z, { email } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import Field from "./custom-components/field";
import Button from "./custom-components/button";

type ConfirmEmailChangeDialogProps = {
    showPasswordDialog: boolean;
    setShowPasswordDialog: (show: boolean) => void;
    confirmEmailChange: (email: string) => void;
    pendingEmail: string;
    cancelEmailChange: () => void;
    currentPasswordValidationErrors?: string[] | null;
    isLoading: boolean;
}

const passwordFormat = z.string().min(4);

export default function ({
    setShowPasswordDialog,
    showPasswordDialog,
    confirmEmailChange,
    pendingEmail,
    cancelEmailChange,
    currentPasswordValidationErrors,
    isLoading,
}: ConfirmEmailChangeDialogProps) {
    return <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
            <form
                method="post"
                className="flex flex-col gap-3"
                onSubmit={(e) => {
                    e.preventDefault();
                    confirmEmailChange(e.currentTarget.querySelector<HTMLInputElement>('#current_password')!.value);
                }}>
                <DialogHeader>
                    <DialogTitle>Confirm Email Change</DialogTitle>
                    <DialogDescription>
                        You're about to change your email to <span className="font-semibold">{pendingEmail}</span>.
                        Please enter your current password to confirm this change.
                    </DialogDescription>
                </DialogHeader>
                <Field
                    label="Current Password"
                    id="current_password"
                    type="password"
                    placeholder="Enter your current password"
                    dataFormat={passwordFormat}
                    validationErrors={currentPasswordValidationErrors}
                />
                <DialogFooter>
                    <Button variant="outline" onClick={cancelEmailChange} type="button">
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        Confirm Change
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
}