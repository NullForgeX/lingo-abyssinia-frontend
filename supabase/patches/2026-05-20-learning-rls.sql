-- Run this in Supabase SQL Editor if your project was created before the latest RLS fixes.
-- Safe to run more than once.

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'users create their own profile fallback'
  ) then
    create policy "users create their own profile fallback"
    on public.profiles for insert to authenticated
    with check (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'lesson_progress'
      and policyname = 'authenticated users read progress for leaderboard'
  ) then
    create policy "authenticated users read progress for leaderboard"
    on public.lesson_progress for select to authenticated
    using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'lesson_progress'
      and policyname = 'users update their own progress'
  ) then
    create policy "users update their own progress"
    on public.lesson_progress for update to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'community_posts'
      and policyname = 'users update community engagement'
  ) then
    create policy "users update community engagement"
    on public.community_posts for update to authenticated
    using (true)
    with check (true);
  end if;
end $$;
