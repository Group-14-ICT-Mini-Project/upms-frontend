import { useState } from "react";
import type { UserContext } from "../types";
import { WelcomeBanner } from "../components/WelcomeBanner";
import { StatCardRow } from "../components/StatCard";
import { ActionQueueList } from "../components/ActionQueueList";
import { ProcurementTable } from "../components/ProcurementTable";
import { MOCK_PROCUREMENTS, getActionQueueForRole, getProcurementsForRole, formatLKR } from "../data";


interface StorekeeperDashboardProps {
  user: UserContext;
  activeTab: string;
  onTabChange: (key: string) => void;
  onViewProcurement: (id: string) => void;
  onViewProcurementDetails: (id: string) => void;
}

export function StorekeeperDashboard({ user, activeTab, onTabChange, onViewProcurement, onViewProcurementDetails }: StorekeeperDashboardProps) {
  if (activeTab === "grn")          return <GRNPanel onViewProcurementDetails={onViewProcurementDetails} user={user} />;
  if (activeTab === "procurements") return <AllProcurementsPanel onViewProcurement={onViewProcurement} user={user} />;
  return <STKOverview user={user} onTabChange={onTabChange} />;
}

function STKOverview({ user, onTabChange }: { user: UserContext; onTabChange: (k: string) => void }) {
  const queue = getActionQueueForRole(user);
  const myProcurements = getProcurementsForRole(user);
  return (
    <div style={{ padding: "28px 32px" }}>
      <WelcomeBanner user={user} />
      <StatCardRow total={myProcurements.length} inQueue={queue.length} actionRequired={queue.length} completed={2} />
      <ActionQueueList items={queue} onViewAll={() => onTabChange("grn")} onItemClick={() => onTabChange("grn")} />
    </div>
  );
}

function GRNPanel({ onViewProcurementDetails, user }: { onViewProcurementDetails: (id: string) => void; user: UserContext }) {
  const myProcurements = getProcurementsForRole(user);
  const deliveries = myProcurements.filter(p => p.status === "Awaiting Delivery");
  const [issued, setIssued] = useState<Set<string>>(new Set());
  const [grns, setGrns] = useState<Record<string, { qty: string; condition: string; note: string }>>({});
  const [form, setForm] = useState<Record<string, { qty: string; condition: string; note: string }>>({});

  const handleIssue = (id: string) => {
    const pr = MOCK_PROCUREMENTS.find(p => p.id === id);
    if (pr) {
      const f = form[id] ?? { qty: "", condition: "Good", note: "" };
      pr.status = "Quality Report Required";
      pr.grnNumber = `GRN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      pr.updatedAt = new Date().toISOString();
      pr.activityLogs = [
        {
          id: `log-stk-${Date.now()}`,
          stepIndex: 7,
          actor: user.name ?? "Saman Rathnayake",
          role: "Storekeeper",
          action: `Goods received and inspected. Qty: ${f.qty}, Condition: ${f.condition}. ${f.note ? "Notes: " + f.note : ""}. GRN ${pr.grnNumber} issued.`,
          timestamp: new Date().toISOString(),
        },
        ...(pr.activityLogs ?? []),
      ];
    }
    setIssued(p => new Set([...p, id]));
    setGrns(p => ({ ...p, [id]: form[id] ?? { qty: "", condition: "Good", note: "" } }));
  };

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0, marginBottom: 2 }}>Goods Received Notes (GRN)</h1>
        <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>Generate GRN upon physical receipt and inspection of goods</p>
      </div>

      {deliveries.length === 0 ? (
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 10, padding: "48px 24px", textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>
          No deliveries awaiting GRN
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {deliveries.map(pr => {
            const done = issued.has(pr.id);
            const f = form[pr.id] ?? { qty: "", condition: "Good", note: "" };
            const setF = (upd: Partial<typeof f>) => setForm(p => ({ ...p, [pr.id]: { ...f, ...upd } }));

            return (
              <div key={pr.id} style={{ background: "#FFFFFF", border: `1px solid ${done ? "#BBF7D0" : "#E5E7EB"}`, borderRadius: 10, padding: "20px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: done ? 0 : 16 }}>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", fontFamily: "monospace" }}>{pr.id}</span>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "4px 0" }}>{pr.title}</h3>
                    <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 10px" }}>{pr.faculty} · {formatLKR(pr.value)}</p>
                    <button
                      onClick={() => onViewProcurementDetails(pr.id)}
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "5px 12px",
                        background: "#F3F4F6",
                        color: "#374151",
                        border: "1px solid #E5E7EB",
                        borderRadius: 7,
                        cursor: "pointer",
                      }}
                    >
                      View Details
                    </button>
                  </div>
                  {done && (
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: "#F0FDF4", color: "#15803D", border: "1px solid #BBF7D0" }}>
                      GRN Issued
                    </span>
                  )}
                </div>

                {!done && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: 12, marginBottom: 14 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Quantity Received</label>
                      <input value={f.qty} onChange={e => setF({ qty: e.target.value })} placeholder="e.g. 10" type="number" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Condition</label>
                      <select value={f.condition} onChange={e => setF({ condition: e.target.value })} style={inputStyle}>
                        {["Good", "Partial", "Damaged"].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Notes</label>
                      <input value={f.note} onChange={e => setF({ note: e.target.value })} placeholder="Optional inspection notes" style={inputStyle} />
                    </div>
                  </div>
                )}

                {!done && (
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      onClick={() => handleIssue(pr.id)}
                      disabled={!f.qty}
                      style={{ padding: "9px 22px", background: f.qty ? "#7A0C0C" : "#D1D5DB", color: "#FFFFFF", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: f.qty ? "pointer" : "not-allowed" }}
                    >
                      Issue GRN
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AllProcurementsPanel({ onViewProcurement, user }: { onViewProcurement: (id: string) => void; user: UserContext }) {
  const list = getProcurementsForRole(user);
  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0, marginBottom: 2 }}>All Procurements</h1>
        <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>{list.length} records</p>
      </div>
      <ProcurementTable procurements={list} title="" subtitle="" onViewProcurement={onViewProcurement} />
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 11px",
  border: "1px solid #D1D5DB",
  borderRadius: 7,
  fontSize: 13,
  color: "#111827",
  background: "#FFFFFF",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};
