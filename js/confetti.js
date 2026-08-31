const COLORS = ["#7c5cff", "#17c3b2", "#ff9f45", "#ff6b9d", "#ffd23f", "#2fb457"];

// Spawn a short burst of DOM confetti. Cheap and offline-friendly.
export function confetti(count = 40) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "confetti-piece";
    p.style.left = Math.random() * 100 + "vw";
    p.style.background = COLORS[i % COLORS.length];
    const dur = 1 + Math.random() * 1.2;
    p.style.animationDuration = dur + "s";
    p.style.animationDelay = Math.random() * 0.2 + "s";
    p.style.transform = `translateY(-20px) rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), (dur + 0.5) * 1000);
  }
}
