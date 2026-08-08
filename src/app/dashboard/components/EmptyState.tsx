import { Layers, Inbox, CheckCircle2 } from "lucide-react";


interface EmptyStateProps {
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  icon?: "construction" | "inbox" | "check";
}

const ICONS: Record<string, React.ReactNode> = {
  construction: <Layers size={40} strokeWidth={1.4} color="#D1D5DB" />,
  inbox:        <Inbox size={40} strokeWidth={1.4} color="#D1D5DB" />,
  check:        <CheckCircle2 size={40} strokeWidth={1.4} color="#D1D5DB" />,
};

export function EmptyState({ title, description, action, icon = "construction" }: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 32px",
        background: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: 10,
        textAlign: "center",
        gap: 12,
      }}
    >
      {ICONS[icon]}
      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#374151", margin: 0 }}>{title}</h3>
      {description && (
        <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0, maxWidth: 320 }}>{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          style={{
            marginTop: 8,
            padding: "9px 20px",
            background: "#7A0C0C",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
