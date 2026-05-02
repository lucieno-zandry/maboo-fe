import { redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { Clock, LogOut, ShieldAlert, Calendar } from "lucide-react";
import { Button } from "~/components/ui/button";
import { getCurrentUserStatus, isUserSuspended } from "~/lib/user-status";
import { useSuccessRedirect } from "~/hooks/use-redirect-action";
import { getAuthUser } from "~/api/http-requests";
import { HttpException } from "~/api/app-fetch";
import appNavigate from "~/lib/app-navigate";
import { useTranslation } from "react-i18next";

const successRedirect = useSuccessRedirect();

export async function clientLoader({ params }: LoaderFunctionArgs) {
    const { lang } = params;

    try {
        const authResponse = await getAuthUser();
        const user = authResponse.data?.user;

        if (user && !isUserSuspended(user))
            return successRedirect();

        return user;

    } catch (error) {
        if (error instanceof HttpException) {
            return redirect(`/${lang}/auth`);
        }
    }

    return null;
}


export default function SuspendedPage() {
    const user = useLoaderData<typeof clientLoader>();
    const { t } = useTranslation();
    const status = user ? getCurrentUserStatus(user) : null;
    const expiresAt = status?.expires_at ? new Date(status.expires_at) : null;

    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12">
            <div className="mx-auto flex max-w-md flex-col items-center text-center">
                <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/5 border border-white/10 shadow-2xl">
                    <Clock className="h-12 w-12 text-amber-500" />
                    <div className="absolute -right-2 -top-2 rounded-full bg-amber-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg uppercase tracking-tighter">
                        {t("common:suspendedBadge")}
                    </div>
                </div>

                <h1 className="mb-2 text-4xl font-extrabold tracking-tight sm:text-5xl italic text-foreground">
                    {t("common:accountSuspendedTitle")}
                </h1>

                <p className="mb-4 text-muted-foreground leading-relaxed">
                    {t("common:accountSuspendedDescription")}
                </p>

                {status?.reason && (
                    <div className="mb-4 rounded-lg border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-400">
                        <p className="font-semibold">{t("common:reasonLabel")}</p>
                        <p>{status.reason}</p>
                    </div>
                )}

                {expiresAt && expiresAt > new Date() && (
                    <div className="mb-6 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm text-amber-400">
                        <Calendar className="h-4 w-4" />
                        <span>{t("common:suspendedUntil", { date: expiresAt.toLocaleDateString() })}</span>
                    </div>
                )}

                <p className="mb-8 text-muted-foreground">
                    {t("common:contactSupportForQuestions")}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        onClick={() => appNavigate("/auth/login")}
                        className="gap-2 px-8 rounded-xl border-white/10 hover:bg-white/5"
                    >
                        <LogOut className="h-4 w-4" />
                        {t("common:signOut")}
                    </Button>
                </div>

                <div className="mt-12 flex flex-col items-center gap-4 border-t border-border pt-8 w-full">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <ShieldAlert className="h-4 w-4 text-amber-500/50" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                            {t("common:temporaryRestriction")}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground/60 max-w-[300px]">
                        {t("common:needAssistanceContactSupportAt")}
                        <span className="text-foreground ml-1 font-medium underline underline-offset-4 decoration-amber-500/30">
                            {import.meta.env.VITE_SUPPORT_EMAIL}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}