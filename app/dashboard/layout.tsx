import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getMe } from "@/lib/api/auth";
import Sidebar from "@/components/dashboard/sidebar";
import Topbar from "@/components/dashboard/topbar";

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    // Get cookies header for server-side API calls
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    
    const me = await getMe(cookieHeader);
    return (
      <div className="flex min-h-screen bg-amber-50">
        <Sidebar role={me.user.role} />
        <div className="flex flex-col flex-1">
          <Topbar user={me.user} />
          <main className="p-6">{children}</main>
        </div>
      </div>
    );
  } catch (error) {
    // If getMe fails (e.g., 401), redirect to login
    console.error("Error fetching user:", error);
    redirect("/login");
  }
}
