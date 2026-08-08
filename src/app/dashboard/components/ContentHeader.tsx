import { Bell, Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { UserContext } from "../types";


interface ContentHeaderProps {
  user: UserContext;
  pageTitle: string;
  pageSubtitle?: string;
}

export function ContentHeader({ user, pageTitle, pageSubtitle }: ContentHeaderProps) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderBottom: "1px solid #F1F5F9",
        padding: "0 28px",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Left: breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {/* Back/forward */}
        <div style={{ display: "flex", gap: 6, marginRight: 8 }}>
          <button
            style={{
              width: 28,
              height: 28,
              border: "1px solid #E5E7EB",
              borderRadius: 6,
              background: "#FAFAFA",
              color: "#374151",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.1s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "#F3F4F6";
              (e.currentTarget as HTMLElement).style.color = "#111827";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "#FAFAFA";
              (e.currentTarget as HTMLElement).style.color = "#374151";
            }}
          >
            <ChevronLeft size={14} strokeWidth={2.6} />
          </button>
          <button
            disabled
            style={{
              width: 28,
              height: 28,
              border: "1px solid #E5E7EB",
              borderRadius: 6,
              background: "#FAFAFA",
              color: "#D1D5DB",
              cursor: "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.6,
            }}
          >
            <ChevronRight size={14} strokeWidth={2.6} />
          </button>
        </div>

        {/* Breadcrumb */}
        <span style={{ fontSize: 12, color: "#9CA3AF" }}>UPMS</span>
        <span style={{ fontSize: 12, color: "#D1D5DB" }}>›</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{pageTitle}</span>
      </div>

      {/* Right: bell + avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Bell */}
        <button
          style={{
            width: 32,
            height: 32,
            border: "1px solid #E5E7EB",
            borderRadius: 8,
            background: "#FAFAFA",
            color: "#6B7280",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Bell size={14} />
          <span
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#EF4444",
              border: "1.5px solid white",
            }}
          />
        </button>

        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7A0C0C, #5C0808)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 800,
              color: "#F59E0B",
            }}
          >
            {user.avatarInitials}
          </div>
          <ChevronDown size={12} color="#9CA3AF" />
        </div>
      </div>
    </div>
  );
}


interface PageTitleBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageTitleBar({ title, subtitle, actions }: PageTitleBarProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 24,
      }}
    >
      <div>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#111827",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 13, color: "#9CA3AF", margin: "4px 0 0" }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
}
