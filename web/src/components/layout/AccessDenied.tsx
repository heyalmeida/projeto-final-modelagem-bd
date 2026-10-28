"use client";

import { ButtonLink } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Card";
import { icons } from "@/constants/icons";
import { useViewer } from "@/store/viewer-context";

/**
 * Bloqueio de módulo para grupos sem permissão. A mensagem nomeia o grupo para
 * deixar claro que o acesso é configurável na matriz de módulos.
 */
export function AccessDenied({ title }: { title: string }) {
  const { group } = useViewer();
  const AlertIcon = icons.alert;

  return (
    <Panel className="mx-auto my-[8vh] max-w-xl text-center">
      <span className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-600">
        <AlertIcon className="h-7 w-7" />
      </span>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-red-600">Acesso restrito</p>
      <h1 className="mt-1 font-display text-[33.5px] leading-tight text-slate-900">{title} não está disponível</h1>
      <p className="mx-auto mt-2 max-w-md text-[14px] text-stone-600">
        O módulo não está habilitado para o grupo <strong>{group ? group.nome : "—"}</strong>. Peça a liberação ao
        responsável de acesso.
      </p>
      <ButtonLink href="/painel" variant="primary" className="mt-4">
        Voltar ao painel
      </ButtonLink>
    </Panel>
  );
}