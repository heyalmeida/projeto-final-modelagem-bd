"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, FormError } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import type { AcervoInput } from "@/features/biblioteca/schemas";
import { useBibliotecaActions } from "@/features/biblioteca/hooks/use-biblioteca-actions";
import { useViewer } from "@/store/viewer-context";

/** Criação de acervo; o responsável é o usuário logado. */
export function NovoAcervoModal({ onClose }: { onClose: () => void }) {
  const viewer = useViewer();
  const { criarAcervo } = useBibliotecaActions();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [area, setArea] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  const salvar = () => {
    const input: AcervoInput = { nome, descricao, area };
    const resultado = criarAcervo(input, viewer.user.id);
    if (!resultado.ok) {
      setErro(resultado.error);
      return;
    }
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      eyebrow="Biblioteca"
      title="Novo acervo"
      footer={
        <>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="primary" type="submit" form="acervo-form">
            Criar acervo
          </Button>
        </>
      }
    >
      <form
        id="acervo-form"
        onSubmit={(event) => {
          event.preventDefault();
          salvar();
        }}
      >
        <div className="grid gap-3">
          <Field htmlFor="acervo-nome" label="Nome">
            <Input
              id="acervo-nome"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              placeholder="Ex.: Acervo de Datos e IA"
            />
          </Field>

          <Field htmlFor="acervo-descricao" label="Descrição">
            <Textarea
              id="acervo-descricao"
              value={descricao}
              onChange={(event) => setDescricao(event.target.value)}
              placeholder="Quais referências o acervo reúne?"
            />
          </Field>

          <Field htmlFor="acervo-area" label="Área do conhecimento">
            <Input
              id="acervo-area"
              value={area}
              onChange={(event) => setArea(event.target.value)}
              placeholder="Ex.: Dados"
            />
          </Field>
        </div>

        {erro ? <FormError className="mt-3">{erro}</FormError> : null}

        <p className="mt-3 text-[11px] text-stone-600">
          Responsável: <strong className="text-slate-800">{viewer.user.nome}</strong> (usuário logado).
        </p>
      </form>
    </Modal>
  );
}