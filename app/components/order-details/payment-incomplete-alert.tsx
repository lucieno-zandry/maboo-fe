import { AlertCircle } from "lucide-react";

export default function PaymentIncompleteAlert() {
    return (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <div>
                    <p className="font-semibold text-destructive">Payment Incomplete</p>
                    <p className="text-sm text-destructive/80">
                        To process your order, please complete the transaction.
                    </p>
                </div>
            </div>
        </div>
    );
}