"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { currentUser } from "@/lib/auth";
import { readStoredData, readStoredSession, writeStoredData, writeStoredSession } from "@/lib/storage";
import { deepClone } from "@/lib/utils";
import { useToast } from "@/providers/toast-provider";
import { createSeedData } from "@/store/seed";
import type { AppData, Session, Usuario } from "@/types/domain";

/**
 * Store do dashboard: mantém o "banco" da demonstração, a sessão escolhida e a
 * persistência em `localStorage`.
 *
 * A API é intencionalmente pequena — leitura (`data`, `session`, `user`) e três
 * escritas (`mutate`, `login`, `logout`) — para que as regras de negócio fiquem
 * nas `features` e não aqui.
 */

export type DataMutator = (draft: AppData) => void;

interface AppStoreValue {
  data: AppData;
  session: Session | null;
  user: Usuario | null;
  hydrated: boolean;
  mutate: (mutator: DataMutator) => void;
  resetData: () => void;
  login: (userId: string) => void;
  logout: () => void;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [data, setData] = useState<AppData>(createSeedData);
  const [session, setSession] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Espelho síncrono do estado: mutações são aplicadas sobre a versão mais
  // recente mesmo quando disparadas em sequência no mesmo evento.
  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
    const storedData = readStoredData();
    const nextData = storedData ?? createSeedData();
    dataRef.current = nextData;
    setData(nextData);
    setSession(readStoredSession(nextData));
    setHydrated(true);
  }, []);

  const mutate = useCallback(
    (mutator: DataMutator) => {
      const draft = deepClone(dataRef.current);
      mutator(draft);
      dataRef.current = draft;
      setData(draft);
      if (!writeStoredData(draft)) {
        toast("Não foi possível salvar os dados locais.", "error");
      }
    },
    [toast],
  );

  const resetData = useCallback(() => {
    const seed = createSeedData();
    dataRef.current = seed;
    setData(seed);
    writeStoredData(seed);
  }, []);

  const login = useCallback((userId: string) => {
    const nextSession: Session = { userId };
    setSession(nextSession);
    writeStoredSession(nextSession);
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    writeStoredSession(null);
  }, []);

  const user = useMemo(() => currentUser(data, session), [data, session]);

  const value = useMemo<AppStoreValue>(
    () => ({ data, session, user, hydrated, mutate, resetData, login, logout }),
    [data, session, user, hydrated, mutate, resetData, login, logout],
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore(): AppStoreValue {
  const value = useContext(AppStoreContext);
  if (!value) throw new Error("useAppStore deve ser usado dentro de AppStoreProvider.");
  return value;
}