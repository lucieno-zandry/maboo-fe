import { useNavigate } from "react-router";
import { LockKeyhole, ShieldCheck, LogOut, ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import appPathname from "~/lib/app-pathname";
import { useTranslation } from "react-i18next";

export default function () {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12">
            <div className="mx-auto flex max-w-md flex-col items-center text-center">

                {/* Security Themed Icon */}
                <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900">
                    <LockKeyhole className="h-12 w-12 text-slate-600 dark:text-slate-400" />
                    <div className="absolute -right-2 -top-2 rounded-full bg-slate-900 dark:bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-white dark:text-black shadow-lg">
                        403
                    </div>
                </div>

                <h1 className="mb-2 text-4xl font-extrabold tracking-tight sm:text-5xl italic">
                    {t("common:accessDeniedTitle")}
                </h1>
                <p className="mb-8 text-muted-foreground leading-relaxed">
                    {t("common:accessDeniedDescription")}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Button
                        variant="default"
                        onClick={() => navigate(-1)}
                        className="gap-2 px-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {t("common:goBack")}
                    </Button>

                    {/* Option to switch accounts if they are in the wrong one */}
                    <Button
                        variant="outline"
                        onClick={() => {
                            // Add your logout/switch logic here
                            navigate(appPathname(`/auth/login`));
                        }}
                        className="gap-2 px-8"
                    >
                        <LogOut className="h-4 w-4" />
                        {t("common:switchAccount")}
                    </Button>
                </div>

                {/* Informational Footer */}
                <div className="mt-12 flex flex-col items-center gap-4 border-t pt-8 w-full">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <span className="text-xs font-medium uppercase tracking-widest">
                            {t("common:secureSessionActive")}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground max-w-[280px]">
                        {t("common:permissionsDoNotAllowViewing")}
                        <span className="font-mono bg-muted px-1 mx-1 rounded text-[10px]">
                            {window.location.pathname}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}