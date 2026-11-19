// ============================================================================
// @monbilan/worker — Worker BullMQ Asynchrone (Extraction PDF, Ollama/Qwen, Piper TTS)
// ============================================================================

import {
  ExtractReportJobSchema,
  GenerateAudioJobSchema,
  GenerateDraftJobSchema
} from '@monbilan/contracts';

export const QUEUE_NAMES = {
  EXTRACT_REPORT: 'extract-report',
  GENERATE_DRAFT: 'generate-draft',
  GENERATE_AUDIO: 'generate-audio'
} as const;

export function buildIdempotentJobKey(params: {
  tenantId: string;
  entityId: string;
  operation: string;
  version: number;
}): string {
  return `${params.tenantId}:${params.entityId}:${params.operation}:v${params.version}`;
}

export function validateWorkerJobPayload(
  queueName: string,
  payload: unknown
): { valid: boolean; reason?: string } {
  if (queueName === QUEUE_NAMES.EXTRACT_REPORT) {
    const res = ExtractReportJobSchema.safeParse(payload);
    return res.success ? { valid: true } : { valid: false, reason: res.error.message };
  }
  if (queueName === QUEUE_NAMES.GENERATE_DRAFT) {
    const res = GenerateDraftJobSchema.safeParse(payload);
    return res.success ? { valid: true } : { valid: false, reason: res.error.message };
  }
  if (queueName === QUEUE_NAMES.GENERATE_AUDIO) {
    const res = GenerateAudioJobSchema.safeParse(payload);
    return res.success ? { valid: true } : { valid: false, reason: res.error.message };
  }
  return { valid: false, reason: `Unknown queue ${queueName}` };
}

async function startWorker() {
  console.log('[MonBilan+ Worker] Asynchronous job processor initialized.');
  console.log('[MonBilan+ Worker] Registered queues:', Object.values(QUEUE_NAMES).join(', '));
}

if (process.env['NODE_ENV'] !== 'test') {
  startWorker();
}
