"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CarFilters } from "@/types/car";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

/* ------------------------------------------------------------------ */
/* Capa de persistencia                                                */
/*                                                                     */
/* Sin Supabase configurado: todo vive en localStorage (modo demo).    */
/* Con Supabase configurado: sesión y favoritos usan la base real;     */
/* búsquedas guardadas se quedan en localStorage por ahora (ver         */
/* README, Fase C) y lo mismo el resto del alcance de saved_searches.  */
/* ------------------------------------------------------------------ */

const KEYS = {
  favorites: "autora:favorites",
  searches: "autora:saved-searches",
  session: "autora:session",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* almacenamiento no disponible: la sesión sigue funcionando en memoria */
  }
}

/* ------------------------------ Toasts ---------------------------- */

export interface Toast {
  id: number;
  message: string;
  tone: "default" | "error";
  action?: { label: string; href: string };
}

interface ToastContext {
  toasts: Toast[];
  notify: (message: string, options?: { tone?: Toast["tone"]; action?: Toast["action"] }) => void;
  dismiss: (id: number) => void;
}

const ToastCtx = createContext<ToastContext | null>(null);

/* ---------------------------- Favoritos --------------------------- */

interface FavoritesContext {
  favorites: string[];
  ready: boolean;
  isFavorite: (id: string) => boolean;
  toggle: (id: string, label?: string) => void;
}

const FavoritesCtx = createContext<FavoritesContext | null>(null);

/* ------------------------- Búsquedas guardadas -------------------- */

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: CarFilters;
  createdAt: string;
  channels: { email: boolean; push: boolean };
}

interface SearchesContext {
  searches: SavedSearch[];
  ready: boolean;
  save: (search: Omit<SavedSearch, "id" | "createdAt">) => void;
  remove: (id: string) => void;
}

const SearchesCtx = createContext<SearchesContext | null>(null);

/* ------------------------------ Sesión ---------------------------- */

export interface Session {
  /** uuid de Supabase. Ausente en la sesión de demostración (sin Supabase). */
  id?: string;
  name: string;
  email: string;
}

interface AuthContext {
  session: Session | null;
  ready: boolean;
  /** Sesión de demostración (sin Supabase configurado). Con Supabase, el
   * inicio de sesión real lo hacen LoginForm/RegisterForm contra
   * supabase.auth; esta función queda como no-op en ese caso. */
  signIn: (session: Session) => void;
  signOut: () => void;
}

const AuthCtx = createContext<AuthContext | null>(null);

/* ---------------------------- Provider ---------------------------- */

export function Providers({ children }: { children: ReactNode }) {
  const supabaseOn = isSupabaseConfigured();
  const [ready, setReady] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback<ToastContext["notify"]>(
    (message, options) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev.slice(-2), { id, message, tone: options?.tone ?? "default", action: options?.action }]);
      window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss],
  );

  // Hidratación inicial. Sin Supabase: lee localStorage una vez. Con
  // Supabase: resuelve la sesión real y se suscribe a sus cambios; los
  // favoritos de esa sesión se cargan aparte, en el efecto siguiente.
  useEffect(() => {
    let cancelled = false;

    if (!supabaseOn) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratación única desde localStorage (modo sin Supabase)
      setFavorites(read<string[]>(KEYS.favorites, []));
      setSearches(read<SavedSearch[]>(KEYS.searches, []));
      setSession(read<Session | null>(KEYS.session, null));
      setReady(true);
      return;
    }

    setSearches(read<SavedSearch[]>(KEYS.searches, []));

    import("@/lib/supabase/client").then(({ createClient }) => {
      if (cancelled) return;
      const supabase = createClient();

      const toSession = (user: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null): Session | null =>
        user
          ? {
              id: user.id,
              email: user.email ?? "",
              name: (user.user_metadata?.full_name as string | undefined) || (user.email?.split("@")[0] ?? "Cuenta"),
            }
          : null;

      supabase.auth.getSession().then(({ data }) => {
        if (cancelled) return;
        setSession(toSession(data.session?.user ?? null));
        setReady(true);
      });

      const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(toSession(newSession?.user ?? null));
      });

      return () => sub.subscription.unsubscribe();
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo debe ejecutarse una vez, al montar
  }, []);

  // Favoritos: con Supabase y sesión real, viven en la tabla `favorites`.
  // Sin sesión (o sin Supabase configurado), quedan en localStorage.
  useEffect(() => {
    if (!supabaseOn || !session?.id) return;
    let cancelled = false;
    import("@/lib/supabase/favorites").then(({ listFavoriteIds }) => {
      listFavoriteIds(session.id!)
        .then((ids) => {
          if (!cancelled) setFavorites(ids);
        })
        .catch(() => notify("No se pudieron cargar tus favoritos.", { tone: "error" }));
    });
    return () => {
      cancelled = true;
    };
  }, [supabaseOn, session?.id, notify]);

  const toggle = useCallback<FavoritesContext["toggle"]>(
    (id, label) => {
      const wasFavorite = favorites.includes(id);
      const next = wasFavorite ? favorites.filter((f) => f !== id) : [...favorites, id];
      setFavorites(next);
      notify(
        wasFavorite ? `${label ?? "Coche"} eliminado de favoritos` : `${label ?? "Coche"} guardado en favoritos`,
        wasFavorite ? undefined : { action: { label: "Ver favoritos", href: "/favoritos" } },
      );

      if (supabaseOn && session?.id) {
        const userId = session.id;
        import("@/lib/supabase/favorites").then(({ addFavorite, removeFavorite }) => {
          const op = wasFavorite ? removeFavorite(userId, id) : addFavorite(userId, id);
          op.catch(() => {
            setFavorites(favorites); // revierte el cambio optimista si falla
            notify("No se pudo guardar el cambio. Inténtalo de nuevo.", { tone: "error" });
          });
        });
      } else {
        write(KEYS.favorites, next);
      }
    },
    [favorites, notify, supabaseOn, session],
  );

  const save = useCallback<SearchesContext["save"]>(
    (search) => {
      setSearches((prev) => {
        const next = [
          ...prev,
          { ...search, id: `s_${Date.now().toString(36)}`, createdAt: new Date().toISOString() },
        ];
        write(KEYS.searches, next);
        return next;
      });
      notify("Alerta creada. Te avisaremos cuando entre un coche que encaje.", {
        action: { label: "Ver alertas", href: "/cuenta/alertas" },
      });
    },
    [notify],
  );

  const remove = useCallback((id: string) => {
    setSearches((prev) => {
      const next = prev.filter((s) => s.id !== id);
      write(KEYS.searches, next);
      return next;
    });
  }, []);

  const signIn = useCallback(
    (value: Session) => {
      if (supabaseOn) return; // con Supabase, el login real lo hace LoginForm/RegisterForm
      setSession(value);
      write(KEYS.session, value);
      notify(`Sesión iniciada como ${value.name}`);
    },
    [notify, supabaseOn],
  );

  const signOut = useCallback(() => {
    if (supabaseOn) {
      import("@/lib/supabase/client").then(({ createClient }) => createClient().auth.signOut());
    } else {
      setSession(null);
      write(KEYS.session, null);
    }
    notify("Sesión cerrada");
  }, [notify, supabaseOn]);

  const favoritesValue = useMemo<FavoritesContext>(
    () => ({ favorites, ready, isFavorite: (id) => favorites.includes(id), toggle }),
    [favorites, ready, toggle],
  );

  return (
    <ToastCtx.Provider value={{ toasts, notify, dismiss }}>
      <AuthCtx.Provider value={{ session, ready, signIn, signOut }}>
        <FavoritesCtx.Provider value={favoritesValue}>
          <SearchesCtx.Provider value={{ searches, ready, save, remove }}>{children}</SearchesCtx.Provider>
        </FavoritesCtx.Provider>
      </AuthCtx.Provider>
    </ToastCtx.Provider>
  );
}

function useSafeContext<T>(ctx: React.Context<T | null>, name: string): T {
  const value = useContext(ctx);
  if (!value) throw new Error(`${name} debe usarse dentro de <Providers>`);
  return value;
}

export const useToasts = () => useSafeContext(ToastCtx, "useToasts");
export const useFavorites = () => useSafeContext(FavoritesCtx, "useFavorites");
export const useSavedSearches = () => useSafeContext(SearchesCtx, "useSavedSearches");
export const useAuth = () => useSafeContext(AuthCtx, "useAuth");
