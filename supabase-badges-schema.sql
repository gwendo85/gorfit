create table if not exists user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  parcours_id uuid not null,
  badge_title text not null,
  badge_description text,
  image_url text,
  date_unlocked timestamp with time zone default now(),
  unique (user_id, parcours_id)
); 