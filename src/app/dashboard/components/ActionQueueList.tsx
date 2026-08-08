import type { Procurement } from "../types";
import { StatusBadge } from "./StatusBadge";
import { formatLKR } from "../data";


interface ActionQueueListProps {
  items: Procurement[];
  onViewAll?: () => void;
  onItemClick?: (pr: Procurement) => void;
}

export function ActionQueueList({ items, onViewAll, onItemClick }: ActionQueueListProps) {
  return (
    <section style={{ marginBottom: 28 }}>
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <h2
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#111827",
            margin: 0,
          }}
        >
          Your action queue
        </h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#7A0C0C",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
            onMouseEnter={e => ((e.target as HTMLElement).style.color = "#F59E0B")}
            onMouseLeave={e => ((e.target as HTMLElement).style.color = "#7A0C0C")}
          >
            View all →
          </button>
        )}
      </div>

      {/* Item list */}
      {items.length === 0 ? (
        <div
          style={{
            padding: "24px",
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: 8,
            textAlign: "center",
            color: "#9CA3AF",
            fontSize: 13,
          }}
        >
          No items in your queue right now.
        </div>
      ) : (
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          {items.map((pr, idx) => (
            <div
              key={pr.id}
              onClick={() => onItemClick?.(pr)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 20px",
                borderTop: idx === 0 ? "none" : "1px solid #F3F4F6",
                cursor: onItemClick ? "pointer" : "default",
                transition: "background 0.12s",
              }}
              onMouseEnter={e => {
                if (onItemClick) (e.currentTarget as HTMLDivElement).style.background = "#FAFAFA";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = "transparent";
              }}
            >
              {/* Left: title + subtitle */}
              <div style={{ flex: 1, minWidth: 0, marginRight: 16 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#111827",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {pr.title}
                </div>
                <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>
                  <span style={{ color: "#2563EB", fontWeight: 600 }}>{pr.id}</span>
                  {" · "}
                  {pr.faculty}
                </div>
              </div>

              {/* Right: amount + status */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#B45309",
                  }}
                >
                  {formatLKR(pr.value)}
                </span>
                <StatusBadge status={pr.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
