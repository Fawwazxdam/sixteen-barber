"use client";

export default function Topbar({ user }: any) {
  console.log(user);
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div className="font-semibold text-amber-900">Dashboard</div>

      <div className="flex items-center gap-3">
        <div className="text-sm text-right">
          <p className="font-medium">{user.name}</p>
          <p className="text-xs text-gray-500">{user.role}</p>
        </div>
        <div className="h-9 w-9 rounded-full bg-amber-800 text-white flex items-center justify-center">
          {user.name[0]}
        </div>
      </div>
    </header>
  );
}
