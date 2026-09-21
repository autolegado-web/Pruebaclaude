-- =========================================================================
-- AUTORA · esquema inicial
-- =========================================================================
-- Convenciones:
--   * Toda tabla con datos privados de un usuario tiene RLS activado y una
--     política que compara auth.uid() con la columna user_id.
--   * `cars` es de lectura pública (es el catálogo) y de escritura solo
--     para administradores (rol guardado en profiles.is_admin).
--   * Los timestamps usan timestamptz y se autorrellenan con trigger.
--   * Las claves primarias son uuid con gen_random_uuid() (extensión pgcrypto,
--     activada por defecto en Supabase).
-- =========================================================================

-- ------------------------------------------------------------------------
-- Utilidad: columna updated_at automática
-- ------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ------------------------------------------------------------------------
-- profiles — extensión 1:1 de auth.users
-- ------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: el propio usuario lee su perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: el propio usuario actualiza su perfil"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Crea automáticamente un perfil al registrarse.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------------------
-- cars — catálogo. Lectura pública, escritura solo admin.
-- ------------------------------------------------------------------------
create table public.cars (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  brand text not null,
  model text not null,
  version text not null,
  year int not null check (year between 1990 and 2100),
  price numeric(10, 2) not null check (price >= 0),
  previous_price numeric(10, 2),
  mileage int not null check (mileage >= 0),
  fuel text not null check (fuel in ('Gasolina', 'Diésel', 'Híbrido', 'Híbrido enchufable', 'Eléctrico')),
  transmission text not null check (transmission in ('Manual', 'Automático')),
  power int not null check (power > 0),
  body_type text not null check (
    body_type in ('Berlina', 'SUV', 'Compacto', 'Familiar', 'Coupé', 'Cabrio', 'Monovolumen', 'Pick-up')
  ),
  doors int not null,
  seats int not null,
  drivetrain text not null check (drivetrain in ('Delantera', 'Trasera', 'Total')),
  color text not null,
  location text not null,
  description text not null default '',
  features text[] not null default '{}',
  environmental_label text not null check (environmental_label in ('0', 'ECO', 'C', 'B')),
  verified boolean not null default true,
  warranty_months int not null default 12,
  financing_down_payment numeric(10, 2),
  financing_months int not null default 60,
  financing_apr numeric(5, 2) not null default 7.95,
  sold boolean not null default false,
  listed_at timestamptz not null default now(),
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index cars_brand_idx on public.cars (brand);
create index cars_body_type_idx on public.cars (body_type);
create index cars_price_idx on public.cars (price);
create index cars_listed_at_idx on public.cars (listed_at desc);

create trigger cars_set_updated_at
  before update on public.cars
  for each row execute function public.set_updated_at();

alter table public.cars enable row level security;

create policy "cars: cualquiera puede ver los coches no eliminados"
  on public.cars for select
  using (true);

create policy "cars: solo administradores insertan"
  on public.cars for insert
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

create policy "cars: solo administradores actualizan"
  on public.cars for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

create policy "cars: solo administradores eliminan"
  on public.cars for delete
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- Tabla de imágenes, separada para admitir varias por coche y reordenarlas.
create table public.car_images (
  id uuid primary key default gen_random_uuid(),
  car_id uuid not null references public.cars (id) on delete cascade,
  url text not null,
  alt text not null default '',
  position int not null default 0
);

create index car_images_car_id_idx on public.car_images (car_id, position);

alter table public.car_images enable row level security;

create policy "car_images: cualquiera puede ver las imágenes"
  on public.car_images for select
  using (true);

create policy "car_images: solo administradores gestionan"
  on public.car_images for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- ------------------------------------------------------------------------
-- favorites — privados por usuario
-- ------------------------------------------------------------------------
create table public.favorites (
  user_id uuid not null references public.profiles (id) on delete cascade,
  car_id uuid not null references public.cars (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, car_id)
);

alter table public.favorites enable row level security;

create policy "favorites: el usuario ve solo los suyos"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "favorites: el usuario añade los suyos"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "favorites: el usuario borra los suyos"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------------------
-- saved_searches — alertas guardadas
-- ------------------------------------------------------------------------
create table public.saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  filters jsonb not null default '{}',
  notify_email boolean not null default true,
  notify_push boolean not null default false,
  created_at timestamptz not null default now()
);

create index saved_searches_user_id_idx on public.saved_searches (user_id);

alter table public.saved_searches enable row level security;

create policy "saved_searches: el usuario gestiona las suyas"
  on public.saved_searches for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------------------
-- inquiries — "solicitar información" / "quiero comprarlo"
-- ------------------------------------------------------------------------
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  car_id uuid not null references public.cars (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete set null,
  kind text not null check (kind in ('info', 'comprar', 'reservar')),
  name text not null,
  email text not null,
  phone text,
  message text,
  status text not null default 'nueva' check (status in ('nueva', 'en_proceso', 'cerrada')),
  created_at timestamptz not null default now()
);

create index inquiries_car_id_idx on public.inquiries (car_id);
create index inquiries_user_id_idx on public.inquiries (user_id);

alter table public.inquiries enable row level security;

create policy "inquiries: el usuario ve las suyas"
  on public.inquiries for select
  using (auth.uid() = user_id);

create policy "inquiries: cualquiera autenticado o anónimo puede crear una"
  on public.inquiries for insert
  with check (true);

create policy "inquiries: administradores ven y gestionan todas"
  on public.inquiries for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- ------------------------------------------------------------------------
-- sell_requests — formulario "vender mi coche"
-- ------------------------------------------------------------------------
create table public.sell_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  brand text not null,
  model text not null,
  version text,
  year int not null,
  mileage int not null,
  plate text,
  fuel text not null,
  transmission text not null,
  condition text not null default 'Buen estado',
  notes text,
  contact_name text not null,
  contact_email text not null,
  contact_phone text,
  status text not null default 'recibida'
    check (status in ('recibida', 'valorada', 'aceptada', 'rechazada', 'cerrada')),
  valuation_min numeric(10, 2),
  valuation_max numeric(10, 2),
  created_at timestamptz not null default now()
);

create index sell_requests_user_id_idx on public.sell_requests (user_id);

alter table public.sell_requests enable row level security;

create policy "sell_requests: el usuario ve las suyas"
  on public.sell_requests for select
  using (auth.uid() = user_id);

create policy "sell_requests: cualquiera autenticado o anónimo puede crear una"
  on public.sell_requests for insert
  with check (true);

create policy "sell_requests: administradores gestionan todas"
  on public.sell_requests for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- ------------------------------------------------------------------------
-- reservations — reserva de un vehículo concreto
-- ------------------------------------------------------------------------
create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  car_id uuid not null references public.cars (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete set null,
  status text not null default 'pendiente'
    check (status in ('pendiente', 'confirmada', 'cancelada', 'completada')),
  deposit_amount numeric(10, 2),
  created_at timestamptz not null default now()
);

create index reservations_car_id_idx on public.reservations (car_id);
create index reservations_user_id_idx on public.reservations (user_id);

alter table public.reservations enable row level security;

create policy "reservations: el usuario ve las suyas"
  on public.reservations for select
  using (auth.uid() = user_id);

create policy "reservations: el usuario autenticado reserva"
  on public.reservations for insert
  with check (auth.uid() = user_id);

create policy "reservations: administradores gestionan todas"
  on public.reservations for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- ------------------------------------------------------------------------
-- messages — hilo de mensajes ligado a una inquiry o reserva
-- ------------------------------------------------------------------------
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid references public.inquiries (id) on delete cascade,
  reservation_id uuid references public.reservations (id) on delete cascade,
  sender_id uuid references public.profiles (id) on delete set null,
  body text not null,
  created_at timestamptz not null default now(),
  constraint messages_one_parent check (
    (inquiry_id is not null and reservation_id is null)
    or (inquiry_id is null and reservation_id is not null)
  )
);

create index messages_inquiry_id_idx on public.messages (inquiry_id);
create index messages_reservation_id_idx on public.messages (reservation_id);

alter table public.messages enable row level security;

create policy "messages: el remitente ve los suyos"
  on public.messages for select
  using (auth.uid() = sender_id);

create policy "messages: el usuario autenticado escribe"
  on public.messages for insert
  with check (auth.uid() = sender_id);

create policy "messages: administradores ven y gestionan todos"
  on public.messages for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- ------------------------------------------------------------------------
-- reviews — opiniones de compradores/vendedores
-- ------------------------------------------------------------------------
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  car_id uuid references public.cars (id) on delete set null,
  rating int not null check (rating between 1 and 5),
  comment text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "reviews: cualquiera ve las publicadas"
  on public.reviews for select
  using (published = true or auth.uid() = user_id);

create policy "reviews: el usuario autenticado escribe la suya"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "reviews: el usuario edita la suya"
  on public.reviews for update
  using (auth.uid() = user_id);

create policy "reviews: administradores gestionan todas"
  on public.reviews for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));
