"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
  acessoNav,
  moduleNavBadges,
  navBadgeLabels,
  painelNav,
  type NavItemConfig,
} from "@/constants/navigation";
import { moduleIconKeys, icons } from "@/constants/icons";
import { avaliacoesAbertas } from "@/features/avaliacoes/selectors";
import { solicitacoesPendentes } from "@/features/agenda/selectors";
import { mensalidadesVisiveis, statusMensalidade } from "@/features/financeiro/selectors";
import { sessoesVisiveis } from "@/features/presenca/selectors";
import { allowedModules, canApproveSchedule, isRoot } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";

interface NavItemLinkProps {
  item: NavItemConfig;
  active: boolean;
  count?: number;
}

function NavItemLink({ item, active, count }: NavItemLinkProps) {
  const Icon = icons[item.icon];
  const countLabel = item.badge ? navBadgeLabels[item.badge] : null;

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      aria-label={count && countLabel ? `${item.label} — ${count} ${countLabel}` : undefined}
      className={cn(
        "flex items-center gap-2.5 whitespace-nowrap rounded-lg border px-2.5 py-2 text-[14px] transition",
        active
          ? "border-brand-300/20 bg-brand-400/10 text-white"
          : "border-transparent text-slate-300 hover:bg-white/5 hover:text-white",
      )}
    >
      <Icon className={cn("h-[18px] w-[18px]", active ? "text-brand-300" : "text-slate-400")} strokeWidth={1.9} />
      <span className="hidden sm:inline">{item.label}</span>
      {count && countLabel ? (
        <span
          title={`${count} ${countLabel}`}
          className="ml-auto rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-bold text-white"
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}

/**
 * Navegação principal e de módulos. Os módulos vêm da matriz de acesso do
 * usuário, e os contadores são calculados a cada render a partir dos dados
 * (avaliações abertas, mensalidades vencidas, sessões abertas e pedidos de agenda).
 */
export function Navigation() {
  const viewer = useViewer();
  const pathname = usePathname();

  const modules = allowedModules(viewer.data, viewer.user);

  const counts = useMemo(
    () => ({
      avaliacoes: avaliacoesAbertas(viewer).length,
      financeiro: mensalidadesVisiveis(viewer).filter(
        (mensalidade) => statusMensalidade(viewer.data, mensalidade) === "VENCIDA",
      ).length,
      presenca: sessoesVisiveis(viewer).filter((sessao) => sessao.status === "ABERTA").length,
      agenda: canApproveSchedule(viewer.user, viewer.group) ? solicitacoesPendentes(viewer.data).length : 0,
    }),
    [viewer],
  );

  return (
    <div className="flex items-center gap-1 lg:mt-6 lg:flex-col lg:items-stretch lg:gap-0">
      <p className="hidden text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 lg:block lg:px-2 lg:pb-1.5">
        Visão geral
      </p>
      <nav aria-label="Navegação principal" className="flex items-center gap-1 lg:flex-col lg:items-stretch">
        <NavItemLink item={painelNav} active={pathname === painelNav.href} />
      </nav>

      <p className="hidden text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 lg:mt-5 lg:block lg:px-2 lg:pb-1.5">
        Módulos
      </p>
      <nav aria-label="Módulos" className="flex items-center gap-1 lg:flex-col lg:items-stretch">
        {modules.map((modulo) => {
          const badge = moduleNavBadges[modulo.id];
          return (
            <NavItemLink
              key={modulo.id}
              item={{
                id: modulo.id,
                label: modulo.nome,
                href: modulo.rota,
                icon: moduleIconKeys[modulo.icone],
                badge,
              }}
              active={pathname === modulo.rota}
              count={badge ? counts[badge] : undefined}
            />
          );
        })}
        {isRoot(viewer.user) ? <NavItemLink item={acessoNav} active={pathname === acessoNav.href} /> : null}
      </nav>
    </div>
  );
}