"use client";

import { useState } from "react";
import { useAvaliacoesActions } from "@/features/avaliacoes/hooks/use-avaliacoes-actions";
import {
  TIPOS_AVALIACAO,
  avaliacaoSchema,
  type AvaliacaoInput,
  type TipoAvaliacao,
} from "@/features/avaliacoes/schemas";
import { turmasVisiveis } from "@/features/core/selectors";
import { Button } from "@/components/ui/Button";
import { Field, FormError } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { siteConfig } from "@/config/site";
import { icons } from "@/constants/icons";
import { cn } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";
import type { Avaliacao } from "@/types/domain";

interface QuestaoForm {
  enunciado: string;
  pontos: string;
  alternativas: string[];
  correta: number;
}

interface AvaliacaoModalProps {
  /** Avaliação em edição (apenas rascunhos); `null` cria uma nova. */
  avaliacao: Avaliacao | null;
  onClose: () => void;
}

const JANELA_INICIO = `${siteConfig.todayDate}T19:00`;
const JANELA_FIM = "2026-11-10T23:59";

/**
 * Criação e edição de avaliações (rascunhos): identificação, janela, gestão de
 * tentativas e cadastro dinâmico de questões objetivas.
 */
export function AvaliacaoModal({ avaliacao, onClose }: AvaliacaoModalProps) {
  const viewer = useViewer();
  const { criarAvaliacao, atualizarAvaliacao, excluirAvaliacao } = useAvaliacoesActions();
  const PlusIcon = icons.plus;
  const CloseIcon = icons.close;

  const turmas = turmasVisiveis(viewer);
  const [turmaId, setTurmaId] = useState(avaliacao?.turmaId ?? turmas[0]?.id ?? "");
  const [titulo, setTitulo] = useState(avaliacao?.titulo ?? "");
  const [tipo, setTipo] = useState<string>(avaliacao?.tipo ?? TIPOS_AVALIACAO[0]);
  const [peso, setPeso] = useState(String(avaliacao?.peso ?? 2));
  const [inicio, setInicio] = useState(avaliacao?.inicio ?? JANELA_INICIO);
  const [fim, setFim] = useState(avaliacao?.fim ?? JANELA_FIM);
  const [maxTentativas, setMaxTentativas] = useState(String(avaliacao?.gestao.maxTentativas ?? 1));
  const [permiteRecuperacao, setPermiteRecuperacao] = useState(avaliacao?.gestao.permiteRecuperacao ?? false);
  const [pesoRecuperacao, setPesoRecuperacao] = useState(String(avaliacao?.gestao.pesoRecuperacao || 2));
  const [questoes, setQuestoes] = useState<QuestaoForm[]>(() =>
    avaliacao
      ? avaliacao.questoes.map((questao) => ({
          enunciado: questao.enunciado,
          pontos: String(questao.pontos),
          alternativas: [...questao.alternativas],
          correta: questao.correta,
        }))
      : [{ enunciado: "", pontos: "5", alternativas: ["", ""], correta: 0 }],
  );
  const [erro, setErro] = useState<string | null>(null);

  const atualizarQuestao = (indice: number, parcial: Partial<QuestaoForm>) => {
    setQuestoes((atuais) => atuais.map((questao, i) => (i === indice ? { ...questao, ...parcial } : questao)));
  };

  const adicionarQuestao = () =>
    setQuestoes((atuais) => [...atuais, { enunciado: "", pontos: "5", alternativas: ["", ""], correta: 0 }]);

  const removerQuestao = (indice: number) =>
    setQuestoes((atuais) => atuais.filter((_, i) => i !== indice));

  const adicionarAlternativa = (indice: number) =>
    setQuestoes((atuais) =>
      atuais.map((questao, i) =>
        i === indice && questao.alternativas.length < 5
          ? { ...questao, alternativas: [...questao.alternativas, ""] }
          : questao,
      ),
    );

  const removerAlternativa = (indiceQuestao: number, indiceAlternativa: number) =>
    setQuestoes((atuais) =>
      atuais.map((questao, i) => {
        if (i !== indiceQuestao || questao.alternativas.length <= 2) return questao;
        const alternativas = questao.alternativas.filter((_, j) => j !== indiceAlternativa);
        let correta = questao.correta;
        if (correta === indiceAlternativa) correta = 0;
        else if (correta > indiceAlternativa) correta -= 1;
        return { ...questao, alternativas, correta };
      }),
    );

  const salvar = () => {
    const input: AvaliacaoInput = {
      turmaId,
      titulo,
      tipo: tipo as TipoAvaliacao,
      peso: Number(peso),
      inicio,
      fim,
      maxTentativas: Number(maxTentativas),
      permiteRecuperacao,
      pesoRecuperacao: Number(permiteRecuperacao || 0),
      questoes: questoes.map((questao) => ({
        enunciado: questao.enunciado,
        alternativas: questao.alternativas,
        correta: questao.correta,
        pontos: Number(questao.pontos),
      })),
    };

    const parsed = avaliacaoSchema.safeParse(input);
    if (!parsed.success) {
      setErro(parsed.error.issues[0]?.message ?? "Avaliação inválida.");
      return;
    }

    const resultado = avaliacao
      ? atualizarAvaliacao(avaliacao.id, parsed.data)
      : criarAvaliacao(parsed.data);
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
      eyebrow="Módulo Avaliações"
      title={avaliacao ? "Editar rascunho" : "Nova avaliação"}
      size="lg"
      footer={
        <>
          {avaliacao ? (
            <Button
              variant="danger"
              onClick={() => {
                const resultado = excluirAvaliacao(avaliacao.id);
                if (resultado.ok) onClose();
              }}
            >
              Excluir rascunho
            </Button>
          ) : null}
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="primary" type="submit" form="avaliacao-form">
            Salvar rascunho
          </Button>
        </>
      }
    >
      <form
        id="avaliacao-form"
        onSubmit={(event) => {
          event.preventDefault();
          salvar();
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field htmlFor="avaliacao-titulo" label="Título" className="sm:col-span-2">
            <Input
              id="avaliacao-titulo"
              value={titulo}
              onChange={(event) => setTitulo(event.target.value)}
              placeholder="Ex.: Prova 2 — Modelagem de Dados"
            />
          </Field>

          <Field htmlFor="avaliacao-turma" label="Turma">
            <Select id="avaliacao-turma" value={turmaId} onChange={(event) => setTurmaId(event.target.value)}>
              {turmas.map((turma) => (
                <option key={turma.id} value={turma.id}>
                  {turma.codigo} · {turma.componente}
                </option>
              ))}
            </Select>
          </Field>

          <Field htmlFor="avaliacao-tipo" label="Tipo">
            <Select id="avaliacao-tipo" value={tipo} onChange={(event) => setTipo(event.target.value)}>
              {TIPOS_AVALIACAO.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </Field>

          <Field htmlFor="avaliacao-inicio" label="Abertura da janela">
            <Input
              id="avaliacao-inicio"
              type="datetime-local"
              value={inicio}
              onChange={(event) => setInicio(event.target.value)}
            />
          </Field>

          <Field htmlFor="avaliacao-fim" label="Encerramento da janela">
            <Input id="avaliacao-fim" type="datetime-local" value={fim} onChange={(event) => setFim(event.target.value)} />
          </Field>

          <Field htmlFor="avaliacao-peso" label="Peso na média">
            <Input
              id="avaliacao-peso"
              type="number"
              min="1"
              max="10"
              step="1"
              value={peso}
              onChange={(event) => setPeso(event.target.value)}
            />
          </Field>

          <Field htmlFor="avaliacao-tentativas" label="Tentativas permitidas">
            <Input
              id="avaliacao-tentativas"
              type="number"
              min="1"
              max="5"
              step="1"
              value={maxTentativas}
              onChange={(event) => setMaxTentativas(event.target.value)}
            />
          </Field>

          <div className="sm:col-span-2 flex flex-wrap items-center gap-4 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5">
            <label className="flex cursor-pointer items-center gap-2 text-[12.5px] font-semibold text-slate-800">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={permiteRecuperacao}
                onChange={(event) => setPermiteRecuperacao(event.target.checked)}
              />
              Permite recuperação
            </label>
            {permiteRecuperacao ? (
              <label className="flex items-center gap-2 text-[12px] text-stone-600">
                Peso da recuperação
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="1"
                  value={pesoRecuperacao}
                  onChange={(event) => setPesoRecuperacao(event.target.value)}
                  className="input input-xs input-bordered w-16 rounded-lg border-stone-300 bg-white focus:border-brand-600 focus:outline-none"
                />
              </label>
            ) : null}
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-display text-[17px] text-slate-900">Questões ({questoes.length})</h3>
            <Button onClick={adicionarQuestao}>
              <PlusIcon className="h-4 w-4" /> Adicionar questão
            </Button>
          </div>

          <div className="space-y-3">
            {questoes.map((questao, indiceQuestao) => (
              <fieldset key={indiceQuestao} className="rounded-xl border border-stone-200 bg-white p-3.5">
                <legend className="px-1 text-[11px] font-bold uppercase tracking-wide text-stone-600">
                  Questão {indiceQuestao + 1}
                </legend>

                <div className="grid gap-3 sm:grid-cols-[1fr_100px]">
                  <Field htmlFor={`questao-${indiceQuestao}-enunciado`} label="Enunciado">
                    <Input
                      id={`questao-${indiceQuestao}-enunciado`}
                      value={questao.enunciado}
                      onChange={(event) => atualizarQuestao(indiceQuestao, { enunciado: event.target.value })}
                      placeholder="Enunciado da questão"
                    />
                  </Field>
                  <Field htmlFor={`questao-${indiceQuestao}-pontos`} label="Pontos">
                    <Input
                      id={`questao-${indiceQuestao}-pontos`}
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={questao.pontos}
                      onChange={(event) => atualizarQuestao(indiceQuestao, { pontos: event.target.value })}
                    />
                  </Field>
                </div>

                <div className="mt-2 space-y-1.5">
                  {questao.alternativas.map((alternativa, indiceAlternativa) => (
                    <div key={indiceAlternativa} className="flex items-center gap-2">
                      <label className="flex cursor-pointer items-center gap-1.5 text-[11.5px] font-semibold text-stone-600">
                        <input
                          type="radio"
                          name={`correta-${indiceQuestao}`}
                          className="radio radio-xs"
                          checked={questao.correta === indiceAlternativa}
                          onChange={() => atualizarQuestao(indiceQuestao, { correta: indiceAlternativa })}
                        />
                        {String.fromCharCode(65 + indiceAlternativa)}
                      </label>
                      <Input
                        aria-label={`Alternativa ${String.fromCharCode(65 + indiceAlternativa)} da questão ${indiceQuestao + 1}`}
                        value={alternativa}
                        onChange={(event) => {
                          const texto = event.target.value;
                          setQuestoes((atuais) =>
                            atuais.map((q, i) =>
                              i === indiceQuestao
                                ? {
                                    ...q,
                                    alternativas: q.alternativas.map((a, j) => (j === indiceAlternativa ? texto : a)),
                                  }
                                : q,
                            ),
                          );
                        }}
                      />
                      {questao.alternativas.length > 2 ? (
                        <Button
                          variant="ghost"
                          aria-label={`Remover alternativa ${String.fromCharCode(65 + indiceAlternativa)}`}
                          onClick={() => removerAlternativa(indiceQuestao, indiceAlternativa)}
                        >
                          <CloseIcon className="h-3.5 w-3.5" />
                        </Button>
                      ) : null}
                    </div>
                  ))}
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => adicionarAlternativa(indiceQuestao)}
                    disabled={questao.alternativas.length >= 5}
                  >
                    <PlusIcon className="h-3.5 w-3.5" /> Alternativa
                  </Button>
                  <span className="text-[10.5px] text-stone-600">Marque com o círculo qual alternativa é correta.</span>
                  {questoes.length > 1 ? (
                    <Button variant="ghost" onClick={() => removerQuestao(indiceQuestao)}>
                      <CloseIcon className="h-3.5 w-3.5" /> Remover questão
                    </Button>
                  ) : null}
                </div>
              </fieldset>
            ))}
          </div>
        </div>

        {erro ? <FormError className="mt-3">{erro}</FormError> : null}

        <p className={cn("mt-3 text-[11px] text-stone-600")}>
          A avaliação é salva como rascunho e só fica visível para os alunos após a publicação.
        </p>
      </form>
    </Modal>
  );
}