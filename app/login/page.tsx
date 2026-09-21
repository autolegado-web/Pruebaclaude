import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <div className="page flex min-h-[70svh] items-center justify-center py-28">
      <div className="w-full max-w-sm">
        <h1 className="display-md text-center">Inicia sesión</h1>
        <p className="lede mx-auto mt-3 text-center text-[0.9375rem]">
          Accede a tus favoritos, alertas y solicitudes.
        </p>
        <div className="mt-9">
          <LoginForm />
        </div>
        <p className="meta mt-8 text-center">
          Sesión de demostración: no se envían credenciales a ningún servidor todavía.
        </p>
      </div>
    </div>
  );
}
