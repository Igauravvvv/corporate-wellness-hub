begin;
create function public.update_session(p_session bigint,p_title text default null,p_description text default null,p_date timestamptz default null,p_capacity integer default null,p_space text default null,p_location text default null) returns void language plpgsql security definer set search_path=public as $$
declare s sessions; begin
 perform require_user();
 select * into s from sessions where id=p_session for update;
 if not found or (s.creator<>auth.uid() and not is_admin()) then raise exception 'Only the organizer can edit this session'; end if;
 if coalesce(p_date,s.date_time)<=now() then raise exception 'Choose a future date'; end if;
 if p_capacity is not null and p_capacity<(select count(*) from session_members where session_id=p_session) then raise exception 'Capacity cannot be lower than the current participant count'; end if;
 update sessions set title=coalesce(p_title,title),description=coalesce(p_description,description),date_time=coalesce(p_date,date_time),max_participants=coalesce(p_capacity,max_participants),space_name=coalesce(p_space,space_name),location=coalesce(p_location,location) where id=p_session;
 insert into notifications(user_id,message,href) select user_id,'Session updated: '||coalesce(p_title,s.title),'/sessions/'||p_session from session_members where session_id=p_session and user_id<>auth.uid();
end $$;
revoke execute on function public.update_session(bigint,text,text,timestamptz,integer,text,text) from public,anon;
grant execute on function public.update_session(bigint,text,text,timestamptz,integer,text,text) to authenticated;
commit;
