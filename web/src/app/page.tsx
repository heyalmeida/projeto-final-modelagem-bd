import { redirect } from "next/navigation";

/** A raiz do app leva ao painel; sem sessão, o layout do dashboard manda ao login. */
export default function RootPage() {
  redirect("/painel");
}