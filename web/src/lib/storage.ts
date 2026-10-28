import { siteConfig } from "@/config/site";
import type { AppData, Session } from "@/types/domain";

/**
 * Persistência local da demonstração. Toda leitura é defensiva: um payload
 * inválido ou um `localStorage` indisponível devolvem `null` e o app volta para
 * os dados semeados.
 */

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readStoredData(): AppData | null {
  const storage = getStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(siteConfig.storage.dataKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AppData> | null;
    if (parsed && Array.isArray(parsed.usuarios) && Array.isArray(parsed.avaliacoes)) {
      return parsed as AppData;
    }
    return null;
  } catch {
    return null;
  }
}

export function writeStoredData(data: AppData): boolean {
  const storage = getStorage();
  if (!storage) return false;
  try {
    storage.setItem(siteConfig.storage.dataKey, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function readStoredSession(data: AppData): Session | null {
  const storage = getStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(siteConfig.storage.sessionKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Session> | null;
    if (!parsed?.userId) return null;
    return data.usuarios.some((usuario) => usuario.id === parsed.userId) ? { userId: parsed.userId } : null;
  } catch {
    return null;
  }
}

export function writeStoredSession(session: Session | null): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    if (session) storage.setItem(siteConfig.storage.sessionKey, JSON.stringify(session));
    else storage.removeItem(siteConfig.storage.sessionKey);
  } catch {
    /* sem persistência: a sessão continua válida em memória */
  }
}