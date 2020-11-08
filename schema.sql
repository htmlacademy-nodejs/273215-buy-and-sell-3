--
-- PostgreSQL database dump
--

-- Dumped from database version 10.12 (Ubuntu 10.12-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 12.4 (Ubuntu 12.4-1.pgdg18.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS buy_and_sell;
--
-- Name: buy_and_sell; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE buy_and_sell WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'ru_RU.UTF-8' LC_CTYPE = 'ru_RU.UTF-8';


\connect buy_and_sell

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id bigint NOT NULL,
    name character varying(24) NOT NULL
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comments (
    id bigint NOT NULL,
    text character varying(1000) NOT NULL,
    created date NOT NULL,
    user_id bigint NOT NULL
);


--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: offers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.offers (
    id bigint NOT NULL,
    title character varying(200) NOT NULL,
    description character varying(1000) NOT NULL,
    type bigint NOT NULL,
    sum numeric(6,0) NOT NULL,
    picture_id bigint,
    user_id bigint NOT NULL,
    create_date date NOT NULL,
    updated date NOT NULL
);


--
-- Name: offers_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.offers_categories (
    id bigint NOT NULL,
    offer_id bigint NOT NULL,
    category_id bigint NOT NULL
);


--
-- Name: offers_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.offers_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: offers_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.offers_categories_id_seq OWNED BY public.offers_categories.id;

--
-- Name: offers_categories uk_category_offer; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE public.offers_categories
    ADD CONSTRAINT uk_category_offer UNIQUE (offer_id, category_id);

--
-- Name: offers_comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.offers_comments (
    id bigint NOT NULL,
    offer_id bigint NOT NULL,
    comment_id bigint NOT NULL
);


--
-- Name: offers_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.offers_comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: offers_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.offers_comments_id_seq OWNED BY public.offers_comments.id;


--
-- Name: offers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.offers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: offers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.offers_id_seq OWNED BY public.offers.id;


--
-- Name: offers_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.offers_types (
    id bigint NOT NULL,
    name character varying(10) NOT NULL
);


--
-- Name: offers_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.offers_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: offers_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.offers_types_id_seq OWNED BY public.offers_types.id;


--
-- Name: picturies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.picturies (
    id bigint NOT NULL,
    image character varying(50) NOT NULL,
    image2x character varying(50),
    background character varying(3)
);


--
-- Name: picturies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.picturies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: picturies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.picturies_id_seq OWNED BY public.picturies.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    email character varying(100) NOT NULL,
    password character varying NOT NULL,
    name character varying(100) NOT NULL,
    surname character varying(100),
    avatar character varying(50)
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: offers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offers ALTER COLUMN id SET DEFAULT nextval('public.offers_id_seq'::regclass);


--
-- Name: offers_categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offers_categories ALTER COLUMN id SET DEFAULT nextval('public.offers_categories_id_seq'::regclass);


--
-- Name: offers_comments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offers_comments ALTER COLUMN id SET DEFAULT nextval('public.offers_comments_id_seq'::regclass);


--
-- Name: offers_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offers_types ALTER COLUMN id SET DEFAULT nextval('public.offers_types_id_seq'::regclass);


--
-- Name: picturies id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.picturies ALTER COLUMN id SET DEFAULT nextval('public.picturies_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: offers_categories offers_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offers_categories
    ADD CONSTRAINT offers_categories_pkey PRIMARY KEY (id);


--
-- Name: offers_comments offers_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offers_comments
    ADD CONSTRAINT offers_comments_pkey PRIMARY KEY (id);


--
-- Name: offers offers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT offers_pkey PRIMARY KEY (id);


--
-- Name: offers_types offers_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offers_types
    ADD CONSTRAINT offers_types_pkey PRIMARY KEY (id);


--
-- Name: picturies picturies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.picturies
    ADD CONSTRAINT picturies_pkey PRIMARY KEY (id);


--
-- Name: users uk_email; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_email UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: qi_offers_title; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX qi_offers_title ON public.offers USING btree (title);


--
-- Name: u_categories_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX u_categories_id ON public.categories USING btree (id);


--
-- Name: u_comments_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX u_comments_id ON public.comments USING btree (id);


--
-- Name: u_offers_categories_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX u_offers_categories_id ON public.offers_categories USING btree (id);


--
-- Name: u_offers_comments_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX u_offers_comments_id ON public.offers_comments USING btree (id);


--
-- Name: u_offers_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX u_offers_id ON public.offers USING btree (id);


--
-- Name: u_offers_types_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX u_offers_types_id ON public.offers_types USING btree (id);


--
-- Name: u_picturies_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX u_picturies_id ON public.picturies USING btree (id);


--
-- Name: u_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX u_users_email ON public.users USING btree (email);


--
-- Name: u_users_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX u_users_id ON public.users USING btree (id);


--
-- Name: comments fk_comments_author; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_comments_author FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: offers_categories fk_offers_categories_category; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offers_categories
    ADD CONSTRAINT fk_offers_categories_category FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: offers_categories fk_offers_categories_offer; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offers_categories
    ADD CONSTRAINT fk_offers_categories_offer FOREIGN KEY (offer_id) REFERENCES public.offers(id);


--
-- Name: offers_comments fk_offers_comments_comment; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offers_comments
    ADD CONSTRAINT fk_offers_comments_comment FOREIGN KEY (comment_id) REFERENCES public.comments(id);


--
-- Name: offers_comments fk_offers_comments_offer; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offers_comments
    ADD CONSTRAINT fk_offers_comments_offer FOREIGN KEY (offer_id) REFERENCES public.offers(id);


--
-- Name: offers fk_offers_picture_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT fk_offers_picture_id FOREIGN KEY (picture_id) REFERENCES public.picturies(id);


--
-- Name: offers fk_offers_type; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT fk_offers_type FOREIGN KEY (type) REFERENCES public.offers_types(id);


--
-- Name: offers fk_offers_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT fk_offers_user_id FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: DATABASE buy_and_sell; Type: ACL; Schema: -; Owner: -
--

GRANT ALL ON DATABASE buy_and_sell TO dawinn;
GRANT ALL ON DATABASE buy_and_sell TO dev;


--
-- PostgreSQL database dump complete
--
