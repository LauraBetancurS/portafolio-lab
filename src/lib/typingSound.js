// Sonido de teclado generado con Web Audio (sin archivos de audio):
// dos "clacks" seguidos, como presionar ctrl y luego Z.
import { getAudioContext } from './audio';

function keyClick(ctx, t, pitch = 1) {
  // Clic agudo: ruido muy corto filtrado
  const length = Math.floor(ctx.sampleRate * 0.04);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const hp = ctx.createBiquadFilter();
  hp.type = 'bandpass';
  hp.frequency.value = 2500 * pitch;
  hp.Q.value = 1.5;
  const clickGain = ctx.createGain();
  clickGain.gain.setValueAtTime(0.35, t);
  clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
  noise.connect(hp).connect(clickGain).connect(ctx.destination);
  noise.start(t);

  // Golpe grave: la tecla tocando fondo
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(180 * pitch, t);
  osc.frequency.exponentialRampToValueAtTime(70, t + 0.05);
  const thudGain = ctx.createGain();
  thudGain.gain.setValueAtTime(0.18, t);
  thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
  osc.connect(thudGain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.07);
}

export function playTypingSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  keyClick(ctx, now, 1);          // ctrl
  keyClick(ctx, now + 0.11, 1.15); // Z
}
