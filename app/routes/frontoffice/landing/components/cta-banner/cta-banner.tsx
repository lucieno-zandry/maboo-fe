import { Actions } from "./actions";

interface CtaBannerViewProps {
  eyebrow?: string;
  headline: string;
  subline: string;
  backgroundImageUrl: string | null;
  related?: LandingAble
}

export function CtaBannerView({ eyebrow, headline, subline, backgroundImageUrl, related }: CtaBannerViewProps) {
  return (
    <section className="cta-banner" id="cta">
      <div className="cta-banner__bg" aria-hidden>
        <img src={backgroundImageUrl ?? "/images/cta-banner-bg.jpg"} alt="" className="cta-banner__bg-img" />
        <div className="cta-banner__bg-overlay" />
      </div>
      <div className="cta-banner__content">
        {eyebrow && <p className="cta-banner__eyebrow">{eyebrow}</p>}
        <h2 className="cta-banner__headline w-full md:w-[50%]">{headline}</h2>
        {subline && <p className="cta-banner__sub">{subline}</p>}
        <Actions related={related} />
      </div>
    </section>
  );
}

export function CtaBanner({ block }: { block: LandingBlock<CtaBannerContent> }) {
  const content = block.content ?? {};
  const eyebrow = content.eyebrow;
  const headline = block.title ?? "Your kitchen deserves the real thing.";
  const subline = block.subtitle ?? "Free shipping on orders over €50 · Tracked Colissimo delivery";
  const backgroundImageUrl = block.image?.url ?? null;

  const related = block.landing_able;

  return (
    <CtaBannerView
      eyebrow={eyebrow}
      headline={headline}
      subline={subline}
      backgroundImageUrl={backgroundImageUrl}
      related={related}
    />
  );
}