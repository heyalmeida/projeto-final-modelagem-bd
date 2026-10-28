"use client";

import { cn } from "@/lib/utils";

export interface TabItem<T extends string> {
  id: T;
  label: string;
  /** Contador opcional exibido após o rótulo. */
  count?: number;
}

interface TabsProps<T extends string> {
  items: ReadonlyArray<TabItem<T>>;
  value: T;
  onChange: (id: T) => void;
  label: string;
  className?: string;
}

/** Barra de abas das páginas com conteúdo segmentado. */
export function Tabs<T extends string>({ items, value, onChange, label, className }: TabsProps<T>) {
  return (
    <div role="tablist" aria-label={label} className={cn("tabs tabs-boxed bg-stone-200/70 p-1", className)}>
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={cn(
              "tab h-8 rounded-lg text-[13px] font-semibold",
              active ? "tab-active bg-white text-slate-900 shadow-sm" : "text-stone-600",
            )}
          >
            {item.label}
            {item.count ? (
              <span className="ml-1 rounded-full bg-amber-100 px-1.5 text-[11px] font-bold text-amber-700">
                {item.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}