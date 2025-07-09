-- Table des challenges disponibles
create table if not exists challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  type text not null check (type in ('reps', 'volume', 'sessions')),
  target integer not null,
  reward_badge_title text,
  reward_badge_description text,
  duration_days integer not null,
  image_url text,
  icon_emoji text default '🏆',
  created_at timestamp with time zone default now()
);

-- Table des challenges rejoints par les utilisateurs
create table if not exists user_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  challenge_id uuid references challenges(id) on delete cascade,
  start_date timestamp with time zone default now(),
  progress integer default 0,
  status text default 'in_progress' check (status in ('in_progress', 'completed')),
  date_completed timestamp with time zone,
  unique (user_id, challenge_id)
);

-- Index pour optimiser les requêtes
create index if not exists idx_user_challenges_user_id on user_challenges(user_id);
create index if not exists idx_user_challenges_status on user_challenges(status);
create index if not exists idx_challenges_type on challenges(type); 