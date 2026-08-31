import { useState, useEffect } from "./html.js";

// Pick the column/row split that makes 3:4 cards as large as possible for the
// current viewport, so the whole board always fits without scrolling.
export function useBestGrid(count, ratio = 3 / 4) {
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    const on = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", on);
    window.addEventListener("orientationchange", on);
    return () => {
      window.removeEventListener("resize", on);
      window.removeEventListener("orientationchange", on);
    };
  }, []);

  const W = Math.max(160, vp.w - 40);
  const H = Math.max(160, vp.h - 96);

  let best = { cols: 1, rows: count, unit: 0 };
  for (let cols = 1; cols <= count; cols++) {
    const rows = Math.ceil(count / cols);
    const cw = W / cols;
    const ch = H / rows;
    // largest card of aspect `ratio` that fits this cell
    const unit = Math.min(cw, ch * ratio);
    if (unit > best.unit) best = { cols, rows, unit };
  }
  return { cols: best.cols, rows: best.rows, fs: Math.round(best.unit * 0.62) };
}
