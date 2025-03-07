"use client";
import { QueryProvider } from "../../../QueryClientProvider";
import Header from "../../../components/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("day la layout", 777);

  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <Header />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
