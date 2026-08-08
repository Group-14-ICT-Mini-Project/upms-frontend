import { useState } from "react";
import type { Procurement } from "../types";
import { StatusBadge } from "./StatusBadge";
import { formatLKR } from "../data";


interface ProcurementTableProps {
  procurements: Procurement[];
  title?: string;
  subtitle?: string;
  onRowClick?: (pr: Procurement) => void;
  onViewProcurement?: (id: string) => void;
  showMethod?: boolean;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ProcurementTable({
  procurements,
  title = "Procurements",
  subtitle,
  onRowClick,
  onViewProcurement,
  showMethod = true,
}: ProcurementTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  return (
    <section
      style={{
        background: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      {/* Table header */}
      <div
        style={{
          padding: "16px 20px 12px",
          borderBottom: "1px solid #F3F4F6",
        }}
      >
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0, marginBottom: 2 }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>{subtitle}</p>
        )}
      </div>

      {/* Scrollable table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["ID", "Title", "Faculty", "Value", ...(showMethod ? ["Method"] : []), "Status", "Updated", ""].map(h => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "10px 16px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#9CA3AF",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #F3F4F6",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {procurements.map((pr) => (
              <tr
                key={pr.id}
                onClick={() => onRowClick?.(pr)}
                style={{
                  borderBottom: "1px solid #F3F4F6",
                  background: hoveredRow === pr.id ? "#F9FAFB" : "transparent",
                  cursor: onRowClick ? "pointer" : "default",
                  transition: "background 0.1s",
                }}
                onMouseEnter={() => setHoveredRow(pr.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {/* ID */}
                <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#2563EB",
                      fontFamily: "monospace",
                    }}
                  >
                    {pr.id}
                  </span>
                </td>

                {/* Title */}
                <td
                  style={{
                    padding: "13px 16px",
                    maxWidth: 260,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ fontSize: 13, color: "#111827", fontWeight: 500 }}>
                    {pr.title}
                  </span>
                </td>

                {/* Faculty */}
                <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: 12, color: "#6B7280" }}>{pr.faculty}</span>
                </td>

                {/* Value */}
                <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#B45309" }}>
                    {formatLKR(pr.value)}
                  </span>
                </td>

                {/* Method */}
                {showMethod && (
                  <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                    <span style={{ fontSize: 12, color: "#6B7280" }}>{pr.method}</span>
                  </td>
                )}

                {/* Status */}
                <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                  <StatusBadge status={pr.status} />
                </td>

                {/* Updated */}
                <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                    {formatDate(pr.updatedAt)}
                  </span>
                </td>

                {/* View action */}
                <td style={{ padding: "13px 16px 13px 8px", whiteSpace: "nowrap" }}>
                  {onViewProcurement && (
                    <button
                      onClick={e => { e.stopPropagation(); onViewProcurement(pr.id); }}
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "5px 12px",
                        background: "#F3F4F6",
                        color: "#374151",
                        border: "1px solid #E5E7EB",
                        borderRadius: 7,
                        cursor: "pointer",
                        transition: "all 0.15s",
                        letterSpacing: "0.02em",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = "#7A0C0C";
                        (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                        (e.currentTarget as HTMLElement).style.borderColor = "#7A0C0C";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = "#F3F4F6";
                        (e.currentTarget as HTMLElement).style.color = "#374151";
                        (e.currentTarget as HTMLElement).style.borderColor = "#E5E7EB";
                      }}
                    >
                      View Status
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "10px 20px",
          borderTop: "1px solid #F3F4F6",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 12, color: "#9CA3AF" }}>
          {procurements.length} record{procurements.length !== 1 ? "s" : ""} visible for your role
        </span>
      </div>
    </section>
  );
}
