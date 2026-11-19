// ============================================================================
// Types stricts de la Landing Page MonBilan+
// ============================================================================

export interface NavItem {
  label: string;
  href: string;
}

export interface HeroPillar {
  id: string;
  title: string;
  description: string;
  icon: 'target' | 'compass' | 'route' | 'bolt';
}

export interface AudienceCardItem {
  id: string;
  title: string;
  description: string;
  icon: 'cap' | 'users' | 'briefcase' | 'shield';
  href: string;
}

export interface HowItWorksStep {
  stepNumber: number;
  title: string;
  description: string;
  badgeText: string;
  icon: 'clipboard' | 'chart' | 'briefcase' | 'route';
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  statusLabel: 'Opérationnel (Démo)' | 'Prévu (Feuille de route)';
  isOperational: boolean;
  icon: 'target' | 'briefcase' | 'route' | 'headphones' | 'chat' | 'folder' | 'users' | 'shield';
  visualKind: 'bilan' | 'careers' | 'roadmap' | 'audio' | 'questions' | 'documents' | 'counselor' | 'security';
}

export interface ImpactMetricItem {
  id: string;
  value: string;
  label: string;
  sublabel: string;
  icon: 'users' | 'cap' | 'chart' | 'target';
}

export interface EcosystemBenefitCard {
  id: string;
  title: string;
  icon: 'cap' | 'users' | 'building';
  bullets: string[];
}

export interface DeploymentModeCard {
  id: string;
  name: string;
  subtitle: string;
  badgeLabel: string;
  badgeSub?: string;
  recommended?: boolean;
  icon: 'user' | 'cap' | 'building' | 'users';
  features: string[];
  ctaLabel: string;
  ctaHref: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
