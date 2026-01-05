import { Card } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button"; // Added Button for an Action
import { MapPinOff } from "lucide-react"; // Added an icon for the empty state
import { cn } from "~/lib/utils";
import { AddressListSkeleton } from "../address/address-list-skeleton";

export function AddressList({
    addresses,
    selectedId,
    onSelect,
    onAddNewClick
}: {
    addresses: Address[] | null;
    selectedId: number | null;
    onSelect: (id: number) => void;
    onAddNewClick: () => void;
}) {
    // 1. Loading State
    if (!addresses) return <AddressListSkeleton />;

    // 2. Empty State
    if (addresses.length === 0) {
        return (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <MapPinOff className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No addresses found</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    You haven't added any shipping addresses yet.
                </p>
                {/* Optional: Add a trigger here to open your "Add Address" modal/form */}
                <Button variant="outline" size="sm" type="button" onClick={onAddNewClick}>
                    Add New Address
                </Button>
            </div>
        );
    }

    // 3. Data State
    return (
        <RadioGroup
            value={selectedId?.toString()}
            onValueChange={(val) => onSelect(Number(val))}
            className="grid gap-4"
        >
            {addresses.map((addr) => {
                const isSelected = selectedId === addr.id;

                return (
                    <Card
                        key={addr.id}
                        className={cn(
                            "relative transition-all hover:border-primary/50",
                            isSelected ? "border-primary ring-1 ring-primary" : "border-muted"
                        )}
                    >
                        <Label
                            htmlFor={`addr-${addr.id}`}
                            className="flex items-start gap-4 p-4 cursor-pointer"
                        >
                            <RadioGroupItem
                                value={addr.id.toString()}
                                id={`addr-${addr.id}`}
                                className="mt-1"
                            />

                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold leading-none">{addr.fullname}</p>
                                    {addr.is_default && (
                                        <Badge variant="secondary" className="text-[10px] uppercase">
                                            Default
                                        </Badge>
                                    )}
                                </div>

                                <div className="text-sm text-muted-foreground">
                                    <p>{addr.line1}</p>
                                    {(addr.line2 || addr.line3) && (
                                        <p>{[addr.line2, addr.line3].filter(Boolean).join(", ")}</p>
                                    )}
                                </div>

                                <p className="text-sm font-medium text-foreground/80 pt-1">
                                    {addr.phone_number}
                                </p>
                            </div>
                        </Label>
                    </Card>
                );
            })}
        </RadioGroup>
    );
}