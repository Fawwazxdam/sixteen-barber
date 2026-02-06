// dashboard/layout/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getMe } from "@/lib/api/auth";
import Sidebar from "@/components/dashboard/sidebar";
import Topbar from "@/components/dashboard/topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("access_token");

  if (!tokenCookie) {
    redirect("/login");
  }

  // ✅ KITA HARUS MENYUSUN STRING COOKIE MANUAL
  // Agar NestJS bisa membacanya seolah-olah request datang dari browser
  const cookieHeader = `access_token=${tokenCookie.value}`;

  try {
    const me = await getMe(cookieHeader);

    return (
      <div className="flex min-h-screen bg-amber-50">
        <Sidebar role={me.role} />
        <div className="flex flex-col flex-1">
          <Topbar user={me} />
          <main className="p-6">{children}</main>
        </div>
      </div>
    );
  } catch (error) {
    // Jika token ada tapi invalid/expired di sisi backend
    redirect("/login");
  }
}