import React from 'react';
import { MAIN_NAVIGATION, SITE_CONFIG } from '@/config/site';
import { Container } from '@/components/ui/Container';
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

        <nav aria-label="Navigation principale" className="hidden lg:flex items-center gap-1">
          {MAIN_NAVIGATION.map((item, idx) => (
            <a
              key={item.href}
              href={item.href}
              className={
                idx === 0
                  ? 'min-h-10 inline-flex items-center rounded-full bg-[#F3EFFE] px-3.5 py-1.5 text-xs font-extrabold text-[#6D28D9] border-b-2 border-[#6D28D9]'
                  : 'min-h-10 inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold text-[#0F1035] hover:bg-[#F5F2FF] hover:text-[#6D28D9] transition'
              }
            >
              {item.label}
            </a>
          ))}
        </nav>

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
        </div>

        <MobileNavigation />
      </Container>
    </header>
  );
}
