import React from 'react';
import { FEATURES_GRID } from '@/data/landing-content';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FeatureCard } from '@/components/ui/FeatureCard';

export function FeaturesSection() {
  return (
    <section
      id="fonctionnalites"
      aria-labelledby="features-title"
      className="py-16 lg:py-24 bg-gradient-to-b from-[#F3EFFE] via-[#F8F7FF] to-[#FFFFFF]"
    >
      <Container className="space-y-12">
        <SectionHeading
          badge="8 briques complémentaires"
          title={
            <>
              Des fonctionnalités pensées pour{' '}
              <span className="text-[#6D28D9]">ton orientation</span> et ton employabilité
            </>
          }
          subtitle="Une plateforme complète, simple et vérifiable qui prolonge l’entretien de restitution du Centre des Possibles."
        />

        {/* Grille 4x2 fidèle à la maquette Fonctionnalités */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES_GRID.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </Container>
    </section>
  );
}
