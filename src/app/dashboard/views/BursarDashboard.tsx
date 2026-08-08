import { useState } from "react";
import type { UserContext, Procurement } from "../types";
import { WelcomeBanner } from "../components/WelcomeBanner";
import { StatCardRow } from "../components/StatCard";
import { ActionQueueList } from "../components/ActionQueueList";
import { ProcurementTable } from "../components/ProcurementTable";
import { StatusBadge } from "../components/StatusBadge";
import { BudgetComparison } from "../components/BudgetComparison";
import { PageTitleBar } from "../components/ContentHeader";
import { MOCK_PROCUREMENTS, getActionQueueForRole, getProcurementsForRole, formatLKR } from "../data";


interface BursarDashboardProps {
  user: UserContext;
  activeTab: string;
  onTabChange: (key: string) => void;
  onViewProcurement: (id: string) => void;
  onViewProcurementDetails: (id: string) => void;
}

export function BursarDashboard({ user, activeTab, onTabChange, onViewProcurement, onViewProcurementDetails }: BursarDashboardProps) {
  if (activeTab === "fund-verification") return <FundVerificationPanel onViewProcurementDetails={onViewProcurementDetails} user={user} />;
  if (activeTab === "procurements")      return <AllProcurementsPanel onViewProcurement={onViewProcurement} user={user} />;
  return <BursarOverview user={user} onTabChange={onTabChange} />;
}

function BursarOverview({ user, onTabChange }: { user: UserContext; onTabChange: (k: string) => void }) {
  const queue = getActionQueueForRole(user);
  const myProcurements = getProcurementsForRole(user);
  return (
    <div style={{ padding: "28px 28px" }}>
      <WelcomeBanner user={user} />
      <StatCardRow total={myProcurements.length} inQueue={queue.length} actionRequired={queue.length} completed={0} />
      <ActionQueueList items={queue} onViewAll={() => onTabChange("fund-verification")} onItemClick={() => onTabChange("fund-verification")} />
    </div>
  );
}

function FundVerificationPanel({ onViewProcurementDetails, user }: { onViewProcurementDetails: (id: string) => void; user: UserContext }) {
  const myProcurements = getProcurementsForRole(user);
  const pending = myProcurements.filter(p => p.status === "Pending Fund Verification");
  const [selected, setSelected] = useState<Procurement | null>(pending[0] ?? null);
  const [budgetCode, setBudgetCode] = useState("");
  const [availableFunds, setAvailableFunds] = useState("");
  const [verified, setVerified] = useState<Set<string>>(new Set());
  const [rejected, setRejected] = useState<Set<string>>(new Set());

  const handleVerify = () => {
    if (!selected) return;
    selected.status = "Funds Verified";
    selected.budgetCode = budgetCode;
    selected.updatedAt = new Date().toISOString();
    selected.activityLogs = [
      {
        id: `log-bur-${Date.now()}`,
        stepIndex: 1,
        actor: user.name,
        role: user.role === "FBUR" ? "Faculty Bursar" : "Bursar",
        action: `Funds verified. Budget code: ${budgetCode}. Available allocation: ${formatLKR(Number(availableFunds))}.`,
        timestamp: new Date().toISOString(),
      },
      ...(selected.activityLogs ?? []),
    ];
    setVerified(p => new Set([...p, selected.id]));
    setSelected(null);
    setBudgetCode("");
    setAvailableFunds("");
  };

  const handleReject = () => {
    if (!selected) return;
    selected.status = "Rejected";
    selected.updatedAt = new Date().toISOString();
    selected.activityLogs = [
      {
        id: `log-bur-${Date.now()}`,
        stepIndex: -1,
        actor: user.name,
        role: user.role === "FBUR" ? "Faculty Bursar" : "Bursar",
        action: "Fund verification rejected due to insufficient budget allocation.",
        timestamp: new Date().toISOString(),
      },
      ...(selected.activityLogs ?? []),
    ];
    setRejected(p => new Set([...p, selected.id]));
    setSelected(null);
  };

  return (
    <div style={{ padding: "28px 28px" }}>
      <PageTitleBar title="Fund Verification" subtitle="Verify budget availability for pending requisitions" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 20, alignItems: "start" }}>
        {/* Left: pending list */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #F3F4F6" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: 0 }}>Pending Verification ({pending.length})</h3>
          </div>
          {pending.map(pr => {
            const isVerified = verified.has(pr.id);
            const isRejected = rejected.has(pr.id);
            return (
              <div
                key={pr.id}
                onClick={() => !isVerified && !isRejected && setSelected(pr)}
                style={{ padding: "14px 18px", borderBottom: "1px solid #F9FAFB", cursor: isVerified || isRejected ? "default" : "pointer", background: selected?.id === pr.id ? "#FFF7ED" : "transparent", opacity: isVerified || isRejected ? 0.5 : 1 }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", marginBottom: 2, fontFamily: "monospace" }}>{pr.id}</div>
                <div style={{ fontSize: 12, color: "#111827", fontWeight: 600, marginBottom: 4 }}>{pr.title}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#B45309" }}>{formatLKR(pr.value)}</span>
                  {isVerified && <StatusBadge status="Funds Verified" size="sm" />}
                  {isRejected && <StatusBadge status="Rejected" size="sm" />}
                  {!isVerified && !isRejected && <StatusBadge status={pr.status} size="sm" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: verification form */}
        {selected ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Header */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 14, padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0, marginBottom: 4 }}>{selected.title}</h3>
                  <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>{selected.id} · {selected.faculty} · {selected.department}</p>
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
            </div>

            {/* Budget Comparison */}
            <BudgetComparison
              requested={selected.value}
              allocated={availableFunds ? Number(availableFunds) : selected.value}
              available={availableFunds ? Math.max(0, Number(availableFunds) - selected.value) : selected.value}
            />

            {/* Verification Form */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 14, padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: "#111827", margin: 0 }}>Verification Details</h4>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Budget Code <span style={{ color: "#EF4444" }}>*</span></label>
                <input value={budgetCode} onChange={e => setBudgetCode(e.target.value)} placeholder="e.g. BUDGET-2026-FAS" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Total Budget Allocated (LKR) <span style={{ color: "#EF4444" }}>*</span></label>
                <input type="number" value={availableFunds} onChange={e => setAvailableFunds(e.target.value)} placeholder="e.g. 500000" style={inputStyle} />
              </div>

              {availableFunds && Number(availableFunds) < selected.value && (
                <div style={{
                  padding: 12,
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: 8,
                  display: "flex",
                  gap: 8,
                  alignItems: "start",
                }}>
                  <div style={{ fontSize: 14, marginTop: 2 }}>⚠️</div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#DC2626" }}>Budget Shortfall</div>
                    <div style={{ fontSize: 11, color: "#DC2626", marginTop: 2 }}>
                      Allocated budget is less than the requested amount. Consider escalating to Main Bursar.
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: 10, paddingTop: 10, borderTop: "1px solid #E5E7EB" }}>
                <button
                  onClick={handleReject}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "#FEF2F2",
                    color: "#B91C1C",
                    border: "1px solid #FECACA",
                    borderRadius: 9,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Reject
                </button>
                <button
                  onClick={handleVerify}
                  disabled={!budgetCode || !availableFunds}
                  style={{
                    flex: 2,
                    padding: "10px",
                    background: !budgetCode || !availableFunds ? "#D1D5DB" : "#15803D",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: 9,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: !budgetCode || !availableFunds ? "not-allowed" : "pointer",
                  }}
                >
                  Verify Funds
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 14, padding: "48px 24px", textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>
            Select a requisition from the list to verify funds
          </div>
        )}
      </div>
    </div>
  );
}

function AllProcurementsPanel({ onViewProcurement, user }: { onViewProcurement: (id: string) => void; user: UserContext }) {
  const list = getProcurementsForRole(user);
  return (
    <div style={{ padding: "28px 28px" }}>
      <PageTitleBar title="All Procurements" subtitle={`${list.length} records visible for your role`} />
      <div style={{ background: "#FFFFFF", borderRadius: 14, border: "1px solid #F1F5F9", overflow: "hidden" }}>
        <ProcurementTable procurements={list} title="" subtitle="" onViewProcurement={onViewProcurement} />
      </div>
    </div>
  );
}


const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 13, color: "#111827", background: "#FFFFFF", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
