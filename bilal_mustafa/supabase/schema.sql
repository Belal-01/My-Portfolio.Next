-- ============================================================
-- Migration 001: Initial schema — Portfolio + Admin Dashboard
-- ============================================================

-- ------------------------------------------------------------
-- 1. Enums (Idempotent creation)
-- ------------------------------------------------------------
do $$ 
begin
  if not exists (select 1 from pg_type where typname = 'project_category') then
    create type project_category as enum ('frontend', 'devops', 'cybersecurity');
  end if;
  if not exists (select 1 from pg_type where typname = 'project_status') then
    create type project_status as enum ('draft', 'published', 'archived');
  end if;
end $$;

-- ------------------------------------------------------------
-- 2. profiles — يربط مستخدم Supabase Auth بدور (admin/viewer)
-- ------------------------------------------------------------
create table if not exists profiles (
  id    uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role  text not null default 'admin' check (role in ('admin'))
);

create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  ) or (auth.role() = 'authenticated');
$$;

-- Trigger تلقائي لإنشاء بروفايل عند تسجيل أي مستخدم جديد
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'admin')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function handle_new_user();

-- ------------------------------------------------------------
-- 3. projects
-- ------------------------------------------------------------
create table if not exists projects (
  id                    uuid primary key default gen_random_uuid(),
  title                 text not null,
  slug                  text not null unique,
  short_description     text not null,
  challenge             text,
  solution              text,
  categories            project_category[] not null default '{}',
  tech_stack            text[] not null default '{}',
  cover_image           text not null,
  architecture_diagram  text,
  github_url            text,
  live_url              text,
  video_demo_url        text,
  status                project_status not null default 'draft',
  is_featured           boolean not null default false,
  display_order         integer not null default 0,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  constraint projects_categories_not_empty check (array_length(categories, 1) > 0)
);

create index if not exists idx_projects_status on projects(status);

-- ------------------------------------------------------------
-- 4. project_images — غاليري متعددة الصور لكل مشروع
-- ------------------------------------------------------------
create table if not exists project_images (
  id             uuid primary key default gen_random_uuid(),
  project_id     uuid not null references projects(id) on delete cascade,
  image_url      text not null,
  caption        text,
  display_order  integer not null default 0,
  created_at     timestamptz not null default now()
);

create index if not exists idx_project_images_project_id on project_images(project_id);

-- ------------------------------------------------------------
-- 5. certifications
-- ------------------------------------------------------------
create table if not exists certifications (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  issuer            text not null,
  issue_date        date not null,
  expiry_date       date,
  badge_image       text,
  credential_url    text,
  skills_acquired   text[] not null default '{}',
  created_at        timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 6. messages — نموذج التواصل
-- ------------------------------------------------------------
create table if not exists messages (
  id            uuid primary key default gen_random_uuid(),
  sender_name   text not null,
  sender_email  text not null,
  message       text not null,
  is_read       boolean not null default false,
  created_at    timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 7. resumes — السيرة الذاتية (CV)
-- ------------------------------------------------------------
create table if not exists resumes (
  id            uuid primary key default gen_random_uuid(),
  file_name     text not null,
  file_url      text not null,
  file_size     integer,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 8. updated_at تلقائي عند أي تعديل على projects
-- ------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_projects_updated_at on projects;
create trigger trg_projects_updated_at
before update on projects
for each row execute function set_updated_at();

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

alter table profiles       enable row level security;
alter table projects       enable row level security;
alter table project_images enable row level security;
alter table certifications enable row level security;
alter table messages       enable row level security;
alter table resumes        enable row level security;

-- ---------- profiles ----------
drop policy if exists "user can view own profile" on profiles;
create policy "user can view own profile"
on profiles for select
to authenticated
using (id = auth.uid());

-- ---------- projects ----------
drop policy if exists "public can view published projects" on projects;
create policy "public can view published projects"
on projects for select
to anon, authenticated
using (status = 'published');

drop policy if exists "authenticated can insert projects" on projects;
create policy "authenticated can insert projects"
on projects for insert
to authenticated
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated can update projects" on projects;
create policy "authenticated can update projects"
on projects for update
to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated can delete projects" on projects;
create policy "authenticated can delete projects"
on projects for delete
to authenticated
using (auth.role() = 'authenticated');

-- ---------- project_images ----------
drop policy if exists "public can view images of published projects" on project_images;
create policy "public can view images of published projects"
on project_images for select
to anon, authenticated
using (
  exists (
    select 1 from projects
    where projects.id = project_images.project_id
    and projects.status = 'published'
  )
);

drop policy if exists "authenticated can manage project images" on project_images;
create policy "authenticated can manage project images"
on project_images for all
to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- ---------- certifications ----------
drop policy if exists "public can view certifications" on certifications;
create policy "public can view certifications"
on certifications for select
to anon, authenticated
using (true);

drop policy if exists "authenticated can manage certifications" on certifications;
create policy "authenticated can manage certifications"
on certifications for all
to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- ---------- messages ----------
drop policy if exists "anyone can insert a message" on messages;
create policy "anyone can insert a message"
on messages for insert
to anon, authenticated
with check (true);

drop policy if exists "authenticated can view messages" on messages;
create policy "authenticated can view messages"
on messages for select
to authenticated
using (auth.role() = 'authenticated');

drop policy if exists "authenticated can update messages" on messages;
create policy "authenticated can update messages"
on messages for update
to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated can delete messages" on messages;
create policy "authenticated can delete messages"
on messages for delete
to authenticated
using (auth.role() = 'authenticated');

-- ---------- resumes ----------
drop policy if exists "public can view active resume" on resumes;
create policy "public can view active resume"
on resumes for select
to anon, authenticated
using (true);

drop policy if exists "authenticated can manage resumes" on resumes;
create policy "authenticated can manage resumes"
on resumes for all
to anon, authenticated
using (true)
with check (true);


-- ============================================================
-- Initial Seed Data
-- ============================================================

INSERT INTO projects (
  id,
  title,
  slug,
  short_description,
  challenge,
  solution,
  categories,
  tech_stack,
  cover_image,
  architecture_diagram,
  github_url,
  live_url,
  status,
  is_featured,
  display_order
) VALUES
(
  'c1b2a3f4-e5d6-7c8b-9a0b-1c2d3e4f5a6b',
  'DevSecOps Automated Pipeline & Cloud Infrastructure',
  'devsecops-automated-pipeline',
  'منصة أتمتة البنية التحتية الآمنة مع فحص الثغرات التلقائي والنشر عبر Kubernetes و Terraform.',
  'صعوبة اكتشاف الثغرات الأمنية في المراحل المبكرة وتأخر عمليات التكرار بسبب المراجعات اليدوية المستمرة.',
  'دمج أدوات SAST (SonarQube) و DAST و Trivy لفحص الحوايا ضمن مسار GitHub Actions مجهّز بأعلى معايير الأمان.',
  ARRAY['devops', 'cybersecurity']::project_category[],
  ARRAY['Next.js', 'Docker', 'Kubernetes', 'GitHub Actions', 'Trivy', 'Terraform', 'Supabase'],
  'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
  'https://github.com/example/devsecops-pipeline',
  'https://devsecops.demo.com',
  'published'::project_status,
  true,
  1
),
(
  'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
  'Enterprise Cyber Security Dashboard',
  'enterprise-cyber-dashboard',
  'واجهة تفاعلية رائدة لمتابعة مخاطر الأمن السيبراني وتحليل السجلات لحظة بلحظة.',
  'تشتت مصادر البيانات وكثرة الإنذارات الكاذبة التي تشتت فريق الحماية الاستجابي.',
  'تصميم لوحة تحكم سريعة باستخدام Next.js App Router و Server Components لربط السجلات وعرض التنبيهات ذكياً.',
  ARRAY['frontend', 'cybersecurity']::project_category[],
  ARRAY['Next.js 16', 'TypeScript', 'Tailwind CSS v4', 'PostgreSQL', 'Supabase Auth'],
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
  'https://github.com/example/cyber-dashboard',
  'https://cyber.demo.com',
  'published'::project_status,
  true,
  2
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO certifications (
  id,
  name,
  issuer,
  issue_date,
  expiry_date,
  badge_image,
  credential_url,
  skills_acquired
) VALUES
(
  'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
  'AWS Certified Security - Specialty',
  'Amazon Web Services (AWS)',
  '2024-01-15',
  '2027-01-15',
  'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=600&auto=format&fit=crop',
  'https://aws.amazon.com/verification',
  ARRAY['AWS IAM Policy Granular Design', 'KMS Key Management', 'VPC Flow Logs', 'GuardDuty & Security Hub']
),
(
  'd4e5f6a7-b89c-0d1e-2f3a-4b5c6d7e8f9a',
  'Certified Information Systems Security Professional (CISSP)',
  '(ISC)²',
  '2023-06-10',
  '2026-06-10',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop',
  'https://isc2.org/verification',
  ARRAY['Security Architecture', 'Risk Management', 'Cryptography', 'Identity & Access Control']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 8. Storage Buckets & Policies for Media Uploads & Resumes
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Read Storage" ON storage.objects;
CREATE POLICY "Public Read Storage"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id IN ('portfolio-media', 'resumes'));

DROP POLICY IF EXISTS "Authenticated Upload Storage" ON storage.objects;
CREATE POLICY "Authenticated Upload Storage"
ON storage.objects FOR ALL
TO anon, authenticated
USING (bucket_id IN ('portfolio-media', 'resumes'))
WITH CHECK (bucket_id IN ('portfolio-media', 'resumes'));

DROP POLICY IF EXISTS "Authenticated Delete Storage" ON storage.objects;
CREATE POLICY "Authenticated Delete Storage"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id IN ('portfolio-media', 'resumes'));

