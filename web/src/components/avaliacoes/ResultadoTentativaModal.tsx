"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { icons } from "@/constants/icons";
import { alunoById } from "@/features/core/selectors";
import { cn, formatDateTime, formatGrade } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";

interface ResultadoTentativaModalProps {
  tentativaId: string;
  onClose: () => void;
}

/** Correção da tentativa: alternativa correta, resposta do aluno e nota. */
export function ResultadoTentativaModal({ tentativaId, onClose }: ResultadoTentativaModalProps) {
  const viewer = useViewer();
  const tentativa = viewer.data.tentativas.find((item) => item.id === tentativaId);
  const CheckIcon = icons.check;

  if (!tentativa) return null;

  const avaliacao = viewer.data.avaliacoes.find((item) => item.id === tentativa.avaliacaoId);
  const matricula = viewer.data.matriculas.find((item) => item.id === tentativa.matriculaId);
  const turma = viewer.data.turmas.find((item) => item.id === avaliacao?.turmaId);

  return (
    <Modal
      open
      onClose={onClose}
      eyebrow="Resultado da tentativa"
      title={avaliacao ? avaliacao.titulo : "Avaliação"}
      size="lg"
      footer={
        <Button variant="primary" onClick={onClose}>
          Fechar
        </Button>
      }
    >
      <div className="mb-4 flex items-center gap-4">
        <div className="font-display text-[58px] leading-none text-brand-700">
          {formatGrade(tentativa.pontuacao)}
          <span className="text-[13.5px] text-stone-600">/10</span>
        </div>
        <div>
          <div className="text-[14.5px] font-semibold text-slate-800">
            {matricula ? alunoById(viewer.data, matricula.alunoId).nome : "Aluno"}
          </div>
          <div className="text-[13px] text-stone-600">
            {turma ? turma.codigo : ""} · tentativa {tentativa.numero} · {formatDateTime(tentativa.fim)}
          </div>
          <div className="mt-2">
            <StatusBadge status="CONCLUIDA" />
          </div>
        </div>
      </div>

      {avaliacao?.questoes.map((questao, indice) => {
        const selecionada = tentativa.respostas ? tentativa.respostas[questao.id] : undefined;
        return (
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
              {questao.alternativas.map((alternativa, posicao) => {
                const correta = posicao === questao.correta;
                const escolhida = posicao === selecionada;
                return (
                  <div
                    key={alternativa}
                    className={cn(
                      "flex items-start gap-2 rounded-lg border px-2 py-1.5 text-[14px] text-slate-700",
                      correta
                        ? "border-emerald-200 bg-emerald-50"
                        : escolhida
                          ? "border-red-200 bg-red-50"
                          : "border-transparent",
                    )}
                  >
                    <span className="w-4 font-bold">{String.fromCharCode(65 + posicao)}</span>
                    <span className="flex-1">{alternativa}</span>
                    {correta ? <CheckIcon className="h-4 w-4 text-emerald-600" /> : null}
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-[12px] text-stone-600">
              {selecionada === questao.correta
                ? "Resposta correta."
                : selecionada === undefined
                  ? "Questão não respondida."
                  : "Resposta incorreta."}
            </p>
          </div>
        );
      })}
    </Modal>
  );
}