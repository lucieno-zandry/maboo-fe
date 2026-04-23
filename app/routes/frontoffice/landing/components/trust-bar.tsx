import { Sprout, Award, PackageCheck, ShieldCheck, type LucideIcon } from "lucide-react";
import type { TrustPillar } from "../types/landing-types";
import { TRUST_PILLARS } from "../helpers/landing-data";

// ─── Icon map ─────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, LucideIcon> = {
  Sprout,
  Award,
  PackageCheck,
  ShieldCheck,
};

interface TrustBarViewProps {
  pillars: TrustPillar[];
}

export function TrustBarView({ pillars }: TrustBarViewProps) {
  return (
    <section className="trust-bar-section">
      <div className="trust-bar-container">
        {pillars.map((pillar, i) => {
          const Icon = ICON_MAP[pillar.icon] ?? Sprout;
          return (
            <div key={pillar.id} className="trust-pillar" style={{ animationDelay: `${i * 80}ms` }}>
              <span className="trust-pillar__icon-wrap">
                <Icon className="trust-pillar__icon" strokeWidth={1.5} />
              </span>
              <div className="trust-pillar__text">
                <p className="trust-pillar__title">{pillar.title}</p>
                <p className="trust-pillar__desc">{pillar.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/**
 * TrustBar (Smart)
 * Owns the data for the four trust pillars.
 * No logic beyond data provision — extensible for A/B testing pillar copy.
 */
export function TrustBar() {
  return <TrustBarView pillars={TRUST_PILLARS} />;
}