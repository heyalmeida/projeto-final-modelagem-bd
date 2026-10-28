"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CoverImageProps {
  src: string;
  /** Imagens decorativas usam `alt` vazio: o texto do cartão já descreve. */
  alt?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/**
 * Imagem de capa com degradê de fallback: se o provedor estiver indisponível, o
 * cartão mantém o fundo colorido definido pelo componente pai.
 */
export function CoverImage({ src, alt = "", sizes, priority = false, className }: CoverImageProps) {
  const [falhou, setFalhou] = useState(false);
  if (falhou) return null;

  return (
    <Image
      src={src}
      alt={alt}
      aria-hidden={alt === "" ? true : undefined}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFalhou(true)}
      className={cn("object-cover", className)}
    />
  );
}