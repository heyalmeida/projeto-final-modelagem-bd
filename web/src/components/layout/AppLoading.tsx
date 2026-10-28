/** Tela de espera enquanto a sessão e os dados locais são hidratados. */
export function AppLoading() {
  return (
    <div className="grid min-h-screen place-items-center bg-stone-100">
      <div className="flex flex-col items-center gap-3">
        <span className="loading loading-spinner loading-md text-brand-700" />
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-600">Carregando dados</p>
      </div>
    </div>
  );
}