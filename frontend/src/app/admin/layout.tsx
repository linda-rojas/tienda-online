import ToastNotification from "@/ui/ToastNotification";
import Providers from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div>
        <Providers>{children}</Providers>
      </div>
      <ToastNotification />
    </>
  );
}