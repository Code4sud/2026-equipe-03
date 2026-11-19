'use client';

import React, { useState } from 'react';
import { MAIN_NAVIGATION, SITE_CONFIG } from '@/config/site';

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="mobile-menu-panel"
        aria-label={isOpen ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation'}
        className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-xl border border-[#D8DCF0] bg-white p-2.5 text-[#0F1035]"
      >
        {isOpen ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div
          id="mobile-menu-panel"
          className="absolute left-0 right-0 top-full z-50 border-b border-[#E4E0F5] bg-white px-4 pt-3 pb-6 shadow-xl"
        >
          <nav aria-label="Menu mobile" className="flex flex-col space-y-2">
            {MAIN_NAVIGATION.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="min-h-11 flex items-center rounded-xl px-4 py-2.5 text-base font-bold text-[#0F1035] hover:bg-[#F5F2FF] hover:text-[#6D28D9]"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 border-t border-[#F0EDFA] flex flex-col gap-2.5">
              <a
                href={SITE_CONFIG.counselorAppUrl}
                onClick={() => setIsOpen(false)}
                className="min-h-11 flex items-center justify-center rounded-full border-2 border-[#6D28D9] px-5 py-2.5 text-sm font-bold text-[#0F1035]"
              >
                Espace Conseiller
              </a>
              <a
                href={SITE_CONFIG.demoAppUrl}
                onClick={() => setIsOpen(false)}
                className="min-h-11 flex items-center justify-center rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] px-5 py-2.5 text-sm font-bold text-white shadow-cta"
              >
                Découvrir la démonstration
              </a>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
