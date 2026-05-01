// routes/checkout/components/progress-indicator.tsx
import { cn } from "~/lib/utils";
import { Check } from "lucide-react";
import useCheckoutStore from "../stores/use-checkout-store";

type Step = { label: string; value: number };

type ProgressIndicatorViewProps = {
    steps: Step[];
    current: number;
};

function ProgressIndicatorView({ steps, current }: ProgressIndicatorViewProps) {
    const { setStep } = useCheckoutStore();

    return (
        <nav aria-label="Checkout progress">
            <ol className="flex w-full items-center justify-between gap-2 overflow-x-auto pb-2 sm:gap-4 sm:pb-0 hide-scrollbar">
                {steps.map((step, index) => {
                    const isCompleted = current > step.value;
                    const isCurrent = current === step.value;
                    const isClickable = step.value < current;

                    return (
                        <li key={step.value} className={cn("flex items-center", index !== steps.length - 1 ? "flex-1" : "")}>
                            <button
                                type="button"
                                onClick={() => isClickable && setStep(step.value)}
                                disabled={!isClickable}
                                className={cn(
                                    "group relative flex shrink-0 items-center justify-center gap-3 rounded-full py-2 pl-2 pr-4 text-sm font-medium transition-all duration-300",
                                    isCurrent && "bg-primary text-primary-foreground shadow-md",
                                    isCompleted && "bg-primary/10 text-foreground hover:bg-primary/20",
                                    !isCompleted && !isCurrent && "text-muted-foreground",
                                    !isClickable && "cursor-default"
                                )}
                            >
                                <span
                                    className={cn(
                                        "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300",
                                        isCompleted && "bg-primary text-primary-foreground",
                                        isCurrent && "bg-background/20 text-primary-foreground",
                                        !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                                    )}
                                >
                                    {isCompleted ? <Check className="h-4 w-4" /> : step.value + 1}
                                </span>
                                <span className={cn(
                                    "hidden sm:block",
                                    isCurrent && "font-semibold",
                                )}>
                                    {step.label}
                                </span>
                            </button>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="ml-2 flex-1 sm:ml-4">
                                    <div
                                        className={cn(
                                            "h-1 w-full rounded-full transition-colors duration-300",
                                            isCompleted ? "bg-primary" : "bg-muted"
                                        )}
                                    />
                                </div>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

export default function ProgressIndicator(props: ProgressIndicatorViewProps) {
    return <ProgressIndicatorView {...props} />;
}