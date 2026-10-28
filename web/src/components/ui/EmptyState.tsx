import { icons, type IconKey } from "@/constants/icons";

interface EmptyStateProps {
  icon: IconKey;
  title: string;
  text: string;
}

/** Estado vazio padrão de listas, tabelas e painéis. */
export function EmptyState({ icon, title, text }: EmptyStateProps) {
  const Icon = icons[icon];
  return (
    <div className="px-5 py-10 text-center">
      <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-stone-100 text-stone-500">
        <Icon className="h-6 w-6" strokeWidth={1.6} />
      </span>
      <h3 className="font-display text-lg text-slate-800">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-[13.5px] text-stone-600">{text}</p>
    </div>
  );
}