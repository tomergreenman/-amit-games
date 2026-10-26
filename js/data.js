// Picture decks for the memory game. Each subject lists possible cards.
// Regular subjects use emoji strings; the colors subject uses swatch objects;
// image subjects list file names inside `dir`.

export const MEMORY_SUBJECTS = [
  {
    id: "animals",
    label: "חיות",
    emoji: "🦁",
    cards: [
      "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯",
      "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🦆", "🦉",
      "🐴", "🦄", "🐝", "🦋", "🐢", "🐬", "🐳", "🐙", "🦀", "🐡",
    ],
  },
  {
    id: "outdoor",
    label: "משחקי גן ופעילויות בחוץ",
    emoji: "🛝",
    cards: [
      "⚽", "🏀", "🎾", "🏐", "🏈", "🛝", "🛴", "🚲", "🪁", "🏓",
      "🥏", "🤸", "🏃", "🧗", "🛼", "⛸️", "🎣", "🏸", "🤾", "🏊",
      "🎠", "🎡", "⛲", "🌳", "🏕️", "🪀", "🧗‍♀️", "🤽",
    ],
  },
  {
    id: "foods",
    label: "אוכל",
    emoji: "🍎",
    cards: [
      "🍎", "🍌", "🍇", "🍓", "🍊", "🍉", "🍑", "🍒", "🥕", "🌽",
      "🍅", "🥦", "🍕", "🍔", "🌭", "🥪", "🍦", "🍩", "🍪", "🎂",
      "🧁", "🍭", "🍿", "🥨", "🧀", "🥐", "🍞", "🥑", "🍐", "🥝",
    ],
  },
  {
    id: "superheroes",
    label: "גיבורי על",
    emoji: "🦸",
    isImage: true,
    dir: "images/superheros/",
    cards: [
      "spiderman.webp", "Spidey.webp", "blackSpydey.webp", "GhostSpider.webp", "allSpydey.jpg",
      "batman.webp", "superman.jpg", "wonderwoman.jpeg", "hulk.webp", "ironamn.jpeg",
      "captinAmerica.jpg", "greenGoblin.jpg", "rhino.jpeg", "womenVelin.jpg", "Catboy.webp",
      "Gekko.webp", "pjMsdkOerl.webp", "psmasks.jpg", "romeo.jpg", "Night_Ninja.webp",
    ],
  },
  {
    id: "colors",
    label: "צבעים",
    emoji: "🎨",
    isColor: true,
    cards: [
      { key: "red", color: "#e2352b", label: "אדום" },
      { key: "orange", color: "#ff8c1a", label: "כתום" },
      { key: "yellow", color: "#ffd21f", label: "צהוב" },
      { key: "green", color: "#2fb457", label: "ירוק" },
      { key: "blue", color: "#2b7de2", label: "כחול" },
      { key: "lightblue", color: "#7ad0ff", label: "תכלת" },
      { key: "purple", color: "#8b46d6", label: "סגול" },
      { key: "pink", color: "#ff7ab5", label: "ורוד" },
      { key: "brown", color: "#9b5a2a", label: "חום" },
      { key: "black", color: "#2b2b2b", label: "שחור" },
      { key: "white", color: "#ffffff", label: "לבן" },
      { key: "gray", color: "#9aa0a6", label: "אפור" },
      { key: "turquoise", color: "#17c3b2", label: "טורקיז" },
      { key: "lime", color: "#b2e61d", label: "ליים" },
      { key: "navy", color: "#22306b", label: "כחול כהה" },
      { key: "gold", color: "#d4af37", label: "זהב" },
      { key: "peach", color: "#ffcba4", label: "אפרסק" },
      { key: "mint", color: "#9de8c9", label: "מנטה" },
      { key: "coral", color: "#ff6f61", label: "אלמוג" },
      { key: "lavender", color: "#c9b6ff", label: "לבנדר" },
    ],
  },
];

// Animals used by the counting game — chosen to stay readable when small.
export const COUNT_CRITTERS = [
  { emoji: "🦆", name: "ברווזים" },
  { emoji: "🐶", name: "כלבים" },
  { emoji: "🐱", name: "חתולים" },
  { emoji: "🐟", name: "דגים" },
  { emoji: "🐝", name: "דבורים" },
  { emoji: "🦋", name: "פרפרים" },
  { emoji: "🐢", name: "צבים" },
  { emoji: "🐰", name: "ארנבים" },
  { emoji: "🐮", name: "פרות" },
  { emoji: "🐷", name: "חזירים" },
  { emoji: "🐸", name: "צפרדעים" },
  { emoji: "🐥", name: "אפרוחים" },
  { emoji: "🦉", name: "ינשופים" },
  { emoji: "🐙", name: "תמנונים" },
  { emoji: "🐴", name: "סוסים" },
  { emoji: "🐞", name: "חיפושיות" },
];

// Hebrew counting words (the casual "counting" form kids learn).
export const HEB_NUMBERS = [
  "", "אחת", "שתיים", "שלוש", "ארבע", "חמש",
  "שש", "שבע", "שמונה", "תשע", "עשר",
];

export const PRAISE = ["כל הכבוד!", "מצוין!", "יופי!", "נהדר!", "איזה יופי!", "מדהים!"];
export const TRY_AGAIN = ["כמעט! נסי שוב", "אופס, נסי עוד פעם", "לא נורא, נסי שוב"];

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
