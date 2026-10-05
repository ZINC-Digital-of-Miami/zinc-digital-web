-- M5: session-authorized full-text retrieval and private file storage.
alter table research.chunks add column tsv tsvector generated always as (to_tsvector('english',content)) stored;
create index chunks_tsv_gin on research.chunks using gin(tsv);
create function research.search_chunks(p_project uuid,p_query text,p_limit integer default 8)
 returns table(id bigint,document_id uuid,idx integer,content text,title text,kind text,source_url text)
 language sql stable security invoker set search_path='' as $$
 select c.id,c.document_id,c.idx,c.content,d.title,d.kind,d.source_url
 from research.chunks c join research.documents d on d.id=c.document_id
 where d.project_id=p_project and d.status='ready'
 and c.tsv @@ websearch_to_tsquery('english',left(p_query,8000))
 order by ts_rank(c.tsv,websearch_to_tsquery('english',left(p_query,8000))) desc,c.id
 limit greatest(1,least(coalesce(p_limit,8),8))
 $$;
revoke all on function research.search_chunks(uuid,text,integer) from public,anon;
grant execute on function research.search_chunks(uuid,text,integer) to authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('research','research',false,10485760,array['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain','text/markdown']);
create policy "staff read research files" on storage.objects for select to authenticated using(bucket_id='research' and private.is_staff());
create policy "staff upload research files" on storage.objects for insert to authenticated with check(bucket_id='research' and private.is_staff());
-- Serialize each staff member's count and reservation so concurrent requests cannot bypass the limit.
create function research.start_question(p_project uuid,p_chat uuid,p_question text,p_model text)
 returns table(chat_id uuid,message_id bigint) language plpgsql security invoker set search_path='' as $$
declare c uuid; m bigint;
begin
 if auth.uid() is null or not private.is_staff() then raise exception 'staff session required'; end if;
 if length(btrim(p_question))=0 or length(p_question)>8000 then raise exception 'question must contain 1 to 8000 characters'; end if;
 perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text,1));
 if (select count(*) from research.messages q join research.chats h on h.id=q.chat_id where h.created_by=auth.uid() and q.role='user' and q.created_at>now()-interval '10 minutes')>=20 then raise exception 'research rate limit'; end if;
 if not exists(select 1 from research.projects where id=p_project) then raise exception 'project unavailable'; end if;
 if p_chat is null then
  insert into research.chats(project_id,title,model,created_by) values(p_project,left(p_question,80),p_model,auth.uid()) returning id into c;
 else
  select id into c from research.chats where id=p_chat and project_id=p_project and created_by=auth.uid();
  if c is null then raise exception 'chat unavailable'; end if;
 end if;
 insert into research.messages(chat_id,role,content,status,model) values(c,'user',p_question,'done',p_model) returning id into m;
 return query select c,m;
end $$;
revoke all on function research.start_question(uuid,uuid,text,text) from public,anon;
grant execute on function research.start_question(uuid,uuid,text,text) to authenticated;

-- The production API currently exposes only public and graphql_public (PGRST106).
-- Keep private hidden and expose research under its existing staff-only grants and RLS.
alter role authenticator set pgrst.db_schemas='public,graphql_public,research';
notify pgrst, 'reload config';
notify pgrst, 'reload schema';
