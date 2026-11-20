import React from 'react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { HeroSection } from '@/components/sections/HeroSection';
import { TwoWaysSection } from '@/components/sections/TwoWaysSection';
import { AudioEpisodesSection } from '@/components/sections/AudioEpisodesSection';
import { ActionJourneySection } from '@/components/sections/ActionJourneySection';
import { HumanCounselorSection } from '@/components/sections/HumanCounselorSection';
import { OrganizationsSection } from '@/components/sections/OrganizationsSection';
import { DemoSection } from '@/components/sections/DemoSection';
import { MethodologySection } from '@/components/sections/MethodologySection';
import { FaqSection } from '@/components/sections/FaqSection';
import { FinalCtaSection } from '@/components/sections/FinalCtaSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-[#0F1035] bg-white">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        {/* Section 1 — Hero */}
        <HeroSection />

        {/* Section 2 — Deux façons de commencer */}
        <TwoWaysSection />

        {/* Section 3 — Comprendre en deux minutes (Épisodes audio) */}
        <AudioEpisodesSection />

        {/* Section 4 — De la compréhension à l'action */}
        <ActionJourneySection />

        {/* Section 5 — Un accompagnement humain */}
        <HumanCounselorSection />

        {/* Section 6 — Pour les structures */}
        <OrganizationsSection />

        {/* Section 7 — Démonstration */}
        <DemoSection />

        {/* Section 8 — Méthodologie et confidentialité */}
        <MethodologySection />

        {/* Section 9 — FAQ */}
        <FaqSection />

        {/* Section 10 — CTA final */}
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
