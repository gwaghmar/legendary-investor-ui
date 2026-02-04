-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE (Links to Auth Users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  username text,
  full_name text,
  avatar_url text,
  role text default 'user',
  updated_at timestamp with time zone,
  
  constraint username_length check (char_length(username) >= 3)
);

-- Turn on RLS
alter table public.profiles enable row level security;

-- Policies for Profiles
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

create policy "Admins can view all profiles"
  on profiles for select
  using ( (select role from public.profiles where id = auth.uid()) = 'super_user' );

-- PORTFOLIOS TABLE
create table public.portfolios (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  symbol text not null,
  shares numeric not null default 0,
  avg_cost numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS for Portfolios
alter table public.portfolios enable row level security;

create policy "Users can view own portfolio."
  on portfolios for select
  using ( (auth.uid() = user_id) or (exists (select 1 from public.profiles where id = auth.uid() and role = 'super_user')) );

create policy "Users can insert own portfolio."
  on portfolios for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own portfolio."
  on portfolios for update
  using ( auth.uid() = user_id );

-- WATCHLISTS TABLE
create table public.watchlists (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  symbol text not null,
  added_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.watchlists enable row level security;

create policy "Users can view own watchlist."
  on watchlists for select
  using ( (auth.uid() = user_id) or (exists (select 1 from public.profiles where id = auth.uid() and role = 'super_user')) );

create policy "Users can insert into own watchlist."
  on watchlists for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete from own watchlist."
  on watchlists for delete
  using ( auth.uid() = user_id );

-- HANDLE NEW USER SIGNUP (Trigger)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
