-- El formulario de /contacto no está ligado a un coche concreto, a diferencia
-- de "solicitar información" / "comprar" / "reservar" desde una ficha.
-- Se permite car_id nulo y se añade el tipo 'general'.

alter table public.inquiries alter column car_id drop not null;

alter table public.inquiries drop constraint inquiries_kind_check;
alter table public.inquiries add constraint inquiries_kind_check
  check (kind in ('info', 'comprar', 'reservar', 'general'));
