import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";

function StarRating({ rating, ariaLabel }: { rating: number; ariaLabel: string }) {
  return (
    <div className="star-rating" aria-label={ariaLabel}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`star-rating__star ${i < rating ? "star-rating__star--filled" : "star-rating__star--empty"}`}
          fill={i < rating ? "currentColor" : "none"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

interface TestimonialsViewProps {
  eyebrow?: string;
  title: string;
  testimonials: Array<{
    id: string;
    author: string;
    location: string;
    avatar?: string;
    rating: number;
    text: string;
    verified: boolean;
  }>;
  verifiedPurchaseLabel: string;
  securePaymentViaLabel: string;
  ratingLabel: (rating: number) => string;
}

export function TestimonialsView({
  eyebrow,
  title,
  testimonials,
  verifiedPurchaseLabel,
  securePaymentViaLabel,
  ratingLabel
}: TestimonialsViewProps) {
  return (
    <section className="testimonials" id="reviews">
      <div className="testimonials__inner">
        <div className="testimonials__header">
          {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
          <h2 className="section-title">{title}</h2>
        </div>

        <div className="testimonials__grid">
          {testimonials.map((t, i) => (
            <div key={t.id} className="testimonial-card" style={{ animationDelay: `${i * 100}ms` }}>
              <span className="testimonial-card__quote-mark" aria-hidden>"</span>
              <StarRating rating={t.rating} ariaLabel={ratingLabel(t.rating)} />
              <p className="testimonial-card__text">{t.text}</p>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar-wrap">
                  {t.avatar ? (
                    <img src={t.avatar} alt={t.author} className="testimonial-card__avatar" />
                  ) : (
                    <span className="testimonial-card__initials" aria-hidden>
                      {t.author.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="testimonial-card__name">
                    {t.author}
                    {t.verified && (
                      <span className="testimonial-card__verified" title={verifiedPurchaseLabel}>✓</span>
                    )}
                  </p>
                  <p className="testimonial-card__location">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment trust strip – static (could be moved to settings later) */}
        <div className="testimonials__payment-strip">
          <p className="testimonials__payment-label">{securePaymentViaLabel}</p>
          <div className="testimonials__payment-icons">
            {["VISA", "Mastercard", "PayPal"].map((method) => (
              <span key={method} className="payment-badge">{method}</span>
            ))}
            <span className="payment-badge payment-badge--ssl">🔒 SSL</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Testimonials({ block }: { block: LandingBlock<TestimonialsContent> }) {
  const { t } = useTranslation("landing");
  const content = block.content ?? {} as TestimonialsContent;
  const testimonials = content.testimonials ?? [];

  return (
    <TestimonialsView
      eyebrow={content.eyebrow}
      title={block.title ?? t("landing:testimonials.trustedAcrossFrance")}
      testimonials={testimonials}
      verifiedPurchaseLabel={t("landing:testimonials.verifiedPurchase")}
      securePaymentViaLabel={t("landing:testimonials.securePaymentVia")}
      ratingLabel={(rating) => t("landing:testimonials.ratingOutOfFive", { rating })}
    />
  );
}