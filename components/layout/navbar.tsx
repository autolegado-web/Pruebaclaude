"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Input } from "@/components/ui/field";
import { useAuth, useFavorites } from "@/app/providers";
import { PRIMARY_NAV } from "@/lib/site";
import { cn } from "@/lib/utils";

const TRANSPARENT_ROUTES = ["/"];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { favorites } = useFavorites();
  const { session } = useAuth();

  const overlay = TRANSPARENT_ROUTES.includes(pathname) && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,color] duration-300 ease-[var(--ease-out-quint)]",
        overlay
          ? "border-b border-transparent bg-transparent text-paper"
          : "border-b border-line bg-paper/92 text-ink backdrop-blur-md",
      )}
      data-overlay={overlay ? "true" : undefined}
    >
      <div className={cn("page flex items-center gap-6 transition-[height] duration-300", scrolled ? "h-14" : "h-[4.5rem]")}>
        <Link
          href="/"
          className="text-[1.0625rem] font-semibold tracking-[-0.06em] lowercase"
          aria-label="AUTORA, ir a la portada"
        >
          autora
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-7 lg:flex">
          {PRIMARY_NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative py-1 text-sm transition-opacity duration-150",
                  active ? "opacity-100" : "opacity-65 hover:opacity-100",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
                {active ? (
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 left-0 h-px w-full bg-current"
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <SearchDialog overlay={overlay} />

          <Link
            href="/favoritos"
            aria-label={`Favoritos${favorites.length ? `, ${favorites.length} guardados` : ""}`}
            className={cn(
              "relative hidden h-10 w-10 items-center justify-center rounded-sm transition-colors sm:flex",
              overlay ? "hover:bg-white/10" : "hover:bg-bone",
            )}
          >
            <Heart aria-hidden className="h-[1.125rem] w-[1.125rem]" />
            {favorites.length > 0 ? (
              <span
                data-numeric
                className={cn(
                  "absolute right-1.5 top-1.5 min-w-4 rounded-pill px-1 text-[0.625rem] leading-4",
                  overlay ? "bg-paper text-ink" : "bg-ink text-paper",
                )}
              >
                {favorites.length}
              </span>
            ) : null}
          </Link>

          <Link
            href={session ? "/cuenta" : "/login"}
            className={cn(
              "hidden items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors lg:flex",
              overlay ? "hover:bg-white/10" : "hover:bg-bone",
            )}
          >
            <User aria-hidden className="h-[1.125rem] w-[1.125rem]" />
            {session ? session.name.split(" ")[0] : "Iniciar sesión"}
          </Link>

          <Button
            asChild
            size="sm"
            variant={overlay ? "light" : "primary"}
            className="hidden sm:inline-flex"
          >
            <Link href="/vender">Vender mi coche</Link>
          </Button>

          <MobileMenu key={pathname} overlay={overlay} favorites={favorites.length} signedIn={Boolean(session)} />
        </div>
      </div>
    </header>
  );
}

function SearchDialog({ overlay }: { overlay: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const submit = () => {
    const q = value.trim();
    setOpen(false);
    router.push(q ? `/coches?q=${encodeURIComponent(q)}` : "/coches");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Buscar coches"
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-sm transition-colors",
            overlay ? "hover:bg-white/10" : "hover:bg-bone",
          )}
        >
          <Search aria-hidden className="h-[1.125rem] w-[1.125rem]" />
        </button>
      </SheetTrigger>
      <SheetContent side="center" title="Buscar" description="Marca, modelo o palabra clave.">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="space-y-4"
        >
          <Input
            autoFocus
            name="q"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="BMW Serie 3, SUV eléctrico, automático…"
            aria-label="Texto de búsqueda"
            className="h-12 text-base"
          />
          <div className="flex flex-wrap gap-2">
            {["SUV", "Eléctrico", "Automático", "Hasta 25.000 €"].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setValue(chip)}
                className="rounded-sm border border-line-strong px-3 py-1.5 text-[0.8125rem] text-graphite transition-colors hover:border-ink hover:text-ink"
              >
                {chip}
              </button>
            ))}
          </div>
          <Button type="submit" block size="lg">
            Buscar coches
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function MobileMenu({
  overlay,
  favorites,
  signedIn,
}: {
  overlay: boolean;
  favorites: number;
  signedIn: boolean;
}) {
  const [open, setOpen] = useState(false);

  // Se cierra al navegar porque Navbar le pasa `key={pathname}`: cada
  // cambio de ruta remonta este componente y `open` vuelve a su valor
  // inicial, sin necesidad de un efecto que sincronice estado.

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Abrir menú"
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-sm transition-colors lg:hidden",
            overlay ? "hover:bg-white/10" : "hover:bg-bone",
          )}
        >
          <Menu aria-hidden className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        title="Menú"
        footer={
          <SheetClose asChild>
            <Button asChild block size="lg">
              <Link href="/vender">Vender mi coche</Link>
            </Button>
          </SheetClose>
        }
      >
        <nav aria-label="Menú móvil" className="flex flex-col">
          {PRIMARY_NAV.map((item) => (
            <SheetClose asChild key={item.href}>
              <Link href={item.href} className="rule display-sm py-4 first:border-t-0">
                {item.label}
              </Link>
            </SheetClose>
          ))}
        </nav>
        <div className="mt-8 flex flex-col gap-1 border-t border-line pt-6 text-sm">
          <SheetClose asChild>
            <Link href="/favoritos" className="flex items-center justify-between py-2.5">
              Favoritos
              {favorites > 0 ? (
                <span data-numeric className="text-graphite">
                  {favorites}
                </span>
              ) : null}
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href={signedIn ? "/cuenta" : "/login"} className="py-2.5">
              {signedIn ? "Mi cuenta" : "Iniciar sesión"}
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/contacto" className="py-2.5">
              Contacto
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
