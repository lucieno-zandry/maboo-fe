import { STORY_CONTENT } from "../helpers/landing-data";
import type { StorySection } from "../types/landing-types";

interface StoryViewProps {
  content: StorySection;
}

export function StoryView({ content }: StoryViewProps) {
  const headlineLines = content.headline.split("\n");

  return (
    <section className="story" id="story">
      {/* Image — left on desktop, full-width on mobile */}
      <div className="story__img-col">
        <div className="story__img-wrap">
          {/*
            IMAGE PLACEHOLDER:
            Aerial or landscape of the SAVA region, northeastern Madagascar.
            Lush green vanilla plantations, red laterite roads, golden-hour light.
            Aspect ratio: 4:3 or 16:9. Min 1200×900px. No overlaid text.
            File: /public/images/sava-region-madagascar.jpg
          */}
          <img
            src={content.image}
            alt="The SAVA region of Madagascar"
            className="story__img"
            loading="lazy"
          />
          <p className="story__img-caption">{content.imageCaption}</p>
        </div>

        {/* Decorative accent line */}
        <div className="story__accent-bar" aria-hidden />
      </div>

      {/* Text — right on desktop */}
      <div className="story__text-col">
        <p className="section-eyebrow">{content.subheadline}</p>

        <h2 className="story__headline">
          {headlineLines.map((line, i) => (
            <span key={i} className={i === 1 ? "story__headline--accent" : ""}>
              {line}
              {i < headlineLines.length - 1 && <br />}
            </span>
          ))}
        </h2>

        <p className="story__body">{content.body}</p>

        {/* Stat pills */}
        <div className="story__stats">
          {[
            { value: "2018", label: "First Partnership" },
            { value: "12+", label: "Farmer Families" },
            { value: "100%", label: "Direct Trade" },
          ].map((stat) => (
            <div key={stat.label} className="story__stat">
              <span className="story__stat-value">{stat.value}</span>
              <span className="story__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Story (Smart)
 * Owns the brand narrative content. Could be made CMS-driven
 * by fetching from a headless CMS endpoint in the route loader.
 */
export function Story() {
  return <StoryView content={STORY_CONTENT} />;
}