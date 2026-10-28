"use client";

import { Logo } from "@/components/layout/Logo";
import { CoverImage } from "@/components/ui/CoverImage";
import { siteConfig } from "@/config/site";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useAppStore } from "@/store/app-store";

/** Painel de apresentação da tela de acesso. */
export function LoginHero() {
  const { data } = useAppStore();
  const CheckIcon = icons.check;

  return (
    <section className="relative flex min-h-[300px] flex-col justify-between overflow-hidden bg-slate-950 px-7 py-9 text-slate-200 lg:min-h-screen lg:px-14 lg:py-14">
      <CoverImage src={images.campus} sizes="(min-width: 1024px) 52vw, 100vw" priority className="opacity-40" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />
      <div className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-brand-400/20 blur-3xl" />

      <div className="relative z-10">
        <Logo light />
      </div>

      <div className="relative z-10 max-w-xl py-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-300/25 bg-brand-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-200">
          <CheckIcon className="h-3.5 w-3.5" /> Projeto final · modelagem de banco de dados
        </span>
        <h1 className="mt-5 font-display text-[42.5px] leading-[1.04] tracking-tight text-white sm:text-[58px] xl:text-[67px]">
          A faculdade inteira, <em className="text-brand-300">em um só lugar.</em>
        </h1>
        <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-slate-400">
          Cinco módulos conectados pela mesma matrícula. Avaliações, mensalidades, presença, agenda e biblioteca com
          acesso controlado por grupo.
        </p>
      </div>

      <div className="relative z-10 flex flex-wrap gap-2">
        {data.modulos.map((modulo) => (
          <span
            key={modulo.id}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[12.5px] text-slate-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-300" />
            {modulo.nome}
          </span>
        ))}
      </div>

      <div className="relative z-10 mt-8 hidden items-center gap-5 text-[12.5px] text-slate-500 sm:flex">
        <span>Protótipo local</span>
        <span>Dados fictícios</span>
        <span>{siteConfig.name} · Next.js</span>
      </div>
    </section>
  );
}