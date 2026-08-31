import { html, useState, useMemo, useRef, useEffect } from "../html.js";
import { COUNT_CRITTERS, HEB_NUMBERS, PRAISE, TRY_AGAIN, pick, randInt } from "../data.js";
import { audio } from "../audio.js";
import { confetti } from "../confetti.js";

const MIN_MAX = 2;
const MAX_MAX = 10;
const ROUNDS = 10;

export function CountingConfig({ initial, onStart, onBack }) {
  const [max, setMax] = useState(initial.max || 6);

  return html`
    <div class="panel">
      <h2>ספירה והתאמה</h2>
      <p style=${{ textAlign: "center", margin: 0, color: "#6b6693" }}>
        סופרים כמה חיות יש בכרטיס וגוררים את המספר הנכון 🔢
      </p>

      <div>
        <div class="field-label">עד איזה מספר?</div>
        <div class="stepper">
          <button onClick=${() => setMax((m) => Math.max(MIN_MAX, m - 1))} disabled=${max <= MIN_MAX}>−</button>
          <div class="value">${max}</div>
          <button onClick=${() => setMax((m) => Math.min(MAX_MAX, m + 1))} disabled=${max >= MAX_MAX}>+</button>
        </div>
      </div>

      <button
        class="btn-primary"
        onClick=${() => {
          audio.unlock();
          onStart({ max });
        }}
      >
        קדימה! 🎮
      </button>
      <button class="btn-ghost" onClick=${onBack}>חזרה</button>
    </div>
  `;
}

function makeRound(max) {
  return { critter: pick(COUNT_CRITTERS), count: randInt(1, max) };
}

export function CountingGame({ config, onExit, onNewGame }) {
  const max = config.max;
  const [seed, setSeed] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [round, setRound] = useState(() => makeRound(max));
  const [results, setResults] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [overCard, setOverCard] = useState(false);
  const [done, setDone] = useState(false);

  const cardRef = useRef(null);
  const ghostRef = useRef(null);
  const lockRef = useRef(false);
  const mistakeRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => () => {
    clearTimeout(timerRef.current);
    if (ghostRef.current) ghostRef.current.remove();
  }, []);

  function restart() {
    clearTimeout(timerRef.current);
    setRoundIndex(0);
    setResults([]);
    setScore(0);
    setFeedback(null);
    setDone(false);
    mistakeRef.current = false;
    lockRef.current = false;
    setRound(makeRound(max));
    setSeed((s) => s + 1);
  }

  function nextRound() {
    const clean = !mistakeRef.current;
    setResults((r) => [...r, clean]);
    if (clean) setScore((s) => s + 1);
    mistakeRef.current = false;
    lockRef.current = false;
    setFeedback(null);

    if (roundIndex + 1 >= ROUNDS) {
      setDone(true);
      audio.win();
      confetti(60);
      timerRef.current = setTimeout(() => {
        audio.speak("סיימת את כל המשחק! כל הכבוד עמית!");
      }, 400);
    } else {
      setRoundIndex((i) => i + 1);
      setRound(makeRound(max));
    }
  }

  function attempt(value) {
    if (lockRef.current || done) return;
    if (value === round.count) {
      lockRef.current = true;
      setFeedback("correct");
      audio.success();
      confetti(28);
      audio.speak("כן! " + HEB_NUMBERS[round.count]);
      timerRef.current = setTimeout(nextRound, 1100);
    } else {
      mistakeRef.current = true;
      setFeedback("wrong");
      audio.error();
      audio.speak(pick(TRY_AGAIN));
      timerRef.current = setTimeout(() => setFeedback(null), 500);
    }
  }

  // ----- pointer drag -----
  function onTilePointerDown(e, value) {
    if (lockRef.current || done) return;
    const tile = e.currentTarget;
    try {
      tile.setPointerCapture(e.pointerId);
    } catch (err) {}
    const start = { x: e.clientX, y: e.clientY };
    let moved = false;

    const ghost = document.createElement("div");
    ghost.className = "drag-ghost";
    ghost.textContent = value;
    ghost.style.left = e.clientX + "px";
    ghost.style.top = e.clientY + "px";
    document.body.appendChild(ghost);
    ghostRef.current = ghost;
    tile.classList.add("dragging");

    const move = (ev) => {
      ghost.style.left = ev.clientX + "px";
      ghost.style.top = ev.clientY + "px";
      if (Math.hypot(ev.clientX - start.x, ev.clientY - start.y) > 8) moved = true;
      setOverCard(hitCard(ev.clientX, ev.clientY));
    };
    const up = (ev) => {
      tile.removeEventListener("pointermove", move);
      tile.removeEventListener("pointerup", up);
      tile.removeEventListener("pointercancel", up);
      tile.classList.remove("dragging");
      ghost.remove();
      ghostRef.current = null;
      setOverCard(false);
      const onCard = hitCard(ev.clientX, ev.clientY);
      if (onCard || !moved) attempt(value); // drop on card, or a plain tap
    };
    tile.addEventListener("pointermove", move);
    tile.addEventListener("pointerup", up);
    tile.addEventListener("pointercancel", up);
  }

  function hitCard(x, y) {
    const el = cardRef.current;
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }

  const tiles = useMemo(
    () => Array.from({ length: max }, (_, i) => i + 1),
    [max]
  );

  return html`
    <div class="count-wrap">
      <div class="progress-dots">
        ${Array.from({ length: ROUNDS }, (_, i) =>
          html`<span
            key=${i}
            class=${results[i] === true
              ? "done"
              : results[i] === false
              ? "done"
              : i === roundIndex
              ? "current"
              : ""}
          ></span>`
        )}
      </div>

      <div
        ref=${cardRef}
        class=${"count-card" +
        (overCard ? " over" : "") +
        (feedback === "correct" ? " correct" : "") +
        (feedback === "wrong" ? " wrong" : "")}
      >
        ${Array.from({ length: round.count }, (_, i) =>
          html`<span class="critter" key=${i + "-" + seed + "-" + roundIndex}>${round.critter.emoji}</span>`
        )}
      </div>

      <div class="number-tray">
        ${tiles.map(
          (n) => html`
            <div
              key=${n}
              class="num-tile"
              onPointerDown=${(e) => onTilePointerDown(e, n)}
            >
              ${n}
            </div>
          `
        )}
      </div>
    </div>

    ${done &&
    html`
      <div class="overlay">
        <div class="overlay-card">
          <div class="big">${score >= 8 ? "🏆" : "🎉"}</div>
          <h2>סיימת!</h2>
          <p>פתרת ${score} מתוך ${ROUNDS} בלי טעות</p>
          <button class="btn-primary" onClick=${restart}>שוב 🔁</button>
          <div class="row">
            <button class="btn-ghost" onClick=${onNewGame}>משחק חדש</button>
            <button class="btn-ghost" onClick=${onExit}>בית 🏠</button>
          </div>
        </div>
      </div>
    `}
  `;
}
