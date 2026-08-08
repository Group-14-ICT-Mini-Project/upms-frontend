import { useState } from "react";
import { Plus, TrendingUp, MoreHorizontal, ArrowUpRight, Search, Filter, Building2, ArrowRight, Check, ChevronLeft } from "lucide-react";
import { WelcomeBanner } from "../components/WelcomeBanner";
import { StatCardRow } from "../components/StatCard";
import { InventoryCard } from "../components/InventoryCard";
import type { UserContext } from "../types";
import { PageTitleBar } from "../components/ContentHeader";
import { ActionQueueList } from "../components/ActionQueueList";
import { ProcurementTable } from "../components/ProcurementTable";
import { StatusBadge } from "../components/StatusBadge";
import { MOCK_PROCUREMENTS, getActionQueueForRole, getProcurementsForRole, formatLKR } from "../data";


interface HODDashboardProps {
  user: UserContext;
  activeTab: string;
  onTabChange: (key: string) => void;
  onViewProcurement: (id: string) => void;
  onViewProcurementDetails: (id: string) => void;
}

export function HODDashboard({ user, activeTab, onTabChange, onViewProcurement, onViewProcurementDetails }: HODDashboardProps) {
  if (activeTab === "new-requisition") return <NewRequisitionPanel onSubmit={() => onTabChange("dashboard")} onViewProcurement={onViewProcurement} user={user} />;
  if (activeTab === "stock-inquiry")   return <StockInquiryPanel />;
  if (activeTab === "procurements")    return <AllProcurementsPanel onViewProcurement={onViewProcurement} user={user} />;
  if (activeTab === "quality-report")  return <QualityReportPanel onViewProcurementDetails={onViewProcurementDetails} user={user} />;
  return <HODOverview user={user} onTabChange={onTabChange} />;
}



function HODOverview({ user, onTabChange }: { user: UserContext; onTabChange: (k: string) => void }) {
  const queue = getActionQueueForRole(user);
  const myProcurements = getProcurementsForRole(user);
  const [search, setSearch] = useState("");

  return (
    <div style={{ padding: "28px 32px 40px" }}>
      {/* Welcome Banner */}
      <WelcomeBanner user={user} />

      {/* 4 Stat Cards */}
      <StatCardRow
        total={myProcurements.length}
        inQueue={queue.length}
        actionRequired={queue.length}
        completed={0}
      />

      {/* Create Purchase Requisition button */}
      <button
        onClick={() => onTabChange("new-requisition")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "10px 20px",
          background: "#7A0C0C",
          color: "#FFFFFF",
          border: "none",
          borderRadius: 9,
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          marginBottom: 24,
        }}
      >
        <Plus size={14} strokeWidth={2.5} />
        Create Purchase Requisition
      </button>

      {/* ── Bottom: Recent Procurements table ── */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 14,
          border: "1px solid #F1F5F9",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 20px",
            borderBottom: "1px solid #F3F4F6",
          }}
        >
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>Recent Activities</h3>
            <p style={{ fontSize: 11, color: "#9CA3AF", margin: "3px 0 0" }}></p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* Search */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", border: "1px solid #E5E7EB", borderRadius: 7, background: "#FAFAFA" }}>
              <Search size={12} strokeWidth={2} color="#9CA3AF" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  border: "none",
                  background: "none",
                  outline: "none",
                  fontSize: 12,
                  color: "#374151",
                  width: 140,
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{ border: "none", background: "none", cursor: "pointer", color: "#9CA3AF", padding: 0, lineHeight: 1 }}
                >✕</button>
              )}
            </div>
            {/* Filter */}
            <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", border: "1px solid #E5E7EB", borderRadius: 7, background: "#FAFAFA", color: "#374151", fontSize: 12, cursor: "pointer" }}>
              <Filter size={12} strokeWidth={2} />
              Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#FAFAFA" }}>
                <th style={thStyle}></th>
                <th style={thStyle}>Activity</th>
                <th style={thStyle}>Order ID</th>
                <th style={thStyle}>Faculty</th>
                <th style={thStyle}>Value</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {myProcurements.filter(pr => {
                const q = search.toLowerCase();
                return !q ||
                  pr.title.toLowerCase().includes(q) ||
                  pr.id.toLowerCase().includes(q) ||
                  pr.faculty.toLowerCase().includes(q) ||
                  pr.status.toLowerCase().includes(q) ||
                  (pr.department ?? "").toLowerCase().includes(q);
              }).slice(0, 8).map((pr, i) => (
                <tr
                  key={pr.id}
                  style={{ borderBottom: "1px solid #F9FAFB" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#FAFAFA")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "12px 10px 12px 20px" }}>
                    <input type="checkbox" style={{ width: 14, height: 14, accentColor: "#7A0C0C", cursor: "pointer" }} />
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: ["#FEF3C7","#F0FDF4","#EFF6FF","#F5F3FF","#FEF2F2"][i % 5],
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 800,
                          color: ["#B45309","#15803D","#1D4ED8","#6D28D9","#B91C1C"][i % 5],
                          flexShrink: 0,
                        }}
                      >
                        PR
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {pr.title}
                        </div>
                        <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>{pr.department ?? pr.faculty}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", fontFamily: "monospace" }}>{pr.id}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 12, color: "#6B7280" }}>{pr.faculty.replace("Faculty of ", "")}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#B45309" }}>{formatLKR(pr.value)}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <StatusBadge status={pr.status} />
                  </td>
                  <td style={{ padding: "12px 20px 12px 10px" }}>
                    <button style={{ border: "none", background: "none", cursor: "pointer", color: "#D1D5DB" }}>
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


function HeroStatCard({ title, subtitle, value, badge, badgeUp, linkLabel, onClick }: {
  title: string; subtitle: string; value: string; badge: string;
  badgeUp: boolean; linkLabel: string; onClick: () => void;
}) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #7A0C0C 0%, #5C0808 100%)",
        borderRadius: 14,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      {/* Decorative circle */}
      <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Building2 size={18} strokeWidth={2} color="#F59E0B" />
        </div>
        <button style={{ border: "none", background: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)" }}>
          <MoreHorizontal size={16} />
        </button>
      </div>
      <div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>{subtitle}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#FFFFFF" }}>{value}</div>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: badgeUp ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)", color: badgeUp ? "#4ADE80" : "#FCA5A5" }}>
            {badge} {badgeUp ? "↑" : "↓"}
          </span>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>{title}</div>
      </div>
      <button
        onClick={onClick}
        style={{
          border: "none",
          background: "none",
          cursor: "pointer",
          color: "rgba(255,255,255,0.6)",
          fontSize: 12,
          padding: 0,
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          gap: 4,
          paddingTop: 6,
          borderTop: "1px solid rgba(255,255,255,0.12)",
          width: "100%",
        }}
      >
        {linkLabel} <ArrowUpRight size={12} />
      </button>
    </div>
  );
}

function RegularStatCard({ icon, iconBg, title, subtitle, value, badge, badgeUp, linkLabel, onClick, highlight }: {
  icon: React.ReactNode; iconBg: string; title: string; subtitle: string;
  value: string; badge: string; badgeUp: boolean; linkLabel: string;
  onClick: () => void; highlight?: boolean;
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 14,
        padding: "20px",
        border: highlight ? "1.5px solid #FCA5A5" : "1px solid #F1F5F9",
        boxShadow: highlight ? "0 0 0 3px rgba(239,68,68,0.06)" : "0 1px 4px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon}
        </div>
        <button style={{ border: "none", background: "none", cursor: "pointer", color: "#D1D5DB" }}>
          <MoreHorizontal size={16} />
        </button>
      </div>
      <div>
        <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>{subtitle}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: highlight ? "#991B1B" : "#111827" }}>{value}</div>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: highlight ? "#FEE2E2" : badgeUp ? "#F0FDF4" : "#FEF3C7", color: highlight ? "#991B1B" : badgeUp ? "#15803D" : "#B45309" }}>
            {badge}
          </span>
        </div>
        <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{title}</div>
      </div>
      <button
        onClick={onClick}
        style={{
          border: "none",
          background: "none",
          cursor: "pointer",
          color: highlight ? "#991B1B" : "#7A0C0C",
          fontSize: 12,
          fontWeight: 600,
          padding: 0,
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          gap: 4,
          paddingTop: 6,
          borderTop: "1px solid #F3F4F6",
          width: "100%",
        }}
      >
        {linkLabel} <ArrowUpRight size={12} />
      </button>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 16px",
  fontSize: 11,
  fontWeight: 700,
  color: "#9CA3AF",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  borderBottom: "1px solid #F3F4F6",
};

const STEPS = [
  { label: "Basic Info",       icon: "📋" },
  { label: "Product Details",  icon: "📦" },
  { label: "Quantity & Value", icon: "💰" },
  { label: "Review & Sign",    icon: "✍️" },
];

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32 }}>
      {STEPS.map((step, i) => {
        const done    = i < current;
        const active  = i === current;
        const last    = i === total - 1;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: last ? "0 0 auto" : 1 }}>
            {/* Circle */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: done ? "#7A0C0C" : active ? "#7A0C0C" : "#F3F4F6",
                  border: active ? "2.5px solid #7A0C0C" : done ? "2.5px solid #7A0C0C" : "2px solid #D1D5DB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: done ? 14 : 13,
                  color: done || active ? "#FFFFFF" : "#B0B7C3",
                  fontWeight: 700,
                  flexShrink: 0,
                  transition: "all 0.25s ease",
                  boxShadow: "none",
                }}
              >
                {done ? <Check size={15} strokeWidth={3} /> : i + 1}
              </div>
              <span style={{
                fontSize: 12,
                fontWeight: active ? 700 : 500,
                color: active ? "#7A0C0C" : done ? "#6B7280" : "#B0B7C3",
                whiteSpace: "nowrap",
              }}>
                {step.label}
              </span>
            </div>
            {/* Connector bar */}
            {!last && (
              <div style={{
                flex: 1,
                height: 3,
                marginBottom: 22,
                marginLeft: 4,
                marginRight: 4,
                borderRadius: 4,
                background: done ? "#7A0C0C" : "#E5E7EB",
                transition: "background 0.3s ease",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

interface ReqForm {
  title: string;
  faculty: string;
  department: string;
  requisitionType: "Consumables" | "Capital Goods";
  stockBalance: string;
  fundingSource: string;
  description: string;
  reason: string;
  quantity: string;
  unit: string;
  approxValue: string;
  preparedBy: string;
  signature: string;
}

function NewRequisitionPanel({ onSubmit, onViewProcurement, user }: { onSubmit: () => void; onViewProcurement: (id: string) => void; user?: { name?: string; title?: string; department?: string; faculty?: string } }) {
  const hodName = user?.name ?? "Dr. Nimal Perera";

  const [step, setStep]       = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors]   = useState<Partial<Record<keyof ReqForm, string>>>({});
  const [form, setForm]       = useState<ReqForm>({
    title:            "",
    faculty:          user?.faculty ?? "",
    department:       user?.department ?? "",
    requisitionType:  "Consumables",
    stockBalance:     "",
    fundingSource:    "Operating Budget",
    description:      "",
    reason:           "",
    quantity:         "",
    unit:             "units",
    approxValue:      "",
    preparedBy:       hodName,
    signature:        "",
  });

  const set = (key: keyof ReqForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }));

  // Per-step validation
  const validate = (s: number): boolean => {
    const e: Partial<Record<keyof ReqForm, string>> = {};
    if (s === 0) {
      if (!form.title.trim())    e.title    = "Requisition title is required.";
      if (!form.faculty.trim())  e.faculty  = "Please select a faculty.";
    }
    if (s === 1) {
      if (!form.description.trim()) e.description = "Product description is required.";
      if (!form.reason.trim())      e.reason      = "Reason for requisition is required.";
    }
    if (s === 2) {
      if (!form.quantity.trim() || isNaN(Number(form.quantity)) || Number(form.quantity) <= 0)
        e.quantity = "Enter a valid quantity.";
      if (!form.approxValue.trim() || isNaN(Number(form.approxValue)) || Number(form.approxValue) <= 0)
        e.approxValue = "Enter a valid approximate value.";
    }
    if (s === 3) {
      if (!form.signature.trim()) e.signature = "Signature is required to submit.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep(s => Math.min(s + 1, STEPS.length - 1)); };
  const back = () => { setErrors({}); setStep(s => Math.max(s - 1, 0)); };

  const handleSubmit = () => {
    if (validate(3)) setSubmitted(true);
  };

  if (submitted) {
    // In a real system we'd get the new PR ID from the server response.
    // For the demo we use the most recently created mock record as a stand-in.
    const newPrId = "PR-2026-001";
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "75vh",
        textAlign: "center",
        padding: "40px",
        boxSizing: "border-box",
      }}>
        <div style={{ maxWidth: 560, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            Requisition Submitted!
          </h2>

          <p style={{ fontSize: 15, fontWeight: 600, color: "#374151", margin: "0 0 16px" }}>
            {form.title}
          </p>

          {/* Workflow next-step hint */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#FFFBEB",
            border: "1px solid #FDE68A",
            borderRadius: 10,
            padding: "10px 16px",
            marginBottom: 36,
            fontSize: 12,
            color: "#92400E",
            fontWeight: 600,
          }}>
            Next step — Bursar will verify budget allocation
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => onViewProcurement(newPrId)}
              style={{
                padding: "11px 24px",
                background: "#7A0C0C",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#9B1515")}
              onMouseLeave={e => (e.currentTarget.style.background = "#7A0C0C")}
            >
              Track Request Status
            </button>

            <button
              onClick={onSubmit}
              style={{
                padding: "11px 24px",
                background: "#F3F4F6",
                color: "#374151",
                border: "1.5px solid #9CA3AF",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#E5E7EB")}
              onMouseLeave={e => (e.currentTarget.style.background = "#F3F4F6")}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "28px 28px 48px" }}>
      <PageTitleBar title="New Requisition" subtitle="Complete all steps to create a purchase requisition" />

      <div style={{
        maxWidth: 760,
        background: "#FFFFFF",
        border: "1px solid #F1F5F9",
        borderRadius: 18,
        padding: "32px 36px 28px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      }}>

        {/* ── Step indicator ── */}
        <StepIndicator current={step} total={STEPS.length} />

        {/* ── Step panels ── */}
        {step === 0 && (
          <StepCard title="Basic Information" subtitle="Enter requisition details and verify current stock">
            <MField label="Requisition Title" error={errors.title} required>
              <input
                value={form.title}
                onChange={set("title")}
                placeholder="e.g. Laboratory Microscopes — Biology Dept"
                style={mInput(!!errors.title)}
              />
            </MField>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <MField label="Faculty" error={errors.faculty} required>
                <select value={form.faculty} onChange={set("faculty")} style={mInput(!!errors.faculty)}>
                  <option value="">Select faculty…</option>
                  {["Faculty of Applied Sciences","Faculty of Management Studies","Faculty of Engineering","Faculty of Humanities","Faculty of Medical Sciences"].map(f => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
              </MField>
              <MField label="Department">
                <input
                  value={form.department}
                  onChange={set("department")}
                  placeholder="e.g. Computer Science"
                  style={mInput(false)}
                />
              </MField>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <MField label="Requisition Type" required>
                <select value={form.requisitionType} onChange={set("requisitionType")} style={mInput(false)}>
                  <option value="Consumables">Consumables (recurring supply)</option>
                  <option value="Capital Goods">Capital Goods (equipment/asset)</option>
                </select>
              </MField>
              <MField label="Current Stock Balance (Units)">
                <input
                  type="number"
                  value={form.stockBalance}
                  onChange={set("stockBalance")}
                  placeholder="Enter current quantity available"
                  style={mInput(false)}
                />
              </MField>
            </div>

            <MField label="Funding Source">
              <select value={form.fundingSource} onChange={set("fundingSource")} style={mInput(false)}>
                <option value="Operating Budget">Operating Budget</option>
                <option value="Capital Grant">Capital Grant</option>
                <option value="Research Fund">Research Fund</option>
                <option value="Maintenance Budget">Maintenance Budget</option>
              </select>
            </MField>
          </StepCard>
        )}

        {step === 1 && (
          <StepCard title="Product Details" subtitle="Describe the product/service and state the reason for requisition">
            <MField label="Description of Product / Service" error={errors.description} required>
              <textarea
                rows={4}
                value={form.description}
                onChange={set("description")}
                placeholder="Describe the items or services required in detail…"
                style={{ ...mInput(!!errors.description), resize: "vertical" as const }}
              />
            </MField>
            <MField label="Reason for Requisition" error={errors.reason} required>
              <textarea
                rows={3}
                value={form.reason}
                onChange={set("reason")}
                placeholder="Why is this procurement necessary? (e.g. existing equipment failure, new project requirement…)"
                style={{ ...mInput(!!errors.reason), resize: "vertical" as const }}
              />
            </MField>
          </StepCard>
        )}

        {step === 2 && (
          <StepCard title="Quantity & Value" subtitle="Specify the quantity required and approximate cost">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <MField label="Quantity Required" error={errors.quantity} required>
                <input
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={set("quantity")}
                  placeholder="e.g. 10"
                  style={mInput(!!errors.quantity)}
                />
              </MField>
              <MField label="Unit of Measure">
                <select value={form.unit} onChange={set("unit")} style={mInput(false)}>
                  {["units","boxes","sets","litres","kg","metres","packets","pairs"].map(u => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
              </MField>
            </div>
            <MField label="Approximate Value (LKR)" error={errors.approxValue} required>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, fontWeight: 600, color: "#6B7280" }}>LKR</span>
                <input
                  type="number"
                  min={0}
                  value={form.approxValue}
                  onChange={set("approxValue")}
                  placeholder="e.g. 320000"
                  style={{ ...mInput(!!errors.approxValue), paddingLeft: 48 }}
                />
              </div>
            </MField>
            {form.approxValue && !isNaN(Number(form.approxValue)) && Number(form.approxValue) > 0 && (
              <div style={{
                padding: "12px 16px",
                background: "linear-gradient(135deg,#FFF7ED,#FEF3C7)",
                border: "1px solid #FDE68A",
                borderRadius: 10,
                fontSize: 12,
                color: "#92400E",
                fontWeight: 600,
              }}>
                💡 Estimated value:{" "}
                <span style={{ fontWeight: 800 }}>
                  LKR {Number(form.approxValue).toLocaleString("en-LK")}
                </span>
                {Number(form.approxValue) >= 500000
                  ? " — This will require TEC evaluation."
                  : " — HOD can directly approve this requisition."}
              </div>
            )}
          </StepCard>
        )}

        {step === 3 && (
          <StepCard title="Review & Sign" subtitle="Review your requisition details and sign before submitting">
            {/* Review summary */}
            <div style={{
              background: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginBottom: 20,
            }}>
              <ReviewRow label="Requisition Title"      value={form.title} />
              <ReviewRow label="Faculty"                value={form.faculty} />
              <ReviewRow label="Department"             value={form.department || "—"} />
              <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 12 }} />
              <ReviewRow label="Description"            value={form.description} multiline />
              <ReviewRow label="Reason for Requisition" value={form.reason} multiline />
              <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 12 }} />
              <ReviewRow label="Quantity Required"      value={`${form.quantity} ${form.unit}`} />
              <ReviewRow label="Approximate Value"      value={`LKR ${Number(form.approxValue || 0).toLocaleString("en-LK")}`} highlight />
            </div>

            {/* Prepared By (pre-filled, read-only) */}
            <MField label="Requisition Prepared By (Head of Department)">
              <input
                value={form.preparedBy}
                readOnly
                style={{ ...mInput(false), background: "#F9FAFB", color: "#374151", fontWeight: 600, cursor: "not-allowed" }}
              />
            </MField>

            {/* Signature */}
            <MField label="Signature (type your full name to sign)" error={errors.signature} required>
              <div style={{ position: "relative" }}>
                <input
                  value={form.signature}
                  onChange={set("signature")}
                  placeholder="Type your full name as signature…"
                  style={{
                    ...mInput(!!errors.signature),
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontStyle: "italic",
                    fontSize: 16,
                    letterSpacing: "0.04em",
                    paddingLeft: 48,
                    color: "#1E3A5F",
                  }}
                />
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 18 }}>✍️</span>
              </div>
              {form.signature && (
                <div style={{
                  marginTop: 8,
                  padding: "10px 14px",
                  background: "#FAFAFA",
                  border: "1px dashed #D1D5DB",
                  borderRadius: 8,
                  fontFamily: "Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 17,
                  color: "#1E3A5F",
                  letterSpacing: "0.05em",
                }}>
                  {form.signature}
                </div>
              )}
            </MField>

            {/* Declaration */}
            <div style={{
              padding: "12px 16px",
              background: "#F0FDF4",
              border: "1px solid #BBF7D0",
              borderRadius: 10,
              fontSize: 11,
              color: "#166534",
              lineHeight: 1.6,
            }}>
              <strong>Declaration:</strong> I hereby certify that the above requisition is genuine and within the approved budget allocation for my department. This requisition will be forwarded to the Bursar for fund verification.
            </div>
          </StepCard>
        )}

        {/* ── Navigation buttons ── */}
        <div style={{ display: "flex", gap: 10, justifyContent: "space-between", marginTop: 24 }}>
          <button
            type="button"
            onClick={step === 0 ? onSubmit : back}
            style={{
              padding: "10px 22px",
              background: "#F3F4F6",
              color: "#374151",
              border: "1px solid #E5E7EB",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            {step === 0 ? "Cancel" : <><ChevronLeft size={15} strokeWidth={2.5} /> Back</>}
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={next}
              style={{
                padding: "10px 28px",
                background: "#7A0C0C",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Next <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              style={{
                padding: "10px 28px",
                background: "#7A0C0C",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Submit Requisition
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ marginBottom: 4 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: "0 0 4px" }}>{title}</h3>
        <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function MField({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
        {label}{required && <span style={{ color: "#EF4444", marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {error && <p style={{ margin: "5px 0 0", fontSize: 11, color: "#DC2626", fontWeight: 500 }}>⚠ {error}</p>}
    </div>
  );
}

function ReviewRow({ label, value, multiline, highlight }: { label: string; value: string; multiline?: boolean; highlight?: boolean }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 8, alignItems: multiline ? "flex-start" : "center" }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
      <span style={{
        fontSize: 13,
        fontWeight: highlight ? 800 : 500,
        color: highlight ? "#B45309" : "#111827",
        wordBreak: "break-word",
        whiteSpace: multiline ? "pre-wrap" : "normal",
      }}>{value}</span>
    </div>
  );
}

const mInput = (hasError: boolean): React.CSSProperties => ({
  width: "100%",
  padding: "10px 13px",
  border: `1.5px solid ${hasError ? "#EF4444" : "#E5E7EB"}`,
  borderRadius: 9,
  fontSize: 13,
  color: "#111827",
  background: "#FFFFFF",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  transition: "border-color 0.2s",
});

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

function QualityReportPanel({ onViewProcurementDetails, user }: { onViewProcurementDetails: (id: string) => void; user: UserContext }) {
  const list = getProcurementsForRole(user);
  const needsReport = list.filter(p => p.status === "Quality Report Required");
  const [submittedReports, setSubmittedReports] = useState<Set<string>>(new Set());

  const handleSubmitReport = (pr: any) => {
    pr.status = "Payment Pending";
    pr.updatedAt = new Date().toISOString();
    pr.activityLogs = [
      {
        id: `log-hod-qr-${Date.now()}`,
        stepIndex: 8,
        actor: user.name,
        role: "Head of Department",
        action: `Quality inspection completed. Goods meet requested specifications. Quality Report approved and forwarded to Finance.`,
        timestamp: new Date().toISOString(),
      },
      ...(pr.activityLogs ?? []),
    ];
    setSubmittedReports(p => new Set([...p, pr.id]));
  };

  const pendingReports = needsReport.filter(p => !submittedReports.has(p.id));

  return (
    <div style={{ padding: "28px 28px" }}>
      <PageTitleBar title="Quality Reports" subtitle="Submit inspection reports for delivered goods" />
      {pendingReports.length === 0 ? (
        <div style={{ background: "#FFFFFF", borderRadius: 14, padding: "48px", textAlign: "center", color: "#9CA3AF", border: "1px solid #F1F5F9" }}>No quality reports pending</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {pendingReports.map(pr => (
            <div key={pr.id} style={{ background: "#FFFFFF", border: "1px solid #F1F5F9", borderRadius: 14, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
              <button onClick={() => handleSubmitReport(pr)} style={{ padding: "9px 20px", background: "#7A0C0C", color: "#FFFFFF", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Submit Report</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FormRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
        {label}{required && <span style={{ color: "#EF4444", marginLeft: 2 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, color: "#111827", background: "#FFFFFF", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };

function StockInquiryPanel() {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Mock central stock inventory
  const mockInventory = [
    { name: "Whiteboards (4x6ft)", quantity: 12, unit: "pcs", lastUpdated: "2026-02-20T08:00:00Z", location: "Central Store - Shelf B3" },
    { name: "Markers (Black, Box)", quantity: 45, unit: "boxes", lastUpdated: "2026-02-20T08:00:00Z", location: "Central Store - Drawer D2" },
    { name: "A4 Paper (80gsm)", quantity: 250, unit: "reams", lastUpdated: "2026-02-19T14:00:00Z", location: "Central Store - Shelf A1" },
    { name: "Printer Toner (HP LaserJet)", quantity: 8, unit: "cartridges", lastUpdated: "2026-02-19T10:00:00Z", location: "IT Storage - Cabinet 1" },
    { name: "Desk Lamps (LED)", quantity: 23, unit: "pcs", lastUpdated: "2026-02-18T16:00:00Z", location: "Facilities - Shelf F2" },
    { name: "Microscope Slides", quantity: 500, unit: "boxes", lastUpdated: "2026-02-17T09:00:00Z", location: "Biology Lab - Storage 2" },
    { name: "Petri Dishes (90mm)", quantity: 1200, unit: "pcs", lastUpdated: "2026-02-17T09:00:00Z", location: "Biology Lab - Cabinet A" },
    { name: "Distilled Water (1L)", quantity: 30, unit: "bottles", lastUpdated: "2026-02-16T11:00:00Z", location: "Chemistry Lab - Shelf C3" },
  ];

  return (
    <div style={{ padding: "28px 32px" }}>
      <PageTitleBar
        title="Stock Inquiry"
        subtitle="Query real-time stock levels from Supply Division Central Store"
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
        {/* Left: Inventory Search */}
        <div>
          <InventoryCard items={mockInventory} onSelect={setSelectedItem} />
        </div>

        {/* Right: Selected Item Details */}
        <div>
          {selectedItem ? (
            <div style={{
              background: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
                Item Details
              </h3>

              <div style={{
                padding: 12,
                background: "#F0FDF4",
                border: "1px solid #BBF7D0",
                borderRadius: 8,
              }}>
                <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Item Name</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
                  {selectedItem.name}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{
                  padding: 12,
                  background: "#EFF6FF",
                  border: "1px solid #BFDBFE",
                  borderRadius: 8,
                }}>
                  <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Current Stock</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#1D4ED8" }}>
                    {selectedItem.quantity}
                  </div>
                </div>
                <div style={{
                  padding: 12,
                  background: "#FFF7ED",
                  border: "1px solid #FED7AA",
                  borderRadius: 8,
                }}>
                  <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Unit</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#C2410C" }}>
                    {selectedItem.unit}
                  </div>
                </div>
              </div>

              <div style={{
                padding: 12,
                background: "#F5F3FF",
                border: "1px solid #DDD6FE",
                borderRadius: 8,
              }}>
                <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Location</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#6D28D9" }}>
                  {selectedItem.location}
                </div>
              </div>

              <div style={{
                padding: 12,
                background: "#FAFAFA",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
              }}>
                <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Last Updated</div>
                <div style={{ fontSize: 12, color: "#111827" }}>
                  {new Date(selectedItem.lastUpdated).toLocaleString()}
                </div>
              </div>

              {selectedItem.quantity < 10 && (
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
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#DC2626" }}>
                      Low Stock Alert
                    </div>
                    <div style={{ fontSize: 11, color: "#DC2626", marginTop: 2 }}>
                      Current quantity is below safe reorder level. Consider placing a procurement request.
                    </div>
                  </div>
                </div>
              )}

              <div style={{
                display: "flex",
                gap: 10,
                paddingTop: 12,
                borderTop: "1px solid #E5E7EB",
              }}>
                <button style={{
                  flex: 1,
                  padding: "9px 16px",
                  background: "#7A0C0C",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}>
                  Place Request
                </button>
                <button style={{
                  flex: 1,
                  padding: "9px 16px",
                  background: "#F3F4F6",
                  color: "#374151",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}>
                  Export Details
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              background: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              padding: 24,
              textAlign: "center",
              color: "#9CA3AF",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 300,
            }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>📋</div>
              <p style={{ fontSize: 12, margin: 0 }}>Select an item to view detailed stock information</p>
            </div>
          )}
        </div>
      </div>

      {/* Info section */}
      <div style={{
        marginTop: 20,
        padding: 14,
        background: "#EFF6FF",
        border: "1px solid #BFDBFE",
        borderRadius: 8,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#1D4ED8", marginBottom: 4 }}>
          ℹ️ How to use Stock Inquiry
        </div>
        <div style={{ fontSize: 11, color: "#1D4ED8" }}>
          Search for items in the left panel to check current stock levels. Use this information to verify item availability before submitting a purchase requisition. Contact Supply Division directly if you need items not listed here.
        </div>
      </div>
    </div>
  );
}
