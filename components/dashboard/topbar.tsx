"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, User, ChevronDown } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "BARBER";
}

export default function Topbar({ user }: { user: User }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
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

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="font-semibold text-amber-900">Dashboard</div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 hover:bg-gray-100 transition-colors px-2 py-1.5 rounded-lg"
        >
          <div className="text-sm text-right hidden sm:block">
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-amber-800 text-white flex items-center justify-center font-medium">
            {user.name[0]}
          </div>
          <ChevronDown
            className={`h-4 w-4 text-gray-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <Card className="absolute right-0 mt-2 w-48 py-2 shadow-lg animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-2 border-b">
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="justify-start mx-3 -mt-4 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
          </Card>
        )}
      </div>
    </header>
  );
}
