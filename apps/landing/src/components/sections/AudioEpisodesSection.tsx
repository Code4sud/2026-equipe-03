'use client';

import React, { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AUDIO_EPISODES_PREVIEW, AudioEpisodeItem } from '@/data/landing-content';
import { Icon } from '@/components/ui/Icon';
import { SITE_CONFIG } from '@/config/site';

export function AudioEpisodesSection() {
  const [selectedEpisode, setSelectedEpisode] = useState<AudioEpisodeItem>(AUDIO_EPISODES_PREVIEW[1]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<'1.0x' | '1.25x' | '1.5x'>('1.0x');
  const [showFullTranscript, setShowFullTranscript] = useState(false);

  return (
    <section id="audios" aria-labelledby="audio-episodes-heading" className="py-14 lg:py-20 bg-[#F8F7FF] relative overflow-hidden">
      {/* Halo d'arrière-plan */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-[#C084FC]/15 rounded-full blur-3xl pointer-events-none" />

      <Container>
        <SectionHeading
          badge="Restitution Pédagogique 2 min"
          title="Comprendre en deux minutes"
          subtitle="MonBilan+ transforme les 17 pages d'un bilan d'orientation en 5 épisodes audio clairs et bienveillants, conçus pour retenir l'essentiel sans jargon."
          centered
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mt-10 lg:mt-14 items-start">

          {/* LISTE DES 5 ÉPISODES (5 colonnes) */}
          <div className="lg:col-span-5 space-y-3">
            <p className="text-xs font-black uppercase tracking-wider text-[#6D28D9] mb-2">
              Les 5 épisodes clés de ton bilan :
            </p>

            {AUDIO_EPISODES_PREVIEW.map((ep) => (
              <button
                key={ep.id}
                type="button"
                onClick={() => {
                  setSelectedEpisode(ep);
                  setIsPlaying(false);
                }}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between gap-3 ${
                  selectedEpisode.id === ep.id
                    ? 'border-[#7C3AED] bg-white shadow-md'
                    : 'border-[#E4E0F5] bg-white/70 hover:bg-white hover:border-[#C4B5FD]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                      selectedEpisode.id === ep.id
                        ? 'bg-[#7C3AED] text-white shadow-xs'
                        : 'bg-[#EDE9FE] text-[#6D28D9]'
                    }`}
                  >
                    {ep.number}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#0F1035] leading-tight">
                      {ep.title}
                    </h4>
                    <span className="text-[11px] text-[#555A8A]">{ep.subtitle}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-bold text-[#6D28D9] block">{ep.duration}</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                    Vérifié
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* APERÇU DU LECTEUR AUDIO AVEC TRANSCRIPTION (7 colonnes) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#E4E0F5] space-y-6">

            {/* En-tête du lecteur */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0EDFA]">
              <div className="space-y-1">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-[#EDE9FE] text-[#6D28D9]">
                  Épisode {selectedEpisode.number} sur 5
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#0F1035]">
                  {selectedEpisode.title}
                </h3>
                <p className="text-xs text-[#555A8A] font-semibold">
                  Source documentaire : <span className="font-bold text-[#6D28D9]">{selectedEpisode.pageRef}</span>
                </p>
              </div>

              {/* Sélecteur de vitesse accessible */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#F4F2FF] p-1 rounded-xl text-xs font-bold text-[#42466B]">
                {(['1.0x', '1.25x', '1.5x'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpeed(s)}
                    className={`px-2 py-1 rounded-lg transition ${
                      speed === s ? 'bg-white text-[#7C3AED] shadow-2xs font-black' : 'hover:text-[#0F1035]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Barre de contrôle du lecteur */}
            <div className="bg-[#FAF8FF] p-4 sm:p-5 rounded-2xl border border-[#EDE9FE] space-y-3">
              <div className="flex items-center gap-4">
                {/* Bouton Play / Pause accessible */}
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? 'Mettre en pause' : 'Écouter l’épisode'}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-[#6328E8] to-[#9333EA] text-white flex items-center justify-center text-lg shadow-md hover:scale-105 active:scale-95 transition shrink-0"
                >
                  <Icon name={isPlaying ? 'pause' : 'play'} />
                </button>

                {/* Barre de progression avec indicateur de temps */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#42466B]">
                    <span>{isPlaying ? '00:45' : '00:00'}</span>
                    <span className="text-[11px] font-medium text-[#7C3AED]">Synthèse vocale certifiée</span>
                    <span>{selectedEpisode.duration}</span>
                  </div>
                  <div className="w-full bg-[#E4E0F5] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] h-full rounded-full transition-all duration-300"
                      style={{ width: isPlaying ? '35%' : '0%' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Transcription textuelle accessible */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#0F1035] flex items-center gap-1.5">
                  <Icon name="file-text" />
                  <span>Transcription écrite synchronisée</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowFullTranscript(!showFullTranscript)}
                  className="text-xs font-bold text-[#7C3AED] hover:underline"
                >
                  {showFullTranscript ? 'Réduire' : 'Afficher en entier'}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs sm:text-sm text-[#334155] leading-relaxed space-y-2">
                <p className="font-medium">
                  {selectedEpisode.scriptExcerpt}
                </p>
                {showFullTranscript && (
                  <p className="pt-2 border-t border-[#E2E8F0] text-[#64748B]">
                    {selectedEpisode.summary} Cette explication a été formalisée selon le barème du Centre des Possibles et validée par le conseiller d'orientation avant publication.
                  </p>
                )}
              </div>
            </div>

            {/* Avertissement déontologique obligatoire */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <span className="text-base font-bold text-amber-700 shrink-0">ℹ</span>
              <p className="leading-snug font-medium">
                <strong>Règle de rigueur méthodologique :</strong> Les contenus personnalisés sont strictement fondés sur les données du rapport original et systématiquement validés par un professionnel avant mise en ligne.
              </p>
            </div>

            {/* CTA d'accès démo */}
            <div className="pt-1 text-center sm:text-left">
              <a
                href={SITE_CONFIG.demoAppUrl}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#7C3AED] hover:text-[#6328E8] transition"
              >
                <span>Écouter la restitution complète dans la démonstration</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>

          </div>

        </div>
      </Container>
    </section>
  );
}
