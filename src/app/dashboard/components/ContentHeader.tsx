import { useState } from "react";
import { Bell, ChevronDown, ChevronLeft, ChevronRight, ClipboardCheck, Edit3, FileText, PackageCheck, UserRound } from "lucide-react";
import type { UserContext } from "../types";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../../components/ui/hover-card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";

interface ContentHeaderProps {
  user: UserContext;
  pageTitle: string;
  pageSubtitle?: string;
  onUpdateProfile: (changes: Pick<UserContext, "name" | "faculty" | "department">) => void;
}

const notifications = [
  { icon: ClipboardCheck, title: "Approval awaiting review", detail: "A procurement request needs your attention.", time: "10 min ago", color: "#2563EB" },
  { icon: FileText, title: "Document received", detail: "A new procurement document was submitted.", time: "1 hour ago", color: "#7C3AED" },
  { icon: PackageCheck, title: "Status updated", detail: "A procurement has moved to its next stage.", time: "Yesterday", color: "#059669" },
];

const buttonStyle = {
  width: 32, height: 32, border: "1px solid #E5E7EB", borderRadius: 8, background: "#FAFAFA", color: "#6B7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" as const,
};

export function ContentHeader({ user, pageTitle, onUpdateProfile }: ContentHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [faculty, setFaculty] = useState(user.faculty ?? "");
  const [department, setDepartment] = useState(user.department ?? "");

  const openEditor = () => {
    setName(user.name);
    setFaculty(user.faculty ?? "");
    setDepartment(user.department ?? "");
    setIsEditing(true);
  };

  const saveProfile = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    onUpdateProfile({ name: trimmedName, faculty: faculty.trim() || undefined, department: department.trim() || undefined });
    setIsEditing(false);
  };

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
            <HoverCardContent align="end" sideOffset={8} style={{ width: 270, padding: 0, overflow: "hidden", border: "1px solid #E5E7EB", borderRadius: 10, background: "#FFFFFF", boxShadow: "0 12px 28px rgba(15, 23, 42, 0.14)", zIndex: 60 }}>
              <div style={{ padding: 16, display: "flex", gap: 11, alignItems: "center" }}><div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, #7A0C0C, #5C0808)", display: "grid", placeItems: "center", fontSize: 13, fontWeight: 800, color: "#F59E0B", flexShrink: 0 }}>{user.avatarInitials}</div><div style={{ minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 750, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div><div style={{ fontSize: 11, color: "#6B7280", marginTop: 3 }}>{user.title}</div></div></div>
              <div style={{ margin: "0 16px", borderTop: "1px solid #F1F5F9" }} />
              <button onClick={openEditor} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "12px 16px", background: "#FFFFFF", border: 0, color: "#374151", fontSize: 12, fontWeight: 650, cursor: "pointer", textAlign: "left" }}><Edit3 size={14} color="#2563EB" /> Edit profile</button>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md" style={{ background: "#FFFFFF", borderColor: "#E5E7EB" }}>
          <DialogHeader><DialogTitle style={{ color: "#111827" }}>Edit profile</DialogTitle><DialogDescription>Update the details shown in your profile menu.</DialogDescription></DialogHeader>
          <form onSubmit={saveProfile}>
            <div style={{ display: "grid", gap: 14, marginTop: 4 }}>
              <ProfileField label="Full name" value={name} onChange={setName} required />
              <div><label style={labelStyle}>Role</label><div style={{ ...inputStyle, background: "#F9FAFB", color: "#6B7280", display: "flex", alignItems: "center" }}><UserRound size={14} style={{ marginRight: 8 }} />{user.title}</div></div>
              <ProfileField label="Faculty" value={faculty} onChange={setFaculty} />
              <ProfileField label="Department" value={department} onChange={setDepartment} />
            </div>
            <DialogFooter style={{ marginTop: 22 }}><button type="button" onClick={() => setIsEditing(false)} style={{ ...formButtonStyle, background: "#FFFFFF", border: "1px solid #D1D5DB", color: "#374151" }}>Cancel</button><button type="submit" style={{ ...formButtonStyle, background: "#7A0C0C", border: "1px solid #7A0C0C", color: "#FFFFFF" }}>Save changes</button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

const labelStyle = { display: "block", marginBottom: 6, fontSize: 12, fontWeight: 650, color: "#374151" };
const inputStyle = { width: "100%", height: 38, borderRadius: 7, border: "1px solid #D1D5DB", padding: "0 10px", fontSize: 13, boxSizing: "border-box" as const };
const formButtonStyle = { borderRadius: 7, padding: "9px 13px", fontSize: 12, fontWeight: 700, cursor: "pointer" };

function ProfileField({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <div><label style={labelStyle}>{label}</label><input required={required} value={value} onChange={event => onChange(event.target.value)} style={inputStyle} /></div>;
}

interface PageTitleBarProps { title: string; subtitle?: string; actions?: React.ReactNode; }
export function PageTitleBar({ title, subtitle, actions }: PageTitleBarProps) {
  return <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}><div><h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: 0, letterSpacing: "-0.02em" }}>{title}</h1>{subtitle && <p style={{ fontSize: 13, color: "#9CA3AF", margin: "4px 0 0" }}>{subtitle}</p>}</div>{actions && <div>{actions}</div>}</div>;
}
