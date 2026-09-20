const CACHE = "qanitoon-v75";
const ASSETS = [
  "./", "./index.html", "./styles.css", "./app.js",
  "./icons.js", "./content.js", "./situations.js", "./hisn.js", "./islambook.js", "./names.js", "./spots.js", "./manasik.js", "./quran.js", "./nature.js", "./qurandua.js", "./duacheck.js", "./jadwal.js",
  "./manifest.json", "./icon.svg", "./icon-192.png", "./icon-512.png", "./icon-maskable.png", "./policy.html",
  "./fonts/Amiri-400.woff2", "./fonts/Amiri-700.woff2",
  "./fonts/NotoNaskh-400.woff2", "./fonts/NotoNaskh-500.woff2", "./fonts/NotoNaskh-700.woff2"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  // طلبات الطقس والهزات: شبكة أولاً وبلا تخزين، حتى لا تُقدَّم بيانات قديمة
  if (/open-meteo|earthquake\.usgs\.gov/.test(e.request.url)) return;
  const u = new URL(e.request.url);
  if (u.origin === location.origin && /\.(js|css|html)$|\/$/.test(u.pathname)) {
    e.respondWith(fetch(e.request).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => { }); return res; }).catch(() => caches.match(e.request).then(h => h || caches.match("./index.html"))));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => { });
      return res;
    }).catch(() => caches.match("./index.html")))
  );
});
