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

/* ------------------------------------------------------------------ */
/* Capa de persistencia                                                */
/*                                                                     */
/* Hoy: localStorage. Mañana: Supabase.                                */
/* Todo lo que hay que cambiar está en lib/store.ts + estos providers. */
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
  name: string;
  email: string;
}

interface AuthContext {
  session: Session | null;
  ready: boolean;
  signIn: (session: Session) => void;
  signOut: () => void;
}

const AuthCtx = createContext<AuthContext | null>(null);

/* ---------------------------- Provider ---------------------------- */

export function Providers({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Lee localStorage una sola vez tras montar. No puede ir en el render (el
  // servidor no tiene localStorage) ni en un useState perezoso (el primer
  // render de cliente tiene que coincidir con el del servidor para evitar
  // un error de hidratación); `ready` distingue "aún no hidratado" para
  // quien lo necesite.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratación única desde localStorage, ver comentario arriba
    setFavorites(read<string[]>(KEYS.favorites, []));
    setSearches(read<SavedSearch[]>(KEYS.searches, []));
    setSession(read<Session | null>(KEYS.session, null));
    setReady(true);
  }, []);

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

  const toggle = useCallback<FavoritesContext["toggle"]>(
    (id, label) => {
      setFavorites((prev) => {
        const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
        write(KEYS.favorites, next);
        notify(
          prev.includes(id)
            ? `${label ?? "Coche"} eliminado de favoritos`
            : `${label ?? "Coche"} guardado en favoritos`,
          prev.includes(id) ? undefined : { action: { label: "Ver favoritos", href: "/favoritos" } },
        );
        return next;
      });
    },
    [notify],
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
      setSession(value);
      write(KEYS.session, value);
      notify(`Sesión iniciada como ${value.name}`);
    },
    [notify],
  );

  const signOut = useCallback(() => {
    setSession(null);
    write(KEYS.session, null);
    notify("Sesión cerrada");
  }, [notify]);

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
