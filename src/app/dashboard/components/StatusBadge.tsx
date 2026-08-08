import type { ProcurementStatus } from "../types";


interface StatusConfig {
  bg: string;
  text: string;
  border: string;
  dot: string;
}

const STATUS_MAP: Partial<Record<ProcurementStatus, StatusConfig>> = {
  "Pending Fund Verification": { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A", dot: "#F59E0B" },
  "Funds Verified":            { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0", dot: "#22C55E" },
  "Bidding Prep":              { bg: "#F5F3FF", text: "#5B21B6", border: "#DDD6FE", dot: "#7C3AED" },
  "Bidding Open":              { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE", dot: "#3B82F6" },
  "Technical Evaluation":      { bg: "#F5F3FF", text: "#6D28D9", border: "#DDD6FE", dot: "#8B5CF6" },
  "Authority Approval":        { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A", dot: "#D97706" },
  "Purchase Order Issued":     { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0", dot: "#22C55E" },
  "Awaiting Delivery":         { bg: "#EFF6FF", text: "#0369A1", border: "#BAE6FD", dot: "#0EA5E9" },
  "Quality Report Required":   { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA", dot: "#F97316" },
  "Payment Pending":           { bg: "#FEF2F2", text: "#B91C1C", border: "#FECACA", dot: "#EF4444" },
  "Completed":                 { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0", dot: "#22C55E" },
  "Rejected":                  { bg: "#FEF2F2", text: "#B91C1C", border: "#FECACA", dot: "#EF4444" },
};

const DEFAULT_CONFIG: StatusConfig = {
  bg: "#F1F5F9", text: "#475569", border: "#E2E8F0", dot: "#94A3B8",
};

interface StatusBadgeProps {
  status: ProcurementStatus | string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const cfg = STATUS_MAP[status as ProcurementStatus] ?? DEFAULT_CONFIG;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size === "sm" ? 6 : 8,
        padding: size === "sm" ? "3px 10px" : "4px 12px",
        borderRadius: 20,
        fontSize: size === "sm" ? 11 : 12,
        fontWeight: 600,
        background: cfg.bg,
        color: cfg.text,
        border: `1px solid ${cfg.border}`,
        whiteSpace: "nowrap",
        letterSpacing: "0.01em",
        width: size === "sm" ? 180 : 195,
        boxSizing: "border-box",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: cfg.dot,
          flexShrink: 0,
        }}
      />
      {status}
    </span>
  );
}
