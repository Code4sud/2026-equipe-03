'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MAIN_NAVIGATION } from '@/config/site';

export function DesktopNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative hidden lg:block">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="desktop-menu-panel"
        className="min-h-11 inline-flex items-center gap-2 rounded-full border border-[#E4E0F5] bg-white px-4 py-2 text-xs font-bold text-[#0F1035] shadow-sm hover:border-[#6D28D9] hover:bg-[#F5F2FF] hover:text-[#6D28D9] transition"
      >
        Menu
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.4}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div
          id="desktop-menu-panel"
          className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-[#E4E0F5] bg-white p-3 shadow-xl"
        >
          <nav aria-label="Navigation principale" className="flex flex-col gap-2">
            {MAIN_NAVIGATION.map((item, idx) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={
                  idx === 0
                    ? 'inline-flex items-center rounded-full border border-[#6D28D9] bg-[#F3EFFE] px-4 py-2 text-sm font-extrabold text-[#6D28D9]'
                    : 'inline-flex items-center rounded-full border border-[#E4E0F5] bg-white px-4 py-2 text-sm font-bold text-[#0F1035] hover:border-[#6D28D9] hover:bg-[#F5F2FF] hover:text-[#6D28D9] transition'
                }
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
