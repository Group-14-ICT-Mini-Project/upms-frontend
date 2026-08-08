import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { BidEntry, Procurement, ProcurementMethod, ProcurementStatus, Role, UserContext } from "./types";
import { MOCK_PROCUREMENTS, filterProcurementsForRole } from "./data";
import * as procurementApi from "../api/procurements";
import { ApiError } from "../api/client";

interface ProcurementContextValue {
  procurements: Procurement[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getProcurementsForUser: (user: UserContext) => Procurement[];
  createRequisition: (payload: procurementApi.CreateProcurementRequest) => Promise<Procurement>;
  updateProcurement: (id: string, payload: procurementApi.UpdateProcurementRequest, actor?: { name: string; role: Role }) => Promise<Procurement>;
  submitBid: (procurementId: string, payload: procurementApi.SubmitBidRequest) => Promise<BidEntry>;
}

const ProcurementContext = createContext<ProcurementContextValue | null>(null);

function nextProcurementId(existing: Procurement[]) {
  const max = existing.reduce((highest, item) => {
    const number = Number(item.id.match(/\d+$/)?.[0] ?? 0);
    return Math.max(highest, number);
  }, 0);
  return `PR-2026-${String(max + 1).padStart(3, "0")}`;
}

function mergeProcurement(list: Procurement[], next: Procurement) {
  const exists = list.some(item => item.id === next.id);
  return exists ? list.map(item => item.id === next.id ? next : item) : [next, ...list];
}

function applyLocalUpdate(current: Procurement, payload: procurementApi.UpdateProcurementRequest, actor?: { name: string; role: Role }): Procurement {
  const timestamp = new Date().toISOString();
  const actionParts = [
    payload.status ? `Status changed to ${payload.status}` : null,
    payload.method ? `Method selected: ${payload.method}` : null,
    payload.budgetCode ? `Budget code: ${payload.budgetCode}` : null,
    payload.poNumber ? `PO: ${payload.poNumber}` : null,
    payload.grnNumber ? `GRN: ${payload.grnNumber}` : null,
    payload.notes ?? null,
  ].filter(Boolean);

  return {
    ...current,
    ...payload,
    updatedAt: timestamp,
    activityLog: actor ? [
      ...(current.activityLog ?? []),
      {
        id: `log-${Date.now()}`,
        stepIndex: 0,
        actor: actor.name,
        role: actor.role,
        action: actionParts.join(". ") || "Procurement updated.",
        timestamp,
      },
    ] : current.activityLog,
  };
}

export function ProcurementProvider({ children }: { children: React.ReactNode }) {
  const [procurements, setProcurements] = useState<Procurement[]>(MOCK_PROCUREMENTS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await procurementApi.listProcurements();
      setProcurements(data);
    } catch (err) {
      if (!(err instanceof ApiError && err.status === 401)) {
        setError(err instanceof Error ? err.message : "Failed to load procurements");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<ProcurementContextValue>(() => ({
    procurements,
    isLoading,
    error,
    refresh,
    getProcurementsForUser(user) {
      return filterProcurementsForRole(procurements, user);
    },
    async createRequisition(payload) {
      try {
        const created = await procurementApi.createProcurement(payload);
        setProcurements(current => mergeProcurement(current, created));
        return created;
      } catch {
        const created: Procurement = {
          id: nextProcurementId(procurements),
          title: payload.title,
          faculty: payload.faculty,
          department: payload.department,
          value: payload.value,
          method: "â€”" as ProcurementMethod,
          status: "Pending Fund Verification",
          updatedAt: new Date().toISOString(),
          submittedBy: payload.submittedBy,
          description: payload.description,
          activityLog: [{
            id: `log-${Date.now()}`,
            stepIndex: 0,
            actor: payload.submittedBy ?? "HOD",
            role: "HOD",
            action: "Purchase requisition created.",
            timestamp: new Date().toISOString(),
          }],
        };
        setProcurements(current => [created, ...current]);
        return created;
      }
    },
    async updateProcurement(id, payload, actor) {
      try {
        const updated = await procurementApi.updateProcurement(id, payload);
        setProcurements(current => mergeProcurement(current, updated));
        return updated;
      } catch {
        let updated: Procurement | null = null;
        setProcurements(current => current.map(item => {
          if (item.id !== id) return item;
          updated = applyLocalUpdate(item, payload, actor);
          return updated;
        }));
        if (!updated) throw new Error(`Procurement ${id} was not found`);
        return updated;
      }
    },
    async submitBid(procurementId, payload) {
      try {
        const bid = await procurementApi.submitBid(procurementId, payload);
        await refresh();
        return bid;
      } catch {
        const bid: BidEntry = {
          bidderName: payload.bidderName,
          bidderContact: payload.bidderContact,
          amount: payload.amount,
          submittedAt: new Date().toISOString(),
          notes: payload.technicalSpec,
        };
        setProcurements(current => current.map(item => item.id === procurementId
          ? { ...item, bids: [...(item.bids ?? []), bid], updatedAt: new Date().toISOString() }
          : item
        ));
        return bid;
      }
    },
  }), [procurements, isLoading, error, refresh]);

  return <ProcurementContext.Provider value={value}>{children}</ProcurementContext.Provider>;
}

export function useProcurements() {
  const value = useContext(ProcurementContext);
  if (!value) {
    throw new Error("useProcurements must be used inside ProcurementProvider");
  }
  return value;
}
