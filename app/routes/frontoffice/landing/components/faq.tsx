import { ChevronDown } from "lucide-react";
import type { FaqItem } from "../types/landing-types";
import { useLandingUIStore } from "../stores/use-landing-ui-store";
import { FAQ_ITEMS } from "../helpers/landing-data";

interface FaqViewProps {
  items: FaqItem[];
  openId: string | null;
  onToggle: (id: string) => void;
}

export function FaqView({ items, openId, onToggle }: FaqViewProps) {
  return (
    <section className="faq" id="faq">
      <div className="faq__inner">
        {/* Header */}
        <div className="faq__header">
          <p className="section-eyebrow">Got questions?</p>
          <h2 className="section-title">Everything you need to know</h2>
        </div>

        {/* Accordion */}
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
                    className={`faq-item__chevron ${isOpen ? "faq-item__chevron--open" : ""
                      }`}
                    strokeWidth={1.5}
                  />
                </button>

                <div
                  id={`faq-answer-${item.id}`}
                  className="faq-item__answer-wrap"
                  aria-hidden={!isOpen}
                  style={{
                    // CSS-driven height animation via max-height trick
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

/**
 * Faq (Smart)
 * Delegates accordion open/close state to the landing UI store
 * so the state is preserved across re-renders and could be
 * controlled externally (e.g. deep-link to a specific FAQ).
 */
export function Faq() {
  const { openFaqId, toggleFaq } = useLandingUIStore();

  return (
    <FaqView
      items={FAQ_ITEMS}
      openId={openFaqId}
      onToggle={toggleFaq}
    />
  );
}