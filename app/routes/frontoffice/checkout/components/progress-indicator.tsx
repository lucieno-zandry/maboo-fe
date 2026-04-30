// routes/checkout/components/progress-indicator.tsx
import { cn } from "~/lib/utils";
import { Check } from "lucide-react";

type Step = { label: string; value: number };

type ProgressIndicatorViewProps = {
    steps: Step[];
    current: number;
};

function ProgressIndicatorView({ steps, current }: ProgressIndicatorViewProps) {
    return (
        <nav aria-label="Checkout progress" className="mb-6">
            <ol className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const isCompleted = current > step.value;
                    const isCurrent = current === step.value;

                    return (
                        <li key={step.value} className="flex items-center w-full">
                            <div className="flex items-center gap-2">
                                <span
                                    className={cn(
                                        "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold border-2 transition-colors",
                                        isCompleted && "bg-primary text-primary-foreground border-primary",
                                        isCurrent && "border-primary text-primary",
                                        !isCompleted && !isCurrent && "border-muted-foreground/40 text-muted-foreground"
                                    )}
                                >
                                    {isCompleted ? <Check className="h-4 w-4" /> : step.value + 1}
                                </span>
                                <span
                                    className={cn(
                                        "text-sm font-medium hidden sm:inline",
                                        isCurrent && "text-foreground",
                                        !isCurrent && "text-muted-foreground"
                                    )}
                                >
                                    {step.label}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={cn(
                                        "flex-1 h-0.5 mx-4 bg-muted",
                                        isCompleted && "bg-primary"
                                    )}
                                />
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

// Smart wrapper – currently nothing to compute, so just the view.
export default function ProgressIndicator(props: ProgressIndicatorViewProps) {
    return <ProgressIndicatorView {...props} />;
}