"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { AlertNote } from "@/components/ui/AlertNote";
import { FormError } from "@/components/ui/Field";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useTentativaForm } from "@/features/avaliacoes/hooks/use-tentativa-form";
import { limiteTentativas, tentativasDa } from "@/features/avaliacoes/selectors";
import { formatDateTime } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";
import type { Avaliacao } from "@/types/domain";

interface TentativaModalProps {
  avaliacao: Avaliacao;
  matriculaId: string;
  onClose: () => void;
}

/** Formulário de uma tentativa: uma alternativa por questão, envio único. */
export function TentativaModal({ avaliacao, matriculaId, onClose }: TentativaModalProps) {
  const viewer = useViewer();
  const { respostas, erro, selecionar, enviar } = useTentativaForm({
    avaliacao,
    matriculaId,
    onSuccess: onClose,
  });

  const anteriores = tentativasDa(viewer.data, avaliacao.id, matriculaId).length;
  const maximo = limiteTentativas(avaliacao);

  return (
    <Modal
      open
      onClose={onClose}
      eyebrow={`Tentativa ${anteriores + 1} de ${maximo}`}
      title={avaliacao.titulo}
      size="lg"
      footer={
        <>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="primary" type="submit" form="tentativa-form">
            Enviar tentativa
          </Button>
        </>
      }
    >
      <AlertNote icon="clock" title={`Janela aberta até ${formatDateTime(avaliacao.fim)}`} className="mb-3">
        A nota é calculada pela soma das questões corretas. Cada questão vale os pontos indicados.
      </AlertNote>

      <form
        id="tentativa-form"
        onSubmit={(event) => {
          event.preventDefault();
          enviar();
        }}
      >
        {avaliacao.questoes.map((questao, indice) => (
          <div key={questao.id} className="mb-3 rounded-xl border border-stone-200 bg-white p-3.5">
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-[14.5px] font-semibold text-slate-800">
                {indice + 1}. {questao.enunciado}
              </h4>
              <span className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-stone-500">
                {questao.pontos} ponto(s)
              </span>
            </div>
            <div className="mt-2 space-y-1">
              {questao.alternativas.map((alternativa, posicao) => (
                <label
                  key={alternativa}
                  className="flex cursor-pointer items-start gap-2 rounded-lg px-2 py-1.5 text-[14px] text-slate-700 hover:bg-stone-50"
                >
                  <input
                    type="radio"
                    name={questao.id}
                    value={posicao}
                    checked={respostas[questao.id] === posicao}
                    onChange={() => selecionar(questao.id, posicao)}
                    className="radio radio-xs mt-0.5"
                  />
                  <span>{alternativa}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {erro ? <FormError className="mb-2">{erro}</FormError> : null}
        <p className="text-[12.5px] text-stone-600">Ao enviar, a tentativa é finalizada e não pode ser alterada.</p>
      </form>

      <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3">
        <span className="text-[12px] text-stone-600">
          {Object.keys(respostas).length} de {avaliacao.questoes.length} questão(ões) respondida(s)
        </span>
        <StatusBadge status="ABERTA" />
      </div>
    </Modal>
  );
}