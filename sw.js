// Simple offline cache. Bump CACHE when any asset changes.
const CACHE = "amit-games-v5";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/styles.css",
  "./vendor/react.production.min.js",
  "./vendor/react-dom.production.min.js",
  "./vendor/htm.module.js",
  "./js/app.js",
  "./js/html.js",
  "./js/data.js",
  "./js/audio.js",
  "./js/confetti.js",
  "./js/games/memory.js",
  "./js/games/counting.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png",
  "./images/superheros/Catboy.webp",
  "./images/superheros/Gekko.webp",
  "./images/superheros/GhostSpider.webp",
  "./images/superheros/Night_Ninja.webp",
  "./images/superheros/Spidey.webp",
  "./images/superheros/allSpydey.jpg",
  "./images/superheros/batman.webp",
  "./images/superheros/blackSpydey.webp",
  "./images/superheros/captinAmerica.jpg",
  "./images/superheros/greenGoblin.jpg",
  "./images/superheros/hulk.webp",
  "./images/superheros/ironamn.jpeg",
  "./images/superheros/pjMsdkOerl.webp",
  "./images/superheros/psmasks.jpg",
  "./images/superheros/rhino.jpeg",
  "./images/superheros/romeo.jpg",
  "./images/superheros/spiderman.webp",
  "./images/superheros/superman.jpg",
  "./images/superheros/womenVelin.jpg",
  "./images/superheros/wonderwoman.jpeg",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((hit) => {
      if (hit) return hit;
      return fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
