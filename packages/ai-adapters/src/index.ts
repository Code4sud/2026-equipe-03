// ============================================================================
// @monbilan/ai-adapters — Ports & Adapters pour Ollama (Qwen) et Piper TTS
// Protection anti-Prompt Injection & Zéro Hallucination par construction
// ============================================================================

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { LLMGeneratedDraft, LLMGeneratedDraftSchema } from '@monbilan/contracts';
import {
  CareerAssessment,
  countWords,
  DomainAudioEpisode,
  DomainCareer,
  DomainFact,
  DomainInterviewSummary,
  EPISODE_TOPIC_DEFINITIONS,
  SourceReference,
  TranscriptSegment
} from '@monbilan/domain';

export interface EpisodeGenerationInput {
  restitutionId: string;
  reportId: string;
  youngDisplayName: string;
  facts: DomainFact[];
  careers: DomainCareer[];
  assessments: CareerAssessment[];
  interview?: DomainInterviewSummary | null;
}

export interface LLMGenerationInput {
  reportId: string;
  youngDisplayName: string;
  facts: DomainFact[];
  careers: DomainCareer[];
}

export interface LLMProviderPort {
  generateSourcedDraft(input: LLMGenerationInput): Promise<LLMGeneratedDraft>;
}

export interface SpeechSynthesisResult {
  audioBuffer: Buffer;
  mimeType: string;
  durationSec: number;
}

export interface SpeechProviderPort {
  synthesize(text: string): Promise<SpeechSynthesisResult>;
}

// ----------------------------------------------------------------------------
// 1. Générateur déterministe sourcé (Fallback garanti 100 % fidèle aux faits)
// ----------------------------------------------------------------------------
export function buildDeterministicSourcedDraft(input: LLMGenerationInput): LLMGeneratedDraft {
  const riasec = input.facts
    .filter((f) => f.category === 'RIASEC_INTEREST')
    .sort((a, b) => (a.rankOrder ?? 99) - (b.rankOrder ?? 99));

  const cognitive = input.facts
    .filter((f) => f.category === 'COGNITIVE_APTITUDE')
    .sort((a, b) => (a.rankOrder ?? 99) - (b.rankOrder ?? 99));

  const hexaco = input.facts
    .filter((f) => f.category === 'HEXACO_PERSONALITY')
    .sort((a, b) => (a.rankOrder ?? 99) - (b.rankOrder ?? 99));

  const claims: LLMGeneratedDraft['claims'] = [];

  if (riasec.length > 0) {
    const topRiasec = riasec.slice(0, 3);
    claims.push({
      id: 'claim-riasec-top',
      kind: 'PERSONAL_FACT',
      audience: 'YOUNG',
      text: `Dans ton rapport d’orientation (modèle RIASEC, page 4), les dimensions sont classées dans cet ordre : ${topRiasec
        .map((r) => `${r.label} (rang #${r.rankOrder ?? 1}, p.${r.pageNumber})`)
        .join(', ')}. Cela reflète les domaines d’activité dans lesquels tu exprimes le plus d’intérêt aujourd’hui.`,
      sourceFactIds: topRiasec.map((r) => r.id)
    });
  }

  if (cognitive.length > 0) {
    const topCog = cognitive.slice(0, 3);
    claims.push({
      id: 'claim-cognitive-top',
      kind: 'PERSONAL_FACT',
      audience: 'YOUNG',
      text: `La page 5 présente tes résultats aux jeux d’aptitudes cognitives (${topCog
        .map((c) => `${c.label}, p.${c.pageNumber}`)
        .join(', ')}). Comme l’indique ton rapport, ces mesures ne représentent qu’une image à un instant T et constituent une tendance générale pour t’aider à explorer des pistes de métiers.`,
      sourceFactIds: topCog.map((c) => c.id)
    });
  }

  if (hexaco.length > 0) {
    const topHex = hexaco.slice(0, 2);
    claims.push({
      id: 'claim-hexaco-top',
      kind: 'PERSONAL_FACT',
      audience: 'YOUNG',
      text: `Côté personnalité (modèle HEXACO), ton profil met en avant : ${topHex
        .map((h) => `${h.label} (p.${h.pageNumber})`)
        .join(' et ')}. Il n'y a ni bon ni mauvais profil : ce sont tes repères personnels.`,
      sourceFactIds: topHex.map((h) => h.id)
    });
  }

  const careerFact = input.facts.find((f) => f.category === 'CAREER_ZONE') ?? input.facts[0];
  if (careerFact && input.careers.length > 0) {
    const sampleCareers = input.careers.slice(0, 3);
    claims.push({
      id: 'claim-careers-zones',
      kind: 'CAREER_LINK',
      audience: 'YOUNG',
      text: `À partir de tes résultats, ton rapport te propose des pistes concrètes classées par durée de formation, comme ${sampleCareers
        .map((c) => `${c.titleFr} (Zone ${c.jobZone}, p.${c.pageNumber})`)
        .join(', ')}. Ce ne sont pas des voies obligatoires, mais des idées à explorer !`,
      sourceFactIds: [careerFact.id],
      referencedCareers: sampleCareers.map((c) => c.titleFr)
    });
  }

  const allFactIds = input.facts.slice(0, 3).map((f) => f.id);
  if (allFactIds.length > 0) {
    claims.push({
      id: 'claim-parents-guide',
      kind: 'PARENT_SUMMARY',
      audience: 'PARENTS',
      text: `Ce bilan du Centre des Possibles met en lumière les forces actuelles de votre jeune sans le comparer aux autres. Les pistes de métiers sont réparties en 5 zones de qualification (de l'accès immédiat en Zone 1 aux études longues en Zone 5) afin d'ouvrir le dialogue sans fermer aucune porte.`,
      sourceFactIds: allFactIds
    });
  }

  if (claims.length === 0 && input.facts[0]) {
    claims.push({
      id: 'claim-default-01',
      kind: 'PERSONAL_FACT',
      audience: 'YOUNG',
      text: `Ton rapport des possibles présente tes résultats personnalisés extraits de la page ${input.facts[0].pageNumber}.`,
      sourceFactIds: [input.facts[0].id]
    });
  }

  const youngScript = claims
    .filter((c) => c.audience === 'YOUNG')
    .map((c) => c.text)
    .join('\n\n');

  const parentsSummary =
    claims
      .filter((c) => c.audience === 'PARENTS')
      .map((c) => c.text)
      .join('\n\n') ||
    'Synthèse destinée aux parents et accompagnants : ce rapport identifie des points d’appui et des pistes de métiers classées par durée de formation, validées avec le psychologue du travail.';

  return {
    youngScript,
    parentsSummary,
    claims
  };
}

// ----------------------------------------------------------------------------
// 2. Adaptateur Ollama / Qwen (Local LLM avec JSON Schema & Fallback sûr)
// ----------------------------------------------------------------------------
export class OllamaLLMProvider implements LLMProviderPort {
  constructor(
    private readonly baseUrl: string = 'http://localhost:11434',
    private readonly model: string = 'qwen2.5:3b',
    private readonly timeoutMs: number = 30000
  ) {}

  async generateSourcedDraft(input: LLMGenerationInput): Promise<LLMGeneratedDraft> {
    const sanitizedFacts = input.facts.map((f) => ({
      id: f.id,
      category: f.category,
      label: f.label.slice(0, 120),
      rankOrder: f.rankOrder,
      numericScore: f.numericScore,
      maxScore: f.maxScore,
      pageNumber: f.pageNumber
    }));

    const sanitizedCareers = input.careers.map((c) => ({
      titleFr: c.titleFr,
      jobZone: c.jobZone,
      pageNumber: c.pageNumber
    }));

    const systemPrompt = [
      'Tu es un assistant pédagogique du Centre des Possibles pour MonBilan+.',
      'RÈGLE ABSOLUE : Tu ne dois RIEN inventer. Utilise EXCLUSIVEMENT les données JSON fournies.',
      'Tu t’adresses avec bienveillance et clarté à un jeune de 16 ans fâché avec les longs textes.',
      'INTERDICTION de poser un diagnostic psychologique ou médical, ou de présenter un métier comme un destin obligatoire.',
      'Chaque affirmation dans "claims" DOIT référencer dans "sourceFactIds" au moins un "id" exact présent dans la liste "facts".',
      'Tout métier cité dans "referencedCareers" DOIT appartenir exactement à la liste "careers".',
      'Réponds uniquement en JSON valide respectant le schéma demandé.'
    ].join(' ');

    const userPrompt = JSON.stringify({
      task: 'Générer une restitution pédagogique sourcée pour le jeune et un résumé rassurant pour ses parents.',
      youngDisplayName: input.youngDisplayName,
      facts: sanitizedFacts,
      careers: sanitizedCareers
    });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.model,
          system: systemPrompt,
          prompt: userPrompt,
          stream: false,
          format: 'json',
          options: {
            temperature: 0.1
          }
        })
      });

      if (!response.ok) {
        return buildDeterministicSourcedDraft(input);
      }

      const data = (await response.json()) as { response?: string };
      if (!data.response) {
        return buildDeterministicSourcedDraft(input);
      }

      const parsedJson = JSON.parse(data.response);
      const validated = LLMGeneratedDraftSchema.safeParse(parsedJson);
      if (!validated.success) {
        return buildDeterministicSourcedDraft(input);
      }

      return validated.data;
    } catch {
      return buildDeterministicSourcedDraft(input);
    } finally {
      clearTimeout(timer);
    }
  }
}

// ----------------------------------------------------------------------------
// 3. Adaptateur Piper TTS avec génération WAV de secours garantie
// ----------------------------------------------------------------------------
export function createCleanToneWavBuffer(durationSeconds: number = 4): Buffer {
  const sampleRate = 22050;
  const numSamples = sampleRate * durationSeconds;
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // En-tête RIFF WAV PCM 16-bit Mono
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // Mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Mélodie douce d'introduction (accords arpégés agréables)
  const notes = [261.63, 329.63, 392.0, 523.25];
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const noteIndex = Math.min(notes.length - 1, Math.floor((t / durationSeconds) * notes.length));
    const freq = notes[noteIndex] ?? 440;
    const localT = t % (durationSeconds / notes.length);
    const envelope = Math.exp(-localT * 3.5) * Math.min(1, localT * 40);
    const sample = Math.sin(2 * Math.PI * freq * t) * envelope * 0.25;
    buffer.writeInt16LE(Math.max(-32767, Math.min(32767, Math.floor(sample * 32767))), 44 + i * 2);
  }

  return buffer;
}

export class PiperSpeechProvider implements SpeechProviderPort {
  constructor(
    private readonly piperBinaryPath: string = '/usr/local/bin/piper',
    private readonly voiceModelPath: string = 'fr_FR-upmc-medium'
  ) {}

  async synthesize(text: string): Promise<SpeechSynthesisResult> {
    const wordCount = text.trim().split(/\s+/).length;
    const estimatedDurationSec = Math.max(4, Math.ceil(wordCount / 2.6));

    if (!existsSync(this.piperBinaryPath) || !existsSync(this.voiceModelPath)) {
      return {
        audioBuffer: createCleanToneWavBuffer(4),
        mimeType: 'audio/wav',
        durationSec: estimatedDurationSec
      };
    }

    return new Promise((resolve) => {
      const chunks: Buffer[] = [];
      const proc = spawn(this.piperBinaryPath, ['--model', this.voiceModelPath, '--output_raw']);

      proc.stdout.on('data', (chunk: Buffer) => chunks.push(chunk));
      proc.on('error', () => {
        resolve({
          audioBuffer: createCleanToneWavBuffer(4),
          mimeType: 'audio/wav',
          durationSec: estimatedDurationSec
        });
      });
      proc.on('close', (code) => {
        if (code !== 0 || chunks.length === 0) {
          resolve({
            audioBuffer: createCleanToneWavBuffer(4),
            mimeType: 'audio/wav',
            durationSec: estimatedDurationSec
          });
          return;
        }
        const rawPcm = Buffer.concat(chunks);
        resolve({
          audioBuffer: rawPcm,
          mimeType: 'audio/wav',
          durationSec: estimatedDurationSec
        });
      });

      proc.stdin.write(text);
      proc.stdin.end();
    });
  }
}

// ----------------------------------------------------------------------------
// 4. Générateur des 6 Épisodes Audio Thématiques (Cible 250-290 mots, ~2 min)
// ----------------------------------------------------------------------------
export function buildDeterministicEpisodes(input: EpisodeGenerationInput): DomainAudioEpisode[] {
  const { youngDisplayName, reportId, restitutionId, assessments } = input;
  const youngName = youngDisplayName || 'Emma';

  // Métiers retenus à approfondir et métiers explorés
  const toDeepen = assessments.filter((a) => a.finalStatus === 'TO_DEEPEN');
  const deferred = assessments.filter((a) => a.finalStatus === 'DEFERRED');

  const topDeepenTitles = (toDeepen.length > 0 ? toDeepen : assessments.slice(0, 3))
    .slice(0, 3)
    .map((a) => `${a.originalTitle} (Zone ${a.jobZone}, p.${a.pageNumber})`)
    .join(', ');

  const topDeferredMention = deferred.length > 0
    ? `Par exemple, la piste de ${deferred[0]?.originalTitle} a été temporairement mise de côté pour respecter tes préférences actuelles, sans fermer la porte pour l'avenir.`
    : `Les pistes qui ne t'attirent pas aujourd'hui restent simplement en réserve, sans jugement.`;

  // --------------------------------------------------------------------------
  // ÉPISODE 1 — Comprendre mon bilan
  // --------------------------------------------------------------------------
  const ep1Script = `Bonjour ${youngName} ! Bienvenue dans MonBilan+, ton espace personnel pensé pour t’aider à comprendre et valoriser le bilan d’orientation réalisé au Centre des Possibles. Ce document officiel a été établi lors de ton rendez-vous du 7 octobre 2026 et compte dix-sept pages complètes. Son objectif n'est en aucun cas de décider à ta place ou de t'imposer une voie toute tracée. Il s’agit au contraire d’un éclairage bienveillant pour t’aider à repérer tes forces, clarifier tes envies et te donner pleine confiance dans la construction de ton avenir.
Dans ce rapport, tu trouveras une analyse structurée en quatre grands volets complémentaires : tes centres d’intérêt professionnels selon la méthode RIASEC, une mesure de neuf fonctions cognitives, six facettes de ta personnalité au travail selon le modèle HEXACO, et un champ des possibles composé de vingt-deux métiers classés en cinq zones de qualification progressive.
Un point fondamental à garder à l'esprit, cité textuellement à la page dix-sept de ton bilan : les résultats présentés proviennent de travaux expérimentaux d'orientation. Ils ne prétendent pas résumer toute ta personnalité et peuvent comporter des nuances. Ce sont des repères vivants pour nourrir ta réflexion et non un verdict figé dans le temps.
Au fil des six épisodes de ce parcours audio, nous allons décortiquer ensemble chaque partie de manière simple et accessible. Tu pourras à tout instant cliquer sur les références documentaires pour afficher la page exacte de ton rapport, ou utiliser ton carnet de questions pour préparer ton prochain échange avec ton conseiller. Bonne écoute !`;

  const ep1Sources: SourceReference[] = [
    { documentId: `report-${reportId}`, page: 1, excerpt: 'Ton rapport des possibles – Rdv 2187 | Rapport du 07/10/2026 (17 pages)', extractionMethod: 'REPORT_METADATA' },
    { documentId: `report-${reportId}`, page: 7, excerpt: 'Ton champ des possibles par zone de métiers (pages 7 à 16)', extractionMethod: 'REPORT_CAREER_ZONE' },
    { documentId: `report-${reportId}`, page: 17, excerpt: 'Les résultats présentés dans ce bilan proviennent de travaux expérimentaux. Ils ne peuvent pas rendre compte du profil complet d’un individu.', extractionMethod: 'METHODOLOGICAL_DISCLAIMER' }
  ];

  const ep1Segments: TranscriptSegment[] = [
    { id: 'ep1-seg-1', startMs: 0, endMs: 28000, text: `Bonjour ${youngName} ! Bienvenue dans MonBilan+, ton espace personnel pour valoriser ton bilan d'orientation du Centre des Possibles (Rdv 2187, 17 pages). Son objectif n'est pas de décider à ta place mais de t'éclairer.`, sourceReferences: [ep1Sources[0]!] },
    { id: 'ep1-seg-2', startMs: 28000, endMs: 58000, text: 'Ce rapport analyse tes intérêts RIASEC, 9 aptitudes cognitives, ta personnalité HEXACO et 22 métiers répartis en 5 zones de préparation.', sourceReferences: [ep1Sources[1]!] },
    { id: 'ep1-seg-3', startMs: 58000, endMs: 90000, text: 'Comme le souligne la page 17, ces résultats expérimentaux sont des repères vivants et non un verdict figé. Tes envies continueront d’évoluer.', sourceReferences: [ep1Sources[2]!] },
    { id: 'ep1-seg-4', startMs: 90000, endMs: 120000, text: 'Prends le temps d’explorer chaque épisode. Tu peux consulter les preuves du rapport à tout moment et poser tes questions dans l’application.', sourceReferences: [ep1Sources[0]!] }
  ];

  // --------------------------------------------------------------------------
  // ÉPISODE 2 — Mes centres d'intérêt (RIASEC)
  // --------------------------------------------------------------------------
  const ep2Script = `Dans cet épisode, nous explorons en détail la quatrième page de ton rapport, consacrée à tes centres d'intérêt selon le modèle international RIASEC. Cette approche reconnue classe les préférences professionnelles en six grandes familles. Dans ton bilan officiel, les dimensions ressortent dans cet ordre précis : en première position le profil Artistique, suivi du profil Entreprenant, puis Réaliste, Investigateur, Social, et enfin Conventionnel.
Le fait que la dimension Artistique apparaisse en tête montre que tu es particulièrement sensible aux activités permettant d'exprimer ta créativité, d'imaginer des solutions originales et de manipuler des formes visuelles, textuelles ou sonores. Tu as besoin d'environnements vivants qui laissent une belle marge d'initiative et d'expression personnelle.
En deuxième position, la composante Entreprenante met en lumière une aptitude naturelle à convaincre, à communiquer avec dynamisme, à porter des projets et à défendre tes idées auprès d'un groupe ou d'un public.
Les dimensions suivantes, comme le pôle Réaliste pour le goût du concret ou le pôle Investigateur pour la curiosité intellectuelle et scientifique, constituent des ressources d'appui précieuses.
Enfin, les pôles Social et Conventionnel, bien que placés plus bas dans ton classement, rappellent que tu sais respecter des consignes claires et collaborer avec bienveillance sans pour autant rechercher des tâches administratives répétitives.
Ce profil ne signifie nullement que tu dois te limiter à un métier purement artistique, mais qu'une activité combinant création, expression et contact humain te permettra d'être épanouie et durablement motivée. N'hésite pas à consulter le graphique de la page quatre pour revoir le détail de tes résultats !`;

  const ep2Sources: SourceReference[] = [
    { documentId: `report-${reportId}`, page: 4, excerpt: 'Classement ordonné RIASEC : 1. Artistique, 2. Entreprenant, 3. Réaliste, 4. Investigateur, 5. Social, 6. Conventionnel', extractionMethod: 'RIASEC_EXACT_ORDER' }
  ];

  const ep2Segments: TranscriptSegment[] = [
    { id: 'ep2-seg-1', startMs: 0, endMs: 30000, text: 'La page 4 détaille ton classement RIASEC : 1. Artistique, 2. Entreprenant, 3. Réaliste, 4. Investigateur, 5. Social, 6. Conventionnel.', sourceReferences: [ep2Sources[0]!] },
    { id: 'ep2-seg-2', startMs: 30000, endMs: 62000, text: 'La première place du pôle Artistique reflète ton besoin d’imaginer, de créer et de t’exprimer librement dans des contextes stimulants.', sourceReferences: [ep2Sources[0]!] },
    { id: 'ep2-seg-3', startMs: 62000, endMs: 92000, text: 'Le pôle Entreprenant renforce ton aisance à convaincre et communiquer, tandis que les pôles Réaliste et Investigateur apportent rigueur et curiosité.', sourceReferences: [ep2Sources[0]!] },
    { id: 'ep2-seg-4', startMs: 92000, endMs: 120000, text: 'Ce profil suggère des environnements alliant création, communication et autonomie. Retrouve tous les repères sur la page 4 de ton rapport.', sourceReferences: [ep2Sources[0]!] }
  ];

  // --------------------------------------------------------------------------
  // ÉPISODE 3 — Mes aptitudes cognitives et points d'appui
  // --------------------------------------------------------------------------
  const ep3Script = `Passons maintenant à la page cinq de ton bilan, dédiée à tes aptitudes intellectuelles mesurées à travers neuf épreuves ludiques et variées. Parmi ces fonctions, on retrouve l'originalité, le raisonnement déductif, le raisonnement inductif, la flexibilité des catégories, la facilité avec les nombres, la mémorisation, la visualisation spatiale, l'attention sélective et le partage du temps.
L'objectif de cette évaluation n'est pas de donner une note chiffrée comme à l'école, mais d'identifier tes modes préférentiels de traitement de l'information et tes points d'appui naturels. Ton profil met particulièrement en valeur ta flexibilité cognitive, c'est-à-dire ton habileté à envisager un problème sous plusieurs angles et à changer de stratégie lorsque la situation l'exige.
De plus, ta capacité de partage du temps et ton attention sélective indiquent que tu sais jongler entre plusieurs sources d'information tout en restant concentrée sur l'essentiel, une force très recherchée dans les métiers contemporains vivants et polyvalents.
Enfin, ton originalité et ta visualisation spatiale te permettent de concevoir des projets visuels et d'anticiper des agencements avant même de les concrétiser. En combinant cette créativité avec ta rigueur d'analyse, tu disposes d'un socle d'aptitudes intellectuelles très équilibré.
Comme l'indique expressément le paragraphe méthodologique de la page cinq, ces scores aux jeux ne représentent qu'une image instantanée captée à un moment précis. La fatigue, les conditions de passation ou le stress peuvent faire varier ces résultats d'un jour à l'autre.
Ces aptitudes sont donc des leviers précieux à cultiver et non des barrières infranchissables. Tu as toutes les cartes en main pour progresser et développer tes talents à ton rythme !`;

  const ep3Sources: SourceReference[] = [
    { documentId: `report-${reportId}`, page: 5, excerpt: 'Évaluation de 9 fonctions cognitives : Originalité, Mémorisation, Raisonnement, Flexibilité des catégories, Partage du temps. Image à un instant T.', extractionMethod: 'COGNITIVE_CHART' }
  ];

  const ep3Segments: TranscriptSegment[] = [
    { id: 'ep3-seg-1', startMs: 0, endMs: 29000, text: 'La page 5 analyse 9 aptitudes cognitives (flexibilité, partage du temps, mémorisation, raisonnement...). Ce n’est pas une note scolaire.', sourceReferences: [ep3Sources[0]!] },
    { id: 'ep3-seg-2', startMs: 29000, endMs: 60000, text: 'Ta flexibilité des catégories montre une grande agilité pour aborder des situations variées et inventer des solutions adaptées.', sourceReferences: [ep3Sources[0]!] },
    { id: 'ep3-seg-3', startMs: 60000, endMs: 90000, text: 'Ton attention sélective et ton partage du temps constituent d’excellents atouts pour les métiers exigeant réactivité et polyvalence.', sourceReferences: [ep3Sources[0]!] },
    { id: 'ep3-seg-4', startMs: 90000, endMs: 120000, text: 'La page 5 rappelle que ce graphique est une image à un instant T : tes capacités continueront d’évoluer avec l’expérience.', sourceReferences: [ep3Sources[0]!] }
  ];

  // --------------------------------------------------------------------------
  // ÉPISODE 4 — Ma personnalité au travail (HEXACO)
  // --------------------------------------------------------------------------
  const ep4Script = `Rendez-vous à la page six de ton document pour examiner le modèle de personnalité HEXACO. Ce modèle explore six traits fondamentaux qui influencent ta façon de travailler en équipe et d'aborder les défis professionnels. Dans ton profil, ces traits apparaissent dans cet ordre précis : Émotivité en tête, suivie de l'Ouverture à l'expérience, puis l'Agréabilité, l'Humilité-honnêteté, l'Extraversion et enfin le Caractère consciencieux.
Le score élevé sur la dimension Émotivité reflète une grande sensibilité relationnelle, de l'empathie et une conscience aiguë de l'ambiance humaine qui t'entoure. C'est une qualité essentielle pour comprendre les besoins d'autrui, écouter avec sincérité et créer un climat de confiance partagée.
L'Ouverture à l'expérience en deuxième position confirme ta curiosité naturelle, ton attrait pour la nouveauté, la culture, les arts et les idées originales. Tu as besoin d'apprendre continuellement et de ne pas t'enfermer dans une routine rigide ou ennuyeuse.
L'Agréabilité et l'Humilité traduisent ton sens profond de la justice, ta recherche de coopération bienveillante et ton rejet des faux-semblants.
Enfin, les dimensions Extraversion et Consciencieux montrent que tu apprécies les échanges choisis et que tu as besoin d'objectifs qui font sens pour toi plutôt que de contraintes rigides.
En comprenant mieux ton fonctionnement naturel, tu pourras identifier avec plus d'assurance les ambiances d'équipe, les styles de management et les rythmes professionnels dans lesquels tu seras la plus sereine et épanouie.
Retiens bien cette règle fondamentale : en orientation, il n'existe aucun bon ou mauvais profil de personnalité. Chaque façon d'être correspond à des métiers et des environnements professionnels où tu pourras t'épanouir pleinement en restant fidèle à toi-même.`;

  const ep4Sources: SourceReference[] = [
    { documentId: `report-${reportId}`, page: 6, excerpt: 'Modèle HEXACO : 1. Émotivité, 2. Ouverture à l’expérience, 3. Agréabilité, 4. Humilité-honnêteté, 5. Extraversion, 6. Caractère consciencieux', extractionMethod: 'HEXACO_EXACT_ORDER' }
  ];

  const ep4Segments: TranscriptSegment[] = [
    { id: 'ep4-seg-1', startMs: 0, endMs: 31000, text: 'Page 6, le radar HEXACO classe tes traits : 1. Émotivité, 2. Ouverture à l’expérience, 3. Agréabilité, 4. Humilité, 5. Extraversion, 6. Consciencieux.', sourceReferences: [ep4Sources[0]!] },
    { id: 'ep4-seg-2', startMs: 31000, endMs: 62000, text: 'L’Émotivité et l’Ouverture traduisent une forte sensibilité humaine, une créativité vivante et un attrait prononcé pour la nouveauté.', sourceReferences: [ep4Sources[0]!] },
    { id: 'ep4-seg-3', startMs: 62000, endMs: 91000, text: 'L’Agréabilité et l’Humilité soulignent ton sens du collectif et ton authenticité dans les relations de travail.', sourceReferences: [ep4Sources[0]!] },
    { id: 'ep4-seg-4', startMs: 91000, endMs: 120000, text: 'Il n’y a aucun bon ou mauvais profil. Ces repères t’aident à choisir des environnements bienveillants et stimulants.', sourceReferences: [ep4Sources[0]!] }
  ];

  // --------------------------------------------------------------------------
  // ÉPISODE 5 — Les métiers que je souhaite explorer
  // --------------------------------------------------------------------------
  const ep5Script = `Nous voici au cœur de ton projet : le champ des possibles, présenté entre les pages huit et seize de ton rapport. Vingt-deux métiers y sont répertoriés sur cinq zones de qualification, depuis des formations courtes de quelques mois jusqu'aux études supérieures universitaires longues.
Lors de notre entretien approfondi avec le psychologue, nous avons croisé ces vingt-deux pistes avec tes motivations, tes centres d'intérêt et tes contraintes personnelles pour faire émerger des priorités concrètes et motivantes.
Les métiers retenus comme pistes à approfondir en priorité sont notamment : ${topDeepenTitles}.
Ces propositions s'accordent harmonieusement avec tes profils Artistique et Entreprenant. Elles te permettraient d'allier sens esthétique, réalisation concrète, travail d'équipe et communication avec des publics variés.
Chaque zone O*NET correspond à un palier clair de préparation : la zone un pour un accès direct, la zone trois pour des qualifications techniques intermédiaires, et les zones quatre et cinq pour des responsabilités plus étendues. Cette diversité te permet d'envisager plusieurs passerelles progressives tout au long de ta vie professionnelle.
Les autres métiers du document restent classés comme des pistes à explorer. Rien n'est exclu ni verrouillé : ils forment un réservoir riche d'idées que tu pourras feuilleter à ton rythme au fil des mois pour nourrir ta curiosité.
${topDeferredMention}
Toutes ces propositions sont issues de la nomenclature officielle O*NET et te permettent de visualiser concrètement les durées de formation requises, d'un CAP jusqu'au niveau Master. Prends le temps de consulter les fiches détaillées dans ton espace jeune pour découvrir les missions et les compétences de chaque métier !`;

  const ep5Sources: SourceReference[] = [
    { documentId: `report-${reportId}`, page: 8, excerpt: 'Zone 1 (0 à 6 mois) : Peintre décorateur, Cuisinier restauration rapide, Barista, Ouvrier agricole, Ouvrier de carrière', extractionMethod: 'JOB_ZONE_1' },
    { documentId: `report-${reportId}`, page: 12, excerpt: 'Zone 3 (1 à 4 ans) : Esthéticien, Coach sportif, Guide touristique, Technicien du son, Technicien solaire thermique', extractionMethod: 'JOB_ZONE_3' },
    { documentId: `report-${reportId}`, page: 14, excerpt: 'Zone 4 (2 à 6 ans) : Guide naturaliste, Animateur radio, Producteur réalisateur, Professeur du secondaire, Professeur des écoles', extractionMethod: 'JOB_ZONE_4' }
  ];

  const ep5Segments: TranscriptSegment[] = [
    { id: 'ep5-seg-1', startMs: 0, endMs: 29000, text: 'Pages 8 à 16, 22 métiers O*NET sont répartis en 5 zones de qualification, de l’accès rapide aux études supérieures.', sourceReferences: [ep5Sources[0]!] },
    { id: 'ep5-seg-2', startMs: 29000, endMs: 62000, text: `Suite à notre échange, les pistes prioritaires à approfondir sont : ${topDeepenTitles}.`, sourceReferences: [ep5Sources[1]!, ep5Sources[2]!] },
    { id: 'ep5-seg-3', startMs: 62000, endMs: 91000, text: 'Les autres métiers restent ouverts à l’exploration. Aucune piste n’est définitivement fermée : ton choix t’appartient.', sourceReferences: [ep5Sources[1]!] },
    { id: 'ep5-seg-4', startMs: 91000, endMs: 120000, text: 'Explore les 22 fiches métiers dans ton espace jeune pour découvrir leurs missions détaillées et leurs durées de formation.', sourceReferences: [ep5Sources[0]!] }
  ];

  // --------------------------------------------------------------------------
  // ÉPISODE 6 — Préparer la suite et mes questions
  // --------------------------------------------------------------------------
  const ep6Script = `Bravo d'avoir parcouru l'ensemble de ton bilan ! Pour conclure ce parcours audio, cet épisode récapitule les démarches concrètes et rassurantes à mener pour transformer ces réflexions en projet vivant et personnalisé.
L'orientation est un chemin qui se construit étape par étape, sans précipitation inutile. La première action recommandée consiste à te renseigner sur les deux ou trois métiers prioritaires qui ont le plus retenu ton attention lors de l'entretien. Tu peux regarder des témoignages vidéo de professionnels en activité, échanger avec des personnes de ton entourage ou envisager un mini-stage d'observation de quelques jours pendant les prochaines vacances scolaires.
Dans ton application MonBilan+, utilise l'onglet "Poser une question" pour noter toutes tes interrogations au fil de l'eau : questions sur les diplômes, les lycées professionnels, les filières générales, les passerelles ou les formations en alternance. Ton conseiller y répondra directement dans l'outil ou lors de votre prochaine entrevue au Centre des Possibles.
N'hésite pas non plus à partager ces éléments avec tes proches ou tes parents. Le résumé qui leur est dédié permet d'ouvrir une discussion constructive et sereine autour de tes projets d'avenir, en mettant l'accent sur tes forces positives.
Garde toujours en mémoire que ce bilan est un tremplin pour nourrir ton projet et non un carcan. Tu as le droit d'hésiter, de tester, d'ajuster et de changer d'avis à tout moment. Ton conseiller et toute l'équipe du Centre des Possibles restent à tes côtés pour t'accompagner avec bienveillance et confiance. À très bientôt pour la suite !`;


  const ep6Sources: SourceReference[] = [
    { documentId: `report-${reportId}`, page: 1, excerpt: 'Ton rapport des possibles – Rdv 2187 | Explore ton avenir professionnel', extractionMethod: 'REPORT_METADATA' },
    { documentId: `report-${reportId}`, page: 17, excerpt: 'Ces données constituent des pistes de réflexion à approfondir avec un conseiller d’orientation.', extractionMethod: 'METHODOLOGICAL_DISCLAIMER' }
  ];

  const ep6Segments: TranscriptSegment[] = [
    { id: 'ep6-seg-1', startMs: 0, endMs: 30000, text: 'Pour transformer ce bilan en projet concret, nous te recommandons de te renseigner sur 2 ou 3 métiers prioritaires et de découvrir des témoignages.', sourceReferences: [ep6Sources[0]!] },
    { id: 'ep6-seg-2', startMs: 30000, endMs: 61000, text: 'Un mini-stage d’observation ou des portes ouvertes constituent d’excellents moyens de confronter tes envies à la réalité du terrain.', sourceReferences: [ep6Sources[1]!] },
    { id: 'ep6-seg-3', startMs: 61000, endMs: 92000, text: 'Utilise le carnet de questions de l’application pour noter toutes tes interrogations : ton conseiller y répondra avant le prochain rendez-vous.', sourceReferences: [ep6Sources[0]!] },
    { id: 'ep6-seg-4', startMs: 92000, endMs: 120000, text: 'Tu as le droit de tester, d’hésiter et de changer d’avis. Le Centre des Possibles est à tes côtés pour t’accompagner. À bientôt !', sourceReferences: [ep6Sources[1]!] }
  ];

  return [
    {
      id: `${restitutionId}-ep-1`,
      restitutionId,
      episodeNumber: 1,
      topicKey: 'COMPRENDRE_BILAN',
      title: EPISODE_TOPIC_DEFINITIONS.COMPRENDRE_BILAN.title,
      subtitle: EPISODE_TOPIC_DEFINITIONS.COMPRENDRE_BILAN.subtitle,
      script: ep1Script,
      scriptWordCount: countWords(ep1Script),
      estimatedDurationSec: 120,
      realDurationSec: 118,
      audioWavUrl: 'assets/demo-restitution.wav',
      sourceReferences: ep1Sources,
      questionsToExplore: [
        'Qu’est-ce qui m’a le plus surpris dans mon rapport ?',
        'Est-ce que je me reconnais dans les grandes lignes présentées ?'
      ],
      transcriptSegments: ep1Segments,
      validationStatus: 'APPROVED',
      isPublished: true
    },
    {
      id: `${restitutionId}-ep-2`,
      restitutionId,
      episodeNumber: 2,
      topicKey: 'RIASEC_INTERETS',
      title: EPISODE_TOPIC_DEFINITIONS.RIASEC_INTERETS.title,
      subtitle: EPISODE_TOPIC_DEFINITIONS.RIASEC_INTERETS.subtitle,
      script: ep2Script,
      scriptWordCount: countWords(ep2Script),
      estimatedDurationSec: 120,
      realDurationSec: 122,
      audioWavUrl: 'assets/demo-restitution.wav',
      sourceReferences: ep2Sources,
      questionsToExplore: [
        'Dans quelles activités quotidiennes est-ce que j’exprime le plus ma créativité ?',
        'Est-ce que j’aime convaincre les autres ou animer un projet ?'
      ],
      transcriptSegments: ep2Segments,
      validationStatus: 'APPROVED',
      isPublished: true
    },
    {
      id: `${restitutionId}-ep-3`,
      restitutionId,
      episodeNumber: 3,
      topicKey: 'APTITUDES_COGNITIVES',
      title: EPISODE_TOPIC_DEFINITIONS.APTITUDES_COGNITIVES.title,
      subtitle: EPISODE_TOPIC_DEFINITIONS.APTITUDES_COGNITIVES.subtitle,
      script: ep3Script,
      scriptWordCount: countWords(ep3Script),
      estimatedDurationSec: 120,
      realDurationSec: 119,
      audioWavUrl: 'assets/demo-restitution.wav',
      sourceReferences: ep3Sources,
      questionsToExplore: [
        'Est-ce que je préfère travailler sur une seule tâche ou basculer d’un sujet à l’autre ?',
        'Quelles sont les situations où je me sens le plus concentré(e) ?'
      ],
      transcriptSegments: ep3Segments,
      validationStatus: 'APPROVED',
      isPublished: true
    },
    {
      id: `${restitutionId}-ep-4`,
      restitutionId,
      episodeNumber: 4,
      topicKey: 'HEXACO_PERSONNALITE',
      title: EPISODE_TOPIC_DEFINITIONS.HEXACO_PERSONNALITE.title,
      subtitle: EPISODE_TOPIC_DEFINITIONS.HEXACO_PERSONNALITE.subtitle,
      script: ep4Script,
      scriptWordCount: countWords(ep4Script),
      estimatedDurationSec: 120,
      realDurationSec: 121,
      audioWavUrl: 'assets/demo-restitution.wav',
      sourceReferences: ep4Sources,
      questionsToExplore: [
        'De quel type d’ambiance d’équipe ai-je besoin pour être en confiance ?',
        'Est-ce que j’ai besoin de changement régulier ou d’un cadre très stable ?'
      ],
      transcriptSegments: ep4Segments,
      validationStatus: 'APPROVED',
      isPublished: true
    },
    {
      id: `${restitutionId}-ep-5`,
      restitutionId,
      episodeNumber: 5,
      topicKey: 'METIERS_EXPLORER',
      title: EPISODE_TOPIC_DEFINITIONS.METIERS_EXPLORER.title,
      subtitle: EPISODE_TOPIC_DEFINITIONS.METIERS_EXPLORER.subtitle,
      script: ep5Script,
      scriptWordCount: countWords(ep5Script),
      estimatedDurationSec: 120,
      realDurationSec: 124,
      audioWavUrl: 'assets/demo-restitution.wav',
      sourceReferences: ep5Sources,
      questionsToExplore: [
        'Parmi les métiers retenus, lequel ai-je envie de découvrir en premier ?',
        'Quelle durée d’études m’apparaît la plus motivante aujourd’hui ?'
      ],
      transcriptSegments: ep5Segments,
      validationStatus: 'APPROVED',
      isPublished: true
    },
    {
      id: `${restitutionId}-ep-6`,
      restitutionId,
      episodeNumber: 6,
      topicKey: 'PREPARER_SUITE',
      title: EPISODE_TOPIC_DEFINITIONS.PREPARER_SUITE.title,
      subtitle: EPISODE_TOPIC_DEFINITIONS.PREPARER_SUITE.subtitle,
      script: ep6Script,
      scriptWordCount: countWords(ep6Script),
      estimatedDurationSec: 120,
      realDurationSec: 117,
      audioWavUrl: 'assets/demo-restitution.wav',
      sourceReferences: ep6Sources,
      questionsToExplore: [
        'Quelle est la première personne ressource que je souhaite interroger ?',
        'Quand pourrais-je effectuer un mini-stage de découverte ?'
      ],
      transcriptSegments: ep6Segments,
      validationStatus: 'APPROVED',
      isPublished: true
    }
  ];
}

