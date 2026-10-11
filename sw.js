/* 嵌入式学习 App · Service Worker
   版本变更 = 发布新版本；用户点「立即更新」即可，无需卸载重装 */
<<<<<<< HEAD
var CACHE = "emb-app-v1.14.0";
=======
var CACHE = "emb-app-v1.13.0";
>>>>>>> 2791a646f31238970c0e91a6a49a07d29834d31b

var ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.svg",
  "./words-data.js",
  "./img/01-min-sys.svg",
  "./img/02-gpio-led.svg",
  "./img/03-register.svg",
  "./img/04-uart.svg",
  "./img/05-i2c.svg",
  "./img/06-irq.svg",
  "./img/07-pwm.svg",
  "./img/08-adc.svg",
  "./img/09-rtos.svg",
  "./img/10-ota.svg",
  "./img/11-debug.svg",
  "./img/12-cpu.svg",
  "./img/13-frame.svg",
  "./img/14-power.svg",
  "./study/index.html",
  "./study/style.css",
  "./study/bundle-data.js",
  "./study/bundle-app.js",
  "./study/bundle-lazy.js"
];

<<<<<<< HEAD
/* lazy bitmaps: atlas/poster/hero/detail 按需缓存 */
  var LAZY_RE = /\/(img-atlas|img-poster|img-hero|img-detail|img-hd|img-png)\//;

  function cacheAll() {
=======
function cacheAll() {
>>>>>>> 2791a646f31238970c0e91a6a49a07d29834d31b
  return caches.open(CACHE).then(function (c) {
    /* 逐项缓存：大文件失败不阻断安装，运行时再补 */
    return Promise.all(ASSETS.map(function (u) {
      return c.add(u).catch(function () {});
    }));
  });
}

self.addEventListener("install", function (e) {
  e.waitUntil(cacheAll());
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) {
        return k !== CACHE;
      }).map(function (k) {
        return caches.delete(k);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("message", function (e) {
  if (e.data && e.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;

  /* 导航：网络优先，离线回落 App 壳或学习站首页 */
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () {
        return caches.match(req).then(function (hit) {
          return hit || caches.match("./study/index.html").then(function (s) {
            return s || caches.match("./index.html");
          });
        });
      })
    );
    return;
  }

  /* 其它静态：缓存优先 + 后台更新（离线可用，联网可获新） */
  e.respondWith(
    caches.match(req).then(function (hit) {
      var net = fetch(req).then(function (res) {
        if (res && res.status === 200 && (res.type === "basic" || res.type === "default")) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () {
        return hit;
      });
      return hit || net;
    })
  );
});
