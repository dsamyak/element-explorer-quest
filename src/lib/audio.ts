// A simple procedural synthesizer using the Web Audio API
// This avoids needing to load external .mp3 or .wav files.

let audioCtx: AudioContext | null = null;

const getAudioCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

const playTone = (frequency: number, type: OscillatorType, duration: number, vol = 0.1) => {
  const ctx = getAudioCtx();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

  gainNode.gain.setValueAtTime(vol, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);
};

export const playHoverSound = () => {
  playTone(300, 'sine', 0.1, 0.05);
};

export const playClickSound = () => {
  playTone(600, 'square', 0.1, 0.08);
};

export const playCorrectSound = () => {
  playTone(800, 'sine', 0.1, 0.1);
  setTimeout(() => playTone(1200, 'sine', 0.2, 0.1), 100);
};

export const playWrongSound = () => {
  playTone(200, 'sawtooth', 0.1, 0.1);
  setTimeout(() => playTone(150, 'sawtooth', 0.2, 0.1), 100);
};

export const playLevelUpSound = () => {
  playTone(400, 'sine', 0.1, 0.1);
  setTimeout(() => playTone(600, 'sine', 0.1, 0.1), 100);
  setTimeout(() => playTone(800, 'sine', 0.3, 0.15), 200);
};
