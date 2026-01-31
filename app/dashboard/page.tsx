import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getMe } from "@/lib/api/auth";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value; // ✅ ambil cookie
  
  if (!token) redirect("/login");

  const cookieHeader = `access_token=${token}`; // ✅ format cookie header
  const me = await getMe(cookieHeader); // ✅ kirim ke backend

  if (me.role === "ADMIN") redirect("/dashboard/admin");
  if (me.role === "BARBER") redirect("/dashboard/barber");
  
  redirect("/login");
}