"use client";

import Link from "next/link";
import { useState } from "react";
import { icons } from "@/constants/icons";
import { painelNav } from "@/constants/navigation";
import { Logo } from "@/components/layout/Logo";
import { Navigation } from "@/components/layout/Navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAcessoActions } from "@/features/acesso/hooks/use-acesso-actions";
import { useAppStore } from "@/store/app-store";
import { useViewer } from "@/store/viewer-context";

/**
 * Coluna de navegação persistente. Em telas pequenas vira uma barra horizontal
 * com ícones; a partir de `lg` ocupa a coluna fixa à esquerda, com os módulos
 * logo abaixo do painel e o cartão do usuário ancorado no rodapé.
 *
 * A restauração da base de demonstração fica disponível a qualquer perfil,
 * porque os dados vivem no próprio navegador.
 */
export function Sidebar() {
  const { logout } = useAppStore();
  const { restaurarDemo } = useAcessoActions();
  const { user, group } = useViewer();
  const [confirmando, setConfirmando] = useState(false);

  const LogoutIcon = icons.logout;
  const RefreshIcon = icons.refresh;

  const confirmarRestauracao = () => {
    restaurarDemo();
    setConfirmando(false);
  };

  return (
    <aside className="sticky top-0 z-30 flex items-center gap-3 overflow-x-auto border-b border-white/5 bg-slate-950 px-4 py-2.5 text-slate-300 scroll-thin lg:h-screen lg:w-[264px] lg:flex-col lg:items-stretch lg:gap-0 lg:overflow-y-auto lg:overflow-x-hidden lg:border-b-0 lg:border-r lg:px-4 lg:py-6">
      <Link href={painelNav.href} className="shrink-0" aria-label="Ir para o painel">
        <Logo light />
      </Link>

      <Navigation />

      <div className="ml-auto hidden shrink-0 lg:ml-0 lg:mt-auto lg:block lg:pt-6">
        <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-2.5">
          <Avatar name={user.nome} size="sm" dark />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13.5px] font-semibold text-white">{user.nome}</div>
            <div className="truncate text-[11.5px] text-slate-300">
              {group ? group.nome : "—"} · {user.papel}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setConfirmando(true)}
            aria-label="Restaurar demonstração"
            title="Restaurar demonstração"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <RefreshIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={logout}
            aria-label="Sair"
            title="Sair"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <LogoutIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-1 lg:hidden">
        <button
          type="button"
          onClick={() => setConfirmando(true)}
          aria-label="Restaurar demonstração"
          title="Restaurar demonstração"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <RefreshIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={logout}
          aria-label="Sair"
          title="Sair"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <LogoutIcon className="h-4 w-4" />
        </button>
      </div>

      <Modal
        open={confirmando}
        onClose={() => setConfirmando(false)}
        eyebrow="Demonstração"
        title="Restaurar os dados?"
        footer={
          <>
            <Button onClick={() => setConfirmando(false)}>Cancelar</Button>
            <Button variant="danger" onClick={confirmarRestauracao}>
              <RefreshIcon className="h-4 w-4" /> Restaurar
            </Button>
          </>
        }
      >
        <p className="text-[12.5px] text-stone-600">
          Tentativas, pagamentos, chamadas, solicitações, avaliações e cadastros criados neste navegador serão
          substituídos pelos dados originais da demonstração.
        </p>
      </Modal>
    </aside>
  );
}