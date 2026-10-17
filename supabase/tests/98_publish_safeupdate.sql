-- PostgREST loads safeupdate; direct maintenance connections do not. Bulk publish
-- must explicitly target the non-null primary keys without changing its coverage.
do $$
declare definition text:=pg_get_functiondef('private.publish_all(uuid)'::regprocedure);
begin
 perform dbtest.ok('page publish explicitly targets its rows for safeupdate',definition ~ 'update public[.]pages p set[^;]+where p[.]id is not null;');
 perform dbtest.ok('post snapshot explicitly targets its rows for safeupdate',definition ~ 'update public[.]posts p set live=[^;]+where p[.]id is not null;');
end $$;
