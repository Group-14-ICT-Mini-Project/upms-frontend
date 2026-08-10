import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { CheckCircle2, Loader2, RefreshCw, ShieldCheck, UserX, XCircle } from "lucide-react";
import type { UserContext } from "../dashboard/types";
import * as adminUsersApi from "../api/adminUsers";

interface AdminDashboardProps {
  user: UserContext;
}

function formatRole(roles: string[]) {
  return roles[0]?.replaceAll("_", " ") ?? "Unknown role";
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fullName(user: adminUsersApi.PendingUser) {
  const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  return name || user.username;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [pendingUsers, setPendingUsers] = useState<adminUsersApi.PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionUserId, setActionUserId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const pendingCount = pendingUsers.length;
  const latestRequest = useMemo(() => {
    return pendingUsers[0]?.createdAt ? formatDate(pendingUsers[0].createdAt) : "No pending requests";
  }, [pendingUsers]);

  async function loadPendingUsers() {
    setIsLoading(true);
    setError("");
    try {
      setPendingUsers(await adminUsersApi.getPendingUsers());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load pending users");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadPendingUsers();
  }, []);

  async function handleApprove(request: adminUsersApi.PendingUser) {
    setActionUserId(request.id);
    setError("");
    setNotice("");
    try {
      const response = await adminUsersApi.approveUser(request.id);
      setPendingUsers((current) => current.filter((pending) => pending.id !== request.id));
      setNotice(response.emailWarning
        ? `${request.username} approved. Email warning: ${response.emailWarning}`
        : `${request.username} approved and notified by email.`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to approve user");
    } finally {
      setActionUserId(null);
    }
  }

  async function handleReject(request: adminUsersApi.PendingUser) {
    const reason = window.prompt(`Reason for rejecting ${request.username}?`);
    if (reason === null) return;
    setActionUserId(request.id);
    setError("");
    setNotice("");
    try {
      await adminUsersApi.rejectUser(request.id, reason);
      setPendingUsers((current) => current.filter((pending) => pending.id !== request.id));
      setNotice(`${request.username} rejected.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reject user");
    } finally {
      setActionUserId(null);
    }
  }

  return (
    <div style={{ padding: "28px", maxWidth: 1180 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14, marginBottom: 20 }}>
        <section style={statCardStyle}>
          <div style={statIconStyle}><ShieldCheck size={18} /></div>
          <div>
            <div style={statLabelStyle}>Signed in as</div>
            <div style={statValueStyle}>{user.name}</div>
          </div>
        </section>
        <section style={statCardStyle}>
          <div style={statIconStyle}><CheckCircle2 size={18} /></div>
          <div>
            <div style={statLabelStyle}>Pending requests</div>
            <div style={statValueStyle}>{pendingCount}</div>
          </div>
        </section>
        <section style={statCardStyle}>
          <div style={statIconStyle}><RefreshCw size={18} /></div>
          <div>
            <div style={statLabelStyle}>Oldest request</div>
            <div style={{ ...statValueStyle, fontSize: 15 }}>{latestRequest}</div>
          </div>
        </section>
      </div>

      <section style={{
        background: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
      }}>
        <div style={{
          padding: "18px 20px",
          borderBottom: "1px solid #EEF2F7",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#111827" }}>User Access Requests</h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6B7280" }}>
              Review new accounts before they can sign in to UPMS.
            </p>
          </div>
          <button onClick={loadPendingUsers} disabled={isLoading} style={secondaryButtonStyle}>
            {isLoading ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
            Refresh
          </button>
        </div>

        {notice && (
          <div style={{ padding: "12px 20px", background: "#ECFDF5", color: "#047857", fontSize: 13, borderBottom: "1px solid #A7F3D0" }}>
            {notice}
          </div>
        )}
        {error && (
          <div style={{ padding: "12px 20px", background: "#FEF2F2", color: "#B91C1C", fontSize: 13, borderBottom: "1px solid #FECACA", display: "flex", gap: 8, alignItems: "center" }}>
            <XCircle size={15} />
            {error}
          </div>
        )}

        {isLoading ? (
          <div style={emptyStateStyle}>
            <Loader2 size={24} className="animate-spin" />
            <span>Loading pending requests...</span>
          </div>
        ) : pendingUsers.length === 0 ? (
          <div style={emptyStateStyle}>
            <ShieldCheck size={28} color="#047857" />
            <span>No pending access requests.</span>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 860 }}>
              <thead>
                <tr style={{ background: "#F9FAFB", color: "#6B7280", fontSize: 12, textAlign: "left" }}>
                  <th style={thStyle}>User</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Requested Role</th>
                  <th style={thStyle}>Faculty / Department</th>
                  <th style={thStyle}>Submitted</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((request) => {
                  const isBusy = actionUserId === request.id;
                  return (
                    <tr key={request.id} style={{ borderTop: "1px solid #EEF2F7" }}>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 800, color: "#111827" }}>{fullName(request)}</div>
                        <div style={{ fontSize: 12, color: "#6B7280" }}>@{request.username}</div>
                      </td>
                      <td style={tdStyle}>{request.email}</td>
                      <td style={tdStyle}>
                        <span style={rolePillStyle}>{formatRole(request.roles)}</span>
                      </td>
                      <td style={tdStyle}>
                        <div>{request.faculty || "Not required"}</div>
                        {request.department && <div style={{ fontSize: 12, color: "#6B7280" }}>{request.department}</div>}
                      </td>
                      <td style={tdStyle}>{formatDate(request.createdAt)}</td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: 8 }}>
                          <button onClick={() => handleReject(request)} disabled={isBusy} style={dangerButtonStyle}>
                            {isBusy ? <Loader2 size={14} className="animate-spin" /> : <UserX size={14} />}
                            Reject
                          </button>
                          <button onClick={() => handleApprove(request)} disabled={isBusy} style={primaryButtonStyle}>
                            {isBusy ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                            Approve
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

const statCardStyle: CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #E5E7EB",
  borderRadius: 8,
  padding: "16px",
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const statIconStyle: CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 8,
  background: "#F9FAFB",
  color: "#7A0C0C",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const statLabelStyle: CSSProperties = { fontSize: 12, color: "#6B7280", marginBottom: 2 };
const statValueStyle: CSSProperties = { fontSize: 20, fontWeight: 800, color: "#111827" };
const thStyle: CSSProperties = { padding: "12px 16px", fontWeight: 800 };
const tdStyle: CSSProperties = { padding: "14px 16px", fontSize: 13, color: "#374151", verticalAlign: "middle" };
const emptyStateStyle: CSSProperties = {
  minHeight: 220,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  gap: 10,
  color: "#6B7280",
  fontSize: 14,
};

const baseButtonStyle: CSSProperties = {
  border: "none",
  borderRadius: 7,
  padding: "8px 12px",
  fontSize: 12,
  fontWeight: 800,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

const primaryButtonStyle: CSSProperties = { ...baseButtonStyle, background: "#7A0C0C", color: "#FFFFFF" };
const dangerButtonStyle: CSSProperties = { ...baseButtonStyle, background: "#FEF2F2", color: "#B91C1C" };
const secondaryButtonStyle: CSSProperties = { ...baseButtonStyle, background: "#F9FAFB", color: "#374151", border: "1px solid #E5E7EB" };
const rolePillStyle: CSSProperties = {
  display: "inline-block",
  padding: "4px 8px",
  borderRadius: 999,
  background: "#F3F4F6",
  color: "#374151",
  fontSize: 11,
  fontWeight: 800,
};
