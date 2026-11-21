// audio.js — a pocket WebAudio synth: three small sounds, no files, no network. A find
// chimes up two notes, a miss buzzes low, and finishing a level plays a short arpeggio.
// Everything is guarded so a browser without audio (or one that has not been unlocked
// by a gesture yet) simply plays the game in silence.

export class Sound {
  constructor() {
    this.ctx = null;
  }

  unlock() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) this.ctx = new AC();
  }

  tone(freq, at, dur, type = 'sine', gain = 0.12) {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime + at;
    const osc = this.ctx.createOscillator();
    const amp = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    amp.gain.setValueAtTime(gain, t0);
    amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(amp).connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  find() {
    this.tone(880, 0, 0.14);
    this.tone(1318, 0.09, 0.22);
  }

  miss() {
    this.tone(160, 0, 0.18, 'square', 0.06);
  }

  level() {
    this.tone(659, 0, 0.16);
    this.tone(880, 0.11, 0.16);
    this.tone(1108, 0.22, 0.3);
  }
}
