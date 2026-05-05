// email-verification.tsx
import React from "react";
import { redirect, useActionData, useNavigate, type ActionFunctionArgs } from "react-router";
import { toast } from "sonner";
import { attemptEmailVerification, sendEmailVerificationCode } from "~/api/http-requests";
import { EmailVerificationOtp } from "~/routes/auth/components/email-verification-otp";
import { useSuccessRedirect } from "~/hooks/use-redirect-action";
import { useLogout } from "~/hooks/use-logout";
import appPathname from "~/lib/app-pathname";
import { useUserStore } from "~/hooks/use-user";

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

    try {
        await attemptEmailVerification(otp);
    } catch (error) {
        if (error) return error;
    }

    const successRedirect = useSuccessRedirect();
    return successRedirect();
}

export default function () {
    const error = useActionData();
    const navigate = useNavigate();
    const didSendRef = React.useRef(false);
    const logout = useLogout();
    const { user } = useUserStore();

    const userEmail = user?.email ?? "";

    const handleLogout = () => logout({ onSuccess: () => navigate(appPathname('/auth')) });

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
                if (error.status === 403) {
                    navigate('/');
                    toast.error('Your email has already been confirmed!');
                } else {
                    toast.error("An error occured, please, try again!")
                }
            })
    }

    React.useEffect(() => {
        if (didSendRef.current) return;
        didSendRef.current = true;
        handleSendEmailVerificationCode();
    }, []);

    return <EmailVerificationOtp
        email={userEmail}
        onSendEmailVerificationCode={handleSendEmailVerificationCode}
        onLogout={handleLogout}
        errorMessages={error?.errors?.code || null}
    />
}