import React from 'react';
import { HowItWorksStep } from '@/types/landing';

interface StepCardProps {
  step: HowItWorksStep;
  isLast?: boolean;
}

const STEP_IMAGES: Record<number, string> = {
  1: 'images/visuals/step1-boy-laptop.png',
  2: 'images/visuals/step2-tablet-chart.png',
  3: 'images/visuals/step3-career-cards.png',
  4: 'images/visuals/step4-roadmap.png'
};

export function StepCard({ step, isLast = false }: StepCardProps) {
  const imgSrc = STEP_IMAGES[step.stepNumber];

  return (
    <div className="relative flex flex-col justify-between rounded-[26px] bg-white/95 border border-[#E4E0F5] p-6 shadow-card hover:border-[#7935F5] transition">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#3B1D8F] to-[#7935F5] text-white font-extrabold text-base shadow-md">
              {step.stepNumber}
            </span>
            <span className="rounded-full bg-[#F3EFFE] px-3 py-1 text-xs font-bold text-[#6D28D9]">
              {step.badgeText}
            </span>
          </div>
        </div>

        <h3 className="text-lg sm:text-xl font-extrabold text-[#0F1035] mb-2">
          {step.title}
        </h3>
        <p className="text-sm text-[#42466B] leading-relaxed">
          {step.description}
        </p>
      </div>

      {/* Illustration extraite de la maquette Comment ça marche */}
      {imgSrc && (
        <div className="mt-5 pt-3 border-t border-[#F0EDFA] overflow-hidden rounded-2xl">
          <img
            src={imgSrc}
            alt={step.title}
            width={320}
            height={160}
            className="w-full h-36 object-cover rounded-xl"
          />
        </div>
      )}

      {!isLast && (
        <div
          aria-hidden="true"
          className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full bg-white border border-[#D8DCF0] text-[#7935F5] shadow-sm font-black"
        >
          →
        </div>
      )}
    </div>
  );
}
