import React from 'react';

interface PrimaryButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline-white';
  className?: string;
}

export function PrimaryButton({
  href,
  children,
  variant = 'primary',
  className = ''
}: PrimaryButtonProps) {
  const base =
    'min-h-[46px] inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3 text-sm sm:text-base font-bold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B62]';

  const styles =
    variant === 'primary'
      ? 'bg-gradient-to-r from-[#6328E8] via-[#7935F5] to-[#9333EA] text-white shadow-cta hover:opacity-95'
      : variant === 'secondary'
      ? 'bg-white text-[#1B1B62] border-2 border-[#D8DCF0] hover:border-[#7935F5] hover:bg-[#F8F7FF] shadow-sm'
      : 'bg-white text-[#5B21B6] hover:bg-[#F5F3FF] shadow-md';

  return (
    <a href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </a>
  );
}
