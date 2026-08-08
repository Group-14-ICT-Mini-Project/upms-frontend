import { AlertCircle, Clock, CheckCircle } from "lucide-react";
import type { Procurement } from "../types";

interface FileTrackerProps {
  procurements: Procurement[];
  onViewDetails?: (id: string) => void;
}

export function FileTracker({ procurements, onViewDetails }: FileTrackerProps) {
  // Group by bottleneck step
  const groupByBottleneck = (items: Procurement[]) => {
    const grouped: Record<string, Procurement[]> = {
      "Pending Fund Verification": [],
      "Funds Verified": [],
      "Bidding Prep": [],
      "Bidding Open": [],
      "Technical Evaluation": [],
      "Authority Approval": [],
      "Purchase Order Issued": [],
      "Awaiting Delivery": [],
      "Quality Report Required": [],
      "Payment Pending": [],
    };

    items.forEach(item => {
      if (grouped[item.status]) {
        grouped[item.status].push(item);
      }
    });

    return grouped;
  };

  const bottlenecks = groupByBottleneck(procurements);
  const bottleneckSteps = Object.entries(bottlenecks).filter(([_, items]) => items.length > 0);

  const getCriticalityColor = (status: string) => {
    if (status === "Pending Fund Verification" || status === "Authority Approval") {
      return { bg: "#FEF2F2", border: "#FECACA", text: "#DC2626", icon: "#EF4444" };
    }
    if (status === "Quality Report Required" || status === "Payment Pending") {
      return { bg: "#FFF7ED", border: "#FED7AA", text: "#C2410C", icon: "#F97316" };
    }
    return { bg: "#EFF6FF", border: "#BFDBFE", text: "#1D4ED8", icon: "#3B82F6" };
  };

  const getMostUrgent = () => {
    const urgentOrder = ["Pending Fund Verification", "Authority Approval", "Quality Report Required", "Payment Pending"];
    for (const status of urgentOrder) {
      if (bottlenecks[status]?.length > 0) {
        return status;
      }
    }
    return null;
  };

  const mostUrgent = getMostUrgent();

  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20 }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 2 }}>
          Procurement File Status Tracker
        </h3>
        <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
          Identify where procurements are stuck in the workflow
        </p>
      </div>

      {/* Bottleneck summary */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 12,
        marginBottom: 16,
      }}>
        <div style={{
          padding: 12,
          background: "#F5F3FF",
          border: "1px solid #DDD6FE",
          borderRadius: 8,
        }}>
          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>Total Files</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#6D28D9" }}>
            {procurements.length}
          </div>
        </div>
        <div style={{
          padding: 12,
          background: "#F0FDF4",
          border: "1px solid #BBF7D0",
          borderRadius: 8,
        }}>
          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>In Progress</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#15803D" }}>
            {procurements.filter(p => !["Completed", "Rejected"].includes(p.status)).length}
          </div>
        </div>
        <div style={{
          padding: 12,
          background: mostUrgent ? "#FEF2F2" : "#F0FDF4",
          border: mostUrgent ? "1px solid #FECACA" : "1px solid #BBF7D0",
          borderRadius: 8,
        }}>
          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>
            {mostUrgent ? "Most Urgent" : "On Track"}
          </div>
          <div style={{
            fontSize: 18,
            fontWeight: 700,
            color: mostUrgent ? "#DC2626" : "#15803D",
          }}>
            {mostUrgent ? bottlenecks[mostUrgent]?.length : "✓"}
          </div>
        </div>
      </div>

      {/* Bottleneck breakdown */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {bottleneckSteps.length > 0 ? (
          bottleneckSteps.map(([status, items]) => {
            const colors = getCriticalityColor(status);
            return (
              <div
                key={status}
                style={{
                  padding: 14,
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "start", gap: 12, marginBottom: 8 }}>
                  <Clock size={16} style={{ color: colors.icon, marginTop: 2, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: colors.text,
                      marginBottom: 2,
                    }}>
                      {status}
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: colors.text,
                      opacity: 0.8,
                    }}>
                      {items.length} {items.length === 1 ? "file" : "files"} waiting
                    </div>
                  </div>
                </div>

                {/* Items in this status */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginLeft: 28 }}>
                  {items.slice(0, 3).map(item => (
                    <div
                      key={item.id}
                      onClick={() => onViewDetails?.(item.id)}
                      style={{
                        padding: 8,
                        background: "rgba(255,255,255,0.5)",
                        border: `1px solid ${colors.border}`,
                        borderRadius: 4,
                        fontSize: 11,
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.8)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.5)";
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: colors.text }}>
                          {item.id} — {item.title}
                        </div>
                        <div style={{ fontSize: 10, color: colors.text, opacity: 0.7, marginTop: 2 }}>
                          {item.department || item.faculty}
                        </div>
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: colors.text, whiteSpace: "nowrap" }}>
                        LKR {(item.value / 1000).toFixed(0)}K
                      </div>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <div style={{
                      padding: 8,
                      fontSize: 11,
                      color: colors.text,
                      fontWeight: 600,
                      textAlign: "center",
                    }}>
                      +{items.length - 3} more files...
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div style={{
            textAlign: "center",
            padding: 24,
            background: "#F9FAFB",
            borderRadius: 8,
            color: "#6B7280",
          }}>
            <CheckCircle size={24} style={{ margin: "0 auto 8px", opacity: 0.5 }} />
            <p style={{ fontSize: 12, margin: 0 }}>All procurements are on track!</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{
        marginTop: 16,
        padding: 12,
        background: "#F9FAFB",
        borderRadius: 8,
        fontSize: 10,
        color: "#6B7280",
      }}>
        <strong>Status Legend:</strong> Red = Critical (waiting for fund/authority verification) | Orange = Warning (quality/payment) | Blue = Standard (bidding/evaluation)
      </div>
    </div>
  );
}
