import { Check, X } from "lucide-react";
import type { ComparisonRow } from "../types/landing-types";
import { COMPARISON_ROWS } from "../helpers/landing-data";

interface ComparisonViewProps {
  rows: ComparisonRow[];
}

export function ComparisonView({ rows }: ComparisonViewProps) {
  return (
    <section className="comparison" id="comparison">
      <div className="comparison__inner">
        {/* Header */}
        <div className="comparison__header">
          <p className="section-eyebrow">Why it matters</p>
          <h2 className="section-title">Le Goût du Vrai</h2>
          <p className="section-subtitle">
            Not all vanilla is created equal. Here's what sets ours apart.
          </p>
        </div>

        {/* Table */}
        <div className="comparison__table-wrap">
          <table className="comparison__table">
            <thead>
              <tr>
                <th className="comparison__th comparison__th--criteria">Criteria</th>
                <th className="comparison__th comparison__th--ours">
                  <span className="comparison__ours-label">
                    🌿 Épices SAVA
                  </span>
                </th>
                <th className="comparison__th comparison__th--theirs">
                  Supermarket Spices
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.criteria}
                  className={`comparison__row ${i % 2 === 0 ? "comparison__row--even" : ""
                    }`}
                >
                  <td className="comparison__td comparison__td--criteria">
                    {row.criteria}
                  </td>
                  <td className="comparison__td comparison__td--ours">
                    {typeof row.ours === "boolean" ? (
                      row.ours ? (
                        <Check className="comparison__check" strokeWidth={2.5} />
                      ) : (
                        <X className="comparison__cross" strokeWidth={2.5} />
                      )
                    ) : (
                      <span className="comparison__text-value">{row.ours}</span>
                    )}
                  </td>
                  <td className="comparison__td comparison__td--theirs">
                    {typeof row.theirs === "boolean" ? (
                      row.theirs ? (
                        <Check className="comparison__check" strokeWidth={2.5} />
                      ) : (
                        <X className="comparison__cross" strokeWidth={2.5} />
                      )
                    ) : (
                      <span className="comparison__text-value comparison__text-value--dim">
                        {row.theirs}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/**
 * Comparison (Smart)
 * Comparison rows are static marketing copy.
 * The `price/gram transparency` row could be made dynamic
 * using Variant.weight_kg from the loader.
 */
export function Comparison() {
  return <ComparisonView rows={COMPARISON_ROWS} />;
}