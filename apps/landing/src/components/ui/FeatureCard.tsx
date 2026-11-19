import React from 'react';
import { FeatureItem } from '@/types/landing';

interface FeatureCardProps {
  feature: FeatureItem;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <article className="rounded-[26px] bg-white/95 border border-[#E4E0F5] p-6 shadow-card flex flex-col justify-between hover:border-[#7935F5] hover:-translate-y-0.5 transition">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F3EFFE] text-[#6D28D9] border border-[#DFD5FD]"
          >
            {feature.icon === 'target' && (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              </svg>
            )}
            {feature.icon === 'briefcase' && (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <rect x="3" y="7" width="18" height="13" rx="2.5" />
                <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            )}
            {feature.icon === 'route' && (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <circle cx="6" cy="18" r="2.5" />
                <circle cx="18" cy="6" r="2.5" />
                <path d="M8.5 18H12a3 3 0 003-3V9a3 3 0 013-3" />
              </svg>
            )}
            {feature.icon === 'headphones' && (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path d="M4 13a8 8 0 0116 0v5a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3" />
                <path d="M4 13h3a2 2 0 012 2v3a2 2 0 01-2 2H6a2 2 0 01-2-2v-5z" />
              </svg>
            )}
            {feature.icon === 'chat' && (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
              </svg>
            )}
            {feature.icon === 'folder' && (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
              </svg>
            )}
            {feature.icon === 'users' && (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
            )}
            {feature.icon === 'shield' && (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            )}
          </div>

          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${
              feature.isOperational
                ? 'bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]'
                : 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
            }`}
          >
            {feature.statusLabel}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-extrabold text-[#0F1035] leading-snug mb-2">
          {feature.title}
        </h3>

        <p className="text-sm text-[#42466B] leading-relaxed">
          {feature.description}
        </p>
      </div>
    </article>
  );
}
