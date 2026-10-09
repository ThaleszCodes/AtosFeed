-- REVIEW ONLY. No remote execution performed. Separate namespace; no old tables touched.
begin;
create schema if not exists atosfeed;
create table atosfeed.organizations(id uuid primary key default gen_random_uuid(), name text not null);
create table atosfeed.members(organization_id uuid references atosfeed.organizations(id),user_id uuid references auth.users(id),role text not null check(role in ('owner','editor','viewer')),primary key(organization_id,user_id));
create function atosfeed.has_role(org uuid, roles text[]) returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from atosfeed.members m where m.organization_id=org and m.user_id=auth.uid() and m.role=any(roles));
$$;
revoke all on function atosfeed.has_role(uuid,text[]) from public;
grant usage on schema atosfeed to authenticated;
grant execute on function atosfeed.has_role(uuid,text[]) to authenticated;
create table atosfeed.groups(organization_id uuid references atosfeed.organizations(id),facebook_group_id text not null,name text not null,observed_at timestamptz not null default now(),primary key(organization_id,facebook_group_id));
create table atosfeed.jobs(id uuid primary key default gen_random_uuid(), organization_id uuid not null references atosfeed.organizations(id),group_id text not null,body text not null check(length(trim(body))>0),due_at timestamptz not null,state text not null default 'queued' check(state in ('queued','executing','sent','awaiting_approval','failed','unknown','cancelled')),idempotency_key uuid not null,attempted_at timestamptz,unique(organization_id,idempotency_key),foreign key(organization_id,group_id) references atosfeed.groups(organization_id,facebook_group_id));
alter table atosfeed.organizations enable row level security;
alter table atosfeed.members enable row level security;
alter table atosfeed.groups enable row level security;
alter table atosfeed.jobs enable row level security;
create policy org_read on atosfeed.organizations for select to authenticated using(atosfeed.has_role(id,array['owner','editor','viewer']));
create policy member_read on atosfeed.members for select to authenticated using(atosfeed.has_role(organization_id,array['owner','editor','viewer']));
create policy groups_read on atosfeed.groups for select to authenticated using(atosfeed.has_role(organization_id,array['owner','editor','viewer']));
create policy groups_insert on atosfeed.groups for insert to authenticated with check(atosfeed.has_role(organization_id,array['owner','editor']));
create policy groups_update on atosfeed.groups for update to authenticated using(atosfeed.has_role(organization_id,array['owner','editor'])) with check(atosfeed.has_role(organization_id,array['owner','editor']));
create policy jobs_read on atosfeed.jobs for select to authenticated using(atosfeed.has_role(organization_id,array['owner','editor','viewer']));
create policy jobs_insert on atosfeed.jobs for insert to authenticated with check(atosfeed.has_role(organization_id,array['owner','editor']) and state='queued' and attempted_at is null);
grant select on atosfeed.organizations,atosfeed.members,atosfeed.groups,atosfeed.jobs to authenticated;
grant insert,update on atosfeed.groups to authenticated;
grant insert(organization_id,group_id,body,due_at,idempotency_key) on atosfeed.jobs to authenticated;
-- Execution transitions will be server controlled after authenticated pairing is implemented.
-- No grants for member/organization mutations; trusted onboarding must create memberships.
commit;
