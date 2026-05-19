// src/components/dashboard/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Scissors,
  Users,
  LayoutDashboard,
  CalendarCheck,
  Settings,
  LogOut,
} from "lucide-react";

const navMain = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

const navAdmin = [
  { href: "/dashboard/admin/services", label: "Layanan", icon: Scissors },
  { href: "/dashboard/admin/users", label: "Kapster", icon: Users },
  { href: "/dashboard/admin/bookings", label: "Reservasi", icon: CalendarCheck },
];

const navBarber = [
  { href: "/dashboard/barber/bookings", label: "Booking Saya", icon: Scissors },
];

const navSystem = [
  {
    href: "/dashboard/admin/store-settings",
    label: "Pengaturan Toko",
    icon: Settings,
  },
];

export default function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-56 bg-yellow-950 flex flex-col border-r border-amber-900/20 hidden md:flex">
      {/* Logo */}
      <div className="p-5 flex items-center gap-3 border-b border-amber-900/20">
        <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Scissors className="w-4 h-4 text-white" strokeWidth={2} />
        </div>
        <div>
          <p className="font-black text-white text-sm font-syne leading-tight tracking-tight">
            Sixteen
          </p>
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
            Barbershop
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {/* Utama */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700/60 px-2 pb-1.5">
          Utama
        </p>
        {navMain.map(({ href, label, icon: Icon }) => (
          <NavLink
            key={href}
            href={href}
            label={label}
            icon={Icon}
            active={isActive(href)}
          />
        ))}

        {/* Manajemen */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700/60 px-2 pb-1.5 pt-4">
          Manajemen
        </p>
        {role === "ADMIN" &&
          navAdmin.map(({ href, label, icon: Icon }) => (
            <NavLink
              key={href}
              href={href}
              label={label}
              icon={Icon}
              active={isActive(href)}
            />
          ))}
        {role === "BARBER" &&
          navBarber.map(({ href, label, icon: Icon }) => (
            <NavLink
              key={href}
              href={href}
              label={label}
              icon={Icon}
              active={isActive(href)}
            />
          ))}

        {/* Sistem */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700/60 px-2 pb-1.5 pt-4">
          Sistem
        </p>
        {navSystem.map(({ href, label, icon: Icon }) => (
          <NavLink
            key={href}
            href={href}
            label={label}
            icon={Icon}
            active={isActive(href)}
          />
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-amber-900/20">
        <button
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg
            text-red-400/60 text-sm font-medium
            hover:text-red-300 hover:bg-red-900/20 hover:border-red-900/30
            border border-transparent transition-all duration-200"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
          Keluar
        </button>
      </div>
    </aside>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium
        border transition-all duration-200
        ${
          active
            ? "text-white bg-white/[0.14] border-amber-600/35"
            : "text-amber-100/50 border-transparent hover:text-amber-100 hover:bg-white/[0.08] hover:border-amber-900/30"
        }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-amber-500 rounded-r-full" />
      )}
      <Icon
        className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${
          active ? "text-amber-500" : "opacity-70"
        }`}
        strokeWidth={1.75}
      />
      {label}
    </Link>
  );
}
