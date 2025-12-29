import { Card } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge"; // Optional: if you have a badge component
import { cn } from "~/lib/utils"; // Tailwind merge utility
import { AddressListSkeleton } from "../address/address-list-skeleton";

export function AddressList({
    addresses,
    selectedId,
    onSelect,
}: {
    addresses: Address[] | null;
    selectedId: number | null;
    onSelect: (id: number) => void;
}) {
    if (!addresses) return <AddressListSkeleton />

    return (
        <RadioGroup
            value={selectedId?.toString()}
            onValueChange={(val) => onSelect(Number(val))}
            className="grid gap-4" // Use grid for consistent spacing
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