"use client";

import { LayoutDashboard, Users, Cat, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/context/UserContext";

export default function ManageNav() {
  const router = useRouter();
  const user = useUser();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin");
    router.refresh();
  }

  return (
    <nav className="bg-gray-100 min-h-screen w-56 flex-shrink-0 p-6 flex flex-col">
      {user?.displayName && (
        <p className="text-sm font-medium text-gray-700 truncate mb-6">
          Welcome {user.displayName}
        </p>
      )}
      <ul className="flex flex-col space-y-4">
        <li>
          <a href="/admin/manage/home" className="text-black hover:text-gray-600 flex items-center gap-2">
            <LayoutDashboard size={18} />
            Admin Dashboard
          </a>
        </li>
        <li>
          <a
            href="/admin/manage/users"
            className="text-black hover:text-gray-600 flex items-center gap-2">
            <Users size={18} />
            User Management
          </a>
        </li>
        <li>
          <a
            href="/admin/manage/cats"
            className="text-black hover:text-gray-600 flex items-center gap-2">
            <Cat size={18} />
            Cats
          </a>
        </li>
        <li>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </li>
      </ul>
    </nav>
  );
}
