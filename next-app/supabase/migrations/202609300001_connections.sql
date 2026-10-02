begin;
-- Expose only intentional public profile fields through the directory function.
-- Existing profile policies continue protecting preferences and alias seeds.
create table public.connections (
 id bigint generated always as identity primary key,
 requester uuid not null references auth.users on delete cascade,
 recipient uuid not null references auth.users on delete cascade,
 status text not null default 'pending' check(status in ('pending','accepted','declined')),
 created_at timestamptz not null default now(),
 check(requester<>recipient)
);
create unique index connections_pair on public.connections(least(requester,recipient),greatest(requester,recipient));
create index connections_recipient on public.connections(recipient);
create table public.direct_messages (
 id bigint generated always as identity primary key,
 connection_id bigint not null references public.connections on delete cascade,
 sender uuid not null references auth.users on delete cascade,
 body text not null check(char_length(trim(body)) between 1 and 3000),
 created_at timestamptz not null default now()
);
create index direct_messages_thread on public.direct_messages(connection_id,id desc);
alter table public.connections enable row level security;
alter table public.direct_messages enable row level security;
revoke all on public.connections,public.direct_messages from anon,authenticated;
grant select on public.connections,public.direct_messages to authenticated;
create policy connections_participants on public.connections for select to authenticated
 using(auth.uid() in (requester,recipient));
create policy messages_participants on public.direct_messages for select to authenticated
 using(exists(select 1 from public.connections c where c.id=connection_id and auth.uid() in (c.requester,c.recipient)));

create function public.find_members(p_search text default '',p_offset integer default 0)
returns table(id uuid,name text,avatar integer,bio text,interests text[]) language plpgsql stable security definer set search_path=public as $$
begin
 perform require_user();
 return query select p.id,p.name,p.avatar,p.bio,p.interests from profiles p
 where p.id<>auth.uid() and char_length(trim(p.name))>=2
 and (coalesce(p_search,'')='' or position(lower(left(p_search,100)) in lower(p.name))>0)
 order by p.name,p.id limit 30 offset greatest(coalesce(p_offset,0),0);
end $$;

create function public.request_connection(p_member uuid) returns bigint language plpgsql security definer set search_path=public as $$
declare u uuid:=require_user(); cid bigint;
begin
 if p_member=u or not exists(select 1 from profiles where id=p_member and char_length(trim(name))>=2)
 then raise exception 'Choose an available member'; end if;
 if not exists(select 1 from profiles where id=u and char_length(trim(name))>=2)
 then raise exception 'Complete your profile first'; end if;
 insert into connections(requester,recipient) values(u,p_member) on conflict do nothing returning id into cid;
 if cid is null then
   select id into cid from connections where least(requester,recipient)=least(u,p_member) and greatest(requester,recipient)=greatest(u,p_member);
 else
   insert into notifications(user_id,message,href) values(p_member,'You have a new connection request.','/people');
 end if;
 return cid;
end $$;

create function public.respond_connection(p_connection bigint,p_accept boolean) returns void language plpgsql security definer set search_path=public as $$
declare u uuid:=require_user(); c connections;
begin
 select * into c from connections where id=p_connection for update;
 if not found or c.recipient<>u or c.status<>'pending' then raise exception 'This request is unavailable'; end if;
 update connections set status=case when p_accept then 'accepted' else 'declined' end where id=c.id;
 if p_accept then insert into notifications(user_id,message,href) values(c.requester,'Your connection request was accepted. You can now chat.','/people'); end if;
end $$;

create function public.list_connections() returns table(id bigint,requester uuid,recipient uuid,status text,member_id uuid,name text,avatar integer)
language plpgsql stable security definer set search_path=public as $$
begin
 perform require_user();
 return query select c.id,c.requester,c.recipient,c.status,p.id,p.name,p.avatar from connections c
 join profiles p on p.id=case when c.requester=auth.uid() then c.recipient else c.requester end
 where auth.uid() in(c.requester,c.recipient) order by c.created_at desc;
end $$;

create function public.send_direct_message(p_connection bigint,p_body text) returns bigint language plpgsql security definer set search_path=public as $$
declare u uuid:=require_user(); c connections; mid bigint;
begin
 select * into c from connections where id=p_connection for update;
 if not found or c.status<>'accepted' or u not in(c.requester,c.recipient) then raise exception 'An accepted connection is required'; end if;
 insert into direct_messages(connection_id,sender,body) values(c.id,u,trim(p_body)) returning id into mid;
 return mid;
end $$;

revoke all on function public.find_members(text,integer),public.request_connection(uuid),public.respond_connection(bigint,boolean),public.list_connections(),public.send_direct_message(bigint,text) from public,anon;
grant execute on function public.find_members(text,integer),public.request_connection(uuid),public.respond_connection(bigint,boolean),public.list_connections(),public.send_direct_message(bigint,text) to authenticated;
commit;
