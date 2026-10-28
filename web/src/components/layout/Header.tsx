"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { siteConfig } from "@/config/site";
import { icons } from "@/constants/icons";
import { moduleById } from "@/features/core/selectors";
import { canAccess } from "@/lib/auth";
import { dayOfWeek, formatDate } from "@/lib/utils";
import { useToast } from "@/providers/toast-provider";
import { useViewer } from "@/store/viewer-context";

/**
 * Barra superior: contexto da rota, busca global do acervo, data de referência e
 * usuário logado. A busca leva a Biblioteca já filtrada pelo termo.
 */
export function Header() {
  const viewer = useViewer();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [termo, setTermo] = useState("");

  const segmento = pathname.split("/").filter(Boolean)[0] ?? "painel";
  const modulo = moduleById(viewer.data, segmento);
  const titulo =
    segmento === "painel" ? "Painel" : segmento === "acesso" ? "Acesso" : (modulo?.nome ?? siteConfig.name);

  const SearchIcon = icons.search;

  const buscar = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canAccess(viewer.data, viewer.user, "biblioteca")) {
      toast("O módulo Biblioteca não está habilitado para o seu grupo.", "warn");
      return;
    }
    const consulta = termo.trim();
    router.push(consulta ? `/biblioteca?busca=${encodeURIComponent(consulta)}` : "/biblioteca");
  };

  return (
    <header className="relative z-20 flex h-[62px] items-center gap-3 border-b border-stone-200 bg-stone-100/85 px-4 backdrop-blur sm:px-6 lg:sticky lg:top-0 lg:h-[70px] lg:gap-5 lg:px-8">
      <div className="flex min-w-0 items-center gap-2 text-[12.5px] text-stone-600">
        <span className="hidden sm:inline">{siteConfig.name}</span>
        <span className="hidden sm:inline">/</span>
        <strong className="truncate font-semibold text-slate-700">{titulo}</strong>
      </div>

      <div className="ml-auto" />

      <form className="relative hidden w-[min(320px,32vw)] sm:block" role="search" onSubmit={buscar}>
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
        <input
          name="q"
          type="search"
          value={termo}
          onChange={(event) => setTermo(event.target.value)}
          placeholder="Buscar no acervo..."
          aria-label="Buscar no acervo"
          className="h-9 w-full rounded-full border border-stone-300 bg-white/80 pl-9 pr-3 text-[13.5px] outline-none focus:border-brand-600"
        />
      </form>

      <span className="hidden whitespace-nowrap text-[13px] text-stone-600 xl:inline">
        {dayOfWeek(siteConfig.today)}, {formatDate(siteConfig.today)}
      </span>
      <span className="hidden h-6 w-px bg-stone-300 xl:block" />
      <div className="hidden items-center gap-2 sm:flex">
        <Avatar name={viewer.user.nome} size="sm" />
        <span className="hidden text-[13.5px] font-semibold text-slate-700 lg:inline">{viewer.user.nome}</span>
      </div>
    </header>
  );
}