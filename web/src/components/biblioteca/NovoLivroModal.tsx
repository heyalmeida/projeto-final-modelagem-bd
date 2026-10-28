"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, FormError } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import type { LivroInput } from "@/features/biblioteca/schemas";
import { useBibliotecaActions } from "@/features/biblioteca/hooks/use-biblioteca-actions";
import { useViewer } from "@/store/viewer-context";

/** Catalogação de um título novo, já gerando os exemplares informados. */
export function NovoLivroModal({ onClose }: { onClose: () => void }) {
  const viewer = useViewer();
  const { criarLivro } = useBibliotecaActions();

  const [acervoId, setAcervoId] = useState(viewer.data.acervos[0]?.id ?? "");
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [editora, setEditora] = useState("");
  const [ano, setAno] = useState("2024");
  const [area, setArea] = useState("");
  const [exemplares, setExemplares] = useState("2");
  const [erro, setErro] = useState<string | null>(null);

  const salvar = () => {
    const input: LivroInput = {
      acervoId,
      titulo,
      autor,
      isbn,
      editora,
      ano: Number(ano),
      area,
      exemplares: Number(exemplares || 0),
    };
    const resultado = criarLivro(input);
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
      title="Novo título"
      size="lg"
      footer={
        <>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="primary" type="submit" form="livro-form">
            Catalogar título
          </Button>
        </>
      }
    >
      <form
        id="livro-form"
        onSubmit={(event) => {
          event.preventDefault();
          salvar();
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field htmlFor="livro-acervo" label="Acervo">
            <Select id="livro-acervo" value={acervoId} onChange={(event) => setAcervoId(event.target.value)}>
              {viewer.data.acervos.map((acervo) => (
                <option key={acervo.id} value={acervo.id}>
                  {acervo.nome}
                </option>
              ))}
            </Select>
          </Field>

          <Field htmlFor="livro-area" label="Área do conhecimento" hint="Define a cor da capa no catálogo.">
            <Input
              id="livro-area"
              value={area}
              onChange={(event) => setArea(event.target.value)}
              placeholder="Ex.: Engenharia"
              list="areas-cadastradas"
            />
          </Field>

          <Field htmlFor="livro-titulo" label="Título" className="sm:col-span-2">
            <Input id="livro-titulo" value={titulo} onChange={(event) => setTitulo(event.target.value)} />
          </Field>

          <Field htmlFor="livro-autor" label="Autor">
            <Input id="livro-autor" value={autor} onChange={(event) => setAutor(event.target.value)} />
          </Field>

          <Field htmlFor="livro-editora" label="Editora">
            <Input id="livro-editora" value={editora} onChange={(event) => setEditora(event.target.value)} />
          </Field>

          <Field htmlFor="livro-isbn" label="ISBN">
            <Input
              id="livro-isbn"
              value={isbn}
              onChange={(event) => setIsbn(event.target.value)}
              placeholder="978-..."
            />
          </Field>

          <Field htmlFor="livro-ano" label="Ano de publicação">
            <Input
              id="livro-ano"
              type="number"
              min="1900"
              max="2100"
              value={ano}
              onChange={(event) => setAno(event.target.value)}
            />
          </Field>

          <Field
            htmlFor="livro-exemplares"
            label="Exemplares a tombarem"
            hint={`Até 6 por vez · próximo tombo a partir de T${1000 + viewer.data.exemplares.length}`}
            className="sm:col-span-2"
          >
            <Input
              id="livro-exemplares"
              type="number"
              min="0"
              max="6"
              value={exemplares}
              onChange={(event) => setExemplares(event.target.value)}
            />
          </Field>
        </div>

        <datalist id="areas-cadastradas">
          {[...new Set(viewer.data.livros.map((livro) => livro.area))].map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>

        {erro ? <FormError className="mt-3">{erro}</FormError> : null}

        <p className="mt-3 text-[11px] text-stone-600">
          O ISBN precisa ser único no catálogo; o sistema recusa duplicados.
        </p>
      </form>
    </Modal>
  );
}