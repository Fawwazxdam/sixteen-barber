"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/auth";
import { Bell, ChevronDown, LogOut, Sun, Moon } from "lucide-react";

interface User {
  id: string;
  name?: string;
  email?: string;
  role: "ADMIN" | "BARBER";
}

export default function Topbar({ user }: { user: User }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    setTheme(isDark ? 'dark' : 'light');
  };

  const initials = (user.name || "U").charAt(0).toUpperCase();
  const roleLabel = user.role === "ADMIN" ? "Admin" : "Barber";

  return (
    <header className="h-14 bg-white dark:bg-neutral-900 border-b border-amber-100 dark:border-neutral-800 flex items-center justify-end px-5 sticky top-0 z-50 flex-shrink-0 transition-colors duration-300">
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          className="relative w-[34px] h-[34px] rounded-lg flex items-center justify-center
          text-amber-800 dark:text-neutral-400 border border-transparent
          hover:bg-amber-50 dark:hover:bg-neutral-800 hover:border-amber-100 dark:hover:border-neutral-700
          transition-all duration-200"
        >
          <Bell className="w-4 h-4" strokeWidth={1.75} />
          {/* Dot */}
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full border border-white dark:border-neutral-900" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="relative w-[34px] h-[34px] rounded-lg flex items-center justify-center
          text-amber-800 dark:text-neutral-400 border border-transparent
          hover:bg-amber-50 dark:hover:bg-neutral-800 hover:border-amber-100 dark:hover:border-neutral-700
          transition-all duration-200"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4" strokeWidth={1.75} />
          ) : (
            <Moon className="w-4 h-4" strokeWidth={1.75} />
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-7 bg-amber-100 dark:bg-neutral-800 mx-1" />

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg border border-transparent
              hover:bg-amber-50 dark:hover:bg-neutral-800 hover:border-amber-100 dark:hover:border-neutral-700
              transition-all duration-200"
          >
            {/* Avatar */}
            <div
              className="w-[30px] h-[30px] rounded-lg bg-amber-600 text-white
              flex items-center justify-center font-black text-xs font-syne flex-shrink-0"
            >
              {initials}
            </div>
            {/* Info */}
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-[13px] font-semibold text-[#1c1008] dark:text-white">
                {user.name || "User"}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">
                {roleLabel}
              </span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-amber-800 dark:text-neutral-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              strokeWidth={2}
            />
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div
              className="absolute right-0 mt-2 w-52 bg-white dark:bg-neutral-900 border border-amber-100 dark:border-neutral-800
              rounded-xl shadow-lg shadow-amber-900/5 dark:shadow-black/50 py-1
              animate-in fade-in zoom-in-95 duration-100 origin-top-right"
            >
              {/* User info header */}
              <div className="px-4 py-3 border-b border-amber-50 dark:border-neutral-800">
                <p className="text-sm font-semibold text-[#1c1008] dark:text-white">
                  {user.name || "User"}
                </p>
                <p className="text-xs text-amber-700/60 dark:text-neutral-400 mt-0.5">
                  {user.email || "Tidak ada email"}
                </p>
              </div>

              {/* Logout */}
              <div className="p-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium
                    text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400
                    transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" strokeWidth={1.75} />
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
