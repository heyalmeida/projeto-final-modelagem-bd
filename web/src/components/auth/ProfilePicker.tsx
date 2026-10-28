"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { icons } from "@/constants/icons";
import { loginProfiles } from "@/features/auth/selectors";
import { useLogin } from "@/features/auth/hooks/use-login";
import { useAppStore } from "@/store/app-store";

/** Lista de perfis de demonstração: escolher um abre a sessão. */
export function ProfilePicker() {
  const { data } = useAppStore();
  const entrar = useLogin();
  const profiles = loginProfiles(data);
  const AlertIcon = icons.alert;

  return (
    <section className="flex items-center justify-center px-4 py-8 lg:px-10">
      <Card className="w-full max-w-[470px] p-6 sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">Acesso de demonstração</p>
        <h2 className="mt-1 font-display text-[33.5px] leading-tight text-slate-900">Entrar no EduGestor</h2>
        <p className="mt-1 text-[14.5px] text-stone-600">
          Escolha um perfil para explorar a plataforma. O menu e as permissões mudam conforme o grupo.
        </p>

        <div className="mt-5 flex max-h-[420px] flex-col gap-2 overflow-y-auto pr-1 scroll-thin">
          {profiles.map(({ user, group, role }) => (
            <button
              key={user.id}
              type="button"
              onClick={() => entrar(user.id, user.nome)}
              className="flex w-full items-center gap-3 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-left transition hover:border-brand-600 hover:bg-brand-50/60"
            >
              <Avatar name={user.nome} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-semibold text-slate-800">{user.nome}</span>
                <span className="block truncate text-[12.5px] text-stone-600">
                  {group.nome} · {role}
                </span>
              </span>
              <span className="rounded-full border border-brand-600/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-700">
                {role}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-start gap-2 border-t border-dashed border-stone-200 pt-4 text-[12.5px] leading-relaxed text-stone-600">
          <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <span>
            Protótipo local com dados fictícios. A sessão e as alterações ficam salvas neste navegador até você
            restaurar a demonstração.
          </span>
        </div>
      </Card>
    </section>
  );
}