import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

type BackButtonProps = {
    path?: string,
    withLabel?: boolean,
}

export default function ({ path, withLabel }: BackButtonProps) {
    const navigate = useNavigate();
    const { t } = useTranslation('common');

    const label = t('back_button_aria');

    const handleClick = useCallback(() => {
        if (path) {
            navigate(path);
        } else {
            window.history.back();
        }
    }, [path, navigate]);

    return <div className="mb-6">
        <Button
            type="button"
            variant="ghost"
            className="flex items-center gap-2"
            onClick={handleClick}
            aria-label={label}
        >
            <ArrowLeft className="w-4 h-4" />
            {withLabel &&
                label}
        </Button>
    </div>
}