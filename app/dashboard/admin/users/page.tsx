"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

export default function UsersPage() {
  const [barbers, setBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/users/barbers")
      .then(setBarbers)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-amber-900">
            Barbers
          </h1>
          <p className="text-sm text-gray-500">
            Kelola akun barber
          </p>
        </div>

        <Link
          href="/dashboard/admin/users/create"
          className="px-4 py-2 rounded-lg bg-amber-700 text-white hover:bg-amber-800"
        >
          + Add Barber
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-amber-50 text-left text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : (
              barbers.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="px-4 py-3">{b.name}</td>
                  <td className="px-4 py-3">{b.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/admin/users/edit/${b.id}`}
                      className="text-amber-700 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
