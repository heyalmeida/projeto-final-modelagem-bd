"use client";

import type { ReactNode } from "react";
import { AccessDenied } from "@/components/layout/AccessDenied";
import { canAccess, isRoot } from "@/lib/auth";
import { useViewer } from "@/store/viewer-context";
import type { ModuleId } from "@/types/domain";

interface ModuleGuardProps {
  /** Nome exibido quando o acesso é negado. */
  title: string;
  /** Módulo exigido pela página. */
  module?: ModuleId;
  /** Exige o papel ROOT (área administrativa). */
  superuser?: boolean;
  children: ReactNode;
}

/**
 * Segunda camada de autorização: mesmo que a rota seja digitada na barra de
 * endereços, a página confirma o vínculo do usuário com o módulo.
 */
export function ModuleGuard({ title, module, superuser = false, children }: ModuleGuardProps) {
  const viewer = useViewer();
  const permitido = superuser
    ? isRoot(viewer.user)
    : module
      ? canAccess(viewer.data, viewer.user, module)
      : true;

  if (!permitido) return <AccessDenied title={title} />;
  return <>{children}</>;
}