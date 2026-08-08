import { CheckCircle2, Circle } from "lucide-react";

export interface VerificationStep {
  id: string;
  label: string;
  description: string;
  verified: boolean;
  notes?: string;
}

interface PaymentVerificationChecklistProps {
  procurementId: string;
  steps: VerificationStep[];
  onVerify?: (stepId: string) => void;
  readonly?: boolean;
}

export function PaymentVerificationChecklist({ procurementId, steps, onVerify, readonly = false }: PaymentVerificationChecklistProps) {
  const verifiedCount = steps.filter(s => s.verified).length;
  const allVerified = verifiedCount === steps.length;

  const getStepColor = (verified: boolean) => {
    return verified ? "#10B981" : "#9CA3AF";
  };

  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20 }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 2 }}>
              Payment Verification Checklist
            </h3>
            <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
              Procurement: {procurementId}
            </p>
          </div>
          <div style={{
            fontSize: 12,
            fontWeight: 700,
            color: allVerified ? "#15803D" : "#F59E0B",
            background: allVerified ? "#F0FDF4" : "#FFFBEB",
            padding: "4px 12px",
            borderRadius: 20,
            border: allVerified ? "1px solid #BBF7D0" : "1px solid #FDE68A",
          }}>
            {verifiedCount}/{steps.length} Verified
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 6,
          background: "#E5E7EB",
          borderRadius: 3,
          overflow: "hidden",
        }}>
          <div
            style={{
              height: "100%",
              background: allVerified ? "#10B981" : "#F59E0B",
              width: `${(verifiedCount / steps.length) * 100}%`,
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {steps.map((step, idx) => (
          <div
            key={step.id}
            style={{
              padding: 14,
              border: step.verified ? "2px solid #10B981" : "1px solid #E5E7EB",
              borderRadius: 8,
              background: step.verified ? "#F0FDF4" : "#FFFFFF",
              transition: "all 0.2s",
            }}
          >
            <div style={{ display: "flex", gap: 12 }}>
              {/* Icon */}
              <div style={{ flexShrink: 0, marginTop: 2 }}>
                {step.verified ? (
                  <CheckCircle2 size={20} style={{ color: "#10B981" }} />
                ) : (
                  <Circle size={20} style={{ color: "#D1D5DB" }} />
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: 4,
                }}>
                  <div>
                    <h4 style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#111827",
                      margin: 0,
                    }}>
                      {idx + 1}. {step.label}
                    </h4>
                    <p style={{
                      fontSize: 11,
                      color: "#6B7280",
                      margin: "4px 0 0",
                    }}>
                      {step.description}
                    </p>
                  </div>

                  {/* Action button */}
                  {!readonly && !step.verified && (
                    <button
                      onClick={() => onVerify?.(step.id)}
                      style={{
                        padding: "4px 12px",
                        background: "#DBEAFE",
                        color: "#1D4ED8",
                        border: "1px solid #BFDBFE",
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        marginLeft: 8,
                      }}
                    >
                      Mark Done
                    </button>
                  )}
                </div>

                {/* Notes */}
                {step.notes && (
                  <div style={{
                    fontSize: 10,
                    color: "#6B7280",
                    background: "#F9FAFB",
                    padding: 6,
                    borderRadius: 4,
                    marginTop: 6,
                    fontStyle: "italic",
                    borderLeft: "2px solid #E5E7EB",
                    paddingLeft: 8,
                  }}>
                    {step.notes}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary section */}
      <div style={{
        marginTop: 16,
        padding: 12,
        background: "#F9FAFB",
        borderRadius: 8,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>
            Payment Status
          </div>
          <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: allVerified ? "#15803D" : "#F59E0B",
          }}>
            {allVerified ? "Ready for Payment Authorization" : "Verification in Progress"}
          </div>
        </div>
        {allVerified && (
          <button
            style={{
              padding: "8px 16px",
              background: "#15803D",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Authorize Payment
          </button>
        )}
      </div>
    </div>
  );
}
