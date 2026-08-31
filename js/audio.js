// Sound effects (synthesized, no files) + Hebrew speech, with a mute toggle
// persisted in localStorage.

const STORE_KEY = "amit-games-muted";

function readMuted() {
  try {
    return localStorage.getItem(STORE_KEY) === "1";
  } catch (e) {
    return false;
  }
}

let muted = readMuted();
let ctx = null;

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) ctx = new AC();
  }
  if (ctx && ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(freq, start, dur, type = "sine", gain = 0.2) {
  const a = ac();
  if (!a) return;
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(g);
  g.connect(a.destination);
  const t0 = a.currentTime + start;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export const audio = {
  isMuted() {
    return muted;
  },
  toggleMute() {
    muted = !muted;
    try {
      localStorage.setItem(STORE_KEY, muted ? "1" : "0");
    } catch (e) {}
    if (muted && window.speechSynthesis) window.speechSynthesis.cancel();
    return muted;
  },
  // call once from a user gesture to unlock audio on iOS
  unlock() {
    ac();
    if (window.speechSynthesis) {
      // touch the API so voices start loading
      window.speechSynthesis.getVoices();
    }
  },
  success() {
    if (muted) return;
    tone(660, 0, 0.12, "triangle", 0.22);
    tone(880, 0.1, 0.16, "triangle", 0.22);
  },
  error() {
    if (muted) return;
    tone(200, 0, 0.18, "sawtooth", 0.15);
  },
  win() {
    if (muted) return;
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.13, 0.22, "triangle", 0.22));
  },
  flip() {
    if (muted) return;
    tone(420, 0, 0.06, "sine", 0.12);
  },
  speak(text) {
    if (muted || !text || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "he-IL";
      u.rate = 0.95;
      u.pitch = 1.1;
      const voices = window.speechSynthesis.getVoices();
      const he = voices.find((v) => (v.lang || "").toLowerCase().startsWith("he"));
      if (he) u.voice = he;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  },
};

if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}
