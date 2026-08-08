import { useState } from "react";
import type { UserContext } from "../types";
import { WelcomeBanner } from "../components/WelcomeBanner";
import { StatCardRow } from "../components/StatCard";
import { ActionQueueList } from "../components/ActionQueueList";
import { ProcurementTable } from "../components/ProcurementTable";
import { ScoringMatrix, type ScoringCriteria } from "../components/ScoringMatrix";
import { EmptyState } from "../components/EmptyState";
import { MOCK_PROCUREMENTS, getActionQueueForRole, getProcurementsForRole, formatLKR } from "../data";


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
  const queue = getActionQueueForRole(user);
  const myProcurements = getProcurementsForRole(user);
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
  const myProcurements = getProcurementsForRole(user);
  const items = myProcurements.filter(p => p.status === "Technical Evaluation");
  const [selected, setSelected] = useState<any>(null);
  const [scores, setScores] = useState<{ technical: string; financial: string; compliance: string }>({ technical: "", financial: "", compliance: "" });

  // Scoring criteria for the matrix
  const scoringCriteria: ScoringCriteria[] = [
    { id: "compliance", name: "Bid Compliance", weight: 20, maxScore: 100 },
    { id: "technical", name: "Technical Merit", weight: 40, maxScore: 100 },
    { id: "financial", name: "Financial Viability", weight: 40, maxScore: 100 },
  ];

  const handleSubmitReport = () => {
    if (!selected) return;
    selected.status = "Authority Approval";
    selected.updatedAt = new Date().toISOString();
    selected.activityLogs = [
      {
        id: `log-tec-${Date.now()}`,
        stepIndex: 4,
        actor: user.name,
        role: "TEC Member",
        action: `Technical Evaluation completed. Compliance: ${scores.compliance}, Technical: ${scores.technical}, Financial: ${scores.financial}. Bid Evaluation Sheet (BES) submitted to Tender Board.`,
        timestamp: new Date().toISOString(),
      },
      ...(selected.activityLogs ?? []),
    ];
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
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Header */}
              <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 10, padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
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
                    View Full Details
                  </button>
                </div>
              </div>

              {/* Show submitted bids */}
              {selected.bids && selected.bids.length > 0 && (
                <div style={{
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: 10,
                  padding: 20,
                }}>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: "#111827", margin: "0 0 12px" }}>
                    Sealed Bids Submitted ({selected.bids.length})
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {selected.bids.map((bid: any, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          padding: 10,
                          background: "#F9FAFB",
                          border: "1px solid #E5E7EB",
                          borderRadius: 6,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "#111827" }}>{bid.bidderName}</div>
                          <div style={{ fontSize: 10, color: "#6B7280" }}>{bid.bidderContact}</div>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#B45309" }}>
                          {formatLKR(bid.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scoring Matrix */}
              <ScoringMatrix
                criteria={scoringCriteria}
                bidders={selected.bids?.map((b: any) => ({ id: b.bidderName, name: b.bidderName })) || []}
              />

              {/* Submit button */}
              <button
                onClick={handleSubmitReport}
                disabled={!scores.technical || !scores.financial || !scores.compliance}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: !scores.technical || !scores.financial || !scores.compliance ? "#D1D5DB" : "#7A0C0C",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: !scores.technical ? "not-allowed" : "pointer",
                }}
              >
                Submit Bid Evaluation Sheet (BES) to Tender Board
              </button>
            </div>
          )}
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
        <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>{list.length} records visible for your role</p>
      </div>
      <ProcurementTable procurements={list} title="" subtitle="" onViewProcurement={onViewProcurement} />
    </div>
  );
}
