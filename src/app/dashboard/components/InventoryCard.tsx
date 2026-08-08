import { Search, Package } from "lucide-react";
import { useState } from "react";

interface InventoryItem {
  name: string;
  quantity: number;
  unit: string;
  lastUpdated: string;
  location?: string;
}

interface InventoryCardProps {
  items: InventoryItem[];
  onSelect?: (item: InventoryItem) => void;
}

export function InventoryCard({ items, onSelect }: InventoryCardProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20 }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 2 }}>
          Central Stock Levels
        </h3>
        <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
          Real-time inventory from Supply Division
        </p>
      </div>

      {/* Search */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 14,
        padding: "8px 12px",
        background: "#F9FAFB",
        border: "1px solid #E5E7EB",
        borderRadius: 8,
      }}>
        <Search size={14} style={{ color: "#9CA3AF", flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search by item or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            border: "none",
            background: "transparent",
            fontSize: 12,
            outline: "none",
            color: "#111827",
          }}
        />
      </div>

      {/* Items list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 320, overflowY: "auto" }}>
        {filtered.length > 0 ? (
          filtered.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onSelect?.(item)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 12,
                background: "#F9FAFB",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "#EFF6FF";
                (e.currentTarget as HTMLDivElement).style.borderColor = "#BFDBFE";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "#F9FAFB";
                (e.currentTarget as HTMLDivElement).style.borderColor = "#E5E7EB";
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", marginBottom: 2 }}>
                  {item.name}
                </div>
                <div style={{ fontSize: 11, color: "#6B7280" }}>
                  {item.location ? `${item.location} • ` : ""}
                  Last updated: {new Date(item.lastUpdated).toLocaleDateString()}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#15803D", marginBottom: 2 }}>
                  {item.quantity}
                </div>
                <div style={{ fontSize: 10, color: "#6B7280" }}>{item.unit}</div>
              </div>
            </div>
          ))
        ) : (
          <div style={{
            textAlign: "center",
            padding: 24,
            color: "#9CA3AF",
          }}>
            <Package size={24} style={{ marginBottom: 8, opacity: 0.5 }} />
            <p style={{ fontSize: 12, margin: 0 }}>No items match your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
