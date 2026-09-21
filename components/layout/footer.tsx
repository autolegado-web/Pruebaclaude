import Link from "next/link";
import { FOOTER_NAV, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-28 border-t border-line bg-paper">
      <div className="page py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <p className="text-[1.75rem] font-semibold tracking-[-0.06em] lowercase">autora</p>
            <p className="lede mt-4 max-w-xs text-[0.9375rem]">
              Coches de ocasión revisados uno a uno, con precio cerrado y toda la información
              sobre la mesa antes de decidir.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {FOOTER_NAV.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="text-[0.8125rem] font-medium text-ink">{column.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[0.8125rem] text-graphite transition-colors hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-6 text-[0.75rem] text-graphite sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AUTORA. Proyecto de demostración.</p>
          <p>
            {SITE.email} · {SITE.phone}
          </p>
        </div>
      </div>
    </footer>
  );
}
