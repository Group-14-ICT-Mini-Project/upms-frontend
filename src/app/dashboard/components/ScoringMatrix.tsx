import { useState } from "react";

export interface ScoringCriteria {
  id: string;
  name: string;
  weight: number;   // 0-100
  maxScore: number;
}

export interface ScoringResult {
  bidderId: string;
  bidderName: string;
  scores: Record<string, number>; // criteria.id -> score
  totalScore?: number;
}

interface ScoringMatrixProps {
  criteria: ScoringCriteria[];
  bidders: Array<{ id: string; name: string }>;
  initialScores?: ScoringResult[];
  onChange?: (scores: ScoringResult[]) => void;
  readonly?: boolean;
}

export function ScoringMatrix({ criteria, bidders, initialScores = [], onChange, readonly = false }: ScoringMatrixProps) {
  const [scores, setScores] = useState<ScoringResult[]>(
    initialScores.length > 0
      ? initialScores
      : bidders.map(b => ({
        bidderId: b.id,
        bidderName: b.name,
        scores: {},
      }))
  );

  const handleScoreChange = (bidderId: string, criteriaId: string, value: number) => {
    if (readonly) return;

    const updated = scores.map(s => {
      if (s.bidderId === bidderId) {
        const updatedScores = { ...s.scores, [criteriaId]: Math.min(value, 100) };
        const totalScore = criteria.reduce((sum, crit) => {
          const score = updatedScores[crit.id] || 0;
          return sum + (score * crit.weight) / 100;
        }, 0);
        return { ...s, scores: updatedScores, totalScore };
      }
      return s;
    });

    setScores(updated);
    onChange?.(updated);
  };

  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);

  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20, overflowX: "auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
          Technical & Financial Scoring Matrix
        </h3>
        <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
          Total Weight: {totalWeight}% — Enter scores out of 100 for each criterion
        </p>
      </div>

      {/* Table */}
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: 12,
      }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #E5E7EB", background: "#F9FAFB" }}>
            <th style={{ textAlign: "left", padding: 12, fontWeight: 600, color: "#6B7280" }}>
              Bidder Name
            </th>
            {criteria.map(crit => (
              <th
                key={crit.id}
                style={{
                  textAlign: "center",
                  padding: 12,
                  fontWeight: 600,
                  color: "#6B7280",
                  minWidth: 120,
                  borderLeft: "1px solid #E5E7EB",
                }}
              >
                <div>{crit.name}</div>
                <div style={{ fontSize: 10, fontWeight: 400, color: "#9CA3AF" }}>
                  Weight: {crit.weight}%
                </div>
              </th>
            ))}
            <th style={{
              textAlign: "center",
              padding: 12,
              fontWeight: 600,
              color: "#111827",
              minWidth: 100,
              borderLeft: "2px solid #E5E7EB",
              background: "#F0FDF4",
            }}>
              Total Score
            </th>
          </tr>
        </thead>
        <tbody>
          {scores.map((row, ridx) => (
            <tr key={row.bidderId} style={{ borderBottom: "1px solid #E5E7EB" }}>
              <td style={{
                padding: 12,
                fontWeight: 600,
                color: "#111827",
                background: ridx % 2 === 0 ? "#FFFFFF" : "#F9FAFB",
              }}>
                {row.bidderName}
              </td>
              {criteria.map(crit => (
                <td
                  key={crit.id}
                  style={{
                    padding: 8,
                    textAlign: "center",
                    background: ridx % 2 === 0 ? "#FFFFFF" : "#F9FAFB",
                    borderLeft: "1px solid #E5E7EB",
                  }}
                >
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={row.scores[crit.id] || ""}
                    onChange={(e) => handleScoreChange(row.bidderId, crit.id, parseInt(e.target.value) || 0)}
                    disabled={readonly}
                    style={{
                      width: 50,
                      padding: 6,
                      border: "1px solid #D1D5DB",
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                      textAlign: "center",
                      background: readonly ? "#F3F4F6" : "#FFFFFF",
                      cursor: readonly ? "not-allowed" : "text",
                    }}
                  />
                </td>
              ))}
              <td
                style={{
                  padding: 12,
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: 13,
                  color: row.totalScore && row.totalScore > 75 ? "#15803D" : row.totalScore && row.totalScore > 50 ? "#F59E0B" : "#9CA3AF",
                  background: "#F0FDF4",
                  borderLeft: "2px solid #E5E7EB",
                }}
              >
                {row.totalScore?.toFixed(1) || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div style={{
        marginTop: 16,
        padding: 12,
        background: "#F9FAFB",
        borderRadius: 8,
        fontSize: 11,
        color: "#6B7280",
      }}>
        <strong>Scoring Guide:</strong> 80-100 = Excellent | 60-79 = Good | 40-59 = Acceptable | 0-39 = Poor
      </div>
    </div>
  );
}
