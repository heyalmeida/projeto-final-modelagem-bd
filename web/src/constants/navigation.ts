import type { IconKey } from "@/constants/icons";
import type { ModuleId } from "@/types/domain";

/** Origem do contador exibido ao lado do item de navegação. */
export type NavBadgeSource = "avaliacoes" | "financeiro" | "presenca" | "agenda";

export interface NavItemConfig {
  id: string;
  label: string;
  href: string;
  icon: IconKey;
  badge?: NavBadgeSource;
  /** Item visível apenas para o papel ROOT. */
  rootOnly?: boolean;
}

/** Descrição acessível de cada contador (o número é sempre calculado no momento). */
export const navBadgeLabels: Record<NavBadgeSource, string> = {
  avaliacoes: "avaliações abertas",
  financeiro: "mensalidades vencidas",
  presenca: "sessões abertas",
  agenda: "solicitações pendentes",
};

/** Itens fixos do menu, fora dos módulos configuráveis pela matriz de acesso. */
export const painelNav: NavItemConfig = {
  id: "painel",
  label: "Painel",
  href: "/painel",
  icon: "painel",
};

export const acessoNav: NavItemConfig = {
  id: "acesso",
  label: "Acesso e módulos",
  href: "/acesso",
  icon: "acesso",
  rootOnly: true,
};

/** Contadores contextuais de cada módulo na navegação. */
export const moduleNavBadges: Partial<Record<ModuleId, NavBadgeSource>> = {
  avaliacoes: "avaliacoes",
  financeiro: "financeiro",
  presenca: "presenca",
  agenda: "agenda",
};