"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Scissors, Users, LayoutDashboard, LogOut } from "lucide-react";
import { logout } from "@/lib/api/auth";

export default function Sidebar({ role }: { role: string }) {
  const router = useRouter();

  return (
    <aside className="w-64 bg-amber-900 text-amber-50 hidden md:flex flex-col">
      <div className="p-6 text-2xl font-bold font-playfair">Sixteen Barber</div>

      <nav className="flex-1 px-4 space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-amber-800"
        >
          <LayoutDashboard size={18} /> Dashboard
        </Link>

        {role === "ADMIN" && (
          <>
            <Link
              href="/dashboard/admin/services"
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-amber-800"
            >
              <Scissors size={18} /> Services
            </Link>
            <Link
              href="/dashboard/admin/users"
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-amber-800"
            >
              <Users size={18} /> Users / Barber
            </Link>
          </>
        )}

        {role === "BARBER" && (
          <Link
            href="/dashboard/barber/bookings"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-amber-800"
          >
            <Scissors size={18} /> Booking Saya
          </Link>
        )}
      </nav>
    </aside>
  );
}
