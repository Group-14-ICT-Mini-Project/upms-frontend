import { motion } from "motion/react";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  Users,
  ShieldCheck,
  Settings,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  Plus,
  LogOut,
} from "lucide-react";

interface LecturerDashboardProps {
  onLogout: () => void;
  userName?: string;
}

type NavKey = "dashboard" | "requisitions" | "orders" | "vendors" | "warranties";

const FONT = "'Google Sans Flex', sans-serif";
const NAVY = "#0a1628";
const GOLD = "#F59E0B";
const GOLD_DARK = "#D97706";
const PANEL = "#0d1b3e";

const navItems: { key: NavKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "requisitions", label: "My Requisitions", icon: FileText },
  { key: "orders", label: "Purchase Orders", icon: ShoppingCart },
  { key: "vendors", label: "Vendors", icon: Users },
  { key: "warranties", label: "Warranties", icon: ShieldCheck },
];

const stats = [
  { label: "Active Requests", value: "12", hint: "Unread alerts", accent: GOLD },
  { label: "Drafts", value: "3", hint: "Needs attention", accent: "#93C5FD" },
  { label: "Awaiting Spec Verify", value: "8", hint: "Awaiting approval", accent: "#A78BFA" },
  { label: "Delivered", value: "8", hint: "This quarter", accent: "#10B981" },
];

const recentActivity = [
  { id: "REQ-001", item: "Office Supplies — Box of 50", dept: "Admin", date: "2026-06-01", qty: 5, status: "Pending" },
  { id: "REQ-002", item: "Laptop Dell XPS 15", dept: "IT", date: "2026-05-30", qty: 2, status: "Approved" },
  { id: "REQ-003", item: "Printer Paper A4", dept: "Admin", date: "2026-05-28", qty: 20, status: "Rejected" },
  { id: "REQ-004", item: "Ergonomic Desk Chair", dept: "HR", date: "2026-05-25", qty: 4, status: "Approved" },
  { id: "REQ-005", item: "Network Switch 24-port", dept: "IT", date: "2026-05-22", qty: 1, status: "Pending" },
];

function statusStyles(s: string) {
  switch (s) {
    case "Approved":
      return { color: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.35)" };
    case "Rejected":
      return { color: "#EF4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.35)" };
    default:
      return { color: GOLD, bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.35)" };
  }
}

export function LecturerDashboard({ onLogout, userName = "Tiranga" }: LecturerDashboardProps) {
  const [active, setActive] = useState<NavKey>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div
      className="min-h-screen w-full flex"
      style={{
        background: `linear-gradient(160deg, ${NAVY} 0%, ${NAVY_2} 40%, ${PANEL} 100%)`,
        fontFamily: FONT,
      }}
    >
      {/* Subtle background pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ border: `1px solid ${GOLD}` }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full opacity-[0.04]"
          style={{ border: "1px solid #93C5FD" }}
        />
        <div
          className="absolute top-0 left-0 w-full h-[3px]"
          style={{ background: `linear-gradient(90deg, transparent, ${GOLD} 30%, ${GOLD} 70%, transparent)` }}
        />
      </div>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 flex flex-col py-6 px-4"
        style={{
          background: "rgba(10,22,40,0.55)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})` }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" />
                <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {!collapsed && (
              <div>
                <div className="text-white" style={{ fontWeight: 600, fontSize: "0.95rem" }}>UPMS</div>
                <div className="text-white/40 text-[10px] tracking-[0.15em] uppercase">Lecturer</div>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className="group flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200"
                style={{
                  background: isActive ? "rgba(245,158,11,0.12)" : "transparent",
                  border: `1px solid ${isActive ? "rgba(245,158,11,0.3)" : "transparent"}`,
                  color: isActive ? GOLD : "rgba(255,255,255,0.65)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
              >
                <Icon size={18} strokeWidth={1.8} className="flex-shrink-0" />
                {!collapsed && (
                  <span style={{ fontSize: "0.9rem", fontWeight: isActive ? 600 : 400 }}>
                    {item.label}
                  </span>
                )}
                {isActive && !collapsed && (
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: GOLD }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer nav */}
        <div className="flex flex-col gap-1 mt-4 pt-4 border-t border-white/5">
          <button
            className="flex items-center gap-3 px-3 py-3 rounded-lg transition-all"
            style={{ color: "rgba(255,255,255,0.55)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
          >
            <Settings size={18} strokeWidth={1.8} className="flex-shrink-0" />
            {!collapsed && <span style={{ fontSize: "0.9rem" }}>Settings</span>}
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-3 rounded-lg transition-all"
            style={{ color: "rgba(255,255,255,0.55)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
          >
            <LogOut size={18} strokeWidth={1.8} className="flex-shrink-0" />
            {!collapsed && <span style={{ fontSize: "0.9rem" }}>Sign out</span>}
          </button>
        </div>

        {/* User card */}
        {!collapsed && (
          <div
            className="mt-4 p-3 rounded-lg flex items-center gap-3"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`, fontWeight: 600 }}
            >
              {userName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white truncate" style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                {userName}
              </div>
              <div className="text-white/40 text-xs truncate">Lecturer · FOT</div>
            </div>
          </div>
        )}
      </motion.aside>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="flex items-center gap-4 px-8 py-5 border-b border-white/5">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          <div
            className="flex-1 max-w-xl flex items-center gap-3 px-4 py-2.5 rounded-lg"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Search size={16} className="text-white/40" />
            <input
              placeholder="Search requests, vendors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-white placeholder:text-white/35"
              style={{ fontSize: "0.9rem" }}
            />
            <kbd
              className="px-2 py-0.5 rounded text-[10px] text-white/40"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              ⌘K
            </kbd>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button
              className="relative w-10 h-10 rounded-lg flex items-center justify-center transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              <Bell size={17} strokeWidth={1.8} />
              <span
                className="absolute top-2 right-2.5 w-2 h-2 rounded-full"
                style={{ background: GOLD, boxShadow: `0 0 0 2px ${NAVY}` }}
              />
            </button>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white cursor-pointer"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`, fontWeight: 600 }}
            >
              {userName.charAt(0)}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto px-8 py-8">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="inline-block w-8 h-[2px]"
                style={{ background: GOLD }}
              />
              <span className="text-white/40 text-xs tracking-[0.18em] uppercase">
                Lecturer · Procurement Workspace
              </span>
            </div>
            <h1
              className="text-white"
              style={{
                fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              Good Morning,{" "}
              <span style={{ color: GOLD }}>{userName}</span>
            </h1>
            <p className="text-white/45 mt-2" style={{ fontSize: "0.95rem", fontWeight: 300 }}>
              Here's what's happening with your requisitions today.
            </p>
          </motion.div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * i }}
                className="relative p-5 rounded-xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  className="absolute top-0 left-0 w-1 h-full"
                  style={{ background: s.accent }}
                />
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{
                    background: `${s.accent}1f`,
                    border: `1px solid ${s.accent}55`,
                  }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ background: s.accent }} />
                </div>
                <div
                  className="text-white mb-1"
                  style={{ fontSize: "1.9rem", fontWeight: 600, letterSpacing: "-0.02em" }}
                >
                  {s.value}
                </div>
                <div className="text-white/75" style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                  {s.label}
                </div>
                <div className="text-white/35 mt-1" style={{ fontSize: "0.75rem" }}>
                  {s.hint}
                </div>
              </motion.div>
            ))}
          </div>

          {/* New Request CTA */}
          <motion.button
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="group w-full sm:w-auto flex items-center gap-6 px-6 py-5 rounded-xl mb-8 transition-all"
            style={{
              background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.04))",
              border: "1px solid rgba(245,158,11,0.35)",
              minWidth: "360px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = GOLD;
              (e.currentTarget as HTMLButtonElement).style.background =
                "linear-gradient(135deg, rgba(245,158,11,0.18), rgba(245,158,11,0.08))";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(245,158,11,0.35)";
              (e.currentTarget as HTMLButtonElement).style.background =
                "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.04))";
            }}
          >
            <div className="text-left">
              <div className="text-white" style={{ fontWeight: 600, fontSize: "1.05rem" }}>
                New Request
              </div>
              <div className="text-white/50" style={{ fontSize: "0.82rem" }}>
                Start a new requisition
              </div>
            </div>
            <div
              className="ml-auto w-11 h-11 rounded-lg flex items-center justify-center transition-transform group-hover:rotate-90"
              style={{
                background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                color: NAVY,
                boxShadow: "0 6px 20px rgba(245,158,11,0.35)",
              }}
            >
              <Plus size={20} strokeWidth={2.5} />
            </div>
          </motion.button>

          {/* Recent Activity */}
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div>
                <h2 className="text-white" style={{ fontSize: "1rem", fontWeight: 600 }}>
                  Recent Activity
                </h2>
                <p className="text-white/40" style={{ fontSize: "0.78rem" }}>
                  Your latest requisitions
                </p>
              </div>
              <button
                className="px-4 py-2 rounded-lg text-white/70 transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: "0.8rem",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = GOLD;
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(245,158,11,0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
                }}
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                    {["Req. ID", "Item Description", "Dept", "Date", "Qty", "Status"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-6 py-3 text-white/45 tracking-wider uppercase"
                        style={{ fontSize: "0.7rem", fontWeight: 500 }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((row, i) => {
                    const ss = statusStyles(row.status);
                    return (
                      <tr
                        key={row.id}
                        className="transition-colors"
                        style={{
                          borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.04)",
                        }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLTableRowElement).style.background = "rgba(255,255,255,0.025)")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")
                        }
                      >
                        <td
                          className="px-6 py-4 text-white/80"
                          style={{ fontSize: "0.82rem", fontFamily: "ui-monospace, monospace" }}
                        >
                          {row.id}
                        </td>
                        <td className="px-6 py-4 text-white/85" style={{ fontSize: "0.88rem" }}>
                          {row.item}
                        </td>
                        <td className="px-6 py-4 text-white/60" style={{ fontSize: "0.85rem" }}>
                          {row.dept}
                        </td>
                        <td
                          className="px-6 py-4 text-white/50"
                          style={{ fontSize: "0.82rem", fontFamily: "ui-monospace, monospace" }}
                        >
                          {row.date}
                        </td>
                        <td className="px-6 py-4 text-white/80" style={{ fontSize: "0.85rem" }}>
                          {row.qty}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                            style={{
                              background: ss.bg,
                              border: `1px solid ${ss.border}`,
                              color: ss.color,
                              fontSize: "0.72rem",
                              fontWeight: 500,
                            }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: ss.color }} />
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.section>

          {/* Footer hint */}
          <p
            className="text-white/25 text-xs mt-8 text-center"
            style={{ letterSpacing: "0.05em" }}
          >
            University of Sri Jayewardenepura · Procurement Management System
          </p>
        </div>
      </main>
    </div>
  );
}
