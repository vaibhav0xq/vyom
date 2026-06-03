create table if not exists public.capsules (
  id text primary key,
  title text not null,
  message text not null,
  recipient text,
  unlock_at bigint not null,
  access_type text not null default 'link' check (access_type in ('link', 'wallet')),
  visibility text not null check (visibility in ('private', 'link')),
  created_at bigint not null
);

alter table public.capsules
  add column if not exists access_type text not null default 'link';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'capsules_access_type_check'
      and conrelid = 'public.capsules'::regclass
  ) then
    alter table public.capsules
      add constraint capsules_access_type_check
      check (access_type in ('link', 'wallet')) not valid;
  end if;
end $$;

update public.capsules
set access_type = 'link'
where access_type is null;

alter table public.capsules
  validate constraint capsules_access_type_check;

alter table public.capsules enable row level security;
