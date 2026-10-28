"use client";

import type { ReactNode } from "react";
import { ToastProvider } from "@/providers/toast-provider";
import { AppStoreProvider } from "@/store/app-store";

/**
 * Providers globais do app. Ordem importa: o store precisa do contexto de
 * toasts para avisar quando a persistência local falhar.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AppStoreProvider>{children}</AppStoreProvider>
    </ToastProvider>
  );
}