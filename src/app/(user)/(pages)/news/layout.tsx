"use client";
import { QueryProvider } from "../../../QueryClientProvider";
import Header from "../../../components/Header";

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
