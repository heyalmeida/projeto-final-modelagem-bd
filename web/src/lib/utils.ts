import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { siteConfig } from "@/config/site";

/** Junta classes condicionais e resolve conflitos do Tailwind. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const DAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

const pad = (value: number): string => String(value).padStart(2, "0");

/** Datas "YYYY-MM-DD" são lidas ao meio-dia para não deslocar o dia pelo fuso. */
function toDate(value: string): Date {
  return new Date(value.length <= 10 ? `${value}T12:00:00` : value);
}

export function initials(name: string | null | undefined): string {
  const parts = String(name ?? "?").trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export function money(value: number | null | undefined): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value ?? 0));
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = toDate(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return `${formatDate(String(value))} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatShortDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = toDate(String(value));
  if (Number.isNaN(date.getTime())) return "—";
  return `${pad(date.getDate())} ${MONTHS[date.getMonth()]}`;
}

/** "2026-08" → "ago/2026". */
export function formatCompetencia(value: string | null | undefined): string {
  if (!value || !value.includes("-")) return value || "—";
  const [ano, mes] = value.split("-");
  const index = Number(mes) - 1;
  return `${MONTHS[index] ?? mes}/${ano}`;
}

export function dayOfWeek(value: string | Date): string {
  const date = value instanceof Date ? value : toDate(String(value));
  return Number.isNaN(date.getTime()) ? "—" : (DAYS[date.getDay()] ?? "—");
}

/** Horário "HH:mm" extraído de um timestamp. */
export function formatTime(value: string | null | undefined): string {
  if (!value) return "—";
  return value.slice(11, 16);
}

export function clampPercent(value: number | null | undefined): number {
  return Math.max(0, Math.min(100, Number(value ?? 0)));
}

/** Nota com uma casa decimal; "—" quando não há nota. */
export function formatGrade(value: number | null | undefined): string {
  return value === null || value === undefined || Number.isNaN(Number(value)) ? "—" : Number(value).toFixed(1);
}

/** Percentual inteiro; "—" quando não há base de cálculo. */
export function formatPercent(value: number | null | undefined): string {
  return value === null || value === undefined ? "—" : `${value}%`;
}

/** Cópia profunda imutável, usada antes de aplicar mutações de domínio. */
export function deepClone<T>(value: T): T {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

/** Identificador único para registros criados na demonstração. */
export function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;
}

/** "2026-11-08" → "2026-11". */
export function competenciaDe(iso: string): string {
  return iso.slice(0, 7);
}

/** Soma meses a uma competência "YYYY-MM", Clamp em 12 meses. */
export function somarMeses(competencia: string, meses: number): string {
  const [ano, mes] = competencia.split("-").map(Number);
  if (!ano || !mes) return competencia;
  const total = ano * 12 + (mes - 1) + meses;
  const novoAno = Math.floor(total / 12);
  const novoMes = (total % 12) + 1;
  return `${String(novoAno).padStart(4, "0")}-${String(novoMes).padStart(2, "0")}`;
}

/** Maior competência de uma lista de mensalidades (ou a competência atual). */
export function ultimaCompetencia(competencias: string[]): string {
  return competencias.reduce((maior, atual) => (atual > maior ? atual : maior), siteConfig.currentCompetencia);
}