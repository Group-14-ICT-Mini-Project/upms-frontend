import { apiRequest } from "./client";

export interface PendingUser {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  faculty?: string;
  department?: string;
  roles: string[];
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export interface UserApprovalActionResponse {
  userId: number;
  username: string;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  message: string;
  emailSent: boolean;
  emailWarning?: string;
}

export function getPendingUsers() {
  return apiRequest<PendingUser[]>("/v1/admin/users/pending");
}

export function approveUser(userId: number) {
  return apiRequest<UserApprovalActionResponse>(`/v1/admin/users/${userId}/approve`, {
    method: "POST",
  });
}

export function rejectUser(userId: number, reason?: string) {
  return apiRequest<UserApprovalActionResponse>(`/v1/admin/users/${userId}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}
