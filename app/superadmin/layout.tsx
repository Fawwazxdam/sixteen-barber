import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getMe } from "@/lib/api/auth";
import Sidebar from "@/components/dashboard/sidebar";
import Topbar from "@/components/dashboard/topbar";

export const dynamic = "force-dynamic";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const me = await getMe(cookieHeader);
    console.log({me})

    let virtualRole = me.user.role;
    if (me.user.email === "adamf@magentaa.space") {
      virtualRole = "SUPERADMIN";
    }

    // Strict check for SUPERADMIN role based on email
    if (virtualRole !== "SUPERADMIN") {
      redirect("/dashboard");
    }

    return (
      <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300 overflow-hidden">
        <Sidebar role={virtualRole} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar user={me.user} />
          <main className="flex-1 overflow-y-auto p-6 md:p-8 w-full max-w-7xl mx-auto">
            {children}
          </main>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    redirect("/login");
  }
}
