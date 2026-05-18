// types/tenants.ts

export type Tenant = {
  id: string;
  name: string;
  slug: string;
  phone: string;
  address: string;
  isActive: boolean;
  openTime: string;
  closeTime: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateTenantData = {
  name: string;
  slug: string;
  phone: string;
  address: string;
  openTime: string;
  closeTime: string;
};

// Menggunakan tipe ini untuk form edit, karena slug tidak boleh diubah
export type UpdateTenantData = Partial<Omit<CreateTenantData, "slug">>;

// --- [OPSIONAL] ---
// Kamu juga bisa menambahkan tipe untuk Stats di sini agar lebih rapi
// dan tidak perlu inline typing di dalam page.tsx atau api.ts
export type TenantStats = {
  barberCount: number;
  bookingCount: number;
  hasActiveSubscription: boolean;
  subscription?: {
    plan: string;
    endsAt: string;
  } | null;
};

export type DashboardStats = {
  tenantName: string;
  activeBarbers: number;
  todayBookings: number;
  pendingBookings: number;
  openTime: string;
  closeTime: string;
};