import ManageNav from "@/components/manage/manageNav";
import { UserProvider } from "@/lib/context/UserContext";

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <div className="flex min-h-screen">
        <ManageNav />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </UserProvider>
  );
}
