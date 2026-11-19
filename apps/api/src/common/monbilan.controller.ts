// ============================================================================
// Contrôleur HTTP REST v1 — MonBilan+ (OpenAPI / Swagger)
// ============================================================================

import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Param,
  Patch,
  Post,
  Res
} from '@nestjs/common';
import type { Response } from 'express';
import { DEMO_IDS } from './demo-fixture.js';
import { MonBilanApplicationService } from './monbilan-application.service.js';

@Controller('v1')
export class MonBilanController {
  constructor(
    @Inject(MonBilanApplicationService)
    private readonly appService: MonBilanApplicationService
  ) {}

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'monbilan-plus-api',
      architecture: 'Modular Monolith + Clean Architecture + PostgreSQL RLS',
      defaultReportId: DEMO_IDS.REPORT_LEO,
      defaultRestitutionId: DEMO_IDS.RESTITUTION_LEO,
      timestamp: new Date().toISOString()
    };
  }

  @Get('reports/:id')
  getReport(
    @Param('id') id: string,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.getReportForCounselor(actor, id);
  }

  @Patch('reports/:id/facts/:factId')
  verifyFact(
    @Param('id') id: string,
    @Param('factId') factId: string,
    @Body() body: unknown,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.verifyFact(actor, id, factId, body);
  }

  @Post('reports/:id/restitutions')
  async generateDraft(
    @Param('id') id: string,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.generateRestitutionDraft(actor, id);
  }

  @Patch('restitutions/:id/claims/:claimId')
  updateClaim(
    @Param('id') id: string,
    @Param('claimId') claimId: string,
    @Body() body: unknown,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.updateClaim(actor, id, claimId, body);
  }

  @Post('restitutions/:id/approve')
  approveRestitution(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.approveRestitution(actor, id, body);
  }

  @Post('restitutions/:id/audio')
  async generateAudio(
    @Param('id') id: string,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.generateAudioForRestitution(actor, id);
  }

  @Get('restitutions/:id/audio-stream')
  streamAudio(@Res() res: Response) {
    const wav = this.appService.getAudioBuffer();
    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Content-Length', wav.length);
    res.send(wav);
  }

  @Post('restitutions/:id/publish')
  publishRestitution(
    @Param('id') id: string,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.publishRestitution(actor, id);
  }

  @Get('reports/:id/interview')
  getInterview(
    @Param('id') id: string,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.getInterviewSummary(actor, id);
  }

  @Post('reports/:id/interview')
  saveInterview(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.saveInterviewSummary(actor, id, body);
  }

  @Get('reports/:id/careers/assessments')
  getCareerAssessments(
    @Param('id') id: string,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.getCareerAssessments(actor, id);
  }

  @Patch('reports/:id/careers/assessments/:careerId')
  updateCareerAssessment(
    @Param('id') id: string,
    @Param('careerId') careerId: string,
    @Body() body: unknown,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.updateCareerAssessment(actor, id, careerId, body);
  }

  @Post('reports/:id/careers/assessments/bulk-validate')
  bulkValidateCareerAssessments(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.bulkValidateCareerAssessments(actor, id, body);
  }

  @Get('restitutions/:id/episodes')
  getEpisodes(
    @Param('id') id: string,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.getEpisodes(actor, id);
  }

  @Patch('restitutions/:id/episodes/:episodeId')
  updateEpisodeScript(
    @Param('id') id: string,
    @Param('episodeId') episodeId: string,
    @Body() body: unknown,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.updateEpisodeScript(actor, id, episodeId, body);
  }

  @Post('restitutions/:id/episodes/:episodeId/audio')
  async generateEpisodeAudio(
    @Param('id') id: string,
    @Param('episodeId') episodeId: string,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.generateEpisodeAudio(actor, id, episodeId);
  }

  @Get('me/restitutions')
  getMyRestitutions(@Headers() headers: Record<string, string | string[] | undefined>) {
    const actor = this.appService.resolveActorFromHeaders({
      ...headers,
      'x-demo-role': headers['x-demo-role'] ?? 'YOUNG'
    });
    return this.appService.getPublishedRestitutionForYoung(actor);
  }

  @Post('me/questions')
  createQuestion(
    @Body() body: unknown,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders({
      ...headers,
      'x-demo-role': headers['x-demo-role'] ?? 'YOUNG'
    });
    return this.appService.createYoungQuestion(actor, body);
  }
}
