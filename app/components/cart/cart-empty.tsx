import { ShoppingBag } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty"

export function CartEmpty() {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShoppingBag />
        </EmptyMedia>

        <EmptyTitle>Your Cart is Empty</EmptyTitle>

        <EmptyDescription>
          You haven't added any products yet. Browse the catalog and pick something you like.
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent>
        <Button variant="outline" size="sm">
          Continue Shopping
        </Button>
      </EmptyContent>
    </Empty>
  )
}
