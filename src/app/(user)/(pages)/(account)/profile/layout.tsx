import Header from "@/app/components/Header";
import ProfileHeader from "@/app/components/profile/ProfileHeader";
import { QueryProvider } from "@/app/QueryClientProvider";

export default function LayoutProfile({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <Header />

          <ProfileHeader />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
