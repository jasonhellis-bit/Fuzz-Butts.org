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
    <nav className="bg-gray-100 w-full md:w-56 md:min-h-screen flex-shrink-0 p-4 md:p-6 flex flex-row flex-wrap items-center gap-x-6 gap-y-2 md:flex-col md:items-start md:gap-0">
      {user?.displayName && (
        <p className="hidden md:block text-sm font-medium text-gray-700 truncate mb-6 w-full">
          Welcome {user.displayName}
        </p>
      )}
      <ul className="flex flex-row flex-wrap gap-x-6 gap-y-2 items-center md:flex-col md:items-start md:space-y-4 md:gap-0">
        <li>
          <a href="/admin/manage/home" className="text-black hover:text-gray-600 flex items-center gap-2">
            <LayoutDashboard size={18} />
            <span className="hidden md:inline">Admin Dashboard</span>
          </a>
        </li>
        <li>
          <a
            href="/admin/manage/users"
            className="text-black hover:text-gray-600 flex items-center gap-2">
            <Users size={18} />
            <span className="hidden md:inline">User Management</span>
          </a>
        </li>
        <li>
          <a
            href="/admin/manage/cats"
            className="text-black hover:text-gray-600 flex items-center gap-2">
            <Cat size={18} />
            <span className="hidden md:inline">Cats</span>
          </a>
        </li>
        <li>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
