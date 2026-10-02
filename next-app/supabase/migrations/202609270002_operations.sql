-- Additions to the core migration: read-only audit history and moderation content.
begin;
create table public.activity_logs (
 id bigint generated always as identity primary key,
 user_id uuid not null references auth.users on delete cascade,
 activity_type text not null, related_id bigint not null,
 created_at timestamptz not null default now()
);
alter table public.activity_logs enable row level security;
revoke all on public.activity_logs from anon,authenticated;
grant select on public.activity_logs to authenticated;
create policy activity_logs_read on public.activity_logs for select to authenticated using(user_id=auth.uid() or public.is_admin());
create index activity_logs_user on public.activity_logs(user_id,created_at desc);
create function public.audit_wellness() returns trigger language plpgsql security definer set search_path=public as $$
declare actor uuid:=auth.uid(); kind text; related bigint; begin
 if actor is null then return coalesce(new,old); end if;
 if tg_table_name='sessions' then kind:='sessionCreated';related:=new.id;
 elsif tg_table_name='session_members' then
  kind:=case when tg_op='DELETE' then 'sessionLeft' else 'sessionJoined' end;related:=coalesce(new.session_id,old.session_id);
 elsif tg_table_name='tasks' then
  if tg_op='UPDATE' and (not new.completed or old.completed) then return new; end if;
  kind:=case when tg_op='INSERT' then 'taskCreated' else 'taskCompleted' end;related:=new.id;
 else kind:='providerBooked';related:=new.id;
 end if;
 insert into activity_logs(user_id,activity_type,related_id) values(actor,kind,related);
 return coalesce(new,old);
end $$;
create trigger audit_sessions after insert on public.sessions for each row execute function public.audit_wellness();
create trigger audit_members after insert or delete on public.session_members for each row execute function public.audit_wellness();
create trigger audit_tasks after insert or update on public.tasks for each row execute function public.audit_wellness();
create trigger audit_bookings after insert on public.provider_bookings for each row execute function public.audit_wellness();
create function public.get_reports() returns jsonb language plpgsql stable security definer set search_path=public as $$
begin
 if not is_admin() then raise exception 'Admin access required'; end if;
 return coalesce((select jsonb_agg(x) from (select r.id,r.reason,p.body,p.author_id,r.created_at from reports r join posts p on p.id=r.post_id where not r.resolved order by r.created_at limit 100) x),'[]'::jsonb);
end $$;
revoke execute on function public.audit_wellness(),public.get_reports() from public,anon;
grant execute on function public.get_reports() to authenticated;
commit;
