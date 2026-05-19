import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getMe } from "@/lib/api/auth";
import Sidebar from "@/components/dashboard/sidebar";
import Topbar from "@/components/dashboard/topbar";

export const dynamic = "force-dynamic";

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
      <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300 overflow-hidden">
        <Sidebar role={me.user.role} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar user={me.user} />
          {/* Tambahan overflow-y-auto agar sidebar tetap diam saat konten di-scroll */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8 w-full max-w-7xl mx-auto">
            {children}
          </main>
        </div>
      </div>
    );
  } catch (error) {
    // If getMe fails (e.g., 401), redirect to login
    console.error("Error fetching user:", error);
    redirect("/login");
  }
}
