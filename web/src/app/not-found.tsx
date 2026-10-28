import { ButtonLink } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Card";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-stone-100 px-4">
      <Panel className="my-[8vh] max-w-lg text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">404</p>
        <h1 className="mt-1 font-display text-[33.5px] text-slate-900">Página não encontrada</h1>
        <p className="mt-2 text-[14px] text-stone-600">
          O endereço informado não existe neste dashboard.
        </p>
        <ButtonLink href="/painel" variant="primary" className="mt-4">
          Ir para o painel
        </ButtonLink>
      </Panel>
    </div>
  );
}