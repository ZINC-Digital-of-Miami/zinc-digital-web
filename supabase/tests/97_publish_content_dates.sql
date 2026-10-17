-- Pure snapshot provenance checks, conditional on the prepared migration.
do $$
declare snapshot jsonb; row_data jsonb;
begin
 if to_regprocedure('private.content_snapshot(jsonb)') is null then return; end if;
 row_data='{"title":"Current title","updated_at":"2026-10-16T20:00:00Z","created_at":"2026-10-01T00:00:00Z","updated_by":"private-user","live_at":"2026-10-15T00:00:00Z","live":{"title":"Previous title","updated_at":"2026-10-10T00:00:00Z"}}';
 snapshot=private.content_snapshot(row_data);
 perform dbtest.ok('changed content records its actual edit timestamp',snapshot->>'updated_at'='2026-10-16T20:00:00Z');
 perform dbtest.ok('snapshot omits private actor and bookkeeping fields',not(snapshot ?| array['updated_by','created_at','live_at','live']));
 row_data=jsonb_set(row_data,'{live}',snapshot);
 row_data=jsonb_set(row_data,'{updated_at}','"2026-10-17T20:00:00Z"');
 perform dbtest.ok('unchanged bulk publish preserves modification date',private.content_snapshot(row_data)->>'updated_at'='2026-10-16T20:00:00Z');
 row_data=jsonb_set(row_data,'{live}','{"title":"Current title"}');
 perform dbtest.ok('unknown legacy modification date remains unknown',not(private.content_snapshot(row_data)?'updated_at'));
 row_data=jsonb_set(row_data,'{live}','null');
 perform dbtest.ok('first snapshot records the saved edit date',private.content_snapshot(row_data)->>'updated_at'='2026-10-17T20:00:00Z');
 perform dbtest.ok('staff cannot execute snapshot helper',not has_function_privilege('authenticated','private.content_snapshot(jsonb)','EXECUTE'));
end $$;
