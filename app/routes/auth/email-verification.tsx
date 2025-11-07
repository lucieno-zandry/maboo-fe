import React from "react";
import { redirect, useActionData, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";
import { attemptEmailVerification, sendEmailVerificationCode } from "~/api/httpRequests";
import { EmailVerificationOtp } from "~/components/email-verification-otp";
import useRedirectAction from "~/hooks/use-redirect-action";

export const clientAction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const otp = formData.get('otp');

    if (!otp) {
        return {
            errors: {
                code: ["The code is required"]
            }
        }
    }

    const response = await attemptEmailVerification(otp);
    if (response.error) return response.error;

    const { successPathname } = useRedirectAction.getState();

    return redirect(successPathname || '/')
}

export default function () {
    const error = useActionData();

    const handleSendEmailVerificationCode = () => {
        sendEmailVerificationCode()
            .then((response) => {
                if (response.data?.link_sent) {
                    toast.success("Email verification code sent!");
                } else {
                    toast.error("Failed to send verification code!");
                }
            })
            .catch((error) => {
                toast.error("An error occured, please, try again!")
            })
    }

    React.useEffect(handleSendEmailVerificationCode, []);

    return <EmailVerificationOtp
        onSendEmailVerificationCode={handleSendEmailVerificationCode}
        errorMessages={error?.errors?.code || null} />
}