"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { icons } from "@/constants/icons";
import { cn } from "@/lib/utils";

/** Feedback efêmero das ações do dashboard (sucesso, aviso e erro). */

export type ToastKind = "success" | "warn" | "error";

interface ToastItem {
  id: number;
  message: string;
  kind: ToastKind;
}

interface ToastContextValue {
  toast: (message: string, kind?: ToastKind) => void;
}

const DURATION = 3800;

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_STYLES: Record<ToastKind, string> = {
  success: "alert-success",
  warn: "alert-warning",
  error: "alert-error",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const sequence = useRef(0);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const toast = useCallback((message: string, kind: ToastKind = "success") => {
    sequence.current += 1;
    const id = sequence.current;
    setItems((current) => [...current, { id, message, kind }]);
    timers.current.push(
      setTimeout(() => {
        setItems((current) => current.filter((item) => item.id !== id));
      }, DURATION),
    );
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast toast-end z-[100]">
        {items.map((item) => {
          const Icon = item.kind === "error" ? icons.alert : item.kind === "warn" ? icons.clock : icons.check;
          return (
            <div
              key={item.id}
              role="status"
              className={cn(
                "alert min-w-[240px] max-w-[380px] rounded-xl text-[13.5px] shadow-lg",
                TOAST_STYLES[item.kind],
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast deve ser usado dentro de ToastProvider.");
  return value;
}