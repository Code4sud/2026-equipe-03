// ============================================================================
// Contrôleur HTTP REST v1 — MonBilan+ (OpenAPI / Swagger)
// ============================================================================

import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Res,
  NotFoundException
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

  // --------------------------------------------------------------------------
  // ROUTES IMMERSION PRO
  // --------------------------------------------------------------------------
  @Get('immersions')
  getImmersions(@Headers() headers: Record<string, string | string[] | undefined>) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.getImmersionProjects(actor);
  }

  @Post('immersions')
  createImmersion(
    @Body() body: unknown,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.createImmersionProject(actor, body);
  }

  @Get('immersions/:id')
  getImmersion(
    @Param('id') id: string,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.getImmersionProject(actor, id);
  }

  @Patch('immersions/:id')
  updateImmersion(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.updateImmersionProject(actor, id, body);
  }

  @Get('companies')
  getCompanies(@Headers() headers: Record<string, string | string[] | undefined>) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.getPartnerCompanies(actor);
  }

  @Post('immersions/:id/applications')
  createApplication(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.createApplication(actor, id, body);
  }

  @Post('immersions/:id/journal')
  saveJournal(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.saveObservationEntry(actor, id, body);
  }

  @Post('immersions/:id/review')
  saveReview(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.saveImmersionReview(actor, id, body);
  }

  @Get('counselor/immersions')
  getCounselorImmersions(@Headers() headers: Record<string, string | string[] | undefined>) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.getCounselorImmersionOverview(actor);
  }

  // --------------------------------------------------------------------------
  // ROUTES PARCOURS AUTONOME
  // --------------------------------------------------------------------------
  @Get('me/journey')
  getJourney(@Headers() headers: Record<string, string | string[] | undefined>) {
    const actor = this.appService.resolveActorFromHeaders({
      ...headers,
      'x-demo-role': headers['x-demo-role'] ?? 'YOUNG'
    });
    return this.appService.getJourneyMode(actor);
  }

  @Patch('me/journey')
  updateJourney(
    @Body() body: unknown,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders({
      ...headers,
      'x-demo-role': headers['x-demo-role'] ?? 'YOUNG'
    });
    return this.appService.setJourneyMode(actor, body);
  }

  @Get('careers')
  getCatalog(
    @Query('query') query?: string,
    @Query('category') category?: string,
    @Query('jobZone') jobZone?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Headers() headers?: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers ?? {});
    return this.appService.getCareersCatalog(
      actor,
      query,
      category,
      jobZone ? Number(jobZone) : undefined,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20
    );
  }

  @Get('careers/:id')
  getCareer(
    @Param('id') id: string,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.getCareerById(actor, id);
  }

  @Get('me/favorites')
  getFavorites(@Headers() headers: Record<string, string | string[] | undefined>) {
    const actor = this.appService.resolveActorFromHeaders({
      ...headers,
      'x-demo-role': headers['x-demo-role'] ?? 'YOUNG'
    });
    return this.appService.getUserFavorites(actor);
  }

  @Post('me/favorites')
  addFavorite(
    @Body() body: { careerId: string },
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders({
      ...headers,
      'x-demo-role': headers['x-demo-role'] ?? 'YOUNG'
    });
    return this.appService.toggleUserFavorite(actor, body.careerId);
  }

  @Delete('me/favorites/:careerId')
  removeFavorite(
    @Param('careerId') careerId: string,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders({
      ...headers,
      'x-demo-role': headers['x-demo-role'] ?? 'YOUNG'
    });
    return this.appService.toggleUserFavorite(actor, careerId);
  }

  @Get('support/resources')
  getSupportResources(
    @Query('category') category?: string,
    @Query('city') city?: string,
    @Headers() headers?: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers ?? {});
    return this.appService.getSupportResources(actor, category, city);
  }

  @Get('local/opportunities')
  getLocalOpportunities(
    @Query('career') career?: string,
    @Query('city') city?: string,
    @Query('radiusKm') radiusKm?: string,
    @Query('category') category?: 'ALL' | 'FORMATION' | 'ACCOMPAGNEMENT' | 'ENTREPRISE',
    @Query('sort') sort?: 'relevance' | 'distance' | 'name'
  ) {
    return this.appService.getLocalOpportunities({
      career,
      city,
      radiusKm: radiusKm ? Number(radiusKm) : 25,
      category: category ?? 'ALL',
      sort: sort ?? 'relevance'
    });
  }

  @Get('local/opportunities/:id')
  getLocalOpportunityById(@Param('id') id: string) {
    const opp = this.appService.getLocalOpportunityById(id);
    if (!opp) {
      throw new NotFoundException(`Opportunity with id ${id} not found`);
    }
    return opp;
  }

  // --------------------------------------------------------------------------
  // Profil Utilisateur, Paramètres & Sécurité
  // --------------------------------------------------------------------------
  @Get('users/me')
  getCurrentUserProfile(@Headers() headers: Record<string, string | string[] | undefined>) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.getUserProfile(actor);
  }

  @Patch('users/me')
  updateCurrentUserProfile(
    @Body() body: Record<string, any>,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.updateUserProfile(actor, body);
  }

  @Post('auth/change-password')
  changeUserPassword(
    @Body() body: Record<string, any>,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.changePassword(actor, body);
  }

  @Get('auth/sessions')
  getUserSessions(@Headers() headers: Record<string, string | string[] | undefined>) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.getUserSessions(actor);
  }

  // --------------------------------------------------------------------------
  // Routes Suivi & Rendez-vous (Espace Conseiller)
  // --------------------------------------------------------------------------
  @Get('appointments')
  getAppointments(
    @Query('date') date?: string,
    @Query('status') status?: string,
    @Headers() headers?: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers ?? {});
    return this.appService.getAppointments(actor, { date, status });
  }

  @Get('appointments/:id')
  getAppointmentById(
    @Param('id') id: string,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.getAppointmentById(actor, id);
  }

  @Post('appointments')
  createAppointment(
    @Body() body: any,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.createAppointment(actor, body);
  }

  @Patch('appointments/:id/status')
  updateAppointmentStatus(
    @Param('id') id: string,
    @Body() body: { status: any; reason?: string },
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.updateAppointmentStatus(actor, id, body.status, body.reason);
  }

  @Patch('appointments/:id')
  updateAppointment(
    @Param('id') id: string,
    @Body() body: any,
    @Headers() headers: Record<string, string | string[] | undefined>
  ) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.updateAppointment(actor, id, body);
  }

  @Get('counselor/follow-up/summary')
  getFollowUpSummary(@Headers() headers: Record<string, string | string[] | undefined>) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.getFollowUpSummary(actor);
  }

  @Get('counselor/follow-up/youths')
  getFollowUpYouths(@Headers() headers: Record<string, string | string[] | undefined>) {
    const actor = this.appService.resolveActorFromHeaders(headers);
    return this.appService.getFollowUpYouths(actor);
  }
}

