"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/lib/api/auth";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    getMe() // axios / fetch withCredentials: true
      .then((me) => {
        console.log({me})
        let virtualRole = me.user.role;
        if (me.user.email === "adamf@magentaa.space") {
          virtualRole = "SUPERADMIN";
        }

        if (virtualRole === "SUPERADMIN") router.replace("/superadmin");
        else if (virtualRole === "ADMIN") router.replace("/dashboard/admin");
        else if (virtualRole === "BARBER") router.replace("/dashboard/barber");
        else router.replace("/login");
      })
      .catch(() => {
        router.replace("/login");
      });
  }, []);

  return <p>Loading...</p>;
}
