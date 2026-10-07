/**
 * AUDIO ENGINE — PROCEDURAL WEB AUDIO SYNTHESIZER
 * Zero external audio assets required.
 * STRICTLY MUTED BY DEFAULT.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false; // MUST BE OFF BY DEFAULT as per specification
    this.masterGain = null;
    this.ambientDrone = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.enabled ? 0.3 : 0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.initialized = true;
    } catch (e) {
      console.warn("Web Audio not supported or blocked", e);
    }
  }

  toggle() {
    this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    this.enabled = !this.enabled;
    const now = this.ctx.currentTime;
    
    if (this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(this.enabled ? 0.35 : 0, now + 0.1);
    }

    if (this.enabled) {
      this.startSubtleAmbient();
      this.playClick();
    } else {
      this.stopSubtleAmbient();
    }

    return this.enabled;
  }

  startSubtleAmbient() {
    if (!this.ctx || !this.enabled || this.ambientDrone) return;
    try {
      // Extremely low, warm background atmospheric drone (48Hz root + 72Hz fifth)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const droneGain = this.ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(48, this.ctx.currentTime);

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(72, this.ctx.currentTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(160, this.ctx.currentTime);

      droneGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      droneGain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 3);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(this.masterGain);

      osc1.start();
      osc2.start();

      this.ambientDrone = { osc1, osc2, droneGain };
    } catch (e) {}
  }

  stopSubtleAmbient() {
    if (!this.ambientDrone || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      this.ambientDrone.droneGain.gain.linearRampToValueAtTime(0.0001, now + 0.5);
      setTimeout(() => {
        if (this.ambientDrone) {
          try {
            this.ambientDrone.osc1.stop();
            this.ambientDrone.osc2.stop();
          } catch (e) {}
          this.ambientDrone = null;
        }
      }, 550);
    } catch (e) {
      this.ambientDrone = null;
    }
  }

  // Initial cinematic boot tone (called only if audio is toggled on during intro)
  playIntroSequence() {
    if (!this.ctx || !this.enabled) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(65, now);
      osc.frequency.exponentialRampToValueAtTime(130, now + 2.5);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(200, now);
      filter.frequency.exponentialRampToValueAtTime(600, now + 2.5);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 3.1);
    } catch (e) {}
  }

  // Micro-interaction hover tick
  playHover() {
    if (!this.ctx || !this.enabled) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.03);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }

  // Crisp tactile click
  playClick() {
    if (!this.ctx || !this.enabled) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.06);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  // Cinematic camera swoosh / building transition
  playTransition() {
    if (!this.ctx || !this.enabled) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.4);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.9);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(300, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.95);
    } catch (e) {}
  }
}

export const sound = new SoundEngine();
