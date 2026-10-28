import type { ReactNode } from "react";

/** Área de conteúdo das páginas: mesma largura e respiro em todo o dashboard. */
export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto max-w-[1480px] px-4 pb-14 pt-5 sm:px-6 lg:px-8 lg:pt-7">{children}</main>
  );
}