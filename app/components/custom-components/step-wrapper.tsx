import { cn } from "~/lib/utils";
import { Card } from "../ui/card";
import Button from "./button";
import { Check, Edit2 } from "lucide-react";

// Helper Component for Step Logic
export default function StepWrapper({
    number, title, children, isActive, isCompleted, onEdit
}: {
    number: number; title: string; children: React.ReactNode;
    isActive: boolean; isCompleted: boolean; onEdit?: () => void;
}) {
    return (
        <Card className={cn(
            "overflow-hidden transition-all duration-300",
            isActive ? "ring-2 ring-primary border-transparent" : "opacity-70"
        )}>
            <div className={cn(
                "p-4 flex items-center justify-between",
                isActive ? "bg-primary/5" : "bg-muted/20"
            )}>
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                        isCompleted ? "bg-green-500 text-white" : "bg-primary text-primary-foreground",
                        !isActive && !isCompleted && "bg-muted text-muted-foreground"
                    )}>
                        {isCompleted ? <Check className="w-4 h-4" /> : number}
                    </div>
                    <h2 className={cn("font-semibold", isActive ? "text-lg" : "text-base")}>
                        {title}
                    </h2>
                </div>
                {isCompleted && !isActive && (
                    <Button variant="ghost" size="sm" onClick={onEdit} className="text-primary gap-1">
                        <Edit2 className="w-3 h-3" /> Change
                    </Button>
                )}
            </div>

            {isActive && (
                <div className="p-6 border-t animate-in fade-in slide-in-from-top-2">
                    {children}
                </div>
            )}
        </Card>
    );
}