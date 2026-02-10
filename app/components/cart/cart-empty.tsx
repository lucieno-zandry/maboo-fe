import type { TFunction } from "i18next"
import { ShoppingBag } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "~/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty"

export type CartEmptyProps = {
  onClose: () => void,
  t: TFunction,
}

export function CartEmpty({ onClose, t }: CartEmptyProps) {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShoppingBag />
        </EmptyMedia>

        <EmptyTitle>{t('common:cartIsEmpty')}</EmptyTitle>

        <EmptyDescription>
          {t('common:cartEmptyDescription')}
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent>
        <Button variant="outline" size="sm" onClick={onClose} type="button">
          {t('common:continueShopping')}
        </Button>
      </EmptyContent>
    </Empty>
  )
}

export default function (props: Pick<CartEmptyProps, 'onClose'>) {
  const { t } = useTranslation();

  return <CartEmpty t={t} {...props} />
}