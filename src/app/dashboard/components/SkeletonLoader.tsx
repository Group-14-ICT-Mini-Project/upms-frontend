/**
 * SkeletonLoader.tsx
 * Shimmer skeleton components for dashboard loading states.
 * Each skeleton mirrors the exact shape/layout of the real component it replaces.
 */

import React from "react";

// ─── Inject shimmer keyframe once ────────────────────────────────────────────
const STYLE_ID = "upms-skeleton-styles";
if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes upms-shimmer {
      0%   { background-position: -600px 0; }
      100% { background-position:  600px 0; }
    }
    .upms-skel {
      background: linear-gradient(
        90deg,
        #F3F4F6 25%,
        #E5E7EB 50%,
        #F3F4F6 75%
      );
      background-size: 1200px 100%;
      animation: upms-shimmer 1.6s ease-in-out infinite;
      border-radius: 8px;
    }
  `;
  document.head.appendChild(style);
}

// ─── Primitive block ──────────────────────────────────────────────────────────
interface BlockProps {
  width?: string | number;
  height?: string | number;
  radius?: number;
  style?: React.CSSProperties;
}

export function SkeletonBlock({ width = "100%", height = 16, radius = 8, style }: BlockProps) {
  return (
    <div
      className="upms-skel"
      style={{ width, height, borderRadius: radius, flexShrink: 0, ...style }}
    />
  );
}

// ─── Welcome Banner skeleton ──────────────────────────────────────────────────
export function SkeletonWelcomeBanner() {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 14,
        padding: "20px 24px",
        marginBottom: 24,
        border: "1px solid #F1F5F9",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <SkeletonBlock width="38%" height={22} radius={6} />
      <SkeletonBlock width="55%" height={14} radius={6} />
    </div>
  );
}

// ─── Stat card row skeleton (4 cards) ────────────────────────────────────────
export function SkeletonStatCardRow() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        marginBottom: 24,
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            background: "#FFFFFF",
            borderRadius: 14,
            padding: "18px 20px",
            border: "1px solid #F1F5F9",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <SkeletonBlock width={36} height={36} radius={10} />
            <SkeletonBlock width={20} height={20} radius={6} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <SkeletonBlock width="60%" height={28} radius={6} />
            <SkeletonBlock width="80%" height={13} radius={6} />
          </div>
          <SkeletonBlock width="50%" height={13} radius={6} />
        </div>
      ))}
    </div>
  );
}

// ─── Action queue skeleton (3 items) ─────────────────────────────────────────
export function SkeletonActionQueue() {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 14,
        border: "1px solid #F1F5F9",
        overflow: "hidden",
        marginBottom: 24,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 20px",
          borderBottom: "1px solid #F3F4F6",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SkeletonBlock width="30%" height={16} radius={6} />
        <SkeletonBlock width={60} height={14} radius={6} />
      </div>
      {/* Rows */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            padding: "14px 20px",
            borderBottom: i < 2 ? "1px solid #F9FAFB" : "none",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <SkeletonBlock width={36} height={36} radius={10} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            <SkeletonBlock width="70%" height={13} radius={6} />
            <SkeletonBlock width="40%" height={11} radius={6} />
          </div>
          <SkeletonBlock width={64} height={24} radius={20} />
        </div>
      ))}
    </div>
  );
}

// ─── Table skeleton (header + 5 rows) ────────────────────────────────────────
export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 14,
        border: "1px solid #F1F5F9",
        overflow: "hidden",
        marginBottom: 24,
      }}
    >
      {/* Table header bar */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #F3F4F6",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <SkeletonBlock width={160} height={16} radius={6} />
          <SkeletonBlock width={100} height={12} radius={6} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <SkeletonBlock width={90} height={32} radius={8} />
          <SkeletonBlock width={70} height={32} radius={8} />
        </div>
      </div>
      {/* Column header row */}
      <div
        style={{
          background: "#FAFAFA",
          padding: "10px 20px",
          display: "flex",
          gap: 40,
          borderBottom: "1px solid #F3F4F6",
        }}
      >
        {[16, 24, 12, 10, 12, 10].map((w, i) => (
          <SkeletonBlock key={i} width={`${w}%`} height={11} radius={4} />
        ))}
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            padding: "13px 20px",
            borderBottom: i < rows - 1 ? "1px solid #F9FAFB" : "none",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <SkeletonBlock width={14} height={14} radius={3} style={{ flexShrink: 0 }} />
          {/* Avatar + title */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, width: "22%" }}>
            <SkeletonBlock width={32} height={32} radius={8} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <SkeletonBlock width="80%" height={13} radius={5} />
              <SkeletonBlock width="50%" height={11} radius={5} />
            </div>
          </div>
          <SkeletonBlock width="12%" height={13} radius={5} />
          <SkeletonBlock width="12%" height={13} radius={5} />
          <SkeletonBlock width="12%" height={13} radius={5} />
          <SkeletonBlock width={60} height={22} radius={20} />
          <SkeletonBlock width={18} height={18} radius={5} />
        </div>
      ))}
    </div>
  );
}

// ─── Budget banner skeleton (Finance dashboard) ───────────────────────────────
export function SkeletonBudgetBanner() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #D1D5DB 0%, #E5E7EB 100%)",
        borderRadius: 16,
        padding: "24px 28px",
        marginBottom: 24,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <SkeletonBlock width={220} height={14} radius={6} style={{ background: "rgba(255,255,255,0.5)" }} />
          <SkeletonBlock width={160} height={28} radius={6} style={{ background: "rgba(255,255,255,0.5)" }} />
        </div>
        <SkeletonBlock width={100} height={32} radius={10} style={{ background: "rgba(255,255,255,0.4)" }} />
      </div>
      <SkeletonBlock width="100%" height={10} radius={8} style={{ marginBottom: 18, background: "rgba(255,255,255,0.35)" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ background: "rgba(255,255,255,0.2)", borderRadius: 12, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            <SkeletonBlock width="60%" height={12} radius={5} style={{ background: "rgba(255,255,255,0.4)" }} />
            <SkeletonBlock width="80%" height={20} radius={5} style={{ background: "rgba(255,255,255,0.4)" }} />
            <SkeletonBlock width="50%" height={12} radius={5} style={{ background: "rgba(255,255,255,0.4)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Mini stat tiles skeleton (SDC quick stats) ───────────────────────────────
export function SkeletonMiniStatTiles({ count = 3 }: { count?: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${count}, 1fr)`,
        gap: 14,
        marginTop: 4,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: 8,
            padding: "16px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <SkeletonBlock width="35%" height={26} radius={6} />
          <SkeletonBlock width="70%" height={13} radius={6} />
        </div>
      ))}
    </div>
  );
}

// ─── Open tenders list skeleton (Supplier dashboard) ─────────────────────────
export function SkeletonTenderList({ rows = 3 }: { rows?: number }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <SkeletonBlock width={120} height={16} radius={6} />
        <SkeletonBlock width={90} height={32} radius={8} />
      </div>
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 20px",
              borderTop: i > 0 ? "1px solid #F3F4F6" : "none",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <SkeletonBlock width={90} height={12} radius={5} />
              <SkeletonBlock width={220} height={14} radius={5} />
              <SkeletonBlock width={140} height={11} radius={5} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <SkeletonBlock width={90} height={16} radius={5} />
              <SkeletonBlock width={70} height={24} radius={20} />
              <SkeletonBlock width={60} height={30} radius={7} />
              <SkeletonBlock width={46} height={30} radius={7} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Responsibilities card skeleton (TEC / TB dashboards) ─────────────────────
export function SkeletonResponsibilitiesCard() {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: 10,
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <SkeletonBlock width="40%" height={14} radius={6} />
      {[0, 1, 2, 3].map(i => (
        <SkeletonBlock key={i} width={`${70 + (i % 3) * 10}%`} height={12} radius={5} />
      ))}
    </div>
  );
}
