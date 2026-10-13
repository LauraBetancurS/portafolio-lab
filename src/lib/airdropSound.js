// Sonido estilo AirDrop generado con Web Audio (sin archivos de audio):
// un "whoosh" suave seguido de dos notas brillantes que suben.
import { getAudioContext } from './audio';

export function playAirdropSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Whoosh: ruido filtrado que barre de grave a agudo
  const length = Math.floor(ctx.sampleRate * 0.35);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const sweep = ctx.createBiquadFilter();
  sweep.type = 'bandpass';
  sweep.Q.value = 1.2;
  sweep.frequency.setValueAtTime(600, now);
  sweep.frequency.exponentialRampToValueAtTime(5000, now + 0.28);
  const whooshGain = ctx.createGain();
  whooshGain.gain.setValueAtTime(0, now);
  whooshGain.gain.linearRampToValueAtTime(0.06, now + 0.12);
  whooshGain.gain.linearRampToValueAtTime(0, now + 0.3);
  noise.connect(sweep).connect(whooshGain).connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 0.35);

  // Dos notas tipo campanita (Mi6 → La6), con un armónico suave
  const notes = [
    { freq: 1318.5, start: 0.14 },
    { freq: 1760, start: 0.24 },
  ];
  notes.forEach(({ freq, start }) => {
    const t = now + start;
    [1, 2].forEach((harmonic, h) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq * harmonic;
      const g = ctx.createGain();
      const peak = h === 0 ? 0.16 : 0.03;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(peak, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
      osc.connect(g).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.5);
    });
  });
}
