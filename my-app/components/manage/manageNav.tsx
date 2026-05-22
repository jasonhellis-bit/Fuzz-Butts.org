import { LayoutDashboard, Users, Cat } from "lucide-react";

export default function ManageNav() {
  return (
    <nav className="bg-gray-100 min-h-screen w-56 flex-shrink-0 p-6">
      <ul className="flex flex-col space-y-4">
        <li>
          <a href="/admin" className="text-black hover:text-gray-600 flex items-center gap-2">
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
      </ul>
    </nav>
  );
}
