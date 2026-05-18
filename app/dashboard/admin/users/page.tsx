"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getBarbers } from "@/lib/api/users";
import { Barber } from "@/types/users";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function UsersPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBarbers()
      .then((data) => setBarbers(data))
      .finally(() => setLoading(false));
  }, []);

  function getBarberImage(barber: Barber): string | null {
    if (barber.media?.[0]?.url) {
      const url = barber.media[0].url;
      return url.startsWith("http") ? url : API_BASE_URL + url;
    }
    if (barber.image) {
      return barber.image.startsWith("http") ? barber.image : API_BASE_URL + barber.image;
    }
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-amber-900">Barbers</h1>
          <p className="text-sm text-gray-500">Kelola akun barber</p>
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
              <th className="px-4 py-3 w-16">Foto</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : barbers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No barbers found
                </td>
              </tr>
            ) : (
              barbers.map((b) => {
                const imageUrl = getBarberImage(b);
                return (
                  <tr key={b.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-100">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={b.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{b.name}</td>
                    <td className="px-4 py-3 text-gray-500">{b.email}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                      {b.description || "-"}
                    </td>
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
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
