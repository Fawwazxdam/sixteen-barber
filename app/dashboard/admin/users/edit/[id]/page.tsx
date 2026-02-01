"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { Barber } from "@/types/users";

export default function EditBarberPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    password: "",
  });

  useEffect(() => {
    apiFetch("/users/barbers").then((data) => {
      const barbers = data as Barber[];
      const barber = barbers.find((b: Barber) => b.id === id);
      if (!barber) {
        router.push("/dashboard/admin/users");
        return;
      }
      setForm({ name: barber.name, password: "" });
    });
  }, [id, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    await apiFetch(`/users/barbers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(form.password ? form : { name: form.name }),
    });

    router.push("/dashboard/admin/users");
  }

  return (
    <div className="max-w-xl">
      <div className="bg-white rounded-2xl shadow p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-amber-900">
          Edit Barber
        </h1>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              className="w-full rounded-lg border px-4 py-2"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              New Password (optional)
            </label>
            <input
              type="password"
              className="w-full rounded-lg border px-4 py-2"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button className="px-5 py-2 bg-amber-700 text-white rounded-lg">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
