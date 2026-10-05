do $$declare c uuid; row record; count_sources integer;
begin
 if to_regprocedure('research.start_question(uuid,uuid,text,text)') is null then return; end if;
 perform set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-00000000a002","role":"authenticated"}',true);
 execute 'set local role authenticated';
 insert into research.projects(id,name,created_by) values('00000000-0000-4000-8000-00000000c091','Database research permission test','00000000-0000-4000-8000-00000000a002');
 insert into research.documents(id,project_id,kind,title,content,status) values('00000000-0000-4000-8000-00000000c092','00000000-0000-4000-8000-00000000c091','note','Evidence','Reliable searchable evidence','ready');
 insert into research.chunks(document_id,idx,content) values('00000000-0000-4000-8000-00000000c092',0,'Reliable searchable evidence');
 select count(*) into count_sources from research.search_chunks('00000000-0000-4000-8000-00000000c091','searchable',8);
 perform dbtest.ok('session searches real source chunks',count_sources=1);
 update research.documents set status='error' where id='00000000-0000-4000-8000-00000000c092';
 select count(*) into count_sources from research.search_chunks('00000000-0000-4000-8000-00000000c091','searchable',8);
 perform dbtest.ok('failed sources are not retrieved',count_sources=0);
 for i in 1..20 loop
  select * into row from research.start_question('00000000-0000-4000-8000-00000000c091',c,'Question '||i,'dbtest');c=row.chat_id;
 end loop;
 perform dbtest.refused('twenty-first question is refused',$q$select * from research.start_question('00000000-0000-4000-8000-00000000c091',null,'Question 21','dbtest')$q$,'%rate limit%');
 insert into storage.objects(bucket_id,name) values('research','00000000-0000-4000-8000-00000000c091/dbtest.txt');
 perform dbtest.ok('staff can read private file',(select count(*)=1 from storage.objects where bucket_id='research' and name='00000000-0000-4000-8000-00000000c091/dbtest.txt'));
 execute 'set local role postgres';
 perform set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-00000000a003","role":"authenticated"}',true);
 execute 'set local role authenticated';
 perform dbtest.blocked('nonstaff cannot search sources',$q$select * from research.search_chunks('00000000-0000-4000-8000-00000000c091','searchable',8)$q$);
 perform dbtest.blocked('nonstaff cannot read private files',$q$select * from storage.objects where bucket_id='research'$q$);
 perform dbtest.blocked('nonstaff cannot upload',$q$insert into storage.objects(bucket_id,name) values('research','forbidden.txt')$q$);
 execute 'set local role postgres';
 perform dbtest.ok('research bucket is private and size bounded',(select not public and file_size_limit=10485760 from storage.buckets where id='research'));
end $$;
