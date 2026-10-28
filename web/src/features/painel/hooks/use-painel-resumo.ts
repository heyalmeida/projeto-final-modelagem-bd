"use client";

import { useMemo } from "react";
import { buildPainelResumo } from "@/features/painel/selectors";
import type { PainelResumo } from "@/features/painel/types";
import { useViewer } from "@/store/viewer-context";

/** Resumo do painel já no recorte do usuário logado. */
export function usePainelResumo(): PainelResumo {
  const viewer = useViewer();
  return useMemo(() => buildPainelResumo(viewer), [viewer]);
}