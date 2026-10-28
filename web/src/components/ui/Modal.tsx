"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { siteConfig } from "@/config/site";
import { icons } from "@/constants/icons";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Sobretítulo curto (contexto da ação). */
  eyebrow?: string;
  size?: "md" | "lg";
  footer?: ReactNode;
  children: ReactNode;
}

/**
 * Diálogo do sistema: fecha com Escape ou clique no backdrop, trava o scroll do
 * documento e mantém o cabeçalho fixo durante a rolagem do conteúdo.
 */
export function Modal({ open, onClose, title, eyebrow, size = "md", footer, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const CloseIcon = icons.close;

  return createPortal(
    <div className="modal modal-open z-[80]" role="dialog" aria-modal="true" aria-label={title}>
      <div
        className={cn(
          "modal-box max-h-[calc(100vh-3rem)] w-[calc(100vw-2rem)] rounded-2xl border border-stone-200 bg-white p-0",
          size === "lg" ? "max-w-[860px]" : "max-w-[680px]",
        )}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-stone-200 bg-white px-5 py-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">
              {eyebrow ?? siteConfig.name}
            </p>
            <h2 className="mt-0.5 font-display text-[24.5px] leading-tight text-slate-900">{title}</h2>
          </div>
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-stone-500 hover:bg-stone-100 hover:text-slate-700"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[calc(100vh-13rem)] overflow-y-auto px-5 py-4 scroll-thin">{children}</div>

        {footer ? (
          <div className="flex flex-wrap justify-end gap-2 border-t border-stone-200 px-5 py-3.5">{footer}</div>
        ) : null}
      </div>

      <button
        type="button"
        aria-label="Fechar"
        tabIndex={-1}
        onClick={onClose}
        className="modal-backdrop bg-slate-950/55 backdrop-blur-[2px]"
      />
    </div>,
    document.body,
  );
}