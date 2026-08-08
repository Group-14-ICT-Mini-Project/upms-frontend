import { useState } from "react";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export interface QualityItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  specification: string;
}

interface QualityChecklineProps {
  items: QualityItem[];
  onSubmit?: (results: Array<{ itemId: string; status: "Approved" | "Rejected"; notes: string }>) => void;
  readonly?: boolean;
}

export function QualityChecklist({ items, onSubmit, readonly = false }: QualityChecklineProps) {
  const [checkResults, setCheckResults] = useState<Record<string, { status: "Approved" | "Rejected" | "Pending"; notes: string }>>(
    items.reduce((acc, item) => {
      acc[item.id] = { status: "Pending", notes: "" };
      return acc;
    }, {} as Record<string, any>)
  );

  const handleStatusChange = (itemId: string, status: "Approved" | "Rejected") => {
    if (readonly) return;
    setCheckResults(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], status },
    }));
  };

  const handleNotesChange = (itemId: string, notes: string) => {
    if (readonly) return;
    setCheckResults(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], notes },
    }));
  };

  const allApproved = items.every(item => checkResults[item.id]?.status === "Approved");
  const approvedCount = items.filter(item => checkResults[item.id]?.status === "Approved").length;
  const rejectedCount = items.filter(item => checkResults[item.id]?.status === "Rejected").length;

  const handleSubmit = () => {
    const results = items.map(item => ({
      itemId: item.id,
      status: checkResults[item.id].status as "Approved" | "Rejected",
      notes: checkResults[item.id].notes,
    }));
    onSubmit?.(results);
  };

  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20 }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
          Quality Inspection Checklist
        </h3>
        <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
          Verify each item against original specifications
        </p>
      </div>

      {/* Progress indicators */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
        <div style={{
          padding: 12,
          background: "#F0FDF4",
          border: "1px solid #BBF7D0",
          borderRadius: 8,
          textAlign: "center",
        }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#15803D" }}>{approvedCount}</div>
          <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>Approved</div>
        </div>
        <div style={{
          padding: 12,
          background: "#FEF2F2",
          border: "1px solid #FECACA",
          borderRadius: 8,
          textAlign: "center",
        }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#DC2626" }}>{rejectedCount}</div>
          <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>Rejected</div>
        </div>
        <div style={{
          padding: 12,
          background: "#FFF7ED",
          border: "1px solid #FED7AA",
          borderRadius: 8,
          textAlign: "center",
        }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#C2410C" }}>
            {items.length - approvedCount - rejectedCount}
          </div>
          <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>Pending</div>
        </div>
      </div>

      {/* Inspection items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map(item => {
          const result = checkResults[item.id];
          return (
            <div
              key={item.id}
              style={{
                padding: 14,
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                background: result.status === "Approved"
                  ? "#F0FDF4"
                  : result.status === "Rejected"
                    ? "#FEF2F2"
                    : "#FFFFFF",
              }}
            >
              {/* Item header */}
              <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", marginBottom: 2 }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7280" }}>
                    Qty: {item.quantity} {item.unit} | Spec: {item.specification}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => handleStatusChange(item.id, "Approved")}
                    disabled={readonly}
                    style={{
                      padding: "6px 12px",
                      border: result.status === "Approved" ? "2px solid #15803D" : "1px solid #E5E7EB",
                      borderRadius: 6,
                      background: result.status === "Approved" ? "#F0FDF4" : "#FFFFFF",
                      color: result.status === "Approved" ? "#15803D" : "#6B7280",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: readonly ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <CheckCircle2 size={14} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(item.id, "Rejected")}
                    disabled={readonly}
                    style={{
                      padding: "6px 12px",
                      border: result.status === "Rejected" ? "2px solid #DC2626" : "1px solid #E5E7EB",
                      borderRadius: 6,
                      background: result.status === "Rejected" ? "#FEF2F2" : "#FFFFFF",
                      color: result.status === "Rejected" ? "#DC2626" : "#6B7280",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: readonly ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <XCircle size={14} />
                    Reject
                  </button>
                </div>
              </div>

              {/* Notes section */}
              <textarea
                placeholder="Add inspection notes (defects, condition, etc.)"
                value={result.notes}
                onChange={(e) => handleNotesChange(item.id, e.target.value)}
                disabled={readonly}
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #E5E7EB",
                  borderRadius: 6,
                  fontSize: 11,
                  fontFamily: "inherit",
                  color: "#111827",
                  background: readonly ? "#F3F4F6" : "#FFFFFF",
                  resize: "vertical",
                  minHeight: 50,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Submit button */}
      {!readonly && (
        <button
          onClick={handleSubmit}
          disabled={items.length === 0}
          style={{
            marginTop: 16,
            padding: "10px 24px",
            background: allApproved ? "#15803D" : "#9CA3AF",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            cursor: allApproved ? "pointer" : "not-allowed",
            width: "100%",
          }}
        >
          {allApproved ? "Submit Quality Report" : "Please review all items before submitting"}
        </button>
      )}
    </div>
  );
}
