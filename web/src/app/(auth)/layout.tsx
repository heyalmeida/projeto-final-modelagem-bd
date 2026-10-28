"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AppLoading } from "@/components/layout/AppLoading";
import { useAppStore } from "@/store/app-store";

/** Área pública: quem já tem sessão volta direto ao painel. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  const { hydrated, user } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && user) router.replace("/painel");
  }, [hydrated, user, router]);

  if (!hydrated || user) return <AppLoading />;
  return <>{children}</>;
}