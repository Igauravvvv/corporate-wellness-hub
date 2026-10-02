begin;
alter table public.groups add column category text not null default 'social'
  check(category in ('sports','wellbeing','arts','learning','social','outdoors'));
update public.groups set category=case
 when slug in ('cricket','badminton','sports') then 'sports'
 when slug='health-wellness' then 'wellbeing'
 when slug in ('music','movies','creativity') then 'arts'
 when slug in ('career-growth','technology','books') then 'learning'
 when slug='travel' then 'outdoors' else 'social' end;
create index groups_category on public.groups(category);
insert into public.groups(slug,name,description,category) values
 ('football','Football','Find a five-a-side team or plan a weekend kickabout.','sports'),
 ('basketball','Basketball','Find your court, your team and your next pickup game.','sports'),
 ('volleyball','Volleyball','Build a team for a friendly game at the net.','sports'),
 ('pickleball','Pickleball','New to the game or ready for doubles? Find a partner.','sports'),
 ('tennis','Tennis','Rally with someone new and arrange your next match.','sports'),
 ('table-tennis','Table tennis','Turn a short break into a friendly match.','sports'),
 ('yoga','Yoga','Stretch, breathe and build a practice together.','wellbeing'),
 ('mindfulness','Mindfulness','Share simple ways to slow down and reset.','wellbeing'),
 ('fitness','Fitness','Find workout partners and encourage consistent habits.','wellbeing'),
 ('photography','Photography','Share your perspective and plan a photo walk.','arts'),
 ('dance','Dance','Discover new styles and people who love to move.','arts'),
 ('study-circles','Study circles','Find study partners, share resources and learn together.','learning'),
 ('languages','Languages','Practice a new language through friendly conversation.','learning'),
 ('coffee-chats','Coffee chats','Make time for a coffee and a new connection.','social'),
 ('board-games','Board games','Bring your favourite game and find your next table.','social'),
 ('cooking','Cooking','Swap recipes and explore something delicious.','social'),
 ('hiking','Hiking','Discover local trails and plan a walk with good company.','outdoors'),
 ('cycling','Cycling','Find riding partners and explore new routes.','outdoors')
on conflict(slug) do nothing;
drop function public.create_group(text,text);
create function public.create_group(p_name text,p_description text,p_category text default 'social')
returns bigint language plpgsql security definer set search_path=public as $$
declare u uuid:=require_user(); gid bigint; begin
 perform pg_advisory_xact_lock(hashtextextended(u::text,1));
 if (select count(*) from groups where creator=u and created_at>now()-interval '1 day')>=5 then raise exception 'You can create up to 5 groups per day'; end if;
 insert into groups(slug,name,description,creator,category)
 values(trim(both '-' from regexp_replace(lower(p_name),'[^a-z0-9]+','-','g'))||'-'||substr(gen_random_uuid()::text,1,8),trim(p_name),trim(p_description),u,p_category) returning id into gid;
 insert into group_members values(gid,u,now()); return gid;
end $$;
revoke all on function public.create_group(text,text,text) from public,anon;
grant execute on function public.create_group(text,text,text) to authenticated;
commit;
