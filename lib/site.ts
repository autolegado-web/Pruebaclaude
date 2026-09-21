export const SITE = {
  name: "AUTORA",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://autora.example",
  email: "hola@autora.example",
  phone: "+34 900 000 000",
  city: "Madrid",
} as const;

export const PRIMARY_NAV = [
  { href: "/coches", label: "Coches" },
  { href: "/vender", label: "Vender" },
  { href: "/financiacion", label: "Financiación" },
  { href: "/como-funciona", label: "Cómo funciona" },
] as const;

export const FOOTER_NAV = [
  {
    title: "Comprar",
    links: [
      { href: "/coches", label: "Todos los coches" },
      { href: "/coches?fuel=El%C3%A9ctrico", label: "Eléctricos" },
      { href: "/coches?bodyType=SUV", label: "SUV" },
      { href: "/coches?maxPrice=20000", label: "Hasta 20.000 €" },
      { href: "/favoritos", label: "Favoritos" },
    ],
  },
  {
    title: "Vender",
    links: [
      { href: "/vender", label: "Vender mi coche" },
      { href: "/como-funciona#vender", label: "Cómo funciona la venta" },
      { href: "/contacto", label: "Hablar con el equipo" },
    ],
  },
  {
    title: "Ayuda",
    links: [
      { href: "/como-funciona", label: "Cómo funciona" },
      { href: "/financiacion", label: "Financiación" },
      { href: "/contacto", label: "Contacto" },
      { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "/terminos", label: "Términos" },
      { href: "/privacidad", label: "Privacidad" },
      { href: "/cookies", label: "Cookies" },
    ],
  },
] as const;
