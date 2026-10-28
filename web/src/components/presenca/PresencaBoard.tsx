"use client";

import { PresencaAluno } from "@/components/presenca/PresencaAluno";
import { PresencaStaff } from "@/components/presenca/PresencaStaff";
import { isStudent } from "@/lib/auth";
import { useViewer } from "@/store/viewer-context";

/** Alterna a apresentação de presença entre aluno e equipe acadêmica. */
export function PresencaBoard() {
  const { user } = useViewer();
  return isStudent(user) ? <PresencaAluno /> : <PresencaStaff />;
}