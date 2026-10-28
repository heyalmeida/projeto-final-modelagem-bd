import type { ReactNode } from "react";
import { icons, type IconKey } from "@/constants/icons";
import { cn } from "@/lib/utils";

interface AlertNoteProps {
  title?: string;
  icon?: IconKey;
  className?: string;
  children: ReactNode;
}

/** Observação informativa em tom azul, usada em regras de negócio e modais. */
export function AlertNote({ title, icon = "alert", className, children }: AlertNoteProps) {
  const Icon = icons[icon];
  return (
    <div className={cn("alert alert-info border-blue-200 bg-blue-50 text-blue-900", className)}>
      <Icon className="h-4 w-4 shrink-0" />
      <div>
        {title ? <strong className="text-[13.5px]">{title}</strong> : null}
        <div className="text-[12.5px]">{children}</div>
      </div>
    </div>
  );
}