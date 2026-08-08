import { Routes, Route, Navigate, useNavigate, useParams } from "react-router";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { LoginScreen } from "./components/LoginScreen";
import { RegisterScreen } from "./components/RegisterScreen";
import { WaitingApproval } from "./components/WaitingApproval";
import { DashboardLayout } from "./dashboard/DashboardLayout";
import type { Role } from "./dashboard/types";
import { ROLE_META } from "./dashboard/types";
import { useState } from "react";
import usjLogo from "../usj-logo.png";

export default function App() {
  return (
    <Routes>
      <Route path="/"             element={<WelcomeRoute />} />
      <Route path="/login"        element={<LoginRoute />} />
      <Route path="/register"     element={<RegisterRoute />} />
      <Route path="/waiting"      element={<WaitingRoute />} />
      <Route path="/select-role"  element={<RolePickerRoute />} />
      <Route path="/dashboard/:role/*" element={<DashboardRoute />} />
      {/* Fallback — redirect anything unknown back to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


function WelcomeRoute() {
  const nav = useNavigate();
  return (
    <WelcomeScreen
      onLogin={() => nav("/login")}
      onSignUp={() => nav("/register")}
    />
  );
}

function LoginRoute() {
  const nav = useNavigate();
  return (
    <LoginScreen
      onBack={() => nav("/")}
      onLoginSuccess={() => nav("/select-role")}
      onGoRegister={() => nav("/register")}
    />
  );
}

function RegisterRoute() {
  const nav = useNavigate();
  return (
    <RegisterScreen
      onBack={() => nav("/")}
      onRegisterSuccess={() => nav("/waiting")}
      onGoLogin={() => nav("/login")}
    />
  );
}

function WaitingRoute() {
  const nav = useNavigate();
  return (
    <WaitingApproval
      onGoBack={() => nav("/register")}
      onBackToLogin={() => nav("/login")}
    />
  );
}

function RolePickerRoute() {
  const nav = useNavigate();
  return (
    <RolePicker onSelect={(role) => nav(`/dashboard/${role.toLowerCase()}`)} />
  );
}

function DashboardRoute() {
  const nav = useNavigate();
  const { role: roleParam } = useParams<{ role: string }>();
  const roleSlug = (roleParam ?? "").toUpperCase() as Role;
  const validRoles: Role[] = ["HOD", "BUR", "FBUR", "SDC", "TEC", "TB", "STK", "SUP", "FIN"];
  if (!validRoles.includes(roleSlug)) {
    return <Navigate to="/select-role" replace />;
  }
  return (
    <DashboardLayout
      role={roleSlug}
      onLogout={() => nav("/select-role")}
    />
  );
}


const ROLES: Role[] = ["HOD", "BUR", "FBUR", "SDC", "TEC", "TB", "STK", "SUP", "FIN"];

function RolePicker({ onSelect }: { onSelect: (r: Role) => void }) {
  const [hovered, setHovered] = useState<Role | null>(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        fontFamily: "'Inter', 'Google Sans', system-ui, sans-serif",
      }}
    >
      {/* Logo + title */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 14,
            background: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(245,158,11,0.20)",
            flexShrink: 0,
            padding: 4,
          }}
        >
          <img
            src={usjLogo}
            alt="University of Sri Jayewardenepura"
            style={{ width: 56, height: 56, objectFit: "contain" }}
          />
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#F59E0B", margin: 0, letterSpacing: "-0.02em" }}>
            University Procurement Management System
          </h1>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "3px 0 0" }}>
            University of Sri Jayewardenepura · Demo Prototype
          </p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: "2px 0 0" }}>
            Compliant with Sri Lanka Procurement Manual 2024 (NPC)
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: "100%", maxWidth: 640, height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 28 }} />

      {/* Heading */}
      <div style={{ width: "100%", maxWidth: 640, marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#F59E0B", margin: 0, marginBottom: 4 }}>
          Select a role to demo
        </h2>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>
          No backend required — data persists in your browser session.
        </p>
      </div>

      {/* Role grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          width: "100%",
          maxWidth: 640,
        }}
      >
        {ROLES.map(role => {
          const meta = ROLE_META[role];
          const isHovered = hovered === role;
          return (
            <button
              key={role}
              onClick={() => onSelect(role)}
              onMouseEnter={() => setHovered(role)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: isHovered ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${isHovered ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.10)"}`,
                borderRadius: 10,
                padding: "18px 20px",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.15s",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#FFFFFF", letterSpacing: "0.04em" }}>
                    {role}
                  </span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>
                    {meta.label}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4, lineHeight: 1.4 }}>
                    {meta.description}
                  </div>
                </div>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.3)", marginLeft: 12 }}>→</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Workflow hint */}
      <p
        style={{
          marginTop: 28,
          fontSize: 11,
          color: "rgba(255,255,255,0.3)",
          maxWidth: 640,
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: "rgba(255,255,255,0.5)" }}>Demo workflow:</strong>{" "}
        Sign in as HOD → create requisition → switch to Bursar → verify funds → Supplies Clerk → open bidding → Supplier → submit bid → TEC → evaluate → Tender Board → approve → Storekeeper → GRN → HOD quality report → Finance payment.
      </p>
    </div>
  );
}
