// Sonido de lápiz generado con Web Audio (sin archivos de audio).
// Simula 3 trazos cortos de grafito sobre papel: ruido filtrado
// con una envolvente rápida en cada trazo.

import { getAudioContext } from './audio';

export function playPencilSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Buffer de ruido blanco (0.6 s)
  const length = Math.floor(ctx.sampleRate * 0.6);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  // Filtro: deja pasar el "rasp" del grafito
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = 3200;
  bandpass.Q.value = 0.9;

  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 900;

  // Envolvente: 3 trazos
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  const strokes = [
    { start: 0.0, length: 0.12, level: 0.22 },
    { start: 0.16, length: 0.1, level: 0.18 },
    { start: 0.3, length: 0.16, level: 0.2 },
  ];
  strokes.forEach(({ start, length, level }) => {
    const t = now + start;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(level, t + 0.02);
    gain.gain.linearRampToValueAtTime(level * 0.7, t + length * 0.7);
    gain.gain.linearRampToValueAtTime(0, t + length);
    // el tono sube y baja un poco, como al mover la mano
    bandpass.frequency.setValueAtTime(2600 + Math.random() * 800, t);
    bandpass.frequency.linearRampToValueAtTime(3400 + Math.random() * 900, t + length);
  });

  noise.connect(bandpass).connect(highpass).connect(gain).connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 0.5);
}
