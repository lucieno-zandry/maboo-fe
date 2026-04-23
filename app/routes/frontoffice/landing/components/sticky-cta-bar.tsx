import { ShoppingCart, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useLandingUIStore } from "../stores/use-landing-ui-store";
import productThumbnail from "../public/images/vanilla-pods-dark.jpg";

interface StickyCTABarViewProps {
  isVisible: boolean;
  onAddToCart: () => void;
  onDismiss: () => void;
}

export function StickyCTABarView({
  isVisible,
  onAddToCart,
  onDismiss,
}: StickyCTABarViewProps) {
  return (
    <div
      className={`sticky-cta ${isVisible ? "sticky-cta--visible" : ""}`}
      aria-hidden={!isVisible}
      role="complementary"
      aria-label="Quick add to cart"
    >
      <div className="sticky-cta__inner">
        {/* Snapshot */}
        <div className="sticky-cta__product">
          {/*
            IMAGE PLACEHOLDER: Small 40×40px thumbnail of the hero vanilla product.
            File: /public/images/hero-product-thumb.jpg
          */}
          <img
            src={productThumbnail}
            alt="Bourbon Vanilla Pods"
            className="sticky-cta__thumb"
          />
          <div>
            <p className="sticky-cta__name">Bourbon Vanilla Pods</p>
            <p className="sticky-cta__price">From €12.90</p>
          </div>
        </div>

        {/* Action */}
        <Button
          onClick={onAddToCart}
          size="sm"
          className="sticky-cta__btn"
        >
          <ShoppingCart className="w-4 h-4 mr-1.5" />
          Add to Cart
        </Button>

        {/* Dismiss */}
        <button
          onClick={onDismiss}
          className="sticky-cta__dismiss"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * StickyCTABar (Smart)
 * Visibility is driven by the Zustand store — toggled by
 * the IntersectionObserver in useStickyCtaTrigger (attached in Hero).
 */
export function StickyCTABar() {
  const { isStickyCTAVisible, setStickyCTAVisible } = useLandingUIStore();

  const handleAddToCart = () => {
    // TODO: wire to cart store / fetcher
    console.info("[StickyCTABar] Add to cart");
  };

  const handleDismiss = () => {
    setStickyCTAVisible(false);
  };

  return (
    <StickyCTABarView
      isVisible={isStickyCTAVisible}
      onAddToCart={handleAddToCart}
      onDismiss={handleDismiss}
    />
  );
}