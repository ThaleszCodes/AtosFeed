-- Additive replacement: support observed group vanity addresses, no old data modified.
begin;
create or replace function public.atosfeed_sync_groups(p_token text,p_extension_id text,p_groups jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare d atosfeed.devices; g jsonb;
begin
 d:=atosfeed.require_device(p_token,p_extension_id);
 if p_groups is null or jsonb_typeof(p_groups)<>'array' or jsonb_array_length(p_groups)>50 then raise exception using errcode='22023',message='invalid_groups'; end if;
 for g in select value from jsonb_array_elements(p_groups) loop
  if jsonb_typeof(g)<>'object' or coalesce(g->>'id','') !~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,99}$' or lower(g->>'id') in ('feed','discover','joins','create','notifications','pending','suggested') or length(trim(coalesce(g->>'name',''))) not between 1 and 120 then raise exception using errcode='22023',message='invalid_groups'; end if;
  insert into atosfeed.groups(organization_id,facebook_group_id,name) values(d.organization_id,g->>'id',trim(g->>'name')) on conflict(organization_id,facebook_group_id) do update set name=excluded.name,observed_at=now();
 end loop;
 return jsonb_build_object('imported',jsonb_array_length(p_groups),'organizationId',d.organization_id);
end; $$;
revoke all on function public.atosfeed_sync_groups(text,text,jsonb) from public,anon,authenticated;
grant execute on function public.atosfeed_sync_groups(text,text,jsonb) to anon;
commit;
