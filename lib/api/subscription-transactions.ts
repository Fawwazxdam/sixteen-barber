import { apiFetch } from "./client";

export type SubscriptionTransaction = {
  id: string;
  tenantId: string;
  planId: string;
  subscriptionId: string | null;
  amount: number;
  status: "pending" | "approved" | "rejected";
  paymentProofUrl: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  // Optional relations
  plan?: {
    id: string;
    name: string;
  };
  tenant?: {
    id: string;
    name: string;
  };
};

export async function createSubscriptionTransaction(data: FormData) {
  const res = await apiFetch("/subscription-transactions", {
    method: "POST",
    body: data,
    multipart: true,
  });

  return res.data;
}

export async function getMySubscriptionTransactions() {
  const res = await apiFetch<SubscriptionTransaction[]>("/subscription-transactions/my-transactions");
  return res.data;
}
