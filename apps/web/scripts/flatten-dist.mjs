// ============================================================================
// Script post-build unifié pour .github/workflows/pages.yml
// 1. Aplatit le build Angular dans ../../dist/app/* + génère demo-restitution.wav
// 2. Copie l'export statique Next.js (../../apps/landing/out/*) à la racine ../../dist/*
// Résultat :
//   - https://code4sud.github.io/2026-equipe-03/       -> Landing Page Next.js MonBilan+
//   - https://code4sud.github.io/2026-equipe-03/app/   -> Application Métier Angular (Jeune + Conseiller)
// ============================================================================

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const distRoot = resolve(process.cwd(), '../../dist');
const appDist = resolve(distRoot, 'app');
const browserDir = resolve(appDist, 'browser');

mkdirSync(appDist, { recursive: true });

if (existsSync(browserDir)) {
  cpSync(browserDir, appDist, { recursive: true });
  rmSync(browserDir, { recursive: true, force: true });
}

const appIndex = resolve(appDist, 'index.html');
const app404 = resolve(appDist, '404.html');
if (existsSync(appIndex)) {
  cpSync(appIndex, app404);
}

// Générer le fichier audio WAV démo dans ../../dist/app/assets/
const appAssetsDir = resolve(appDist, 'assets');
mkdirSync(appAssetsDir, { recursive: true });

function buildDemoWav(durationSeconds = 4) {
  const sampleRate = 22050;
  const numSamples = sampleRate * durationSeconds;
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  const notes = [261.63, 329.63, 392.0, 523.25];
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const idx = Math.min(notes.length - 1, Math.floor((t / durationSeconds) * notes.length));
    const freq = notes[idx];
    const localT = t % (durationSeconds / notes.length);
    const env = Math.exp(-localT * 3.5) * Math.min(1, localT * 40);
    const s = Math.sin(2 * Math.PI * freq * t) * env * 0.25;
    buffer.writeInt16LE(Math.max(-32767, Math.min(32767, Math.floor(s * 32767))), 44 + i * 2);
  }
  return buffer;
}

writeFileSync(resolve(appAssetsDir, 'demo-restitution.wav'), buildDemoWav(4));

// Copier l'export statique de la Landing Page Next.js (apps/landing/out) à la racine de ./dist
// en convertissant les chemins "/_next/" en chemins relatifs "./_next/" pour GitHub Pages (/2026-equipe-03/)
const landingOutDir = resolve(process.cwd(), '../landing/out');
if (existsSync(landingOutDir)) {
  cpSync(landingOutDir, distRoot, { recursive: true });

  for (const relHtml of ['index.html', '404.html', 'mentions-legales/index.html', 'confidentialite/index.html']) {
    const htmlPath = resolve(distRoot, relHtml);
    if (existsSync(htmlPath)) {
      const prefix = relHtml.includes('/') ? '../_next/' : './_next/';
      const raw = readFileSync(htmlPath, 'utf-8');
      const patched = raw.replaceAll('/_next/', prefix);
      writeFileSync(htmlPath, patched, 'utf-8');
    }
  }
}

console.log('[MonBilan+ Build] Landing Next.js exported to ./dist and Angular App exported to ./dist/app');
