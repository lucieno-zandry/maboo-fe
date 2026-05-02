import { useTranslation } from "react-i18next";

interface StoryViewProps {
  eyebrow?: string;
  title: string;
  body: string;
  imageUrl: string | null;
  imageCaption?: string;
  stats: Array<{ value: string; label: string }>;
  defaultImageAlt: string;
}

export function StoryView({ eyebrow, title, body, imageUrl, imageCaption, stats, defaultImageAlt }: StoryViewProps) {
  const headlineLines = title.split("\n");

  return (
    <section className="story" id="story">
      <div className="story__img-col">
        <div className="story__img-wrap">
          <img
            src={imageUrl ?? "/images/placeholder-story.jpg"}
            alt={imageCaption || defaultImageAlt}
            className="story__img"
            loading="lazy"
          />
          {imageCaption && <p className="story__img-caption">{imageCaption}</p>}
        </div>
        <div className="story__accent-bar" aria-hidden />
      </div>

      <div className="story__text-col">
        {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}

        <h2 className="story__headline">
          {headlineLines.map((line, i) => (
            <span key={i} className={i === 1 ? "story__headline--accent" : ""}>
              {line}
              {i < headlineLines.length - 1 && <br />}
            </span>
          ))}
        </h2>

        <p className="story__body">{body}</p>

        {stats.length > 0 && (
          <div className="story__stats">
            {stats.map((stat, idx) => (
              <div key={idx} className="story__stat">
                <span className="story__stat-value">{stat.value}</span>
                <span className="story__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function Story({ block }: { block: LandingBlock<StoryContent> }) {
  const { t } = useTranslation("landing");
  const content = block.content ?? {} as StoryContent;
  const stats = content.stats ?? [];

  return (
    <StoryView
      eyebrow={content.eyebrow}
      title={block.title ?? t("landing:story.ourStory")}
      body={content.body ?? ""}
      imageUrl={block.image?.url ?? null}
      imageCaption={content.imageCaption}
      stats={stats}
      defaultImageAlt={t("landing:story.brandStoryImage")}
    />
  );
}