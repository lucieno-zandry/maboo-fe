import * as React from "react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "~/components/ui/input-otp";
import { Button } from "~/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import { Form, redirect, type ActionFunctionArgs } from "react-router";
import { Mail } from "lucide-react";
import useRedirectAction from "~/hooks/use-redirect-action";

export const clientAction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const { successPathname } = useRedirectAction.getState();

    return redirect(successPathname || '/')
}

/**
 * Renders an interface for user email verification using an OTP (One-Time Password).
 * This component focuses purely on the UI/UX; the verification logic is omitted.
 */
export function EmailVerificationOtp() {
    const [otp, setOtp] = React.useState("");
    const codeLength = 6; // Standard OTP length

    const handleResend = () => {
        // Logic for requesting a new OTP goes here
        console.log("Resend code requested");
    };

    return (
        <Card>
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold flex justify-center items-center gap-2">
                    <Mail /> Verify Your Email
                </CardTitle>
                <CardDescription>
                    We've sent a {codeLength}-digit verification code to your email address.
                    Please enter it below to confirm your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form className="space-y-6" method="post">
                    <div className="flex justify-center">
                        <InputOTP
                            maxLength={codeLength}
                            value={otp}
                            onChange={(value) => setOtp(value)}
                        >
                            <InputOTPGroup>
                                {/* Map over the required length to create the slots */}
                                {Array.from({ length: codeLength }).map((_, index) => (
                                    <InputOTPSlot key={index} index={index} />
                                ))}
                            </InputOTPGroup>
                        </InputOTP>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={otp.length !== codeLength}
                    >
                        Verify Account
                    </Button>
                </Form>

                <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    Didn't receive the code?
                    <Button
                        variant="link"
                        onClick={handleResend}
                        className="p-1 h-auto"
                    >
                        Resend Code
                    </Button>
                    {/* You might add a small countdown timer here for better UX */}
                </div>
            </CardContent>
        </Card>
    );
}