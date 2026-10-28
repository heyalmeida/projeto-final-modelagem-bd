import { ProfilePicker } from "@/components/auth/ProfilePicker";
import { LoginHero } from "@/components/auth/LoginHero";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-stone-100 lg:grid-cols-[1.05fr_0.95fr]">
      <LoginHero />
      <ProfilePicker />
    </main>
  );
}