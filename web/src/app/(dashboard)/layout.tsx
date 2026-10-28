"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AppLoading } from "@/components/layout/AppLoading";
import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAppStore } from "@/store/app-store";
import { ViewerProvider } from "@/store/viewer-context";

/**
 * Shell do dashboard: valida a sessão, monta a navegação persistente e injeta o
 * contexto autenticado (`ViewerProvider`) para todas as páginas do grupo.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { hydrated, user } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [hydrated, user, router]);

  if (!hydrated || !user) return <AppLoading />;

  return (
    <ViewerProvider user={user}>
      <div className="min-h-screen bg-stone-100 lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
        <Sidebar />
        <div className="min-w-0">
          <Header />
          <PageContainer>{children}</PageContainer>
        </div>
      </div>
    </ViewerProvider>
  );
}