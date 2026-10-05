-- Existing remote migrations: 20260930005447 site_core_schema; 20260930005458 research_schema; 20260930005509 move_is_staff_private; 20261003233329 admin_wiring_v1.
-- Schema-only baseline of the existing project; do not apply to production.
--
-- PostgreSQL database dump
--

\restrict 73IpE2LIKMOBbEXhTmU7z23YFx8DonbksYFacYYwfiLY3a3XFt0J5aOQoCyJxvL

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: private; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA private;


--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: research; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA research;


--
-- Name: is_staff(); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.is_staff() RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  select exists (select 1 from public.staff where user_id = auth.uid());
$$;


--
-- Name: touch_updated_at(); Type: FUNCTION; Schema: private; Owner: -
--

CREATE FUNCTION private.touch_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin new.updated_at = now(); return new; end $$;


--
-- Name: touch_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.touch_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
begin new.updated_at = now(); return new; end; $$;


--
-- Name: match_chunks(extensions.vector, integer, uuid); Type: FUNCTION; Schema: research; Owner: -
--

CREATE FUNCTION research.match_chunks(query_embedding extensions.vector, match_count integer DEFAULT 8, p_project uuid DEFAULT NULL::uuid) RETURNS TABLE(id bigint, document_id uuid, content text, similarity double precision)
    LANGUAGE sql STABLE
    SET search_path TO 'research', 'extensions'
    AS $$
  select c.id, c.document_id, c.content, 1 - (c.embedding <=> query_embedding) as similarity
  from research.chunks c join research.documents d on d.id = c.document_id
  where p_project is null or d.project_id = p_project
  order by c.embedding <=> query_embedding
  limit match_count;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: inquiries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inquiries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    company text,
    website text,
    budget text,
    services text[],
    message text,
    source_path text,
    status text DEFAULT 'new'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    stage text DEFAULT 'new'::text NOT NULL,
    notes text,
    next_step text,
    archived_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT inquiries_stage_check CHECK ((stage = ANY (ARRAY['new'::text, 'contacted'::text, 'qualified'::text, 'closed'::text]))),
    CONSTRAINT inquiries_status_check CHECK ((status = ANY (ARRAY['new'::text, 'contacted'::text, 'qualified'::text, 'closed'::text])))
);


--
-- Name: inquiry_board; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.inquiry_board AS
 SELECT id,
    company,
    name,
    email,
    budget,
    services,
    message,
    stage,
    notes,
    next_step,
    created_at,
    updated_at
   FROM public.inquiries
  WHERE (archived_at IS NULL)
  ORDER BY created_at DESC;


--
-- Name: inquiry_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inquiry_events (
    id bigint NOT NULL,
    inquiry_id uuid NOT NULL,
    kind text NOT NULL,
    payload jsonb DEFAULT '{}'::jsonb NOT NULL,
    actor uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT inquiry_events_kind_check CHECK ((kind = ANY (ARRAY['created'::text, 'stage'::text, 'note'::text, 'email'::text, 'archived'::text, 'restored'::text])))
);


--
-- Name: inquiry_events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.inquiry_events ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.inquiry_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    path text NOT NULL,
    template text NOT NULL,
    title text NOT NULL,
    meta_title text,
    meta_description text,
    focus_keyword text,
    canonical text,
    noindex boolean DEFAULT false NOT NULL,
    status text DEFAULT 'published'::text NOT NULL,
    content jsonb DEFAULT '{}'::jsonb NOT NULL,
    updated_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT pages_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text])))
);


--
-- Name: posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    excerpt text,
    body text,
    author text,
    layer text,
    cover_image text,
    meta_title text,
    meta_description text,
    focus_keyword text,
    noindex boolean DEFAULT false NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    published_at timestamp with time zone,
    updated_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT posts_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text])))
);


--
-- Name: seo_audits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.seo_audits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    target_type text NOT NULL,
    target_id uuid NOT NULL,
    score integer,
    issues jsonb DEFAULT '[]'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT seo_audits_score_check CHECK (((score >= 0) AND (score <= 100))),
    CONSTRAINT seo_audits_target_type_check CHECK ((target_type = ANY (ARRAY['page'::text, 'post'::text])))
);


--
-- Name: staff; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.staff (
    user_id uuid NOT NULL,
    email text NOT NULL,
    name text,
    role text DEFAULT 'editor'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT staff_email_check CHECK (((email ~~* '%@zincdigital.co'::text) OR (email ~~* '%@zincmiami.com'::text))),
    CONSTRAINT staff_role_check CHECK ((role = ANY (ARRAY['owner'::text, 'editor'::text])))
);


--
-- Name: stats_daily; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stats_daily (
    day date NOT NULL,
    source text NOT NULL,
    path text DEFAULT '*'::text NOT NULL,
    clicks integer,
    impressions integer,
    ctr numeric,
    "position" numeric,
    sessions integer,
    users integer,
    conversions integer,
    CONSTRAINT stats_daily_source_check CHECK ((source = ANY (ARRAY['gsc'::text, 'ga4'::text])))
);


--
-- Name: chats; Type: TABLE; Schema: research; Owner: -
--

CREATE TABLE research.chats (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid,
    title text,
    model text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: chunks; Type: TABLE; Schema: research; Owner: -
--

CREATE TABLE research.chunks (
    id bigint NOT NULL,
    document_id uuid NOT NULL,
    idx integer NOT NULL,
    content text NOT NULL,
    embedding extensions.vector(1536)
);


--
-- Name: chunks_id_seq; Type: SEQUENCE; Schema: research; Owner: -
--

ALTER TABLE research.chunks ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME research.chunks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: documents; Type: TABLE; Schema: research; Owner: -
--

CREATE TABLE research.documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid,
    kind text DEFAULT 'note'::text NOT NULL,
    title text,
    source_url text,
    content text,
    meta jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    status text DEFAULT 'ready'::text NOT NULL,
    CONSTRAINT documents_kind_check CHECK ((kind = ANY (ARRAY['note'::text, 'url'::text, 'serp'::text, 'file'::text, 'transcript'::text]))),
    CONSTRAINT documents_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'ready'::text, 'error'::text])))
);


--
-- Name: messages; Type: TABLE; Schema: research; Owner: -
--

CREATE TABLE research.messages (
    id bigint NOT NULL,
    chat_id uuid NOT NULL,
    role text NOT NULL,
    content text NOT NULL,
    tokens_in integer,
    tokens_out integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    sources jsonb DEFAULT '[]'::jsonb NOT NULL,
    status text DEFAULT 'done'::text NOT NULL,
    model text,
    CONSTRAINT messages_role_check CHECK ((role = ANY (ARRAY['user'::text, 'assistant'::text, 'system'::text, 'tool'::text]))),
    CONSTRAINT messages_status_check CHECK ((status = ANY (ARRAY['queued'::text, 'streaming'::text, 'done'::text, 'error'::text])))
);


--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: research; Owner: -
--

ALTER TABLE research.messages ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME research.messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: projects; Type: TABLE; Schema: research; Owner: -
--

CREATE TABLE research.projects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    client text,
    notes text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: inquiries inquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inquiries
    ADD CONSTRAINT inquiries_pkey PRIMARY KEY (id);


--
-- Name: inquiry_events inquiry_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inquiry_events
    ADD CONSTRAINT inquiry_events_pkey PRIMARY KEY (id);


--
-- Name: pages pages_path_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_path_key UNIQUE (path);


--
-- Name: pages pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: posts posts_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_key UNIQUE (slug);


--
-- Name: seo_audits seo_audits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_audits
    ADD CONSTRAINT seo_audits_pkey PRIMARY KEY (id);


--
-- Name: staff staff_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_email_key UNIQUE (email);


--
-- Name: staff staff_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_pkey PRIMARY KEY (user_id);


--
-- Name: stats_daily stats_daily_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stats_daily
    ADD CONSTRAINT stats_daily_pkey PRIMARY KEY (day, source, path);


--
-- Name: chats chats_pkey; Type: CONSTRAINT; Schema: research; Owner: -
--

ALTER TABLE ONLY research.chats
    ADD CONSTRAINT chats_pkey PRIMARY KEY (id);


--
-- Name: chunks chunks_pkey; Type: CONSTRAINT; Schema: research; Owner: -
--

ALTER TABLE ONLY research.chunks
    ADD CONSTRAINT chunks_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: research; Owner: -
--

ALTER TABLE ONLY research.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: research; Owner: -
--

ALTER TABLE ONLY research.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: research; Owner: -
--

ALTER TABLE ONLY research.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: inquiries_stage_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX inquiries_stage_idx ON public.inquiries USING btree (stage) WHERE (archived_at IS NULL);


--
-- Name: seo_audits_target_type_target_id_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX seo_audits_target_type_target_id_created_at_idx ON public.seo_audits USING btree (target_type, target_id, created_at DESC);


--
-- Name: chunks_embedding_idx; Type: INDEX; Schema: research; Owner: -
--

CREATE INDEX chunks_embedding_idx ON research.chunks USING hnsw (embedding extensions.vector_cosine_ops);


--
-- Name: inquiries inquiries_touch; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER inquiries_touch BEFORE UPDATE ON public.inquiries FOR EACH ROW EXECUTE FUNCTION private.touch_updated_at();


--
-- Name: pages pages_touch; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER pages_touch BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION private.touch_updated_at();


--
-- Name: posts posts_touch; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER posts_touch BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION private.touch_updated_at();


--
-- Name: inquiry_events inquiry_events_inquiry_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inquiry_events
    ADD CONSTRAINT inquiry_events_inquiry_id_fkey FOREIGN KEY (inquiry_id) REFERENCES public.inquiries(id) ON DELETE CASCADE;


--
-- Name: pages pages_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: posts posts_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: staff staff_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: chats chats_created_by_fkey; Type: FK CONSTRAINT; Schema: research; Owner: -
--

ALTER TABLE ONLY research.chats
    ADD CONSTRAINT chats_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: chats chats_project_id_fkey; Type: FK CONSTRAINT; Schema: research; Owner: -
--

ALTER TABLE ONLY research.chats
    ADD CONSTRAINT chats_project_id_fkey FOREIGN KEY (project_id) REFERENCES research.projects(id) ON DELETE SET NULL;


--
-- Name: chunks chunks_document_id_fkey; Type: FK CONSTRAINT; Schema: research; Owner: -
--

ALTER TABLE ONLY research.chunks
    ADD CONSTRAINT chunks_document_id_fkey FOREIGN KEY (document_id) REFERENCES research.documents(id) ON DELETE CASCADE;


--
-- Name: documents documents_created_by_fkey; Type: FK CONSTRAINT; Schema: research; Owner: -
--

ALTER TABLE ONLY research.documents
    ADD CONSTRAINT documents_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: documents documents_project_id_fkey; Type: FK CONSTRAINT; Schema: research; Owner: -
--

ALTER TABLE ONLY research.documents
    ADD CONSTRAINT documents_project_id_fkey FOREIGN KEY (project_id) REFERENCES research.projects(id) ON DELETE CASCADE;


--
-- Name: messages messages_chat_id_fkey; Type: FK CONSTRAINT; Schema: research; Owner: -
--

ALTER TABLE ONLY research.messages
    ADD CONSTRAINT messages_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES research.chats(id) ON DELETE CASCADE;


--
-- Name: projects projects_created_by_fkey; Type: FK CONSTRAINT; Schema: research; Owner: -
--

ALTER TABLE ONLY research.projects
    ADD CONSTRAINT projects_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: inquiries anyone submit inquiry; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "anyone submit inquiry" ON public.inquiries FOR INSERT TO authenticated, anon WITH CHECK ((status = 'new'::text));


--
-- Name: inquiries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

--
-- Name: inquiry_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.inquiry_events ENABLE ROW LEVEL SECURITY;

--
-- Name: inquiry_events inquiry_events_staff; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY inquiry_events_staff ON public.inquiry_events USING (private.is_staff()) WITH CHECK (private.is_staff());


--
-- Name: pages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

--
-- Name: posts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

--
-- Name: pages public read published pages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read published pages" ON public.pages FOR SELECT TO authenticated, anon USING ((status = 'published'::text));


--
-- Name: posts public read published posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "public read published posts" ON public.posts FOR SELECT TO authenticated, anon USING ((status = 'published'::text));


--
-- Name: seo_audits; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.seo_audits ENABLE ROW LEVEL SECURITY;

--
-- Name: staff; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

--
-- Name: seo_audits staff all audits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "staff all audits" ON public.seo_audits TO authenticated USING (private.is_staff()) WITH CHECK (private.is_staff());


--
-- Name: inquiries staff all inquiries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "staff all inquiries" ON public.inquiries TO authenticated USING (private.is_staff()) WITH CHECK (private.is_staff());


--
-- Name: pages staff all pages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "staff all pages" ON public.pages TO authenticated USING (private.is_staff()) WITH CHECK (private.is_staff());


--
-- Name: posts staff all posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "staff all posts" ON public.posts TO authenticated USING (private.is_staff()) WITH CHECK (private.is_staff());


--
-- Name: stats_daily staff all stats; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "staff all stats" ON public.stats_daily TO authenticated USING (private.is_staff()) WITH CHECK (private.is_staff());


--
-- Name: staff staff read staff; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "staff read staff" ON public.staff FOR SELECT TO authenticated USING (private.is_staff());


--
-- Name: stats_daily; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.stats_daily ENABLE ROW LEVEL SECURITY;

--
-- Name: chats; Type: ROW SECURITY; Schema: research; Owner: -
--

ALTER TABLE research.chats ENABLE ROW LEVEL SECURITY;

--
-- Name: chunks; Type: ROW SECURITY; Schema: research; Owner: -
--

ALTER TABLE research.chunks ENABLE ROW LEVEL SECURITY;

--
-- Name: documents; Type: ROW SECURITY; Schema: research; Owner: -
--

ALTER TABLE research.documents ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: research; Owner: -
--

ALTER TABLE research.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: projects; Type: ROW SECURITY; Schema: research; Owner: -
--

ALTER TABLE research.projects ENABLE ROW LEVEL SECURITY;

--
-- Name: chats staff all; Type: POLICY; Schema: research; Owner: -
--

CREATE POLICY "staff all" ON research.chats TO authenticated USING (private.is_staff()) WITH CHECK (private.is_staff());


--
-- Name: chunks staff all; Type: POLICY; Schema: research; Owner: -
--

CREATE POLICY "staff all" ON research.chunks TO authenticated USING (private.is_staff()) WITH CHECK (private.is_staff());


--
-- Name: documents staff all; Type: POLICY; Schema: research; Owner: -
--

CREATE POLICY "staff all" ON research.documents TO authenticated USING (private.is_staff()) WITH CHECK (private.is_staff());


--
-- Name: messages staff all; Type: POLICY; Schema: research; Owner: -
--

CREATE POLICY "staff all" ON research.messages TO authenticated USING (private.is_staff()) WITH CHECK (private.is_staff());


--
-- Name: projects staff all; Type: POLICY; Schema: research; Owner: -
--

CREATE POLICY "staff all" ON research.projects TO authenticated USING (private.is_staff()) WITH CHECK (private.is_staff());


--
-- Name: SCHEMA private; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA private TO authenticated;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA research; Type: ACL; Schema: -; Owner: -
--

GRANT USAGE ON SCHEMA research TO authenticated;
GRANT USAGE ON SCHEMA research TO service_role;


--
-- Name: FUNCTION is_staff(); Type: ACL; Schema: private; Owner: -
--

REVOKE ALL ON FUNCTION private.is_staff() FROM PUBLIC;
GRANT ALL ON FUNCTION private.is_staff() TO authenticated;


--
-- Name: FUNCTION match_chunks(query_embedding extensions.vector, match_count integer, p_project uuid); Type: ACL; Schema: research; Owner: -
--

GRANT ALL ON FUNCTION research.match_chunks(query_embedding extensions.vector, match_count integer, p_project uuid) TO authenticated;


--
-- Name: TABLE inquiries; Type: ACL; Schema: public; Owner: -
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.inquiries TO anon;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.inquiries TO authenticated;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.inquiries TO service_role;


--
-- Name: TABLE inquiry_board; Type: ACL; Schema: public; Owner: -
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.inquiry_board TO anon;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.inquiry_board TO authenticated;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.inquiry_board TO service_role;


--
-- Name: TABLE inquiry_events; Type: ACL; Schema: public; Owner: -
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.inquiry_events TO anon;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.inquiry_events TO authenticated;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.inquiry_events TO service_role;


--
-- Name: TABLE pages; Type: ACL; Schema: public; Owner: -
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.pages TO anon;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.pages TO authenticated;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.pages TO service_role;


--
-- Name: TABLE posts; Type: ACL; Schema: public; Owner: -
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.posts TO anon;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.posts TO authenticated;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.posts TO service_role;


--
-- Name: TABLE seo_audits; Type: ACL; Schema: public; Owner: -
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.seo_audits TO anon;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.seo_audits TO authenticated;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.seo_audits TO service_role;


--
-- Name: TABLE staff; Type: ACL; Schema: public; Owner: -
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.staff TO anon;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.staff TO authenticated;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.staff TO service_role;


--
-- Name: TABLE stats_daily; Type: ACL; Schema: public; Owner: -
--

GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.stats_daily TO anon;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.stats_daily TO authenticated;
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE public.stats_daily TO service_role;


--
-- Name: TABLE chats; Type: ACL; Schema: research; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE research.chats TO authenticated;


--
-- Name: TABLE chunks; Type: ACL; Schema: research; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE research.chunks TO authenticated;


--
-- Name: SEQUENCE chunks_id_seq; Type: ACL; Schema: research; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE research.chunks_id_seq TO authenticated;


--
-- Name: TABLE documents; Type: ACL; Schema: research; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE research.documents TO authenticated;


--
-- Name: TABLE messages; Type: ACL; Schema: research; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE research.messages TO authenticated;


--
-- Name: SEQUENCE messages_id_seq; Type: ACL; Schema: research; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE research.messages_id_seq TO authenticated;


--
-- Name: TABLE projects; Type: ACL; Schema: research; Owner: -
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE research.projects TO authenticated;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: -
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- PostgreSQL database dump complete
--

\unrestrict 73IpE2LIKMOBbEXhTmU7z23YFx8DonbksYFacYYwfiLY3a3XFt0J5aOQoCyJxvL

