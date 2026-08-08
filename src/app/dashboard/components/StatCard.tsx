import { type ReactNode } from "react";
import { ClipboardList, Clock, AlertCircle, CheckCircle2 } from "lucide-react";


interface StatCardProps {
  label: string;
  value: number | string;
  highlight?: boolean;   // golden border for "Action Required"
  icon?: ReactNode;
}

export function StatCard({ label, value, highlight = false, icon }: StatCardProps) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: highlight ? "1.5px solid #F59E0B" : "1px solid #E5E7EB",
        borderRadius: 10,
        padding: "18px 22px",
        minWidth: 0,
        flex: 1,
        boxShadow: highlight
          ? "0 0 0 3px rgba(245,158,11,0.10)"
          : "0 1px 3px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.18s",
        cursor: "default",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = highlight
          ? "0 0 0 4px rgba(245,158,11,0.18)"
          : "0 4px 12px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = highlight
          ? "0 0 0 3px rgba(245,158,11,0.10)"
          : "0 1px 3px rgba(0,0,0,0.04)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#6B7280",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {label}
        </span>
        {icon && (
          <span style={{ color: highlight ? "#F59E0B" : "#D1D5DB" }}>{icon}</span>
        )}
      </div>
      <div
        style={{
          fontSize: 30,
          fontWeight: 700,
          color: highlight ? "#B45309" : "#111827",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}


interface StatCardRowProps {
  total: number;
  inQueue: number;
  actionRequired: number;
  completed: number;
}

export function StatCardRow({ total, inQueue, actionRequired, completed }: StatCardRowProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 14,
        marginBottom: 24,
      }}
    >
      <StatCard label="Total Procurements" value={total}          icon={<ClipboardList size={16} strokeWidth={1.8} />} />
      <StatCard label="In Your Queue"      value={inQueue}        icon={<Clock size={16} strokeWidth={1.8} />} />
      <StatCard label="Action Required"    value={actionRequired} icon={<AlertCircle size={16} strokeWidth={1.8} />} highlight />
      <StatCard label="Completed"          value={completed}      icon={<CheckCircle2 size={16} strokeWidth={1.8} />} />
    </div>
  );
}
