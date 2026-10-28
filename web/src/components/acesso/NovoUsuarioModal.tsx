"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, FormError } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { useAcessoActions } from "@/features/acesso/hooks/use-acesso-actions";
import type { UsuarioInput } from "@/features/acesso/schemas";
import { useViewer } from "@/store/viewer-context";

/**
 * Cadastro de usuário de demonstração. O papel herda do grupo — coerente com a
 * matriz de acesso, que é a fonte de verdade das permissões.
 */
export function NovoUsuarioModal({ onClose }: { onClose: () => void }) {
  const viewer = useViewer();
  const { criarUsuario } = useAcessoActions();

  const [nome, setNome] = useState("");
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [grupoId, setGrupoId] = useState(viewer.data.grupos[0]?.id ?? "");
  const [erro, setErro] = useState<string | null>(null);

  const grupoSelecionado = viewer.data.grupos.find((grupo) => grupo.id === grupoId);

  const salvar = () => {
    const input: UsuarioInput = { nome, login, email, grupoId };
    const resultado = criarUsuario(input);
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
      eyebrow="Administração"
      title="Novo usuário"
      footer={
        <>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="primary" type="submit" form="usuario-form">
            Criar usuário
          </Button>
        </>
      }
    >
      <form
        id="usuario-form"
        onSubmit={(event) => {
          event.preventDefault();
          salvar();
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field htmlFor="usuario-nome" label="Nome completo" className="sm:col-span-2">
            <Input
              id="usuario-nome"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              placeholder="Ex.: Rafaela Duarte"
            />
          </Field>

          <Field htmlFor="usuario-login" label="Login">
            <Input
              id="usuario-login"
              value={login}
              onChange={(event) => setLogin(event.target.value)}
              placeholder="Ex.: rafaela.secretaria"
            />
          </Field>

          <Field htmlFor="usuario-email" label="E-mail">
            <Input
              id="usuario-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="rafaela.duarte@faculdade.edu.br"
            />
          </Field>

          <Field
            htmlFor="usuario-grupo"
            label="Grupo de acesso"
            hint={grupoSelecionado ? `Papel herdado: ${grupoSelecionado.papel}` : undefined}
            className="sm:col-span-2"
          >
            <Select id="usuario-grupo" value={grupoId} onChange={(event) => setGrupoId(event.target.value)}>
              {viewer.data.grupos.map((grupo) => (
                <option key={grupo.id} value={grupo.id}>
                  {grupo.nome} · {grupo.papel}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        {erro ? <FormError className="mt-3">{erro}</FormError> : null}

        <p className="mt-3 text-[11px] text-stone-600">
          O acesso nasce pelo grupo: os módulos visíveis são os da matriz, e o login aparece na lista de demonstração.
        </p>
      </form>
    </Modal>
  );
}