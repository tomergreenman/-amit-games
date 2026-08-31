import { html, React, useState } from "./html.js";
import { audio } from "./audio.js";
import { MemoryConfig, MemoryGame } from "./games/memory.js";
import { CountingConfig, CountingGame } from "./games/counting.js";

function Header({ title, onBack, muted, onToggleMute }) {
  return html`
    <div class="header">
      ${onBack
        ? html`<button class="icon-btn" onClick=${onBack} aria-label="חזרה">↩︎</button>`
        : html`<span style=${{ width: "52px" }}></span>`}
      <h1>${title}</h1>
      <button class="icon-btn" onClick=${onToggleMute} aria-label="קול">
        ${muted ? "🔇" : "🔊"}
      </button>
    </div>
  `;
}

function Home({ onPick }) {
  return html`
    <div class="home-grid">
      <button class="game-tile" onClick=${() => onPick("memory")}>
        <span class="emoji">🧠</span>
        <span class="label">משחק זיכרון</span>
        <span class="sub">מוצאים זוגות של תמונות</span>
      </button>
      <button class="game-tile" onClick=${() => onPick("counting")}>
        <span class="emoji">🔢</span>
        <span class="label">ספירה והתאמה</span>
        <span class="sub">סופרים חיות וגוררים מספר</span>
      </button>
    </div>
  `;
}

function App() {
  const [screen, setScreen] = useState("home");
  const [muted, setMuted] = useState(audio.isMuted());
  const [memoryCfg, setMemoryCfg] = useState({ pairs: 6, subjectId: "animals" });
  const [countingCfg, setCountingCfg] = useState({ max: 6 });

  function toggleMute() {
    audio.unlock();
    setMuted(audio.toggleMute());
  }

  let title = "המשחקים של עמית";
  let back = null;
  let body = null;

  if (screen === "home") {
    body = html`<${Home}
      onPick=${(g) => {
        audio.unlock();
        setScreen(g === "memory" ? "memory-config" : "counting-config");
      }}
    />`;
  } else if (screen === "memory-config") {
    title = "משחק זיכרון";
    back = () => setScreen("home");
    body = html`<${MemoryConfig}
      initial=${memoryCfg}
      onBack=${() => setScreen("home")}
      onStart=${(cfg) => {
        setMemoryCfg(cfg);
        setScreen("memory-play");
      }}
    />`;
  } else if (screen === "memory-play") {
    title = "משחק זיכרון";
    back = () => setScreen("memory-config");
    body = html`<${MemoryGame}
      config=${memoryCfg}
      onNewGame=${() => setScreen("memory-config")}
      onExit=${() => setScreen("home")}
    />`;
  } else if (screen === "counting-config") {
    title = "ספירה והתאמה";
    back = () => setScreen("home");
    body = html`<${CountingConfig}
      initial=${countingCfg}
      onBack=${() => setScreen("home")}
      onStart=${(cfg) => {
        setCountingCfg(cfg);
        setScreen("counting-play");
      }}
    />`;
  } else if (screen === "counting-play") {
    title = "ספירה והתאמה";
    back = () => setScreen("counting-config");
    body = html`<${CountingGame}
      config=${countingCfg}
      onNewGame=${() => setScreen("counting-config")}
      onExit=${() => setScreen("home")}
    />`;
  }

  const isPlay = screen === "memory-play" || screen === "counting-play";

  return html`
    <div class="app">
      <${Header} title=${title} onBack=${back} muted=${muted} onToggleMute=${toggleMute} />
      <div class=${"content" + (isPlay ? "" : " scrollable")}>${body}</div>
    </div>
  `;
}

ReactDOM.createRoot(document.getElementById("root")).render(html`<${App} />`);
