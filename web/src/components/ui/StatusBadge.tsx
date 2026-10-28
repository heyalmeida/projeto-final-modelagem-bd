import { Badge } from "@/components/ui/Badge";
import { statusLabel, statusTone } from "@/constants/status";
import { cn } from "@/lib/utils";

/** Status persistido em qualquer entidade, com cor e rótulo padronizados. */
export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <Badge
      tone={statusTone(status)}
      className={cn("gap-1.5 whitespace-nowrap text-[11px] font-bold uppercase tracking-wide", className)}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {statusLabel(status)}
    </Badge>
  );
}