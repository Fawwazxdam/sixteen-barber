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
  const token = cookieStore.get("access_token")?.value; // ✅ ambil cookie
  
  // if (!token) redirect("/login");

  const cookieHeader = `access_token=${token}`; // ✅ format cookie header
  const me = await getMe(cookieHeader); // ✅ kirim ke backend

  return (
    <div className="flex min-h-screen bg-amber-50">
      <Sidebar role={me.role} />
      <div className="flex flex-col flex-1">
        <Topbar user={me} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}