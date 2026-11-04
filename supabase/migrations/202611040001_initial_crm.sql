-- ALINVEST CRM: initial schema
create extension if not exists pgcrypto;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists public.course_segments (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  segment_id uuid not null references public.course_segments(id) on delete restrict,
  title text not null,
  summary text,
  delivery_mode text,
  duration text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text not null,
  city text,
  education_level text,
  professional_status text,
  organization text,
  notes text,
  source text not null default 'landing_page',
  consent boolean not null default false,
  selected_segment_slugs text[] not null default '{}',\n  preferred_mode text,\n  preferred_schedule text,
  status text not null default 'new' check (status in ('new','contacted','follow_up','qualified','application_started','enrolled','matriculated','no_answer','not_interested','lost')),
  priority text not null default 'normal' check (priority in ('low','normal','high')),
  assigned_to uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.lead_interests (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  segment_id uuid not null references public.course_segments(id) on delete restrict,
  course_id uuid references public.courses(id) on delete set null,
  preferred_schedule text,
  preferred_mode text,
  created_at timestamptz not null default now(),
  unique (lead_id, segment_id, course_id)
);
create table if not exists public.lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  activity_type text not null check (activity_type in ('call','email','whatsapp','meeting','note','status_change','task')),
  subject text not null,
  details text,
  next_action_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads(created_at desc);
create index if not exists leads_status_idx on public.leads(status);
create index if not exists lead_interests_lead_idx on public.lead_interests(lead_id);
create index if not exists lead_interests_segment_idx on public.lead_interests(segment_id);
create index if not exists lead_activities_lead_idx on public.lead_activities(lead_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at before update on public.leads
for each row execute function public.set_updated_at();

-- Internal trigger function: atomically materializes selected segments without exposing PII to anon.
create or replace function private.create_lead_interests()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare segment_slug text;
begin
  if cardinality(new.selected_segment_slugs) < 1 or cardinality(new.selected_segment_slugs) > 3 then
    raise exception 'Select between one and three segments';
  end if;
  foreach segment_slug in array new.selected_segment_slugs loop
    insert into public.lead_interests (lead_id, segment_id)
    select new.id, s.id
    from public.course_segments s
    where s.slug = segment_slug and s.active = true;
    if not found then raise exception 'Invalid or inactive segment'; end if;
  end loop;
  return new;
end;
$$;
revoke all on function private.create_lead_interests() from public, anon, authenticated;
drop trigger if exists leads_create_interests on public.leads;
create trigger leads_create_interests after insert on public.leads
for each row execute function private.create_lead_interests();

insert into public.course_segments (slug, name, description, sort_order)
values
 ('normas-iso','Normas ISO','Sistemas de gestão, implementação, auditoria e normas ISO.',1),
 ('hsee','HSEE','Higiene, Segurança, Saúde e Ambiente.',2),
 ('negocios-gestao','Negócios / Gestão','Gestão empresarial, liderança, administração e empreendedorismo.',3)
on conflict (slug) do update set name = excluded.name, description = excluded.description, sort_order = excluded.sort_order;

alter table public.course_segments enable row level security;
alter table public.courses enable row level security;
alter table public.leads enable row level security;
alter table public.lead_interests enable row level security;
alter table public.lead_activities enable row level security;

drop policy if exists "Public can read active segments" on public.course_segments;
create policy "Public can read active segments" on public.course_segments for select to anon, authenticated using (active = true);
drop policy if exists "Public can read active courses" on public.courses;
create policy "Public can read active courses" on public.courses for select to anon, authenticated using (active = true);

drop policy if exists "Public can create leads" on public.leads;
create policy "Public can create leads" on public.leads for insert to anon, authenticated
with check (status = 'new' and assigned_to is null and consent = true and source = 'landing_page' and cardinality(selected_segment_slugs) between 1 and 3);

drop policy if exists "Authenticated users manage leads" on public.leads;
create policy "Authenticated users manage leads" on public.leads for all to authenticated using (true) with check (true);
drop policy if exists "Authenticated users manage interests" on public.lead_interests;
create policy "Authenticated users manage interests" on public.lead_interests for all to authenticated using (true) with check (true);
drop policy if exists "Authenticated users manage activities" on public.lead_activities;
create policy "Authenticated users manage activities" on public.lead_activities for all to authenticated using (true) with check (true);
drop policy if exists "Authenticated users manage segments" on public.course_segments;
create policy "Authenticated users manage segments" on public.course_segments for all to authenticated using (true) with check (true);
drop policy if exists "Authenticated users manage courses" on public.courses;
create policy "Authenticated users manage courses" on public.courses for all to authenticated using (true) with check (true);

grant select on public.course_segments, public.courses to anon, authenticated;
grant insert on public.leads to anon, authenticated;
grant select, insert, update, delete on public.leads, public.lead_interests, public.lead_activities, public.course_segments, public.courses to authenticated;
