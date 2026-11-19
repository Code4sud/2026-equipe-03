// ============================================================================
// @monbilan/config — Validation stricte des variables d'environnement au démarrage
// ============================================================================

import { z } from 'zod';

export const EnvConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  API_PREFIX: z.string().default('v1'),
  CORS_ORIGIN: z.string().default('http://localhost:4200'),
  DATABASE_URL: z.string().min(10),
  DATABASE_ADMIN_URL: z.string().optional(),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  JWT_SECRET: z.string().min(16),
  SIGNED_URL_SECRET: z.string().min(16).default('dev-only-signed-url-secret-change-in-prod-32bytes'),
  SIGNED_URL_TTL_SECONDS: z.coerce.number().int().positive().default(300),
  PRIVATE_STORAGE_PATH: z.string().default('./storage/private'),
  MAX_PDF_SIZE_BYTES: z.coerce.number().int().positive().default(15728640),
  OLLAMA_BASE_URL: z.string().url().default('http://localhost:11434'),
  OLLAMA_MODEL: z.string().default('qwen2.5:3b'),
  OLLAMA_TIMEOUT_MS: z.coerce.number().int().positive().default(60000),
  TTS_PROVIDER: z.enum(['piper', 'fallback-wav']).default('piper'),
  PIPER_BINARY_PATH: z.string().default('/usr/local/bin/piper'),
  PIPER_VOICE_MODEL: z.string().default('fr_FR-upmc-medium')
});

export type AppEnvConfig = z.infer<typeof EnvConfigSchema>;

export function loadEnvConfig(rawEnv: NodeJS.ProcessEnv = process.env): AppEnvConfig {
  const parsed = EnvConfigSchema.safeParse(rawEnv);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Invalid environment configuration: ${errors}`);
  }
  return parsed.data;
}
