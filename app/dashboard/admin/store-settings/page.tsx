"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api/client";
import {
  getTenantStats,
  getCurrentTenant,
  getTenants,
} from "@/lib/api/tenants";
import type { Tenant, UpdateTenantData, TenantStats } from "@/types/tenants";

export default function StoreSettingsPage() {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [allTenants, setAllTenants] = useState<Tenant[]>([]);
  const [stats, setStats] = useState<TenantStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<UpdateTenantData>({});

  async function loadData() {
    setLoading(true);
    try {
      console.log("Attempting to fetch current tenant...");

      const currentTenant = await getCurrentTenant();
      if (!currentTenant || !currentTenant.id) {
        throw new Error("Invalid or missing tenant data");
      }

      setTenant(currentTenant);
      setFormData({
        name: currentTenant.name,
        phone: currentTenant.phone,
        address: currentTenant.address,
        openTime: currentTenant.openTime,
        closeTime: currentTenant.closeTime,
      });

      // Ambil stats dan all tenants (Bisa diparalelkan)
      const [statsData, allTenantsData] = await Promise.allSettled([
        getTenantStats(currentTenant.id),
        getTenants(),
      ]);

      if (statsData.status === "fulfilled" && statsData.value) {
        setStats(statsData.value);
      } else {
        // Fallback default
        setStats({
          barberCount: 0,
          bookingCount: 0,
          hasActiveSubscription: false,
          subscription: null, // Pakai null, bukan undefined agar konsisten dengan BE
        });
      }

      if (allTenantsData.status === "fulfilled" && allTenantsData.value) {
        setAllTenants(allTenantsData.value);
      } else {
        setAllTenants([]);
      }
    } catch (error) {
      console.error("Failed to load store settings:", error);
      setTenant(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSave() {
    if (!tenant) return;
    setSaving(true);
    try {
      // Pastikan endpoint-nya me-return Envelope, atau sesuaikan jika masih langsung
      await apiFetch(`/tenants/${tenant.id}`, {
        method: "PATCH",
        body: JSON.stringify(formData),
      });
      setIsEditing(false);
      await loadData();
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Loading store settings...</p>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="p-8">
        <p className="text-red-500">Store not found or unauthorized</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* ... [BAGIAN JSX DI BAWAH INI SAMA PERSIS, TIDAK ADA PERUBAHAN STRUKTUR] ... */}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Store Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your barbershop information and details
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl shadow border border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">Barbers</p>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-500 mt-1">
                  {stats.barberCount}
                </p>
              </div>
              <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl shadow border border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Bookings</p>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-500 mt-1">
                  {stats.bookingCount}
                </p>
              </div>
              <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl shadow border border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">Plan</p>
                <p className="text-lg font-semibold text-amber-700 dark:text-amber-500 mt-1">
                  {stats.subscription?.plan || "-"}
                </p>
              </div>
              <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl shadow border border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <span
                  className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    stats.hasActiveSubscription
                      ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400"
                  }`}
                >
                  {stats.hasActiveSubscription ? "Active" : "Expired"}
                </span>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Store Details
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Edit Details
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: tenant.name,
                        phone: tenant.phone,
                        address: tenant.address,
                        openTime: tenant.openTime,
                        closeTime: tenant.closeTime,
                      });
                    }}
                    className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Store Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-950 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-50 dark:bg-neutral-800 rounded-lg text-gray-900 dark:text-white">
                    {tenant.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-950 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="+1234567890"
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-50 dark:bg-neutral-800 rounded-lg text-gray-900 dark:text-white">
                    {tenant.phone}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.address || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-950 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="123 Main Street"
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-50 dark:bg-neutral-800 rounded-lg text-gray-900 dark:text-white">
                    {tenant.address}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Opening Hours
                </label>
                {isEditing ? (
                  <input
                    type="time"
                    value={formData.openTime || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, openTime: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-950 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-50 dark:bg-neutral-800 rounded-lg text-gray-900 dark:text-white">
                    {tenant.openTime}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Closing Hours
                </label>
                {isEditing ? (
                  <input
                    type="time"
                    value={formData.closeTime || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, closeTime: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-950 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-50 dark:bg-neutral-800 rounded-lg text-gray-900 dark:text-white">
                    {tenant.closeTime}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Store Slug
                </label>
                <p className="px-4 py-2 bg-gray-50 dark:bg-neutral-800 rounded-lg text-gray-500 dark:text-gray-400">
                  {tenant.slug}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Store URL:{" "}
                  {typeof window !== "undefined" ? window.location.origin : ""}/{tenant.slug}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow border border-gray-100 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              All Tenants
            </h2>
            {allTenants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allTenants.map((t) => (
                  <div
                    key={t.id}
                    className={`p-4 rounded-xl border ${
                      t.id === tenant?.id
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-500/10"
                        : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-neutral-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">{t.name}</h3>
                      {t.id === tenant?.id && (
                        <span className="text-xs px-2 py-0.5 bg-amber-600 text-white rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t.slug}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.phone}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
                      {t.address}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No tenants found</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/5 rounded-2xl shadow border border-amber-100 dark:border-amber-500/20 p-6">
            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-500 mb-4">
              Subscription Plan
            </h3>
            {stats?.subscription ? (
              <div className="space-y-3">
                <div>
                  <p className="text-2xl font-bold text-amber-700 dark:text-amber-500">
                    {stats.subscription.plan}
                  </p>
                  <p className="text-sm text-amber-600 dark:text-amber-400/80">Plan Details</p>
                </div>
                <div className="border-t border-amber-200 dark:border-amber-500/20 pt-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Expires on</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(stats.subscription.endsAt).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No active subscription</p>
            )}
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <a
                href="/dashboard/admin/services"
                className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-xl transition-colors"
              >
                <svg
                  className="w-5 h-5 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Manage Services
                </span>
              </a>
              <a
                href="/dashboard/admin/users"
                className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-xl transition-colors"
              >
                <svg
                  className="w-5 h-5 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Manage Barbers
                </span>
              </a>
              <a
                href="/dashboard/barber/bookings"
                className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-xl transition-colors"
              >
                <svg
                  className="w-5 h-5 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  View Bookings
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
