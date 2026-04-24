import { ChevronDown } from "lucide-react";
import { useLandingUIStore } from "../stores/use-landing-ui-store";

interface FaqViewProps {
  eyebrow?: string;
  title: string;
  items: Array<{ id: string; question: string; answer: string }>;
  openId: string | null;
  onToggle: (id: string) => void;
}

export function FaqView({ eyebrow, title, items, openId, onToggle }: FaqViewProps) {
  return (
    <section className="faq" id="faq">
      <div className="faq__inner">
        <div className="faq__header">
          {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
          <h2 className="section-title">{title}</h2>
        </div>
        <div className="faq__list" role="list">
          {items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`faq-item ${isOpen ? "faq-item--open" : ""}`}
                role="listitem"
              >
                <button
                  className="faq-item__trigger"
                  onClick={() => onToggle(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                >
                  <span className="faq-item__question">{item.question}</span>
                  <ChevronDown
                    className={`faq-item__chevron ${isOpen ? "faq-item__chevron--open" : ""}`}
                    strokeWidth={1.5}
                  />
                </button>
                <div
                  id={`faq-answer-${item.id}`}
                  className="faq-item__answer-wrap"
                  aria-hidden={!isOpen}
                  style={{
                    maxHeight: isOpen ? "400px" : "0px",
                    overflow: "hidden",
                    transition: "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <p className="faq-item__answer">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Faq({ block }: { block: LandingBlock<FaqContent> }) {
  const { openFaqId, toggleFaq } = useLandingUIStore();

  const content = block.content ?? {} as FaqContent;
  const eyebrow = content.eyebrow;
  const items = content.items ?? [];

  return (
    <FaqView
      eyebrow={eyebrow}
      title={block.title ?? "Everything you need to know"}
      items={items}
      openId={openFaqId}
      onToggle={toggleFaq}
    />
  );
}