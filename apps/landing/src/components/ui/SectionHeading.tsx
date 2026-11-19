import React from 'react';

interface SectionHeadingProps {
  badge?: string;
  title: React.ReactNode;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeading({
  badge,
  title,
  subtitle,
  centered = true
}: SectionHeadingProps) {
  return (
    <div className={`space-y-3 ${centered ? 'text-center mx-auto max-w-3xl' : 'max-w-2xl'}`}>
      {badge && (
        <span className="inline-flex items-center gap-2 rounded-full bg-[#EAE4FF] border border-[#D3C4FF] px-4 py-1.5 text-xs font-extrabold tracking-wide text-[#5B21B6]">
          <span className="inline-block h-2 w-2 rounded-full bg-[#7C3AED]" aria-hidden="true" />
          {badge}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-[#0F1035] leading-[1.15]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base sm:text-lg text-[#42466B] leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
