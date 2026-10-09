-- Additive AtosFeed-only migration. Review before applying to the existing project.
begin;
create table atosfeed.pairing_codes (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references atosfeed.organizations(id),
 created_by uuid not null references auth.users(id), code_hash text not null unique check(code_hash ~ '^[a-f0-9]{64}$'),
 expires_at timestamptz not null default now()+interval '5 minutes', consumed_at timestamptz,
 created_at timestamptz not null default now()
);
create table atosfeed.devices (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references atosfeed.organizations(id),
 paired_by uuid not null references auth.users(id), name text not null check(length(name) between 1 and 80),
 extension_id text not null check(extension_id ~ '^[a-p]{32}$'),
 token_hash text not null unique check(token_hash ~ '^[a-f0-9]{64}$'),
 created_at timestamptz not null default now(), expires_at timestamptz not null default now()+interval '30 days',
 last_seen_at timestamptz, revoked_at timestamptz
);
alter table atosfeed.pairing_codes enable row level security;
alter table atosfeed.devices enable row level security;
-- No direct read/write grants on pairing/device tables: credential hashes stay private.
revoke all on atosfeed.pairing_codes,atosfeed.devices from public,anon,authenticated;

create function public.atosfeed_list_organizations() returns jsonb language sql stable security definer set search_path='' as $$
 select coalesce(jsonb_agg(jsonb_build_object('id',o.id,'name',o.name,'role',m.role) order by o.name), '[]'::jsonb)
 from atosfeed.organizations o join atosfeed.members m on m.organization_id=o.id where m.user_id=auth.uid();
$$;
create function public.atosfeed_create_organization(p_name text) returns jsonb language plpgsql security definer set search_path='' as $$
declare org uuid;
begin
 if auth.uid() is null then raise exception using errcode='42501',message='unauthorized'; end if;
 if p_name is null or length(trim(p_name)) not between 2 and 80 then raise exception using errcode='22023',message='invalid_name'; end if;
 insert into atosfeed.organizations(name) values(trim(p_name)) returning id into org;
 insert into atosfeed.members(organization_id,user_id,role) values(org,auth.uid(),'owner');
 return jsonb_build_object('id',org,'name',trim(p_name),'role','owner');
end; $$;
create function public.atosfeed_list_members(p_org uuid) returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
 if not atosfeed.has_role(p_org,array['owner','editor','viewer']) then raise exception using errcode='42501',message='forbidden'; end if;
 return (select coalesce(jsonb_agg(jsonb_build_object('userId',user_id,'role',role) order by user_id),'[]'::jsonb) from atosfeed.members where organization_id=p_org);
end; $$;
create function public.atosfeed_set_member(p_org uuid,p_user uuid,p_role text) returns void language plpgsql security definer set search_path='' as $$
begin
 perform 1 from atosfeed.organizations where id=p_org for update;
 if not atosfeed.has_role(p_org,array['owner']) then raise exception using errcode='42501',message='forbidden'; end if;
 if p_role is not null and p_role not in ('owner','editor','viewer') then raise exception using errcode='22023',message='invalid_role'; end if;
 if exists(select 1 from atosfeed.members where organization_id=p_org and user_id=p_user and role='owner') and p_role is distinct from 'owner'
 and (select count(*) from atosfeed.members where organization_id=p_org and role='owner')=1 then raise exception using errcode='P0001',message='last_owner'; end if;
 if p_role is null then delete from atosfeed.members where organization_id=p_org and user_id=p_user;
 else insert into atosfeed.members values(p_org,p_user,p_role) on conflict(organization_id,user_id) do update set role=excluded.role; end if;
 if p_role is null or p_role='viewer' then
  update atosfeed.devices set revoked_at=coalesce(revoked_at,now()) where organization_id=p_org and paired_by=p_user;
  update atosfeed.pairing_codes set consumed_at=coalesce(consumed_at,now()) where organization_id=p_org and created_by=p_user;
 end if;
end; $$;
create function public.atosfeed_create_pairing(p_org uuid,p_code_hash text) returns jsonb language plpgsql security definer set search_path='' as $$
declare pair atosfeed.pairing_codes;
begin
 perform 1 from atosfeed.organizations where id=p_org for update;
 if not atosfeed.has_role(p_org,array['owner','editor']) then raise exception using errcode='42501',message='forbidden'; end if;
 if p_code_hash is null or p_code_hash !~ '^[a-f0-9]{64}$' then raise exception using errcode='22023',message='invalid_code'; end if;
 update atosfeed.pairing_codes set consumed_at=now() where organization_id=p_org and created_by=auth.uid() and consumed_at is null;
 insert into atosfeed.pairing_codes(organization_id,created_by,code_hash) values(p_org,auth.uid(),p_code_hash) returning * into pair;
 return jsonb_build_object('id',pair.id,'expiresAt',pair.expires_at);
end; $$;
create function public.atosfeed_redeem_pairing(p_code text,p_token_hash text,p_extension_id text,p_name text) returns jsonb language plpgsql security definer set search_path='' as $$
declare pair atosfeed.pairing_codes; device atosfeed.devices; lookup_hash text;
begin
 if p_code is null or p_code !~ '^[A-Fa-f0-9]{32}$' then raise exception using errcode='P0001',message='pairing_invalid'; end if;
 lookup_hash:=encode(sha256(convert_to(upper(p_code),'UTF8')),'hex');
 select * into pair from atosfeed.pairing_codes where code_hash=lookup_hash;
 if not found then raise exception using errcode='P0001',message='pairing_invalid'; end if;
 perform 1 from atosfeed.organizations where id=pair.organization_id for update;
 select * into pair from atosfeed.pairing_codes where code_hash=lookup_hash for update;
 if pair.consumed_at is not null or pair.expires_at<=now() or not exists(select 1 from atosfeed.members where organization_id=pair.organization_id and user_id=pair.created_by and role in ('owner','editor'))
 then raise exception using errcode='P0001',message='pairing_invalid'; end if;
 if p_token_hash is null or p_token_hash !~ '^[a-f0-9]{64}$' or p_extension_id is null or p_extension_id !~ '^[a-p]{32}$' or p_name is null or length(trim(p_name)) not between 1 and 80
 then raise exception using errcode='22023',message='invalid_device'; end if;
 if (select count(*) from atosfeed.devices where organization_id=pair.organization_id and revoked_at is null and expires_at>now())>=10
 then raise exception using errcode='P0001',message='device_limit'; end if;
 insert into atosfeed.devices(organization_id,paired_by,name,extension_id,token_hash) values(pair.organization_id,pair.created_by,trim(p_name),p_extension_id,p_token_hash) returning * into device;
 update atosfeed.pairing_codes set consumed_at=now() where id=pair.id;
 return jsonb_build_object('deviceId',device.id,'organizationId',device.organization_id,'expiresAt',device.expires_at);
end; $$;
create function public.atosfeed_heartbeat(p_token text,p_extension_id text) returns jsonb language plpgsql security definer set search_path='' as $$
declare device atosfeed.devices;
begin
 if p_token is null or p_token !~ '^af_device_[A-Za-z0-9_-]{43}$' then raise exception using errcode='P0001',message='device_invalid'; end if;
 update atosfeed.devices d set last_seen_at=now()
 where d.token_hash=encode(sha256(convert_to(p_token,'UTF8')),'hex') and d.extension_id=p_extension_id and d.revoked_at is null and d.expires_at>now()
 and exists(select 1 from atosfeed.members m where m.organization_id=d.organization_id and m.user_id=d.paired_by and m.role in ('owner','editor')) returning d.* into device;
 if not found then raise exception using errcode='P0001',message='device_invalid'; end if;
 return jsonb_build_object('deviceId',device.id,'organizationId',device.organization_id,'serverTime',now(),'expiresAt',device.expires_at);
end; $$;
create function public.atosfeed_disconnect(p_token text,p_extension_id text) returns void language plpgsql security definer set search_path='' as $$
begin
 if p_token is null or p_token !~ '^af_device_[A-Za-z0-9_-]{43}$' then raise exception using errcode='P0001',message='device_invalid'; end if;
 update atosfeed.devices set revoked_at=coalesce(revoked_at,now()) where token_hash=encode(sha256(convert_to(p_token,'UTF8')),'hex') and extension_id=p_extension_id;
 if not found then raise exception using errcode='P0001',message='device_invalid'; end if;
end; $$;
create function public.atosfeed_list_devices(p_org uuid) returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
 if not atosfeed.has_role(p_org,array['owner','editor','viewer']) then raise exception using errcode='42501',message='forbidden'; end if;
 return (select coalesce(jsonb_agg(jsonb_build_object('id',d.id,'name',d.name,'pairedBy',d.paired_by,'lastSeenAt',d.last_seen_at,'expiresAt',d.expires_at,'revokedAt',d.revoked_at,
 'connected',d.revoked_at is null and d.expires_at>now() and coalesce(d.last_seen_at>now()-interval '90 seconds',false) and exists(select 1 from atosfeed.members m where m.organization_id=d.organization_id and m.user_id=d.paired_by and m.role in ('owner','editor')),
 'canRevoke',atosfeed.has_role(p_org,array['owner']) or (d.paired_by=auth.uid() and atosfeed.has_role(p_org,array['editor']))) order by d.created_at desc),'[]'::jsonb) from atosfeed.devices d where organization_id=p_org);
end; $$;
create function public.atosfeed_revoke_device(p_org uuid,p_device uuid) returns void language plpgsql security definer set search_path='' as $$
begin
 perform 1 from atosfeed.organizations where id=p_org for update;
 if not atosfeed.has_role(p_org,array['owner','editor']) then raise exception using errcode='42501',message='forbidden'; end if;
 update atosfeed.devices set revoked_at=coalesce(revoked_at,now()) where id=p_device and organization_id=p_org
 and (atosfeed.has_role(p_org,array['owner']) or paired_by=auth.uid());
 if not found then raise exception using errcode='42501',message='forbidden'; end if;
end; $$;
-- Explicit function grants; Postgres defaults to EXECUTE for PUBLIC otherwise.
revoke all on function public.atosfeed_list_organizations(),public.atosfeed_create_organization(text),public.atosfeed_list_members(uuid),public.atosfeed_set_member(uuid,uuid,text),public.atosfeed_create_pairing(uuid,text),public.atosfeed_redeem_pairing(text,text,text,text),public.atosfeed_heartbeat(text,text),public.atosfeed_disconnect(text,text),public.atosfeed_list_devices(uuid),public.atosfeed_revoke_device(uuid,uuid) from public,anon,authenticated;
grant execute on function public.atosfeed_list_organizations(),public.atosfeed_create_organization(text),public.atosfeed_list_members(uuid),public.atosfeed_set_member(uuid,uuid,text),public.atosfeed_create_pairing(uuid,text),public.atosfeed_list_devices(uuid),public.atosfeed_revoke_device(uuid,uuid) to authenticated;
grant execute on function public.atosfeed_redeem_pairing(text,text,text,text),public.atosfeed_heartbeat(text,text),public.atosfeed_disconnect(text,text) to anon;
commit;
