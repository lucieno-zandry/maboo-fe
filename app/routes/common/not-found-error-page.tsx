import { useNavigate } from "react-router";
import { MoveLeft, Home, FileQuestion } from "lucide-react";
import { Button } from "~/components/ui/button";
import appPathname from "~/lib/app-pathname";
import { useTranslation } from "react-i18next";

export default function () {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        {/* Animated Icon Container */}
        <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-muted/50">
          <FileQuestion className="h-12 w-12 text-muted-foreground animate-pulse" />
          <div className="absolute -right-2 -top-2 rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold text-destructive-foreground shadow-lg">
            404
          </div>
        </div>

        <h1 className="mb-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
          {t("common:pageNotFoundTitle")}
        </h1>
        <p className="mb-10 text-muted-foreground">
          {t("common:pageNotFoundDescription")}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <MoveLeft className="h-4 w-4" />
            {t("common:goBack")}
          </Button>

          <Button
            onClick={() => navigate(appPathname("/"))}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            {t("common:backToHome")}
          </Button>
        </div>

        {/* Optional: Helpful links for a dashboard app */}
        <div className="mt-12 border-t pt-8 w-full">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            {t("common:needHelp")}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate(appPathname("/support"))}
              className="text-sm text-left hover:text-primary transition-colors font-medium"
            >
              {t("common:contactSupport")}
            </button>
            <button
              onClick={() => navigate(appPathname("/orders"))}
              className="text-sm text-left hover:text-primary transition-colors font-medium"
            >
              {t("common:viewRecentOrders")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}