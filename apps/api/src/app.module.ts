import { Module } from '@nestjs/common';
import { MonBilanApplicationService } from './common/monbilan-application.service.js';
import { MonBilanController } from './common/monbilan.controller.js';
import { RealAuthService } from './common/auth/real-auth.service.js';
import {
  AudioModule,
  AuditModule,
  AuthorizationModule,
  CareersModule,
  ClaimsModule,
  ExtractionModule,
  IdentityModule,
  QuestionsModule,
  ReportsModule,
  RestitutionsModule,
  TenancyModule,
  YoungProfilesModule
} from './modules/bounded-contexts.module.js';

@Module({
  imports: [
    IdentityModule,
    TenancyModule,
    AuthorizationModule,
    YoungProfilesModule,
    ReportsModule,
    ExtractionModule,
    RestitutionsModule,
    ClaimsModule,
    CareersModule,
    AudioModule,
    QuestionsModule,
    AuditModule
  ],
  controllers: [MonBilanController],
  providers: [MonBilanApplicationService, RealAuthService]
})
export class AppModule {}
