"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/lib/api/auth";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    getMe() // axios / fetch withCredentials: true
      .then((me) => {
        if (me.role === "ADMIN") router.replace("/dashboard/admin");
        else if (me.role === "BARBER") router.replace("/dashboard/barber");
        else router.replace("/login");
      })
      .catch(() => {
        router.replace("/login");
      });
  }, []);

  return <p>Loading...</p>;
}
