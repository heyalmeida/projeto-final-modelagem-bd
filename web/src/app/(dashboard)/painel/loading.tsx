/** Esqueleto exibido enquanto o painel é montado. */
export default function PainelLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-16 w-2/3 max-w-md rounded-2xl bg-stone-200" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-[124px] rounded-2xl border border-stone-200 bg-white" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
        <div className="h-64 rounded-2xl border border-stone-200 bg-white" />
        <div className="h-64 rounded-2xl border border-stone-200 bg-white" />
      </div>
    </div>
  );
}