import { Badge } from "@/components/ui/Badge";
import { roleBadgeLabel } from "@/lib/auth";
import type { BadgeTone } from "@/types/ui";
import type { Papel } from "@/types/domain";

const ROLE_TONES: Record<Papel, BadgeTone> = {
  ROOT: "purple",
  ADMINISTRADOR: "info",
  USUARIO: "neutral",
};

/** Papel do usuário no núcleo de acesso (ROOT, administrador ou usuário). */
export function RoleBadge({ papel }: { papel: Papel }) {
  return <Badge tone={ROLE_TONES[papel]} className="text-[11px] font-bold uppercase tracking-wide">{roleBadgeLabel(papel)}</Badge>;
}