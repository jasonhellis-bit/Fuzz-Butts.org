import ManageNav from "@/components/manage/manageNav";

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <ManageNav />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
