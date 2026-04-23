import { Star } from "lucide-react";
import type { Testimonial } from "../types/landing-types";
import { TESTIMONIALS } from "../helpers/landing-data";

interface TestimonialsViewProps {
  testimonials: Testimonial[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="star-rating" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`star-rating__star ${i < rating ? "star-rating__star--filled" : "star-rating__star--empty"
            }`}
          fill={i < rating ? "currentColor" : "none"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export function TestimonialsView({ testimonials }: TestimonialsViewProps) {
  return (
    <section className="testimonials" id="reviews">
      <div className="testimonials__inner">
        {/* Header */}
        <div className="testimonials__header">
          <p className="section-eyebrow">What our customers say</p>
          <h2 className="section-title">Trusted across France</h2>
        </div>

        {/* Cards */}
        <div className="testimonials__grid">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className="testimonial-card"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Quote mark */}
              <span className="testimonial-card__quote-mark" aria-hidden>
                "
              </span>

              <StarRating rating={t.rating} />

              <p className="testimonial-card__text">{t.text}</p>

              {/* Author */}
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar-wrap">
                  {/*
                    IMAGE PLACEHOLDER: Customer avatar photo or initials fallback.
                    Circular, 48×48px. If no photo, display initials on
                    a parchment-coloured background.
                    Files: /public/images/avatar-{name}.jpg
                  */}
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="testimonial-card__avatar"
                    onError={(e) => {
                      // Fallback to initials
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="testimonial-card__initials" aria-hidden>
                    {t.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="testimonial-card__name">
                    {t.author}
                    {t.verified && (
                      <span className="testimonial-card__verified" title="Verified purchase">
                        ✓
                      </span>
                    )}
                  </p>
                  <p className="testimonial-card__location">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment trust strip */}
        <div className="testimonials__payment-strip">
          <p className="testimonials__payment-label">Secure payment via</p>
          <div className="testimonials__payment-icons">
            {/* 
              These are text badges — swap for SVG logos if available:
              Visa, Mastercard, PayPal official brand assets.
            */}
            {["VISA", "Mastercard", "PayPal"].map((method) => (
              <span key={method} className="payment-badge">
                {method}
              </span>
            ))}
            <span className="payment-badge payment-badge--ssl">🔒 SSL</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Testimonials (Smart)
 * In production, testimonials could be fetched from a reviews API
 * (e.g. Trustpilot, Judge.me) via the route loader.
 * Currently uses static seed data.
 */
export function Testimonials() {
  return <TestimonialsView testimonials={TESTIMONIALS} />;
}