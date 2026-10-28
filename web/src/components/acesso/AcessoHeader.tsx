"use client";

import { useState } from "react";
import { NovoUsuarioModal } from "@/components/acesso/NovoUsuarioModal";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { icons } from "@/constants/icons";
import { useAcessoActions } from "@/features/acesso/hooks/use-acesso-actions";

/** Cabeçalho administrativo: usuários, matriz e restauração da demonstração. */
export function AcessoHeader() {
  const { restaurarDemo } = useAcessoActions();
  const [confirmando, setConfirmando] = useState(false);
  const [criando, setCriando] = useState(false);
  const RefreshIcon = icons.refresh;
  const PlusIcon = icons.plus;

  return (
    <>
      <PageHeader
        eyebrow="Administração"
        title="Grupos, papéis e módulos"
        sub="A matriz define quais módulos cada grupo enxerga. Apenas o papel ROOT altera esta configuração."
        actions={
          <>
            <Button onClick={() => setCriando(true)}>
              <PlusIcon className="h-4 w-4" /> Novo usuário
            </Button>
            <Button variant="danger" onClick={() => setConfirmando(true)}>
              <RefreshIcon className="h-4 w-4" /> Restaurar demonstração
            </Button>
          </>
        }
      />

      {criando ? <NovoUsuarioModal onClose={() => setCriando(false)} /> : null}

      <Modal
        open={confirmando}
        onClose={() => setConfirmando(false)}
        eyebrow="Demonstração"
        title="Restaurar os dados?"
        footer={
          <>
            <Button onClick={() => setConfirmando(false)}>Cancelar</Button>
            <Button
              variant="danger"
              onClick={() => {
                restaurarDemo();
                setConfirmando(false);
              }}
            >
              <RefreshIcon className="h-4 w-4" /> Restaurar
            </Button>
          </>
        }
      >
        <p className="text-[14px] text-stone-600">
          As tentativas, pagamentos, chamadas e solicitações criadas neste navegador serão substituídas pelos dados
          originais do protótipo.
        </p>
      </Modal>
    </>
  );
}