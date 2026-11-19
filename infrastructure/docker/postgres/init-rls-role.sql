-- ============================================================================
-- MonBilan+ — Initialisation PostgreSQL : Rôle applicatif non-superuser (RLS)
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'monbilan_app') THEN
    CREATE ROLE monbilan_app WITH LOGIN PASSWORD 'local_dev_app_pwd' NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS;
  END IF;
END
$$;

GRANT CONNECT ON DATABASE monbilan_plus TO monbilan_app;
GRANT USAGE ON SCHEMA public TO monbilan_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO monbilan_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO monbilan_app;
