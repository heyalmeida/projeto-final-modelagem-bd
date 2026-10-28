/** Mocks das APIs de navegação do Next usadas pelos componentes. */

export const usePathname = (): string => "/painel";

export const useRouter = () => ({
  push: () => undefined,
  replace: () => undefined,
  back: () => undefined,
  forward: () => undefined,
  refresh: () => undefined,
  prefetch: () => undefined,
});

export const useSearchParams = (): URLSearchParams => new URLSearchParams();

export const redirect = (): void => undefined;
export const notFound = (): void => undefined;