import type { ImgHTMLAttributes } from "react";

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  onError?: () => void;
};

/** Mock de `next/image` para renderização fora do runtime do Next. */
export default function Image({ src, alt, fill, sizes, priority, onError: _onError, ...rest }: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      data-fill={fill ? "true" : undefined}
      {...rest}
    />
  );
}