import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

export const metadata: Metadata = {
  title: "Crear cuenta",
  robots: { index: false },
};

export default function RegisterPage() {
  return (
    <div className="page flex min-h-[70svh] items-center justify-center py-28">
      <div className="w-full max-w-sm">
        <h1 className="display-md text-center">Crea tu cuenta</h1>
        <p className="lede mx-auto mt-3 text-center text-[0.9375rem]">
          Guarda favoritos y alertas para no volver a buscar desde cero.
        </p>
        <div className="mt-9">
          <RegisterForm />
        </div>
        {!isSupabaseConfigured() && (
          <p className="meta mt-8 text-center">
            Sesión de demostración: no se envían credenciales a ningún servidor todavía.
          </p>
        )}
      </div>
    </div>
  );
}
