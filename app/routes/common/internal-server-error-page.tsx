import { useNavigate } from "react-router";
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function () {
    const navigate = useNavigate();

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12">
            <div className="mx-auto flex max-w-md flex-col items-center text-center">

                {/* Error Icon with Warning Theme */}
                <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/20">
                    <AlertTriangle className="h-12 w-12 text-amber-500" />
                    <div className="absolute -right-2 -top-2 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg">
                        500
                    </div>
                </div>

                <h1 className="mb-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
                    Something went wrong
                </h1>
                <p className="mb-8 text-muted-foreground leading-relaxed">
                    Our servers are having a bit of trouble processing your request.
                    We've been notified and are looking into it.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Button
                        variant="default"
                        onClick={handleRefresh}
                        className="gap-2 px-8"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => navigate("/")}
                        className="gap-2 px-8"
                    >
                        <Home className="h-4 w-4" />
                        Back to Home
                    </Button>
                </div>

                {/* Technical Support Section */}
                <div className="mt-12 w-full rounded-xl border border-dashed p-6 bg-muted/30">
                    <div className="flex items-center gap-3 mb-3 text-amber-600 dark:text-amber-400">
                        <ShieldAlert className="h-5 w-5" />
                        <span className="text-sm font-semibold uppercase tracking-wider">System Status</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-left mb-4">
                        If this issue persists, please provide our support team with the following reference:
                    </p>
                    <code className="block w-full rounded bg-muted p-2 text-[10px] font-mono text-muted-foreground break-all">
                        ERR_REF: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </code>
                </div>
            </div>
        </div>
    );
}