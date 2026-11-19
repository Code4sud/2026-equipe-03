// ============================================================================
// TenantPrismaService — Propagation sécurisée de app.tenant_id pour PostgreSQL RLS
// Garantit que chaque opération s'exécute dans une transaction avec SET LOCAL
// ============================================================================

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

@Injectable()
export class TenantPrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  /**
   * Exécute un bloc transactionnel isolé sur un tenantId vérifié.
   * `set_config('app.tenant_id', tenantId, true)` fixe le contexte RLS
   * localement à la transaction (`is_local = true`), empêchant toute fuite
   * via le pool de connexions PostgreSQL.
   */
  async withTenant<T>(
    tenantId: string,
    fn: (tx: Prisma.TransactionClient) => Promise<T>
  ): Promise<T> {
    if (!UUID_REGEX.test(tenantId)) {
      throw new Error('Invalid tenantId format: must be a valid UUID.');
    }

    return this.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.tenant_id', ${tenantId}, true)`;
      return fn(tx);
    });
  }
}
