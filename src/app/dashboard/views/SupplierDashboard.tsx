import { useState } from "react";
import type { UserContext } from "../types";
import { WelcomeBanner } from "../components/WelcomeBanner";
import { StatCardRow } from "../components/StatCard";
import { ProcurementTable } from "../components/ProcurementTable";
import { StatusBadge } from "../components/StatusBadge";
import { MOCK_PROCUREMENTS, getProcurementsForRole, formatLKR } from "../data";


interface SupplierDashboardProps {
  user: UserContext;
  activeTab: string;
  onTabChange: (key: string) => void;
  onViewProcurement: (id: string) => void;
}

const myBids = [
  { prId: "PR-2026-003", title: "Network Switches — Faculty IT Upgrade", amount: 1180000, submitted: "2026-01-28", status: "Under Evaluation" },
  { prId: "PR-2026-004", title: "Auditorium AV System — Management Faculty", amount: 4250000, submitted: "2026-07-01", status: "Submitted" },
];

export function SupplierDashboard({ user, activeTab, onTabChange, onViewProcurement }: SupplierDashboardProps) {
  if (activeTab === "my-bids")    return <MyBidsPanel />;
  if (activeTab === "submit-bid") return <SubmitBidPanel onSuccess={() => onTabChange("my-bids")} />;
  return <SupplierOverview user={user} onTabChange={onTabChange} onViewProcurement={onViewProcurement} />;
}

function SupplierOverview({ user, onTabChange, onViewProcurement }: { user: UserContext; onTabChange: (k: string) => void; onViewProcurement: (id: string) => void }) {
  const openTenders = getProcurementsForRole(user);
  return (
    <div style={{ padding: "28px 32px" }}>
      <WelcomeBanner user={user} />
      <StatCardRow total={openTenders.length} inQueue={myBids.length} actionRequired={openTenders.length} completed={0} />

      {/* Open tenders */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>Open Tenders</h2>
          <button onClick={() => onTabChange("submit-bid")} style={{ padding: "7px 16px", background: "#7A0C0C", color: "#FFFFFF", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            + Submit Bid
          </button>
        </div>
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
          {openTenders.map((pr, i) => (
            <div key={pr.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderTop: i > 0 ? "1px solid #F3F4F6" : "none" }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", fontFamily: "monospace" }}>{pr.id}</span>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginTop: 2 }}>{pr.title}</div>
                <div style={{ fontSize: 11, color: "#6B7280", marginTop: 1 }}>{pr.faculty}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#B45309" }}>{formatLKR(pr.value)}</span>
                <StatusBadge status={pr.status} />
                <button onClick={() => onViewProcurement(pr.id)} style={{ padding: "6px 14px", background: "#F3F4F6", color: "#374151", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#7A0C0C"; (e.currentTarget as HTMLElement).style.color = "#FFF"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#F3F4F6"; (e.currentTarget as HTMLElement).style.color = "#374151"; }}
                >
                  View Status
                </button>
                <button onClick={() => onTabChange("submit-bid")} style={{ padding: "6px 14px", background: "#F59E0B", color: "#111827", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  Bid
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MyBidsPanel() {
  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0, marginBottom: 2 }}>My Bids</h1>
        <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>Track your submitted bid status</p>
      </div>
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 10, overflow: "hidden" }}>
        {myBids.map((b, i) => (
          <div key={b.prId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderTop: i > 0 ? "1px solid #F3F4F6" : "none" }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", fontFamily: "monospace" }}>{b.prId}</span>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginTop: 2 }}>{b.title}</div>
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 1 }}>Submitted: {b.submitted}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#B45309" }}>{formatLKR(b.amount)}</span>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                background: b.status === "Submitted" ? "#EFF6FF" : "#F5F3FF",
                color: b.status === "Submitted" ? "#1D4ED8" : "#6D28D9",
                border: `1px solid ${b.status === "Submitted" ? "#BFDBFE" : "#DDD6FE"}`,
              }}>
                {b.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubmitBidPanel({ onSuccess }: { onSuccess: () => void }) {
  const openTenders = getProcurementsForRole("SUP");
  const [form, setForm] = useState({ prId: "", amount: "", bidBond: false, vatDeclaration: false, technicalSpec: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(onSuccess, 1500);
  };

  if (submitted) {
    return (
      <div style={{ padding: "28px 32px" }}>
        <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "32px", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#15803D", margin: 0, marginBottom: 4 }}>Bid Submitted Successfully</h3>
          <p style={{ fontSize: 13, color: "#4B5563", margin: 0 }}>Your sealed bid has been recorded. You will be notified of the outcome.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "28px 32px", maxWidth: 680 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0, marginBottom: 2 }}>Submit Bid</h1>
        <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>Submit your sealed bid with required documents</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 10, padding: "24px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Select Tender <span style={{ color: "#EF4444" }}>*</span></label>
            <select required value={form.prId} onChange={e => setForm(p => ({ ...p, prId: e.target.value }))} style={inputStyle}>
              <option value="">Choose a tender…</option>
              {openTenders.map(t => <option key={t.id} value={t.id}>{t.id} — {t.title}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Bid Amount (LKR) <span style={{ color: "#EF4444" }}>*</span></label>
            <input required type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="e.g. 1180000" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Technical Specifications</label>
            <textarea rows={3} value={form.technicalSpec} onChange={e => setForm(p => ({ ...p, technicalSpec: e.target.value }))} placeholder="Describe technical specs of your offering…" style={{ ...inputStyle, resize: "vertical" as const }} />
          </div>
          {/* Checkboxes */}
          {[["bidBond", "I have attached the required Bid Bond"], ["vatDeclaration", "I confirm VAT Declaration is enclosed"]].map(([key, label]) => (
            <label key={key} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <input type="checkbox" checked={form[key as "bidBond" | "vatDeclaration"]} onChange={e => setForm(p => ({ ...p, [key]: e.target.checked }))} />
              <span style={{ fontSize: 13, color: "#374151" }}>{label}</span>
            </label>
          ))}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 4 }}>
            <button type="button" onClick={onSuccess} style={{ padding: "9px 20px", background: "#F3F4F6", color: "#374151", border: "1px solid #E5E7EB", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
            <button type="submit" disabled={!form.prId || !form.amount || !form.bidBond || !form.vatDeclaration} style={{ padding: "9px 24px", background: !form.prId || !form.amount || !form.bidBond || !form.vatDeclaration ? "#D1D5DB" : "#7A0C0C", color: "#FFFFFF", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              Submit Sealed Bid
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "1px solid #D1D5DB", borderRadius: 7, fontSize: 13, color: "#111827", background: "#FFFFFF", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
