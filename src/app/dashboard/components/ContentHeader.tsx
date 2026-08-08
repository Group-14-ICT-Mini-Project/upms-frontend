import { Bell, ChevronDown, ChevronLeft, ChevronRight, ClipboardCheck, FileText, PackageCheck } from "lucide-react";
import type { UserContext } from "../types";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../../components/ui/hover-card";

interface ContentHeaderProps {
  user: UserContext;
  pageTitle: string;
  pageSubtitle?: string;
}

const notifications = [
  { icon: ClipboardCheck, title: "Approval awaiting review", detail: "A procurement request needs your attention.", time: "10 min ago", color: "#2563EB" },
  { icon: FileText, title: "Document received", detail: "A new procurement document was submitted.", time: "1 hour ago", color: "#7C3AED" },
  { icon: PackageCheck, title: "Status updated", detail: "A procurement has moved to its next stage.", time: "Yesterday", color: "#059669" },
];

const buttonStyle = {
  width: 32, height: 32, border: "1px solid #E5E7EB", borderRadius: 8, background: "#FAFAFA", color: "#6B7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" as const,
};

export function ContentHeader({ user, pageTitle }: ContentHeaderProps) {
  return (
    <>
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #F1F5F9", padding: "0 28px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ display: "flex", gap: 6, marginRight: 8 }}>
            <button aria-label="Go back" style={buttonStyle}><ChevronLeft size={14} strokeWidth={2.6} /></button>
            <button aria-label="Go forward" disabled style={{ ...buttonStyle, color: "#D1D5DB", cursor: "not-allowed", opacity: 0.6 }}><ChevronRight size={14} strokeWidth={2.6} /></button>
          </div>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>UPMS</span><span style={{ fontSize: 12, color: "#D1D5DB" }}>›</span><span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{pageTitle}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <HoverCard openDelay={120} closeDelay={160}>
            <HoverCardTrigger asChild>
              <button aria-label="View notifications" style={buttonStyle}>
                <Bell size={14} />
                <span style={{ position: "absolute", top: 6, right: 6, width: 6, height: 6, borderRadius: "50%", background: "#EF4444", border: "1.5px solid white" }} />
              </button>
            </HoverCardTrigger>
            <HoverCardContent align="end" sideOffset={8} style={{ width: 340, padding: 0, overflow: "hidden", border: "1px solid #E5E7EB", borderRadius: 10, background: "#FFFFFF", boxShadow: "0 12px 28px rgba(15, 23, 42, 0.14)", zIndex: 60 }}>
              <div style={{ padding: "13px 14px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}><strong style={{ fontSize: 13, color: "#111827" }}>Notifications</strong><span style={{ fontSize: 11, color: "#2563EB", fontWeight: 700 }}>3 new</span></div>
              {notifications.map(({ icon: Icon, title, detail, time, color }) => <div key={title} style={{ display: "flex", gap: 10, padding: "12px 14px", borderBottom: "1px solid #F8FAFC" }}><div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}12`, display: "grid", placeItems: "center", flexShrink: 0 }}><Icon size={14} color={color} /></div><div style={{ minWidth: 0 }}><div style={{ fontSize: 12, color: "#374151", fontWeight: 650 }}>{title}</div><div style={{ fontSize: 11, color: "#6B7280", marginTop: 2, lineHeight: 1.35 }}>{detail}</div><div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4 }}>{time}</div></div></div>)}
              <button style={{ width: "100%", border: 0, background: "#FFFFFF", padding: "11px", fontSize: 11, fontWeight: 700, color: "#2563EB", cursor: "pointer" }}>View all notifications</button>
            </HoverCardContent>
          </HoverCard>

          <HoverCard openDelay={120} closeDelay={180}>
            <HoverCardTrigger asChild>
              <button aria-label="View profile" style={{ border: 0, background: "transparent", padding: 0, display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #7A0C0C, #5C0808)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#F59E0B" }}>{user.avatarInitials}</div><ChevronDown size={12} color="#9CA3AF" />
              </button>
            </HoverCardTrigger>
            <HoverCardContent align="end" sideOffset={8} style={{ width: 280, padding: 16, border: "1px solid #E5E7EB", borderRadius: 10, background: "#FFFFFF", boxShadow: "0 12px 28px rgba(15, 23, 42, 0.14)", zIndex: 60 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #7A0C0C, #5C0808)", display: "grid", placeItems: "center", fontSize: 14, fontWeight: 800, color: "#F59E0B", flexShrink: 0 }}>{user.avatarInitials}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 750, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
                  <div style={{ fontSize: 12, color: "#4B5563", marginTop: 5 }}>{user.title}</div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>

    </>
  );
}

interface PageTitleBarProps { title: string; subtitle?: string; actions?: React.ReactNode; }
export function PageTitleBar({ title, subtitle, actions }: PageTitleBarProps) {
  return <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}><div><h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: 0, letterSpacing: "-0.02em" }}>{title}</h1>{subtitle && <p style={{ fontSize: 13, color: "#9CA3AF", margin: "4px 0 0" }}>{subtitle}</p>}</div>{actions && <div>{actions}</div>}</div>;
}
