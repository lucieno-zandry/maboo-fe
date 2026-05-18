export default function LoadingScreen() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-8 animate-pulse">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2">
                        <div className="h-8 w-48 bg-muted rounded" />
                        <div className="h-4 w-72 bg-muted rounded" />
                    </div>
                    <div className="h-6 w-20 bg-muted rounded" />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 p-6 bg-card rounded-xl shadow-sm border border-border/50">
                    <div className="h-20 w-20 bg-muted rounded-full" />
                    <div className="flex-1 space-y-3 text-center sm:text-left">
                        <div className="h-6 w-40 bg-muted rounded mx-auto sm:mx-0" />
                        <div className="h-4 w-64 bg-muted rounded mx-auto sm:mx-0" />
                    </div>
                    <div className="h-10 w-28 bg-muted rounded" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-10 bg-muted rounded" />
                    ))}
                </div>

                <div className="h-[600px] bg-card rounded-xl shadow-sm border border-border/50 p-6 space-y-4">
                    <div className="h-6 w-36 bg-muted rounded" />
                    <div className="h-4 w-72 bg-muted rounded" />

                    <div className="space-y-4 mt-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-12 bg-muted rounded" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}