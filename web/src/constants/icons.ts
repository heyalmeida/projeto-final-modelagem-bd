import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  ChartColumn,
  Check,
  ClipboardList,
  Clock,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Settings,
  TriangleAlert,
  Users,
  Wallet,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ModuleIconKey } from "@/types/domain";

/**
 * Registro único de ícones. Componentes referenciam a chave semântica
 * ("financeiro", "alert"...) e nunca importam ícones diretamente, o que mantém
 * o peso visual consistente entre módulos.
 */
export const icons = {
  painel: LayoutDashboard,
  avaliacoes: ClipboardList,
  financeiro: Wallet,
  presenca: CalendarCheck,
  agenda: CalendarDays,
  biblioteca: BookOpen,
  acesso: Settings,
  search: Search,
  logout: LogOut,
  plus: Plus,
  check: Check,
  close: X,
  clock: Clock,
  users: Users,
  arrowRight: ArrowRight,
  file: FileText,
  refresh: RefreshCw,
  chart: ChartColumn,
  alert: TriangleAlert,
  graduation: GraduationCap,
} satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof icons;

/** Traduz o ícone declarado no módulo (banco) para o registro da interface. */
export const moduleIconKeys: Record<ModuleIconKey, IconKey> = {
  clipboard: "avaliacoes",
  wallet: "financeiro",
  "calendar-check": "presenca",
  calendar: "agenda",
  book: "biblioteca",
};