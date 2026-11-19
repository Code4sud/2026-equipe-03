import React from 'react';
import { SITE_CONFIG } from '@/config/site';
import { Container } from '@/components/ui/Container';
import { DesktopNavigation } from './DesktopNavigation';
import { MobileNavigation } from './MobileNavigation';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#E4E0F5]/80 bg-white/90 backdrop-blur-md">
      <Container className="relative flex h-20 items-center justify-between gap-4">
        <a
          href="#accueil"
          className="flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1B1B62] rounded-xl"
        >
          <img
            src="images/logo.png"
            alt="Logo MonBilan+"
            width={168}
            height={52}
            className="h-11 w-auto object-contain"
          />
          <div className="hidden xl:block">
            <span className="block text-[11px] font-bold tracking-wide text-[#42466B]">
              {SITE_CONFIG.signature}
            </span>
          </div>
        </a>

        <div className="hidden lg:flex items-center gap-2.5">
          <a
            href={SITE_CONFIG.counselorAppUrl}
            className="min-h-11 inline-flex items-center justify-center rounded-full border-2 border-[#6D28D9] bg-white px-4 py-2 text-xs font-bold text-[#0F1035] hover:bg-[#F5F2FF] transition"
          >
            Espace Conseiller
          </a>
          <a
            href={SITE_CONFIG.demoAppUrl}
            className="min-h-11 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#6328E8] via-[#7935F5] to-[#9333EA] px-5 py-2 text-xs font-bold text-white shadow-cta hover:opacity-95 transition"
          >
            Découvrir la démonstration
          </a>
          <DesktopNavigation />
        </div>

        <MobileNavigation />
      </Container>
    </header>
  );
}
