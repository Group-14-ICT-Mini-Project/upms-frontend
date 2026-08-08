import type { BidEntry, Procurement, ProcurementMethod, ProcurementStatus } from "../dashboard/types";
import { apiRequest } from "./client";

export interface CreateProcurementRequest {
  title: string;
  faculty: string;
  department?: string;
  description?: string;
  value: number;
  submittedBy?: string;
  quantity?: number;
  unit?: string;
  reason?: string;
  signature?: string;
}

export interface UpdateProcurementRequest {
  status?: ProcurementStatus;
  method?: ProcurementMethod;
  budgetCode?: string;
  availableFunds?: number;
  notes?: string;
  poNumber?: string;
  supplierName?: string;
  grnNumber?: string;
}

export interface SubmitBidRequest {
  bidderName: string;
  bidderContact?: string;
  amount: number;
  technicalSpec?: string;
  bidBond: boolean;
  vatDeclaration: boolean;
}

export function listProcurements() {
  return apiRequest<Procurement[]>("/procurements");
}

export function getProcurement(id: string) {
  return apiRequest<Procurement>(`/procurements/${encodeURIComponent(id)}`);
}

export function createProcurement(payload: CreateProcurementRequest) {
  return apiRequest<Procurement>("/procurements", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateProcurement(id: string, payload: UpdateProcurementRequest) {
  return apiRequest<Procurement>(`/procurements/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function submitBid(procurementId: string, payload: SubmitBidRequest) {
  return apiRequest<BidEntry>(`/procurements/${encodeURIComponent(procurementId)}/bids`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
