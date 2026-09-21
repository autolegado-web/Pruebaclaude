"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

const ERROR_ES: Record<string, string> = {
  "Invalid login credentials": "Email o contraseña incorrectos.",
  "Email not confirmed": "Confirma tu email antes de iniciar sesión (revisa tu bandeja de entrada).",
};

export function LoginForm() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return setError("Escribe un email válido.");
    if (!password) return setError("Introduce tu contraseña.");

    setError(null);
    setLoading(true);

    if (isSupabaseConfigured()) {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (authError) return setError(ERROR_ES[authError.message] ?? authError.message);
      router.push("/cuenta");
      return;
    }

    await new Promise((r) => setTimeout(r, 700));
    signIn({ name: email.split("@")[0], email });
    setLoading(false);
    router.push("/cuenta");
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <Field label="Email" htmlFor="l-email">
        <Input id="l-email" name="email" type="email" required autoComplete="email" autoFocus />
      </Field>
      <Field label="Contraseña" htmlFor="l-pass">
        <Input id="l-pass" name="password" type="password" required autoComplete="current-password" />
      </Field>
      {error ? (
        <p role="alert" className="text-[0.8125rem] text-[var(--color-alert)]">
          {error}
        </p>
      ) : null}
      <Button type="submit" block size="lg" loading={loading}>
        Iniciar sesión
      </Button>
      <p className="meta text-center">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
          Crea una
        </Link>
      </p>
    </form>
  );
}
