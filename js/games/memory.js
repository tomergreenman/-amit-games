import { html, useState, useMemo, useEffect, useRef } from "../html.js";
import { useBestGrid } from "../grid.js";
import { MEMORY_SUBJECTS, shuffle, pick } from "../data.js";
import { audio } from "../audio.js";
import { confetti } from "../confetti.js";
import { PRAISE } from "../data.js";

const MIN_PAIRS = 4;
const MAX_PAIRS = 20;

export function MemoryConfig({ initial, onStart, onBack }) {
  const [pairs, setPairs] = useState(initial.pairs || 6);
  const [subjectId, setSubjectId] = useState(initial.subjectId || "animals");

  return html`
    <div class="panel">
      <h2>משחק זיכרון</h2>

      <div>
        <div class="field-label">כמה זוגות?</div>
        <div class="stepper">
          <button onClick=${() => setPairs((p) => Math.max(MIN_PAIRS, p - 1))} disabled=${pairs <= MIN_PAIRS}>−</button>
          <div class="value">${pairs}</div>
          <button onClick=${() => setPairs((p) => Math.min(MAX_PAIRS, p + 1))} disabled=${pairs >= MAX_PAIRS}>+</button>
        </div>
      </div>

      <div>
        <div class="field-label">איזה תמונות?</div>
        <div class="chips">
          ${MEMORY_SUBJECTS.map(
            (s) => html`
              <button
                key=${s.id}
                class=${"chip" + (s.id === subjectId ? " selected" : "")}
                onClick=${() => setSubjectId(s.id)}
              >
                <span class="chip-emoji">${s.emoji}</span>
                <span>${s.label}</span>
              </button>
            `
          )}
        </div>
      </div>

      <button
        class="btn-primary"
        onClick=${() => {
          audio.unlock();
          onStart({ pairs, subjectId });
        }}
      >
        קדימה! 🎮
      </button>
      <button class="btn-ghost" onClick=${onBack}>חזרה</button>
    </div>
  `;
}

function buildDeck(pairs, subjectId) {
  const subject = MEMORY_SUBJECTS.find((s) => s.id === subjectId) || MEMORY_SUBJECTS[0];
  const count = Math.min(pairs, subject.cards.length);
  const chosen = shuffle(subject.cards).slice(0, count);
  const doubled = [];
  chosen.forEach((card, idx) => {
    const key = subject.isColor ? card.key : card;
    for (let n = 0; n < 2; n++) {
      doubled.push({
        uid: key + "-" + n + "-" + idx,
        key,
        isColor: !!subject.isColor,
        card,
      });
    }
  });
  return shuffle(doubled);
}

export function MemoryGame({ config, onExit, onNewGame }) {
  const [seed, setSeed] = useState(0);
  const deck = useMemo(() => buildDeck(config.pairs, config.subjectId), [config, seed]);
  const pairCount = deck.length / 2;

  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState({});
  const [busy, setBusy] = useState(false);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  function reset() {
    clearTimeout(timer.current);
    setFlipped([]);
    setMatched({});
    setBusy(false);
    setMoves(0);
    setWon(false);
  }

  function playAgain() {
    reset();
    setSeed((s) => s + 1);
  }

  function handleFlip(i) {
    const c = deck[i];
    if (busy || won || matched[c.key] || flipped.includes(i)) return;
    audio.flip();

    const next = [...flipped, i];
    setFlipped(next);
    if (next.length < 2) return;

    setBusy(true);
    setMoves((m) => m + 1);
    const [a, b] = next;

    if (deck[a].key === deck[b].key) {
      timer.current = setTimeout(() => {
        const nm = { ...matched, [deck[a].key]: true };
        setMatched(nm);
        setFlipped([]);
        setBusy(false);
        if (Object.keys(nm).length === pairCount) {
          setWon(true);
          audio.win();
          confetti(60);
          audio.speak("כל הכבוד עמית! מצאת את כל הזוגות!");
        } else {
          audio.success();
          if (Math.random() < 0.4) audio.speak(pick(PRAISE));
        }
      }, 450);
    } else {
      timer.current = setTimeout(() => {
        setFlipped([]);
        setBusy(false);
        audio.flip();
      }, 950);
    }
  }

  const grid = useBestGrid(deck.length);

  return html`
    <div
      class="memory-board"
      style=${{ "--cols": grid.cols, "--rows": grid.rows, "--fs": grid.fs + "px" }}
    >
      ${deck.map((c, i) => {
        const show = flipped.includes(i) || matched[c.key];
        return html`
          <div
            key=${c.uid}
            class=${"mcard" + (show ? " flipped" : "") + (matched[c.key] ? " matched" : "")}
            onClick=${() => handleFlip(i)}
          >
            <div class="mcard-inner">
              <div class="mcard-face mcard-back">★</div>
              <div class="mcard-face mcard-front">
                ${c.isColor
                  ? html`<div class="swatch" style=${{ background: c.card.color }}></div>`
                  : html`<span>${c.card}</span>`}
              </div>
            </div>
          </div>
        `;
      })}
    </div>

    ${won &&
    html`
      <div class="overlay">
        <div class="overlay-card">
          <div class="big">🎉</div>
          <h2>כל הכבוד!</h2>
          <p>מצאת את כל ${pairCount} הזוגות ב-${moves} תורות</p>
          <button class="btn-primary" onClick=${playAgain}>שוב 🔁</button>
          <div class="row">
            <button class="btn-ghost" onClick=${onNewGame}>משחק חדש</button>
            <button class="btn-ghost" onClick=${onExit}>בית 🏠</button>
          </div>
        </div>
      </div>
    `}
  `;
}
