"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { useAuth } from "@/app/providers";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

const ERROR_ES: Record<string, string> = {
  "User already registered": "Ya existe una cuenta con ese email. Inicia sesión en su lugar.",
};

export function RegisterForm() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    if (!name) return setError("Cuéntanos cómo te llamas.");
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return setError("Escribe un email válido.");
    if (password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");

    setError(null);
    setLoading(true);

    if (isSupabaseConfigured()) {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: result, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      setLoading(false);
      if (authError) return setError(ERROR_ES[authError.message] ?? authError.message);
      if (result.session) {
        router.push("/cuenta");
      } else {
        // El proyecto exige confirmar el email antes de iniciar sesión.
        setCheckEmail(email);
      }
      return;
    }

    await new Promise((r) => setTimeout(r, 700));
    signIn({ name, email });
    setLoading(false);
    router.push("/cuenta");
  };

  if (checkEmail) {
    return (
      <div className="rounded-lg border border-line p-6 text-center">
        <Mail aria-hidden className="mx-auto h-6 w-6 text-graphite" />
        <h2 className="mt-4 text-[1.0625rem] font-medium">Confirma tu email</h2>
        <p className="mt-2 text-[0.875rem] text-graphite">
          Te hemos enviado un enlace de confirmación a <b className="text-ink">{checkEmail}</b>. Ábrelo para
          activar tu cuenta.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <Field label="Nombre" htmlFor="r-name">
        <Input id="r-name" name="name" required autoComplete="name" autoFocus />
      </Field>
      <Field label="Email" htmlFor="r-email">
        <Input id="r-email" name="email" type="email" required autoComplete="email" />
      </Field>
      <Field label="Contraseña" htmlFor="r-pass" hint="Mínimo 6 caracteres.">
        <Input id="r-pass" name="password" type="password" required autoComplete="new-password" />
      </Field>
      {error ? (
        <p role="alert" className="text-[0.8125rem] text-[var(--color-alert)]">
          {error}
        </p>
      ) : null}
      <Button type="submit" block size="lg" loading={loading}>
        Crear cuenta
      </Button>
      <p className="meta text-center">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
