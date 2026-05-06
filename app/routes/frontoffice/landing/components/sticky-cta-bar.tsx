import { ShoppingCart, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useLandingUIStore } from "../stores/use-landing-ui-store";
import { useAddToCart } from "~/routes/frontoffice/product-detail/hooks/use-add-to-cart";
import { useFormatMoney } from "~/lib/format-money";
import { useTranslation } from "react-i18next";

interface StickyCTABarViewProps {
  isVisible: boolean;
  productName: string;
  price: string;        // formatted price
  thumbnailUrl: string | null;
  onAddToCart: () => void;
  onDismiss: () => void;
  quickAddAriaLabel: string;
  addToCartLabel: string;
  dismissAriaLabel: string;
}

interface StickyCTABarViewProps {
  isVisible: boolean;
  productName: string;
  price: string;
  thumbnailUrl: string | null;
  onAddToCart: () => void;
  onDismiss: () => void;
  quickAddAriaLabel: string;
  addToCartLabel: string;
  dismissAriaLabel: string;
}

export function StickyCTABarView({
  isVisible,
  productName,
  price,
  thumbnailUrl,
  onAddToCart,
  onDismiss,
  quickAddAriaLabel,
  addToCartLabel,
  dismissAriaLabel,
}: StickyCTABarViewProps) {
  return (
    <div
      className={`sticky-cta ${isVisible ? "sticky-cta--visible" : ""}`}
      aria-hidden={!isVisible}
      role="complementary"
      aria-label={quickAddAriaLabel}
    >
      <div className="sticky-cta__inner">
        <div className="sticky-cta__product">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={productName}
              className="sticky-cta__thumb"
            />
          ) : (
            <div className="sticky-cta__thumb sticky-cta__thumb--placeholder" />
          )}
          {/* Add a class here to constrain the flex child */}
          <div className="sticky-cta__info">
            <p className="sticky-cta__name">{productName}</p>
            <p className="sticky-cta__price">{price}</p>
          </div>
        </div>

        <Button onClick={onAddToCart} size="sm" className="sticky-cta__btn">
          <ShoppingCart className="w-4 h-4 mr-1.5" />
          <span className="sticky-cta__btn-text">{addToCartLabel}</span>
        </Button>

        <button onClick={onDismiss} className="sticky-cta__dismiss" aria-label={dismissAriaLabel}>
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ... StickyCTABar component remains exactly the same ...

interface StickyCTABarProps {
  product: Product;
}

export function StickyCTABar({
  product,
}: StickyCTABarProps) {
  const { t } = useTranslation("landing");
  const { isStickyCTAVisible, setStickyCTAVisible, selectedHeroVariantId } = useLandingUIStore();

  const addToCart = useAddToCart();
  const formatMoney = useFormatMoney();

  const selectedVariant = product.variants?.find(v => v.id === Number(selectedHeroVariantId)) ?? product.variants?.[0];

  if (!selectedVariant) return null;

  const handleDismiss = () => {
    setStickyCTAVisible(false);
  };

  const handleAddToCart = () => {
    addToCart({ count: 1, variant_id: selectedVariant.id });
  }

  const effectivePrice = selectedVariant.effective_price ?? selectedVariant.price;
  const formattedPrice = formatMoney(effectivePrice);
  const thumbnailUrl = selectedVariant.image?.url ?? product.images?.[0]?.url ?? null;
  const productName = product.title;

  return (
    <StickyCTABarView
      isVisible={isStickyCTAVisible}
      productName={productName}
      price={formattedPrice}
      thumbnailUrl={thumbnailUrl}
      onAddToCart={handleAddToCart}
      onDismiss={handleDismiss}
      quickAddAriaLabel={t("landing:stickyCta.quickAddToCart")}
      addToCartLabel={t("landing:common.addToCart")}
      dismissAriaLabel={t("landing:common.dismiss")}
    />
  );
}