"use client";

import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { currentGroup } from "@/lib/auth";
import { useAppStore } from "@/store/app-store";
import type { Grupo, Usuario, Viewer } from "@/types/domain";

/**
 * Contexto do shell autenticado: garante `user` não nulo para as páginas do
 * dashboard. O layout `(dashboard)` só monta este provider depois de validar a
 * sessão, então nenhuma seção precisa repetir a checagem de usuário.
 */

type ViewerContextValue = Viewer & { group: Grupo | null };

const ViewerContext = createContext<ViewerContextValue | null>(null);

export function ViewerProvider({ user, children }: { user: Usuario; children: ReactNode }) {
  const { data } = useAppStore();
  const value = useMemo<ViewerContextValue>(
    () => ({ data, user, group: currentGroup(data, user) }),
    [data, user],
  );
  return <ViewerContext.Provider value={value}>{children}</ViewerContext.Provider>;
}

export function useViewer(): ViewerContextValue {
  const value = useContext(ViewerContext);
  if (!value) {
    throw new Error("useViewer deve ser usado dentro do shell autenticado do dashboard.");
  }
  return value;
}