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
  ShieldAlert,
  Store,
  CreditCard
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
    href: "/dashboard/admin/billing",
    label: "Langganan",
    icon: CreditCard,
  },
  {
    href: "/dashboard/admin/store-settings",
    label: "Pengaturan Toko",
    icon: Settings,
  },
];

const navSuperAdmin = [
  { href: "/superadmin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/superadmin/tenants", label: "Barbershops", icon: Store },
  { href: "/superadmin/transactions", label: "Transaksi", icon: CreditCard },
];

export default function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return (
        pathname === "/dashboard" ||
        pathname === "/dashboard/admin" ||
        pathname === "/dashboard/barber"
      );
    }
    if (href === "/superadmin") {
      return pathname === "/superadmin";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-56 bg-yellow-950 dark:bg-neutral-900 flex flex-col border-r border-amber-900/20 dark:border-neutral-800 hidden md:flex transition-colors duration-300">
      {/* Logo */}
      <div className="p-5 flex items-center gap-3 border-b border-amber-900/20 dark:border-neutral-800">
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
        {role !== "SUPERADMIN" && (
          <>
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700/60 dark:text-neutral-500 px-2 pb-1.5">
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
          </>
        )}

        {/* Manajemen */}
        {role !== "SUPERADMIN" && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700/60 dark:text-neutral-500 px-2 pb-1.5 pt-4">
            Manajemen
          </p>
        )}
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

        {/* SuperAdmin */}
        {role === "SUPERADMIN" && (
          <>
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-500/80 px-2 pb-1.5 pt-4 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              SaaS Admin
            </p>
            {navSuperAdmin.map(({ href, label, icon: Icon }) => (
              <NavLink
                key={href}
                href={href}
                label={label}
                icon={Icon}
                active={isActive(href)}
              />
            ))}
          </>
        )}

        {/* Sistem */}
        {role === "ADMIN" && (
          <>
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700/60 dark:text-neutral-500 px-2 pb-1.5 pt-4">
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
          </>
        )}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-amber-900/20 dark:border-neutral-800">
        <button
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg
            text-red-400/60 dark:text-red-500/70 text-sm font-medium
            hover:text-red-300 dark:hover:text-red-400 hover:bg-red-900/20 dark:hover:bg-red-950/30 hover:border-red-900/30 dark:hover:border-red-900/50
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
        ${active
          ? "text-white dark:text-amber-500 bg-white/[0.14] dark:bg-amber-500/10 border-amber-600/35 dark:border-amber-500/20"
          : "text-amber-100/50 dark:text-neutral-400 border-transparent hover:text-amber-100 dark:hover:text-neutral-200 hover:bg-white/[0.08] dark:hover:bg-white/5 hover:border-amber-900/30 dark:hover:border-neutral-700"
        }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-amber-500 rounded-r-full" />
      )}
      <Icon
        className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${active ? "text-amber-500" : "opacity-70"
          }`}
        strokeWidth={1.75}
      />
      {label}
    </Link>
  );
}
