import type { BidEntry, Procurement, ProcurementMethod, ProcurementStatus } from "../dashboard/types";
import { apiRequest, getAuthToken } from "./client";

const PROCUREMENT_API_BASE_URL =
  import.meta.env.VITE_PROCUREMENT_API_BASE_URL ?? "https://upms-backend-37xy.onrender.com/api";

export interface CreateProcurementRequest {
  title: string;
  faculty: string;
  department?: string;
  description?: string;
  estimatedValue: number;
  procurementMethodId: number;
  procurementCategoryId: number;
  openingDate: string;
  closingDate: string;
  documentFee: number;
  requiresBidBond: boolean;
  bidBondPercentage?: number;
  submittedBy?: string;
  quantity?: number;
  unit?: string;
  reason?: string;
  signature?: string;
  requisitionType?: "Consumables" | "Capital Goods";
  currentStockBalance?: number;
  fundingSource?: string;
}

export interface UpdateProcurementRequest {
  status?: ProcurementStatus;
  method?: ProcurementMethod;
  title?: string;
  description?: string;
  estimatedValue?: number;
  openingDate?: string;
  closingDate?: string;
  documentFee?: number;
  requiresBidBond?: boolean;
  bidBondPercentage?: number;
  faculty?: string;
  department?: string;
  requisitionType?: "Consumables" | "Capital Goods";
  currentStockBalance?: number;
  fundingSource?: string;
  budgetCode?: string;
  availableFunds?: number;
  notes?: string;
  poNumber?: string;
  supplierName?: string;
  grnNumber?: string;
  invoiceNumber?: string;
  invoiceAmount?: number;
}

export interface SubmitBidRequest {
  bidderName: string;
  bidderContact?: string;
  amount: number;
  technicalSpec?: string;
  bidBond: boolean;
  vatDeclaration: boolean;
}

interface BackendProcurementResponse {
  id: number;
  referenceNumber?: string;
  title: string;
  description?: string;
  estimatedValue: number;
  procurementMethodName?: string;
  categoryName?: string;
  status?: string;
  openingDate?: string;
  closingDate?: string;
  documentFee?: number;
  requiresBidBond?: boolean;
  bidBondPercentage?: number;
  createdByUserId?: number;
  createdDate?: string;
  updatedDate?: string;
  faculty?: string;
  department?: string;
  requisitionType?: "Consumables" | "Capital Goods";
  currentStockBalance?: number;
  fundingSource?: string;
  budgetCode?: string;
  supplierName?: string;
  poNumber?: string;
  grnNumber?: string;
  invoiceNumber?: string;
  invoiceAmount?: number;
}

interface PageResponse<T> {
  content?: T[];
}

async function procurementRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${PROCUREMENT_API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.text();
      message = body || message;
    } catch {
      // Keep default message.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function mapStatus(status?: string): ProcurementStatus {
  if (!status) return "Pending Fund Verification";
  const normalized = status.toUpperCase().replace(/\s+/g, "_");
  if (normalized === "DRAFT") return "Pending Fund Verification";
  if (normalized === "PUBLISHED") return "Bidding Open";
  if (normalized === "CLOSED" || normalized === "UNDER_EVALUATION") return "Technical Evaluation";
  if (normalized === "EVALUATED") return "Authority Approval";
  if (normalized === "AWARDED" || normalized === "PURCHASE_ORDER_ISSUED") return "Purchase Order Issued";
  if (normalized === "COMPLETED") return "Completed";
  if (normalized === "CANCELLED") return "Rejected";
  return status as ProcurementStatus;
}

function mapMethod(methodName?: string): ProcurementMethod {
  const normalized = methodName?.toUpperCase() ?? "";
  if (normalized.includes("SHOPPING") || normalized.includes("NSM")) return "Shopping";
  if (normalized.includes("NCB") || normalized.includes("NATIONAL COMPETITIVE")) return "NCB";
  if (normalized.includes("ICB")) return "ICB";
  return "—";
}

function mapProcurement(response: BackendProcurementResponse): Procurement {
  const timestamp = response.updatedDate ?? response.createdDate ?? new Date().toISOString();

  return {
    id: String(response.id),
    title: response.title,
    faculty: response.faculty ?? "Faculty of Applied Sciences",
    department: response.department,
    value: Number(response.estimatedValue ?? 0),
    method: mapMethod(response.procurementMethodName),
    status: mapStatus(response.status),
    updatedAt: timestamp,
    submittedBy: response.createdByUserId ? `User ${response.createdByUserId}` : undefined,
    description: response.description,
    requisitionType: response.requisitionType,
    currentStockBalance: response.currentStockBalance,
    fundingSource: response.fundingSource,
    budgetCode: response.budgetCode,
    supplierName: response.supplierName,
    poNumber: response.poNumber,
    grnNumber: response.grnNumber,
    invoiceNumber: response.invoiceNumber,
    invoiceAmount: response.invoiceAmount,
    openingDate: response.openingDate,
    closingDate: response.closingDate,
    documentFee: response.documentFee,
    requiresBidBond: response.requiresBidBond,
    bidBondPercentage: response.bidBondPercentage,
    biddingDeadline: response.closingDate,
    activityLog: [{
      id: `log-${response.id}`,
      stepIndex: 0,
      actor: response.createdByUserId ? `User ${response.createdByUserId}` : "HOD",
      role: "HOD",
      action: `Procurement ${response.referenceNumber ?? response.id} loaded from backend.`,
      timestamp,
    }],
  };
}

export function listProcurements() {
  return procurementRequest<PageResponse<BackendProcurementResponse>>("/v1/procurement/list?page=0&size=100")
    .then(page => (page.content ?? []).map(mapProcurement));
}

export function getProcurement(id: string) {
  return procurementRequest<BackendProcurementResponse>(`/v1/procurement/${encodeURIComponent(id)}`)
    .then(mapProcurement);
}

export function createProcurement(payload: CreateProcurementRequest) {
  return procurementRequest<BackendProcurementResponse>("/v1/procurement/create", {
    method: "POST",
    body: JSON.stringify(payload),
  }).then(mapProcurement);
}

export function updateProcurement(id: string, payload: UpdateProcurementRequest) {
  return procurementRequest<BackendProcurementResponse>(`/v1/procurement/${encodeURIComponent(id)}/update`, {
    method: "PUT",
    body: JSON.stringify(payload),
  }).then(mapProcurement);
}

export function submitBid(procurementId: string, payload: SubmitBidRequest) {
  return apiRequest<BidEntry>(`/procurements/${encodeURIComponent(procurementId)}/bids`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
