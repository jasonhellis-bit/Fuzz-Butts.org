import { sampleUsers } from "@/components/helpers/tempData";
import ManageUserCard from "@/components/manage/ManageUserCard";

export default function ManageUsersPage() {
  return (
    <div className="flex flex-col items-center px-4">
      <h1 className="text-4xl font-bold mb-8">User Management</h1>
      <p className="text-lg text-gray-700 mb-6 max-w-2xl text-center">
        Here you can manage user accounts, view user details, and update user
        information.
      </p>
      {sampleUsers.map((user) => (
        <ManageUserCard key={user.email} user={user} />
      ))}
    </div>
  );
}
