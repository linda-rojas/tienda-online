// import AdminNav from "@/ui/admin/AdminNav";
import ToastNotification from "@/ui/ToastNotification";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* <AdminNav /> */}
      <div>
        {children}
      </div>
      <ToastNotification />
    </>
  );
}