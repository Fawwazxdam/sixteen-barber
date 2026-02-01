"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api/client";
import { Service } from "@/types/services";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await apiFetch("/services") as Service[];
    setServices(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggle(id: string) {
    await apiFetch(`/services/${id}/toggle-active`, {
      method: "PATCH",
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this service?")) return;
    await apiFetch(`/services/${id}`, { method: "DELETE" });
    load();
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Services</h1>
        <Link
          href="/dashboard/admin/services/create"
          className="px-4 py-2 bg-amber-600 text-white rounded-lg"
        >
          + Add Service
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow divide-y">
        {services.map(service => (
          <div
            key={service.id}
            className="p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{service.name}</p>
              <p className="text-sm text-gray-500">
                {service.duration} menit · Rp
                {service.price.toLocaleString()}
              </p>
              <span
                className={`text-xs ${
                  service.isActive ? "text-green-600" : "text-gray-400"
                }`}
              >
                {service.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="flex gap-3 text-sm">
              <button
                onClick={() => toggle(service.id)}
                className="text-blue-600"
              >
                Toggle
              </button>

              <Link
                href={`/dashboard/admin/services/edit/${service.id}`}
                className="text-amber-600"
              >
                Edit
              </Link>

              <button
                onClick={() => remove(service.id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
