import { isCategory, isProduct } from "../../helpers/landing-able-guards";
import { useAddToCart } from "~/routes/frontoffice/product-detail/hooks/use-add-to-cart";
import { useAppPathname } from "~/lib/app-pathname";
import { useTranslation } from "react-i18next";
import { ActionsView, type ActionsViewProps } from "wle-ui-package";

export const Actions = ({ related }: Pick<ActionsViewProps, 'related'>) => {
    const { t } = useTranslation("landing");

    const addToCart = useAddToCart();
    const appPathname = useAppPathname();

    return <ActionsView
        addToCart={addToCart}
        appPathname={appPathname}
        isCategory={isCategory}
        isProduct={isProduct}
        related={related}
        shopNowLabel={t("landing:ctaActions.shopNow")}
        browseAllProductsLabel={t("landing:ctaActions.browseAllProducts")}
        addToCartLabel={t("landing:common.addToCart")}
        shopCategoryLabel={t("landing:ctaActions.shopCategory")}
    />
}