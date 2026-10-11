-- Additive changes confined to AtosFeed. No execution against the remote project.
begin;
alter table atosfeed.jobs add column device_id uuid references atosfeed.devices(id), add column attempt_id uuid, add column result_reason text, add column finished_at timestamptz;
create index jobs_due on atosfeed.jobs(organization_id,state,due_at);
create function atosfeed.job_json(j atosfeed.jobs) returns jsonb language sql immutable set search_path='' as $$
 select jsonb_build_object('id',j.id,'organizationId',j.organization_id,'groupId',j.group_id,'text',j.body,'dueAt',j.due_at,'state',j.state,'attemptId',j.attempt_id,'reason',j.result_reason);
$$;
create function atosfeed.require_device(p_token text,p_extension_id text) returns atosfeed.devices language plpgsql security definer set search_path='' as $$
declare d atosfeed.devices;
begin
 if p_token is null or p_token !~ '^af_device_[A-Za-z0-9_-]{43}$' then raise exception 'device_invalid'; end if;
 select * into d from atosfeed.devices where token_hash=encode(sha256(convert_to(p_token,'UTF8')),'hex') and extension_id=p_extension_id and revoked_at is null and expires_at>now() for update;
 if not found or not exists(select 1 from atosfeed.members where organization_id=d.organization_id and user_id=d.paired_by and role in ('owner','editor')) then raise exception 'device_invalid'; end if;
 return d;
end; $$;
create function public.atosfeed_sync_groups(p_token text,p_extension_id text,p_groups jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare d atosfeed.devices; g jsonb;
begin
 d:=atosfeed.require_device(p_token,p_extension_id);
 if p_groups is null or jsonb_typeof(p_groups)<>'array' or jsonb_array_length(p_groups)>50 then raise exception using errcode='22023',message='invalid_groups'; end if;
 for g in select value from jsonb_array_elements(p_groups) loop
  if jsonb_typeof(g)<>'object' or coalesce(g->>'id','') !~ '^[0-9]{1,30}$' or length(trim(coalesce(g->>'name',''))) not between 1 and 120 then raise exception using errcode='22023',message='invalid_groups'; end if;
  insert into atosfeed.groups(organization_id,facebook_group_id,name) values(d.organization_id,g->>'id',trim(g->>'name')) on conflict(organization_id,facebook_group_id) do update set name=excluded.name,observed_at=now();
 end loop;
 return jsonb_build_object('imported',jsonb_array_length(p_groups),'organizationId',d.organization_id);
end; $$;
create function public.atosfeed_list_groups(p_org uuid) returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
 if not atosfeed.has_role(p_org,array['owner','editor','viewer']) then raise exception using errcode='42501',message='forbidden'; end if;
 return (select coalesce(jsonb_agg(jsonb_build_object('id',facebook_group_id,'name',name,'observedAt',observed_at) order by name),'[]'::jsonb) from atosfeed.groups where organization_id=p_org);
end; $$;
-- No timeout automatically retries a job. A stale reservation becomes unknown.
create function atosfeed.expire_jobs(p_org uuid) returns void language sql set search_path='' as $$
 update atosfeed.jobs set state='unknown',result_reason='execution_interrupted',finished_at=now() where organization_id=p_org and state='executing' and attempted_at<now()-interval '10 minutes';
$$;
create function public.atosfeed_list_jobs(p_org uuid) returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if not atosfeed.has_role(p_org,array['owner','editor','viewer']) then raise exception using errcode='42501',message='forbidden'; end if;
 perform atosfeed.expire_jobs(p_org);
 return (select coalesce(jsonb_agg(atosfeed.job_json(j) order by j.due_at desc),'[]'::jsonb) from (select * from atosfeed.jobs where organization_id=p_org order by due_at desc limit 100) j);
end; $$;
create function public.atosfeed_create_job(p_org uuid,p_group text,p_body text,p_due timestamptz,p_key uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare j atosfeed.jobs;
begin
 if not atosfeed.has_role(p_org,array['owner','editor']) then raise exception using errcode='42501',message='forbidden'; end if;
 select * into j from atosfeed.jobs where organization_id=p_org and idempotency_key=p_key;
 if found then
  if j.group_id is distinct from p_group or j.body is distinct from trim(p_body) or j.due_at is distinct from p_due then raise exception 'idempotency_conflict'; end if;
  return atosfeed.job_json(j);
 end if;
 if p_body is null or length(trim(p_body)) not between 1 and 4000 or p_due is null or p_due<now()-interval '1 minute' or p_key is null then raise exception using errcode='22023',message='invalid_job'; end if;
 insert into atosfeed.jobs(organization_id,group_id,body,due_at,idempotency_key) values(p_org,p_group,trim(p_body),p_due,p_key) on conflict(organization_id,idempotency_key) do nothing returning * into j;
 if not found then
  select * into j from atosfeed.jobs where organization_id=p_org and idempotency_key=p_key;
  if j.group_id is distinct from p_group or j.body is distinct from trim(p_body) or j.due_at is distinct from p_due then raise exception 'idempotency_conflict'; end if;
 end if;
 return atosfeed.job_json(j);
end; $$;
create function public.atosfeed_cancel_job(p_org uuid,p_job uuid) returns void language plpgsql security definer set search_path='' as $$
begin
 if not atosfeed.has_role(p_org,array['owner','editor']) then raise exception using errcode='42501',message='forbidden'; end if;
 update atosfeed.jobs set state='cancelled',finished_at=now() where organization_id=p_org and id=p_job and state='queued';
 if not found then raise exception 'job_unavailable'; end if;
end; $$;
create function public.atosfeed_device_jobs(p_token text,p_extension_id text) returns jsonb language plpgsql security definer set search_path='' as $$
declare d atosfeed.devices;
begin
 d:=atosfeed.require_device(p_token,p_extension_id);perform atosfeed.expire_jobs(d.organization_id);
 return (select coalesce(jsonb_agg(atosfeed.job_json(j) order by j.due_at),'[]'::jsonb) from (select * from atosfeed.jobs where organization_id=d.organization_id and state='queued' and due_at<=now() order by due_at limit 50) j);
end; $$;
create function public.atosfeed_claim_job(p_token text,p_extension_id text,p_job uuid,p_attempt uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare d atosfeed.devices; j atosfeed.jobs;
begin
 d:=atosfeed.require_device(p_token,p_extension_id);
 if p_attempt is null then raise exception using errcode='22023',message='invalid_attempt'; end if;
 update atosfeed.jobs set state='executing',attempted_at=now(),device_id=d.id,attempt_id=p_attempt where organization_id=d.organization_id and id=p_job and state='queued' and due_at<=now() returning * into j;
 if not found then raise exception 'job_unavailable'; end if;
 return atosfeed.job_json(j);
end; $$;
create function public.atosfeed_report_job(p_token text,p_extension_id text,p_job uuid,p_attempt uuid,p_state text,p_reason text) returns void language plpgsql security definer set search_path='' as $$
declare d atosfeed.devices; j atosfeed.jobs;
begin
 d:=atosfeed.require_device(p_token,p_extension_id);
 if p_state is null or p_state not in ('sent','awaiting_approval','failed','unknown') or coalesce(length(p_reason),0)>80 then raise exception using errcode='22023',message='invalid_result'; end if;
 select * into j from atosfeed.jobs where organization_id=d.organization_id and id=p_job and device_id=d.id and attempt_id=p_attempt for update;
 if not found then raise exception 'job_unavailable'; end if;
 -- A lost response may be safely reported again, but cannot rewrite a terminal result.
 if j.state=p_state then return; end if;
 if j.state<>'executing' or j.attempted_at<now()-interval '10 minutes' then
  if j.state='executing' then update atosfeed.jobs set state='unknown',result_reason='execution_interrupted',finished_at=now() where id=j.id; return; end if;
  raise exception 'job_unavailable';
 end if;
 update atosfeed.jobs set state=p_state,result_reason=p_reason,finished_at=now() where id=j.id;
end; $$;
revoke all on function atosfeed.job_json(atosfeed.jobs),atosfeed.require_device(text,text),atosfeed.expire_jobs(uuid) from public,anon,authenticated;
revoke all on function public.atosfeed_sync_groups(text,text,jsonb),public.atosfeed_list_groups(uuid),public.atosfeed_list_jobs(uuid),public.atosfeed_create_job(uuid,text,text,timestamptz,uuid),public.atosfeed_cancel_job(uuid,uuid),public.atosfeed_device_jobs(text,text),public.atosfeed_claim_job(text,text,uuid,uuid),public.atosfeed_report_job(text,text,uuid,uuid,text,text) from public,anon,authenticated;
grant execute on function public.atosfeed_list_groups(uuid),public.atosfeed_list_jobs(uuid),public.atosfeed_create_job(uuid,text,text,timestamptz,uuid),public.atosfeed_cancel_job(uuid,uuid) to authenticated;
grant execute on function public.atosfeed_sync_groups(text,text,jsonb),public.atosfeed_device_jobs(text,text),public.atosfeed_claim_job(text,text,uuid,uuid),public.atosfeed_report_job(text,text,uuid,uuid,text,text) to anon;
commit;
