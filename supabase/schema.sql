create table if not exists public.capsules (
  id text primary key,
  title text not null,
  message text not null,
  recipient text,
  unlock_at bigint not null,
  visibility text not null check (visibility in ('private', 'link')),
  created_at bigint not null
);

alter table public.capsules enable row level security;
