create table if not exists public.admin_quizzes (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references public.lessons(id) on delete cascade,
  language public.language_code not null default 'amharic',
  question text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option text not null check (correct_option in ('A', 'B', 'C', 'D')),
  explanation text not null default '',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'admin_quizzes_touch_updated_at'
      and tgrelid = 'public.admin_quizzes'::regclass
      and not tgisinternal
  ) then
    create trigger admin_quizzes_touch_updated_at before update on public.admin_quizzes
    for each row execute function public.touch_updated_at();
  end if;
end $$;

alter table public.admin_quizzes enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'admin_quizzes'
      and policyname = 'admins manage quizzes'
  ) then
    create policy "admins manage quizzes"
    on public.admin_quizzes for all to authenticated
    using (public.is_admin(auth.uid()))
    with check (public.is_admin(auth.uid()));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'admin_quizzes'
      and policyname = 'authenticated users read quizzes'
  ) then
    create policy "authenticated users read quizzes"
    on public.admin_quizzes for select to authenticated
    using (true);
  end if;
end $$;
