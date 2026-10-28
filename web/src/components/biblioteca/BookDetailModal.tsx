"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { CoverImage } from "@/components/ui/CoverImage";
import { DataTable, TableHeaderRow } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { capaDoLivro } from "@/constants/images";
import { acervoPorId, exemplaresDoLivro } from "@/features/biblioteca/selectors";
import { useBibliotecaActions } from "@/features/biblioteca/hooks/use-biblioteca-actions";
import { EXEMPLAR_STATUSES } from "@/features/biblioteca/schemas";
import { canManageLibrary } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";
import type { Livro } from "@/types/domain";

interface BookDetailModalProps {
  livro: Livro;
  open: boolean;
  onClose: () => void;
}

const ROTULOS_EXEMPLAR: Record<string, string> = {
  DISPONIVEL: "Disponível",
  EMPRESTADO: "Emprestado",
  MANUTENCAO: "Manutenção",
  BAIXADO: "Baixado",
};

/** Ficha do título: exemplares, circulação e tombamento de novos exemplares. */
export function BookDetailModal({ livro, open, onClose }: BookDetailModalProps) {
  const viewer = useViewer();
  const { adicionarExemplar, alternarStatusExemplar } = useBibliotecaActions();
  const exemplares = exemplaresDoLivro(viewer.data, livro.id);
  const acervo = acervoPorId(viewer.data, livro.acervoId);
  const podeGerenciar = canManageLibrary(viewer.user, viewer.group);

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="Biblioteca"
      title={livro.titulo}
      footer={
        <>
          {podeGerenciar ? (
            <Button onClick={() => adicionarExemplar(livro.id)}>Adicionar exemplar</Button>
          ) : null}
          <Button variant="primary" onClick={onClose}>
            Fechar
          </Button>
        </>
      }
    >
      <div className="mb-4 flex items-start gap-4">
        <div
          className="relative h-[126px] w-[96px] shrink-0 overflow-hidden rounded-xl"
          style={{ background: `linear-gradient(135deg, ${livro.cor}, #0b1f33)` }}
        >
          <CoverImage src={capaDoLivro(livro.area)} sizes="96px" />
          <span
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(11,31,51,.2) 0%, rgba(11,31,51,.75) 100%)" }}
          />
          <span className="absolute bottom-3 left-4 top-3 w-1 rounded bg-white/40" />
        </div>
        <div>
          <h3 className="font-display text-[24.5px] leading-tight text-slate-900">{livro.titulo}</h3>
          <p className="text-[13px] text-stone-600">
            {livro.autor} · {livro.editora} · {livro.ano}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-3 text-[12px] text-stone-600">
            <span>ISBN {livro.isbn}</span>
            <span>{livro.area}</span>
            <span>{acervo ? acervo.nome : "—"}</span>
          </div>
        </div>
      </div>

      <DataTable label={`Exemplares de ${livro.titulo}`}>
        <thead>
          <TableHeaderRow>
            <th>Tombo</th>
            <th>Localização</th>
            <th>Aquisição</th>
            <th>Status</th>
            {podeGerenciar ? <th className="text-right">Circulação</th> : null}
          </TableHeaderRow>
        </thead>
        <tbody>
          {exemplares.map((exemplar) => (
            <tr key={exemplar.id}>
              <td className="font-mono text-[12.5px]">{exemplar.tombo}</td>
              <td>{exemplar.localizacao}</td>
              <td>{formatDate(exemplar.dataAquisicao)}</td>
              <td>
                <StatusBadge status={exemplar.status} />
              </td>
              {podeGerenciar ? (
                <td className="text-right">
                  <Select
                    aria-label={`Situação do exemplar ${exemplar.tombo}`}
                    className="w-auto"
                    value={exemplar.status}
                    onChange={(event) =>
                      alternarStatusExemplar(exemplar.id, event.target.value as (typeof EXEMPLAR_STATUSES)[number])
                    }
                  >
                    {EXEMPLAR_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {ROTULOS_EXEMPLAR[status]}
                      </option>
                    ))}
                  </Select>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </DataTable>
    </Modal>
  );
}