// import AdminNav from "@/ui/admin/AdminNav";
import ToastNotification from "@/ui/ToastNotification";
import Providers from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* <AdminNav /> */}
      <div>
        <Providers>{children}</Providers>
      </div>
      <ToastNotification />
    </>
  );
}