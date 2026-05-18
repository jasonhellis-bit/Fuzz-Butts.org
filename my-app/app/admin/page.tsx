import ManageNav from "@/components/manage/manageNav";
import { sampleCats, sampleUsers } from "@/components/helpers/tempData";

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col items-center mt-10  px-4">
      <ManageNav />
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <p className="text-lg text-gray-700 mb-6 max-w-2xl text-center">
        Welcome to the admin dashboard. Here you can manage the shelter's
        operations, view reports, and oversee volunteer activities.
      </p>
      <p className="text-lg text-gray-700 mb-6 max-w-2xl text-center">
        Use the navigation menu to access different sections of the dashboard
        and stay updated on the latest shelter news and events.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-7xl">
        <div className="bg-white shadow-md rounded p-4">
          <h2 className="text-2xl font-bold mb-2">Total Users</h2>
          <p className="text-gray-600 mb-2">{sampleUsers.length}</p>
        </div>
        <div className="bg-white shadow-md rounded p-4">
          <h2 className="text-2xl font-bold mb-2">Total Cats</h2>
          <p className="text-gray-600 mb-2">{sampleCats.length}</p>
        </div>
      </div>
    </div>
  );
}
