"use client";

import Header from "@/app/components/Header";
import { QueryProvider } from "@/app/QueryClientProvider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <QueryProvider>
        <Header />
        {children}
      </QueryProvider>
    </>
  );
}
