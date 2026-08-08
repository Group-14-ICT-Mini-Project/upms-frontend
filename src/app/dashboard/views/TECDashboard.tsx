import { useState } from "react";
import type { Procurement, UserContext } from "../types";
import { WelcomeBanner } from "../components/WelcomeBanner";
import { StatCardRow } from "../components/StatCard";
import { ActionQueueList } from "../components/ActionQueueList";
import { ProcurementTable } from "../components/ProcurementTable";
import { EmptyState } from "../components/EmptyState";
import { formatLKR } from "../data";
import { useProcurements } from "../ProcurementContext";


interface TECDashboardProps {
  user: UserContext;
  activeTab: string;
  onTabChange: (key: string) => void;
  onViewProcurement: (id: string) => void;
  onViewProcurementDetails: (id: string) => void;
}

export function TECDashboard({ user, activeTab, onTabChange, onViewProcurement, onViewProcurementDetails }: TECDashboardProps) {
  if (activeTab === "evaluations")  return <EvaluationsPanel onViewProcurementDetails={onViewProcurementDetails} user={user} />;
  if (activeTab === "procurements") return <AllProcurementsPanel onViewProcurement={onViewProcurement} user={user} />;
  return <TECOverview user={user} onTabChange={onTabChange} />;
}

function TECOverview({ user, onTabChange }: { user: UserContext; onTabChange: (k: string) => void }) {
  const { getProcurementsForUser } = useProcurements();
  const myProcurements = getProcurementsForUser(user);
  const queue = myProcurements.filter(p => p.status === "Technical Evaluation");
  return (
    <div style={{ padding: "28px 32px" }}>
      <WelcomeBanner user={user} />
      <StatCardRow total={myProcurements.length} inQueue={queue.length} actionRequired={queue.length} completed={0} />
      <ActionQueueList items={queue} onViewAll={() => onTabChange("evaluations")} onItemClick={() => onTabChange("evaluations")} />
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 10, padding: "18px 20px" }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: "#F59E0B", margin: 0, marginBottom: 12 }}>TEC Responsibilities</h3>
        <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6 }}>
          {["Preliminary evaluation of submitted bids", "Technical evaluation (specifications compliance)", "Financial evaluation & BES preparation", "Submit evaluation report to Tender Board"].map(s => (
            <li key={s} style={{ fontSize: 12, color: "#4B5563" }}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function EvaluationsPanel({ onViewProcurementDetails, user }: { onViewProcurementDetails: (id: string) => void; user: UserContext }) {
  const { getProcurementsForUser, updateProcurement } = useProcurements();
  const myProcurements = getProcurementsForUser(user);
  const items = myProcurements.filter(p => p.status === "Technical Evaluation");
  const [selected, setSelected] = useState<Procurement | null>(items[0] ?? null);
  const [scores, setScores] = useState({ technical: "", financial: "", compliance: "" });

  const handleSubmitReport = async () => {
    if (!selected) return;
    await updateProcurement(selected.id, {
      status: "Authority Approval",
      notes: `Technical Evaluation completed. Scores - Technical: ${scores.technical}, Financial: ${scores.financial}, Compliance: ${scores.compliance}. Bid Evaluation Sheet (BES) submitted.`,
    }, { name: user.name, role: user.role });
    setSelected(null);
    setScores({ technical: "", financial: "", compliance: "" });
  };

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0, marginBottom: 2 }}>Evaluations</h1>
        <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>Technical and financial evaluation of bids (&gt; LKR 500,000)</p>
      </div>

      {items.length === 0 ? (
        <EmptyState icon="inbox" title="No evaluations pending" description="Procurements requiring TEC evaluation will appear here." />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 20, alignItems: "start" }}>
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #F3F4F6" }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: 0 }}>Pending Evaluation ({items.length})</h3>
            </div>
            {items.map(pr => (
              <div key={pr.id} onClick={() => setSelected(pr)} style={{ padding: "14px 18px", cursor: "pointer", borderBottom: "1px solid #F9FAFB", background: selected?.id === pr.id ? "#FFF7ED" : "transparent" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", fontFamily: "monospace" }}>{pr.id}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", margin: "3px 0" }}>{pr.title}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#B45309" }}>{formatLKR(pr.value)}</div>
              </div>
            ))}
          </div>

          {selected && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 10, padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, marginBottom: 4 }}>{selected.title}</h3>
                  <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>{selected.id} · {selected.faculty} · {formatLKR(selected.value)}</p>
                </div>
                <button
                  onClick={() => onViewProcurementDetails(selected.id)}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "6px 14px",
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

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[["Technical Score (0–100)", "technical"], ["Financial Score (0–100)", "financial"], ["Compliance Score (0–100)", "compliance"]].map(([label, key]) => (
                  <div key={key}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={scores[key as keyof typeof scores]}
                      onChange={e => setScores(p => ({ ...p, [key]: e.target.value }))}
                      placeholder="Enter score"
                      style={{ width: "100%", padding: "9px 12px", border: "1px solid #D1D5DB", borderRadius: 7, fontSize: 13, outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit" }}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubmitReport}
                disabled={!scores.technical || !scores.financial || !scores.compliance}
                style={{
                  marginTop: 20,
                  width: "100%",
                  padding: "10px",
                  background: !scores.technical || !scores.financial || !scores.compliance ? "#D1D5DB" : "#7A0C0C",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 7,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: !scores.technical ? "not-allowed" : "pointer",
                }}
              >
                Submit BES Report to Tender Board
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AllProcurementsPanel({ onViewProcurement, user }: { onViewProcurement: (id: string) => void; user: UserContext }) {
  const { getProcurementsForUser } = useProcurements();
  const list = getProcurementsForUser(user);
  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0, marginBottom: 2 }}>All Procurements</h1>
        <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>{list.length} records visible for your role</p>
      </div>
      <ProcurementTable procurements={list} title="" subtitle="" onViewProcurement={onViewProcurement} />
    </div>
  );
}
