"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/providers/toast-provider";
import { useAppStore } from "@/store/app-store";

/** Entra com um perfil de demonstração e leva ao painel. */
export function useLogin() {
  const { login } = useAppStore();
  const { toast } = useToast();
  const router = useRouter();

  return useCallback(
    (userId: string, nome: string) => {
      login(userId);
      toast(`Bem-vindo(a), ${nome.split(" ")[0]}.`, "success");
      router.push("/painel");
    },
    [login, router, toast],
  );
}