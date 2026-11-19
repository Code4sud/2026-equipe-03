// ============================================================================
// Seed Prisma — Référentiel O*NET FR (721 métiers) + Tenant Fictif de Démo
// ============================================================================

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface OnetCareerSeedItem {
  onetSocCode: string;
  titleEn: string;
  titleFr: string;
  descriptionFr: string;
  jobZone: number;
  jobZoneJustification: string;
}

async function main() {
  console.log('[Seed] Chargement du référentiel O*NET FR...');
  const careersPath = join(process.cwd(), 'prisma/seed/onet-careers.json');
  const rawCareers = JSON.parse(readFileSync(careersPath, 'utf-8')) as OnetCareerSeedItem[];

  for (const item of rawCareers) {
    await prisma.career.upsert({
      where: { onetSocCode: item.onetSocCode },
      update: {
        titleEn: item.titleEn,
        titleFr: item.titleFr,
        descriptionFr: item.descriptionFr,
        jobZone: item.jobZone,
        jobZoneJustification: item.jobZoneJustification
      },
      create: {
        onetSocCode: item.onetSocCode,
        titleEn: item.titleEn,
        titleFr: item.titleFr,
        descriptionFr: item.descriptionFr,
        jobZone: item.jobZone,
        jobZoneJustification: item.jobZoneJustification
      }
    });
  }

  console.log(`[Seed] ${rawCareers.length} métiers O*NET FR importés.`);
}

main()
  .catch((err) => {
    console.error('[Seed] Erreur:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
