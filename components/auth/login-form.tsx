"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

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
    await new Promise((r) => setTimeout(r, 700)); // ← aquí irá supabase.auth.signInWithPassword(...)
    signIn({ name: email.split("@")[0], email });
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
