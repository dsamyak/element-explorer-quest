// A simple procedural synthesizer using the Web Audio API
// This avoids needing to load external .mp3 or .wav files.

const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

const playTone = (frequency: number, type: OscillatorType, duration: number, vol = 0.1) => {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

  gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
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
