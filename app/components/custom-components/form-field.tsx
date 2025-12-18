import { Input } from "../ui/input"
import { Label } from "../ui/label"

/* ----------------------------------------
   Small reusable field
---------------------------------------- */
export default function FormField({
    name,
    label,
    defaultValue,
    required,
}: {
    name: string
    label: string
    defaultValue?: string
    required?: boolean
}) {
    return (
        <div className="space-y-1">
            <Label htmlFor={name}>{label}</Label>
            <Input
                id={name}
                name={name}
                defaultValue={defaultValue}
                required={required}
            />
        </div>
    )
}
