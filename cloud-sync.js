/* ============================================================
   账号与云同步（cloud-sync.js）
   ------------------------------------------------------------
   设计原则：**本地优先**。
     · 不登录也能正常用 —— 进度照旧存在这台设备上（离线、双击打开 html 都行）
     · 登录后自动和云端合并 —— 电脑和手机看到同一份进度
     · 换设备登录后，云端进度会拉下来；本地已有的进度也会并上去，两边都不丢

   合并规则（重点，决定了「会不会丢进度」）：
     · ans（每题答对/答错次数）：**取较大值**。计数只增不减，所以取 max 永远不会丢。
     · wrong（错题本）：这是唯一有歧义的地方 —— 手机上答对了、电脑上还标着错。
       所以给每道题记一个「最后改动时间 qts」，谁的时间新听谁的。
       两边时间一样（比如都是老数据）时**保留错题**，宁可多复习一遍。
     · days（每天做了多少题）：取较大值。不同设备同一天各做一部分时不会重复累加
       （会略微少算，但绝不会多算 —— 宁可少算也不虚报）。
     · mock（模拟面试的回答）：按答题时间后写胜。

   安全说明：云服务的登录只在本应用的「线上正式域名」可用。
   用本地文件直接打开时，登录会给出明确提示而不是静默失败；学习进度照常本地保存。
   ============================================================ */
(function () {
  "use strict";

  var CFG = window.CLOUD_PUBLIC_CONFIG || null;
  var SDK_URL = "https://cdn.jsdelivr.net/npm/@tencent-ai/workbuddy-cloud-sdk@dev/lib/index.global.js";
  var REMEMBER_KEY = "emb-cloud-v1";   /* 只记「上次登录过没」和最近同步时间，不存任何凭据 */

  /* 云服务的发布域名。登录/同步只在这个域名下有效（服务端会校验来源域名）。 */
  var RELEASE_HOST = (CFG && CFG.endpoint) ? CFG.endpoint.replace(/^https?:\/\//, "").replace(/\/$/, "") : "";

  var cloud = null;          /* SDK 实例，懒加载 */
  var sdkPromise = null;
  var hooks = { readPayload: null, applyPayload: null, onStatus: null };
  var pushTimer = null;
  var busy = false;

  var st = {
    state: "local",       /* local(未登录) | syncing | synced | error | offline | nobackend */
    message: "",
    at: 0,
    user: null,           /* { email } */
    lastPush: 0,
    lastPull: 0
  };

  /* ---------- 小工具 ---------- */
  function todayKey(d) {
    var t = d ? new Date(d) : new Date();
    var m = t.getMonth() + 1, day = t.getDate();
    return t.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (day < 10 ? "0" : "") + day;
  }
  function remember() {
    try { return JSON.parse(localStorage.getItem(REMEMBER_KEY) || "{}") || {}; } catch (e) { return {}; }
  }
  function setRemember(o) {
    try { localStorage.setItem(REMEMBER_KEY, JSON.stringify(o)); } catch (e) {}
  }
  function hasRememberedSession() { return !!remember().signedIn; }

  /* 当前是不是在「云服务认得的线上域名」下打开。
     本地双击打开、或别的域名打开时，登录会被服务端拒绝——提前说清楚，别让用户白填表单。 */
  function onReleaseHost() {
    try {
      return location.protocol === "https:" && location.hostname === RELEASE_HOST;
    } catch (e) { return false; }
  }
  function offline() {
    try { return navigator.onLine === false; } catch (e) { return false; }
  }

  function setStatus(state, message) {
    st.state = state;
    st.message = message || "";
    st.at = Date.now();
    try { if (hooks.onStatus) hooks.onStatus(st); } catch (e) {}
  }

  function errText(err) {
    if (!err) return "未知错误";
    var k = err.kind || err.code || "";
    var m = err.message || String(err);
    if (k === "unauthenticated" || k === "invalid_grant") return "登录已过期，请重新登录";
    if (k === "network" || k === "backend-unavailable") return "网络不通，稍后会自动重试";
    if (String(err.code) === "42501") return "没有权限操作这条数据";
    if (String(err.code) === "42P01") return "云端数据表还不存在，请联系站点维护者";
    if (k === "rate_limit" || /too many/i.test(m)) return "操作太频繁，请稍等一会儿再试";
    return m;
  }

  /* ---------- 懒加载 SDK ----------
     刻意不在页面加载时就拉 SDK：那样离线打开、双击打开 html 都会白等一个网络请求。
     只有在「要登录 / 要同步」时才注入脚本。 */
  function ensureSdk() {
    if (cloud) return Promise.resolve(cloud);
    if (sdkPromise) return sdkPromise;
    sdkPromise = new Promise(function (resolve, reject) {
      if (!CFG || !CFG.endpoint || !CFG.publishableKey) {
        return reject(new Error("云服务配置缺失"));
      }
      if (typeof document === "undefined") return reject(new Error("当前环境不支持"));
      var s = document.createElement("script");
      s.src = SDK_URL;
      s.async = true;
      s.onload = function () {
        try {
          if (!window.WorkBuddyCloud || !window.WorkBuddyCloud.createWorkBuddyCloud) {
            throw new Error("云服务组件未就绪");
          }
          /* 两个参数都必须给：endpoint 与 publishableKey 全部取自 publicConfig */
          cloud = window.WorkBuddyCloud.createWorkBuddyCloud({
            endpoint: CFG.endpoint,
            publishableKey: CFG.publishableKey
          });
          resolve(cloud);
        } catch (e) { reject(e); }
      };
      s.onerror = function () {
        sdkPromise = null;
        reject(new Error("网络不通，云服务组件加载失败"));
      };
      document.head.appendChild(s);
    });
    return sdkPromise;
  }

  /* ---------- 合并算法 ---------- */
  var EMPTY = function () { return { ans: {}, wrong: {}, qts: {}, days: {} }; };
  function normProg(p) {
    p = p || {};
    return {
      ans: (p.ans && typeof p.ans === "object") ? p.ans : {},
      wrong: (p.wrong && typeof p.wrong === "object") ? p.wrong : {},
      qts: (p.qts && typeof p.qts === "object") ? p.qts : {},
      days: (p.days && typeof p.days === "object") ? p.days : {}
    };
  }
  function mergeProgress(a, b) {
    a = normProg(a); b = normProg(b);
    var out = EMPTY(), i, k, ids;

    /* ① 答题计数：单调递增，取 max —— 这一步保证「不可能丢进度」 */
    ids = {};
    [a.ans, b.ans].forEach(function (m) { for (k in m) if (Object.prototype.hasOwnProperty.call(m, k)) ids[k] = 1; });
    for (k in ids) {
      if (!Object.prototype.hasOwnProperty.call(ids, k)) continue;
      var x = a.ans[k] || {}, y = b.ans[k] || {};
      out.ans[k] = { ok: Math.max(x.ok || 0, y.ok || 0), bad: Math.max(x.bad || 0, y.bad || 0) };
    }

    /* ② 每道题的最后改动时间：取较新 —— 这是判定「错题该不该还在」的依据 */
    ids = {};
    [a.qts, b.qts].forEach(function (m) { for (k in m) if (Object.prototype.hasOwnProperty.call(m, k)) ids[k] = 1; });
    [a.wrong, b.wrong].forEach(function (m) { for (k in m) if (Object.prototype.hasOwnProperty.call(m, k)) ids[k] = 1; });
    for (k in ids) {
      if (!Object.prototype.hasOwnProperty.call(ids, k)) continue;
      var ta = a.qts[k] || 0, tb = b.qts[k] || 0;
      out.qts[k] = Math.max(ta, tb);
      var inA = !!a.wrong[k], inB = !!b.wrong[k];
      if (!inA && !inB) continue;
      if (ta === tb) {
        out.wrong[k] = 1;                        /* 分不出先后 → 保留，宁可多复习 */
      } else {
        var win = ta > tb ? a : b;
        if (win.wrong[k]) out.wrong[k] = 1;
      }
    }

    /* ③ 每日做题量：取 max，不重复累加 */
    ids = {};
    [a.days, b.days].forEach(function (m) { for (k in m) if (Object.prototype.hasOwnProperty.call(m, k)) ids[k] = 1; });
    for (k in ids) {
      if (!Object.prototype.hasOwnProperty.call(ids, k)) continue;
      out.days[k] = Math.max(a.days[k] || 0, b.days[k] || 0);
    }
    return out;
  }
  function mergeMock(a, b) {
    a = a || {}; b = b || {};
    var out = {}, k;
    for (k in a) if (Object.prototype.hasOwnProperty.call(a, k)) out[k] = a[k];
    for (k in b) {
      if (!Object.prototype.hasOwnProperty.call(b, k)) continue;
      if (!out[k]) { out[k] = b[k]; continue; }
      var ta = Date.parse(out[k].savedAt || 0) || 0, tb = Date.parse(b[k].savedAt || 0) || 0;
      if (tb > ta) out[k] = b[k];
    }
    return out;
  }
  function mergePayload(local, remote) {
    local = local || {}; remote = remote || {};
    return {
      ver: 2,
      progress: mergeProgress(local.progress, remote.progress),
      mock: mergeMock(local.mock, remote.mock),
      guide: !!(local.guide || remote.guide)
    };
  }

  /* ---------- 同步 ---------- */
  function pushState(payload) {
    return cloud.database.from("study_state").upsert({
      payload: payload,
      schema_ver: 2,
      device: (function () {
        try { return (navigator.userAgent || "").slice(0, 120); } catch (e) { return ""; }
      })(),
      client_at: new Date().toISOString()
    }, { onConflict: "owner_id" }).select("id, updated_at");
  }
  function pushDay(payload) {
    /* 每日记录：把「每天做了几题」写成人可读的一行行记录。
       upsert 到 (owner_id, day) 上，天然幂等，重复同步不会产生重复行。 */
    var prog = normProg(payload.progress), rows = [], d;
    var days = Object.keys(prog.days).sort().slice(-60);   /* 只回写最近 60 天，避免无谓的写量 */
    for (var i = 0; i < days.length; i++) {
      d = days[i];
      rows.push({ day: d, questions: prog.days[d] || 0, correct: 0, courses: [] });
    }
    if (!rows.length) return Promise.resolve();
    return cloud.database.from("study_days").upsert(rows, { onConflict: "owner_id,day" });
  }
  function pullState() {
    return cloud.database.from("study_state").select("payload, updated_at").limit(1);
  }

  /* 一次完整同步：拉云端 → 与本地合并 → 写回。
     顺序很重要：先拉后推，否则会把本地覆盖掉云端另一台设备的进度。 */
  function syncNow(reason) {
    if (busy) return Promise.resolve(false);
    if (!hooks.readPayload) return Promise.resolve(false);
    if (offline()) { setStatus("offline", "当前没有网络，进度先存在本机，联网后会自动补上"); return Promise.resolve(false); }
    if (!hasRememberedSession()) { setStatus("local", ""); return Promise.resolve(false); }
    busy = true;
    setStatus("syncing", "正在同步…");
    var localPayload = hooks.readPayload();
    return ensureSdk()
      .then(function () { return cloud.auth.getSession(); })
      .then(function (r) {
        if (r && r.error) throw r.error;
        if (!r || !r.data) throw { kind: "unauthenticated" };
        st.user = { email: (r.data.user && r.data.user.email) || "" };
        return pullState();
      })
      .then(function (res) {
        if (res && res.error) throw res.error;
        var remote = (res && res.data && res.data[0] && res.data[0].payload) || null;
        st.lastPull = Date.now();
        var merged = mergePayload(localPayload, remote);
        /* 本地也应用合并结果：否则「手机上答对的题」在电脑上不会消失，
           要等下次刷新才对——那看起来就像同步没生效。 */
        try { if (hooks.applyPayload) hooks.applyPayload(merged); } catch (e) {}
        var post = (reason === "pull-only") ? Promise.resolve() : pushState(merged).then(function () { return pushDay(merged); });
        return post.then(function () { return merged; });
      })
      .then(function () {
        st.lastPush = Date.now();
        var r = remember(); r.signedIn = true; r.lastSync = st.lastPush; setRemember(r);
        setStatus("synced", "已同步 · " + new Date(st.lastPush).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }));
        busy = false;
        return true;
      })
      .catch(function (e) {
        busy = false;
        var msg = errText(e);
        if (e && (e.kind === "unauthenticated" || e.kind === "invalid_grant")) {
          st.user = null;
          var r = remember(); r.signedIn = false; setRemember(r);
          setStatus("local", "登录已过期，请重新登录");
        } else {
          setStatus("error", "同步失败：" + msg);
        }
        return false;
      });
  }

  /* 本地一改动就安排一次同步。
     防抖 2.5 秒：连续答题时不会每题发一次请求，但停下来之后很快就能推上去；
     配合「回到页面时自动拉一次」，两端之间的一致感接近实时。 */
  function schedulePush() {
    if (!hasRememberedSession() || !onReleaseHost()) return;
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(function () { pushTimer = null; syncNow("push"); }, 2500);
  }

  /* 自动同步的触发点由一个「最小间隔」保护，避免来回切窗口时反复发请求 */
  var lastAuto = 0;
  var pollTimer = null;
  var POLL_MS = 60000;      /* 页面可见时每分钟轻量拉一次，让两边自己收敛 */

  function autoSync(reason, minGapMs) {
    if (!hasRememberedSession()) return;
    if (!onReleaseHost()) return;
    if (offline()) { setStatus("offline", "当前没有网络，进度先存在本机，联网后会自动补上"); return; }
    var now = Date.now();
    if (minGapMs && now - lastAuto < minGapMs) return;
    lastAuto = now;
    syncNow(reason || "auto");
  }

  function startPolling() {
    if (pollTimer) return;
    pollTimer = setInterval(function () {
      /* 页面在后台时不拉取：省流量也省电，回来时那一次已经足够 */
      try { if (document.visibilityState && document.visibilityState !== "visible") return; } catch (e) {}
      autoSync("poll", 30000);
    }, POLL_MS);
  }
  function stopPolling() {
    if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
  }

  /* ---------- 对外 API（登录相关在下一段定义） ---------- */
  var API = {
    init: function (opts) {
      opts = opts || {};
      hooks.readPayload = opts.readPayload;
      hooks.applyPayload = opts.applyPayload;
      hooks.onStatus = opts.onStatus;

      /* 这些监听都是「增强」不是「必需」—— 桩环境或老浏览器里没有也不能让模块挂掉 */
      try {
        if (typeof window !== "undefined" && window.addEventListener) {
          window.addEventListener("online", function () { autoSync("online", 0); });
          window.addEventListener("offline", function () { setStatus("offline", "当前没有网络，进度先存在本机"); });

          /* 回到这个页面时先拉一次再推。
             这是「多端实时一致」最关键的一个触发点：
             手机上做完几道题，切回电脑标签页应当立刻看到，而不是等下次刷新。
             留 2 秒最小间隔，防止在几个窗口之间来回切时反复发请求。 */
          window.addEventListener("focus", function () { autoSync("focus", 2000); });
        }
        if (typeof document !== "undefined" && document.addEventListener) {
          document.addEventListener("visibilitychange", function () {
            var vis = true;
            try { vis = document.visibilityState !== "hidden"; } catch (e) {}
            if (vis) { autoSync("visible", 2000); startPolling(); }
            else { stopPolling(); }
          });
        }
      } catch (e) {}

      if (hasRememberedSession() && onReleaseHost()) {
        setTimeout(function () { syncNow("boot"); startPolling(); }, 1200);
      }
      return API;
    },
    hasRememberedSession: hasRememberedSession,
    onReleaseHost: onReleaseHost,
    isSignedIn: function () { return !!st.user; },
    getUser: function () { return st.user; },
    status: function () { return st; },
    syncNow: syncNow,
    schedulePush: schedulePush,
    mergePayload: mergePayload,      /* 给离线自测用 */
    mergeProgress: mergeProgress,
    _ensureSdk: ensureSdk,
    _getCloud: function () { return cloud; },
    _setUser: function (u) { st.user = u; },
    _setStatus: setStatus,
    _remember: remember,
    _setRemember: setRemember,
    todayKey: todayKey
  };
  window.CloudSync = API;

  /* ============================================================
     第二部分：登录 / 注册 / 找回密码
     ============================================================ */
  var pending = { mode: "", email: "", verificationId: "", isExistingUser: false };
  var resetHandle = null;    /* 找回密码第一步返回的句柄，第二步用它改密码 */

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function afterSignIn(session) {
    st.user = { email: (session && session.user && session.user.email) || "" };
    var r = remember(); r.signedIn = true; r.email = st.user.email; setRemember(r);
    setStatus("syncing", "正在同步…");
    return syncNow("signin").then(function () { return st.user; });
  }

  function logoutLocal() {
    st.user = null;
    var r = remember(); r.signedIn = false; delete r.email; setRemember(r);
    setStatus("local", "");
  }

  var Auth = {
    signInWithPassword: function (email, password) {
      return ensureSdk()
        .then(function () { return cloud.auth.signInWithPassword({ email: email, password: password }); })
        .then(function (r) {
          if (r.error) throw r.error;
          return afterSignIn(r.data);
        });
    },

    /* 第一步：发验证码。同一入口既能用于登录也能用于注册。 */
    sendOtp: function (email) {
      return ensureSdk()
        .then(function () { return cloud.auth.sendOtp({ email: email }); })
        .then(function (r) {
          if (r.error) throw r.error;
          pending.email = email;
          pending.verificationId = r.data.verificationId;
          pending.isExistingUser = !!r.data.isExistingUser;
          return { isExistingUser: pending.isExistingUser };
        });
    },

    /* 第二步（登录）：验证码换登录态 */
    verifyOtpLogin: function (email, code) {
      return ensureSdk()
        .then(function () {
          return cloud.auth.verifyOtp({
            verificationId: pending.verificationId,
            token: code,
            email: email,
            isExistingUser: pending.isExistingUser
          });
        })
        .then(function (r) {
          if (r.error) throw r.error;
          return afterSignIn(r.data);
        });
    },

    /* 第二步（注册）：验证码 + 自设密码。密码在注册这一步一并交给服务端，
       这样注册完就能用密码登录。 */
    verifyOtpSignup: function (email, code, password) {
      return ensureSdk()
        .then(function () {
          return cloud.auth.verifyOtp({
            verificationId: pending.verificationId,
            token: code,
            email: email,
            isExistingUser: false,
            password: password
          });
        })
        .then(function (r) {
          if (r.error) throw r.error;
          return afterSignIn(r.data);
        });
    },

    /* 找回密码：发验证码。返回的对象里有 updateUser，第二步要用。 */
    resetPasswordForEmail: function (email) {
      return ensureSdk()
        .then(function () { return cloud.auth.resetPasswordForEmail(email); })
        .then(function (r) {
          if (r.error) throw r.error;
          pending.email = email;
          resetHandle = r.data;      /* 第二步（改密码）要用这个句柄 */
          return r.data;
        });
    },

    /* 找回密码：验证码 + 新密码 */
    completePasswordReset: function (code, newPassword) {
      if (!resetHandle || !resetHandle.updateUser) {
        return Promise.reject({ message: "验证码已失效，请重新获取" });
      }
      return resetHandle.updateUser({ nonce: code, password: newPassword })
        .then(function (r) {
          if (r.error) throw r.error;
          resetHandle = null;
          return afterSignIn(r.data);
        });
    },

    /* 已登录时改密码 */
    resetPasswordForOld: function (oldPassword, newPassword) {
      return ensureSdk()
        .then(function () { return cloud.auth.resetPasswordForOld({ oldPassword: oldPassword, newPassword: newPassword }); })
        .then(function (r) { if (r.error) throw r.error; return true; });
    },

    signOut: function () {
      return ensureSdk()
        .then(function () { return cloud.auth.signOut(); })
        .catch(function () { /* 网络不通也要能退出本地登录态 */ })
        .then(function () { logoutLocal(); return true; });
    },

    /* 服务端校验过的当前用户（比本地缓存可信） */
    refreshUser: function () {
      return ensureSdk()
        .then(function () { return cloud.auth.getUser(); })
        .then(function (r) {
          if (r.error) throw r.error;
          if (r.data && r.data.email) { st.user = { email: r.data.email }; }
          return st.user;
        });
    }
  };

  /* resetPasswordForEmail 返回的句柄要留着给第二步用 */
  API.auth = Auth;

  /* ============================================================
     第三部分：「我的账号」页面
     ============================================================ */
  function noticeUnavailable() {
    return '<div class="cs-notice">' +
      "<b>登录功能只在线上正式版可用</b>" +
      "<p>你现在是用本地文件（或非正式地址）打开的，浏览器不允许这种页面安全地登录，" +
      "所以这里没法登录 —— 但<b>学习进度照常保存在这台设备上</b>，不影响使用。</p>" +
      '<p>想在电脑和手机之间同步进度，请用这个地址打开：</p>' +
      '<p><a class="btn small" href="' + esc(CFG ? CFG.endpoint : "") + '" target="_blank" rel="noopener">' +
      esc(CFG ? CFG.endpoint : "") + "</a></p>" +
      "</div>";
  }

  function signedOutHTML() {
    return '' +
      '<section class="card"><h2>登录后，电脑和手机共用同一份进度</h2>' +
      '<p class="lead">不登录也能正常学，进度存在这台设备上；<b>登录之后，换设备打开还是接着上次的地方继续</b>。' +
      "错题本、做过的题、每天学了多少，都会自动合到一起，两边都不会丢。</p>" +
      '<div class="cs-tabs" role="tablist">' +
      '<button type="button" class="cs-tab on" data-cs-tab="pw" role="tab">用密码登录</button>' +
      '<button type="button" class="cs-tab" data-cs-tab="otp" role="tab">用邮箱验证码登录</button>' +
      '<button type="button" class="cs-tab" data-cs-tab="signup" role="tab">注册新账号</button>' +
      "</div>" +

      '<div class="cs-pane" data-cs-pane="pw">' +
      '<label class="cs-field"><span>邮箱</span><input type="email" data-cs="email-pw" autocomplete="username" placeholder="you@example.com" /></label>' +
      '<label class="cs-field"><span>密码</span><input type="password" data-cs="pw" autocomplete="current-password" placeholder="至少 6 位" /></label>' +
      '<div class="cs-actions"><button type="button" class="btn primary" data-cs-act="signin-pw">登录</button>' +
      '<button type="button" class="link-btn" data-cs-act="goto-reset">忘记密码？</button></div>' +
      "</div>" +

      '<div class="cs-pane" data-cs-pane="otp" hidden>' +
      '<p class="cs-tip">不用记密码：填邮箱 → 收一封验证码邮件 → 填进来就能登录。</p>' +
      '<label class="cs-field"><span>邮箱</span><input type="email" data-cs="email-otp" autocomplete="username" placeholder="you@example.com" /></label>' +
      '<div class="cs-actions"><button type="button" class="btn primary" data-cs-act="otp-send-login">发送验证码</button></div>' +
      '<div data-cs-step="otp-login" hidden>' +
      '<label class="cs-field"><span>邮件里的验证码</span><input type="text" inputmode="numeric" data-cs="code-otp" placeholder="6 位数字" /></label>' +
      '<div class="cs-actions"><button type="button" class="btn primary" data-cs-act="otp-verify-login">验证并登录</button></div>' +
      "</div></div>" +

      '<div class="cs-pane" data-cs-pane="signup" hidden>' +
      '<p class="cs-tip">注册分两步：先验证邮箱，再设一个密码。以后既可以用密码登录，也可以用验证码登录。</p>' +
      '<label class="cs-field"><span>邮箱</span><input type="email" data-cs="email-su" autocomplete="username" placeholder="you@example.com" /></label>' +
      '<div class="cs-actions"><button type="button" class="btn primary" data-cs-act="otp-send-signup">发送验证码</button></div>' +
      '<div data-cs-step="signup" hidden>' +
      '<label class="cs-field"><span>邮件里的验证码</span><input type="text" inputmode="numeric" data-cs="code-su" placeholder="6 位数字" /></label>' +
      '<label class="cs-field"><span>设置密码</span><input type="password" data-cs="pw-su" autocomplete="new-password" placeholder="至少 6 位，自己能记住就行" /></label>' +
      '<div class="cs-actions"><button type="button" class="btn primary" data-cs-act="otp-verify-signup">完成注册</button></div>' +
      "</div></div>" +

      '<div class="cs-pane" data-cs-pane="reset" hidden>' +
      '<p class="cs-tip">填注册时用的邮箱，我们会发一个验证码给你，用它设一个新密码。</p>' +
      '<label class="cs-field"><span>邮箱</span><input type="email" data-cs="email-rs" placeholder="you@example.com" /></label>' +
      '<div class="cs-actions"><button type="button" class="btn primary" data-cs-act="reset-send">发送验证码</button></div>' +
      '<div data-cs-step="reset" hidden>' +
      '<label class="cs-field"><span>邮件里的验证码</span><input type="text" inputmode="numeric" data-cs="code-rs" placeholder="6 位数字" /></label>' +
      '<label class="cs-field"><span>新密码</span><input type="password" data-cs="pw-rs" autocomplete="new-password" placeholder="至少 6 位" /></label>' +
      '<div class="cs-actions"><button type="button" class="btn primary" data-cs-act="reset-done">设好了，登录</button></div>' +
      "</div></div>" +

      '<p class="cs-msg" data-cs-msg role="status" aria-live="polite"></p>' +
      '<p class="cs-privacy">我们只用邮箱做登录，不会发广告。学习数据只属于你自己的账号，' +
      "任何人都看不到别人的进度。</p>" +
      "</section>";
  }

  var STATE_TEXT = {
    local: "未登录（进度存在本机）",
    syncing: "正在同步…",
    synced: "已同步",
    error: "同步失败",
    offline: "离线（联网后自动补上）",
    nobackend: "云服务不可用"
  };

  function signedInHTML() {
    var s = st, r = remember();
    var last = r.lastSync ? new Date(r.lastSync).toLocaleString("zh-CN") : "还没同步过";
    var dot = s.state === "synced" ? "ok" : (s.state === "error" ? "bad" : "wait");
    return '' +
      '<section class="card"><h2>我的账号</h2>' +
      '<div class="cs-who"><span class="cs-avatar">' + esc((st.user.email || "?").slice(0, 1).toUpperCase()) + "</span>" +
      "<div><b>" + esc(st.user.email || "已登录") + "</b>" +
      '<div class="cs-sub">进度会自动同步到这台设备之外，换手机或换电脑登录同一个邮箱即可继续</div></div></div>' +

      '<div class="cs-syncbar"><span class="cs-dot ' + dot + '"></span>' +
      '<span data-cs-statustext>' + esc(STATE_TEXT[s.state] || s.state) + (s.message ? " · " + esc(s.message) : "") + "</span>" +
      '<button type="button" class="btn small" data-cs-act="sync-now">立即同步</button></div>' +
      '<p class="cs-tip">上次同步：' + esc(last) + "</p>" +

      '<div class="cs-actions"><button type="button" class="btn ghost small" data-cs-act="pw-change-open">修改密码</button>' +
      '<button type="button" class="btn ghost small" data-cs-act="signout">退出登录</button></div>' +

      '<div data-cs-step="pw-change" hidden class="cs-pane-block">' +
      '<label class="cs-field"><span>当前密码</span><input type="password" data-cs="pw-old" autocomplete="current-password" /></label>' +
      '<label class="cs-field"><span>新密码</span><input type="password" data-cs="pw-new" autocomplete="new-password" placeholder="至少 6 位" /></label>' +
      '<div class="cs-actions"><button type="button" class="btn primary small" data-cs-act="pw-change-done">保存新密码</button></div>' +
      "</div>" +
      '<p class="cs-msg" data-cs-msg role="status" aria-live="polite"></p>' +
      "</section>" +

      '<section class="card"><h2>设备之间的进度是怎么合的</h2>' +
      '<p class="lead">你在几台设备上各学各的，登录后系统会把它们<b>合起来</b>，而不是拿一台覆盖另一台：</p>' +
      '<ul class="cs-rules">' +
      "<li><b>做过的题</b>：两边加起来，只增不减 —— 不可能因为你换了设备就把做过的题弄丢。</li>" +
      "<li><b>错题本</b>：同一道题，谁最后改动的时间新听谁的。时间一样时保留错题，宁可多复习一遍。</li>" +
      "<li><b>每天做题数</b>：取较大的那个数，不会因为几台设备都学了就重复累加。</li>" +
      "</ul>" +
      '<div class="map-sub">什么时候会自动同步</div>' +
      '<ul class="cs-rules">' +
      "<li>做完题之后约 3 秒（会攒一下，不会每答一题就发一次请求）</li>" +
      "<li><b>从别的窗口切回这一页时立刻同步一次</b> —— 手机上做完，切回电脑就能看到</li>" +
      "<li>页面开着的时候，每分钟轻轻拉一次，让两边自己收敛</li>" +
      "<li>断网时进度先存在本机，一联网马上补上去</li>" +
      "</ul>" +
      '<p class="cs-tip">上面任意一种没及时生效，点「立即同步」就一定同步。' +
      "想验证的话：在一台设备上做几道题 → 切到另一台的这一页 → 数字应当已经变了。</p>" +
      "</section>";
  }

  function renderAccountHTML() {
    if (!CFG) return '<section class="card"><h2>我的账号</h2><p>云服务暂不可用。</p></section>';
    if (!onReleaseHost()) return noticeUnavailable();
    if (st.user) return signedInHTML();
    return signedOutHTML();
  }

  /* 顶栏徽标用的**短**文案。不能直接复用 STATE_TEXT ——
     「离线（联网后自动补上）」这种长句会把顶栏撑开换行。 */
  var CHIP_TEXT = {
    local: "登录同步", syncing: "同步中", synced: "已同步",
    error: "同步失败", offline: "离线", nobackend: "云服务不可用"
  };

  /* 同步状态小徽标（顶栏用） */
  function statusChipHTML() {
    if (!hasRememberedSession()) return '<a class="cs-chip" href="#/account">登录同步</a>';
    var t = CHIP_TEXT[st.state] || "我的账号";
    var cls = st.state === "synced" ? "ok" : (st.state === "error" ? "bad" : "wait");
    return '<a class="cs-chip ' + cls + '" href="#/account" title="' + esc(st.message || t) + '">' +
      '<span class="cs-dot ' + cls + '"></span>' + esc(t) + "</a>";
  }

  API.renderAccountHTML = renderAccountHTML;
  API.statusChipHTML = statusChipHTML;

  /* 只更新状态文字与徽标，**不重建整页**。
     同步状态会在后台自行变化（比如防抖同步完成），如果那时整页重渲染，
     用户正在填的登录表单会被清空 —— 所以状态刷新必须走这条路。 */
  function patchStatus() {
    var bar = document.querySelector(".cs-syncbar");
    if (bar) {
      var dot = bar.querySelector(".cs-dot");
      if (dot) dot.className = "cs-dot " + (st.state === "synced" ? "ok" : (st.state === "error" ? "bad" : "wait"));
      var txt = bar.querySelector("[data-cs-statustext]");
      if (txt) txt.textContent = (STATE_TEXT[st.state] || st.state) + (st.message ? " · " + st.message : "");
    }
    var chip = document.getElementById("csChip");
    if (chip) chip.innerHTML = statusChipHTML();
  }
  API.patchStatus = patchStatus;

  /* ---------- 表单交互 ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function val(name) {
    var el = document.querySelector('[data-cs="' + name + '"]');
    return el ? String(el.value || "").trim() : "";
  }
  function msg(text, bad) {
    var el = document.querySelector("[data-cs-msg]");
    if (!el) return;
    el.textContent = text || "";
    el.className = "cs-msg" + (bad ? " bad" : (text ? " good" : ""));
  }
  function busyBtn(btn, on, label) {
    if (!btn) return;
    if (on) {
      btn.dataset._t = btn.textContent;
      btn.textContent = label || "请稍等…";
      btn.disabled = true;
    } else {
      if (btn.dataset._t) btn.textContent = btn.dataset._t;
      btn.disabled = false;
    }
  }
  function showStep(name, on) {
    var el = document.querySelector('[data-cs-step="' + name + '"]');
    if (el) el.hidden = !on;
  }
  function rerender() {
    var host = document.getElementById("csAccount");
    if (host) host.innerHTML = renderAccountHTML();
    /* 顶栏的状态小徽标跟着变 */
    var chip = document.getElementById("csChip");
    if (chip) chip.innerHTML = statusChipHTML();
  }
  API.rerender = rerender;

  /* 统一的「按钮 → 忙碌 → 成功/失败提示」包装。
     返回的 Promise **resolve 成功与否（true/false）**，不 reject ——
     这样调用方只在真的成功时才展开下一步，失败时不会出现「明明没发出去却让你填验证码」。 */
  function run(btn, label, fn, okMsg) {
    busyBtn(btn, true, label);
    msg("");
    return fn()
      .then(function () { busyBtn(btn, false); if (okMsg) msg(okMsg); rerender(); return true; })
      .catch(function (e) {
        busyBtn(btn, false);
        msg(errText(e), true);
        return false;
      });
  }

  var ACTIONS = {
    "signin-pw": function (btn) {
      var email = val("email-pw"), pw = val("pw");
      if (!email || !pw) return msg("请把邮箱和密码都填上", true);
      run(btn, "登录中…", function () { return Auth.signInWithPassword(email, pw); }, "登录成功，正在同步进度…");
    },
    "goto-reset": function () {
      document.querySelectorAll(".cs-pane").forEach(function (p) { p.hidden = p.getAttribute("data-cs-pane") !== "reset"; });
      document.querySelectorAll(".cs-tab").forEach(function (t) { t.classList.remove("on"); });
      msg("");
    },
    "otp-send-login": function (btn) {
      var email = val("email-otp");
      if (!email) return msg("请先填邮箱", true);
      run(btn, "发送中…", function () { return Auth.sendOtp(email); }, "验证码已发出，请查看邮箱（也可能在垃圾邮件里）")
        .then(function (ok) { if (ok) showStep("otp-login", true); });
    },
    "otp-verify-login": function (btn) {
      var email = val("email-otp"), code = val("code-otp");
      if (!code) return msg("请填邮件里的验证码", true);
      run(btn, "验证中…", function () { return Auth.verifyOtpLogin(email, code); }, "登录成功，正在同步进度…");
    },
    "otp-send-signup": function (btn) {
      var email = val("email-su");
      if (!email) return msg("请先填邮箱", true);
      run(btn, "发送中…", function () { return Auth.sendOtp(email); }, "")
        .then(function (ok) {
          if (!ok) return;
          showStep("signup", true);
          /* 这个邮箱已经注册过 → 不暴露「账号是否存在」，只引导去登录 */
          if (pending.isExistingUser) {
            msg("这个邮箱已经有账号了。请回到「用密码登录」或「用邮箱验证码登录」直接登录即可。", true);
          } else {
            msg("验证码已发出，请查看邮箱（也可能在垃圾邮件里）");
          }
        });
    },
    "otp-verify-signup": function (btn) {
      var email = val("email-su"), code = val("code-su"), pw = val("pw-su");
      if (!code) return msg("请填邮件里的验证码", true);
      if (!pw || pw.length < 6) return msg("密码至少 6 位", true);
      run(btn, "注册中…", function () { return Auth.verifyOtpSignup(email, code, pw); }, "注册成功，正在同步进度…");
    },
    "reset-send": function (btn) {
      var email = val("email-rs");
      if (!email) return msg("请先填邮箱", true);
      run(btn, "发送中…", function () { return Auth.resetPasswordForEmail(email); }, "验证码已发出，请查看邮箱")
        .then(function (ok) { if (ok) showStep("reset", true); });
    },
    "reset-done": function (btn) {
      var code = val("code-rs"), pw = val("pw-rs");
      if (!code) return msg("请填邮件里的验证码", true);
      if (!pw || pw.length < 6) return msg("新密码至少 6 位", true);
      run(btn, "处理中…", function () { return Auth.completePasswordReset(code, pw); }, "密码已更新，已为你登录");
    },
    "sync-now": function (btn) {
      run(btn, "同步中…", function () { return syncNow("manual").then(function (ok) { if (!ok) throw { message: st.message || "同步没成功，请稍后再试" }; }); }, "同步完成");
    },
    "pw-change-open": function () { showStep("pw-change", true); },
    "pw-change-done": function (btn) {
      var o = val("pw-old"), n = val("pw-new");
      if (!o || !n) return msg("两个密码都要填", true);
      if (n.length < 6) return msg("新密码至少 6 位", true);
      run(btn, "保存中…", function () { return Auth.resetPasswordForOld(o, n); }, "密码已修改")
        .then(function (ok) { if (ok) showStep("pw-change", false); });
    },
    "signout": function (btn) {
      run(btn, "退出中…", function () { return Auth.signOut(); }, "已退出，进度仍留在这台设备上");
    }
  };

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var tab = t.closest(".cs-tab");
    if (tab) {
      var name = tab.getAttribute("data-cs-tab");
      document.querySelectorAll(".cs-tab").forEach(function (x) { x.classList.toggle("on", x === tab); });
      document.querySelectorAll(".cs-pane").forEach(function (p) { p.hidden = p.getAttribute("data-cs-pane") !== name; });
      msg("");
      return;
    }
    var btn = t.closest("[data-cs-act]");
    if (!btn) return;
    var fn = ACTIONS[btn.getAttribute("data-cs-act")];
    if (fn) { e.preventDefault(); fn(btn); }
  });
})();
