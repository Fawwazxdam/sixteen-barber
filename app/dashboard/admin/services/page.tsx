"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getServices, toggleServiceActive, deleteService } from "@/lib/api/services";
import { Service } from "@/types/services";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await getServices();
      setServices(data || []);
    } catch (error) {
      console.error("Failed to load services:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggle(id: string) {
    try {
      await toggleServiceActive(id);
      load(); // Refresh data setelah toggle
    } catch (error) {
      console.error("Failed to toggle service:", error);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this service?")) return;
    try {
      await deleteService(id);
      load(); // Refresh data setelah delete
    } catch (error) {
      console.error("Failed to delete service:", error);
    }
  }

  if (loading) return <p className="p-4 text-gray-500">Loading services...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Services</h1>
        <Link
          href="/dashboard/admin/services/create"
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          + Add Service
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow divide-y border border-gray-100">
        {services.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No services found.</div>
        ) : (
          services.map(service => (
            <div
              key={service.id}
              className="p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-gray-900">{service.name}</p>
                <p className="text-sm text-gray-500">
                  {service.duration} menit · Rp
                  {service.price.toLocaleString("id-ID")}
                </p>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    service.isActive 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {service.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex gap-4 text-sm font-medium">
                <button
                  onClick={() => toggle(service.id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Toggle
                </button>

                <Link
                  href={`/dashboard/admin/services/edit/${service.id}`}
                  className="text-amber-600 hover:text-amber-800"
                >
                  Edit
                </Link>

                <button
                  onClick={() => remove(service.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}