import { useState } from "react";
import type { UserContext } from "../types";
import { WelcomeBanner } from "../components/WelcomeBanner";
import { StatCardRow } from "../components/StatCard";
import { ActionQueueList } from "../components/ActionQueueList";
import { ProcurementTable } from "../components/ProcurementTable";
import { MOCK_PROCUREMENTS, getActionQueueForRole, getProcurementsForRole, formatLKR } from "../data";


interface FinanceDashboardProps {
  user: UserContext;
  activeTab: string;
  onTabChange: (key: string) => void;
  onViewProcurement: (id: string) => void;
  onViewProcurementDetails: (id: string) => void;
}

export function FinanceDashboard({ user, activeTab, onTabChange, onViewProcurement, onViewProcurementDetails }: FinanceDashboardProps) {
  if (activeTab === "payments")     return <PaymentsPanel onViewProcurementDetails={onViewProcurementDetails} user={user} />;
  if (activeTab === "procurements") return <AllProcurementsPanel onViewProcurement={onViewProcurement} user={user} />;
  return <FinanceOverview user={user} onTabChange={onTabChange} />;
}

function FinanceOverview({ user, onTabChange }: { user: UserContext; onTabChange: (k: string) => void }) {
  const queue = getActionQueueForRole(user);
  const myProcurements = getProcurementsForRole(user);
  const totalPending = queue.reduce((sum, pr) => sum + pr.value, 0);

  const ANNUAL_BUDGET = 85_000_000; // LKR 85 Million
  const spent = myProcurements
    .filter(p => p.status === "Completed")
    .reduce((sum, p) => sum + p.value, 0);
  const pending_val = myProcurements
    .filter(p => p.status !== "Completed" && p.status !== "Rejected")
    .reduce((sum, p) => sum + p.value, 0);
  const remaining = ANNUAL_BUDGET - spent - pending_val;
  const spentPct   = Math.min(100, Math.round((spent / ANNUAL_BUDGET) * 100));
  const pendingPct = Math.min(100 - spentPct, Math.round((pending_val / ANNUAL_BUDGET) * 100));

  return (
    <div style={{ padding: "28px 32px" }}>
      <WelcomeBanner user={user} />

      <div style={{
        background: "linear-gradient(135deg, #7a530cff 0%, #a37717ff 100%)",
        borderRadius: 16,
        padding: "24px 28px",
        marginBottom: 24,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(122,83,12,0.25)",
      }}>
        {/* Decorative blobs */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -30, right: 80, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.88)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
              Annual Procurement Budget — {new Date().getFullYear()}
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
              {formatLKR(ANNUAL_BUDGET)}
            </div>
          </div>
          <div style={{
            background: "rgba(255,255,255,0.15)",
            borderRadius: 10,
            padding: "6px 14px",
            fontSize: 14,
            fontWeight: 700,
            color: "#FFFFFF",
            backdropFilter: "blur(4px)",
          }}>
            {spentPct + pendingPct}% Utilized
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 18 }}>
          <div style={{
            height: 10,
            borderRadius: 8,
            background: "rgba(255,255,255,0.2)",
            overflow: "hidden",
            display: "flex",
          }}>
            {/* Spent segment */}
            <div style={{
              width: `${spentPct}%`,
              background: "rgba(255,255,255,0.85)",
              borderRadius: spentPct > 0 ? "8px 0 0 8px" : 0,
              transition: "width 0.6s ease",
            }} />
            {/* Committed/pending segment */}
            <div style={{
              width: `${pendingPct}%`,
              background: "rgba(255,255,255,0.40)",
              transition: "width 0.6s ease",
            }} />
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: "rgba(255,255,255,0.85)" }} />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.88)", fontWeight: 600 }}>Spent ({spentPct}%)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: "rgba(255,255,255,0.40)" }} />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.88)", fontWeight: 600 }}>Committed ({pendingPct}%)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: "rgba(255,255,255,0.18)" }} />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.88)", fontWeight: 600 }}>Available ({100 - spentPct - pendingPct}%)</span>
            </div>
          </div>
        </div>

        {/* Three metric tiles */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {/* Spent */}
          <div style={{
            background: "rgba(255,255,255,0.13)",
            borderRadius: 12,
            padding: "14px 16px",
            backdropFilter: "blur(4px)",
          }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.88)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
              Total Spent
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#FFFFFF", marginBottom: 2 }}>
              {formatLKR(spent)}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)" }}>
              Payments processed
            </div>
          </div>

          {/* Committed */}
          <div style={{
            background: "rgba(255,255,255,0.13)",
            borderRadius: 12,
            padding: "14px 16px",
            backdropFilter: "blur(4px)",
          }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.88)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
              Committed
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#FFFFFF", marginBottom: 2 }}>
              {formatLKR(pending_val)}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)" }}>
              Active procurements
            </div>
          </div>

          {/* Remaining */}
          <div style={{
            background: "rgba(255,255,255,0.20)",
            borderRadius: 12,
            padding: "14px 16px",
            border: "1px solid rgba(255,255,255,0.25)",
            backdropFilter: "blur(4px)",
          }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.95)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
              Available Balance
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#FFFFFF", marginBottom: 2 }}>
              {formatLKR(Math.max(0, remaining))}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.90)" }}>
              {remaining < 0 ? "⚠ Over budget" : "Unallocated funds"}
            </div>
          </div>
        </div>
      </div>

      <StatCardRow total={myProcurements.length} inQueue={queue.length} actionRequired={queue.length} completed={2} />

      {/* Total pending amount */}
      {queue.length > 0 && (
        <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 10, padding: "14px 20px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#92400E" }}>Total Payment Pending</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#B45309" }}>{formatLKR(totalPending)}</span>
        </div>
      )}

      <ActionQueueList items={queue} onViewAll={() => onTabChange("payments")} onItemClick={() => onTabChange("payments")} />
    </div>
  );
}

function PaymentsPanel({ onViewProcurementDetails, user }: { onViewProcurementDetails: (id: string) => void; user: UserContext }) {
  const myProcurements = getProcurementsForRole(user);
  const pending = myProcurements.filter(p => p.status === "Payment Pending");
  const [processed, setProcessed] = useState<Set<string>>(new Set());
  const [voucherNos, setVoucherNos] = useState<Record<string, string>>({});

  const handleProcess = (id: string) => {
    if (!voucherNos[id]) return;
    const pr = MOCK_PROCUREMENTS.find(p => p.id === id);
    if (pr) {
      pr.status = "Completed";
      pr.updatedAt = new Date().toISOString();
      pr.activityLogs = [
        {
          id: `log-fin-${Date.now()}`,
          stepIndex: 9,
          actor: user.name,
          role: "Finance Division",
          action: `Payment processed and dispatched. Voucher: ${voucherNos[id]} issued. Requisition completed.`,
          timestamp: new Date().toISOString(),
        },
        ...(pr.activityLogs ?? []),
      ];
    }
    setProcessed(p => new Set([...p, id]));
  };

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0, marginBottom: 2 }}>Payments</h1>
        <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>Process payments after quality report approval</p>
      </div>

      {pending.length === 0 ? (
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 10, padding: "48px", textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>
          No payments pending
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {pending.map(pr => {
            const done = processed.has(pr.id);
            return (
              <div
                key={pr.id}
                style={{
                  background: "#FFFFFF",
                  border: `1px solid ${done ? "#BBF7D0" : "#E5E7EB"}`,
                  borderRadius: 10,
                  padding: "20px 24px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", fontFamily: "monospace" }}>{pr.id}</span>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "4px 0" }}>{pr.title}</h3>
                    <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 10px" }}>{pr.faculty}</p>
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
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#B45309" }}>{formatLKR(pr.value)}</div>
                    {done && (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#F0FDF4", color: "#15803D", border: "1px solid #BBF7D0" }}>
                        ✓ Payment Processed · Voucher #{voucherNos[pr.id]}
                      </span>
                    )}
                  </div>
                </div>

                {!done && (
                  <div style={{ display: "flex", gap: 10, marginTop: 14, alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Payment Voucher No.</label>
                      <input
                        value={voucherNos[pr.id] ?? ""}
                        onChange={e => setVoucherNos(p => ({ ...p, [pr.id]: e.target.value }))}
                        placeholder="e.g. PV-2026-0089"
                        style={{ padding: "8px 12px", border: "1px solid #D1D5DB", borderRadius: 7, fontSize: 13, outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" as const }}
                      />
                    </div>
                    <button
                      onClick={() => handleProcess(pr.id)}
                      disabled={!voucherNos[pr.id]}
                      style={{ marginTop: 22, padding: "9px 20px", background: voucherNos[pr.id] ? "#15803D" : "#D1D5DB", color: "#FFFFFF", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: voucherNos[pr.id] ? "pointer" : "not-allowed", flexShrink: 0 }}
                    >
                      Mark as Paid
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
