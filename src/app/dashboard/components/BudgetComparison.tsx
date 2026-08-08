interface BudgetComparisonProps {
  requested: number;
  allocated: number;
  available: number;
  currencyLabel?: string;
}

export function BudgetComparison({ requested, allocated, available, currencyLabel = "LKR" }: BudgetComparisonProps) {
  const used = allocated - available;
  const allocatedPercent = allocated > 0 ? (used / allocated) * 100 : 0;
  const requestedVsAllocated = allocated > 0 ? (requested / allocated) * 100 : 0;

  const formatAmount = (amt: number) => {
    if (amt >= 1_000_000) {
      return `${currencyLabel} ${(amt / 1_000_000).toFixed(1)}M`;
    }
    return `${currencyLabel} ${amt.toLocaleString("en-LK")}`;
  };

  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
          Budget Allocation Summary
        </h3>
        <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
          Comparison of requested amount vs. allocated budget
        </p>
      </div>

      {/* Budget rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Requested */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>Requested Amount</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{formatAmount(requested)}</span>
          </div>
          <div style={{
            height: 8,
            background: "#E5E7EB",
            borderRadius: 4,
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              background: "#1D4ED8",
              width: `${Math.min(requestedVsAllocated, 100)}%`,
              transition: "width 0.3s ease",
            }} />
          </div>
        </div>

        {/* Allocated */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>Budget Allocated</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#15803D" }}>{formatAmount(allocated)}</span>
          </div>
          <div style={{
            height: 8,
            background: "#E5E7EB",
            borderRadius: 4,
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              background: "#15803D",
              width: "100%",
            }} />
          </div>
        </div>

        {/* Available */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>Available Balance</span>
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              color: available > 0 ? "#15803D" : "#DC2626",
            }}>
              {formatAmount(available)}
            </span>
          </div>
          <div style={{
            height: 8,
            background: "#E5E7EB",
            borderRadius: 4,
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              background: available > 0 ? "#10B981" : "#EF4444",
              width: `${Math.min((available / allocated) * 100, 100)}%`,
            }} />
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16, paddingTop: 16, borderTop: "1px solid #E5E7EB" }}>
        <div>
          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>Used from Budget</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
            {allocatedPercent.toFixed(0)}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>Request Status</div>
          <div style={{
            fontSize: 14,
            fontWeight: 700,
            color: requested <= allocated ? "#10B981" : "#EF4444",
          }}>
            {requested <= allocated ? "Within Budget" : "Exceeds Budget"}
          </div>
        </div>
      </div>
    </div>
  );
}
