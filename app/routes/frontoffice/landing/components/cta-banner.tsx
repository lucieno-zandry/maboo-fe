import { useNavigate } from "react-router";

import { Button } from "~/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router";
import ctaBannerBg from "../public/images/vanilla-pods-dark.jpg";
import appPathname, { useAppPathname } from "~/lib/app-pathname";

interface CtaBannerViewProps {
  onShopNow: () => void;
  appPathname: typeof appPathname
}

export function CtaBannerView({ onShopNow, appPathname }: CtaBannerViewProps) {
  return (
    <section className="cta-banner" id="cta">
      {/*
        IMAGE PLACEHOLDER (background):
        Wide-format texture of dried vanilla pods arranged in a fan shape
        on dark wood or black linen. Very dark image — used as background.
        File: /public/images/cta-banner-bg.jpg
      */}
      <div className="cta-banner__bg" aria-hidden>
        <img
          src={ctaBannerBg}
          alt=""
          className="cta-banner__bg-img"
        />
        <div className="cta-banner__bg-overlay" />
      </div>

      <div className="cta-banner__content">
        <p className="cta-banner__eyebrow">Ready to taste the difference?</p>
        <h2 className="cta-banner__headline">
          Your kitchen deserves<br />the real thing.
        </h2>
        <p className="cta-banner__sub">
          Free shipping on orders over €50 · Tracked Colissimo delivery
        </p>

        <div className="cta-banner__actions">
          <Button
            onClick={onShopNow}
            size="lg"
            className="cta-banner__btn-primary"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Shop Now
          </Button>
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="cta-banner__btn-ghost"
          >
            <Link to={appPathname('/products')}>Browse all products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/**
 * CtaBanner (Smart)
 * Handles navigation to the shop on primary CTA click.
 * Could be extended to trigger a cart drawer open instead.
 */
export function CtaBanner() {
  const navigate = useNavigate();
  const appPathname = useAppPathname();

  const handleShopNow = () => {
    navigate(appPathname('/search/*'));
  };

  return <CtaBannerView onShopNow={handleShopNow} appPathname={appPathname} />;
}