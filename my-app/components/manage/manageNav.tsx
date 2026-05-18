export default function ManageNav() {
  return (
    <nav className="bg-gray-800 w-full -mx-4 pt-4 px-4 pb-4 -mt-10 mb-4">
      <div className="max-w-7xl mx-auto w-full">
        <ul className="flex space-x-4">
          <li>
            <a href="/admin" className="text-white hover:text-gray-300">
              Admin Dashboard
            </a>
          </li>
          <li>
            <a
              href="/admin/manage/users"
              className="text-white hover:text-gray-300">
              User Management
            </a>
          </li>
          <li>
            <a
              href="/admin/manage/cats"
              className="text-white hover:text-gray-300">
              Cats
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
