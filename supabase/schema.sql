create extension if not exists pgcrypto;

create type public.user_role as enum ('learner', 'admin');
create type public.language_code as enum ('amharic', 'oromo', 'tigrinya');
create type public.lesson_level as enum ('beginner', 'intermediate', 'advanced');
create type public.lesson_status as enum ('draft', 'published');
create type public.post_type as enum ('question', 'tip');
create type public.thread_status as enum ('open', 'resolved');
create type public.report_status as enum ('open', 'resolved');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role public.user_role not null default 'learner',
  selected_language public.language_code not null default 'amharic',
  daily_goal integer not null default 15 check (daily_goal between 5 and 120),
  streak integer not null default 0,
  gems integer not null default 0,
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  language public.language_code not null,
  level public.lesson_level not null default 'beginner',
  status public.lesson_status not null default 'draft',
  xp_reward integer not null default 10,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lesson_progress (
  user_id uuid references public.profiles(id) on delete cascade,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  xp_earned integer not null default 0,
  primary key (user_id, lesson_id)
);

create table public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  type public.post_type not null,
  title text not null,
  body text not null,
  language public.language_code not null default 'amharic',
  status public.thread_status not null default 'open',
  likes integer not null default 0,
  reports integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.community_replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table public.moderation_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete set null,
  post_id uuid references public.community_posts(id) on delete cascade,
  reason text not null default 'Reported by learner',
  status public.report_status not null default 'open',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  actor text not null,
  action text not null,
  target text not null,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at before update on public.profiles
for each row execute function public.touch_updated_at();

create trigger lessons_touch_updated_at before update on public.lessons
for each row execute function public.touch_updated_at();

create trigger posts_touch_updated_at before update on public.community_posts
for each row execute function public.touch_updated_at();

create or replace function public.is_admin(user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = user_id and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    case when lower(new.email) = 'admin@lingoabyssinia.com' then 'admin'::public.user_role else 'learner'::public.user_role end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.community_posts enable row level security;
alter table public.community_replies enable row level security;
alter table public.moderation_reports enable row level security;
alter table public.admin_audit_logs enable row level security;

create policy "profiles are readable by authenticated users"
on public.profiles for select to authenticated using (true);

create policy "users create their own profile fallback"
on public.profiles for insert to authenticated
with check (auth.uid() = id);

create policy "users update their own learner profile"
on public.profiles for update to authenticated
using (auth.uid() = id or public.is_admin(auth.uid()))
with check (auth.uid() = id or public.is_admin(auth.uid()));

create policy "published lessons are readable"
on public.lessons for select to authenticated using (status = 'published' or public.is_admin(auth.uid()));

create policy "admins manage lessons"
on public.lessons for all to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "users read their own progress"
on public.lesson_progress for select to authenticated using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "authenticated users read progress for leaderboard"
on public.lesson_progress for select to authenticated using (true);

create policy "users write their own progress"
on public.lesson_progress for insert to authenticated with check (auth.uid() = user_id);

create policy "users update their own progress"
on public.lesson_progress for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "community posts are readable"
on public.community_posts for select to authenticated using (true);

create policy "users create community posts"
on public.community_posts for insert to authenticated with check (auth.uid() = author_id);

create policy "authors or admins update posts"
on public.community_posts for update to authenticated
using (auth.uid() = author_id or public.is_admin(auth.uid()))
with check (auth.uid() = author_id or public.is_admin(auth.uid()));

create policy "users update community engagement"
on public.community_posts for update to authenticated
using (true)
with check (true);

create policy "community replies are readable"
on public.community_replies for select to authenticated using (true);

create policy "users create replies"
on public.community_replies for insert to authenticated with check (auth.uid() = author_id);

create policy "reports readable by admins"
on public.moderation_reports for select to authenticated using (public.is_admin(auth.uid()));

create policy "users create reports"
on public.moderation_reports for insert to authenticated with check (auth.uid() = reporter_id);

create policy "admins update reports"
on public.moderation_reports for update to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "admins read audit logs"
on public.admin_audit_logs for select to authenticated using (public.is_admin(auth.uid()));

create policy "admins create audit logs"
on public.admin_audit_logs for insert to authenticated with check (public.is_admin(auth.uid()));

insert into public.lessons (title, language, level, status)
values
  ('Amharic Basics: Greetings', 'amharic', 'beginner', 'published'),
  ('Oromo Listening: Daily Conversation', 'oromo', 'intermediate', 'draft'),
  ('Tigrinya Grammar Patterns', 'tigrinya', 'advanced', 'published')
on conflict do nothing;


