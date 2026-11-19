-- ============================================================================
-- MonBilan+ — Migration Initiale + Activation stricte PostgreSQL RLS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE "Role" AS ENUM ('PLATFORM_ADMIN', 'TENANT_ADMIN', 'COUNSELOR', 'YOUNG');
CREATE TYPE "ReportStatus" AS ENUM ('UPLOADED', 'EXTRACTING', 'EXTRACTION_REVIEW', 'DRAFTING', 'DRAFT_REVIEW', 'APPROVED', 'AUDIO_GENERATING', 'READY', 'PUBLISHED', 'FAILED', 'REJECTED', 'SUPERSEDED');
CREATE TYPE "FactCategory" AS ENUM ('METADATA', 'RIASEC_INTEREST', 'COGNITIVE_APTITUDE', 'HEXACO_PERSONALITY', 'PSYCHOMOTOR', 'CAREER_ZONE');
CREATE TYPE "ExtractionConfidence" AS ENUM ('EXACT_TEXT', 'REQUIRES_HUMAN_REVIEW', 'HUMAN_VERIFIED');
CREATE TYPE "ClaimKind" AS ENUM ('PERSONAL_FACT', 'CAREER_LINK', 'PEDAGOGICAL_TIP', 'PARENT_SUMMARY');
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'EDITED', 'REJECTED');
CREATE TYPE "AudienceMode" AS ENUM ('YOUNG', 'PARENTS');

-- 1. Tenants
CREATE TABLE "tenants" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "settings" JSONB NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

-- 2. Users
CREATE TABLE "users" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "email" TEXT NOT NULL,
  "password_hash" TEXT NOT NULL,
  "display_name" TEXT NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- 3. Memberships
CREATE TABLE "memberships" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "role" "Role" NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "memberships_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "memberships_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
  CONSTRAINT "memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "memberships_tenant_id_user_id_key" ON "memberships"("tenant_id", "user_id");
CREATE INDEX "memberships_tenant_id_role_idx" ON "memberships"("tenant_id", "role");

-- 4. Young Profiles
CREATE TABLE "young_profiles" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "user_id" UUID,
  "external_rdv_code" TEXT NOT NULL,
  "display_name" TEXT NOT NULL,
  "age_range" TEXT NOT NULL DEFAULT '16-25',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "young_profiles_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "young_profiles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
  CONSTRAINT "young_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL
);
CREATE UNIQUE INDEX "young_profiles_tenant_id_id_key" ON "young_profiles"("tenant_id", "id");
CREATE UNIQUE INDEX "young_profiles_tenant_id_external_rdv_code_key" ON "young_profiles"("tenant_id", "external_rdv_code");
CREATE INDEX "young_profiles_tenant_id_idx" ON "young_profiles"("tenant_id");

-- 5. Assignments
CREATE TABLE "assignments" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "counselor_id" UUID NOT NULL,
  "young_profile_id" UUID NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "assignments_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "assignments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
  CONSTRAINT "assignments_counselor_id_fkey" FOREIGN KEY ("counselor_id") REFERENCES "users"("id") ON DELETE CASCADE,
  CONSTRAINT "assignments_tenant_young_fkey" FOREIGN KEY ("tenant_id", "young_profile_id") REFERENCES "young_profiles"("tenant_id", "id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "assignments_tenant_counselor_young_key" ON "assignments"("tenant_id", "counselor_id", "young_profile_id");
CREATE INDEX "assignments_tenant_id_counselor_id_idx" ON "assignments"("tenant_id", "counselor_id");

-- 6. Reports
CREATE TABLE "reports" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "young_profile_id" UUID NOT NULL,
  "rdv_number" TEXT NOT NULL,
  "report_date" TEXT NOT NULL,
  "storage_key" TEXT NOT NULL,
  "file_sha256" TEXT NOT NULL,
  "page_count" INTEGER NOT NULL DEFAULT 17,
  "status" "ReportStatus" NOT NULL DEFAULT 'UPLOADED',
  "reviewed_by_id" UUID,
  "reviewed_at" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "reports_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "reports_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
  CONSTRAINT "reports_tenant_young_fkey" FOREIGN KEY ("tenant_id", "young_profile_id") REFERENCES "young_profiles"("tenant_id", "id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "reports_tenant_id_id_key" ON "reports"("tenant_id", "id");
CREATE INDEX "reports_tenant_id_young_profile_id_idx" ON "reports"("tenant_id", "young_profile_id");
CREATE INDEX "reports_tenant_id_status_idx" ON "reports"("tenant_id", "status");

-- 7. Report Sections
CREATE TABLE "report_sections" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "report_id" UUID NOT NULL,
  "category" "FactCategory" NOT NULL,
  "title" TEXT NOT NULL,
  "page_start" INTEGER NOT NULL,
  "page_end" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "report_sections_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "report_sections_tenant_report_fkey" FOREIGN KEY ("tenant_id", "report_id") REFERENCES "reports"("tenant_id", "id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "report_sections_tenant_id_id_key" ON "report_sections"("tenant_id", "id");
CREATE INDEX "report_sections_tenant_id_report_id_idx" ON "report_sections"("tenant_id", "report_id");

-- 8. Report Facts
CREATE TABLE "report_facts" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "report_id" UUID NOT NULL,
  "section_id" UUID,
  "category" "FactCategory" NOT NULL,
  "fact_key" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "rank_order" INTEGER,
  "numeric_score" DOUBLE PRECISION,
  "max_score" DOUBLE PRECISION,
  "raw_excerpt" TEXT NOT NULL,
  "page_number" INTEGER NOT NULL,
  "confidence" "ExtractionConfidence" NOT NULL DEFAULT 'EXACT_TEXT',
  "is_verified" BOOLEAN NOT NULL DEFAULT false,
  "verified_by_id" UUID,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "report_facts_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "report_facts_tenant_report_fkey" FOREIGN KEY ("tenant_id", "report_id") REFERENCES "reports"("tenant_id", "id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "report_facts_tenant_id_id_key" ON "report_facts"("tenant_id", "id");
CREATE INDEX "report_facts_tenant_id_report_id_category_idx" ON "report_facts"("tenant_id", "report_id", "category");

-- 9. Restitutions
CREATE TABLE "restitutions" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "report_id" UUID NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  "status" "ReportStatus" NOT NULL DEFAULT 'DRAFT_REVIEW',
  "young_script" TEXT NOT NULL,
  "parents_summary" TEXT NOT NULL,
  "script_hash" TEXT NOT NULL,
  "approved_by_id" UUID,
  "approved_at" TIMESTAMP(3),
  "published_by_id" UUID,
  "published_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "restitutions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "restitutions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
  CONSTRAINT "restitutions_tenant_report_fkey" FOREIGN KEY ("tenant_id", "report_id") REFERENCES "reports"("tenant_id", "id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "restitutions_tenant_id_id_key" ON "restitutions"("tenant_id", "id");
CREATE UNIQUE INDEX "restitutions_tenant_id_report_id_version_key" ON "restitutions"("tenant_id", "report_id", "version");
CREATE INDEX "restitutions_tenant_id_report_id_status_idx" ON "restitutions"("tenant_id", "report_id", "status");

-- 10. Claims
CREATE TABLE "claims" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "restitution_id" UUID NOT NULL,
  "kind" "ClaimKind" NOT NULL,
  "audience" "AudienceMode" NOT NULL DEFAULT 'YOUNG',
  "display_order" INTEGER NOT NULL,
  "text" TEXT NOT NULL,
  "review_status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
  "reviewer_note" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "claims_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "claims_tenant_restitution_fkey" FOREIGN KEY ("tenant_id", "restitution_id") REFERENCES "restitutions"("tenant_id", "id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "claims_tenant_id_id_key" ON "claims"("tenant_id", "id");
CREATE INDEX "claims_tenant_id_restitution_id_idx" ON "claims"("tenant_id", "restitution_id");

-- 11. Claim Sources
CREATE TABLE "claim_sources" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "claim_id" UUID NOT NULL,
  "fact_id" UUID NOT NULL,
  "page_number" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "claim_sources_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "claim_sources_tenant_claim_fkey" FOREIGN KEY ("tenant_id", "claim_id") REFERENCES "claims"("tenant_id", "id") ON DELETE CASCADE,
  CONSTRAINT "claim_sources_tenant_fact_fkey" FOREIGN KEY ("tenant_id", "fact_id") REFERENCES "report_facts"("tenant_id", "id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "claim_sources_tenant_id_claim_id_fact_id_key" ON "claim_sources"("tenant_id", "claim_id", "fact_id");
CREATE INDEX "claim_sources_tenant_id_claim_id_idx" ON "claim_sources"("tenant_id", "claim_id");

-- 12. Audio Assets
CREATE TABLE "audio_assets" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "restitution_id" UUID NOT NULL,
  "audience" "AudienceMode" NOT NULL DEFAULT 'YOUNG',
  "script_hash" TEXT NOT NULL,
  "storage_key" TEXT NOT NULL,
  "mime_type" TEXT NOT NULL DEFAULT 'audio/wav',
  "duration_sec" INTEGER NOT NULL DEFAULT 0,
  "is_invalidated" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "audio_assets_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "audio_assets_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
  CONSTRAINT "audio_assets_tenant_restitution_fkey" FOREIGN KEY ("tenant_id", "restitution_id") REFERENCES "restitutions"("tenant_id", "id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "audio_assets_tenant_id_id_key" ON "audio_assets"("tenant_id", "id");
CREATE INDEX "audio_assets_tenant_id_restitution_id_idx" ON "audio_assets"("tenant_id", "restitution_id");

-- 13. Global O*NET Careers (Read-only reference catalog)
CREATE TABLE "careers" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "onet_soc_code" TEXT NOT NULL,
  "title_en" TEXT NOT NULL,
  "title_fr" TEXT NOT NULL,
  "description_fr" TEXT NOT NULL,
  "job_zone" INTEGER NOT NULL,
  "job_zone_justification" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "careers_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "careers_onet_soc_code_key" ON "careers"("onet_soc_code");
CREATE INDEX "careers_job_zone_idx" ON "careers"("job_zone");
CREATE INDEX "careers_title_fr_idx" ON "careers"("title_fr");

-- 14. Report Careers
CREATE TABLE "report_careers" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "report_id" UUID NOT NULL,
  "career_id" UUID,
  "job_zone" INTEGER NOT NULL,
  "rank_in_zone" INTEGER NOT NULL,
  "title_fr" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "page_number" INTEGER NOT NULL,
  "is_favorite" BOOLEAN NOT NULL DEFAULT false,
  "young_note" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "report_careers_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "report_careers_tenant_report_fkey" FOREIGN KEY ("tenant_id", "report_id") REFERENCES "reports"("tenant_id", "id") ON DELETE CASCADE,
  CONSTRAINT "report_careers_career_id_fkey" FOREIGN KEY ("career_id") REFERENCES "careers"("id") ON DELETE SET NULL
);
CREATE UNIQUE INDEX "report_careers_tenant_id_id_key" ON "report_careers"("tenant_id", "id");
CREATE INDEX "report_careers_tenant_id_report_id_job_zone_idx" ON "report_careers"("tenant_id", "report_id", "job_zone");

-- 15. Questions
CREATE TABLE "questions" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "young_profile_id" UUID NOT NULL,
  "report_id" UUID,
  "related_topic" TEXT NOT NULL,
  "question_text" TEXT NOT NULL,
  "counselor_reply" TEXT,
  "answered_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "questions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "questions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
  CONSTRAINT "questions_tenant_young_fkey" FOREIGN KEY ("tenant_id", "young_profile_id") REFERENCES "young_profiles"("tenant_id", "id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "questions_tenant_id_id_key" ON "questions"("tenant_id", "id");
CREATE INDEX "questions_tenant_id_young_profile_id_idx" ON "questions"("tenant_id", "young_profile_id");

-- 16. Audit Events
CREATE TABLE "audit_events" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id" UUID NOT NULL,
  "actor_id" UUID,
  "actor_role" TEXT,
  "action" TEXT NOT NULL,
  "entity_type" TEXT NOT NULL,
  "entity_id" TEXT NOT NULL,
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "audit_events_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE
);
CREATE INDEX "audit_events_tenant_id_created_at_idx" ON "audit_events"("tenant_id", "created_at");
CREATE INDEX "audit_events_tenant_id_entity_type_entity_id_idx" ON "audit_events"("tenant_id", "entity_type", "entity_id");

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) — Isolation stricte par tenant_id
-- ============================================================================

DO $$
DECLARE
  tbl TEXT;
  tenant_tables TEXT[] := ARRAY[
    'memberships',
    'young_profiles',
    'assignments',
    'reports',
    'report_sections',
    'report_facts',
    'restitutions',
    'claims',
    'claim_sources',
    'audio_assets',
    'report_careers',
    'questions',
    'audit_events'
  ];
BEGIN
  FOREACH tbl IN ARRAY tenant_tables
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', tbl);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY;', tbl);
    EXECUTE format(
      'CREATE POLICY %I_tenant_isolation ON %I USING (tenant_id = NULLIF(current_setting(''app.tenant_id'', true), '''')::uuid) WITH CHECK (tenant_id = NULLIF(current_setting(''app.tenant_id'', true), '''')::uuid);',
      tbl, tbl
    );
  END LOOP;
END
$$;
