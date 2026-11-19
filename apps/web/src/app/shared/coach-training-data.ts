// ============================================================================
// Données et Modèles du Module « Mon Coach IA » — MonBilan+
// Scénarios d'entraînement (Vocal & Texte), Conseils et Feedbacks pédagogiques
// ============================================================================

export type TrainingScenarioId = 'SCENARIO_CALL' | 'SCENARIO_INTERVIEW' | 'SCENARIO_QUESTIONS' | 'SCENARIO_PRESENTATION';

export interface TrainingDialogueStep {
  stepNumber: number;
  coachQuestion: string;
  expectedAspects: string[];
  coachReplyFollowup: string;
}

export interface TrainingScenario {
  id: TrainingScenarioId;
  title: string;
  badgeLabel: string;
  shortDesc: string;
  steps: TrainingDialogueStep[];
  tipsForAnswering: string[]; // Maquette 1
  tipsForSuccess: string[];   // Maquette 2
  defaultFeedback: {
    wellDone: string;
    toImprove: string;
    nextChallenge: string;
  };
}

export const COACH_TRAINING_SCENARIOS: TrainingScenario[] = [
  {
    id: 'SCENARIO_CALL',
    title: 'Appeler une entreprise pour demander une immersion',
    badgeLabel: 'Appel téléphonique',
    shortDesc: 'S’exercer à téléphoner à l’accueil d’une entreprise pour solliciter un stage d’observation.',
    steps: [
      {
        stepNumber: 1,
        coachQuestion: 'Bonjour, vous êtes bien à l’accueil de l’entreprise. Que puis-je faire pour vous ?',
        expectedAspects: ['politesse', 'présentation', 'objet de l’appel'],
        coachReplyFollowup: 'Très bien. Pouvez-vous me préciser la période souhaitée et ce qui vous intéresse dans ce métier ?'
      },
      {
        stepNumber: 2,
        coachQuestion: 'Très bien. Pouvez-vous me préciser la période souhaitée et ce qui vous intéresse dans ce métier ?',
        expectedAspects: ['période réaliste', 'motivation métier', 'convention'],
        coachReplyFollowup: 'D’accord, c’est noté. Avez-vous une convention de stage délivrée par votre école ou organisme ?'
      },
      {
        stepNumber: 3,
        coachQuestion: 'D’accord, c’est noté. Avez-vous une convention de stage délivrée par votre école ou organisme ?',
        expectedAspects: ['convention officielle', 'Centre des Possibles / Mission Locale'],
        coachReplyFollowup: 'Parfait ! Pouvez-vous me laisser vos coordonnées pour que le responsable vous recontacte ?'
      },
      {
        stepNumber: 4,
        coachQuestion: 'Parfait ! Pouvez-vous me laisser vos coordonnées pour que le responsable vous recontacte ?',
        expectedAspects: ['nom et prénom', 'téléphone ou email', 'remerciements'],
        coachReplyFollowup: 'C’est parfait, je transmets tout de suite votre demande. Bonne journée à vous !'
      }
    ],
    tipsForAnswering: [
      'Présente-toi en quelques phrases (prénom, parcours, ce que tu fais actuellement).',
      'Explique ce qui t’attire dans ce métier (ce qui t’attire, ce que tu aimerais découvrir).',
      'Parle clairement, sans chercher la réponse parfaite (sois naturel(le) et sincère).'
    ],
    tipsForSuccess: [
      'Parle calmement et distinctement.',
      'Sois poli(e) et courtois(e).',
      'Donne les informations principales (métier, période, durée).',
      'Note les réponses de ton interlocuteur.'
    ],
    defaultFeedback: {
      wellDone: 'Tu t’es présenté(e) clairement et tu as bien expliqué l’objectif de ton appel.',
      toImprove: 'Précise la période souhaitée et demande à qui adresser ta convention de stage.',
      nextChallenge: 'Recommence en essayant de présenter ta demande en moins d’une minute.'
    }
  },
  {
    id: 'SCENARIO_INTERVIEW',
    title: 'Passer un entretien de présentation',
    badgeLabel: 'Entretien',
    shortDesc: 'Se présenter en personne ou en visio face à un responsable ou maître d’apprentissage.',
    steps: [
      {
        stepNumber: 1,
        coachQuestion: 'Bonjour ! Pouvez-vous vous présenter et expliquer pourquoi ce métier vous intéresse ?',
        expectedAspects: ['présentation personnelle', 'centres d’intérêt', 'motivation concrète'],
        coachReplyFollowup: 'Merci. Quelles sont vos qualités ou forces qui vous semblent utiles pour ce poste ?'
      },
      {
        stepNumber: 2,
        coachQuestion: 'Merci. Quelles sont vos qualités ou forces qui vous semblent utiles pour ce poste ?',
        expectedAspects: ['sens du détail', 'habileté manuelle', 'ponctualité'],
        coachReplyFollowup: 'Très bien. Qu’aimeriez-vous observer ou apprendre en priorité pendant ces quelques jours ?'
      },
      {
        stepNumber: 3,
        coachQuestion: 'Très bien. Qu’aimeriez-vous observer ou apprendre en priorité pendant ces quelques jours ?',
        expectedAspects: ['curiosité', 'outils professionnels', 'organisation du chantier'],
        coachReplyFollowup: 'Avez-vous des questions à me poser sur l’entreprise ou le fonctionnement de l’équipe ?'
      },
      {
        stepNumber: 4,
        coachQuestion: 'Avez-vous des questions à me poser sur l’entreprise ou le fonctionnement de l’équipe ?',
        expectedAspects: ['question pertinente', 'intérêt pour l’équipe'],
        coachReplyFollowup: 'C’était un très bon échange. Nous ferons le point sur les dates possibles très prochainement.'
      }
    ],
    tipsForAnswering: [
      'Présente-toi de façon positive en citant ton accompagnement au Centre des Possibles.',
      'Cite un exemple concret de ce qui te plaît dans la création ou le travail manuel.',
      'Montre ton envie d’apprendre et ton sérieux.'
    ],
    tipsForSuccess: [
      'Regarde ton interlocuteur avec bienveillance.',
      'Respire avant de répondre si tu hésites.',
      'N’aie pas peur de dire que tu viens pour découvrir.'
    ],
    defaultFeedback: {
      wellDone: 'Tu t’es présenté(e) de façon claire et polie, avec un ton très naturel.',
      toImprove: 'Ajoute un exemple concret de ce qui t’attire dans ce métier.',
      nextChallenge: 'Réessaie en parlant aussi de ce que tu aimerais découvrir pendant l’immersion.'
    }
  },
  {
    id: 'SCENARIO_QUESTIONS',
    title: 'Répondre aux questions d’un professionnel',
    badgeLabel: 'Questions / Réponses',
    shortDesc: 'S’entraîner à répondre aux questions courantes sur son parcours et ses disponibilités.',
    steps: [
      {
        stepNumber: 1,
        coachQuestion: 'Pouvez-vous me dire comment vous avez découvert notre atelier et ce qui vous a donné envie de postuler ?',
        expectedAspects: ['découverte territoriale', 'recherche active', 'envie de terrain'],
        coachReplyFollowup: 'Très bien. Avez-vous déjà fait des stages ou des activités manuelles par le passé ?'
      },
      {
        stepNumber: 2,
        coachQuestion: 'Très bien. Avez-vous déjà fait des stages ou des activités manuelles par le passé ?',
        expectedAspects: ['expériences réelles', 'projets personnels', 'franchise'],
        coachReplyFollowup: 'Comment comptez-vous venir chaque matin jusqu’à nos locaux ?'
      },
      {
        stepNumber: 3,
        coachQuestion: 'Comment comptez-vous venir chaque matin jusqu’à nos locaux ?',
        expectedAspects: ['transports', 'ponctualité', 'autonomie'],
        coachReplyFollowup: 'Parfait. Êtes-vous prêt(e) à respecter les consignes d’hygiène et de sécurité sur le chantier ?'
      },
      {
        stepNumber: 4,
        coachQuestion: 'Parfait. Êtes-vous prêt(e) à respecter les consignes d’hygiène et de sécurité sur le chantier ?',
        expectedAspects: ['sécurité', 'port des EPI', 'écoute'],
        coachReplyFollowup: 'Excellent. Votre sérieux est très appréciable. On se recontacte pour finaliser la convention.'
      }
    ],
    tipsForAnswering: [
      'Sois honnête sur ton parcours : on ne te demande pas d’être déjà un expert !',
      'Mets en avant ta ponctualité et ta curiosité.',
      'Explique comment tu te déplaces (tram, bus, train).'
    ],
    tipsForSuccess: [
      'Écoute la question jusqu’au bout avant de démarrer.',
      'Prends deux secondes pour structurer ta réponse.',
      'Conclus chaque réponse par une phrase claire.'
    ],
    defaultFeedback: {
      wellDone: 'Tu as répondu avec sincérité et tes explications sur la logistique étaient très claires.',
      toImprove: 'Mentionne ton projet de formation après le stage pour montrer ta vision d’avenir.',
      nextChallenge: 'Entraîne-toi à poser toi-même une question en retour au professionnel.'
    }
  },
  {
    id: 'SCENARIO_PRESENTATION',
    title: 'Présenter ce que j’ai appris pendant mon immersion',
    badgeLabel: 'Bilan d’expérience',
    shortDesc: 'Restituer son stage à son conseiller ou lors d’un entretien d’orientation.',
    steps: [
      {
        stepNumber: 1,
        coachQuestion: 'Bonjour ! Comment s’est passée votre semaine d’immersion ? Quelles ont été vos principales activités ?',
        expectedAspects: ['bilan global', 'activités observées', 'gestes découverts'],
        coachReplyFollowup: 'Qu’est-ce qui vous a le plus surpris ou plu dans le quotidien de cette profession ?'
      },
      {
        stepNumber: 2,
        coachQuestion: 'Qu’est-ce qui vous a le plus surpris ou plu dans le quotidien de cette profession ?',
        expectedAspects: ['aspect positif', 'réalité du métier', 'ambiance d’équipe'],
        coachReplyFollowup: 'Avez-vous rencontré des difficultés ou des aspects plus physiques qui vous ont fait hésiter ?'
      },
      {
        stepNumber: 3,
        coachQuestion: 'Avez-vous rencontré des difficultés ou des aspects plus physiques qui vous ont fait hésiter ?',
        expectedAspects: ['lucidité', 'difficultés surmontées', 'recul'],
        coachReplyFollowup: 'Après ce stage, souhaitez-vous vous orienter vers cette voie ou explorer un autre domaine ?'
      },
      {
        stepNumber: 4,
        coachQuestion: 'Après ce stage, souhaitez-vous vous orienter vers cette voie ou explorer un autre domaine ?',
        expectedAspects: ['choix d’orientation', 'suite du parcours', 'CFA ou lycée pro'],
        coachReplyFollowup: 'Bravo pour cette prise de recul. Cette expérience est un atout précieux pour ton avenir !'
      }
    ],
    tipsForAnswering: [
      'Appuie-toi sur les notes de ton carnet d’observation.',
      'Parle de ce qui t’a plu mais aussi de ce qui était plus difficile : c’est une preuve de maturité.',
      'Explique en quoi cela t’aide pour ton choix d’orientation.'
    ],
    tipsForSuccess: [
      'Garde une posture fière de ce que tu as accompli.',
      'Cite un geste professionnel précis que tu as observé.',
      'Termine par tes prochaines démarches.'
    ],
    defaultFeedback: {
      wellDone: 'Superbe capacité d’analyse ! Tu as su expliquer concrètement ce que le stage t’a apporté.',
      toImprove: 'N’hésite pas à citer le nom des outils ou des techniques précises observées.',
      nextChallenge: 'Partage ce bilan avec ton conseiller pour préparer ton inscription en formation.'
    }
  }
];
