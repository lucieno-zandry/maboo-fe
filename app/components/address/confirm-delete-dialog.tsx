import { Form } from "react-router";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "~/components/ui/dialog";
import Button from "../custom-components/button";

type ConfirmDeleteDialogProps = {
    ids: number[];
    trigger: React.ReactNode;
    title?: string;
    description?: string;
    isLoading: boolean;
    open: boolean;
    onOpenChange?: (open: boolean) => void;
};

export default function ConfirmDeleteDialog({
    ids,
    trigger,
    title = "Confirm deletion",
    description = "This action cannot be undone. Are you sure you want to delete the selected address(es)?",
    isLoading = false,
    open,
    onOpenChange
}: ConfirmDeleteDialogProps) {
    const intent = ids.length > 1 ? "bulk-delete" : "delete";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>

            <DialogContent aria-describedby={title}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <Form method="post">
                    <input type="hidden" name="_intent" value={intent} />

                    {ids.length === 1 ? (
                        <input type="hidden" name="id" value={ids[0]} />
                    ) : (
                        ids.map((id) => (
                            <input key={id} type="hidden" name="ids[]" value={id} />
                        ))
                    )}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>

                        <Button type="submit" variant="destructive" isLoading={isLoading}>
                            Delete
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
