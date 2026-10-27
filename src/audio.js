let ctx = null;

export function ringBell() {
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  const start = ctx.currentTime;
  [[523, 0.5], [1046, 0.3], [1568, 0.16], [2093, 0.08]].forEach(([freq, volume], i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = freq * (1 + i * 0.002);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(volume * 0.3, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 3);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 3.1);
  });
}
