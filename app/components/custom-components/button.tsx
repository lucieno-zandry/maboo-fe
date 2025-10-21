import { Button, buttonVariants } from "../ui/button"
import React from "react";
import { LoaderCircle } from "lucide-react";
import type { VariantProps } from "class-variance-authority";

export type ButtonProps = {
    isLoading?: boolean
} & React.ComponentProps<"button">

export default function ({
    isLoading = false,
    children,
    ...buttonProps
}: ButtonProps & VariantProps<typeof buttonVariants>) {
    const disabled = React.useMemo(() => !!(isLoading || buttonProps.disabled || buttonProps["aria-busy"]), [buttonProps.disabled, isLoading, buttonProps["aria-busy"]]);

    return <Button {...buttonProps} disabled={disabled}>
        {isLoading ? <LoaderCircle className="animate-spin text-muted-foreground" /> : children}
    </Button>
}