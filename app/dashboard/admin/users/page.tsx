"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getBarbers } from "@/lib/api/users";
import { Barber } from "@/types/users";
import { Plus, Pencil, Loader2, Users, UserCircle } from "lucide-react";

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
      return barber.image.startsWith("http")
        ? barber.image
        : API_BASE_URL + barber.image;
    }
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Akun Barber
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Kelola tim kapster, profil, dan akses mereka.
          </p>
        </div>

        <Link
          href="/dashboard/admin/users/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Barber</span>
        </Link>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-neutral-50 dark:bg-neutral-800/50 text-gray-500 dark:text-gray-400 font-bold border-b border-gray-200 dark:border-gray-800 tracking-wider">
              <tr>
                <th className="px-6 py-4 w-20 text-center">Foto</th>
                <th className="px-6 py-4">Nama</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Deskripsi</th>
                <th className="px-6 py-4">Bergabung</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-3" />
                      <p className="font-medium animate-pulse">
                        Memuat data barber...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : barbers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                      <p className="font-medium text-lg">
                        Belum ada data barber
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                barbers.map((b) => {
                  const imageUrl = getBarberImage(b);
                  return (
                    <tr
                      key={b.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group"
                    >
                      <td className="px-6 py-4 flex justify-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-amber-50 dark:bg-amber-500/10 border-2 border-transparent group-hover:border-amber-200 dark:group-hover:border-amber-500/30 transition-colors flex-shrink-0">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={b.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-amber-600/50 dark:text-amber-500/50">
                              <UserCircle className="w-8 h-8" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900 dark:text-white text-base">
                          {b.name}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-medium">
                        {b.email}
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-500 max-w-[200px] truncate">
                        {b.description || (
                          <span className="italic text-gray-400">
                            Tidak ada deskripsi
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-medium">
                        {new Date(b.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/dashboard/admin/users/edit/${b.id}`}
                          title="Edit Barber"
                          className="inline-flex p-2.5 text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded-lg transition-colors dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20 dark:hover:bg-blue-500/20"
                        >
                          <Pencil className="w-4 h-4" />
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
    </div>
  );
}
