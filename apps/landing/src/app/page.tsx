import React from 'react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { HeroSection } from '@/components/sections/HeroSection';
import { AudienceSection } from '@/components/sections/AudienceSection';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { DemoSection } from '@/components/sections/DemoSection';
import { ImpactSection } from '@/components/sections/ImpactSection';
import { DeploymentModesSection } from '@/components/sections/DeploymentModesSection';
import { FaqSection } from '@/components/sections/FaqSection';
import { FinalCtaSection } from '@/components/sections/FinalCtaSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <HeroSection />
        <AudienceSection />
        <HowItWorksSection />
        <FeaturesSection />
        <DemoSection />
        <ImpactSection />
        <DeploymentModesSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
