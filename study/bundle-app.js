/* bundle-app.js — tools/rebuild-app-bundle.js 生成 */

/* ==== taxonomy.js ==== */

/* ============================================================
   学科体系与能力等级（taxonomy.js）
   ------------------------------------------------------------
   这是全站唯一的「学科归属」与「能力等级」数据源，浏览器与 Node 双用：
     · 浏览器：index.html 在 app.js 之前引入，界面按它渲染
     · Node  ：validate.js / smoke-test.js 直接 require，用于强制校验

   三条硬规则（改之前务必读）：
     1. 每门课程必须且只能归属一个学科，登记在 subjects[].ids 里。
        少登记 → 首页不显示、校验直接报错；
        重复登记 → 校验直接报错（避免同一门课出现两次）。
     2. 每门课程必须登记 courseLevel，缺失即报错（防止新增课程漏标等级）。
     3. 学科 id 与课程 id 一旦发布不可更改：学科 id 出现在 #/subject/:id 链接里，
        课程 id 是 localStorage 进度的键，改了会让学习者进度对不上。
   ============================================================ */
(function () {
  "use strict";

  /* ------------------------------------------------------------
     一、能力等级：全站统一的进阶标尺（L0 → L5）
     can   = 到这个等级能做到什么
     evid  = 怎么才算真的到了（可验收的证据）
     ------------------------------------------------------------ */
  var LEVELS = [
    { id: "L0", name: "认知入门",
      goal: "知道有什么、为什么存在",
      can: "看懂全局图景和术语，能说清这块知识解决什么问题、在系统里处在什么位置。",
      evid: "能用自己的话向别人讲清这个领域包含哪几块、彼此什么关系，不用看资料。" },
    { id: "L1", name: "会读会改",
      goal: "看得懂、改得对",
      can: "读懂别人写的代码与配置，在既有框架里按要求改对一处逻辑，不引入新问题。",
      evid: "给定一段陌生代码，能逐行说清它在干什么，并完成一个指定的小改动。" },
    { id: "L2", name: "能独立实现",
      goal: "不看答案能写出来",
      can: "拿到一个明确需求，能自己设计接口、写完整实现并自测通过。",
      evid: "合上参考答案，从空文件写出一个能跑的函数或小程序，边界情况也考虑到。" },
    { id: "L3", name: "能设计取舍",
      goal: "能选型、能拆模块",
      can: "面对一个模糊需求，能拆成模块、选出技术方案，并说清每个选择的代价。",
      evid: "能画出一张自己的模块图，并回答「为什么不用另一种方案」。" },
    { id: "L4", name: "能调优排障",
      goal: "能定位复杂故障、能优化",
      can: "面对「跑不通 / 偶发 / 变慢」这类复杂现象，能有方法地定位根因并做性能与稳定性优化。",
      evid: "能用工具取证、缩小范围、定位到根因，并给出可复现的验证方式。" },
    { id: "L5", name: "能定规范带人",
      goal: "能定标准、能带人",
      can: "把经验沉淀成规范与工具，讲清深层取舍，带别人少走弯路。",
      evid: "能写出被他人复用的规范/工具/文档，并能讲透原理与反例。" }
  ];

  /* ------------------------------------------------------------
     二、学科：全站最高一层分类
     ids 的顺序 = 建议学习顺序（先易后难、先基础后应用）
     ------------------------------------------------------------ */
  var SUBJECTS = [
    {
      id: "method", name: "学习方法与训练闭环", badge: "方法", cls: "sb-method",
      note: "先学会怎么学，再谈学什么",
      desc: "绝大多数人卡住不是因为不够努力，而是因为方法错位：只看不写、只写不复盘、学完不连接。" +
            "这个学科先把「怎么学」讲透——目标拆解、编码阶梯、主动回忆、间隔复习、知识连接、故障排查方法论与项目验收标准。",
      goal: "建立一套自己能长期跑下去的学习与复盘流程，知道每一小时该干什么、怎么判断自己真的会了。",
      ids: ["learn", "lad", "path"]
    },
    {
      id: "fund", name: "编程基础：C 语言主线", badge: "C 基础", cls: "sb-fund",
      note: "从零到能独立写出程序",
      desc: "嵌入式的地基是 C。这个学科从「变量是什么」一路讲到指针、结构体、文件与嵌入式 C 专项，" +
            "并把「读代码 → 补代码 → 改代码 → 写函数 → 独立程序」的编码阶梯嵌进每一门课。",
      goal: "能独立写出一个几百行的 C 程序，自己设计函数接口、处理边界、用指针操作内存，并能读懂陌生代码。",
      ids: ["zero", "c", "drill", "emb"]
    },
    {
      id: "csbase", name: "计算机通用基础", badge: "计算机", cls: "sb-csbase",
      note: "科班底色：数据结构 · 操作系统 · 工具链",
      desc: "这层是「程序员通用底座」：数据结构与算法决定你能不能写出不慢的代码，" +
            "计算机与操作系统原理决定你面对内存、进程、调度、缓存时是猜还是懂，Linux 系统与工具链决定你在命令行里能不能干活。",
      goal: "能手写常见数据结构与算法，能解释进程/线程/内存/缓存的基本机制，熟练使用 Linux 命令行与构建工具。",
      ids: ["ds", "cos", "linsys"]
    },
    {
      id: "hardware", name: "硬件与芯片底层", badge: "硬件", cls: "sb-hardware",
      note: "看懂电路、看懂芯片、看懂启动",
      desc: "嵌入式区别于纯软件的地方就在这里：信号怎么走、电平怎么算、芯片上电后第一条指令从哪来。" +
            "学科覆盖数电模电基础、PCB 设计入门、单片机方向入门、ARM 架构与启动链路。",
      goal: "能看懂原理图与数据手册，独立完成一块 MCU 板的最小系统设计与调试，能讲清从 BootROM 到 main 的完整启动链路。",
      ids: ["hw", "pcb", "mcu", "arm"]
    },
    {
      id: "system", name: "系统、内核与通信", badge: "系统", cls: "sb-system",
      note: "Linux · RTOS · 协议栈 · 驱动",
      desc: "设备真正跑起来的地方：Linux 上的文件 IO、并发、网络编程；RTOS 上的任务划分与实时性；" +
            "总线协议、TCP/IP、BLE 的完整链路；以及门槛最高但最稀缺的内核与驱动开发。",
      goal: "能独立开发一个带网络通信与本地存储的 Linux 应用，能设计一个多任务 RTOS 系统，能写出字符设备驱动并改设备树。",
      ids: ["lx", "rtos", "proto", "net", "ble", "drv"]
    },
    {
      id: "host", name: "上位机与跨平台开发", badge: "上位机", cls: "sb-host",
      note: "C++ 语言机制 + Qt 工程实战",
      desc: "「懂下位机又懂上位机」是最有辨识度的差异化路线。这个学科先把 C++ 的语言机制打透" +
            "（内存管理、面向对象、标准库、RAII 与移动语义），再讲 Qt 的元对象系统、信号槽、界面组件、事件处理与跨平台构建。",
      goal: "能独立交付一个上位机软件：串口或网络收发 + 协议解析 + 实时数据面板 + 波形显示 + 双平台发布。",
      ids: ["cpp", "qt", "cvq"]
    },
    {
      id: "harness", name: "AI Harness 工程", badge: "AI 工具", cls: "sb-harness",
      note: "把 AI 变成能干活的工程系统",
      desc: "AI 工具用得好不好，差别不在提示词，而在「Harness」——包在模型外面的那一整套工程系统：" +
            "配置与提供方管理、插件与 MCP、共享记忆与上下文管理、构建门禁与测试台、补丁包与版本升级、故障排查。" +
            "这个学科从零讲到能给 Harness 写自己的扩展。",
      goal: "能独立安装配置一套 AI Harness，能读懂它的配置树与插件树，能写自己的插件与工具，并在它出故障时用方法定位根因。",
      ids: ["harness", "hxp", "hxs"]
    },
    {
      id: "engineer", name: "工程质量与产品化", badge: "工程", cls: "sb-engineer",
      note: "从能跑，到能量产",
      desc: "能跑通的代码和能交付的产品之间隔着整个工程学科：构建与部署、测试与质量规范、调试与仪器、" +
            "可靠性设计与 OTA 安全、低功耗、完整项目生命周期，以及从零写一个上千行项目的实战训练。",
      goal: "能把一个想法做成可交付、可维护、可量产的工程：有构建脚本、有测试、有版本管理、有故障预案、有量产与老化测试。",
      ids: ["build", "qa", "dbg", "camp", "bigcode", "proj2", "proj", "rel", "lowp", "life"]
    },
    {
      id: "career", name: "求职与职业发展", badge: "求职", cls: "sb-career",
      note: "把能力翻译成 offer",
      desc: "技术到了不等于拿得到 offer。这个学科覆盖笔试与在线编程、手撕代码、连续追问、" +
            "项目深挖、故障排查题、系统设计题、模拟面试与复盘，以及简历、作品集和职业路线选择。",
      goal: "能完整走完一轮技术面试：讲清项目、扛住追问、写出代码、答上系统设计；同时知道自己的目标岗位按什么标准筛选人、还差哪几项、下一步补什么。",
      ids: ["iv", "ivx", "career", "job", "ivreal", "eng", "rus"]
    }
  ];

  /* ------------------------------------------------------------
     三、课程等级：读作「学完这门课，你大致到达这个等级」
     这是给学习者的路标，不是考核；用于首页阶梯视图与课程页展示。
     ------------------------------------------------------------ */
  var COURSE_LEVEL = {
    /* 方法 */
    learn: "L0", lad: "L2", path: "L0",
    /* C 语言主线 */
    zero: "L0", c: "L1", drill: "L1", emb: "L2",
    /* 计算机通用基础 */
    ds: "L2", cos: "L1", linsys: "L1",
    /* 硬件与芯片底层 */
    hw: "L0", pcb: "L1", mcu: "L2", arm: "L3",
    /* 系统、内核与通信 */
    lx: "L2", rtos: "L3", proto: "L2", net: "L3", ble: "L2", drv: "L3",
    /* 上位机与跨平台 */
    cpp: "L2", qt: "L2", cvq: "L3",
    /* AI Harness 工程 */
    harness: "L3", hxp: "L3", hxs: "L3",
    /* 工程质量与产品化 */
    build: "L2", qa: "L2", dbg: "L3", camp: "L3", bigcode: "L3", proj2: "L3",
    proj: "L3", rel: "L4", lowp: "L3", life: "L4",
    /* 求职与职业发展 */
    iv: "L2", ivx: "L4", career: "L1", job: "L2", ivreal: "L3", eng: "L1", rus: "L1"
  };

  var TAXONOMY = { levels: LEVELS, subjects: SUBJECTS, courseLevel: COURSE_LEVEL };

  /* 浏览器与 Node 双用：Node 侧 validate.js 会先设 global.window = {} */
  if (typeof window !== "undefined") window.TAXONOMY = TAXONOMY;
  if (typeof module !== "undefined" && module.exports) module.exports = TAXONOMY;
})();


/* ==== code-lang.js ==== */

/* ============================================================
   代码语言判定器（共享模块）
   ------------------------------------------------------------
   为什么单独成一个文件：这套判定原先在 app.js 与 ../case-regression.js
   里**各写了一份**，只能靠注释约定同步，已经因此出现过「页面上不给实验室
   按钮、回归脚本却把它当 C 跑」的口径分裂。改成单一实现 + 双出口复用：

     · 浏览器：index.html 在 app.js 之前用 <script> 引入，挂到 window.CODE_LANG
     · Node  ：require("./embedded-study/code-lang.js") 取 module.exports

   背景：虚拟实验室（sim-core.js）是**教学用 C 子集解释器**，只认 C。
   遇到 C++ 的 class/template/std::、Qt 的 Q_OBJECT、或 JS/Shell/配置片段，
   解析器必然报错；此时给一个「点了就报语法错」的按钮是误导，
   所以主动识别出来，改为展示说明条。

   判定原则：**偏向漏判**——宁可漏判（照旧给按钮）也不要误判
   （误判会把纯 C 代码挡在门外，白白损失一个有用功能）。
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 一、C++ / Qt ----------
     实测踩过的两个坑（都已绕开）：
       · /virtual/ 会误伤 Yocto 的 `bitbake -c menuconfig virtual/kernel`（那是命令不是关键字）
       · /connect\(/ 会误伤 POSIX socket 的 `connect(fd, ...)`（C 里太常见）
     所以这两个一律要求「有 C++ 语境」才算数。 */
  function looksCppOrQt(code) {
    var s = String(code);
    /* 强特征：出现任一条就认定不是 C 子集能处理的代码 */
    var strong = [
      /#include\s*[<"]Q[A-Za-z]+/,          // Qt 头文件，如 <QApplication> <QSerialPort>
      /\bQ_OBJECT\b/,                        // moc 元对象宏
      /\bstd::/,                             // 标准库命名空间
      /\btemplate\s*</,                      // 模板
      /\bclass\s+[A-Za-z_]\w*\s*(:|\{)/,     // 类定义（C 里 class 不是关键字，这里必是 C++）
      /\bnamespace\s+[A-Za-z_]/,             // 命名空间
      /\bnew\s+[A-Za-z_]\w*\s*[\(\[;]/,      // new 表达式（要求后面紧跟 ( [ ; ，避开 "new line" 之类）
      /\bpublic\s+Q[A-Za-z]/,                // 继承 Qt 基类，如 public QObject
      /\bQString\b|\bQList\b|\bQVector\b|\bQVariant\b|\bQByteArray\b/,
      /\bqDebug\s*\(/,                       // Qt 调试输出
      /\bemit\s+[A-Za-z_]/,                  // 信号发射（要求后面跟标识符）
      /&[A-Za-z_]\w*\s*::\s*/,               // 取成员函数地址/引用限定，如 &Class::slot
      /\[\s*[&=]?\s*\]\s*\(/,                // lambda 捕获列表 [&] [=] [] 紧跟 (
      /(^|\n)\s*(public|private|protected)\s*:/ // 访问控制段（行首才算，避免 "a.b:public" 之类）
    ];
    for (var i = 0; i < strong.length; i++) if (strong[i].test(s)) return true;

    /* 需要 C++ 语境的弱特征：单独出现时在 C 里也合法，必须成对/带限定才判定 */
    /* virtual：C++ 关键字是 `virtual void f()` / `virtual ~T()`；Yocto 的 virtual/kernel 不算 */
    if (/\bvirtual\s+(~?[A-Za-z_]\w*\s*[\(&*:]|void\s|int\s|bool\s|auto\s)/.test(s)) return true;
    if (/\boverride\b/.test(s)) return true;
    /* connect：Qt 的是 connect(a, SIGNAL(...), ...) 或 connect(a, &X::sig, ...)，都很像函数调用；
       但 POSIX 的 connect(sockfd, addr, len) 也长这样。用「第二个参数是不是函数指针/信号宏」区分。 */
    if (/\bconnect\s*\([^)]*,\s*(SIGNAL|SLOT)\s*\(/.test(s)) return true;
    if (/\bconnect\s*\([^)]*,\s*&[A-Za-z_]\w*\s*::/.test(s)) return true;
    if (/\bconnect\s*\([^)]*,\s*[A-Za-z_]\w*\s*::\s*[A-Za-z_]\w*/.test(s)) return true;
    /* 标准库容器/字符串：要求带模板参数写法 */
    if (/\bstd\s*::/.test(s)) return true;
    if (/(^|[^\w.])(vector|map|set|list|deque|queue|stack|unordered_map|unordered_set|string)\s*</.test(s)) return true;
    if (/(^|[^\w.])cout\s*</.test(s) || /(^|[^\w.])cin\s*>>/.test(s)) return true;
    if (/(^|[^\w.])endl\b/.test(s)) return true;
    return false;
  }

  /* ---------- 二、非 C 类语法（JS / Shell / PowerShell / JSON 配置） ----------
     三个已踩的坑，改规则前务必看：
       1) 测 => 之前必须**剔掉含 @case / @in 的整行**。本站编程任务的用例标记
          就写作 `// @case add(2,3) => 5`，而且常写在块注释里（` *   // @case ...`），
          不剔除会把 8 段正经 C 任务判成 JS（实测误伤过）。
       2) shell 关键字必须**独行**：C 里 `fi` 是常见变量名（`fi = fo = NULL;`）。
       3) JSON 判据不能写成「任意两行键值对」：BLE 的十六进制 dump
          （`AD1: 02 01 06`）会中招，实测误伤 8 段。
     另：数组方法等 JS 惯用特征用 \. 匹配，避开 C 的结构体指针调用 `->`。 */
  function looksNonC(code) {
    var s = String(code);
    var body = s.replace(/^[^\n]*@(case|in)\b[^\n]*$/gm, "");
    var strong = [
      /\bmodule\.exports\b/,                        // CommonJS
      /\brequire\s*\(\s*["']/,                       // CommonJS / Node
      /\bexport\s+(default|const|function|class|let|var)\b/,  // ESM
      /=>/,                                          // 箭头函数（上一步已剔掉 @case 行）
      /\bawait\s+[A-Za-z_$]/,                        // async/await
      /^[ \t]*#!.*\b(bash|sh|zsh)\b/m,               // shebang
      /^[ \t]*(const|let)\s+[A-Za-z_$][\w$]*\s*=/m,  // C 里这样写就是语法错
      /^[ \t]*(export|sudo|apt|apt-get|systemctl|npm|pnpm|yarn|node|npx)\s+/m,  // Shell 命令
      /^[ \t]*(then|fi|esac|done)[ \t]*;?[ \t]*$/m,  // shell 关键字必须独行（见坑 2）
      /^[ \t]*\$env:/m,                              // PowerShell 环境变量
      /\bStart-Process\b|\bGet-ChildItem\b|\bCopy-Item\b|\b-Confirm:\$/,  // PowerShell cmdlet
      /* JS 惯用写法 */
      /\.(forEach|map|filter|reduce|push|pop|slice|splice|join|indexOf|includes)\s*\(/,
      /\bJSON\.(parse|stringify)\b/,
      /\bObject\.(keys|assign|values|defineProperty|entries)\b/,
      /\bArray\.isArray\b/,
      /\btypeof\s+[A-Za-z_$][\w$]*\s*(===|!==|==|!=)/
    ];
    for (var i = 0; i < strong.length; i++) if (strong[i].test(body)) return true;
    /* JSON 配置：以 { 或 [ 开头，且至少两个 "键": 形式（见坑 3） */
    if (/^[ \t]*[\{\[]/.test(body) && (body.match(/"[A-Za-z_][\w.-]*"\s*:/g) || []).length >= 2) return true;
    return false;
  }

  /* ---------- 三、给「不在实验室运行」的说明条起个准确定语 ---------- */
  function kindOf(code) {
    var s = String(code);
    if (/^[ \t]*#!.*\b(bash|sh|zsh)\b/m.test(s) ||
        /^[ \t]*(export|sudo|apt|apt-get|systemctl|npm|pnpm|yarn|node|npx)\s+/m.test(s)) return "Shell 命令";
    if (/^[ \t]*\$env:/m.test(s) || /\bStart-Process\b|\bGet-ChildItem\b/.test(s)) return "PowerShell 命令";
    if (/=>|\brequire\s*\(|\bmodule\.exports\b|\bexport\s+(default|const)\b/.test(s)) return "JavaScript 代码";
    return "配置片段";
  }

  var API = { looksCppOrQt: looksCppOrQt, looksNonC: looksNonC, kindOf: kindOf };

  if (typeof window !== "undefined") window.CODE_LANG = API;
  if (typeof module !== "undefined" && module.exports) module.exports = API;
})();


/* ==== cloud-config.js ==== */

/* ============================================================
   云服务公共配置（平台下发的 publicConfig）

   这三个值都是「可以公开」的，写进前端源码是设计如此：
     resourceId     资源编号，只是标识
     endpoint       本应用的发布域名（云服务的唯一正确来源，不能改成别的）
     publishableKey 只标识「是哪个应用」，本身不带任何权限
   服务端会额外校验请求来源域名（Origin 必须与发布域名完全一致），
   所以这个 key 泄露出去也无法被别的网站冒用。

   真正有权限的密钥永远留在服务端，不会出现在这里。
   ============================================================ */
window.CLOUD_PUBLIC_CONFIG = {
  resourceId: "wbcs_hGjHuWGjSspq1HohJqvOhZ",
  endpoint: "https://embedded-encyclopedia.app.workbuddy.host",
  publishableKey: "wbpk_xOYW6atOHyPJyE7hWttY6G_16CknMhoUCY7UULFZggzIcke9oYS6Hl3"
};


/* ==== cloud-sync.js ==== */

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


/* ==== sim-core.js ==== */

/* ============================================================
   虚拟仿真引擎（一）：C 教学子集 —— 词法分析 + 语法分析
   ------------------------------------------------------------
   说明：这是一个「教学用 C 子集解释器」，不是真实编译器。
   目标是在浏览器里直接运行课程中的示例代码，并支持逐行单步、
   变量监视、调用栈观察。支持范围与限制见 lab.js 的「能力边界」页。

   公开接口：window.CSimParse.parse(src) -> { unit, error, source }
   ============================================================ */
(function () {
  "use strict";

  var KEYWORDS = ("int char short long float double void unsigned signed const static struct union enum typedef "
    + "if else while do for switch case default break continue return sizeof goto register volatile extern inline").split(" ");

  var PUNCTS = [
    "<<=", ">>=", "...", "->", "++", "--", "<<", ">>", "<=", ">=", "==", "!=", "&&", "||",
    "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=",
    "(", ")", "[", "]", "{", "}", ";", ",", ".", "&", "*", "+", "-", "/", "%", "=", "<", ">", "!", "~", "^", "|", "?", ":"
  ];

  function ParseError(msg, line) {
    this.message = msg;
    this.line = line || 0;
    this.isSimError = true;
  }
  ParseError.prototype.toString = function () { return this.message; };

  function isIdStart(c) { return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_"; }
  function isIdChar(c) { return isIdStart(c) || (c >= "0" && c <= "9"); }
  function isDigit(c) { return c >= "0" && c <= "9"; }

  /* ---------------- 词法分析 ---------------- */
  function Lexer(src) {
    this.src = src;
    this.i = 0;
    this.line = 1;
    this.toks = [];
    /* 预置常用宏：嵌入式的代码经常会直接用 NULL / true / false / EOF */
    this.macros = {
      NULL: "0", true: "1", false: "0",
      /* getchar() 读到输入末尾返回它；标准 C 里多数实现是 -1 */
      EOF: "(-1)",
      /* 常见编译器修饰宏（CMSIS / GCC 风格）：仿真里直接展开为空，不影响语义 */
      "__IO": "", "__I": "", "__O": "", "__IM": "", "__OM": "", "__IOM": "",
      "__WEAK": "", "__weak": "", "__INLINE": "", "__STATIC_INLINE": "",
      "__used": "", "__unused": "", "__packed": "", "__aligned": ""
    };
  }

  Lexer.prototype.eatEsc = function () {
    /* 位于反斜杠之后，返回 {v, len} */
    var c = this.src[this.i];
    var simple = { n: 10, t: 9, r: 13, "0": 0, a: 7, b: 8, f: 12, v: 11, "\\": 92, "'": 39, '"': 34, "?": 63 };
    if (Object.prototype.hasOwnProperty.call(simple, c)) return { v: simple[c], len: 1 };
    if (c === "x" || c === "X") {
      var h = "", k = this.i + 1;
      while (k < this.src.length && /[0-9a-fA-F]/.test(this.src[k])) { h += this.src[k]; k++; }
      if (!h) throw new ParseError("非法的十六进制转义 \\x" + (this.src[this.i + 1] || ""), this.line);
      return { v: parseInt(h, 16) & 0xff, len: 1 + h.length };
    }
    if (c >= "0" && c <= "7") {
      var o = "", k2 = this.i;
      while (k2 < this.src.length && o.length < 3 && this.src[k2] >= "0" && this.src[k2] <= "7") { o += this.src[k2]; k2++; }
      return { v: parseInt(o, 8) & 0xff, len: o.length };
    }
    return { v: c.charCodeAt(0), len: 1 };
  };

  Lexer.prototype.run = function () {
    var s = this.src, n = s.length;
    while (this.i < n) {
      var c = s[this.i];

      /* 换行 */
      if (c === "\n") { this.line++; this.i++; continue; }
      if (c === " " || c === "\t" || c === "\r") { this.i++; continue; }

      /* 预处理指令行：收集 #define，忽略其他 */
      if (c === "#") {
        var start = this.i, eol = s.indexOf("\n", this.i);
        if (eol < 0) eol = n;
        var raw = s.slice(start, eol);
        this.collectMacro(raw);
        this.i = eol;
        continue;
      }

      /* 注释 */
      if (c === "/" && s[this.i + 1] === "/") {
        var e2 = s.indexOf("\n", this.i); this.i = e2 < 0 ? n : e2; continue;
      }
      if (c === "/" && s[this.i + 1] === "*") {
        var end = s.indexOf("*/", this.i + 2);
        if (end < 0) throw new ParseError("注释没有闭合（缺少 */）", this.line);
        for (var k = this.i; k < end; k++) if (s[k] === "\n") this.line++;
        this.i = end + 2; continue;
      }

      /* 字符串 */
      if (c === '"') {
        var ln = this.line, val = "", j = this.i + 1;
        while (j < n && s[j] !== '"') {
          if (s[j] === "\\") { this.i = j + 1; var e = this.eatEsc(); val += String.fromCharCode(e.v); j = this.i + e.len; }
          else { if (s[j] === "\n") { this.line++; } val += s[j]; j++; }
        }
        if (j >= n) throw new ParseError("字符串没有闭合", ln);
        this.toks.push({ k: "str", v: val, line: ln });
        this.i = j + 1; continue;
      }

      /* 字符常量 */
      if (c === "'") {
        var ln2 = this.line, j2 = this.i + 1;
        if (s[j2] === "\\") {
          this.i = j2 + 1; var e3 = this.eatEsc();
          var after = this.i + e3.len;
          if (s[after] !== "'") throw new ParseError("字符常量格式不正确", ln2);
          this.toks.push({ k: "num", v: e3.v, isFloat: false, line: ln2, charLit: true });
          this.i = after + 1; continue;
        }
        if (s[j2] === "'") throw new ParseError("字符常量为空", ln2);
        this.toks.push({ k: "num", v: s.charCodeAt(j2), isFloat: false, line: ln2, charLit: true });
        this.i = j2 + 2; continue;
      }

      /* 数字 */
      if (isDigit(c) || (c === "." && isDigit(s[this.i + 1]))) {
        var ln3 = this.line, st = this.i, isF = false;
        if (c === "0" && (s[this.i + 1] === "x" || s[this.i + 1] === "X")) {
          this.i += 2;
          while (this.i < n && /[0-9a-fA-F]/.test(s[this.i])) this.i++;
        } else if (c === "0" && (s[this.i + 1] === "b" || s[this.i + 1] === "B")) {
          this.i += 2;
          while (this.i < n && (s[this.i] === "0" || s[this.i] === "1")) this.i++;
        } else {
          while (this.i < n && isDigit(s[this.i])) this.i++;
          if (s[this.i] === ".") { isF = true; this.i++; while (this.i < n && isDigit(s[this.i])) this.i++; }
          if (s[this.i] === "e" || s[this.i] === "E") {
            isF = true; this.i++;
            if (s[this.i] === "+" || s[this.i] === "-") this.i++;
            while (this.i < n && isDigit(s[this.i])) this.i++;
          }
        }
        var text = s.slice(st, this.i);
        /* 后缀 u/U/l/L/f/F：必须记下来。2147483647L 在 C 里是 long 字面量，
           如果当成 int 处理，"用 L 后缀避开 32 位溢出" 这个标准写法就会失效。 */
        var suffix = "";
        while (this.i < n && /[uUlLfF]/.test(s[this.i])) { suffix += s[this.i]; this.i++; }
        var value;
        if (isF) value = parseFloat(text);
        else if (/^0[xX]/.test(text)) value = parseInt(text.slice(2), 16);
        else if (/^0[bB]/.test(text)) value = parseInt(text.slice(2), 2);
        else if (/^0[0-7]+$/.test(text)) value = parseInt(text.slice(1), 8);
        else value = parseInt(text, 10);
        this.toks.push({ k: "num", v: value, isFloat: isF, text: text, suffix: suffix, line: ln3 });
        continue;
      }

      /* 标识符 / 关键字 */
      if (isIdStart(c)) {
        var st2 = this.i, ln4 = this.line;
        while (this.i < n && isIdChar(s[this.i])) this.i++;
        var word = s.slice(st2, this.i);
        this.toks.push({ k: KEYWORDS.indexOf(word) >= 0 ? "kw" : "id", v: word, line: ln4 });
        continue;
      }

      /* 运算符与括号 */
      var matched = null;
      for (var p = 0; p < PUNCTS.length; p++) {
        if (s.startsWith(PUNCTS[p], this.i)) { matched = PUNCTS[p]; break; }
      }
      if (!matched) {
        var hint = /[\u3000-\u303f\u4e00-\u9fff\uff00-\uffef]/.test(c)
          ? "代码里出现了中文字符“" + c + "”：说明文字请写在注释里（// 或 /* */），要当输出内容就放进字符串引号中。"
          : "无法识别的字符：“" + c + "”";
        throw new ParseError(hint, this.line);
      }
      this.toks.push({ k: "punc", v: matched, line: this.line });
      this.i += matched.length;
    }

    /* 宏展开（对象式宏，令牌级替换） */
    this.toks = this.expandMacros(this.toks);
    this.toks.push({ k: "eof", v: "<eof>", line: this.line });
    return this.toks;
  };

  Lexer.prototype.collectMacro = function (raw) {
    var m = /^\s*#\s*define\s+([A-Za-z_][A-Za-z0-9_]*)\s*(.*)$/.exec(raw);
    if (!m) return;                      /* #include / #pragma / #if 等一律忽略 */
    var name = m[1], rest = m[2];
    if (rest.indexOf("(") === 0) return; /* 带参宏暂不支持 */
    this.macros[name] = rest.replace(/\s+$/, "");
  };

  Lexer.prototype.expandMacros = function (toks) {
    var out = [], self = this;
    /* 返回 null 表示“该宏展开为空”（例如 __IO），需要在结果里彻底剔除 */
    function expand(tok, depth) {
      if (tok.k !== "id" || depth > 8) return [tok];
      if (!Object.prototype.hasOwnProperty.call(self.macros, tok.v)) return [tok];
      var text = self.macros[tok.v];
      if (text === "" || text == null) return null;
      var sub = new Lexer(text);
      var st = sub.run();
      var arr = [], emptied = false;
      st.slice(0, st.length - 1).forEach(function (t) {
        var r = expand(t, depth + 1);
        if (r === null) { emptied = true; return; }
        arr = arr.concat(r);
      });
      if (arr.length) return arr;
      return emptied ? null : [tok];
    }
    toks.forEach(function (t) {
      var r = expand(t, 0);
      if (r !== null) out = out.concat(r);
    });
    return out;
  };

  /* ---------------- 类型表示 ---------------- */
  function mkType(base) {
    return { base: base, ptr: 0, structName: null, dims: null };
  }
  function cloneType(t) {
    return { base: t.base, ptr: t.ptr, structName: t.structName, dims: t.dims ? t.dims.slice() : null };
  }

  /* ---------------- 预置类型别名（stdint.h 等，嵌入式代码大量使用） ---------------- */
  var BUILTIN_TYPEDEFS = {
    "int8_t": "char", "uint8_t": "unsigned char",
    "int16_t": "short", "uint16_t": "unsigned short",
    "int32_t": "int", "uint32_t": "unsigned int",
    "int64_t": "long", "uint64_t": "unsigned long",
    "size_t": "unsigned int", "ssize_t": "int",
    "uintptr_t": "unsigned int", "intptr_t": "int",
    "bool": "int"
  };

  /* ---------------- 语法分析 ---------------- */
  function Parser(toks, macros) {
    this.toks = toks;
    this.i = 0;
    this.typedefs = {};     /* 别名 -> 类型 */
    this.structs = {};      /* struct 名 -> { name, members:[{name,type}] } */
    this.enums = {};        /* 枚举常量 -> 数值 */
    this.macros = macros || {};
    var self = this;
    Object.keys(BUILTIN_TYPEDEFS).forEach(function (k) {
      self.typedefs[k] = mkType(BUILTIN_TYPEDEFS[k]);
    });
  }

  Parser.prototype.peek = function (k) { return this.toks[this.i + (k || 0)]; };
  Parser.prototype.next = function () { return this.toks[this.i++]; };
  Parser.prototype.at = function (v) { var t = this.peek(); return t && t.v === v; };
  Parser.prototype.atKw = function (v) { var t = this.peek(); return t && t.k === "kw" && t.v === v; };
  Parser.prototype.accept = function (v) { if (this.at(v)) { this.i++; return true; } return false; };
  Parser.prototype.expect = function (v, what) {
    if (!this.at(v)) {
      var t = this.peek();
      throw new ParseError("期望 “" + v + "”，但遇到“" + t.v + "”" + (what ? "（" + what + "）" : ""), t.line);
    }
    return this.next();
  };
  Parser.prototype.eof = function () { return this.peek().k === "eof"; };

  var TYPE_WORDS = ["int", "char", "short", "long", "float", "double", "void", "unsigned", "signed", "const", "static",
    "volatile", "extern", "register", "inline"];

  /* 判断某个 token 是否可以作为一个类型说明的开始 */
  Parser.prototype.isTypeStart = function (t) {
    if (!t) return false;
    if (t.k === "kw" && (TYPE_WORDS.indexOf(t.v) >= 0 || t.v === "struct" || t.v === "union" || t.v === "enum" || t.v === "typedef")) return true;
    if (t.k === "id" && Object.prototype.hasOwnProperty.call(this.typedefs, t.v)) return true;
    return false;
  };

  Parser.prototype.parseTypeSpecifiers = function () {
    var type = null, sawUnsigned = false, sawSigned = false, sawLong = 0, sawShort = false, isTypedefKw = false;
    var any = false;
    for (;;) {
      var t = this.peek();
      if (!t) break;
      if (t.k === "kw" && t.v === "typedef") { isTypedefKw = true; this.next(); any = true; continue; }
      if (t.k === "kw" && (t.v === "const" || t.v === "static" || t.v === "volatile" || t.v === "extern" || t.v === "register" || t.v === "inline" || t.v === "signed")) {
        if (t.v === "signed") sawSigned = true;
        this.next(); any = true; continue;
      }
      if (t.k === "kw" && t.v === "unsigned") { sawUnsigned = true; this.next(); any = true; continue; }
      if (t.k === "kw" && t.v === "short") { sawShort = true; this.next(); any = true; continue; }
      if (t.k === "kw" && t.v === "long") { sawLong++; this.next(); any = true; continue; }
      if (t.k === "kw" && t.v === "struct") {
        this.next(); any = true;
        type = this.parseStructSpec(false);
        continue;
      }
      if (t.k === "kw" && t.v === "union") {
        this.next(); any = true;
        type = this.parseStructSpec(true);
        continue;
      }
      if (t.k === "kw" && t.v === "enum") {
        this.next(); any = true;
        type = this.parseEnumSpec();
        continue;
      }
      if (t.k === "kw" && ["int", "char", "float", "double", "void"].indexOf(t.v) >= 0) {
        this.next(); any = true;
        type = mkType(t.v);
        var b = t.v;
        if (sawUnsigned && (b === "int" || b === "char" || b === "short" || b === "long")) type.base = "unsigned " + b;
        if (sawShort) type.base = (sawUnsigned ? "unsigned " : "") + "short";
        if (sawLong) type.base = (sawUnsigned ? "unsigned " : "") + "long";
        continue;
      }
      if (t.k === "id" && Object.prototype.hasOwnProperty.call(this.typedefs, t.v)) {
        this.next(); any = true;
        var alias = this.typedefs[t.v];
        type = cloneType(alias);
        continue;
      }
      break;
    }
    if (!any) { var tt = this.peek(); throw new ParseError("这里期望一个类型名，实际是“" + tt.v + "”", tt.line); }
    if (!type) {
      type = mkType("int");
      if (sawUnsigned) type.base = "unsigned int";
      if (sawShort) type.base = "short";
      if (sawLong) type.base = "long";
    }
    return { type: type, isTypedef: isTypedefKw };
  };

  Parser.prototype.parseStructSpec = function (isUnion) {
    var kw = isUnion ? "union" : "struct";
    var name = null, t = this.peek();
    if (t.k === "id") { name = t.v; this.next(); }
    if (this.at("{")) {
      this.next();
      var members = [];
      while (!this.at("}")) {
        if (this.eof()) throw new ParseError(kw + " 定义没有闭合（缺少 }）", this.peek().line);
        var spec = this.parseTypeSpecifiers();
        if (this.at(";")) { this.next(); continue; }    /* 允许内部只有 struct 定义 */
        for (;;) {
          var d = this.parseDeclarator(spec.type);
          members.push({ name: d.name, type: d.type });
          if (!this.accept(",")) break;
        }
        this.expect(";", kw + " 成员声明后要有分号");
      }
      this.expect("}");
      var sname = name || ("__anon" + (Object.keys(this.structs).length + 1));
      this.structs[sname] = { name: sname, members: members, isUnion: !!isUnion };
      return { base: "struct", structName: sname, ptr: 0, dims: null, isUnion: !!isUnion };
    }
    if (!name) throw new ParseError(kw + " 后面缺少名称或定义体", this.peek().line);
    if (!this.structs[name]) {
      /* 允许先使用后定义（单向链表等场景），成员表留空并在使用时再解析 */
      this.structs[name] = { name: name, members: [], isUnion: !!isUnion };
    }
    return { base: "struct", structName: name, ptr: 0, dims: null, isUnion: !!isUnion };
  };

  Parser.prototype.parseEnumSpec = function () {
    if (this.peek().k === "id") this.next();     /* 枚举名 */
    if (this.at("{")) {
      this.next();
      var val = 0;
      while (!this.at("}")) {
        var t = this.peek();
        if (t.k !== "id") throw new ParseError("枚举常量名不合法", t.line);
        var cname = t.v;
        this.next();
        if (this.accept("=")) {
          var ex = this.parseAssign();
          val = constEval(ex, this.enums);
        }
        this.enums[cname] = val++;
        if (!this.accept(",")) break;
      }
      this.expect("}");
    }
    return { base: "int", ptr: 0, dims: null };
  };

  /* 声明符：指针 + 名称 + 数组维度 + （函数参数） */
  Parser.prototype.parseDeclarator = function (baseType) {
    var type = cloneType(baseType);
    while (this.at("*")) { this.next(); type.ptr++; }
    var name = null, params = null, dims = null;

    /* 函数指针声明：返回类型 (*名字)(参数类型...) */
    if (this.at("(") && this.peek(1) && this.peek(1).v === "*") {
      this.next();
      while (this.at("*")) this.next();
      if (this.peek().k === "id") { name = this.next().v; }
      this.expect(")");
      var fpParams = [];
      if (this.at("(")) {
        this.next();
        if (!this.at(")")) {
          for (;;) {
            var fspec = this.parseTypeSpecifiers();
            var fpt = cloneType(fspec.type);
            while (this.at("*")) { this.next(); fpt.ptr++; }
            if (this.peek().k === "id") this.next();       /* 参数名可省略 */
            fpParams.push(fpt);
            if (!this.accept(",")) break;
          }
        }
        this.expect(")");
      }
      type.ptr++;
      type.funcPtr = { params: fpParams, retType: cloneType(baseType) };
      return { name: name, type: type, params: null, dims: null, isFuncPtr: true };
    }

    var t = this.peek();
    if (t.k === "id") { name = t.v; this.next(); }
    if (this.at("(")) {
      this.next();
      params = [];
      if (!this.at(")")) {
        if (this.atKw("void") && this.peek(1) && this.peek(1).v === ")") { this.next(); }
        else {
          for (;;) {
            var spec = this.parseTypeSpecifiers();
            var pt = cloneType(spec.type);
            while (this.at("*")) { this.next(); pt.ptr++; }
            var pname = null;
            if (this.peek().k === "id") { pname = this.peek().v; this.next(); }
            /* 数组参数退化为指针 */
            if (this.at("[")) {
              while (this.at("[")) { this.next(); if (!this.at("]")) this.parseExpression(); this.expect("]"); }
              pt.ptr++;
            }
            params.push({ name: pname || ("arg" + params.length), type: pt });
            if (!this.accept(",")) break;
          }
        }
      }
      this.expect(")");
    }
    if (this.at("[")) {
      dims = [];
      while (this.at("[")) {
        this.next();
        if (this.at("]")) dims.push(null);
        else { dims.push(this.parseAssign()); }
        this.expect("]");
      }
      type.dims = dims;
    }
    return { name: name, type: type, params: params, dims: dims };
  };

  Parser.prototype.parseUnit = function () {
    var decls = [];
    while (!this.eof()) {
      decls.push(this.parseTopDecl());
    }
    return { type: "Unit", decls: decls };
  };

  Parser.prototype.parseTopDecl = function () {
    var line = this.peek().line;
    var spec = this.parseTypeSpecifiers();

    /* typedef */
    if (spec.isTypedef) {
      var td = this.parseDeclarator(spec.type);
      if (!td.name) throw new ParseError("typedef 缺少名称", line);
      var tt = cloneType(td.type);
      if (td.dims) tt.dims = td.dims.slice();
      this.typedefs[td.name] = tt;
      while (this.accept(",")) {
        var td2 = this.parseDeclarator(spec.type);
        if (td2.name) this.typedefs[td2.name] = cloneType(td2.type);
      }
      this.expect(";");
      return { type: "Typedef", line: line };
    }

    /* 只有 struct/enum 定义，没有变量 */
    if (this.at(";")) { this.next(); return { type: "TagOnly", line: line }; }

    /* 兼容老式写法：main() { ... }（省略返回类型，按 C89 隐式 int 处理） */
    if (this.peek().k === "id" &&
        !Object.prototype.hasOwnProperty.call(this.typedefs, this.peek().v) &&
        this.peek(1) && this.peek(1).k === "punc" && this.peek(1).v === "(") {
      var idName = this.peek().v;
      this.next();
      var fd = this.parseDeclarator(mkType("int"));
      fd.name = idName;
      if (fd.params && this.at("{")) {
        var fbody = this.parseBlock();
        return { type: "FuncDef", name: fd.name, retType: mkType("int"), params: fd.params, body: fbody, line: line };
      }
      this.expect(";");
      return { type: "FuncDecl", name: fd.name, retType: mkType("int"), params: fd.params, line: line };
    }

    var first = this.parseDeclarator(spec.type);

    /* 函数定义 / 函数声明 */
    if (first.params) {
      if (this.at("{")) {
        var body = this.parseBlock();
        return { type: "FuncDef", name: first.name, retType: first.type, params: first.params, body: body, line: line };
      }
      this.expect(";");
      return { type: "FuncDecl", name: first.name, retType: first.type, params: first.params, line: line };
    }

    /* 全局变量（可能多个） */
    var items = [];
    var cur = first;
    for (;;) {
      items.push({
        name: cur.name,
        type: cur.type,
        dims: cur.dims,
        init: this.accept("=") ? this.parseInitializer() : null
      });
      if (!this.accept(",")) break;
      cur = this.parseDeclarator(spec.type);
    }
    this.expect(";");
    return { type: "GlobalVar", items: items, line: line };
  };

  Parser.prototype.parseInitializer = function () {
    if (this.at("{")) {
      this.next();
      var list = [];
      if (!this.at("}")) {
        for (;;) {
          if (this.at("{")) { list.push(this.parseInitializer()); }
          else list.push(this.parseAssign());
          if (!this.accept(",")) break;
          if (this.at("}")) break;
        }
      }
      this.expect("}");
      return { type: "InitList", list: list };
    }
    return this.parseAssign();
  };

  Parser.prototype.parseBlock = function () {
    var line = this.expect("{").line;
    var stmts = [];
    while (!this.at("}")) {
      if (this.eof()) throw new ParseError("代码块没有闭合（缺少 }）", this.peek().line);
      stmts.push(this.parseStatement());
    }
    this.expect("}");
    return { type: "Block", stmts: stmts, line: line };
  };

  Parser.prototype.parseStatement = function () {
    var t = this.peek();
    var line = t.line;

    if (this.at("{")) return this.parseBlock();

    if (t.k === "kw") {
      switch (t.v) {
        case "if": {
          this.next(); this.expect("(");
          var cond = this.parseExpression();
          this.expect(")");
          var thenS = this.parseStatement();
          var elseS = this.accept("else") ? this.parseStatement() : null;
          return { type: "If", cond: cond, then: thenS, alt: elseS, line: line };
        }
        case "while": {
          this.next(); this.expect("(");
          var c2 = this.parseExpression(); this.expect(")");
          var body = this.parseStatement();
          return { type: "While", cond: c2, body: body, line: line };
        }
        case "do": {
          this.next();
          var body2 = this.parseStatement();
          if (!this.atKw("while")) throw new ParseError("do 语句后面必须有 while", this.peek().line);
          this.next(); this.expect("(");
          var c3 = this.parseExpression(); this.expect(")");
          this.expect(";");
          return { type: "DoWhile", body: body2, cond: c3, line: line };
        }
        case "for": {
          this.next(); this.expect("(");
          var init = null;
          if (this.accept(";")) init = null;
          else if (this.isTypeStart(this.peek())) { init = this.parseLocalDecl(false); this.expect(";"); }
          else { init = { type: "ExprStmt", expr: this.parseExpression(), line: this.peek().line }; this.expect(";"); }
          var cond2 = this.at(";") ? null : this.parseExpression();
          this.expect(";");
          var step = this.at(")") ? null : this.parseExpression();
          this.expect(")");
          var body3 = this.parseStatement();
          return { type: "For", init: init, cond: cond2, step: step, body: body3, line: line };
        }
        case "switch": {
          this.next(); this.expect("(");
          var sx = this.parseExpression(); this.expect(")");
          this.expect("{");
          var cases = [], curCase = null;
          while (!this.at("}")) {
            if (this.eof()) throw new ParseError("switch 没有闭合（缺少 }）", this.peek().line);
            if (this.atKw("case")) {
              this.next();
              var cv = constEval(this.parseAssign(), this.enums);
              this.expect(":");
              curCase = { val: cv, stmts: [] };
              cases.push(curCase);
              continue;
            }
            if (this.atKw("default")) {
              this.next(); this.expect(":");
              curCase = { val: null, stmts: [] };
              cases.push(curCase);
              continue;
            }
            if (!curCase) throw new ParseError("switch 里的语句必须放在 case 或 default 之后", this.peek().line);
            curCase.stmts.push(this.parseStatement());
          }
          this.expect("}");
          return { type: "Switch", expr: sx, cases: cases, line: line };
        }
        case "break": this.next(); this.expect(";"); return { type: "Break", line: line };
        case "continue": this.next(); this.expect(";"); return { type: "Continue", line: line };
        case "return": {
          this.next();
          var re = this.at(";") ? null : this.parseExpression();
          this.expect(";");
          return { type: "Return", expr: re, line: line };
        }
        case "goto": throw new ParseError("暂不支持 goto", line);
        default:
          if (this.isTypeStart(t)) return this.parseLocalDecl(true);
          break;
      }
    }

    if (this.isTypeStart(t)) return this.parseLocalDecl(true);

    var e = this.parseExpression();
    this.expect(";", "表达式语句要以分号结尾");
    return { type: "ExprStmt", expr: e, line: line };
  };

  Parser.prototype.parseLocalDecl = function (expectSemi) {
    var line = this.peek().line;
    var spec = this.parseTypeSpecifiers();
    var items = [];
    if (this.at(";")) {
      this.next();
      return { type: "Decl", items: items, line: line };
    }
    for (;;) {
      var d = this.parseDeclarator(spec.type);
      items.push({
        name: d.name,
        type: d.type,
        dims: d.dims,
        init: this.accept("=") ? this.parseInitializer() : null
      });
      if (!this.accept(",")) break;
    }
    if (expectSemi) this.expect(";");
    return { type: "Decl", items: items, line: line };
  };

  /* ---------------- 表达式 ---------------- */
  Parser.prototype.parseExpression = function () {
    var e = this.parseAssign();
    while (this.at(",")) {
      var line = this.next().line;
      e = { type: "Comma", left: e, right: this.parseAssign(), line: line };
    }
    return e;
  };

  var ASSIGN_OPS = ["=", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=", "<<=", ">>="];

  Parser.prototype.parseAssign = function () {
    var left = this.parseConditional();
    var t = this.peek();
    if (t.k === "punc" && ASSIGN_OPS.indexOf(t.v) >= 0) {
      this.next();
      var right = this.parseAssign();
      return { type: "Assign", op: t.v, target: left, value: right, line: t.line };
    }
    return left;
  };

  Parser.prototype.parseConditional = function () {
    var cond = this.parseBinary(1);
    if (this.at("?")) {
      var line = this.next().line;
      var a = this.parseExpression();
      this.expect(":");
      var b = this.parseConditional();
      return { type: "Cond", cond: cond, then: a, alt: b, line: line };
    }
    return cond;
  };

  var BIN_PREC = {
    "||": 1, "&&": 2, "|": 3, "^": 4, "&": 5,
    "==": 6, "!=": 6,
    "<": 7, ">": 7, "<=": 7, ">=": 7,
    "<<": 8, ">>": 8,
    "+": 9, "-": 9,
    "*": 10, "/": 10, "%": 10
  };

  Parser.prototype.parseBinary = function (minPrec) {
    var left = this.parseUnary();
    for (;;) {
      var t = this.peek();
      if (t.k !== "punc") break;
      var prec = BIN_PREC[t.v];
      if (!prec || prec < minPrec) break;
      this.next();
      var right = this.parseBinary(prec + 1);
      left = { type: "Binary", op: t.v, left: left, right: right, line: t.line };
    }
    return left;
  };

  Parser.prototype.parseUnary = function () {
    var t = this.peek();
    if (t.k === "punc") {
      if (t.v === "++" || t.v === "--") {
        this.next();
        return { type: "Unary", op: t.v, expr: this.parseUnary(), prefix: true, line: t.line };
      }
      if (t.v === "!" || t.v === "~" || t.v === "-" || t.v === "+") {
        this.next();
        return { type: "Unary", op: t.v, expr: this.parseUnary(), prefix: true, line: t.line };
      }
      if (t.v === "*") { this.next(); return { type: "Deref", expr: this.parseUnary(), line: t.line }; }
      if (t.v === "&") { this.next(); return { type: "Addr", expr: this.parseUnary(), line: t.line }; }
      if (t.v === "(") {
        var save = this.i;
        this.next();
        if (this.isTypeStart(this.peek())) {
          try {
            var spec = this.parseTypeSpecifiers();
            var ct = cloneType(spec.type);
            while (this.at("*")) { this.next(); ct.ptr++; }
            if (this.at(")")) {
              this.next();
              return { type: "Cast", castType: ct, expr: this.parseUnary(), line: t.line };
            }
          } catch (e) { /* 回退为括号表达式 */ }
          this.i = save;
        } else {
          this.i = save;
        }
      }
    }
    if (t.k === "kw" && t.v === "sizeof") {
      this.next();
      if (this.at("(")) {
        var save2 = this.i;
        this.next();
        if (this.isTypeStart(this.peek())) {
          try {
            var spec2 = this.parseTypeSpecifiers();
            var st2 = cloneType(spec2.type);
            while (this.at("*")) { this.next(); st2.ptr++; }
            if (this.at("[")) { var d = []; while (this.at("[")) { this.next(); if (!this.at("]")) d.push(this.parseAssign()); this.expect("]"); } st2.dims = d; }
            this.expect(")");
            return { type: "SizeofType", sizeType: st2, line: t.line };
          } catch (e2) { this.i = save2; }
        } else { this.i = save2; }
      }
      return { type: "SizeofExpr", expr: this.parseUnary(), line: t.line };
    }
    return this.parsePostfix();
  };

  Parser.prototype.parsePostfix = function () {
    var e = this.parsePrimary();
    for (;;) {
      var t = this.peek();
      if (this.at("[")) {
        this.next();
        var idx = this.parseExpression();
        this.expect("]");
        e = { type: "Index", arr: e, index: idx, line: t.line };
        continue;
      }
      if (this.at("(")) {
        this.next();
        var args = [];
        if (!this.at(")")) {
          for (;;) {
            args.push(this.parseAssign());
            if (!this.accept(",")) break;
          }
        }
        this.expect(")");
        e = { type: "Call", callee: e, args: args, line: t.line };
        continue;
      }
      if (this.at(".") || this.at("->")) {
        var arrow = this.at("->");
        this.next();
        var mt = this.peek();
        if (mt.k !== "id") throw new ParseError("成员访问需要成员名", mt.line);
        this.next();
        e = { type: "Member", obj: e, name: mt.v, arrow: arrow, line: t.line };
        continue;
      }
      if (this.at("++") || this.at("--")) {
        this.next();
        e = { type: "Unary", op: t.v, expr: e, prefix: false, line: t.line };
        continue;
      }
      break;
    }
    return e;
  };

  Parser.prototype.parsePrimary = function () {
    var t = this.peek();
    if (t.k === "num") { this.next(); return { type: "Num", value: t.v, isFloat: !!t.isFloat, suffix: t.suffix || "", line: t.line }; }
    if (t.k === "str") {
      this.next();
      var parts = [t.v];
      while (this.peek().k === "str") parts.push(this.next().v);   /* 相邻字符串拼接 */
      return { type: "Str", value: parts.join(""), line: t.line };
    }
    if (t.k === "id") { this.next(); return { type: "Ident", name: t.v, line: t.line }; }
    if (this.at("(")) { this.next(); var e = this.parseExpression(); this.expect(")"); return e; }
    if (t.k === "kw" && t.v === "sizeof") return this.parseUnary();
    throw new ParseError("无法解析的表达式，遇到“" + t.v + "”", t.line);
  };

  /* ---------------- 常量表达式求值（数组长度、case 值、枚举值） ---------------- */
  function constEval(node, enums) {
    switch (node.type) {
      case "Num": return node.value;
      case "Ident":
        if (Object.prototype.hasOwnProperty.call(enums, node.name)) return enums[node.name];
        throw new ParseError("这里需要常量表达式，但出现了变量“" + node.name + "”", node.line);
      case "Unary": {
        var v = constEval(node.expr, enums);
        if (node.op === "-") return -v;
        if (node.op === "+") return v;
        if (node.op === "!") return v ? 0 : 1;
        if (node.op === "~") return ~v;
        break;
      }
      case "Binary": {
        var a = constEval(node.left, enums), b = constEval(node.right, enums);
        switch (node.op) {
          case "+": return a + b; case "-": return a - b; case "*": return a * b;
          case "/": return b === 0 ? 0 : Math.trunc(a / b);
          case "%": return b === 0 ? 0 : a % b;
          case "<<": return a << b; case ">>": return a >> b;
          case "&": return a & b; case "|": return a | b; case "^": return a ^ b;
        }
        break;
      }
      case "SizeofType": return 0;   /* 运行时再算，见 VM */
      case "Cast": return constEval(node.expr, enums);
      case "Cond": return constEval(node.cond, enums) ? constEval(node.then, enums) : constEval(node.alt, enums);
    }
    throw new ParseError("这里需要常量表达式", node.line || 0);
  }

  /* ---------------- 对外接口 ---------------- */
  function parse(src) {
    var lx = new Lexer(src);
    try {
      var toks = lx.run();
      var p = new Parser(toks, lx.macros);
      var unit = p.parseUnit();
      unit.structs = p.structs;
      unit.enums = p.enums;
      unit.macros = lx.macros;
      /* 预处理：没有 main 的片段自动包一层 main，方便课程里的代码片段直接运行 */
      var hasMain = unit.decls.some(function (d) { return d.type === "FuncDef" && d.name === "main"; });
      var onlyDecls = unit.decls.every(function (d) {
        return d.type === "FuncDef" || d.type === "Typedef" || d.type === "TagOnly";
      });
      return { ok: true, unit: unit, source: src, wrapped: false, hasMain: hasMain, onlyDecls: onlyDecls };
    } catch (e) {
      return {
        ok: false,
        error: (e && e.isSimError) ? ("第 " + (e.line || "?") + " 行：" + e.message) : ("解析失败：" + (e && e.message ? e.message : e)),
        source: src
      };
    }
  }

  window.CSimParse = {
    parse: parse,
    Lexer: Lexer,
    Parser: Parser
  };
})();


/* ==== sim-vm.js ==== */

/* ============================================================
   虚拟仿真引擎（二）：C 教学子集 —— 解释执行 + 执行轨迹记录
   ------------------------------------------------------------
   设计要点：
   1) 内存模型：每个变量/数组/结构体成员都分配一个地址，指针存地址，
      因此 &x、*p、p+1、a[i]、s.x、q->x 都能真实地工作。
   2) 执行轨迹：每条语句执行前记录一次快照（行号、源码行、函数、
      当前可见变量、已产生的输出长度），UI 用它做逐行单步与回放。
   3) 安全边界：maxSteps 限制总步数，防死循环；maxFrames 限制轨迹条数。

   公开接口：window.CSim.run(src, opts) / window.CSim.inspect(src)
   ============================================================ */
(function () {
  "use strict";

  var P = window.CSimParse;   /* 词法/语法分析（sim-core.js） */

  /* ---------------- 类型系统（简化模型，均按 32 位 int / 32 位指针） ---------------- */
  var BASE = {
    "int": { size: 4, signed: true },
    "unsigned int": { size: 4, signed: false },
    "short": { size: 2, signed: true },
    "unsigned short": { size: 2, signed: false },
    /* long 按 64 位建模（与本课程所有目标平台一致：x86-64 Linux、ARM64 Linux）。
       这样 "long acc" 才能作为 int 溢出防护的正确惯用法成立——
       如果按 32 位建模，"acc > INT_MAX" 这类写法会全部失真。 */
    "long": { size: 8, signed: true },
    "unsigned long": { size: 8, signed: false },
    "char": { size: 1, signed: true },
    "unsigned char": { size: 1, signed: false },
    "float": { size: 4, fp: true },
    "double": { size: 8, fp: true },
    "void": { size: 1 },
    "struct": { size: 0 }
  };
  function bi(t) { return BASE[t.base] || BASE["int"]; }
  function isFP(t) { return !!bi(t).fp; }
  function isChar(t) { return t.base === "char" || t.base === "unsigned char"; }

  /* 整数字面量的类型：C 里是把值塞进「int → long」中第一个装得下的类型；
     带 L/UL 后缀的字面量则直接是 long / unsigned long，这一点不能忽略，
     否则 `2147483647L + 1` 会按 int 溢出。 */
  var INT_MAX = 2147483647;
  function intLiteralBase(node) {
    if (node.isFloat) return "double";
    var sfx = (node.suffix || "").toLowerCase();
    var hasL = sfx.indexOf("l") >= 0, hasU = (node.unsigned || sfx.indexOf("u") >= 0);
    if (hasL) return hasU ? "unsigned long" : "long";
    if (hasU) return node.value > 4294967295 ? "unsigned long" : "unsigned int";
    if (node.value > INT_MAX || node.value < -INT_MAX - 1) return "long";
    return "int";
  }

  function product(arr) { var p = 1; for (var i = 0; i < arr.length; i++) p *= arr[i]; return p; }

  /* 标量部分的大小（不含数组维度） */
  function scalarSize(t, structs) {
    if (t.ptr > 0) return 4;
    if (t.base === "struct") return structSize(t.structName, structs);
    return bi(t).size;
  }
  /* 整个对象的大小（含所有数组维度） */
  function wholeSize(t, structs) {
    if (t.dims && t.dims.length) return product(t.dims) * scalarSize(t, structs);
    return scalarSize(t, structs);
  }
  /* 数组维度可能还是「未求值的 AST 节点」（如 unsigned char buf[8] 里的 8），
     直接相乘会得到 NaN 并被缓存进结构体尺寸，把一个含数组成员的结构体
     整个算坏（表现为该结构体的地址变成空指针，连 printf 都输出不了）。
     这里统一把维度归一成数字。 */
  function dimsToNumbers(dims) {
    if (!dims || !dims.length) return null;
    var out = [];
    for (var i = 0; i < dims.length; i++) {
      var d = dims[i];
      if (d == null) { out.push(1); continue; }
      if (typeof d === "number") { out.push(d); continue; }
      if (typeof d.value === "number") { out.push(d.value); continue; }
      return null;   /* 无法静态求值（长度来自变量）——交给运行时 resolveDims 处理 */
    }
    return out;
  }
  function structSize(name, structs) {
    var def = structs[name];
    if (!def) return 4;
    if (def.size != null && isFinite(def.size)) return def.size;
    var s = 0, ok = true;
    (def.members || []).forEach(function (m) {
      var md = dimsToNumbers(m.type && m.type.dims);
      var ms;
      if (md) ms = product(md) * scalarSize({ base: m.type.base, ptr: m.type.ptr, structName: m.type.structName }, structs);
      else ms = scalarSize({ base: m.type.base, ptr: m.type.ptr, structName: m.type.structName }, structs);
      if (!isFinite(ms) || ms <= 0) { ok = false; ms = 4; }
      s = def.isUnion ? Math.max(s, ms) : s + ms;    /* union 取最大成员，struct 累加 */
    });
    if (s <= 0) s = 4;
    /* 只有算得出确定结果时才缓存，避免把 NaN 永久写进结构体定义 */
    if (ok) def.size = s;
    return s;
  }
  function pointeeSize(t) {
    /* 指针/数组元素的大小：用于 p+1、a[i] 的跨度计算 */
    if (t.pointeeDims) return product(t.pointeeDims) * t.elemScalarSize;
    return t.elemScalarSize || 4;
  }
  function elemScalarSizeOf(t, structs) { return scalarSize({ base: t.base, ptr: t.ptr, structName: t.structName }, structs); }

  /* 溢出检查用的安全整数范围（JS 双精度能精确表示的整数上限是 2^53-1）
     教学仿真里 long 按 64 位处理，但为了不引入 BigInt 的复杂度，
     超过安全范围就夹紧，避免出现 NaN 或精度静默丢失。 */
  var SAFE_MAX = 9007199254740991;
  function clampLong(v) {
    if (typeof v !== "number" || isNaN(v)) return 0;
    if (v > SAFE_MAX) return SAFE_MAX;
    if (v < -SAFE_MAX) return -SAFE_MAX;
    return Math.trunc(v);
  }

  function truncate(val, t) {
    if (t.ptr > 0) return val | 0;
    var b = bi(t);
    if (b.fp) return t.base === "float" ? Math.fround(val) : Number(val);
    if (t.base === "char") { var v = val & 0xff; return v >= 128 ? v - 256 : v; }
    if (t.base === "unsigned char") return val & 0xff;
    if (t.base === "short") { var s = val & 0xffff; return s >= 0x8000 ? s - 0x10000 : s; }
    if (t.base === "unsigned short") return val & 0xffff;
    /* long / unsigned long：按 64 位处理。
       以前直接落到 val|0，会把 long 也压成 32 位，
       于是 "long acc = 2147483648" 变成负数、溢出判断全部失真。 */
    if (t.base === "long") return clampLong(val);
    if (t.base === "unsigned long") return val < 0 ? 0 : clampLong(val);
    if (t.base === "unsigned int") return val >>> 0;
    return val | 0;
  }
  function typeName(t, structs) {
    var s = t.base === "struct" ? ("struct " + t.structName) : t.base;
    for (var i = 0; i < t.ptr; i++) s += "*";
    if (t.dims) s += "[" + t.dims.map(function (d) { return d == null ? "?" : d; }).join("][") + "]";
    return s;
  }

  /* ---------------- 控制流信号 ---------------- */
  var BREAK = { sig: "break" }, CONTINUE = { sig: "continue" };
  function ReturnSig(v, t) { this.sig = "return"; this.value = v; this.type = t; }
  function StopSig(reason) { this.sig = "stop"; this.reason = reason; }

  function SimError(msg) { this.message = msg; this.isSimError = true; }
  SimError.prototype.toString = function () { return this.message; };

  /* ---------------- 单元对象 ---------------- */
  function Cell(name, type) {
    this.name = name;
    this.type = type;
    this.value = 0;
    this.addr = 0;
    this.dims = null;         /* 数组：各维长度 */
    this.elemSize = 4;
    this.members = null;      /* struct：名字 -> Cell */
  }
  Cell.prototype.isArray = function () { return !!(this.type.dims && this.type.dims.length); };

  /* ---------------- 虚拟机 ---------------- */
  function VM(unit, opts) {
    opts = opts || {};
    this.unit = unit;
    this.structs = unit.structs || {};
    this.enums = unit.enums || {};
    this.source = opts.source || "";
    this.srcLines = this.source.split("\n");
    this.globals = {};
    this.regions = [];
    this.nextAddr = 0x1000;
    this.outChunks = [];
    this.trace = [];
    this.steps = 0;
    this.maxSteps = opts.maxSteps || 3000000;
    this.maxTrace = opts.maxTrace || 4000;
    this.t0 = Date.now();
    this.traceTruncated = false;
    this.input = opts.input || "";
    this.inputPos = 0;
    this.depth = 0;
    this.funcs = {};
    this.warnings = [];
    this.sawOutput = 0;
    this.randState = 20260912;
    this.frame = null;
    this.enumConsts = this.enums;
    this.fnPtrs = {};        /* 合成地址 -> 函数名（函数指针的值用合成地址表示） */
    this.fnAddrOf = {};      /* 函数名 -> 合成地址 */
    this.callStack = [];     /* 调用栈（函数名数组），用于 UI 展示 */
  }

  /* 函数指针：给每个函数分配一个合成地址（真实地址对教学没有意义） */
  VM.prototype.funcAddress = function (name) {
    if (this.fnAddrOf[name] == null) {
      var addr = 0xf000 + Object.keys(this.fnAddrOf).length + 1;
      this.fnAddrOf[name] = addr;
      this.fnPtrs[addr] = name;
    }
    return this.fnAddrOf[name];
  };

  /* ---------- 内存分配 ---------- */
  VM.prototype.newAddr = function (size) {
    var a = this.nextAddr;
    this.nextAddr += Math.max(1, size);
    return a;
  };
  VM.prototype.allocCell = function (cell, ownerName, forceAddr) {
    var t = cell.type;
    var forced = (typeof forceAddr === "number" && forceAddr > 0);
    /* 分配一段内存：正常情况从堆游标申请；当它是「结构体成员」时，
       必须落在父结构体内部（forced），不能另起一块地址——
       否则 g.buf[8] 和 g.cap 会各占一片独立区域，
       取 &g 时会命中成员的区域，出现「结构体变成空指针」这类怪现象。 */
    var take = function (size) {
      if (forced) return forceAddr;
      return this.newAddr(size);
    }.bind(this);
    if (t.dims && t.dims.length) {
      var dims = t.dims.map(function (d) { return d == null ? 1 : d; });
      cell.dims = dims;
      /* elemSize 必须是「单个元素」的大小（整块内存 ÷ 元素总数），
         而不是整个元素类型的大小。以前直接用 elemScalarSizeOf 会在
         多维数组下把「元素大小」误算成「整行/整块大小」，
         导致 char s[3] 的步长变成 3、char* 遍历字符串时越界。 */
      var total = product(dims) * elemScalarSizeOf(t, this.structs);
      cell.elemSize = Math.max(1, Math.floor(total / product(dims)));
      if (!isFinite(total) || total <= 0 || total > 1e6) {
        throw new SimError("数组申请的内存不合法（" + total + " 字节）。仿真里单个数组上限约 100 万字节。");
      }
      cell.addr = take(total);
      cell.value = new Array(product(dims));
      for (var i = 0; i < cell.value.length; i++) cell.value[i] = 0;
      this.regions.push({ start: cell.addr, end: cell.addr + total - 1, kind: "array", cell: cell, elemSize: cell.elemSize, len: product(dims), inStruct: forced });
      /* 结构体数组（S a[2]）：为每个元素登记一个「结构体区域」并建好成员，
         否则 a[1].n 这种写法找不到元素对应的结构体，会报“对非结构体使用了 . 访问”。
         这是数组区在 type 上仍然是 struct 时才需要做的事。 */
      if (t.base === "struct" && t.ptr === 0 && !t.pointeeDims) {
        cell.elemStructs = [];
        for (var e = 0; e < product(dims); e++) {
          var ec = new Cell((cell.name || "arr") + "[" + e + "]", {
            base: "struct", ptr: 0, structName: t.structName, dims: null
          });
          this.allocCell(ec, null, cell.addr + e * cell.elemSize);
          cell.elemStructs.push(ec);
        }
      }
      return cell;
    }
    if (t.base === "struct" && t.ptr === 0) {
      var def = this.structs[t.structName];
      cell.members = {};
      var size = structSize(t.structName, this.structs);
      cell.addr = take(size);
      /* 成员逐个按偏移量排布在父结构体内部，与 C 的内存布局一致 */
      this.regions.push({ start: cell.addr, end: cell.addr + size - 1, kind: "struct", cell: cell, inStruct: forced });
      var self = this;
      var isUnion = !!(def && def.isUnion);
      var offset = cell.addr;
      (def && def.members ? def.members : []).forEach(function (m) {
        var mt = isUnion ? m.type : self.resolveDims(m.type, null);
        var mc = new Cell(m.name, mt);
        if (isUnion) {
          /* union：所有成员共用同一块内存（因此可观察类型双关现象） */
          mc.addr = cell.addr;
          if (mc.type.dims && mc.type.dims.length) {
            mc.dims = mc.type.dims;
            mc.elemSize = elemScalarSizeOf(mc.type, self.structs);
            mc.value = new Array(product(mc.dims));
            for (var q = 0; q < mc.value.length; q++) mc.value[q] = 0;
          } else {
            mc.value = 0;
          }
        } else {
          self.allocCell(mc, null, offset);
          /* 成员可能自身又是结构体（成员内还有成员），
             所以推进量用「整个成员对象的大小」，而不是标量大小 */
          offset += wholeSize(mt, self.structs);
        }
        cell.members[m.name] = mc;
      });
      /* 父结构体内部成员的地址不应再参与堆游标分配 */
      if (!forced) this.nextAddr = Math.max(this.nextAddr, cell.addr + size);
      return cell;
    }
    var sz = scalarSize(t, this.structs);
    cell.addr = take(sz);
    this.regions.push({ start: cell.addr, end: cell.addr + sz - 1, kind: "scalar", cell: cell, inStruct: forced });
    cell.value = 0;
    return cell;
  };
  /* 按地址找内存区域（内存读写用）：结构体成员与父结构体共用同一片地址，
     此时要返回「最内层、最具体」的那个区域——也就是大小最小的那个，
     否则 g.buf[0] 会命中父结构体区域、被当成「整体写结构体」而报错。 */
  VM.prototype.regionAt = function (addr) {
    var best = null;
    for (var i = 0; i < this.regions.length; i++) {
      var r = this.regions[i];
      if (addr < r.start || addr > r.end) continue;
      /* 成员区域标记了 inStruct，优先级最高 */
      if (r.inStruct) {
        if (!best || !best.inStruct) best = r;
        else if ((r.end - r.start) < (best.end - best.start)) best = r;
        continue;
      }
      if (best && best.inStruct) continue;
      if (!best) { best = r; continue; }
      if ((r.end - r.start) < (best.end - best.start)) best = r;
    }
    return best;
  };
  /* 按地址找回「结构体区域」本身（. / -> 访问用）：
     与 regionAt 不同，这里要的正是父结构体那一层。 */
  VM.prototype.structRegionAt = function (addr) {
    for (var i = 0; i < this.regions.length; i++) {
      var r = this.regions[i];
      if (r.kind === "struct" && r.cell && r.cell.addr === addr) return r;
    }
    return null;
  };
  VM.prototype.memRead = function (addr) {
    var r = this.regionAt(addr);
    if (!r) throw new SimError("访问了未分配的内存地址 0x" + (addr >>> 0).toString(16) + "（可能是野指针或越界）");
    if (r.kind === "scalar") return r.cell.value;
    if (r.kind === "array") {
      var off = addr - r.start;
      if (off % r.elemSize !== 0) throw new SimError("地址 0x" + (addr >>> 0).toString(16) + " 未对齐到元素边界");
      return r.cell.value[off / r.elemSize];
    }
    if (r.kind === "string") {
      return r.chars[addr - r.start] || 0;
    }
    throw new SimError("不能直接读取整个结构体，请用成员访问（. 或 ->）");
  };
  VM.prototype.memWrite = function (addr, val) {
    var r = this.regionAt(addr);
    if (!r) throw new SimError("向未分配的内存地址 0x" + (addr >>> 0).toString(16) + " 写入数据（可能是野指针或越界）");
    if (r.kind === "scalar") { r.cell.value = val; return; }
    if (r.kind === "array") {
      var off = addr - r.start;
      if (off % r.elemSize !== 0) throw new SimError("地址未对齐，无法写入");
      r.cell.value[off / r.elemSize] = val;
      return;
    }
    if (r.kind === "string") throw new SimError("字符串常量存放在只读区，不能修改（想改内容请先复制到 char 数组）");
    throw new SimError("不能整体写入结构体，请用成员访问");
  };
  VM.prototype.readCString = function (addr, limit) {
    if (!addr) return "(空指针)";
    var r = this.regionAt(addr);
    if (!r) return "(非法地址)";
    var s = "", max = limit || 512;
    for (var k = 0; k < max; k++) {
      var c;
      if (r.kind === "string") c = r.chars[addr - r.start + k] || 0;
      else if (r.kind === "array") c = r.cell.value[(addr - r.start) / r.elemSize + k] || 0;
      else return "(不是字符串)";
      if (!c) break;
      if (c < 0) c = c + 256;                    /* char 为负时按无符号字节还原 */
      s += String.fromCharCode(c);
    }
    return s;
  };
  VM.prototype.allocString = function (str) {
    var chars = [];
    /* 教学仿真按字符存放（不做 UTF-8 字节编码），因此中文字符串也能原样输出 */
    for (var i = 0; i < str.length; i++) chars.push(str.charCodeAt(i));
    chars.push(0);
    var addr = this.newAddr(chars.length);
    this.regions.push({ start: addr, end: addr + chars.length - 1, kind: "string", chars: chars });
    return addr;
  };

  /* ---------- 作用域与变量查找 ---------- */
  VM.prototype.findCell = function (name) {
    var f = this.frame;
    if (f) {
      for (var s = f.scopes.length - 1; s >= 0; s--) {
        if (Object.prototype.hasOwnProperty.call(f.scopes[s], name)) return f.scopes[s][name];
      }
    }
    if (Object.prototype.hasOwnProperty.call(this.globals, name)) return this.globals[name];
    return null;
  };

  /* 变量在给定帧里的“帧内地址”（结构体单元用帧基址 + 内部偏移表示）。
     函数形参、局部变量都分配在本帧私有区间里，避免递归时各层互相踩内存。
     注意：只有变量的地址确实落在本帧私有区间 [base, base+已分配) 内，
     才允许做换算。全局/静态变量以及被保存的局部变量都不能换算，
     否则会算出与别的变量重合的假地址，破坏 *(p+i) 这类解引用。 */
  VM.prototype.cellFrameAddr = function (cell, frame) {
    if (!cell || !frame || !frame.base) return 0;
    if (!cell.addr) return 0;
    if (cell.addr < frame.base) return 0;
    if (frame.limit && cell.addr >= frame.limit) return 0;
    return cell.addr;
  };

  /* 一个单元是否能当作结构体使用（. 或 -> 访问）
     注意：全局结构体的 cell.addr 落在堆区之外（全局区/栈区），
     不能只靠 regionAt 判断，必须回退到帧内地址换算。 */
  VM.prototype.resolveStructCell = function (addr, expectName) {
    return this.resolveCellByAddr(addr, expectName, true);
  };

  /* 按地址精确找回单元：只认地址完全相等的单元，绝不按类型名模糊匹配。
     （早期的模糊匹配会让 *(p+i) 错误地命中第一个 int 变量，
       表现为“打印出来全是同一个值”，是必须避免的假阳性。） */
  VM.prototype.resolveCellByAddr = function (addr, expectName, structOnly) {
    if (!addr) return null;
    var r = this.regionAt(addr);
    if (r && r.cell && r.cell.addr === addr) {
      if (!structOnly || r.cell.members) return r.cell;
    }
    var frames = [];
    if (this.frame) frames.push(this.frame);
    for (var i = 0; i < (this.frameStack || []).length; i++) frames.push(this.frameStack[i]);
    for (var f = 0; f < frames.length; f++) {
      var fr = frames[f];
      if (!fr || !fr.base) continue;
      var scopes = fr.scopes || [];
      for (var s = 0; s < scopes.length; s++) {
        var names = Object.keys(scopes[s]);
        for (var n = 0; n < names.length; n++) {
          var c = scopes[s][names[n]];
          if (!c || !c.addr) continue;
          if (structOnly && !c.members) continue;
          if (this.cellFrameAddr(c, fr) !== addr) continue;
          if (expectName && c.type && c.type.structName && c.type.structName !== expectName) continue;
          return c;
        }
      }
    }
    return null;
  };

  /* 结构体专用：与 resolveCellByAddr 同源，仅要求结果带 members */
  VM.prototype.resolveScalarCellByAddr = function (addr) {
    if (!addr) return null;
    var r = this.regionAt(addr);
    if (r && r.cell && r.cell.addr === addr && !r.cell.members && !r.cell.isArray()) return r.cell;
    return null;
  };

  /* 取地址：优先用单元自身登记的地址；仅当该地址落在「本帧私有区间」内
     （说明这是个帧内地址、可以安全参与指针运算）时才做换算。
     ——关键约束：绝不能把全局/静态单元的地址换算成帧偏移，
     否则 &save 会算出一个恰好等于数组元素地址的假地址，
     导致 *(p+i) 之类的解引用错误命中局部变量。 */
  VM.prototype.addressOfCell = function (lv) {
    if (!lv) return 0;
    if (lv.addr && this.regionAt(lv.addr)) return lv.addr;
    return 0;
  };

  /* ---------- 执行轨迹 ---------- */
  VM.prototype.record = function (line) {
    this.steps++;
    if (this.steps > this.maxSteps) {
      throw new SimError("执行步数超过 " + this.maxSteps + " 步（可能是死循环），已自动停止。请检查循环条件。");
    }
    if (this.steps % 4096 === 0 && this.t0 && (Date.now() - this.t0) > 6000) {
      throw new SimError("执行时间超过 6 秒，已自动停止（可能是死循环或循环次数过多）。");
    }
    if (this.trace.length >= this.maxTrace) { this.traceTruncated = true; return; }
    var vars = [];
    var seen = {};
    var self = this;
    function push(cell) {
      if (!cell || seen[cell.addr + "|" + cell.name]) return;
      seen[cell.addr + "|" + cell.name] = 1;
      vars.push([cell.name, self.disp(cell)]);
    }
    var f = this.frame;
    if (f) {
      f.scopes.forEach(function (sc) { Object.keys(sc).forEach(function (k) { push(sc[k]); }); });
    }
    Object.keys(this.globals).forEach(function (k) { push(self.globals[k]); });
    this.trace.push({
      n: this.trace.length,
      line: line,
      func: f ? f.name : "(全局)",
      depth: this.depth,
      stack: this.callStack.slice(),
      vars: vars,
      outLen: this.outChunks.length,
      text: (this.srcLines[line - 1] || "").trim()
    });
  };

  /* ---------- 值的显示（变量监视面板用） ---------- */
  VM.prototype.disp = function (cell) {
    var t = cell.type;
    if (t.base === "struct" && t.ptr === 0) {
      var parts = [];
      var self = this;
      Object.keys(cell.members || {}).forEach(function (k) { parts.push(k + "=" + self.disp(cell.members[k])); });
      return "{" + parts.join(", ") + "}";
    }
    if (cell.isArray()) {
      var arr = cell.value, shown = [];
      var n = Math.min(arr.length, 12);
      for (var i = 0; i < n; i++) shown.push(this.dispScalar(arr[i], t));
      return "[" + shown.join(", ") + (arr.length > n ? ", …共" + arr.length + "项" : "") + "]";
    }
    if (t.ptr > 0) {
      var hexv = "0x" + (cell.value >>> 0).toString(16);
      if (!cell.value) return hexv + " (NULL)";
      var pt = this.pointeeType(t);
      try {
        if (isChar(pt)) return hexv + ' → "' + this.readCString(cell.value, 32) + '"';
        if (pt.base === "struct" && pt.ptr === 0) return hexv + " → 结构体";
        return hexv + " → " + this.dispScalar(this.memRead(cell.value), pt);
      } catch (e) { return hexv + " → (无效)"; }
    }
    return this.dispScalar(cell.value, t);
  };
  VM.prototype.dispScalar = function (v, t) {
    if (t.ptr > 0) return "0x" + (v >>> 0).toString(16);
    var b = bi(t);
    if (b.fp) return String(Math.round(v * 1e6) / 1e6);
    if (isChar(t)) {
      var c = v & 0xff;
      if (c >= 32 && c < 127) return v + " ('" + String.fromCharCode(c) + "')";
      return String(v);
    }
    return String(v);
  };
  VM.prototype.pointeeType = function (t) {
    if (t.pointeeDims) {
      return { base: t.base, ptr: t.ptr - 1, structName: t.structName, dims: null, pointeeDims: null, elemScalarSize: t.elemScalarSize };
    }
    return { base: t.base, ptr: t.ptr - 1, structName: t.structName, dims: null };
  };

  /* ---------- 类型推断（表达式求值同时带出类型，供 printf / 指针运算使用） ---------- */
  function exprType(node, self, frame) {
    switch (node.type) {
      case "Num": return mkT(intLiteralBase(node));
      case "Str": return { base: "char", ptr: 1, structName: null, dims: null };
      case "Ident": {
        var cell = self.findCell(node.name);
        if (cell) return cell.type;
        if (Object.prototype.hasOwnProperty.call(self.enums, node.name)) return mkT("int");
        if (self.funcs[node.name]) {
          var fn0 = self.funcs[node.name];
          return {
            base: fn0.retType.base, ptr: 1, structName: fn0.retType.structName, dims: null,
            funcPtr: { params: fn0.params.map(function (p) { return p.type; }), retType: fn0.retType }
          };
        }
        throw new SimError("使用未声明的变量或函数：“" + node.name + "”");
      }
      case "Cast": return node.castType;
      case "Assign": return exprType(node.target, self, frame);
      case "Binary": {
        var a = exprType(node.left, self, frame), b = exprType(node.right, self, frame);
        if (node.op === "<" || node.op === ">" || node.op === "<=" || node.op === ">=" || node.op === "==" || node.op === "!=" ||
            node.op === "&&" || node.op === "||") return mkT("int");
        if (a.ptr > 0) return a;
        if (b.ptr > 0) return b;
        if (isFP(a) || isFP(b)) return mkT("double");
        return a;
      }
      case "Unary":
        if (node.op === "!") return mkT("int");
        return exprType(node.expr, self, frame);
      case "Cond": return exprType(node.then, self, frame);
      case "Comma": return exprType(node.right, self, frame);
      case "Deref": return self.pointeeType(exprType(node.expr, self, frame));
      case "Addr": {
        var t = exprType(node.expr, self, frame);
        return { base: t.base, ptr: t.ptr + 1, structName: t.structName, dims: null, elemScalarSize: scalarSize(t, self.structs) };
      }
      case "Index": {
        var at = exprType(node.arr, self, frame);
        return self.indexResultType(at);
      }
      case "Member": {
        var ot = exprType(node.obj, self, frame);
        if (node.arrow) ot = self.pointeeType(ot);
        var def = self.structs[ot.structName];
        var m = def && (def.members || []).filter(function (x) { return x.name === node.name; })[0];
        if (!m) throw new SimError("结构体 " + (ot.structName || "?") + " 没有成员 “" + node.name + "”");
        return m.type;
      }
      case "Call": return self.funcReturnType(node);
      case "SizeofType": return mkT("unsigned int");
      case "SizeofExpr": return mkT("unsigned int");
    }
    return mkT("int");
  }
  function mkT(base) { return { base: base, ptr: 0, structName: null, dims: null }; }
  function decay(t) {
    if (t.dims && t.dims.length) {
      return {
        base: t.base, ptr: t.ptr + 1, structName: t.structName, dims: null,
        pointeeDims: t.dims.length > 1 ? t.dims.slice(1) : null,
        elemScalarSize: scalarSize({ base: t.base, ptr: t.ptr, structName: t.structName }, {})
      };
    }
    return t;
  }

  VM.prototype.indexResultType = function (at) {
    var elemScalar = scalarSize({ base: at.base, ptr: at.ptr, structName: at.structName }, this.structs);
    if (at.dims && at.dims.length) {
      var rest = at.dims.slice(1);
      if (rest.length) {
        /* 还有下一维：结果仍是一个数组（行） */
        return { base: at.base, ptr: at.ptr, structName: at.structName, dims: rest, elemScalarSize: elemScalar };
      }
      /* 最后一维：结果是元素本身（标量），不是指针 */
      return { base: at.base, ptr: at.ptr, structName: at.structName, dims: null, elemScalarSize: elemScalar };
    }
    if (at.ptr > 0) return this.pointeeType(at);
    throw new SimError("对非数组/非指针的值使用了 [] 下标");
  };
  /* 步长：指针/数组做 +1 时前进多少字节
     关键是「指向对象」的大小，而不是指针自身的大小：
       char *p   → 1
       int  *p   → 4
       int (*p)[3] / int a[4][3] 的行步长 → 12
     早期实现直接对 {base, ptr} 调 scalarSize，得到的是指针自身大小（4），
     于是 char* 的 p++ 一次跳 4 字节、遍历字符串直接越界。 */
  VM.prototype.indexStride = function (at) {
    if (!at) return 1;
    /* 指向对象的基础类型大小 */
    var baseSize = scalarSize({ base: at.base, ptr: 0, structName: at.structName }, this.structs);
    if (at.dims && at.dims.length) {
      /* 数组：步长 = 去掉第一维后剩余部分的字节数 */
      var rest = at.dims.slice(1);
      if (rest.length) return product(rest) * baseSize;
      return baseSize;
    }
    if (at.ptr > 0) {
      if (at.pointeeDims) return product(at.pointeeDims) * baseSize;
      return baseSize;
    }
    return 1;
  };

  /* ---------- 左值求值 ---------- */
  VM.prototype.lvalue = function (node) {
    var self = this;
    if (node.type === "Ident") {
      var cell = this.findCell(node.name);
      if (!cell) {
        if (this.funcs[node.name]) {
          var fa = this.funcAddress(node.name);
          return {
            type: mkT("void"), addr: fa, cell: null,
            get: function () { return fa; },
            set: function () { throw new SimError("不能给函数名赋值"); }
          };
        }
        if (Object.prototype.hasOwnProperty.call(this.enums, node.name)) {
          throw new SimError("“" + node.name + "” 是枚举常量，不能被赋值");
        }
        throw new SimError("使用未声明的变量：“" + node.name + "”");
      }
      return {
        type: cell.type,
        addr: cell.addr,
        cell: cell,
        get: function () { return cell.isArray() ? cell.addr : cell.value; },
        set: function (v) { cell.value = v; }
      };
    }
    if (node.type === "Deref") {
      var pt = exprType(node.expr, this, this.frame);
      var addr = this.evalNode(node.expr).v | 0;
      var tt = this.pointeeType(pt);
      if (!addr) throw new SimError("解引用了空指针（*NULL）");
      /* 结构体整体解引用：只能来自已声明的变量，按地址精确匹配 */
      if (tt.base === "struct" && tt.ptr === 0) {
        var sc2 = this.resolveCellByAddr(addr, tt.structName, true);
        if (!sc2) throw new SimError("解引用的地址不是一个已知的结构体变量（仿真限制：结构体必须来自已声明的变量）");
        return {
          type: tt, addr: sc2.addr, cell: sc2,
          get: function () { return sc2.addr; },
          set: function (v) { self.memWrite(sc2.addr, v); }
        };
      }
      /* 标量解引用：一律按地址走内存区读写。
         不能走“单元直读”，原因有两个：
           ① *(p+i) 在 i=0 时，地址等于数组单元自身地址，
              直读会拿到整个数组而不是元素；
           ② 地址相同时需要按 elemsize 正确寻址缓冲区内部。 */
      return {
        type: tt,
        addr: addr,
        cell: null,
        get: function () { return self.memRead(addr); },
        set: function (v) { self.memWrite(addr, v); }
      };
    }
    if (node.type === "Index") {
      var at = exprType(node.arr, this, this.frame);
      var base = this.evalNode(node.arr).v | 0;
      var idx = this.evalNode(node.index).v | 0;
      var stride = this.indexStride(at);
      var addr2 = base + idx * stride;
      var rt = this.indexResultType(at);
      var ic = null;
      if (rt.base === "struct" && rt.ptr === 0 && !rt.dims) {
        /* 结构体数组的元素：优先用数组自己登记的元素结构体，
           其次才回退到按地址找结构体区域 */
        var arrCell = this.findCell(node.arr.type === "Ident" ? node.arr.name : null);
        if (arrCell && arrCell.elemStructs && idx >= 0 && idx < arrCell.elemStructs.length) {
          ic = arrCell.elemStructs[idx];
        } else {
          var ireg = this.structRegionAt(addr2) || this.regionAt(addr2);
          if (ireg && ireg.kind === "struct") ic = ireg.cell;
        }
      }
      return {
        type: rt, addr: addr2, cell: ic,
        get: function () { return rt.dims || rt.ptr > 0 ? addr2 : self.memRead(addr2); },
        set: function (v) { self.memWrite(addr2, v); }
      };
    }
    if (node.type === "Member") {
      var ot = exprType(node.obj, this, this.frame);
      var objCell = null, baseAddr = 0;
      if (node.arrow) {
        var pt2 = this.pointeeType(ot);
        baseAddr = this.evalNode(node.obj).v | 0;
        if (!baseAddr) throw new SimError("对空指针使用了 -> 访问");
        /* 先按“指向的结构体类型”精确定位，支持函数参数 / 局部结构体 / 全局结构体 */
        var sc = this.resolveStructCell(baseAddr, ot.structName);
        var r = sc ? null : this.structRegionAt(baseAddr);
        if (!sc && !(r && r.kind === "struct")) {
          throw new SimError("-> 左侧不是指向结构体的指针");
        }
        if (!sc) sc = r.cell;
        objCell = sc;
        ot = pt2;
      } else {
        var lv = this.lvalue(node.obj);
        objCell = lv.cell;
        if (!objCell || !objCell.members) throw new SimError("对非结构体使用了 . 访问");
        baseAddr = lv.addr;
      }
      var mc = objCell.members[node.name];
      if (!mc) {
        var def2 = this.structs[ot.structName];
        throw new SimError("结构体 " + (ot.structName || "?") + " 没有成员 “" + node.name + "”" +
          (def2 && def2.members && def2.members.length ? "" : "（该结构体可能未完整定义）"));
      }
      return {
        type: mc.type, addr: mc.addr, cell: mc,
        get: function () { return mc.isArray() ? mc.addr : mc.value; },
        set: function (v) { mc.value = v; }
      };
    }
    throw new SimError("赋值号左边必须是变量、数组元素或结构体成员");
  };

  /* ---------- 表达式求值 ---------- */
  VM.prototype.evalNode = function (node) {
    var self = this;
    switch (node.type) {
      /* 整数字面量按数值大小选类型（C 的规则：能放进 int 就是 int，
         放不下就升到 long）。若一律按 int 处理，
         2147483648 这类常量会先被截断成负数，溢出判断全部失真。 */
      case "Num": return { v: node.value, t: mkT(intLiteralBase(node)) };
      case "Str": {
        var addr = this.allocString(node.value);
        return { v: addr, t: { base: "char", ptr: 1, structName: null, dims: null } };
      }
      case "Ident": {
        var cell = this.findCell(node.name);
        if (cell) {
          var t = cell.type;
          if (cell.isArray()) return { v: cell.addr, t: t };
          return { v: cell.value, t: t };
        }
        if (Object.prototype.hasOwnProperty.call(this.enums, node.name)) return { v: this.enums[node.name], t: mkT("int") };
        if (this.funcs[node.name]) {
          var fnRef = this.funcs[node.name];
          return {
            v: this.funcAddress(node.name),
            t: {
              base: fnRef.retType.base, ptr: 1, structName: fnRef.retType.structName, dims: null,
              funcPtr: { params: fnRef.params.map(function (p) { return p.type; }), retType: fnRef.retType }
            },
            funcName: node.name
          };
        }
        if (Object.prototype.hasOwnProperty.call(this.builtins, node.name)) return { v: 0, t: mkT("void"), builtinName: node.name };
        throw new SimError("使用未声明的变量或函数：“" + node.name + "”");
      }
      case "Cast": {
        var inner = this.evalNode(node.expr);
        return { v: truncate(inner.v, node.castType), t: node.castType };
      }
      case "Unary": {
        if (node.op === "&") {
          var lv = this.lvalue(node.expr);
          return { v: this.addressOfCell(lv), t: { base: lv.type.base, ptr: lv.type.ptr + 1, structName: lv.type.structName, dims: null, elemScalarSize: scalarSize(lv.type, this.structs) } };
        }
        if (node.op === "!") { var a = this.evalNode(node.expr); return { v: a.v ? 0 : 1, t: mkT("int") }; }
        if (node.op === "~") { var b1 = this.evalNode(node.expr); return { v: ~b1.v | 0, t: b1.t }; }
        if (node.op === "-") { var b2 = this.evalNode(node.expr); return { v: truncate(-b2.v, b2.t), t: b2.t }; }
        if (node.op === "+") { var b3 = this.evalNode(node.expr); return { v: truncate(b3.v, b3.t), t: b3.t }; }
        if (node.op === "++" || node.op === "--") {
          var lv2 = this.lvalue(node.expr);
          var old = lv2.get();
          var pstep = this.stepOf(lv2.type);
          var nv = truncate(old + (node.op === "++" ? pstep : -pstep), lv2.type);
          lv2.set(nv);
          return { v: node.prefix ? nv : old, t: lv2.type };
        }
        break;
      }
      case "Deref": {
        var lv3 = this.lvalue(node);
        return { v: lv3.get(), t: lv3.type };
      }
      case "Addr": {
        var lv4 = this.lvalue(node.expr);
        return {
          v: this.addressOfCell(lv4),
          /* elemScalarSize 必须表达「指向对象的大小」= 取址目标的元素尺寸。
             用 lv.type 直接算会把数组类型也算成整块大小，
             导致 char* 的步长变成数组长度、p++ 直接越界。 */
          t: {
            base: lv4.type.base,
            ptr: lv4.type.ptr + 1,
            structName: lv4.type.structName,
            dims: null,
            elemScalarSize: lv4.cell ? lv4.cell.elemSize : elemScalarSizeOf(lv4.type, this.structs)
          }
        };
      }
      case "Index": {
        var lv5 = this.lvalue(node);
        return { v: lv5.get(), t: lv5.type };
      }
      case "Member": {
        var lv6 = this.lvalue(node);
        return { v: lv6.get(), t: lv6.type };
      }
      case "Binary": return this.evalBinary(node);
      case "Assign": {
        var lv7 = this.lvalue(node.target);
        var rhs = this.evalNode(node.value);
        var value = rhs.v;
        if (node.op !== "=") {
          var cur = lv7.get();
          var a2 = cur, b4 = value;
          /* 指针的 += / -= 要按指向类型的大小移动（int* 每次移动 4 字节） */
          var ps = this.stepOf(lv7.type);
          switch (node.op) {
            case "+=": value = a2 + b4 * ps; break;
            case "-=": value = a2 - b4 * ps; break;
            case "*=": value = a2 * b4; break;
            case "/=":
              if (b4 === 0) throw new SimError("除数为 0（" + node.op + " 运算）");
              value = isFP(lv7.type) ? a2 / b4 : Math.trunc(a2 / b4); break;
            case "%=":
              if (b4 === 0) throw new SimError("取模运算的除数为 0");
              value = a2 % b4; break;
            case "&=": value = a2 & b4; break;
            case "|=": value = a2 | b4; break;
            case "^=": value = a2 ^ b4; break;
            case "<<=": value = a2 << b4; break;
            case ">>=": value = a2 >> b4; break;
          }
        }
        var finalV = truncate(value, lv7.type);
        lv7.set(finalV);
        return { v: finalV, t: lv7.type };
      }
      case "Cond": {
        var c = this.evalNode(node.cond);
        return c.v ? this.evalNode(node.then) : this.evalNode(node.alt);
      }
      case "Comma": {
        this.evalNode(node.left);
        return this.evalNode(node.right);
      }
      case "Call": return this.evalCall(node);
      case "SizeofType": {
        var sz = wholeSize(node.sizeType, this.structs);
        return { v: sz, t: mkT("unsigned int") };
      }
      case "SizeofExpr": {
        var e = node.expr;
        var tt;
        if (e.type === "Ident") {
          var cx = this.findCell(e.name);
          if (cx) { tt = cx.type; return { v: wholeSize(tt, this.structs), t: mkT("unsigned int") }; }
        }
        tt = exprType(e, this, this.frame);
        return { v: wholeSize(tt, this.structs), t: mkT("unsigned int") };
      }
    }
    var tn = exprType(node, this, this.frame);
    return { v: 0, t: tn };
  };

  VM.prototype.evalBinary = function (node) {
    var op = node.op;
    var a = this.evalNode(node.left);
    /* 短路求值 */
    if (op === "&&") {
      if (!a.v) return { v: 0, t: mkT("int") };
      var b = this.evalNode(node.right);
      return { v: b.v ? 1 : 0, t: mkT("int") };
    }
    if (op === "||") {
      if (a.v) return { v: 1, t: mkT("int") };
      var b2 = this.evalNode(node.right);
      return { v: b2.v ? 1 : 0, t: mkT("int") };
    }
    var b3 = this.evalNode(node.right);
    var av = a.v, bv = b3.v;

    /* 指针运算：p + n / p - n / 指针比较 */
    var at = a.t, bt = b3.t;
    if ((op === "+" || op === "-") && (at.ptr > 0 || at.dims)) {
      var stride = this.indexStride(decay(at));
      var n = bv;
      var res = op === "+" ? av + n * stride : av - n * stride;
      return { v: res | 0, t: decay(at) };
    }
    if (op === "-" && bt.ptr > 0 && at.ptr > 0) {
      var st2 = this.indexStride(decay(bt));
      return { v: Math.trunc((av - bv) / st2), t: mkT("int") };
    }
    if (op === "+" && bt.ptr > 0 && at.ptr === 0) {
      var st3 = this.indexStride(decay(bt));
      return { v: (bv + av * st3) | 0, t: decay(bt) };
    }

    var fp = isFP(at) || isFP(bt);
    switch (op) {
      case "+": return { v: fp ? av + bv : truncate(av + bv, this.arithType(at, bt)), t: fp ? mkT("double") : this.arithType(at, bt) };
      case "-": return { v: fp ? av - bv : truncate(av - bv, this.arithType(at, bt)), t: fp ? mkT("double") : this.arithType(at, bt) };
      case "*": return { v: fp ? av * bv : truncate(av * bv, this.arithType(at, bt)), t: fp ? mkT("double") : this.arithType(at, bt) };
      case "/":
        if (bv === 0) throw new SimError("除数为 0：C 里整数除零是未定义行为（真实运行会直接崩溃）。请检查除数为什么是 0。");
        if (fp) return { v: av / bv, t: mkT("double") };
        return { v: truncate(Math.trunc(av / bv), this.arithType(at, bt)), t: this.arithType(at, bt) };
      case "%":
        if (bv === 0) throw new SimError("取模运算的除数为 0");
        if (fp) throw new SimError("浮点数不能做取模运算（%），请用 fmod()");
        return { v: truncate(av % bv, this.arithType(at, bt)), t: this.arithType(at, bt) };
      /* 位运算：int 宽度用 JS 位运算（本来就是 32 位语义）；
         long 宽度则用乘除法模拟移位，避免 JS 位运算强制截断到 32 位。 */
      case "<<": {
        var lt1 = this.arithType(at, bt);
        if (lt1.base === "long" || lt1.base === "unsigned long") {
          return { v: truncate(av * Math.pow(2, bv & 63), lt1), t: lt1 };
        }
        return { v: (av << (bv & 31)) | 0, t: lt1 };
      }
      case ">>": {
        var lt2 = this.arithType(at, bt);
        if (lt2.base === "long" || lt2.base === "unsigned long") {
          var d2 = Math.pow(2, bv & 63);
          return { v: truncate(Math.floor(av / d2), lt2), t: lt2 };
        }
        return { v: (av >> (bv & 31)) | 0, t: lt2 };
      }
      case "&": return { v: truncate(av & bv, this.arithType(at, bt)), t: this.arithType(at, bt) };
      case "|": return { v: truncate(av | bv, this.arithType(at, bt)), t: this.arithType(at, bt) };
      case "^": return { v: truncate(av ^ bv, this.arithType(at, bt)), t: this.arithType(at, bt) };
      case "<": return { v: av < bv ? 1 : 0, t: mkT("int") };
      case ">": return { v: av > bv ? 1 : 0, t: mkT("int") };
      case "<=": return { v: av <= bv ? 1 : 0, t: mkT("int") };
      case ">=": return { v: av >= bv ? 1 : 0, t: mkT("int") };
      case "==": return { v: av === bv ? 1 : 0, t: mkT("int") };
      case "!=": return { v: av !== bv ? 1 : 0, t: mkT("int") };
    }
    throw new SimError("暂不支持的运算符：" + op);
  };
  /* 算术提升：C 里 long 参与运算会把整个表达式提升成 long（64 位）。
     这里必须保留宽度，否则 long 的大数运算会被悄悄截成 32 位——
     这正是「int 溢出、用 long 兜住」这个标准惯用法赖以成立的前提。 */
  VM.prototype.arithType = function (a, b) {
    var ua = a.base.indexOf("unsigned") === 0, ub = b.base.indexOf("unsigned") === 0;
    var isLong = a.base === "long" || a.base === "unsigned long" ||
                 b.base === "long" || b.base === "unsigned long";
    if (isLong) return mkT(ua || ub ? "unsigned long" : "long");
    if (ua || ub) return mkT("unsigned int");
    return mkT("int");
  };
  /* 指针/数组自增自减或加减一个整数时的步长（指向类型的大小） */
  VM.prototype.stepOf = function (t) {
    if (t && (t.ptr > 0 || t.dims)) return this.indexStride(decay(t));
    return 1;
  };

  /* ---------- 函数调用 ---------- */
  VM.prototype.funcReturnType = function (node) {
    if (node.callee.type === "Ident") {
      var cell = this.findCell(node.callee.name);
      if (cell && cell.type && cell.type.funcPtr && cell.type.funcPtr.retType) return cell.type.funcPtr.retType;
      var n = node.callee.name;
      if (this.builtins[n]) return this.builtins[n].ret || mkT("int");
      if (this.funcs[n]) return this.funcs[n].retType;
    }
    var t = null;
    try { t = exprType(node.callee, this, this.frame); } catch (e) { t = null; }
    if (t && t.funcPtr && t.funcPtr.retType) return t.funcPtr.retType;
    return mkT("int");
  };

  VM.prototype.evalCall = function (node) {
    var self = this;
    if (node.callee.type === "Ident") {
      var cell = this.findCell(node.callee.name);
      if (cell && cell.type && cell.type.funcPtr) return this.callByPointerValue(cell.value, node);
      var name = node.callee.name;
      if (this.builtins[name]) return this.callBuiltin(name, node);
      if (this.funcs[name]) {
        var args = node.args.map(function (a) { return self.evalNode(a); });
        return this.callUser(this.funcs[name], args);
      }
      if (cell) throw new SimError("“" + name + "” 是一个变量，不是函数，不能用 () 调用");
      if (Object.prototype.hasOwnProperty.call(this.enums, name)) throw new SimError("“" + name + "” 是枚举常量，不是函数");
    }
    /* 结构体成员/数组元素里的函数指针：先求值拿到合成地址，再按名字调用 */
    var cv = this.evalNode(node.callee);
    if (cv && this.fnPtrs[cv.v]) return this.callByPointerValue(cv.v, node);
    throw new SimError("暂不支持这种调用形式。如果这是函数指针调用，请确认指针已经被正确赋值（例如 cmd_table[0].fn = cmd_pay;）");
  };

  VM.prototype.callByPointerValue = function (addr, node) {
    var name = this.fnPtrs[addr | 0];
    if (!name) {
      throw new SimError("通过空或无效的函数指针调用（地址 0x" + ((addr >>> 0).toString(16)) + "）。真实运行会直接崩溃——这是野指针的经典场景。");
    }
    var fn = this.funcs[name];
    if (!fn) throw new SimError("函数指针指向的 “" + name + "” 未找到");
    var self = this;
    var args = node.args.map(function (a) { return self.evalNode(a); });
    return this.callUser(fn, args);
  };

  VM.prototype.callUser = function (fn, args) {
    if (this.depth >= 48) throw new SimError("函数调用层级过深（超过 48 层），可能是无限递归。请检查递归的终止条件。");
    /* 本帧私有堆区间：形参与局部变量都从这里分配。
       savedAddr 就是本帧基址，配合 cellFrameAddr 可以把
       「结构体单元的地址」换算成帧内可寻址地址，从而支持
       &局部结构体 → 传参 → 用 -> 访问整条链路。 */
    var baseAddr = this.nextAddr;
    var savedAddr = this.nextAddr;
    var savedRegions = this.regions.length;
    var savedUnionWarn = null;
    var frame = { name: fn.name, scopes: [{}], line: fn.line, fn: fn, base: baseAddr };
    this.depth++;
    this.callStack.push(fn.name);
    var prevFrame = this.frame;
    /* 保留外层帧，便于 &局部结构体 跨层解析（递归时也各层独立） */
    if (prevFrame) {
      if (!this.frameStack) this.frameStack = [];
      this.frameStack.push(prevFrame);
    }
    /* 绑定参数 */
    var self = this;
    fn.params.forEach(function (p, i) {
      var cell = new Cell(p.name || ("arg" + i), p.type);
      self.allocCell(cell);
      var av = args[i] || { v: 0, t: p.type };
      cell.value = p.type.dims ? cell.addr : truncate(av.v, p.type);
      frame.scopes[0][cell.name] = cell;
    });
    this.frame = frame;
    var result = { v: 0, t: fn.retType };
    var thrown = null;
    try {
      this.execStmts(fn.body.stmts, frame);
    } catch (e) {
      if (e && e.sig === "return") {
        result = { v: truncate(e.value == null ? 0 : e.value, fn.retType), t: fn.retType };
      } else if (e && e.sig === "break") {
        thrown = new SimError("break 不能用在函数体最外层（不在循环或 switch 中）");
      } else if (e && e.sig === "continue") {
        thrown = new SimError("continue 不能用在函数体最外层");
      } else {
        thrown = e;
      }
    }
    this.frame = prevFrame;
    if (prevFrame && this.frameStack && this.frameStack.length) this.frameStack.pop();
    this.depth--;
    this.callStack.pop();
    this.nextAddr = savedAddr;
    this.regions.length = savedRegions;
    if (thrown) throw thrown;
    return result;
  };

  /* ---------- 语句执行 ---------- */
  VM.prototype.execStmts = function (stmts, frame) {
    for (var i = 0; i < stmts.length; i++) this.execStmt(stmts[i], frame);
  };

  VM.prototype.execStmt = function (st, frame) {
    var self = this;
    switch (st.type) {
      case "ExprStmt":
        this.record(st.line);
        this.evalNode(st.expr);
        return;

      case "Decl":
        this.record(st.line);
        st.items.forEach(function (it) {
          if (!it.name) throw new SimError("变量声明缺少变量名（第 " + st.line + " 行）");
          if (frame.scopes[frame.scopes.length - 1][it.name]) {
            throw new SimError("变量 “" + it.name + "” 在同一作用域内重复定义");
          }
          var cell = new Cell(it.name, self.resolveDims(it.type, it));
          self.allocCell(cell);
          frame.scopes[frame.scopes.length - 1][it.name] = cell;
          if (it.init) self.initCell(cell, it.init);
        });
        return;

      case "Block": {
        this.record(st.line);
        frame.scopes.push({});
        try {
          this.execStmts(st.stmts, frame);
        } finally {
          frame.scopes.pop();
        }
        return;
      }

      case "If": {
        this.record(st.line);
        var c = this.evalNode(st.cond);
        if (c.v) this.execStmt(st.then, frame);
        else if (st.alt) this.execStmt(st.alt, frame);
        return;
      }

      case "While": {
        for (;;) {
          this.record(st.line);
          var cw = this.evalNode(st.cond);
          if (!cw.v) break;
          try { this.execStmt(st.body, frame); }
          catch (e) {
            if (e === BREAK) break;
            if (e === CONTINUE) continue;
            throw e;
          }
        }
        return;
      }

      case "DoWhile": {
        for (;;) {
          this.record(st.line);
          try { this.execStmt(st.body, frame); }
          catch (e) {
            if (e === BREAK) break;
            if (e === CONTINUE) { /* continue 跳到条件判断 */ }
            else throw e;
          }
          var cd = this.evalNode(st.cond);
          if (!cd.v) break;
        }
        return;
      }

      case "For": {
        frame.scopes.push({});       /* for 初始化里声明的变量只在该循环内有效 */
        try {
          if (st.init) {
            if (st.init.type === "Decl") this.execStmt(st.init, frame);
            else { this.record(st.init.line || st.line); this.evalNode(st.init.expr); }
          }
          for (;;) {
            this.record(st.line);
            if (st.cond) { var cf = this.evalNode(st.cond); if (!cf.v) break; }
            try { this.execStmt(st.body, frame); }
            catch (e) {
              if (e === BREAK) break;
              if (e !== CONTINUE) throw e;
            }
            if (st.step) this.evalNode(st.step);
          }
        } finally {
          frame.scopes.pop();
        }
        return;
      }

      case "Switch": {
        this.record(st.line);
        var sv = this.evalNode(st.expr).v;
        var start = -1, hasDefault = -1;
        st.cases.forEach(function (cs, idx) {
          if (cs.val === null) hasDefault = idx;
          else if (start < 0 && cs.val === sv) start = idx;
        });
        if (start < 0) start = hasDefault;
        if (start < 0) return;
        try {
          for (var ci = start; ci < st.cases.length; ci++) {
            this.execStmts(st.cases[ci].stmts, frame);
          }
        } catch (e) {
          if (e !== BREAK) throw e;
        }
        return;
      }

      case "Break": this.record(st.line); throw BREAK;
      case "Continue": this.record(st.line); throw CONTINUE;
      case "Return": {
        this.record(st.line);
        var rv = st.expr ? this.evalNode(st.expr) : { v: 0, t: mkT("int") };
        throw new ReturnSig(rv.v, rv.t);
      }
      default:
        throw new SimError("暂不支持的语句类型：" + st.type);
    }
  };

  /* 把声明里的维度表达式求值成具体长度；未写长度的第一维按初始化列表推断 */
  VM.prototype.resolveDims = function (t, item) {
    if (!t.dims || !t.dims.length) return t;
    var out = { base: t.base, ptr: t.ptr, structName: t.structName, dims: [] };
    var self = this;
    t.dims.forEach(function (d, i) {
      if (d == null) {
        var init = item && item.init;
        if (i === 0 && init && init.type === "Str") out.dims.push(init.value.length + 1);
        else if (i === 0 && init && init.type === "InitList") out.dims.push(Math.max(1, init.list.length));
        else out.dims.push(1);
        return;
      }
      var v = Math.trunc(self.evalNode(d).v);
      if (!(v > 0) || v > 200000) throw new SimError("数组长度不合法：" + v + "（应为正数）");
      out.dims.push(v);
    });
    return out;
  };

  VM.prototype.initCell = function (cell, init) {
    var self = this;
    if (cell.isArray()) {
      /* char 数组用字符串字面量初始化：逐字符拷贝，不足的位置保持 0（NUL） */
      if (init.type === "Str" && isChar(cell.type)) {
        var s0 = init.value;
        for (var q = 0; q < s0.length && q < cell.value.length; q++) cell.value[q] = s0.charCodeAt(q);
        return;
      }
      var flat = [];
      function flatten(node) {
        if (node && node.type === "InitList") node.list.forEach(flatten);
        else flat.push(node);
      }
      if (init.type === "InitList") flatten(init);
      else flat.push(init);
      var max = cell.value.length;
      for (var i = 0; i < Math.min(flat.length, max); i++) {
        cell.value[i] = truncate(self.evalNode(flat[i]).v, cell.type);
      }
      return;
    }
    if (cell.type.base === "struct" && cell.type.ptr === 0 && init.type === "InitList") {
      var names = Object.keys(cell.members || {});
      init.list.forEach(function (node, i) {
        if (names[i]) cell.members[names[i]].value = truncate(self.evalNode(node).v, cell.members[names[i]].type);
      });
      return;
    }
    if (cell.type.ptr > 0 && init.type === "Str") {
      var addr = this.allocString(init.value);
      cell.value = addr;
      return;
    }
    /* 标量初始化：用「目标类型」而不是字面量自身的类型去转换。
       否则 long x = 2147483648 会先按 int 截断成负数，再存进 long。 */
    cell.value = truncate(this.evalNode(init).v, cell.type);
  };

  /* ---------- 输出 ---------- */
  VM.prototype.emit = function (s) {
    if (!s) return;
    this.outChunks.push(s);
  };

  /* ---------- 标准库（简化实现） ---------- */
  VM.prototype.initBuiltins = function () {
    var self = this;
    function needInt(v, what) { return v; }
    this.builtins = {
      printf: { ret: mkT("int"), fn: function (args) {
        if (!args.length) return 0;
        var fmt = self.readCString(args[0].v);
        var ai = 1, out = "";
        for (var i = 0; i < fmt.length; i++) {
          if (fmt[i] !== "%") { out += fmt[i]; continue; }
          i++;
          if (fmt[i] === "%") { out += "%"; continue; }
          var flags = "", width = "", prec = null;
          while ("-+ 0#".indexOf(fmt[i]) >= 0) { flags += fmt[i]; i++; }
          while (fmt[i] >= "0" && fmt[i] <= "9") { width += fmt[i]; i++; }
          if (fmt[i] === "*") { width = String(args[ai].v); ai++; i++; }
          if (fmt[i] === ".") {
            i++; prec = "";
            while (fmt[i] >= "0" && fmt[i] <= "9") { prec += fmt[i]; i++; }
            if (fmt[i] === "*") { prec = String(args[ai].v); ai++; i++; }
            prec = prec === "" ? 0 : parseInt(prec, 10);
          }
          /* 记录长度修饰符（l / ll / h / hh / z / j / t）。
             必须记住它：%ld 要按 64 位输出，不能被后面的 %d 逻辑压成 32 位。
             以前这里只 i++ 直接丢弃，导致 printf("%ld", long变量) 打印出错误的负数。 */
          var lenMod = "";
          while ("hlLqjzt".indexOf(fmt[i]) >= 0) { lenMod += fmt[i]; i++; }
          var isLong = lenMod.indexOf("l") >= 0 || lenMod === "j" || lenMod === "z" || lenMod === "t";
          var spec = fmt[i];
          var arg = args[ai++];
          var val = arg ? arg.v : 0, tt = arg ? arg.t : mkT("int");
          var text = "";
          switch (spec) {
            case "d": case "i":
              text = isLong ? String(clampLong(Math.trunc(val))) : String(truncate(isFP(tt) ? Math.trunc(val) : val, mkT("int")));
              break;
            case "u":
              text = isLong ? String(val < 0 ? 0 : clampLong(val)) : String(truncate(val, mkT("unsigned int")));
              break;
            case "x": text = (truncate(val, mkT("unsigned int")) >>> 0).toString(16); break;
            case "X": text = (truncate(val, mkT("unsigned int")) >>> 0).toString(16).toUpperCase(); break;
            case "o": text = (truncate(val, mkT("unsigned int")) >>> 0).toString(8); break;
            case "c": text = String.fromCharCode(truncate(val, mkT("int")) & 0xff); break;
            case "s": text = tt.ptr > 0 || tt.dims ? self.readCString(val) : String(val); break;
            case "f": case "F": text = (isFP(tt) ? val : Math.trunc(val)).toFixed(prec == null ? 6 : prec); break;
            case "e": case "E": {
              var ex = (isFP(tt) ? val : Math.trunc(val)).toExponential(prec == null ? 6 : prec);
              text = spec === "E" ? ex.toUpperCase() : ex;
              break;
            }
            case "g": case "G": {
              var g = isFP(tt) ? val : 0;
              text = String(Math.round(g * 1e6) / 1e6);
              break;
            }
            case "p": text = "0x" + ((val >>> 0) || 0).toString(16); break;
            case "ld": case "lu": case "lld": case "llu": text = String(val); break;
            default: text = "%" + spec; break;
          }
          if (prec != null && (spec === "d" || spec === "i" || spec === "u" || spec === "x" || spec === "X" || spec === "o" || spec === "s")) {
            while (text.length < prec) text = (spec === "s" ? " " : "0") + text;
          }
          if (width) {
            var w = parseInt(width, 10);
            var padChar = flags.indexOf("0") >= 0 && flags.indexOf("-") < 0 ? "0" : " ";
            while (text.length < w) text = flags.indexOf("-") >= 0 ? text + " " : padChar + text;
          }
          out += text;
        }
        self.emit(out);
        return out.length;
      } },

      puts: { ret: mkT("int"), fn: function (args) { var s = self.readCString(args[0] ? args[0].v : 0); self.emit(s + "\n"); return s.length + 1; } },
      putchar: { ret: mkT("int"), fn: function (args) { var c = (args[0] ? args[0].v : 0) & 0xff; self.emit(String.fromCharCode(c)); return c; } },
      getchar: { ret: mkT("int"), fn: function () {
        if (self.inputPos >= self.input.length) {
          self.warnings.push("getchar() 已读到输入末尾，返回 EOF(-1)。可在「程序输入」框中提供数据。");
          return -1;
        }
        return self.input.charCodeAt(self.inputPos++);
      } },
      scanf: { ret: mkT("int"), fn: function (args) {
        var fmt = self.readCString(args[0] ? args[0].v : 0);
        var ai = 1, count = 0;
        for (var i = 0; i < fmt.length; i++) {
          if (fmt[i] === " " || fmt[i] === "\t") continue;
          if (fmt[i] !== "%") continue;
          i++;
          while ("hlLqjzt".indexOf(fmt[i]) >= 0) i++;
          var spec = fmt[i];
          var target = args[ai++];
          if (!target) break;
          if (spec === "c") {
            if (self.inputPos >= self.input.length) break;
            var ch = self.input.charCodeAt(self.inputPos++);
            self.memWrite(target.v | 0, ch);
            count++;
            continue;
          }
          while (self.inputPos < self.input.length && /\s/.test(self.input[self.inputPos])) self.inputPos++;
          var token = "";
          while (self.inputPos < self.input.length && !/\s/.test(self.input[self.inputPos])) token += self.input[self.inputPos++];
          if (!token) break;
          if (spec === "s") {
            var addr = target.v | 0;
            for (var k = 0; k < token.length; k++) self.memWrite(addr + k, token.charCodeAt(k) & 0xff);
            self.memWrite(addr + token.length, 0);
          } else if (spec === "f" || spec === "e" || spec === "g") {
            self.memWrite(target.v | 0, parseFloat(token) || 0);
          } else if (spec === "x" || spec === "X") {
            self.memWrite(target.v | 0, parseInt(token, 16) || 0);
          } else {
            self.memWrite(target.v | 0, parseInt(token, 10) || 0);
          }
          count++;
        }
        if (!count) self.warnings.push("scanf() 没有读到任何数据，返回值 0。可在「程序输入」框中提供输入（例如：12 34）。");
        return count;
      } },

      strlen: { ret: mkT("unsigned int"), fn: function (args) { return self.readCString(args[0] ? args[0].v : 0).length; } },
      strcmp: { ret: mkT("int"), fn: function (args) {
        var a = self.readCString(args[0] ? args[0].v : 0), b = self.readCString(args[1] ? args[1].v : 0);
        return a < b ? -1 : (a > b ? 1 : 0);
      } },
      strncmp: { ret: mkT("int"), fn: function (args) {
        var n = args[2] ? args[2].v : 0;
        var a = self.readCString(args[0].v).slice(0, n), b = self.readCString(args[1].v).slice(0, n);
        return a < b ? -1 : (a > b ? 1 : 0);
      } },
      strcpy: { ret: { base: "char", ptr: 1 }, fn: function (args) {
        var dst = args[0].v | 0, srcStr = self.readCString(args[1].v);
        for (var i = 0; i < srcStr.length; i++) self.memWrite(dst + i, srcStr.charCodeAt(i) & 0xff);
        self.memWrite(dst + srcStr.length, 0);
        return dst;
      } },
      strncpy: { ret: { base: "char", ptr: 1 }, fn: function (args) {
        var dst = args[0].v | 0, srcStr = self.readCString(args[1].v), n = args[2] ? args[2].v : 0;
        for (var i = 0; i < n; i++) self.memWrite(dst + i, i < srcStr.length ? srcStr.charCodeAt(i) & 0xff : 0);
        return dst;
      } },
      strcat: { ret: { base: "char", ptr: 1 }, fn: function (args) {
        var dst = args[0].v | 0;
        var cur = self.readCString(dst), add = self.readCString(args[1].v);
        var merged = cur + add;
        for (var i = 0; i < merged.length; i++) self.memWrite(dst + i, merged.charCodeAt(i) & 0xff);
        self.memWrite(dst + merged.length, 0);
        return dst;
      } },
      atoi: { ret: mkT("int"), fn: function (args) { return parseInt(self.readCString(args[0] ? args[0].v : 0), 10) || 0; } },
      abs: { ret: mkT("int"), fn: function (args) { return Math.abs(args[0] ? args[0].v : 0) | 0; } },
      labs: { ret: mkT("long"), fn: function (args) { return Math.abs(args[0] ? args[0].v : 0); } },
      fabs: { ret: mkT("double"), fn: function (args) { return Math.abs(args[0] ? args[0].v : 0); } },
      sqrt: { ret: mkT("double"), fn: function (args) { var v = args[0] ? args[0].v : 0; if (v < 0) { self.warnings.push("sqrt() 收到负数参数，仿真返回 0（真实 C 会返回 nan）"); return 0; } return Math.sqrt(v); } },
      pow: { ret: mkT("double"), fn: function (args) { return Math.pow(args[0] ? args[0].v : 0, args[1] ? args[1].v : 0); } },
      memset: { ret: { base: "void", ptr: 1 }, fn: function (args) {
        var dst = args[0].v | 0, val = (args[1] ? args[1].v : 0) & 0xff, n = args[2] ? args[2].v : 0;
        for (var i = 0; i < n; i++) self.memWrite(dst + i, val);
        return dst;
      } },
      memcpy: { ret: { base: "void", ptr: 1 }, fn: function (args) {
        var dst = args[0].v | 0, src = args[1].v | 0, n = args[2] ? args[2].v : 0;
        var tmp = [];
        for (var i = 0; i < n; i++) tmp.push(self.memRead(src + i));
        for (var j = 0; j < n; j++) self.memWrite(dst + j, tmp[j]);
        return dst;
      } },
      isdigit: { ret: mkT("int"), fn: function (args) { var c = args[0] ? args[0].v : 0; return (c >= 48 && c <= 57) ? 1 : 0; } },
      isalpha: { ret: mkT("int"), fn: function (args) { var c = args[0] ? args[0].v : 0; return ((c >= 65 && c <= 90) || (c >= 97 && c <= 122)) ? 1 : 0; } },
      toupper: { ret: mkT("int"), fn: function (args) { var c = args[0] ? args[0].v : 0; return (c >= 97 && c <= 122) ? c - 32 : c; } },
      tolower: { ret: mkT("int"), fn: function (args) { var c = args[0] ? args[0].v : 0; return (c >= 65 && c <= 90) ? c + 32 : c; } },
      rand: { ret: mkT("int"), fn: function () { self.randState = (self.randState * 1103515245 + 12345) & 0x7fffffff; return (self.randState >> 8) % 32768; } },
      srand: { ret: mkT("void"), fn: function (args) { self.randState = (args[0] ? args[0].v : 1) || 1; return 0; } },
      exit: { ret: mkT("void"), fn: function (args) { throw new StopSig("程序调用了 exit(" + (args[0] ? args[0].v : 0) + ")，仿真结束。"); } },
      malloc: { ret: { base: "void", ptr: 1 }, fn: function () {
        throw new SimError("教学仿真不支持 malloc/free（真实嵌入式里也常被禁止）。请改用固定大小的数组或静态缓冲区，例如 char buf[256];");
      } },
      free: { ret: mkT("void"), fn: function () { throw new SimError("教学仿真不支持 free()，因为没有真实堆。请用固定数组/静态缓冲。"); } },
      time: { ret: mkT("long"), fn: function () { return Math.trunc(Date.now() / 1000); } },
      sleep: { ret: mkT("unsigned int"), fn: function () { return 0; } },
      assert: { ret: mkT("void"), fn: function (args) {
        if (!(args[0] && args[0].v)) throw new SimError("assert 断言失败：条件为假（真实程序此时会中止）");
        return 0;
      } }
    };
  };

  VM.prototype.callBuiltin = function (name, node) {
    var self = this;
    var b = this.builtins[name];
    var args = node.args.map(function (a) { return self.evalNode(a); });
    var r = b.fn(args);
    return { v: typeof r === "number" ? truncate(r, b.ret || mkT("int")) : 0, t: b.ret || mkT("int") };
  };

  /* ---------- 主流程 ---------- */
  VM.prototype.setup = function () {
    var self = this;
    this.initBuiltins();
    this.unit.decls.forEach(function (d) {
      if (d.type === "FuncDef") {
        if (!self.funcs[d.name]) self.funcs[d.name] = d;
      } else if (d.type === "FuncDecl") {
        /* 仅声明，忽略 */
      }
    });
    /* 先分配全局变量（函数体里可以引用），再执行带初始化的全局初始化 */
    var pending = [];
    this.unit.decls.forEach(function (d) {
      if (d.type !== "GlobalVar") return;
      d.items.forEach(function (it) {
        if (!it.name) return;
        if (Object.prototype.hasOwnProperty.call(self.globals, it.name)) {
          throw new SimError("全局变量 “" + it.name + "” 重复定义");
        }
        var cell = new Cell(it.name, self.resolveDims(it.type, it));
        self.allocCell(cell);
        self.globals[it.name] = cell;
        if (it.init) pending.push({ cell: cell, init: it.init });
      });
    });
    /* 全局初始化在 main 环境下执行（可以引用字符串常量与常量表达式） */
    var gframe = { name: "(全局初始化)", scopes: [{}], line: 1 };
    this.frame = gframe;
    pending.forEach(function (p) { self.initCell(p.cell, p.init); });
    this.frame = null;
  };

  VM.prototype.runMain = function () {
    var main = this.funcs["main"];
    if (!main) {
      throw new SimError("没有找到 main() 函数。要运行代码片段，请把它放进 int main(void) { ... } 里。");
    }
    var mframe = { name: "main", scopes: [{}], line: main.line, fn: main };
    this.frame = mframe;
    this.depth = 1;
    this.callStack = ["main"];
    try {
      this.execStmts(main.body.stmts, mframe);
    } catch (e) {
      if (e && e.sig === "return") { /* 正常结束 */ }
      else if (e && e.sig === "stop") { /* exit */ }
      else throw e;
    }
    this.depth = 0;
    this.frame = null;
  };

  /* 程序结束时补一条轨迹，便于 UI 展示"最终输出 + 全局变量终态" */
  VM.prototype.recordEnd = function () {
    var self = this;
    var vars = [], seen = {};
    Object.keys(this.globals).forEach(function (k) {
      var cell = self.globals[k];
      if (!cell || seen[cell.addr + "|" + cell.name]) return;
      seen[cell.addr + "|" + cell.name] = 1;
      vars.push([cell.name, self.disp(cell)]);
    });
    this.trace.push({
      n: this.trace.length, line: 0, func: "(程序结束)", depth: 0, vars: vars,
      outLen: this.outChunks.length, text: "程序执行结束", end: true
    });
  };

  /* ---------- 对外接口 ---------- */
  function run(src, opts) {
    opts = opts || {};
    var t0 = Date.now();
    function hasMainOf(u) {
      return (u.decls || []).some(function (d) { return d.type === "FuncDef" && d.name === "main"; });
    }

    /* 填空练习里的 {{n}} 占位符不是合法 C：给出明确提示，而不是让用户看语法错误 */
    if (/\{\{\d+\}\}/.test(src)) {
      var idxs = (src.match(/\{\{\d+\}\}/g) || []).join("、");
      return {
        ok: false, phase: "blank", trace: [], out: "", warnings: [], steps: 0, wrapped: false,
        error: "这段代码里还有填空占位符（" + idxs + "），先把它们替换成你的答案再运行。"
      };
    }

    var parsed = window.CSimParse.parse(src);
    var usedSrc = src, wrapped = false;

    /* 代码片段自动包装：没有 main 就整体包进 main 里执行（课程里的片段可直接跑） */
    if (!(parsed.ok && hasMainOf(parsed.unit))) {
      var wsrc = "int main(void) {\n" + src + "\n}";
      var wp = window.CSimParse.parse(wsrc);
      if (wp.ok && hasMainOf(wp.unit)) {
        parsed = wp; usedSrc = wsrc; wrapped = true;
      } else if (!parsed.ok) {
        /* 原始代码本身就解析不了：优先报原始错误（行号对得上） */
        return { ok: false, error: parsed.error, phase: "parse", trace: [], out: "", warnings: [], steps: 0, wrapped: false };
      } else {
        /* 原始代码是合法的，但只有函数/全局声明，没有 main 也没有语句可执行 */
        var fnNames = (parsed.unit.decls || []).filter(function (d) { return d.type === "FuncDef"; })
          .map(function (d) { return d.name + "()"; });
        return {
          ok: false, phase: "nomain", trace: [], out: "", warnings: [], steps: 0, wrapped: false,
          error: "这段代码是“函数库/声明片段”，没有 main() 入口，所以无法直接运行。" +
            (fnNames.length ? "（包含函数：" + fnNames.join("、") + "）" : "") +
            " 想跑起来，请在末尾补一个 int main(void) { ... }，在里面调用这些函数。"
        };
      }
    }

    if (!parsed.ok) {
      return { ok: false, error: parsed.error, phase: "parse", trace: [], out: "", warnings: [], steps: 0, wrapped: wrapped };
    }

    var vm = new VM(parsed.unit, { source: usedSrc, input: opts.input || "", maxSteps: opts.maxSteps, maxTrace: opts.maxTrace });
    vm.wrapped = wrapped;

    try {
      vm.setup();
      vm.runMain();
      vm.recordEnd();
    } catch (e) {
      var msg = (e && e.isSimError) ? e.message : (e && e.message ? e.message : String(e));
      return {
        ok: false, error: msg, phase: "runtime",
        out: vm.outChunks.join(""), trace: vm.trace, warnings: vm.warnings,
        steps: vm.steps, traceTruncated: vm.traceTruncated, wrapped: wrapped,
        durationMs: Date.now() - t0
      };
    }
    return {
      ok: true,
      out: vm.outChunks.join(""),
      outChunks: vm.outChunks,
      trace: vm.trace,
      warnings: vm.warnings,
      steps: vm.steps,
      traceTruncated: vm.traceTruncated,
      wrapped: wrapped,
      globals: Object.keys(vm.globals),
      durationMs: Date.now() - t0
    };
  }

  function inspect(src) {
    var parsed = window.CSimParse.parse(src);
    if (!parsed.ok) return { ok: false, error: parsed.error };
    var fns = [], globals = [];
    parsed.unit.decls.forEach(function (d) {
      if (d.type === "FuncDef") fns.push(d.name + "(" + d.params.map(function (p) { return typeName(p.type, parsed.unit.structs); }).join(", ") + ")");
      if (d.type === "GlobalVar") d.items.forEach(function (it) { globals.push(typeName(it.type, parsed.unit.structs) + " " + it.name); });
    });
    return { ok: true, funcs: fns, globals: globals, hasMain: parsed.hasMain, structs: Object.keys(parsed.unit.structs || {}) };
  }

  /* 只做“能不能跑”的判定（不执行），用于在章节页决定显示哪个按钮 */
  function check(src) {
    if (!src || !src.trim()) return { ok: false, kind: "empty", error: "没有代码" };
    if (/\{\{\d+\}\}/.test(src)) return { ok: false, kind: "blank", error: "这是填空练习的代码，先替换 {{n}} 占位符再运行" };
    function hasMainOf(u) {
      return (u.decls || []).some(function (d) { return d.type === "FuncDef" && d.name === "main"; });
    }
    var orig = window.CSimParse.parse(src);
    if (orig.ok && hasMainOf(orig.unit)) return { ok: true, kind: "program" };
    var wrapped = "int main(void) {\n" + src + "\n}";
    var wp = window.CSimParse.parse(wrapped);
    if (wp.ok && hasMainOf(wp.unit)) return { ok: true, kind: "snippet" };
    if (orig.ok) return { ok: false, kind: "nomain", error: "只有函数声明，没有 main()，需要补一个入口" };
    return { ok: false, kind: "notc", error: orig.error };
  }

  window.CSim = { run: run, inspect: inspect, check: check, version: "1.0" };
})();


/* ==== test-lab.js ==== */

/* ============================================================
   实验室测试台（在站点内部运行）
   ------------------------------------------------------------
   作用：给浏览器和 Node 冒烟测试共用一套「跑题 → 比对期望输出」的能力。
   站点里叫「实验室测试台」：把编程任务的参考实现真的跑一遍，
   让你看到「这段代码在虚拟机里会输出什么、有没有真正通过」。

   公开接口：window.TestBench = {
     runCode(src, opts)                 -> { pass, out, expect, error, detail, ms }
     runCase(code, c)                   -> 单条用例
     parseCases(code)                   -> 从注释里解析 @case / @in 声明
     runTask(src, code)                 -> 编程任务整体判定（自动绑一个输入适配壳）
   }
   注释约定（写在参考实现里）：
     // @case 入参 => 期望输出
     // @in   第一行\n第二行          （给 scanf 用的标准输入，\n 会被还原成换行）
   ============================================================ */
(function () {
  "use strict";

  var MARK = "@case";
  var IN = "@in";

  /* 把源码按行拆开，从注释里抽出用例声明 */
  function parseCases(code) {
    var cases = [];
    var lines = String(code || "").split("\n");
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var m = line.match(/\/\/\s*@case\s*(.*)$/);
      if (!m) continue;
      var body = m[1].trim();
      var parts = body.split("=>");
      if (parts.length < 2) continue;
      var args = parts[0].trim();
      var expect = parts.slice(1).join("=>").trim();
      case1(cases, args, expect);
    }
    /* @in 块：// @in a\nb  连续多行会合并
       注意：\n 必须还原成真正的换行，否则 scanf 会读到字面的反斜杠+n 而直接失败 */
    var pending = null;
    for (var j = 0; j < lines.length; j++) {
      var im = lines[j].match(/\/\/\s*@in\s*(.*)$/);
      if (!im) { pending = null; continue; }
      if (!pending) { pending = { text: unescape(im[1]) }; cases.push({ raw: "", expect: "", input: pending, inputOnly: true }); }
      else pending.text += "\n" + unescape(im[1]);
    }
    return cases;
  }

  function case1(list, args, expect) {
    list.push({ raw: args, args: splitArgs(args), expect: unescape(expect), input: null });
  }

  /* 解析 @case 左边：支持 `main(数组, 长度) => 输出` 与纯 `=> 输出` */
  function splitArgs(s) {
    if (!s) return [];
    var inner = s;
    var mm = s.match(/^[A-Za-z_]\w*\s*\((.*)\)$/);
    if (mm) inner = mm[1];
    if (!inner.trim()) return [];
    return inner.split(",").map(function (x) { return x.trim(); });
  }

  function unescape(s) {
    return String(s).replace(/\\n/g, "\n").replace(/\\t/g, "\t");
  }

  /* 判断某段代码是不是「有 main 的完整程序」 */
  function hasMain(src) {
    if (!window.CSimParse || !window.CSim) return false;
    var r = window.CSimParse.parse(src);
    return !!(r.ok && (r.unit.decls || []).some(function (d) {
      return d.type === "FuncDef" && d.name === "main";
    }));
  }

  /* 跑一段代码，比对期望输出 */
  function runCode(src, opts) {
    opts = opts || {};
    var t0 = Date.now();
    if (!window.CSim) {
      return { pass: false, error: "仿真引擎没有加载（缺 sim-core.js / sim-vm.js）", ms: 0 };
    }
    var r = window.CSim.run(src, {
      input: opts.input || "",
      maxSteps: opts.maxSteps || 300000,
      maxTrace: opts.maxTrace || 300
    });
    var ms = Date.now() - t0;
    if (!r.ok) {
      return { pass: false, out: r.out || "", expect: opts.expect, error: r.error, ms: ms };
    }
    var out = normOut(r.out);
    if (opts.expect == null) return { pass: true, out: out, expect: null, ms: ms };
    var exp = normOut(unescape(opts.expect));
    return {
      pass: out === exp,
      out: out,
      expect: exp,
      ms: ms,
      detail: out === exp ? "" : "期望输出与实到输出不一致",
      warnings: r.warnings
    };
  }

  /* 输出归一化：去掉每行尾部空格、去掉末尾空行，避免格式差异误判 */
  function normOut(s) {
    return String(s == null ? "" : s)
      .replace(/\r/g, "")
      .split("\n").map(function (l) { return l.replace(/\s+$/, ""); }).join("\n")
      .replace(/\n+$/, "");
  }

  /* 给「函数型任务」生成 main 适配壳：按签名把 @case 的参数字面量传进去，
     并把返回值（或数组型输出参数）打印出来，使期望值可以写成裸字面量。
     返回一段完整的可运行源码；函数签名与用例不匹配时返回 null。 */
  function buildHarness(src, cases) {
    if (!cases.length) return null;
    var sig = detectSig(src);
    if (!sig || sig.name === "main") return null;
    var c = cases[0];
    if (c.args.length !== sig.params.length) return null;

    var decls = [], calls = [];
    for (var i = 0; i < sig.params.length; i++) {
      var p = sig.params[i];
      decls.push("    " + p.type + " " + p.name + " = " + c.args[i] + ";");
      calls.push(p.name);
    }
    var lines = decls.slice();
    if (sig.retType === "void") {
      lines.push("    " + sig.name + "(" + calls.join(", ") + ");");
    } else {
      lines.push("    printf(\"%d\\n\", (int)" + sig.name + "(" + calls.join(", ") + "));");
    }
    lines.push("    return 0;");
    return {
      sig: sig,
      code: src + "\nint main(void) {\n" + lines.join("\n") + "\n}\n",
      /* 后续用例只替换参数声明行，函数体保持不变 */
      rebuild: function (cc) {
        var d = [], ca = [];
        for (var k = 0; k < sig.params.length; k++) {
          var q = sig.params[k];
          d.push("    " + q.type + " " + q.name + " = " + (cc.args[k] != null ? cc.args[k] : "0") + ";");
          ca.push(q.name);
        }
        var ls = d.slice();
        if (sig.retType === "void") ls.push("    " + sig.name + "(" + ca.join(", ") + ");");
        else ls.push("    printf(\"%d\\n\", (int)" + sig.name + "(" + ca.join(", ") + "));");
        ls.push("    return 0;");
        return src + "\nint main(void) {\n" + ls.join("\n") + "\n}\n";
      }
    };
  }

  /* 极简函数签名识别：取第一个非 main 的函数定义及其参数「类型 名字」 */
  function detectSig(code) {
    var m = code.match(/\b(?:int|void|char|short|long|unsigned|signed|float|double|size_t|uint\d+_t|int\d+_t)\s*(\*{0,2})\s*([A-Za-z_]\w*)\s*\(([^)]*)\)\s*\{/);
    if (!m) return null;
    var name = m[2];
    var rawParams = m[3].trim();
    var params = [];
    if (rawParams && rawParams !== "void") {
      rawParams.split(",").forEach(function (p) {
        p = p.trim();
        if (!p) return;
        var pm = p.match(/^(.*?)([A-Za-z_]\w*)$/);
        if (!pm) return;
        var tp = pm[1].trim();
        var nm = pm[2];
        if (!tp) tp = "int";
        /* 数组形参写成 int *arr 交给引擎（数组名退化为指针） */
        tp = tp.replace(/\[[^\]]*\]/g, "*");
        params.push({ type: tp, name: nm });
      });
    }
    var retType = m[1].replace(/\s*/g, "") === "*" ? "int *" : m[0].split(/\s+/)[0].replace("*", "");
    return { name: name, params: params, retType: retType === "void" ? "void" : "int" };
  }

  /* 编程任务整体判定：
     ① 若参考实现自带 main → 直接按 @case 的期望输出跑
     ② 若是函数型任务 → 自动加 main 适配壳再跑
     ③ 无 @case 但有 @in → 按输入跑，不做输出比对（只判「能不能跑通」） */
  function runTask(src, code) {
    var cases = parseCases(code || "");
    var result = {
      task: true, total: 0, passed: 0, items: [],
      hasCases: cases.length > 0, note: ""
    };
    if (!cases.length) {
      var r0 = runCode(src, {});
      var empty = !String(src || "").trim();
      result.total = 1;
      result.passed = (r0.pass && !empty) ? 1 : 0;
      result.items.push({
        label: empty ? "空代码" : "运行",
        pass: result.passed === 1,
        out: r0.out,
        expect: null,
        error: empty ? "没有可运行的内容" : r0.error
      });
      result.note = "这份参考答案没有声明测试用例，只检查「能否解析并运行」，请在代码里补 // @case 注释让它变成真正可验证的用例。";
      return result;
    }
    var harness = buildHarness(src, cases);
    if (harness) {
      result.note = "已自动生成 main() 适配壳调用 " + harness.sig.name + "()，把你的实现当作函数库来测。";
      cases.forEach(function (c, i) {
        if (c.inputOnly) return;
        /* 适配壳用 printf("%d\n", ...) 把返回值打出来，
           所以期望值可以写成裸字面量（55），也可以写成带引号的形式（"55"），
           这里统一去引号，避免格式差异误判。 */
        var r = runCode(harness.rebuild(c), {
          input: c.inputText || "",
          expect: normOut(unescape(c.expect)).replace(/^"|"$/g, "")
        });
        result.total++;
        if (r.pass) result.passed++;
        result.items.push({
          label: "用例 " + (i + 1) + "：" + harness.sig.name + "(" + c.args.join(", ") + ")",
          pass: r.pass, out: r.out, expect: c.expect, error: r.error
        });
      });
      return result;
    }
    /* 带 main 的程序：优先用 @in 输入跑，按 @case 期望输出比对 */
    var inputText = "", expectOut = null;
    cases.forEach(function (c) {
      if (c.inputOnly && c.input) inputText = c.input.text;
      if (!c.inputOnly && expectOut == null) expectOut = c.expect;
    });
    var r2 = runCode(src, { input: inputText, expect: expectOut });
    result.total = 1;
    result.passed = r2.pass ? 1 : 0;
    result.items.push({ label: "整程序运行", pass: r2.pass, out: r2.out, expect: expectOut, error: r2.error });
    return result;
  }

  window.TestBench = {
    version: "1.0",
    runCode: runCode,
    runCase: function (src, c) { return runCode(src, { input: c.input, expect: c.expect }); },
    parseCases: parseCases,
    runTask: runTask,
    normOut: normOut,
    hasMain: hasMain
  };
})();


/* ==== hw-sim.js ==== */

/* ============================================================
   硬件交互仿真  hw-sim.js
   ------------------------------------------------------------
   给「虚拟实验室」页挂三块可点可调的小实验（Canvas）：
     1) LED + 限流电阻：调电压/电阻，看电流与 LED 状态
     2) 电压分压：调 R1/R2，看输出电压
     3) UART 波形：调波特率与数据，看一帧时序
   纯本地、无依赖。挂载入口：window.HwSim.mount(el)
   ============================================================ */
(function () {
  "use strict";

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "class") n.className = attrs[k];
        else if (k === "text") n.textContent = attrs[k];
        else n.setAttribute(k, attrs[k]);
      });
    }
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }

  function slider(label, min, max, step, val, onInput) {
    var out = el("span", { class: "hw-sim-val", text: String(val) });
    var input = el("input", {
      type: "range", min: String(min), max: String(max),
      step: String(step), value: String(val)
    });
    input.addEventListener("input", function () {
      out.textContent = input.value;
      onInput(parseFloat(input.value));
    });
    var row = el("div", { class: "hw-sim-row" }, [
      el("span", { class: "hw-sim-label", text: label }),
      input,
      out
    ]);
    return { row: row, input: input, out: out, get: function () { return parseFloat(input.value); } };
  }

  /* ---------- 1. LED 限流电阻 ---------- */
  function simLed(host) {
    var canvas = el("canvas", { class: "hw-sim-canvas", width: "560", height: "180" });
    var info = el("div", { class: "hw-sim-info", text: "" });
    var vs = slider("电源电压 V (1.0~5.0)", 1, 5, 0.1, 3.3, draw);
    var rs = slider("限流电阻 R (50~2000 Ω)", 50, 2000, 10, 330, draw);
    var vf = slider("LED 压降 Vf (1.6~3.4)", 1.6, 3.4, 0.1, 2.0, draw);

    function draw() {
      var V = vs.get(), R = rs.get(), Vf = vf.get();
      var I = (V - Vf) / R * 1000; /* mA */
      var ok = I > 0 && I <= 20;
      var dead = I > 20;
      var dark = I <= 0;
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "12px sans-serif";
      /* 简化电路图：电池 — R — LED — GND */
      ctx.strokeStyle = "#444";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(40, 40); ctx.lineTo(40, 140);
      ctx.moveTo(40, 90); ctx.lineTo(160, 90);
      ctx.moveTo(160, 90); ctx.lineTo(160, 60);
      ctx.moveTo(160, 120); ctx.lineTo(160, 90);
      ctx.moveTo(160, 90); ctx.lineTo(300, 90);
      ctx.moveTo(300, 60); ctx.lineTo(300, 120);
      ctx.moveTo(300, 90); ctx.lineTo(420, 90);
      ctx.moveTo(420, 90); ctx.lineTo(420, 140);
      ctx.moveTo(360, 140); ctx.lineTo(480, 140);
      ctx.stroke();
      ctx.fillStyle = "#333";
      ctx.fillText("Vcc " + V.toFixed(1) + "V", 20, 30);
      ctx.fillText("R=" + R + "Ω", 175, 55);
      ctx.fillText("LED Vf=" + Vf.toFixed(1) + "V", 310, 55);
      /* LED 发光 */
      ctx.fillStyle = dead ? "#c0392b" : (dark ? "#95a5a6" : "#f1c40f");
      ctx.beginPath();
      ctx.arc(360, 90, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#222";
      ctx.fillText(dead ? "过流！" : (dark ? "太暗/不亮" : "正常发光"), 320, 155);
      info.textContent = "电流 I = (V-Vf)/R = " + I.toFixed(2) + " mA" +
        (dead ? " ＞20mA，会烧 LED 或 IO，需要加大 R 或降低 V。" :
          (dark ? " 电流不足，LED 不会亮。" : " 在常见 2~20mA 安全区。"));
    }

    host.appendChild(el("h3", { text: "① LED 限流电阻（拖动滑块）" }));
    host.appendChild(canvas);
    host.appendChild(vs.row);
    host.appendChild(rs.row);
    host.appendChild(vf.row);
    host.appendChild(info);
    draw();
  }

  /* ---------- 2. 电压分压 ---------- */
  function simDiv(host) {
    var canvas = el("canvas", { class: "hw-sim-canvas", width: "560", height: "170" });
    var info = el("div", { class: "hw-sim-info", text: "" });
    var vs = slider("输入 Vin (1~12 V)", 1, 12, 0.1, 5, draw);
    var r1 = slider("R1 上臂 (100~20000 Ω)", 100, 20000, 100, 10000, draw);
    var r2 = slider("R2 下臂 (100~20000 Ω)", 100, 20000, 100, 10000, draw);

    function draw() {
      var Vin = vs.get(), R1 = r1.get(), R2 = r2.get();
      var Vout = Vin * R2 / (R1 + R2);
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "12px sans-serif";
      ctx.strokeStyle = "#444"; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(60, 30); ctx.lineTo(60, 140);
      ctx.moveTo(60, 50); ctx.lineTo(280, 50);
      ctx.moveTo(280, 50); ctx.lineTo(280, 80);
      ctx.moveTo(280, 110); ctx.lineTo(280, 50);
      ctx.moveTo(280, 50); ctx.lineTo(280, 80);
      ctx.moveTo(280, 80); ctx.lineTo(280, 110);
      ctx.moveTo(280, 110); ctx.lineTo(280, 140);
      ctx.moveTo(280, 80); ctx.lineTo(420, 80);
      ctx.moveTo(420, 80); ctx.lineTo(420, 140);
      ctx.stroke();
      ctx.fillStyle = "#333";
      ctx.fillText("Vin " + Vin.toFixed(1) + "V", 20, 25);
      ctx.fillText("R1 " + R1 + "Ω", 300, 55);
      ctx.fillText("R2 " + R2 + "Ω", 300, 125);
      ctx.fillText("Vout", 430, 75);
      ctx.fillStyle = "#2c3e50";
      ctx.fillRect(400, 70, 80, 24);
      ctx.fillStyle = "#fff";
      ctx.fillText(Vout.toFixed(2) + "V", 418, 86);
      info.textContent = "Vout = Vin × R2/(R1+R2) = " + Vout.toFixed(2) +
        "V。给 MCU ADC 采样时，确认 Vout ≤ 参考电压（常见 3.3V）。";
    }

    host.appendChild(el("h3", { text: "② 电压分压（传感器/电池采样常用）" }));
    host.appendChild(canvas);
    host.appendChild(vs.row);
    host.appendChild(r1.row);
    host.appendChild(r2.row);
    host.appendChild(info);
    draw();
  }

  /* ---------- 3. UART 一帧波形 ---------- */
  function simUart(host) {
    var canvas = el("canvas", { class: "hw-sim-canvas", width: "560", height: "200" });
    var info = el("div", { class: "hw-sim-info", text: "" });
    var baud = slider("波特率 (9600 / 115200 常见)", 2400, 230400, 2400, 115200, draw);
    var data = slider("数据字节 (0~255，示例)", 0, 255, 1, 0x55, draw);
    var bits = slider("数据位 (7 或 8)", 7, 8, 1, 8, draw);

    function draw() {
      var b = baud.get(), val = data.get(), nbits = bits.get();
      var bitTime = 1 / b;
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "12px sans-serif";
      /* 波形：起始位 0 + n 数据位 + 停止位 1 */
      var seq = [0];
      for (var i = 0; i < nbits; i++) seq.push((val >> i) & 1);
      seq.push(1);
      var x0 = 40, x1 = 520, w = x1 - x0;
      var slot = w / seq.length;
      var yLow = 130, yHigh = 50;
      ctx.strokeStyle = "#2980b9";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x0, yLow);
      seq.forEach(function (bit, idx) {
        var xa = x0 + idx * slot, xb = xa + slot;
        var y = bit ? yHigh : yLow;
        ctx.lineTo(xa, y);
        ctx.lineTo(xb, y);
      });
      ctx.stroke();
      ctx.fillStyle = "#333";
      ctx.fillText("UART 一帧：起始(0) + " + nbits + " 数据位(LSB先) + 停止(1)", 40, 30);
      ctx.fillText("bit 时间 ≈ " + (bitTime * 1e6).toFixed(1) + " µs（1/" + b + "）", 40, 165);
      ctx.fillText("数据 0x" + val.toString(16).toUpperCase().padStart(2, "0") +
        " = " + seq.slice(1, 1 + nbits).join(""), 40, 185);
      info.textContent = "空闲为高；起始位拉低告诉接收方「一帧开始」；停止位回到高。" +
        "波形对不上时先查两端波特率是否一致、是否共地。";
    }

    host.appendChild(el("h3", { text: "③ UART 一帧波形（软硬件交界）" }));
    host.appendChild(canvas);
    host.appendChild(baud.row);
    host.appendChild(data.row);
    host.appendChild(bits.row);
    host.appendChild(info);
    draw();
  }

  function mount(host) {
    if (!host) return;
    host.innerHTML = "";
    host.appendChild(el("p", {
      class: "hw-sim-intro",
      text: "下面三个小实验用滑块调参数，实时看电路与波形。对应硬件课的「限流 / 分压 / 串口时序」——先在这里建立直觉，再上示波器。"
    }));
    simLed(host);
    simDiv(host);
    simUart(host);
  }

  window.HwSim = { mount: mount };
})();


/* ==== motivate.js ==== */

/* ============================================================
   坚持激励  motivate.js
   ------------------------------------------------------------
   让「每天来练几题」变成有反馈的循环：连续打卡、经验等级、
   每日目标、成就徽章。进度单独存 emb-motivate-v1，
   **不动 emb-study-v1 的结构**（那是学习进度）。

   对外接口：
     Motivate.onAnswer(correct)   做完一题后调用
     Motivate.bannerHTML()        首页激励横幅
     Motivate.headerHTML()        顶栏小徽章（连胜/等级）
     Motivate.toast(text)         轻提示
   ============================================================ */
(function () {
  "use strict";

  var KEY = "emb-motivate-v1";
  var DAY_GOAL = 10; /* 每日目标：10 题 */

  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY));
      if (s && typeof s === "object") {
        if (!s.ach) s.ach = {};
        return s;
      }
    } catch (e) {}
    return { xp: 0, ach: {}, lastDay: "", bestStreak: 0, daysTotal: 0 };
  }
  function save(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  }
  var st = load();

  function dayKey(d) {
    var t = d ? new Date(d) : new Date();
    var m = t.getMonth() + 1, day = t.getDate();
    return t.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (day < 10 ? "0" : "") + day;
  }
  function parseDay(k) {
    var p = String(k).split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function addDays(k, n) {
    var d = parseDay(k);
    d.setDate(d.getDate() + n);
    return dayKey(d);
  }

  /* 从学习进度读「哪天做过题、做了几题」 */
  function daysMap() {
    try {
      var s = JSON.parse(localStorage.getItem("emb-study-v1"));
      return (s && s.days) || {};
    } catch (e) { return {}; }
  }
  function todayCount() {
    return daysMap()[dayKey()] || 0;
  }
  function streakNow() {
    var days = daysMap();
    if (!days[dayKey()] && !days[addDays(dayKey(), -1)]) return 0;
    var n = 0;
    var k = days[dayKey()] ? dayKey() : addDays(dayKey(), -1);
    while (days[k]) { n++; k = addDays(k, -1); }
    return n;
  }

  /* ---------- 等级 ---------- */
  var LEVELS = [
    { xp: 0, name: "见习学员", icon: "🌱" },
    { xp: 80, name: "入门学徒", icon: "📘" },
    { xp: 250, name: "勤奋工匠", icon: "🔧" },
    { xp: 600, name: "熟练工程师", icon: "⚡" },
    { xp: 1200, name: "项目骨干", icon: "🏗️" },
    { xp: 2200, name: "硬核大神", icon: "🚀" },
    { xp: 4000, name: "传说级学者", icon: "🏆" }
  ];
  function levelOf(xp) {
    var cur = LEVELS[0], next = null;
    for (var i = 0; i < LEVELS.length; i++) {
      if (xp >= LEVELS[i].xp) cur = LEVELS[i];
      else { next = LEVELS[i]; break; }
    }
    return { cur: cur, next: next };
  }

  /* ---------- 成就 ---------- */
  var ACHS = [
    { id: "first", name: "破冰", desc: "完成第一道题", icon: "🎯",
      test: function (d) { return d.ok + d.bad >= 1; } },
    { id: "ok10", name: "小有手感", desc: "累计答对 10 题", icon: "✅",
      test: function (d) { return d.ok >= 10; } },
    { id: "ok50", name: "渐入佳境", desc: "累计答对 50 题", icon: "💪",
      test: function (d) { return d.ok >= 50; } },
    { id: "ok200", name: "题海行者", desc: "累计答对 200 题", icon: "🌊",
      test: function (d) { return d.ok >= 200; } },
    { id: "streak3", name: "三日之功", desc: "连续学习 3 天", icon: "🔥",
      test: function (d) { return d.streak >= 3; } },
    { id: "streak7", name: "一周不断", desc: "连续学习 7 天", icon: "⭐",
      test: function (d) { return d.streak >= 7; } },
    { id: "streak21", name: "习惯养成", desc: "连续学习 21 天", icon: "💎",
      test: function (d) { return d.streak >= 21; } },
    { id: "dayGoal", name: "今日达标", desc: "单日完成 " + DAY_GOAL + " 题", icon: "🏁",
      test: function (d) { return d.today >= DAY_GOAL; } },
    { id: "days10", name: "十日积累", desc: "累计学习 10 天", icon: "📅",
      test: function (d) { return d.daysTotal >= 10; } }
  ];

  function stats() {
    var days = daysMap();
    var ok = 0, bad = 0;
    try {
      var s = JSON.parse(localStorage.getItem("emb-study-v1"));
      var ans = (s && s.ans) || {};
      Object.keys(ans).forEach(function (k) {
        ok += (ans[k].ok || 0);
        bad += (ans[k].bad || 0);
      });
    } catch (e) {}
    var streak = streakNow();
    var today = todayCount();
    var daysTotal = Object.keys(days).length;
    return { ok: ok, bad: bad, streak: streak, today: today, daysTotal: daysTotal };
  }

  function toast(text) {
    var box = document.getElementById("motivateToast");
    if (!box) {
      box = document.createElement("div");
      box.id = "motivateToast";
      box.className = "motivate-toast";
      document.body.appendChild(box);
    }
    box.textContent = text;
    box.classList.add("show");
    clearTimeout(box._t);
    box._t = setTimeout(function () { box.classList.remove("show"); }, 3200);
  }

  function checkAch() {
    var d = stats();
    d.ok = d.ok; /* 用累计答对 */
    ACHS.forEach(function (a) {
      if (st.ach[a.id]) return;
      try {
        if (a.test(d)) {
          st.ach[a.id] = Date.now();
          st.xp += 25;
          save(st);
          toast("🎉 解锁成就「" + a.icon + " " + a.name + "」 +25 XP · " + a.desc);
        }
      } catch (e) {}
    });
  }

  function onAnswer(correct) {
    st.xp += correct ? 12 : 4;
    if (streakNow() >= 3) st.xp += 2; /* 连胜加成 */
    var dk = dayKey();
    if (st.lastDay !== dk) {
      st.lastDay = dk;
      st.daysTotal = (st.daysTotal || 0) + 1;
      var s = streakNow();
      if (s > (st.bestStreak || 0)) st.bestStreak = s;
    }
    save(st);
    checkAch();
    var t = todayCount();
    if (t === DAY_GOAL) toast("🏆 今日目标达成！明天继续，连胜不断更香。");
    else if (correct && t % 5 === 0 && t > 0) toast("⚡ 今天已刷 " + t + " 题，手感在线！");
  }

  /* ---------- HTML ---------- */
  function headerHTML() {
    var d = stats();
    var lv = levelOf(st.xp);
    return '<span class="motivate-chip" title="等级与连续学习">' +
      lv.cur.icon + " " + esc(lv.cur.name) +
      (d.streak >= 2 ? ' <b class="streak">🔥' + d.streak + "</b>" : "") +
      "</span>";
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function bannerHTML() {
    var d = stats();
    var lv = levelOf(st.xp);
    var pctDay = Math.min(100, Math.round((d.today / DAY_GOAL) * 100));
    var next = lv.next;
    var xpIn = st.xp - lv.cur.xp;
    var xpNeed = next ? next.xp - lv.cur.xp : 1;
    var pctLv = next ? Math.min(100, Math.round((xpIn / xpNeed) * 100)) : 100;
    var tip = "今天完成 " + DAY_GOAL + " 题就达标；连胜会加经验。";
    if (d.streak >= 7) tip = "已连胜 " + d.streak + " 天，别断！断了要从头数。";
    else if (d.today === 0) tip = "今天还没开张——先做 3 题热热身，手感回来了再加量。";
    else if (d.today >= DAY_GOAL) tip = "今日已达标，想冲连胜就再来两题收尾。";

    var h = '<section class="card motivate-card" id="motivateCard">';
    h += '<div class="mv-left">';
    h += '<div class="mv-level"><span class="mv-icon">' + lv.cur.icon + "</span><div>";
    h += "<b>" + esc(lv.cur.name) + "</b>";
    h += '<div class="mv-xp">' + st.xp + " XP" + (next ? " · 距「" + esc(next.name) + "」还差 " + (next.xp - st.xp) + " XP" : " · 已满级") + "</div>";
    h += '<div class="pbar thin"><i style="width:' + pctLv + '%"></i></div>';
    h += "</div></div>";
    h += '<div class="mv-streak"><span class="mv-num">' + d.streak + '</span><span class="mv-label">连续天数<br><small>最佳 ' + (st.bestStreak || d.streak) + "</small></span></div>";
    h += "</div>";
    h += '<div class="mv-right">';
    h += '<div class="mv-goal"><b>今日目标</b><span>' + d.today + " / " + DAY_GOAL + " 题</span>" +
         '<div class="pbar thin"><i style="width:' + pctDay + '%"></i></div></div>';
    h += '<p class="mv-tip">' + esc(tip) + "</p>";
    /* 成就墙 */
    h += '<div class="mv-achs">';
    ACHS.forEach(function (a) {
      var got = !!st.ach[a.id];
      h += '<span class="mv-ach' + (got ? " on" : "") + '" title="' + esc(a.desc) + '">' + a.icon + esc(a.name) + "</span>";
    });
    h += "</div>";
    h += '<p class="mv-cta"><a class="btn primary small" href="#/quiz/c">去刷题拿经验 ›</a>' +
         '<a class="btn ghost small" href="#/weak">先补薄弱点</a></p>';
    h += "</div></section>";
    return h;
  }

  window.Motivate = {
    onAnswer: onAnswer,
    bannerHTML: bannerHTML,
    headerHTML: headerHTML,
    toast: toast,
    DAY_GOAL: DAY_GOAL
  };
})();


/* ==== notes.js ==== */

/* ============================================================
   笔记与收藏  notes.js
   键 emb-notes-v1：{ items: { [key]: { fav, note, ch, title, at } } }
   ============================================================ */
(function () {
  "use strict";
  var KEY = "emb-notes-v1";

  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY));
      if (s && s.items) return s;
    } catch (e) {}
    return { items: {} };
  }
  function save(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  }
  var st = load();

  function keyOf(chId, idx) {
    return chId + ":" + idx;
  }

  function toggleFav(chId, idx, title) {
    var k = keyOf(chId, idx);
    var it = st.items[k] || (st.items[k] = { fav: 0, note: "", ch: chId, title: title || "", at: Date.now() });
    it.fav = it.fav ? 0 : 1;
    it.at = Date.now();
    if (title) it.title = title;
    save(st);
    return !!it.fav;
  }

  function setNote(chId, idx, text, title) {
    var k = keyOf(chId, idx);
    var it = st.items[k] || (st.items[k] = { fav: 0, note: "", ch: chId, title: title || "", at: Date.now() });
    it.note = String(text || "");
    it.at = Date.now();
    if (title) it.title = title;
    if (!it.note && !it.fav) delete st.items[k];
    save(st);
  }

  function get(chId, idx) {
    return st.items[keyOf(chId, idx)] || { fav: 0, note: "" };
  }

  function all() {
    return Object.keys(st.items).map(function (k) {
      var it = st.items[k];
      return { key: k, fav: it.fav, note: it.note, ch: it.ch, title: it.title, at: it.at };
    }).sort(function (a, b) { return (b.at || 0) - (a.at || 0); });
  }

  window.Notes = {
    toggleFav: toggleFav,
    setNote: setNote,
    get: get,
    all: all,
    store: st
  };
})();


/* ==== review.js ==== */

/* ============================================================
   间隔复习  review.js
   ------------------------------------------------------------
   1-3-7-15 天排期：答对升档、答错回档；生成「今日待复习」。
   存储键 emb-review-v1（不改动 emb-study-v1 结构）。

     Review.onAnswer(qid, correct)
     Review.dueList()          -> [qid,...]
     Review.dueCount()
     Review.bannerHTML()       首页「今日待复习」条
     Review.isDue(qid)
   ============================================================ */
(function () {
  "use strict";

  var KEY = "emb-review-v1";
  /* 阶段 → 下次复习间隔（天）；stage 4 为「已巩固」30 天 */
  var GAPS = [1, 3, 7, 15, 30];
  var MASTER = 5;

  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY));
      if (s && typeof s === "object" && s.map) return s;
    } catch (e) {}
    return { map: {} };
  }
  function save(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  }
  var st = load();

  function dayKey(d) {
    var t = d ? new Date(d) : new Date();
    var m = t.getMonth() + 1, day = t.getDate();
    return t.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (day < 10 ? "0" : "") + day;
  }
  function endOfToday() {
    var t = new Date();
    t.setHours(23, 59, 59, 999);
    return t.getTime();
  }

  function onAnswer(qid, correct) {
    if (!qid) return;
    var e = st.map[qid] || (st.map[qid] = { stage: 0, due: 0, last: 0, ok: 0, bad: 0 });
    e.last = Date.now();
    if (correct) {
      e.ok = (e.ok || 0) + 1;
      /* 首次答对：进入第 1 档，明天复习；再对则按表加长 */
      if (e.stage < GAPS.length - 1) e.stage = e.stage + 1;
      var gap = GAPS[Math.min(e.stage, GAPS.length - 1)];
      e.due = Date.now() + gap * 86400000;
    } else {
      e.bad = (e.bad || 0) + 1;
      e.stage = 0;
      e.due = Date.now() + 4 * 3600000; /* 答错：4 小时后再见 */
    }
    save(st);
  }

  function isDue(qid) {
    var e = st.map[qid];
    return !!(e && e.due && e.due <= endOfToday());
  }

  function dueList() {
    var out = [];
    Object.keys(st.map).forEach(function (id) {
      if (isDue(id)) out.push(id);
    });
    /* 快到的排前面：越早到期越先复习 */
    out.sort(function (a, b) {
      return (st.map[a].due || 0) - (st.map[b].due || 0);
    });
    return out;
  }

  function dueCount() { return dueList().length; }

  /* 今日到期 + 昨日欠账（due < 今天 0 点仍未复习）都算「该补」 */
  function overdueCount() {
    var startToday = new Date();
    startToday.setHours(0, 0, 0, 0);
    var n = 0;
    Object.keys(st.map).forEach(function (id) {
      var e = st.map[id];
      if (e && e.due && e.due <= startToday.getTime()) n++;
    });
    return n;
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function bannerHTML() {
    var n = dueCount();
    var od = overdueCount();
    var tip = n === 0
      ? "今天没有到期复习。可以去刷新题，答对的题会自动进入复习队列。"
      : (od > 0
        ? "有 " + od + " 题已经拖到该复习了——拖越久忘得越快，现在清一批。"
        : "今天有 " + n + " 题到期。花 5 分钟过一遍，记忆会牢固一截。");
    var h = '<section class="card review-banner' + (n > 0 ? " due" : "") + '">';
    h += '<div class="rb-left"><b>今日待复习</b>';
    h += '<span class="rb-num">' + n + "</span>";
    h += '<span class="rb-unit">题</span></div>';
    h += '<div class="rb-mid"><p>' + esc(tip) + "</p>";
    h += '<div class="pbar thin"><i style="width:' + Math.min(100, n * 8) + '%"></i></div></div>';
    h += '<div class="rb-act">';
    if (n > 0) h += '<a class="btn primary small" href="#/review">开始复习 ›</a>';
    h += '<a class="btn ghost small" href="#/review">查看队列</a>';
    h += "</div></section>";
    return h;
  }

  window.Review = {
    onAnswer: onAnswer,
    dueList: dueList,
    dueCount: dueCount,
    overdueCount: overdueCount,
    isDue: isDue,
    bannerHTML: bannerHTML,
    store: st
  };
})();


/* ==== lab.js ==== */

/* ============================================================
   虚拟实验室（Virtual Lab）
   ------------------------------------------------------------
   在浏览器里直接运行 C 代码，并逐行观察执行过程：
   代码编辑器 + 运行/单步/自动播放 + 输出 / 变量 / 调用栈 / 执行轨迹
   + 示例库 + 能力边界说明 + 无硬件故障演练。

   依赖：sim-core.js（词法/语法）、sim-vm.js（解释执行）
   对外：window.Lab.html() / window.Lab.init(root)
   ============================================================ */
(function () {
  "use strict";

  var CODE_KEY = "emb-lab-code";
  var INPUT_KEY = "emb-lab-input";
  var TAB_KEY = "emb-lab-tab";

  /* ---------------- 示例库（都是可真正运行的完整程序） ---------------- */
  var SAMPLES = [
    { id: "hello", name: "1. 第一个程序：输出与转义", note: "看 printf 如何输出、\\n 换行的作用",
      code: '#include <stdio.h>\n\nint main(void)\n{\n    printf("Hello, 嵌入式!\\n");\n    printf("温度 = %d.%d C\\n", 26, 5);\n    return 0;\n}' },
    { id: "trace", name: "2. 循环与累加（最适合单步观看）", note: "点「单步」看 i 和 sum 每一轮怎么变",
      code: '#include <stdio.h>\n\nint main(void)\n{\n    int sum = 0;\n\n    for (int i = 1; i <= 5; i++) {\n        sum += i;          /* 每轮把 i 累加进 sum */\n        printf("第 %d 轮: sum = %d\\n", i, sum);\n    }\n\n    printf("最终 sum = %d\\n", sum);\n    return 0;\n}' },
    { id: "ptr", name: "3. 指针与数组遍历", note: "p+1 究竟移动几个字节？变量面板里有答案",
      code: '#include <stdio.h>\n\nint main(void)\n{\n    int a[4] = {10, 20, 30, 40};\n    int *p = a;                  /* 数组名退化为指针 */\n\n    printf("sizeof(int)  = %d\\n", sizeof(int));\n    printf("*p          = %d\\n", *p);\n    printf("*(p + 1)    = %d\\n", *(p + 1));\n\n    p++;                         /* 指针 +1，移动 4 字节 */\n    printf("p++ 之后 *p = %d\\n", *p);\n\n    for (int i = 0; i < 4; i++)\n        printf("a[%d] = %d\\n", i, a[i]);\n    return 0;\n}' },
    { id: "swap", name: "4. 用指针修改调用者的变量", note: "理解「值传递」和「传地址」的区别",
      code: '#include <stdio.h>\n\nvoid swap(int *a, int *b)\n{\n    int t = *a;\n    *a = *b;\n    *b = t;\n}\n\nint main(void)\n{\n    int x = 3, y = 7;\n    printf("交换前: x=%d y=%d\\n", x, y);\n    swap(&x, &y);\n    printf("交换后: x=%d y=%d\\n", x, y);\n    return 0;\n}' },
    { id: "str", name: "5. 字符串反转（双指针经典题）", note: "面试高频：不用额外数组，原地反转",
      code: '#include <stdio.h>\n#include <string.h>\n\nint main(void)\n{\n    char s[] = "embedded";        /* 注意是数组，不是字符串常量 */\n    int n = strlen(s);\n\n    for (int i = 0, j = n - 1; i < j; i++, j--) {\n        char t = s[i];\n        s[i] = s[j];\n        s[j] = t;\n    }\n\n    printf("反转后: %s (长度 %d)\\n", s, n);\n    return 0;\n}' },
    { id: "rec", name: "6. 递归与调用栈", note: "点「单步」配合「调用栈」面板看递归如何入栈出栈",
      code: '#include <stdio.h>\n\nint fact(int n)\n{\n    if (n <= 1) return 1;\n    return n * fact(n - 1);\n}\n\nint main(void)\n{\n    for (int i = 1; i <= 5; i++)\n        printf("%d! = %d\\n", i, fact(i));\n    return 0;\n}' },
    { id: "struct", name: "7. 结构体与 typedef", note: "成员的访问（. 与 ->）以及内存占用",
      code: '#include <stdio.h>\n#include <string.h>\n\ntypedef struct {\n    char name[16];\n    int  score;\n} Student;\n\nint main(void)\n{\n    Student s;\n    strcpy(s.name, "Kongbai");\n    s.score = 92;\n\n    Student *p = &s;              /* 指向结构体的指针 */\n    p->score += 5;                /* 用 -> 修改成员 */\n\n    printf("%s: %d 分\\n", s.name, s.score);\n    printf("sizeof(Student) = %d 字节\\n", sizeof(Student));\n    return 0;\n}' },
    { id: "bit", name: "8. 位操作：寄存器置位与清位", note: "嵌入式每天都要用的 |= 与 &= ~",
      code: '#include <stdio.h>\n\nint main(void)\n{\n    unsigned char reg = 0;         /* 模拟一个 8 位寄存器 */\n\n    reg |= (1 << 2);               /* 置位 bit2 */\n    reg |= (1 << 5);               /* 置位 bit5 */\n    printf("置位后   0x%02X  (二进制 00100100)\\n", reg);\n\n    reg &= ~(1 << 2);              /* 清位 bit2 */\n    printf("清位后   0x%02X\\n", reg);\n\n    if (reg & (1 << 5))\n        printf("bit5 现在是 1\\n");\n\n    printf("第 5 位的值 = %d\\n", (reg >> 5) & 1);\n    return 0;\n}' },
    { id: "trap", name: "9. 位运算优先级陷阱", note: "x & 1 == 0 到底是什么意思？看看结果",
      code: '#include <stdio.h>\n\nint main(void)\n{\n    int x = 4;\n\n    printf("x & 1 == 0   -> %d   (== 优先于 &，等价于 x & (1==0))\\n", x & 1 == 0);\n    printf("(x & 1) == 0 -> %d   (这才是「判断奇偶」的正确写法)\\n", (x & 1) == 0);\n\n    int flag = 1, mask = 2;\n    printf("flag | mask == mask -> %d\\n", flag | mask == mask);\n    return 0;\n}' },
    { id: "width", name: "10. 类型宽度：溢出与整数除法", note: "char 装不下 200；C 的除法向零截断",
      code: '#include <stdio.h>\n#include <stdint.h>\n\nint main(void)\n{\n    unsigned char u = 200;         /* 0~255，装得下 */\n    char c = 100;\n    c = c + 100;                   /* 100+100=200 超出 signed char 范围 → 溢出 */\n    printf("unsigned char 200 = %d\\n", u);\n    printf("char 100+100     = %d  (溢出成负数)\\n", c);\n\n    int a = -7, b = 2;\n    printf("-7 / 2 = %d,  -7 %% 2 = %d\\n", a / b, a % b);\n    printf("(float)-7 / 2 = %.1f\\n", (float)a / 2);\n    return 0;\n}' },
    { id: "matrix", name: "11. 二维数组与嵌套循环", note: "行优先存储：a[i][j] 的地址怎么算",
      code: '#include <stdio.h>\n\nint main(void)\n{\n    int m[3][4];\n    int v = 1;\n\n    for (int i = 0; i < 3; i++)\n        for (int j = 0; j < 4; j++)\n            m[i][j] = v++;\n\n    int sum = 0;\n    for (int i = 0; i < 3; i++) {\n        for (int j = 0; j < 4; j++) {\n            printf("%3d", m[i][j]);\n            sum += m[i][j];\n        }\n        printf("\\n");\n    }\n\n    printf("元素个数 = %d, 总和 = %d\\n", sizeof(m) / sizeof(m[0][0]), sum);\n    return 0;\n}' },
    { id: "switch", name: "12. switch 与贯穿（没写 break 的后果）", note: "少了 break 会继续往下执行",
      code: '#include <stdio.h>\n\nint main(void)\n{\n    for (int cmd = 1; cmd <= 4; cmd++) {\n        int handled = 0;\n        printf("收到命令 %d -> ", cmd);\n\n        switch (cmd) {\n        case 1:\n            printf("开灯 ");\n            handled = 1;\n            break;                 /* 有 break：不会掉到 case 2 */\n        case 2:\n            printf("关灯 ");\n            break;\n        case 3:\n            printf("查询状态 ");\n            /* 故意漏写 break：看贯穿效果 */\n        case 4:\n            printf("(贯穿到 case 4) ");\n            break;\n        default:\n            printf("未知命令 ");\n            break;\n        }\n\n        printf("| handled=%d\\n", handled);\n    }\n    return 0;\n}' },
    { id: "funcptr", name: "13. 函数指针命令表（嵌入式常用）", note: "用表驱动代替一长串 if-else",
      code: '#include <stdio.h>\n#include <string.h>\n\nvoid cmd_led(const char *arg)   { printf("LED 设置为 %s\\n", arg); }\nvoid cmd_reset(const char *arg) { printf("设备重启 (参数 %s)\\n", arg); }\nvoid cmd_info(const char *arg)  { printf("版本 v1.0 硬件 v1.2\\n"); }\n\ntypedef struct {\n    const char *name;\n    void (*fn)(const char *);\n} cmd_entry;\n\nint main(void)\n{\n    cmd_entry table[] = {\n        { "led",   cmd_led   },\n        { "reset", cmd_reset },\n        { "info",  cmd_info  },\n    };\n    int n = sizeof(table) / sizeof(table[0]);\n\n    const char *input = "led on";\n    char name[16];\n    strcpy(name, input);\n    name[3] = \'\\0\';               /* 简单切出命令名 led */\n\n    for (int i = 0; i < n; i++) {\n        if (strcmp(table[i].name, name) == 0) {\n            table[i].fn("on");     /* 通过函数指针调用 */\n            return 0;\n        }\n    }\n\n    printf("未知命令: %s\\n", name);\n    return 0;\n}' },
    { id: "union", name: "14. union：看字节序与类型双关", note: "同一块内存用不同角度去读",
      code: '#include <stdio.h>\n\nunion U {\n    unsigned int  i;\n    unsigned char c[4];\n};\n\nint main(void)\n{\n    union U u;\n    u.i = 0x11223344;\n\n    printf("按整数读: 0x%X\\n", u.i);\n    printf("按字节读: %02X %02X %02X %02X\\n", u.c[0], u.c[1], u.c[2], u.c[3]);\n    printf("低位字节 %02X 存在低地址 -> %s\\n", u.c[0], (u.c[0] == 0x44) ? "小端" : "大端");\n    return 0;\n}' },
    { id: "sort", name: "15. 冒泡排序（完整执行过程）", note: "最适合「自动播放」看排序怎么一步步完成",
      code: '#include <stdio.h>\n\nint main(void)\n{\n    int a[6] = {5, 2, 9, 1, 7, 3};\n    int n = 6;\n\n    for (int i = 0; i < n - 1; i++) {\n        for (int j = 0; j < n - 1 - i; j++) {\n            if (a[j] > a[j + 1]) {\n                int t = a[j];\n                a[j] = a[j + 1];\n                a[j + 1] = t;\n            }\n        }\n        printf("第 %d 轮后: ", i + 1);\n        for (int k = 0; k < n; k++) printf("%d ", a[k]);\n        printf("\\n");\n    }\n\n    return 0;\n}' },
    { id: "score", name: "16. 成绩统计（结构体数组 + 平均分）", note: "训练营里的典型题型：遍历 + 累加 + 求平均",
      code: '#include <stdio.h>\n\ntypedef struct {\n    char id[8];\n    int  score;\n} Stu;\n\nint main(void)\n{\n    Stu list[5];\n    const char *ids[5] = { "S1", "S2", "S3", "S4", "S5" };\n    int scores[5] = { 88, 92, 76, 100, 65 };\n    int n = 5;\n\n    for (int i = 0; i < n; i++) {\n        int k = 0;\n        while (ids[i][k] != \'\\0\') { list[i].id[k] = ids[i][k]; k++; }\n        list[i].id[k] = \'\\0\';\n        list[i].score = scores[i];\n    }\n\n    int sum = 0, max = 0, min = 1000;\n    for (int i = 0; i < n; i++) {\n        sum += list[i].score;\n        if (list[i].score > max) max = list[i].score;\n        if (list[i].score < min) min = list[i].score;\n        printf("%s: %d\\n", list[i].id, list[i].score);\n    }\n\n    printf("平均 %d.%d 分, 最高 %d, 最低 %d\\n", sum / n, (sum * 10 / n) % 10, max, min);\n    return 0;\n}' }
  ];

  /* ---------------- 能力边界（诚实说明能做什么、不能做什么） ---------------- */
  var HELP_HTML =
    '<h4>能运行什么</h4>' +
    '<ul>' +
    '<li>完整的 C 程序（含 main），以及可以直接当 main 体执行的代码片段（会自动包装）</li>' +
    '<li>基本类型：<code>int / unsigned / char / short / long / float / double</code> 与 <code>uint8_t~uint64_t / size_t / bool</code></li>' +
    '<li>数组（含二维）、指针（取地址、解引用、指针运算、数组退化）、结构体 / 联合体 / 枚举、typedef</li>' +
    '<li>语句：<code>if / else / while / do-while / for / switch / break / continue / return</code>，函数与递归</li>' +
    '<li>运算符：全部算术、关系、逻辑（含短路）、位运算、赋值与复合赋值、自增自减、三目、<code>sizeof</code>、强制转换</li>' +
    '<li>结构体成员里的<b>函数指针</b>与表驱动调用（<code>table[i].fn(x)</code>）</li>' +
    '<li>常用标准库：<code>printf / puts / putchar / scanf / getchar / strlen / strcmp / strcpy / strcat / atoi / abs / sqrt / pow / memset / memcpy / toupper</code> 等</li>' +
    '</ul>' +
    '<h4>不能运行什么（以及为什么）</h4>' +
    '<ul>' +
    '<li><b>真实编译器级别的语法</b>：不支持位域、可变参数、K&amp;R 老式函数定义、宏函数（带参数的 #define）、条件编译（#if/#ifdef 会被忽略）</li>' +
    '<li><b>动态内存</b>：<code>malloc/free</code> 明确不支持（嵌入式里本来也常被禁止），请改用固定数组或静态缓冲</li>' +
    '<li><b>系统相关</b>：文件 <code>fopen/fread</code>、多线程 <code>pthread</code>、网络 <code>socket</code>、<code>ioctl</code>、<code>fork</code> 等全部不支持——浏览器沙箱里没有这些系统资源</li>' +
    '<li><b>硬件寄存器</b>：<code>GPIOA-&gt;ODR</code> 这类真实寄存器映射不存在；可以用 <code>unsigned char reg</code> + 位运算模拟，语义完全一致</li>' +
    '<li><b>不确定行为</b>：未初始化变量的值是 0（真实 C 里是垃圾值）、指针越界会立即报错（真实运行是崩溃或静默破坏内存）、整数按 32 位、<code>long</code> 与指针也是 32 位（真实 64 位平台上不同）</li>' +
    '<li><b>浮点细节</b>：用 JS 双精度模拟，不做 IEEE 754 单精度的逐位还原</li>' +
    '<li><b>非 C 内容</b>：shell 命令、链接脚本（MEMORY/SECTIONS）、汇编、CMake、Makefile 都不是 C 程序，跑不了</li>' +
    '</ul>' +
    '<h4>因此，什么该用真机、什么该用仿真</h4>' +
    '<ul>' +
    '<li><b>适合仿真</b>：语法与语义练习、指针与内存理解、算法与数据结构、位运算与掩码、协议报文组包解包、状态机逻辑、边界与异常分支</li>' +
    '<li><b>必须真机/真环境</b>：中断与实时性、时序与波形、DMA 与 Cache 一致性、功耗、外设驱动、RTOS 调度实测、Linux 系统调用与驱动</li>' +
    '</ul>' +
    '<h4>没有开发板时，这些实验可以这样替代</h4>' +
    '<ul>' +
    '<li><b>寄存器操作</b>：用 <code>unsigned</code> 变量 + 位置位/清位代码，配合变量面板观察每一位的变化（示例 8、9）</li>' +
    '<li><b>协议解析</b>：把帧当成 <code>unsigned char buf[]</code>，在仿真里实现「长度头 + 载荷」的组包与解析（见下方故障演练与「综合项目训练营」的题目）</li>' +
    '<li><b>状态机</b>：用一个 <code>switch</code> 与枚举实现状态迁移，用执行轨迹观察每次迁移（示例 12、13）</li>' +
    '<li><b>串口日志排查</b>：把真实日志粘贴到「故障演练」里按假设—验证顺序推</li>' +
    '<li><b>时序与波形</b>：先用逻辑分析仪类工具（如 PulseView + 仿真器 / Wokwi 等在线电路仿真）看波形，再上真板</li>' +
    '<li><b>RTOS 调度</b>：本地用 PC 版 FreeRTOS 移植（POSIX port）跑，能观察到真实的抢占与优先级反转</li>' +
    '</ul>';

  /* ---------------- 故障演练（无硬件也能练排查） ---------------- */
  var FAULTS = [
    {
      title: "故障 1：UART 收到的数据偶尔乱码",
      symptom: "设备通过串口上报，正常时数据正确，但每几十条会出现一次乱码；换成低速波特率后出现频率下降。",
      log: "[  120ms] UART2 RX: 01 03 00 0A\n[  121ms] UART2 RX: 01 03 00 0A\n[  123ms] UART2 RX: 01 03 00 0A\n[  340ms] UART2 RX: 01 03 00 0A\n[  341ms] UART2 RX: 81 83 00 0A   <-- 首字节第 7 位被置 1\n[  342ms] UART2 RX: 01 03 00 0A\n[  512ms] UART2 RX: 01 03 00 0A",
      think: ["乱码是「首字节最高位被置 1」，这说明什么？（提示：起始位电平采样偏移）",
              "为什么降波特率会减轻？",
              "你会先怀疑软件还是硬件？依据是什么？"],
      path: [
        "现象识别：数据帧结构没变（长度、字节数都对），只有个别字节的位翻转 → 属于物理层/时序问题，不是解析逻辑问题。",
        "假设 1：波特率误差过大。验证：用示波器/逻辑分析仪量实际位宽，与理论值比较（115200 下每 bit 约 8.68µs）。误差超过 ±2%~3% 就会在帧尾采样偏移。",
        "假设 2：时钟源不准。验证：查 MCU 的 UART 时钟来源（PLL 分频），算实际波特率寄存器值与理论值的偏差；换用内部/外部不同时钟对比。",
        "假设 3：地线或线材问题。验证：换短线、共地、加 120Ω 端接（长线 RS485 场景）。",
        "假设 4：中断处理太慢导致接收寄存器被覆盖（ORE 溢出）。验证：读 UART 的 ORE 错误标志计数，若与乱码次数吻合，则改用 DMA + 空闲中断。",
        "修复与验证：改用实测误差更小的波特率设置（或换时钟源）；开启 DMA 接收；连续跑 8 小时无乱码。"
      ]
    },
    {
      title: "故障 2：设备跑几小时后看门狗复位",
      symptom: "设备连续运行 2~5 小时后自动重启，复位源寄存器显示 IWDG；刚上电时不会出现。",
      log: "FAULT: 0x0501 (看门狗复位) count=3 vbus=12.1V temp=41\nUPTIME before reset: 2h18m\nMEM: heap_watermark=41% -> 68%\nRESET_CAUSE: IWDG=3 POR=1",
      think: ["从「时间相关 + 只有长时间运行才出现」能推出什么？",
              "内存水位从 41% 涨到 68% 意味着什么？",
              "怎么区分「某个任务卡死」和「系统内存耗尽」？"],
      path: [
        "现象识别：与运行时长相关 → 高度怀疑资源缓慢泄漏（内存 / 文件描述符 / 队列积压），而不是一次性逻辑错误。",
        "关键证据：内存水位从 41% 涨到 68% 是单调上升 → 存在泄漏或有生产者/消费者速率不匹配。",
        "假设 1：动态内存分配后未释放。验证：在分配/释放处加计数，观察差值随时间增长。",
        "假设 2：网络缓冲（如 LwIP 的 pbuf）未释放。验证：打开 LWIP_STATS 看 mem/err 计数，特别是 pbuf 的 used 数量。",
        "假设 3：队列只入不出（消费任务饿死）。验证：打印队列水位，看是否单调上升。",
        "假设 4：长时间运行后任务卡在阻塞等待中，导致喂狗点不再被执行。验证：软件看门狗记录「哪个任务多久没上报」，与复位前的记录对齐。",
        "修复：定位泄漏点并释放；队列加背压与丢弃策略；用时序数据验证 72 小时不再增长。"
      ]
    },
    {
      title: "故障 3：OTA 升级后设备无法启动",
      symptom: "批量推送升级后，约 2% 的设备重启后卡住，串口无输出；重新上电依然卡住，只能返修。",
      log: "BOOT v1.2\nPENDING=1 TRIAL=1 BOOT_CNT=3\nVERIFY slot B: CRC OK\nJUMP slot B ...\n(无后续输出，设备无响应)",
      think: ["日志停在 JUMP 之后说明什么？",
              "为什么是 2% 而不是全部？",
              "现在的 Bootloader 设计缺了什么？"],
      path: [
        "现象识别：Bootloader 能跑、校验通过、跳转后无输出 → 问题在新固件本身或跳转环境（向量表/时钟/栈）。",
        "假设 1：新固件的中断向量表没有重定位（SCB->VTOR 未设），一有中断就跳飞。验证：在 App 入口第一条打印，看是否能进 App。",
        "假设 2：App 的链接起始地址与实际烧录地址不一致 → 绝对地址重定位错误，表现为部分设备能跑（取决于代码路径是否触及相关符号）。2% 的比例符合这一特征（只有走到某个函数才崩）。",
        "假设 3：新固件依赖的硬件差异（不同批次的器件 ID 不同）导致初始化失败。验证：收集卡住设备的硬件版本。",
        "假设 4：跳转前没有清理中断挂起与关闭外设，残留中断在 App 环境里触发。验证：跳转前关中断、清挂起、复位外设。",
        "设计层面的修复（重点）：① A/B 分区；② 试用启动计数超过 N 次自动回滚；③ App 自检失败主动请求回滚；④ 升级后延迟确认。",
        "验证：随机断电 200 次、人为烧入自检失败的固件，确认每次都能回到可用版本。"
      ]
    }
  ];

  /* ---------------- 状态 ---------------- */
  var st = {
    code: "", input: "", result: null, frame: -1, playing: false, timer: null, tab: "out"
  };

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function html() {
    var h = '<a class="crumb" href="#/">‹ 全部课程</a>';
    h += '<section class="card lab-hero">';
    h += "<h1 style=\"margin:0 0 6px\">虚拟实验室</h1>";
    h += '<p>在这里<b>直接运行 C 代码，并逐行看它怎么执行</b>：变量怎么变、函数怎么进出栈、输出什么时候产生。纯本地运行（浏览器内的教学用 C 子集解释器），离线可用、手机也能用。</p>';
    h += '<p style="font-size:13px;color:var(--ink2)">只说 C：解释器实现的是教学用 <b>C 子集</b>，<b>C++ 与 Qt 代码跑不了</b>（<code>class</code>、<code>template</code>、<code>std::</code>、<code>Q_OBJECT</code> 都不认）。学 C++/Qt 时请把代码复制到本机用 <code>g++ -std=c++17</code> 或 <code>qmake / cmake</code> 编译——站内每段 C++/Qt 代码下方都标了对应命令。</p>';
    h += '<div class="lab-quick">';
    h += '<a class="chip" href="#/lab">运行代码</a>';
    h += '<span class="lab-quick-note">先选一个示例，点「运行」，再用「单步」或「自动播放」观察过程。写完自己的代码也可以直接跑。</span>';
    h += "</div></section>";

    /* 第一次用的人不知道该先点哪个按钮。把操作顺序写死在这里，并明确「改坏了能还原」。 */
    h += '<div class="study-flow"><b>第一次用？按这 3 步</b>' +
         '<span class="sf-step"><i>1</i>在「代码编辑器」上方的下拉框里选一个示例（选第一个就行），不用自己写。</span>' +
         '<span class="sf-step"><i>2</i>点「运行」看结果；再点「单步」，一次只走一行，右边就能看到变量怎么变化。</span>' +
         '<span class="sf-step"><i>3</i>看懂以后把代码改一改再跑。<b>改坏了也没关系</b>，重新选一次示例就还原了。</span>' +
         "</div>";

    h += '<div class="lab">';
    /* 左：编辑器 */
    h += '<div class="lab-left">';
    h += '<div class="lab-bar"><span class="lab-bar-title">代码编辑器</span>';
    h += '<select id="labSample" class="lab-select"><option value="">选择示例…</option>';
    SAMPLES.forEach(function (s) { h += '<option value="' + s.id + '">' + esc(s.name) + "</option>"; });
    h += "</select></div>";
    h += '<div class="lab-editor-wrap">';
    h += '<div class="lab-gutter" id="labGutter"></div>';
    h += '<div class="lab-highlight" id="labHighlight"></div>';
    h += '<textarea id="labCode" class="lab-code" spellcheck="false" wrap="off"></textarea>';
    h += "</div>";
    h += '<div class="lab-toolbar">';
    h += '<button class="btn small" id="labRun" type="button">▶ 运行</button>';
    h += '<button class="btn ghost small" id="labStep" type="button">单步 ›</button>';
    h += '<button class="btn ghost small" id="labPlay" type="button">自动播放</button>';
    h += '<button class="btn ghost small" id="labReset" type="button">↺ 重置</button>';
    h += '<label class="lab-speed">速度<input type="range" id="labSpeed" min="1" max="10" value="7" /></label>';
    h += '<button class="link-btn" id="labClear" type="button">清空输出</button>';
    h += "</div>";
    h += '<details class="lab-inputbox"><summary>程序输入（给 scanf / getchar 用）</summary>';
    h += '<textarea id="labInput" class="lab-input" placeholder="例如：12 34"></textarea></details>';
    h += "</div>";

    /* 右：面板 */
    h += '<div class="lab-right">';
    h += '<div class="lab-tabs">';
    h += '<button class="lab-tab on" data-tab="out" type="button">输出</button>';
    h += '<button class="lab-tab" data-tab="vars" type="button">变量</button>';
    h += '<button class="lab-tab" data-tab="stack" type="button">调用栈</button>';
    h += '<button class="lab-tab" data-tab="trace" type="button">执行轨迹</button>';
    h += '<button class="lab-tab" data-tab="help" type="button">能力边界</button>';
    h += '<button class="lab-tab" data-tab="fault" type="button">故障演练</button>';
    h += "</div>";
    h += '<div class="lab-panel" id="labPanel"></div>';
    h += "</div>";
    h += "</div>";

    h += '<div class="lab-status" id="labStatus">就绪：选个示例或直接写代码，点「运行」。</div>';
    h += '<section class="card hw-sim-card"><h2>硬件交互仿真</h2>';
    h += '<div id="hwSimHost" class="hw-sim-host"></div>';
    h += "</section>";
    return h;
  }

  /* ---------------- 渲染辅助 ---------------- */
  function lineHeightOf(ta) {
    var lh = parseFloat(getComputedStyle(ta).lineHeight);
    if (!lh || isNaN(lh)) lh = 22;
    return lh;
  }

  function updateGutter(root) {
    var ta = root.querySelector("#labCode");
    var g = root.querySelector("#labGutter");
    if (!ta || !g) return;
    var n = ta.value.split("\n").length;
    var s = "";
    for (var i = 1; i <= n; i++) s += '<div class="gl' + (st.frame >= 0 && curFrame() && curFrame().line === i ? " cur" : "") + '">' + i + "</div>";
    g.innerHTML = s;
    g.scrollTop = ta.scrollTop;
  }

  function highlightLine(root, line) {
    var ta = root.querySelector("#labCode");
    var hl = root.querySelector("#labHighlight");
    if (!ta || !hl) return;
    if (!line) { hl.style.display = "none"; return; }
    var lh = lineHeightOf(ta);
    hl.style.display = "block";
    hl.style.height = lh + "px";
    hl.style.top = ((line - 1) * lh - ta.scrollTop) + "px";
  }

  function curFrame() {
    if (!st.result || !st.result.trace || st.frame < 0) return null;
    return st.result.trace[st.frame] || null;
  }

  function outputUpTo() {
    var f = curFrame();
    if (!st.result) return "";
    if (!f) return st.result.out || "";
    if (st.result.outChunks) return st.result.outChunks.slice(0, f.outLen).join("");
    return st.result.out || "";
  }

  function renderPanel(root) {
    var panel = root.querySelector("#labPanel");
    if (!panel) return;
    var h = "";
    var r = st.result;
    var f = curFrame();

    if (st.tab === "out") {
      var out = outputUpTo();
      h += '<div class="lab-out">' + (out ? esc(out) : '<span class="dim">（还没有输出）</span>') + "</div>";
      if (r && !r.ok) h += '<div class="lab-err"><b>运行中断</b><p>' + esc(r.error) + "</p>" + hintFor(r) + "</div>";
      if (r && r.warnings && r.warnings.length) {
        h += '<div class="lab-warn"><b>提示</b><ul>';
        r.warnings.forEach(function (w) { h += "<li>" + esc(w) + "</li>"; });
        h += "</ul></div>";
      }
      if (r && r.ok && r.wrapped) h += '<div class="lab-note">这段代码没有 <code>main()</code>，已自动包进 <code>int main(void){ … }</code> 执行。</div>';
      if (r && r.ok && r.traceTruncated) h += '<div class="lab-note">执行步数较多，轨迹只记录了前 4000 步（变量面板显示的就是轨迹里的状态）。</div>';
    } else if (st.tab === "vars") {
      if (!r) { h = '<p class="dim">先点「运行」，这里会显示每一步的变量。</p>'; }
      else if (!f) { h = '<p class="dim">当前没有可显示的帧。</p>'; }
      else {
        h += '<div class="lab-framemeta">当前帧：' + f.n + " · " + esc(f.func) + " · 第 " + (f.line || "-") + " 行 · 嵌套深度 " + f.depth + "</div>";
        if (!f.vars.length) h += '<p class="dim">这一帧里还没有变量。</p>';
        else {
          h += '<table class="lab-table"><thead><tr><th>变量</th><th>值</th></tr></thead><tbody>';
          f.vars.forEach(function (v) {
            h += "<tr><td><code>" + esc(v[0]) + "</code></td><td>" + esc(v[1]) + "</td></tr>";
          });
          h += "</tbody></table>";
        }
      }
    } else if (st.tab === "stack") {
      if (!f) h = '<p class="dim">先点「运行」，再用「单步」观察函数进出栈。</p>';
      else {
        var stack = f.stack || [];
        h += '<div class="lab-framemeta">调用栈（共 ' + stack.length + " 层，最上面是正在执行的函数）</div>";
        if (!stack.length) h += '<p class="dim">当前不在任何函数内。</p>';
        else {
          h += '<div class="lab-stack">';
          for (var i = stack.length - 1; i >= 0; i--) {
            h += '<div class="lab-frame' + (i === stack.length - 1 ? " top" : "") + '"><span class="idx">#' + i + "</span>" + esc(stack[i]) + "()</div>";
          }
          h += "</div>";
        }
        h += '<p class="lab-note">递归时这一栏会一层层长高——这就是「调用栈」的真实样子，也是「栈溢出」为什么和递归深度有关。</p>';
      }
    } else if (st.tab === "trace") {
      if (!r || !r.trace.length) h = '<p class="dim">先点「运行」，这里会列出每一条执行记录，点击可跳转。</p>';
      else {
        h += '<div class="lab-framemeta">共 ' + r.trace.length + " 条记录，当前第 " + (st.frame + 1) + " 条（点任意一条跳过去）</div>";
        h += '<div class="lab-tracelist">';
        r.trace.forEach(function (fr, i) {
          var vars = fr.vars.map(function (v) { return v[0] + "=" + v[1]; }).join(", ");
          h += '<div class="lab-traceitem' + (i === st.frame ? " cur" : "") + '" data-frame="' + i + '">' +
               '<span class="ln">' + (fr.line || "—") + "</span>" +
               '<span class="tx">' + (fr.end ? "程序执行结束" : esc(fr.text || "(空行)")) + "</span>" +
               '<span class="vf">' + esc(vars.slice(0, 60)) + "</span></div>";
        });
        h += "</div>";
      }
    } else if (st.tab === "help") {
      h += '<div class="lab-help">' + HELP_HTML + "</div>";
    } else if (st.tab === "fault") {
      h += '<div class="lab-help"><h4>没有硬件时的排查训练</h4>' +
           "<p>下面三个场景都来自真实项目。请按「现象 → 日志 → 先写下你的假设 → 再展开参考排查路径」的顺序练，千万不要一上来就看答案。</p>" +
           '<p class="dim">练习方式：在纸上或记事本里写下你打算先看什么、为什么。真正的排障能力，体现在「假设的质量」和「验证的顺序」上。</p>';
      FAULTS.forEach(function (ft, i) {
        h += '<details class="fault-case"><summary>' + esc(ft.title) + "</summary>";
        h += '<div class="fault-body">';
        h += "<p><b>现象</b>：" + esc(ft.symptom) + "</p>";
        h += '<pre class="code fault-log">' + esc(ft.log) + "</pre>";
        h += "<p><b>先想清楚这几个问题</b></p><ul>";
        ft.think.forEach(function (q) { h += "<li>" + esc(q) + "</li>"; });
        h += "</ul>";
        h += '<details class="fault-answer"><summary>展开参考排查路径（先自己写完再看）</summary><ol>';
        ft.path.forEach(function (p) { h += "<li>" + esc(p) + "</li>"; });
        h += "</ol></details>";
        h += "</div></details>";
      });
      h += "</div>";
    }
    panel.innerHTML = h;
    panel.scrollTop = 0;
  }

  function hintFor(r) {
    var e = r.error || "";
    if (r.phase === "blank") return '<p class="lab-note">把 <code>{{n}}</code> 换成你的答案，就能运行了。</p>';
    if (e.indexOf("中文字符") >= 0) return '<p class="lab-note">中文只能出现在注释或字符串里；语句中的中文会成为无法识别的字符。</p>';
    if (e.indexOf("这里是") >= 0 || e.indexOf("期望一个类型名") >= 0) return '<p class="lab-note">这类错误常常出现在：把 shell 命令 / 链接脚本 / 汇编当成了 C 代码，或者用了仿真不认识的自定义类型（比如项目里的 <code>ringbuf_t</code>）。可以把类型定义一起贴进来。</p>';
    if (e.indexOf("未定义") >= 0 || e.indexOf("未声明") >= 0) return '<p class="lab-note">仿真只认识「标准库 + 这段代码里自己定义的函数」。如果依赖项目其他文件里的函数，请把它们一起贴进来或先写个简化版。</p>';
    if (e.indexOf("死循环") >= 0 || e.indexOf("执行时间") >= 0) return '<p class="lab-note">仿真对死循环有保护（步数 / 时间上限）。如果是刻意的 <code>while(1)</code> 主循环，可以在循环体里加 <code>break</code> 或用有限的循环次数来观察。</p>';
    if (e.indexOf("malloc") >= 0) return '<p class="lab-note">嵌入式里更推荐固定数组或静态缓冲；这也能避免内存碎片与不确定性。</p>';
    if (e.indexOf("未分配") >= 0) return '<p class="lab-note">真实运行中这类访问会崩溃或静默破坏内存；仿真直接报错，便于你建立「野指针必须有明确来源」的意识。</p>';
    return "";
  }

  function renderStatus(extra) {
    var el = document.getElementById("labStatus");
    if (!el) return;
    var r = st.result;
    if (extra) { el.innerHTML = extra; return; }
    if (!r) { el.textContent = "就绪：选个示例或直接写代码，点「运行」。"; return; }
    var parts = [];
    parts.push(r.ok ? "运行完成" : "运行中断");
    parts.push("步数 " + r.steps);
    parts.push("轨迹 " + (r.trace ? r.trace.length : 0) + " 条");
    if (r.durationMs != null) parts.push("耗时 " + r.durationMs + "ms");
    if (st.frame >= 0) parts.push("当前第 " + (st.frame + 1) + " 条");
    el.textContent = parts.join(" · ");
  }

  function showFrame(root) {
    var f = curFrame();
    highlightLine(root, f ? f.line : 0);
    updateGutter(root);
    renderPanel(root);
    renderStatus();
    /* 轨迹面板滚动到当前项 */
    var curItem = root.querySelector(".lab-traceitem.cur");
    if (curItem && st.tab === "trace") {
      var box = root.querySelector("#labPanel");
      if (box && curItem.offsetTop != null) box.scrollTop = Math.max(0, curItem.offsetTop - box.clientHeight / 2);
    }
  }

  function setCode(root, code) {
    var ta = root.querySelector("#labCode");
    ta.value = code;
    st.code = code;
    lsSet(CODE_KEY, code);
    updateGutter(root);
  }

  function doRun(root) {
    stopPlay();
    var ta = root.querySelector("#labCode");
    var inp = root.querySelector("#labInput");
    st.code = ta.value;
    st.input = inp ? inp.value : "";
    lsSet(CODE_KEY, st.code);
    lsSet(INPUT_KEY, st.input);
    st.result = window.CSim.run(st.code, { input: st.input });
    st.frame = st.result.trace && st.result.trace.length ? 0 : -1;
    if (st.result.trace && st.result.trace.length && !st.result.ok) st.frame = st.result.trace.length - 1;
    showFrame(root);
  }

  function stepOnce(root) {
    if (!st.result || !st.result.trace || !st.result.trace.length) { doRun(root); return; }
    if (st.frame < st.result.trace.length - 1) { st.frame++; showFrame(root); }
    else { renderStatus("已经到最后一步了。点「运行」可以重新开始。"); }
  }

  function startPlay(root) {
    if (!st.result || !st.result.trace || !st.result.trace.length) { doRun(root); if (!st.result) return; }
    if (st.frame >= st.result.trace.length - 1) st.frame = 0;
    st.playing = true;
    var btn = root.querySelector("#labPlay");
    if (btn) btn.textContent = "暂停 ⏸";
    var speedEl = root.querySelector("#labSpeed");
    function delay() {
      var v = speedEl ? parseInt(speedEl.value, 10) : 7;
      return Math.max(30, 520 - v * 48);
    }
    st.timer = setInterval(function () {
      if (!st.playing) return;
      if (st.frame >= st.result.trace.length - 1) { stopPlay(); return; }
      st.frame++;
      showFrame(root);
    }, delay());
  }

  function stopPlay() {
    st.playing = false;
    if (st.timer) { clearInterval(st.timer); st.timer = null; }
    var btn = document.getElementById("labPlay");
    if (btn) btn.textContent = "自动播放";
  }

  /* ---------------- 初始化 ---------------- */
  function init(root) {
    if (!root) root = document.getElementById("app");
    if (!root) return;
    var ta = root.querySelector("#labCode");
    if (!ta) return;

    var saved = lsGet(CODE_KEY);
    var initial = saved && saved.trim() ? saved : SAMPLES[1].code;

    /* 允许从章节页带代码进来：优先用暂存内容，其次用示例 */
    var pending = window.__LAB_PENDING_CODE;
    if (pending) { initial = pending; window.__LAB_PENDING_CODE = null; }
    setCode(root, initial);

    var inp = root.querySelector("#labInput");
    if (inp) inp.value = lsGet(INPUT_KEY) || "";

    ta.addEventListener("input", function () { st.code = ta.value; lsSet(CODE_KEY, ta.value); updateGutter(root); });
    ta.addEventListener("scroll", function () {
      var hf = curFrame();
      highlightLine(root, hf ? hf.line : 0);
      var g = root.querySelector("#labGutter");
      if (g) g.scrollTop = ta.scrollTop;
    });
    ta.addEventListener("keydown", function (e) {
      if (e.key === "Tab") {                 /* Tab 插入 4 个空格，而不是跳焦点 */
        e.preventDefault();
        var s = ta.selectionStart, en = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + "    " + ta.value.slice(en);
        ta.selectionStart = ta.selectionEnd = s + 4;
        st.code = ta.value; lsSet(CODE_KEY, ta.value); updateGutter(root);
      }
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); doRun(root); }
    });

    var runBtn = root.querySelector("#labRun");
    if (runBtn) runBtn.addEventListener("click", function () { doRun(root); });
    var stepBtn = root.querySelector("#labStep");
    if (stepBtn) stepBtn.addEventListener("click", function () { stepOnce(root); });
    var playBtn = root.querySelector("#labPlay");
    if (playBtn) playBtn.addEventListener("click", function () {
      if (st.playing) stopPlay(); else startPlay(root);
    });
    var resetBtn = root.querySelector("#labReset");
    if (resetBtn) resetBtn.addEventListener("click", function () {
      stopPlay(); st.result = null; st.frame = -1;
      highlightLine(root, 0); updateGutter(root); renderPanel(root); renderStatus();
    });
    var clearBtn = root.querySelector("#labClear");
    if (clearBtn) clearBtn.addEventListener("click", function () { doRun(root); st.frame = st.result && st.result.trace.length ? st.result.trace.length - 1 : -1; showFrame(root); });

    var sel = root.querySelector("#labSample");
    if (sel) sel.addEventListener("change", function () {
      var s = SAMPLES.filter(function (x) { return x.id === sel.value; })[0];
      if (!s) return;
      stopPlay();
      setCode(root, s.code);
      st.result = null; st.frame = -1;
      renderStatus("已载入示例：" + s.name + " — " + s.note);
      highlightLine(root, 0);
      renderPanel(root);
      sel.value = "";
    });

    var speedEl = root.querySelector("#labSpeed");
    if (speedEl) speedEl.addEventListener("change", function () { if (st.playing) { stopPlay(); startPlay(root); } });

    /* 面板标签切换 */
    root.querySelectorAll(".lab-tab").forEach(function (b) {
      b.addEventListener("click", function () {
        root.querySelectorAll(".lab-tab").forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        st.tab = b.getAttribute("data-tab");
        lsSet(TAB_KEY, st.tab);
        renderPanel(root);
      });
    });
    var savedTab = lsGet(TAB_KEY);
    if (savedTab) {
      var tb = root.querySelector('.lab-tab[data-tab="' + savedTab + '"]');
      if (tb) {
        root.querySelectorAll(".lab-tab").forEach(function (x) { x.classList.remove("on"); });
        tb.classList.add("on");
        st.tab = savedTab;
      }
    }

    /* 轨迹项点击跳转 */
    root.querySelector("#labPanel").addEventListener("click", function (e) {
      var item = e.target.closest ? e.target.closest(".lab-traceitem") : null;
      if (item) {
        st.frame = parseInt(item.getAttribute("data-frame"), 10) || 0;
        showFrame(root);
      }
    });

    renderPanel(root);
    renderStatus();
    highlightLine(root, 0);

    /* 硬件交互仿真（LED/分压/UART） */
    if (window.HwSim && window.HwSim.mount) {
      window.HwSim.mount(root.querySelector("#hwSimHost"));
    }
  }

  window.Lab = { html: html, init: init, samples: SAMPLES };
})();


/* ==== app.js ==== */

/* ============================================================
   嵌入式学习站 - 应用逻辑
   路由 / 视图 / 题目引擎 / localStorage 进度与错题本
   ============================================================ */
(function () {
  "use strict";

  var COURSES = window.COURSES || [];

  /* ---------- 主题（浅色暖纸 / 深色暖夜） ---------- */
  var THEME_KEY = "emb-theme";
  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }
  function applyTheme(t) {
    if (t === "dark") document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
    var btn = document.getElementById("themeBtn");
    if (btn) {
      btn.textContent = t === "dark" ? "浅" : "深";
      btn.title = t === "dark" ? "切换到浅色（暖纸）" : "切换到深色（暖夜）";
    }
  }
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (saved === "dark" || saved === "light") { applyTheme(saved); return; }
    var dark = false;
    if (window.matchMedia) {
      try { dark = window.matchMedia("(prefers-color-scheme: dark)").matches; } catch (e) {}
    }
    applyTheme(dark ? "dark" : "light");
  }

  /* ---------- 学科体系与能力等级（唯一数据源：taxonomy.js） ----------
     学科是最高一层分类（学科 → 课程 → 章 → 知识点），
     能力等级 L0~L5 是贯穿全站的进阶标尺。
     这里只做查询，不重复定义数据——数据改动一律去 taxonomy.js。 */
  var TAX = (typeof window !== "undefined" && window.TAXONOMY) || { levels: [], subjects: [], courseLevel: {} };
  var LEVELS = TAX.levels || [];
  var SUBJECTS = TAX.subjects || [];
  var COURSE_LEVEL = TAX.courseLevel || {};

  function subjectById(id) {
    for (var i = 0; i < SUBJECTS.length; i++) if (SUBJECTS[i].id === id) return SUBJECTS[i];
    return null;
  }
  function subjectOfCourse(cid) {
    for (var i = 0; i < SUBJECTS.length; i++) {
      if (SUBJECTS[i].ids && SUBJECTS[i].ids.indexOf(cid) >= 0) return SUBJECTS[i];
    }
    return null;
  }
  function levelById(id) {
    for (var i = 0; i < LEVELS.length; i++) if (LEVELS[i].id === id) return LEVELS[i];
    return null;
  }
  function levelOfCourse(cid) { return levelById(COURSE_LEVEL[cid]); }
  /* 等级小徽标：课程卡片与课程页共用 */
  function levelChip(cid) {
    var l = levelOfCourse(cid);
    if (!l) return "";
    return '<span class="lv-chip lv-' + l.id.toLowerCase() + '" title="学完到达 ' + l.id + " · " + esc(l.name) +
           '：' + esc(l.evid) + '">' + l.id + " " + esc(l.name) + "</span>";
  }
  /* 一个学科/一组课程的汇总统计，首页与学科页共用 */
  function bundleStat(list) {
    var chapters = 0, points = 0, questions = 0, solved = 0;
    list.forEach(function (c) {
      chapters += c.chapters.length;
      var p = courseProgress(c);
      questions += p.total; solved += p.solved;
      c.chapters.forEach(function (ch) { points += ch.points.length; });
    });
    return { courses: list.length, chapters: chapters, points: points,
             questions: questions, solved: solved, pct: pct(solved, questions) };
  }

  /* ---------- 岗位路线（按目标岗位给出推荐课程顺序） ---------- */
  var ROLE_ROUTES = [
    { id: "mcu", name: "MCU 裸机开发", tag: "工业控制 / 小家电 / 消费电子",
      desc: "以单片机裸机与寄存器编程为核心，硬件动手能力要求高，是嵌入式最传统的入门岗位。",
      outcome: "能独立完成一块 MCU 板：从选型、看原理图、写裸机驱动，到固件可靠性与量产交付。",
      courses: ["learn", "lad", "zero", "c", "drill", "emb", "hw", "pcb", "mcu", "proto", "dbg", "arm", "rel", "qa", "life", "iv", "ivx"] },
    { id: "rtos", name: "RTOS / 实时系统", tag: "汽车电子 / 医疗 / 电机控制",
      desc: "在裸机基础上叠加实时操作系统，重点是多任务划分、同步互斥与实时性分析。",
      outcome: "能把一个多任务系统从任务划分、优先级设计做到栈实测、优先级反转规避与稳定性验证。",
      courses: ["lad", "c", "ds", "emb", "mcu", "rtos", "proto", "rel", "qa", "build", "life", "iv", "ivx"] },
    { id: "linux", name: "Linux 应用开发", tag: "物联网网关 / 智能终端",
      desc: "在 Linux 上写应用：文件 IO、并发、网络、图形界面与工程化构建，是培训课程（如 GZ2619）的主线。",
      outcome: "能独立开发一个带网络通信与本地存储的 Linux 应用，并能定位性能与稳定性问题。",
      courses: ["learn", "lad", "zero", "c", "ds", "cos", "linsys", "lx", "net", "build", "dbg", "qa", "project", "iv", "ivx"] },
    { id: "drv", name: "驱动 / BSP 工程师", tag: "芯片原厂 / 板卡厂商",
      desc: "面向内核与硬件交界处：内核模块、字符设备、设备树、内核并发与启动链路。门槛高、岗位少但稀缺。",
      outcome: "能写一个字符设备驱动、改设备树让板子适配新硬件，并读懂从 BootROM 到 main 的完整启动链。",
      courses: ["lad", "c", "ds", "cos", "linsys", "arm", "lx", "drv", "build", "net", "dbg", "qa", "iv", "ivx"] },
    { id: "iot", name: "IoT / 联网终端", tag: "智能家居 / 工业物联网",
      desc: "以联网能力为主线：总线协议、TCP/IP、MQTT、BLE 配网、OTA 与低功耗设计。",
      outcome: "能做出一个可量产联网终端：BLE 配网 + MQTT 上云 + 断网缓存 + A/B OTA + 功耗达标。",
      courses: ["lad", "c", "ds", "hw", "mcu", "proto", "net", "ble", "rel", "lowp", "life", "build", "iv", "ivx"] },
    { id: "qt", name: "C++ / Qt 上位机开发", tag: "设备调试工具 / 工业数据面板 / 跨平台桌面软件",
      desc: "以 C++ 与 Qt 为主线：先把语言机制（内存管理、面向对象、标准库）打透，再打通信号槽、界面组件、事件处理与跨平台构建，最后落到一个真实上位机项目。这个方向与嵌入式设备端配合紧密，是「懂下位机又懂上位机」的差异化路径。",
      outcome: "能独立交付一个上位机：串口或网络收发 + 协议解析 + 实时数据面板 + 波形显示 + 深浅主题 + Windows/Linux 双平台发布，并能讲清每个技术选型的取舍。",
      courses: ["learn", "lad", "zero", "c", "cpp", "ds", "qt", "linsys", "lx", "net", "build", "dbg", "qa", "cvq", "iv", "ivx"] }
  ];
  function routeById(id) {
    for (var i = 0; i < ROLE_ROUTES.length; i++) if (ROLE_ROUTES[i].id === id) return ROLE_ROUTES[i];
    return null;
  }

  /* ---------- 数据索引 ---------- */
  var QMAP = {};   // qid -> question
  var CHMAP = {};  // chapterId -> chapter
  var ALLQ = [];
  var PMAP = {};   // pointId -> point   （知识点级关联系统的基石）
  var ALLP = [];
  /* 知识点 id 规则：章节 id + ":" + 该知识点在本章内的序号（从 1 开始）。
     例：zero1 章的第 3 个知识点 => "zero1:3"。
     为什么用序号而不是标题：标题太长、易改、含中文，做引用键很不稳；
     序号方案简短、可读、写数据时一眼就知道指向哪一条。
     注意：**章节内知识点顺序一旦发布就不要重排**，否则关联会指错——
     这条约束和「章节 id 不可改」是同一个道理。 */
  function pointId(chId, index1) { return chId + ":" + index1; }
  COURSES.forEach(function (course) {
    course.chapters.forEach(function (ch) {
      ch.courseId = course.id;
      ch.qTotal = ch.quiz.length;
      ch.pTotal = ch.points.length;
      CHMAP[ch.id] = ch;
      ch.points.forEach(function (pt, pi) {
        pt.id = pointId(ch.id, pi + 1);
        pt.chapter = ch;
        pt.course = course;
        pt.idx = pi + 1;
        PMAP[pt.id] = pt;
        ALLP.push(pt);
      });
      ch.quiz.forEach(function (q, i) {
        q.id = ch.id + "-" + i;
        q.chapter = ch;
        QMAP[q.id] = q;
        ALLQ.push(q);
      });
    });
  });

  /* ---------- 知识点关联系统（解决「前后知识脱节」） ----------
     设计思路：知识点是站里最小的学习单元，但章节之间、课程之间的「隐性依赖」
     过去只写在正文里，学习者读到「这里用到了上一章的指针」时往往不知道该回哪看。
     这里把这层关系做成**显式的、可点击的、双向的**数据：
       pt.kp      —— 前置知识点（看这个之前应该先会的），值是知识点 id 数组
       pt.next    —— 下游知识点（这个会在哪里被用到，解决「学它干嘛」），值同上
       pt.vs      —— 易混淆点，值为 [{t: 概念名, d: 区别, to: 可选的知识点 id}]
       pt.why     —— 一句话说明「为什么要学它」（可选，用于知识地图上做动机提示）
     字段全部可选：没写关联的知识点照旧渲染，不会破版。 */
  function pointById(id) { return PMAP[id] || null; }

  /* 把一个知识点 id 渲染成一个可点的胶囊；找不到就返回空串（不渲染坏链接） */
  function kpChip(id) {
    var p = pointById(id);
    if (!p) return "";
    return '<a class="kp-chip" href="#/chapter/' + p.chapter.id + '" data-kp="' + p.id + '">' +
           '<span class="kp-t">' + esc(p.t) + "</span>" +
           '<span class="kp-from">' + esc(p.chapter.title) + "</span></a>";
  }

  /* 渲染一个知识点下方的「关联区」：前置 / 下游 / 易混淆 */
  /* ---------- 宝宝级讲解层（零基础精细化） ----------
     给知识点挂 baby 字段后，婴儿级讲解成为默认展示的主体，
     原 pt.h 折叠进「想更深入」——只加字段，不动原数据结构，
     所以老用户的做题记录与知识点 id 都不受影响。
     baby = { say, step[], code, demo{q,a}, drill{q,a}, ask{q,a} } */
  function babyBlock(pt) {
    var b = pt.baby;
    if (!b) return "";
    var h = '<div class="baby">';
    h += '<div class="baby-tag">零基础慢慢讲</div>';
    if (b.say) h += '<p class="baby-say">' + b.say + "</p>";
    if (b.step && b.step.length) {
      h += '<ol class="baby-step">';
      b.step.forEach(function (s) { h += "<li>" + s + "</li>"; });
      h += "</ol>";
    }
    if (b.code) h += codeBlock(b.code);
    if (b.demo) h += babyCard("demo", "例", "先看一遍「这道题是怎么做出来的」", b.demo);
    if (b.drill) h += babyCard("drill", "练", "现在换你自己来一遍", b.drill);
    if (b.ask) h += babyCard("ask", "问", "面试会这样问这个点", b.ask);
    h += "</div>";
    return h;
  }
  function babyCard(kind, badge, label, item) {
    return '<details class="baby-card baby-k-' + kind + '">' +
      '<summary><span class="baby-kind">' + badge + "</span>" + esc(label) + "</summary>" +
      '<div class="baby-card-body">' +
      '<p class="baby-q">' + item.q + "</p>" +
      '<div class="baby-a"><b>怎么想、怎么做</b>' + item.a + "</div>" +
      "</div></details>";
  }

  function kpLinksHTML(pt) {
    var pre = (pt.kp || []).map(kpChip).filter(Boolean);
    var nxt = (pt.next || []).map(kpChip).filter(Boolean);
    var vs = pt.vs || [];
    if (!pre.length && !nxt.length && !vs.length) return "";

    var h = '<div class="kp-links">';
    if (pre.length) {
      h += '<div class="kp-row kp-pre"><b>前置知识</b>' +
           '<span class="kp-hint">读不懂就先回这些</span>' +
           '<div class="kp-list">' + pre.join("") + "</div></div>";
    }
    if (nxt.length) {
      h += '<div class="kp-row kp-next"><b>往下会用到</b>' +
           '<span class="kp-hint">学它到底干嘛用的</span>' +
           '<div class="kp-list">' + nxt.join("") + "</div></div>";
    }
    if (vs.length) {
      h += '<div class="kp-row kp-vs"><b>别搞混</b>' +
           '<span class="kp-hint">这两件事考试和面试都爱考</span><div class="kp-vs-list">';
      vs.forEach(function (v) {
        h += '<div class="kp-vs-item"><span class="kp-vs-name">' + esc(v.t) + "</span>" +
             '<span class="kp-vs-d">' + esc(v.d) + "</span>" +
             (v.to && pointById(v.to) ? '<span class="kp-vs-go">' + kpChip(v.to) + "</span>" : "") +
             "</div>";
      });
      h += "</div></div>";
    }
    h += "</div>";
    return h;
  }

  /* 反向索引：谁把我当成了前置？——用于知识地图里画「被引用」关系。
     每次调用重算一遍代价可接受（800 多个知识点，纯内存遍历）。 */
  var NEXTMAP = null;
  function buildNextMap() {
    if (NEXTMAP) return NEXTMAP;
    NEXTMAP = {};
    ALLP.forEach(function (p) {
      (p.kp || []).forEach(function (pid) {
        if (!NEXTMAP[pid]) NEXTMAP[pid] = [];
        NEXTMAP[pid].push(p.id);
      });
    });
    return NEXTMAP;
  }
  /* 某个知识点的下游 = 它显式写的 next ∪ 反向索引里引用它作为前置的 */
  function downstreamOf(p) {
    var out = (p.next || []).slice();
    var rev = buildNextMap()[p.id] || [];
    rev.forEach(function (id) { if (out.indexOf(id) < 0) out.push(id); });
    return out;
  }

  /* ---------- 全文搜索索引（课程 / 章节 / 知识点 / 题目） ---------- */
  var SIDX = [];
  function stripTags(s) {
    return String(s || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
  }
  COURSES.forEach(function (c) {
    SIDX.push({ k: "course", title: c.title, body: [c.desc, c.brief, c.goal, (c.roles || []).join(" ")].join(" "), href: "#/course/" + c.id, from: c.title });
    c.chapters.forEach(function (ch) {
      SIDX.push({ k: "chapter", title: ch.title, body: stripTags(ch.brief), href: "#/chapter/" + ch.id, from: c.title });
      ch.points.forEach(function (pt, pi) {
        SIDX.push({ k: "point", title: pt.t, body: stripTags(pt.h) + " " + (pt.code || ""), href: "#/chapter/" + ch.id, from: ch.title + " · 知识点", anchor: pt.t });
      });
      ch.quiz.forEach(function (q, qi) {
        SIDX.push({
          k: "quiz", title: q.q, body: stripTags(q.exp) + " " + (q.code || "") + " " + (q.sol || "") + " " + (q.opts || []).join(" "),
          href: "#/chapter/" + ch.id, from: ch.title + " · 第 " + (qi + 1) + " 题"
        });
      });
    });
  });
  function fuzzyMatch(hay, term) {
    if (!hay || !term) return false;
    var h = String(hay).toLowerCase().replace(/\s+/g, "");
    var t = String(term).toLowerCase().replace(/\s+/g, "");
    if (!t) return false;
    if (h.indexOf(t) >= 0) return true;
    /* 允许中间插无关字符：如 volatile 匹配 vol atile */
    var j = 0;
    for (var i = 0; i < h.length && j < t.length; i++) if (h[i] === t[j]) j++;
    return j === t.length;
  }
  var PINYIN_MAP = {
    zhong: "中", yuan: "源", dong: "动", li: "力", dian: "电", lu: "路", xin: "信", hao: "号",
    nei: "内", cun: "存", wang: "网", luo: "络", xian: "线", cheng: "程", xu: "序", shi: "时",
    zhong2: "终", duan: "端", kai: "开", fa: "发", ce: "测", shi4: "试", mian: "面", shi5: "试",
    qiu: "求", zhi: "职", jian: "简", li2: "历", pei: "培", xun: "训", ying: "应", jie: "届"
  };
  function pinyinIndex(text) {
    /* 简易索引：抽取汉字对应拼音词 + 首字母；够用于 tech 词混搜 */
    var s = String(text || "");
    var out = [];
    Object.keys(PINYIN_MAP).forEach(function (py) {
      if (s.indexOf(PINYIN_MAP[py]) >= 0) out.push(py);
    });
    /* 英文首字母缩写 */
    var words = s.split(/[^A-Za-z]+/).filter(Boolean);
    if (words.length > 1) out.push(words.map(function (w) { return w[0]; }).join(""));
    return out.join(" ").toLowerCase();
  }
  function searchAll(kw) {
    kw = String(kw || "").trim().toLowerCase();
    if (!kw) return [];
    var terms = kw.split(/\s+/).filter(Boolean);
    var out = [];
    SIDX.forEach(function (it) {
      var hay = (it.title + " " + it.body).toLowerCase();
      var py = pinyinIndex(it.title + " " + it.body);
      var hits = 0;
      var ok = false;
      for (var i = 0; i < terms.length; i++) {
        if (hay.indexOf(terms[i]) >= 0 || fuzzyMatch(hay, terms[i]) || (py && py.indexOf(terms[i]) >= 0)) {
          hits++;
          ok = true;
        }
      }
      /* OR 命中即可，命中数参与打分 */
      if (!ok) return;
      var titleLow = it.title.toLowerCase();
      var score = 0;
      score += hits * 4;
      if (titleLow.indexOf(terms[0]) >= 0) score += 10;
      if (it.k === "chapter") score += 3;
      if (it.k === "course") score += 2;
      out.push({ it: it, score: score });
    });
    out.sort(function (a, b) { return b.score - a.score; });
    return out.slice(0, 120).map(function (x) { return x.it; });
  }
  function snippet(text, kw, len) {
    var t = String(text || ""), low = t.toLowerCase(), i = low.indexOf(String(kw).toLowerCase());
    if (i < 0) i = 0;
    var start = Math.max(0, i - 30);
    var s = t.slice(start, start + (len || 110));
    return (start > 0 ? "…" : "") + s + (start + (len || 110) < t.length ? "…" : "");
  }

  /* ---------- 存储 ---------- */
  /* 本地永远是第一位的：不登录、没网、双击打开 html，进度都存在这台设备上。
     登录之后才额外同步到云端（见 cloud-sync.js）。 */
  var KEY = "emb-study-v1";
  var store = loadStore();
  function loadStore() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY));
      if (!s || typeof s !== "object") throw 0;
      if (!s.ans || typeof s.ans !== "object") s.ans = {};
      if (!s.wrong || typeof s.wrong !== "object") s.wrong = {};
      /* 下面两个字段是给「多设备合并」用的，老数据没有就补空对象——
         只增字段、不改已有字段的结构，老用户进度不会废。 */
      if (!s.qts || typeof s.qts !== "object") s.qts = {};
      if (!s.days || typeof s.days !== "object") s.days = {};
      return s;
    } catch (e) {
      return { ans: {}, wrong: {}, qts: {}, days: {} };
    }
  }
  function saveStore() {
    try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {}
    /* 已登录时安排一次云端同步（内部有防抖，不会每题发一次请求） */
    try { if (window.CloudSync && window.CloudSync.schedulePush) window.CloudSync.schedulePush(); } catch (e) {}
  }
  /* 本地日期（不是 UTC）——按用户自己所在时区算「今天」才对得上 */
  function dayKey(d) {
    var t = d ? new Date(d) : new Date();
    var m = t.getMonth() + 1, day = t.getDate();
    return t.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (day < 10 ? "0" : "") + day;
  }
  function mockRaw() {
    try { return JSON.parse(localStorage.getItem("emb-mock-interview-v1") || "{}") || {}; } catch (e) { return {}; }
  }
  /* 交给云同步模块的两个钩子：读全量进度、把合并结果写回来 */
  function cloudReadPayload() {
    return {
      ver: 2,
      progress: { ans: store.ans, wrong: store.wrong, qts: store.qts, days: store.days },
      mock: mockRaw(),
      guide: true
    };
  }
  function cloudApplyPayload(payload) {
    if (!payload || !payload.progress) return;
    var p = payload.progress;
    store.ans = p.ans || {};
    store.wrong = p.wrong || {};
    store.qts = p.qts || {};
    store.days = p.days || {};
    try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {}
    if (payload.mock) {
      try { localStorage.setItem("emb-mock-interview-v1", JSON.stringify(payload.mock)); } catch (e) {}
    }
    refreshChrome();
  }

  /* ---------- 新手引导的关闭状态 ----------
     单独用一个存储键，**绝不动 KEY（emb-study-v1）的结构**——
     那是学习进度，结构一变老用户的数据就废了。 */
  var GUIDE_KEY = "emb-guide-v1";
  function guideDismissed() {
    try { return localStorage.getItem(GUIDE_KEY) === "1"; } catch (e) { return false; }
  }
  function dismissGuide() {
    try { localStorage.setItem(GUIDE_KEY, "1"); } catch (e) {}
  }
  /* 首页顶部的新手引导卡：只在没关过时出现。三句话讲清「这站是干什么的 + 我先做什么」。 */
  function firstVisitCard() {
    if (guideDismissed()) return "";
    return '<section class="card guide-card" id="guideCard">' +
      '<button type="button" class="guide-close" id="guideClose" aria-label="不再显示这个提示">×</button>' +
      "<h2>第一次来？先看这一句就够了</h2>" +
      '<p class="lead">这是一个<b>能自己练的电子课本</b>：打开网页就能读，读完就能做题，' +
      "做完<b>马上知道自己对不对</b>。不用装任何软件。</p>" +
      '<div class="guide-steps">' +
      '<span><b>①</b> 完全不懂编程也能学</span>' +
      '<span><b>②</b> 从最基础那门课开始</span>' +
      '<span><b>③</b> 做完题错了会自动收进「错题本」</span>' +
      "</div>" +
      '<p class="cta-row">' +
      '<a class="btn primary big" href="#/course/zero">从零开始学第一课 ›</a>' +
      '<a class="btn big" href="#/help">先看使用说明（2 分钟）</a>' +
      "</p></section>";
  }
  function record(q, correct) {
    var a = store.ans[q.id] || (store.ans[q.id] = { ok: 0, bad: 0 });
    if (correct) a.ok++; else a.bad++;
    if (correct) delete store.wrong[q.id];
    else store.wrong[q.id] = 1;
    /* 记下这道题「最后一次改动」的时间：多设备合并时，错题该不该留着靠它判定 */
    store.qts[q.id] = Date.now();
    /* 记下今天做了多少题：用来算连续学习天数和「今日学习量」 */
    var dk = dayKey();
    store.days[dk] = (store.days[dk] || 0) + 1;
    saveStore();
    try { if (window.Motivate && window.Motivate.onAnswer) window.Motivate.onAnswer(!!correct); } catch (e) {}
    try { if (window.Review && window.Review.onAnswer) window.Review.onAnswer(q.id, !!correct); } catch (e) {}
    refreshChrome();
  }
  function isSolved(q) {
    var a = store.ans[q.id];
    return !!(a && a.ok > 0);
  }

  /* ---------- 小工具 ---------- */
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function norm(s) { return String(s).replace(/\s+/g, ""); }
  function pct(a, b) { return b ? Math.round((a / b) * 100) : 0; }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function setApp(html) {
    $("#app").innerHTML = html + '<div id="a11yStatus" class="sr-only" aria-live="polite"></div>';
    window.scrollTo(0, 0);
  }
  function announce(msg) {
    var el = document.getElementById("a11yStatus");
    if (el) el.textContent = msg || "";
  }
  function setNav(name) {
    document.querySelectorAll("[data-nav]").forEach(function (a) {
      var on = a.getAttribute("data-nav") === name;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }
  function courseById(id) {
    for (var i = 0; i < COURSES.length; i++) if (COURSES[i].id === id) return COURSES[i];
    return null;
  }
  function courseProgress(c) {
    var total = 0, solved = 0;
    c.chapters.forEach(function (ch) {
      ch.quiz.forEach(function (q) { total++; if (isSolved(q)) solved++; });
    });
    return { total: total, solved: solved, pct: pct(solved, total) };
  }

  /* ---------- 代码高亮 ---------- */
  var KW = "int|long|short|char|float|double|unsigned|signed|void|if|else|for|while|do|switch|case|default|break|continue|return|struct|union|enum|typedef|static|const|volatile|extern|sizeof|goto|register|inline|restrict|bool|true|false|NULL|size_t|ssize_t|FILE|pid_t|pthread_t|pthread_mutex_t|uint8_t|uint16_t|uint32_t|uint64_t|int8_t|int16_t|int32_t|int64_t|u_char";
  var RE = new RegExp(
    "(\\/\\/[^\\n]*)" +
    "|(\\/\\*[\\s\\S]*?\\*\\/)" +
    "|(\"(?:[^\"\\\\\\n]|\\\\.)*\")" +
    "|('(?:[^'\\\\\\n]|\\\\.)*')" +
    "|(^[ \\t]*#[A-Za-z]+)" +
    "|\\b(" + KW + ")\\b" +
    "|\\b(0[xX][0-9a-fA-F]+|\\d+(?:\\.\\d+)?[fFuUlL]*)\\b",
    "gm"
  );
  function hl(code) {
    return esc(code).replace(RE, function (m, lc, bc, ds, cs, pp, kw, num) {
      if (lc || bc) return '<span class="tk-c">' + m + "</span>";
      if (ds || cs) return '<span class="tk-s">' + m + "</span>";
      if (pp) return '<span class="tk-p">' + m + "</span>";
      if (kw) return '<span class="tk-k">' + m + "</span>";
      if (num) return '<span class="tk-n">' + m + "</span>";
      return m;
    });
  }
  /* ---------- 虚拟实验室入口（代码块上的「在实验室运行」按钮） ---------- */
  var LABC = {};
  function labKey(code) {
    var h = 5381, s = String(code);
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
    var k = "c" + h.toString(36);
    LABC[k] = s;
    return k;
  }
  function labAvailable() { return !!(window.CSim && window.CSim.check); }
  /* ---------- 代码语言判定器（实现在共享模块 code-lang.js） ----------
     为什么抽出去：这套判定原先在 app.js 与 ../case-regression.js 里**各有一份**，
     只能靠注释约定同步，已经因此出现过「页面上不给实验室按钮、回归脚本却当 C 跑」
     的口径分裂。现在两边共用同一实现，改规则只需改一处。
     约定：code-lang.js 必须在 app.js 之前引入（见 index.html）。
     兜底：万一它没加载成功，两个判定器都返回 false —— 也就是退回到「照旧给实验室按钮」，
     宁可少挡一次，也不要让纯 C 代码丢掉按钮。 */
  var LANG = window.CODE_LANG || {
    looksCppOrQt: function () { return false; },
    looksNonC: function () { return false; },
    kindOf: function () { return "代码"; }
  };
  var looksCppOrQt = LANG.looksCppOrQt;
  var looksNonC = LANG.looksNonC;
  /* 非 C 片段的只读提示条：说清为什么这里没有实验室按钮 */
  function nonCNoteRow(code) {
    /* 定语（Shell / PowerShell / JavaScript / 配置片段）也由共享模块判断，避免两边口径漂移 */
    return '<div class="code-lab-row cpp-row"><span class="code-note">' + LANG.kindOf(code) +
           " · 虚拟实验室只支持 C 子集，这段不在页面里执行；请在你自己的 Harness 或终端里对照说明实际敲一遍。</span></div>";
  }
  /* C++/Qt 代码的只读提示条：说明为什么没有实验室按钮，并给出本机编译命令 */
  function cppNoteRow(code, labBtn) {
    var s = String(code);
    /* 推测编译命令：有 Qt 头文件或 Q_OBJECT 就是 Qt 工程，否则按单文件 C++ 处理 */
    var isQt = /#include\s*[<"]Q[A-Za-z]+/.test(s) || /\bQ_OBJECT\b/.test(s);
    var cmd = isQt
      ? "qmake &amp;&amp; make（或 cmake -B build &amp;&amp; cmake --build build）"
      : "g++ -std=c++17 -Wall -g main.cpp -o main";
    return '<div class="code-lab-row cpp-row">' +
           '<span class="code-note">C++/Qt 代码 · 虚拟实验室仅支持 C 子集，请在本机编译：<code>' + cmd + "</code></span>" +
           (labBtn || "") + "</div>";
  }
  function codeBlockLabBtn(code) {
    if (!labAvailable()) return "";
    var s = String(code);
    if (s.length < 30 || s.split("\n").length < 2 || !/[;{}]/.test(s)) return "";
    /* C++/Qt、以及 JS/Shell/配置片段都不进实验室：解释器只认 C 子集，
       硬跑只会报一堆语法错，不如直接给说明 */
    if (looksCppOrQt(s) || looksNonC(s)) return "";
    var r = window.CSim.check(s);
    var label = r.ok ? "▶ 在实验室运行" : "▶ 在实验室打开并补全";
    var cls = r.ok ? "btn-lab runnable" : "btn-lab";
    return '<button type="button" class="link-btn ' + cls + '" data-lab-code="' + labKey(s) + '">' + label + "</button>";
  }
  /* 把测试台的结果渲染成「逐条用例对照」——这是学习者最需要看到的东西：
     哪条过了、哪条没过、实到与期望差在哪。
     关键点：不显示期望输出给「蒙对」留空间，但要显示差异便于自查。 */
  function renderTestResult(res) {
    if (!res) return '<p class="tb-msg bad">没有结果</p>';
    var total = res.total || 0, passed = res.passed || 0;
    var h = '<div class="tb-head">' + (total > 0 && passed === total
      ? '<b class="tb-pass">全部用例通过（' + passed + "/" + total + "）</b>"
      : '<b class="tb-fail">通过 ' + passed + " / " + total + " 条用例</b>") + "</div>";
    if (res.note) h += '<p class="tb-note">' + esc(res.note) + "</p>";
    if (res.error) h += '<p class="tb-msg bad">' + esc(res.error) + "</p>";
    (res.items || []).forEach(function (c, i) {
      var okc = !!c.pass;
      h += '<div class="tb-case ' + (okc ? "ok" : "bad") + '">';
      h += '<div class="tb-case-head">' + (okc ? "✓" : "✗") + " " + esc(c.label || ("用例 " + (i + 1))) + "</div>";
      if (!okc) {
        h += '<div class="tb-diff"><div><i>实到</i><pre>' + esc(c.out == null || c.out === "" ? "(无输出)" : c.out) + "</pre></div>";
        h += "<div><i>期望</i><pre>" + esc(c.expect == null ? "(仅检查能否运行)" : c.expect) + "</pre></div></div>";
        if (c.error) h += '<p class="tb-msg bad">' + esc(c.error) + "</p>";
      }
      h += "</div>";
    });
    return h;
  }
  function openLab(code) {
    window.__LAB_PENDING_CODE = code;
    if (location.hash === "#/lab") {
      setNav("lab");
      setApp(window.Lab.html());
      window.Lab.init(document.getElementById("app"));
    } else {
      location.hash = "#/lab";
    }
  }

  function codeBlock(code) {
    var s = String(code);
    var lines = s.split("\n").length;
    var isCpp = looksCppOrQt(s);
    var isNonC = looksNonC(s);
    var labBtn = codeBlockLabBtn(code);
    if (lines > 28) {
      /* 长代码：默认限高可滚动，提供展开按钮 */
      return '<div class="code-wrap"><div class="code-tools">' +
             '<span class="code-len">共 ' + lines + ' 行</span>' +
             '<button type="button" class="link-btn btn-expand">展开全部</button>' +
             labBtn +
             '</div><pre class="code code-long"><code>' + hl(s) + "</code></pre></div>";
    }
    if (labBtn) {
      return '<div class="code-wrap"><pre class="code"><code>' + hl(s) + "</code></pre>" +
             '<div class="code-lab-row">' + labBtn + "</div></div>";
    }
    /* C++/Qt：给一条只读说明，讲清为什么这里没有「在实验室运行」按钮 */
    if (isCpp && lines >= 3) {
      return '<div class="code-wrap"><pre class="code"><code>' + hl(s) + "</code></pre>" +
             cppNoteRow(s) + "</div>";
    }
    /* JS / Shell / 配置片段：同理，实验室跑不了，说明清楚而不是给个会报错的按钮 */
    if (isNonC && lines >= 3) {
      return '<div class="code-wrap"><pre class="code"><code>' + hl(s) + "</code></pre>" +
             nonCNoteRow(s) + "</div>";
    }
    return '<pre class="code"><code>' + hl(s) + "</code></pre>";
  }
  function codeWithBlanks(code) {
    var parts = String(code).split(/(\{\{\d+\}\})/);
    var html = "";
    parts.forEach(function (p) {
      var m = /^\{\{(\d+)\}\}$/.exec(p);
      if (m) {
        var i = m[1];
        html += '<input class="blank" data-blank="' + i + '" autocomplete="off" spellcheck="false" placeholder="填空' + (+i + 1) + '" />';
      } else if (p) {
        html += "<code>" + hl(p) + "</code>";
      }
    });
    return '<pre class="code code-blank">' + html + "</pre>";
  }

  /* ---------- 题目卡片 ---------- */
  function typeLabel(t) {
    return { single: "单选", judge: "判断", blank: "填空", code: "编程任务" }[t] || "练习";
  }
  function interactiveHTML(q) {
    var h = "";
    if (q.type === "single") {
      h += '<div class="opts">';
      q.opts.forEach(function (o, i) {
        h += '<button type="button" class="opt" data-i="' + i + '"><span class="opt-key">' +
             String.fromCharCode(65 + i) + '.</span><span>' + esc(o) + "</span></button>";
      });
      h += '</div><div class="q-actions"><button type="button" class="btn small btn-check">提交答案</button></div>';
    } else if (q.type === "judge") {
      h += '<div class="judge-row">' +
           '<button type="button" class="btn ghost judge-btn" data-val="1">正确</button>' +
           '<button type="button" class="btn ghost judge-btn" data-val="0">错误</button>' +
           "</div>";
    } else if (q.type === "code") {
      h += '<div class="code-task">';
      /* 教程式引导：先讲清「这类题该怎么做」，再给按钮。
         小白看到四个按钮不知道先点哪个，所以把顺序写死在这里。 */
      h += '<p class="q-guide">这类题要你自己写代码。建议顺序：' +
           '<b>①</b> 自己先在纸上或编辑器里写 → <b>②</b> 写完点「检查我写的对不对」看哪条没过 → ' +
           "<b>③</b> 实在写不出来，再点「看标准答案」。</p>";
      if (q.hint) {
        h += '<details class="hint"><summary>卡住了？看提示（先自己写 10 分钟再看）</summary><div class="hint-body">' + q.hint + "</div></details>";
      }
      /* 只要题目自带测试用例（@case），就提供「检查我写的对不对」：
         学习者把代码贴进来，测试台会逐条跑用例并给出「你写的 / 应该的」对照。 */
      var hasCases = !!(window.TestBench && window.TestBench.parseCases &&
        (window.TestBench.parseCases(String(q.sol || "") + "\n" + String(q.code || "")).filter(function (c) { return !c.inputOnly; }).length));
      h += '<div class="q-actions">';
      if (hasCases) {
        h += '<button type="button" class="btn small btn-test-task">检查我写的对不对</button>';
      }
      h += '<button type="button" class="btn small btn-reveal">看标准答案</button>';
      h += '<button type="button" class="btn ghost small btn-self-ok">我独立写出来了</button>';
      h += '<button type="button" class="btn ghost small btn-self-bad">没写出来，记入错题</button>';
      h += "</div>";
      if (hasCases) {
        h += '<div class="testbench" hidden>' +
             '<textarea class="tb-src" spellcheck="false" placeholder="把你的实现贴到这里（连同 main 或函数本体），然后点「开始测试」"></textarea>' +
             '<div class="q-actions"><button type="button" class="btn small btn-test-run">开始测试</button>' +
             '<button type="button" class="btn ghost small btn-test-fill">填入题目骨架</button></div>' +
             '<div class="tb-out"></div></div>';
      }
      h += "</div>";
    } else {
      var hasMarker = q.code && /\{\{\d+\}\}/.test(q.code);
      if (q.code) {
        h += hasMarker ? codeWithBlanks(q.code) : codeBlock(q.code);
      }
      if (!hasMarker) {
        h += '<div class="blank-row">';
        q.blanks.forEach(function (b, i) {
          var ph = b.hint || "填入答案";
          h += '<input class="blank" data-blank="' + i + '" autocomplete="off" spellcheck="false" placeholder="' + esc(ph) + '" />';
        });
        h += "</div>";
      }
      h += '<div class="q-actions"><button type="button" class="btn small btn-check-blank">提交答案</button></div>';
    }
    return h;
  }
  function questionCard(q, opts) {
    opts = opts || {};
    var h = '<section class="qcard" data-qid="' + q.id + '">';
    h += '<div class="q-head"><span class="q-type t-' + q.type + '">' + typeLabel(q.type) + "</span>";
    if (opts.index != null) h += '<span class="q-index">第 ' + opts.index + " 题</span>";
    if (opts.showFrom) h += '<span class="q-from">' + esc(opts.showFrom) + "</span>";
    if (isSolved(q)) h += '<span class="q-solved">已答对</span>';
    h += "</div>";
    h += '<p class="q-text">' + esc(q.q) + "</p>";
    if (q.code && q.type !== "blank") h += codeBlock(q.code);
    h += '<div class="q-interactive">' + interactiveHTML(q) + "</div>";
    h += '<div class="q-feedback" hidden></div>';
    h += "</section>";
    return h;
  }
  function correctText(q) {
    if (q.type === "single") return String.fromCharCode(65 + q.ans) + ". " + q.opts[q.ans];
    if (q.type === "judge") return q.ans ? "正确" : "错误";
    if (q.type === "blank") return q.blanks.map(function (b) { return b.acc[0]; }).join(" ； ");
    return "";
  }
  function showFeedback(card, q, ok) {
    var fb = card.querySelector(".q-feedback");
    var h = '<div class="fb ' + (ok ? "fb-ok" : "fb-bad") + '">';
    h += '<div class="fb-title">' + (ok ? "回答正确" : "回答错误") + "</div>";
    if (!ok) h += '<div class="fb-ans">正确答案：' + esc(correctText(q)) + "</div>";
    if (q.exp) h += '<div class="fb-exp">' + esc(q.exp) + "</div>";
    if (!ok) h += '<div class="q-actions"><button type="button" class="btn ghost small btn-retry">重做本题</button></div>';
    h += "</div>";
    fb.innerHTML = h;
    fb.hidden = false;
  }
  function tip(card, msg) {
    var fb = card.querySelector(".q-feedback");
    fb.innerHTML = '<div class="fb-tip">' + esc(msg) + "</div>";
    fb.hidden = false;
  }
  function lockCard(card) {
    card.querySelector(".q-interactive").classList.add("locked");
    card.querySelectorAll("input.blank").forEach(function (inp) { inp.disabled = true; });
  }
  function afterAnswer(q, ok) {
    record(q, ok);
    if (answerHook) answerHook(q, ok);
  }

  /* ---------- 评分逻辑 ---------- */
  function evalSingle(card, q) {
    var sel = card.querySelector(".opt.sel");
    if (!sel) { tip(card, "请先选择一个答案"); return; }
    var idx = parseInt(sel.getAttribute("data-i"), 10);
    var ok = idx === q.ans;
    lockCard(card);
    sel.classList.remove("sel");
    var right = card.querySelector('.opt[data-i="' + q.ans + '"]');
    if (right) right.classList.add("ok");
    if (!ok) sel.classList.add("bad");
    showFeedback(card, q, ok);
    afterAnswer(q, ok);
  }
  function evalJudge(card, q, val) {
    var ok = (q.ans ? "1" : "0") === val;
    lockCard(card);
    var btn = card.querySelector('.judge-btn[data-val="' + (q.ans ? "1" : "0") + '"]');
    if (btn) btn.classList.add("ok");
    if (!ok) {
      var chosen = card.querySelector('.judge-btn[data-val="' + val + '"]');
      if (chosen) chosen.classList.add("bad");
    }
    showFeedback(card, q, ok);
    afterAnswer(q, ok);
  }
  function evalBlank(card, q) {
    var inputs = card.querySelectorAll("input.blank");
    var allOk = true;
    inputs.forEach(function (inp) {
      var i = parseInt(inp.getAttribute("data-blank"), 10);
      var acc = (q.blanks[i] && q.blanks[i].acc) || [];
      var v = inp.value || "";
      var ok = acc.some(function (a) { return norm(a) === norm(v); });
      inp.classList.toggle("ok", ok);
      inp.classList.toggle("bad", !ok);
      if (!ok) allOk = false;
    });
    lockCard(card);
    showFeedback(card, q, allOk);
    afterAnswer(q, allOk);
  }
  function resetCard(card) {
    var q = QMAP[card.getAttribute("data-qid")];
    if (!q) return;
    card.querySelector(".q-interactive").innerHTML = interactiveHTML(q);
    card.querySelector(".q-interactive").classList.remove("locked");
    var fb = card.querySelector(".q-feedback");
    fb.hidden = true;
    fb.innerHTML = "";
  }

  /* 编程任务：对照参考实现 + 自评记录 */
  function revealSolution(card, q) {
    var fb = card.querySelector(".q-feedback");
    var h = '<div class="fb fb-sol"><div class="fb-title">参考实现</div>';
    if (q.sol) h += codeBlock(q.sol);
    if (q.exp) h += '<div class="fb-exp">' + esc(q.exp) + "</div>";
    h += "</div>";
    fb.innerHTML = h;
    fb.hidden = false;
    var btn = card.querySelector(".btn-reveal");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "参考实现已显示";
    }
  }
  function selfAssess(card, q, ok) {
    lockCard(card);
    card.querySelectorAll(".btn-self-ok, .btn-self-bad").forEach(function (b) { b.disabled = true; });
    var fb = card.querySelector(".q-feedback");
    var div = document.createElement("div");
    div.className = "fb " + (ok ? "fb-ok" : "fb-bad");
    div.innerHTML = '<div class="fb-title">' + (ok ? "已记录：独立完成" : "已加入错题本") + "</div>" +
      '<div class="fb-exp">' + (ok
        ? "写完务必对照参考实现，重点看命名、错误处理和边界检查——这三样是工作后代码评审的主要关注点。"
        : "先把参考实现逐行读懂，再合上答案从零重写；明天回错题本再做一次，做出来才算掌握。") + "</div>";
    fb.appendChild(div);
    fb.hidden = false;
    afterAnswer(q, ok);
  }

  /* ---------- 视图：首页 ---------- */
  function viewHome() {
    setNav("home");
    var solved = 0;
    ALLQ.forEach(function (q) { if (isSolved(q)) solved++; });
    var total = ALLQ.length;
    var h = '<section class="card hero">';
    h += "<h1>嵌入式全栈学习平台 · 从零基础到精通</h1>";
    h += "<p>这不是看完就忘的资料清单，而是一条<b>从零到能独立做项目</b>的完整训练路径。全站按「学科 → 课程 → 章 → 知识点」四层组织，" +
         "每门课都标出 <b>L0～L5 能力等级</b>，让你随时能回答两个问题：我现在在哪一级？下一站该学什么？</p>";
    h += "<div class=\"cover-path\"><div><b>① 学会方法</b><span>目标拆解 · 编码阶梯 · 间隔复习 · 知识连接</span></div><i>→</i><div><b>② 打牢基础</b><span>C 语言 · 数据结构 · 计算机原理 · 电路 · Linux</span></div><i>→</i><div><b>③ 动手构建</b><span>实验 · 项目 · 上位机 · 驱动 · AI Harness</span></div><i>→</i><div><b>④ 面向岗位</b><span>路线 · 作品集 · 面试复盘</span></div></div>";
    h += "<p>全站共 " + COURSES.length + " 门课、" + SUBJECTS.length + " 个学科；每章都是「讲义式讲解 + 例题 + 练习 + 面试要点 + 课后作业」。进度保存在浏览器中，错题答对后才移出。</p>";
    h += '<div class="stat"><b>' + solved + " / " + total + " 题</b><div class=\"pbar\"><i style=\"width:" + pct(solved, total) + '%"></i></div><b>' + pct(solved, total) + "%</b></div>";
    h += "</section>";

    /* 第一次来的人最需要的是「我该干什么」，所以引导卡排在所有内容之前 */
    h += firstVisitCard();

    /* 坚持激励：连胜 / 经验 / 每日目标 / 成就 —— 放在引导卡之后、课程之前 */
    try {
      if (window.Motivate && window.Motivate.bannerHTML) h += window.Motivate.bannerHTML();
    } catch (e) {}

    /* 间隔复习：今日待复习 */
    try {
      if (window.Review && window.Review.bannerHTML) h += window.Review.bannerHTML();
    } catch (e) {}

    /* 就业出口：紧跟在首页第一屏之后。
       理由是这一页要回答的第一个问题不是「学什么」，而是「学完能换来什么」——
       对一个目标明确的读者，出口本身就是最强的动机来源，所以它必须排在课程列表之前。 */
    if (window.JOB_MAP && window.JOB_MAP.jobs.length) {
      h += '<div class="group-title"><h2>学完能胜任什么岗位</h2><span>' +
           window.JOB_MAP.jobs.length + ' 个方向 · 能力清单 · 作品集要求 · 面试会问什么</span></div>';
      h += '<a class="card job-entry" href="#/jobs">';
      h += '<div class="je-head"><b>想找什么工作：把「学会」接上「高薪岗位」</b>' +
           '<span class="je-go">展开岗位能力地图 ›</span></div>';
      h += "<p>同样叫「嵌入式工程师」，有人月薪 8K、有人 30K。差别不在努力程度，而在三件可以主动选择的事：" +
           "<b>会不会操作系统</b>、<b>做的产品要求多高的可靠性</b>、<b>站在供应链的哪个位置</b>。</p>";
      h += '<div class="je-tags">';
      window.JOB_MAP.jobs.forEach(function (j) {
        h += '<span class="je-tag">' + esc(j.name) + "</span>";
      });
      h += "</div>";
      h += '<p class="je-note">每个方向都写清了要哪些能力（可以直接点进对应课程）、拿什么作品证明自己、' +
           "面试会被问什么，以及最容易卡住的地方。薪资数字标注了来源性质，只用来建立量级感，不当承诺。</p>";
      h += "</a>";
    }

    /* ---------- 主线能力阶梯：全站统一的进阶结构 ----------
       按 L0→L5 排列，每级列出对应课程，点进去就能学。
       这是「我现在在哪、下一步去哪」最直接的答案。 */
    function coursesAtLevel(lid) {
      var out = [];
      SUBJECTS.forEach(function (s) {
        (s.ids || []).forEach(function (cid) {
          if (COURSE_LEVEL[cid] === lid) { var cc = courseById(cid); if (cc) out.push(cc); }
        });
      });
      return out;
    }
    h += '<div class="group-title"><h2>主线能力阶梯</h2><span>L0 → L5 六级标尺 · 每级列出对应课程，点进去直接学</span></div>';
    h += '<div class="ladder">';
    LEVELS.forEach(function (lv, li) {
      var list = coursesAtLevel(lv.id);
      var done = 0, tot = 0;
      list.forEach(function (c) { var p = courseProgress(c); done += p.solved; tot += p.total; });
      h += '<div class="ladder-step lv-' + lv.id.toLowerCase() + '">';
      h += '<div class="ladder-head"><span class="ladder-id">' + lv.id + '</span>';
      h += '<span class="ladder-name">' + esc(lv.name) + "</span>";
      h += '<span class="ladder-cnt">' + list.length + " 门课</span></div>";
      h += '<p class="ladder-goal">' + esc(lv.goal) + "</p>";
      h += '<p class="ladder-can">' + esc(lv.can) + "</p>";
      h += '<div class="ladder-chips">';
      list.forEach(function (c) {
        h += '<a class="ladder-chip" href="#/course/' + c.id + '" title="' + esc(c.desc) + '">' + esc(c.title) + "</a>";
      });
      if (!list.length) h += '<span class="ladder-empty">课程补齐中</span>';
      h += "</div>";
      if (tot > 0) {
        h += '<div class="ladder-prog"><span class="pbar thin"><i style="width:' + pct(done, tot) + '%"></i></span><span>' + done + "/" + tot + "</span></div>";
      }
      h += "</div>";
      if (li < LEVELS.length - 1) h += '<i class="ladder-arrow">↓</i>';
    });
    h += "</div>";

    /* ---------- 学科入口：最高一层分类 ---------- */
    h += '<div class="group-title"><h2>按学科进入</h2><span>' + SUBJECTS.length + " 个学科 · 每个学科内自带学习顺序与能力要求</span></div>";
    h += '<div class="course-grid">';
    SUBJECTS.forEach(function (s) {
      var list = (s.ids || []).map(courseById).filter(Boolean);
      var st = bundleStat(list);
      h += '<a class="course-card subject-card" href="#/subject/' + s.id + '">';
      h += '<span class="course-badge ' + s.cls + '">' + esc(s.badge) + "</span>";
      h += "<h3>" + esc(s.name) + "</h3>";
      h += '<p class="desc">' + esc(s.note) + "</p>";
      h += '<div class="meta">' + (st.courses ? st.courses + " 门课 · " + st.chapters + " 章 · " + st.points + " 个知识点 · " + st.questions + " 题" : "课程补齐中") + "</div>";
      if (st.questions) {
        h += '<div class="pbar thin"><i style="width:' + st.pct + '%"></i></div>';
      }
      h += '<span class="go">进入学科 ›</span></a>';
    });
    h += "</div>";

    /* 快捷入口 */
    h += '<div class="quick-row">';
    h += '<a class="quick-card" href="#/course/learn"><b>从这里开始</b><span>先学目标拆解、主动回忆和项目闭环</span></a>';
    h += '<a class="quick-card" href="#/course/lad"><b>编码训练阶梯</b><span>读代码 → 补代码 → 改代码 → 写函数 → 独立程序 → 工程集成</span></a>';
    h += '<a class="quick-card" href="#/course/cpp"><b>C++ 核心</b><span>语法特性 · 内存管理 · 面向对象 · 标准库，四块一次打透</span></a>';
    h += '<a class="quick-card" href="#/course/qt"><b>Qt 框架</b><span>信号槽 · 界面组件 · 事件处理 · 跨平台构建</span></a>';
    h += '<a class="quick-card" href="#/lab"><b>虚拟实验室</b><span>在页面里直接运行 C 代码，单步看变量、调用栈与输出</span></a>';
    h += '<a class="quick-card" href="#/map"><b>知识地图</b><span>看清每个知识点的前置、下游和易混淆点，不再前后脱节</span></a>';
    h += '<a class="quick-card" href="#/search"><b>全站搜索</b><span>按知识点、协议、芯片、工具或题目原文检索全站</span></a>';
    h += '<a class="quick-card" href="#/weak"><b>薄弱点回顾</b><span>按章节聚合错题，看清哪一块最需要补</span></a>';
    h += '<a class="quick-card" href="#/route/qt"><b>C++/Qt 岗位路线</b><span>' + ROLE_ROUTES.length + ' 条方向的学习顺序、完成标准与验收清单</span></a>';
    h += "</div>";

    /* 岗位路线 */
    h += '<div class="group-title"><h2>按岗位选路线</h2><span>' + ROLE_ROUTES.length + ' 条方向 · 含推荐课程顺序、学习目标与完成标准</span></div>';
    h += '<div class="course-grid">';
    ROLE_ROUTES.forEach(function (r) {
      var list = r.courses.map(courseById).filter(Boolean);
      var tp = { total: 0, solved: 0 }, chs = 0;
      list.forEach(function (c) {
        var p = courseProgress(c);
        tp.total += p.total; tp.solved += p.solved; chs += c.chapters.length;
      });
      h += '<a class="course-card route-card" href="#/route/' + r.id + '">';
      h += '<span class="route-tag">' + esc(r.tag) + "</span>";
      h += "<h3>" + esc(r.name) + "</h3>";
      h += '<p class="desc">' + esc(r.desc) + "</p>";
      h += '<div class="meta">' + list.length + " 门课 · " + chs + " 章 · " + tp.total + " 题 · 已掌握 " + tp.solved + " 题</div>";
      h += '<div class="pbar thin"><i style="width:' + pct(tp.solved, tp.total) + '%"></i></div>';
      h += '<span class="go">查看路线 ›</span></a>';
    });
    h += "</div>";

    function courseCardHTML(c) {
      var p = courseProgress(c);
      var s = '<a class="course-card" href="#/course/' + c.id + '">';
      s += '<span class="course-badge ' + c.badgeCls + '">' + esc(c.badge) + "</span>";
      s += levelChip(c.id);
      s += "<h3>" + esc(c.title) + "</h3>";
      s += '<p class="desc">' + esc(c.desc) + "</p>";
      s += '<div class="meta">' + c.chapters.length + " 章 · " + p.total + " 题 · 已掌握 " + p.solved + " 题</div>";
      s += '<div class="pbar thin"><i style="width:' + p.pct + '%"></i></div>';
      s += '<span class="go">进入课程 ›</span></a>';
      return s;
    }
    /* 兜底：万一 taxonomy.js 漏登记了某门课，仍然把它显示出来，
       避免「课程存在但首页看不见」。校验器会同时报错，提示去登记。 */
    var rest = COURSES.filter(function (c) { return !subjectOfCourse(c.id); });
    if (rest.length) {
      h += '<div class="group-title"><h2>未归类课程</h2><span>共 ' + rest.length + " 门 · 请在 taxonomy.js 里登记学科</span></div>";
      h += '<div class="course-grid">';
      rest.forEach(function (c) { h += courseCardHTML(c); });
      h += "</div>";
    }

    h += '<section class="card howto"><h3>怎么用这个站</h3><ol>';
    h += "<li><b>先定位再推进</b>：先在首页「主线能力阶梯」上找到自己现在所处的等级，从那一级开始；每门课都有唯一的学科归属，学科页里给出本学科的建议学习顺序。</li>";
    h += "<li><b>错题本</b>：答错的题自动收录，隔天重做，答对自动移出，直到清空。</li>";
    h += "<li><b>随机测验</b>：每门课都有 10 题随机挑战，检验综合掌握度。</li>";
    h += "<li><b>动手验证</b>：知识点里的代码先在本站虚拟实验室里跑一遍（单步执行、看变量变化、看调用栈），确认逻辑对了再自己从头敲一遍。C++ 与 Qt 的代码实验室跑不了（引擎只认 C 子集），需要在本机用 <code>g++ -std=c++17</code> 或 <code>qmake / cmake</code> 编译。</li>";
    h += "<li><b>写不出代码就进训练营</b>：每个项目先读懂参考实现，再做分步填空把关键行亲手补出来，最后合上答案从零默写一遍——编程能力就是这样长出来的。</li>";
    h += "<li><b>搭配课程</b>：Linux 应用编程部分对应你的 GZ2619 课程笔记（文件 IO / 并发编程 / 网络编程 / LVGL），可边上课边刷；C++ 与 Qt 是上位机方向，和 LVGL 正好一低一高互补；面试题板块每题都给了可直接背的答案要点。</li>";
    h += "</ol></section>";

    var wrongIds = Object.keys(store.wrong);
    if (wrongIds.length > 0) {
      h += '<section class="card"><h3>你有一个待清理的错题本</h3>' +
           '<p style="color:var(--ink2);font-size:14px">当前共 <b style="color:var(--bad)">' + wrongIds.length + "</b> 道错题等待重做。</p>" +
           '<a class="btn small" href="#/wrong">去重做错题</a></section>';
    }
    setApp(h);
  }

  /* ---------- 视图：学科（「学科 → 课程」的第二层落地页） ----------
     一个学科就是一个完整的方向：说明它解决什么问题、学完能做什么、
     下面有哪些课、按什么顺序学。 */
  function viewSubject(sid) {
    setNav("");
    var s = subjectById(sid);
    if (!s) { viewHome(); return; }
    var list = (s.ids || []).map(courseById).filter(Boolean);
    var st = bundleStat(list);
    var h = '<a class="crumb" href="#/">‹ 全部学科</a>';
    h += '<section class="card">';
    h += '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">';
    h += '<span class="course-badge ' + s.cls + '">' + esc(s.badge) + "</span>";
    h += "<div style=\"flex:1;min-width:200px\"><h1 style=\"margin:0\">" + esc(s.name) + "</h1>" +
         '<p class="desc" style="margin:4px 0 0;color:var(--ink2);font-size:13.5px">' + esc(s.note) + "</p></div>";
    h += "</div>";
    h += '<p style="font-size:14px;line-height:1.85;margin-top:12px">' + esc(s.desc) + "</p>";
    if (s.goal) h += '<div class="note-box goal-box"><b>学完这个学科能做什么</b><p>' + esc(s.goal) + "</p></div>";
    h += '<div class="meta" style="font-size:13px;color:var(--ink3)">' +
         (st.courses ? st.courses + " 门课 · " + st.chapters + " 章 · " + st.points + " 个知识点 · " + st.questions + " 题" : "课程补齐中") + "</div>";
    if (st.questions) {
      h += '<div class="stat" style="display:flex;align-items:center;gap:12px;margin-top:12px">' +
           '<b style="font-size:14px;color:var(--brand)">' + st.solved + " / " + st.questions + ' 题</b>' +
           '<div class="pbar"><i style="width:' + st.pct + '%"></i></div>' +
           '<b style="font-size:14px;color:var(--brand)">' + st.pct + "%</b></div>";
    }
    h += "</section>";

    h += '<div class="sec-title">建议学习顺序</div>';
    if (!list.length) {
      h += '<section class="card"><p style="color:var(--ink2);font-size:14px">这个学科的课程正在补齐中，稍后再来。</p></section>';
    } else {
      h += '<div class="ch-list">';
      list.forEach(function (c, i) {
        var p = courseProgress(c);
        h += '<a class="ch-row" href="#/course/' + c.id + '">';
        h += '<span class="ch-num">' + (i + 1) + "</span>";
        h += '<span class="ch-main"><span class="ch-title">' + esc(c.title) + "</span> " + levelChip(c.id) +
             '<span class="ch-brief" style="display:block">' + esc(c.desc) + "</span>" +
             '<span class="ch-meta" style="display:block">' + c.chapters.length + " 章 · " + p.total + " 题" +
             (p.solved > 0 ? " · 已掌握 " + p.solved + " 题" : "") + "</span></span>";
        h += '<span class="ch-prog"><span class="pbar thin" style="flex:1"><i style="width:' + p.pct + '%"></i></span><span>' + p.pct + "%</span></span>";
        h += '<span class="ch-arrow">›</span></a>';
      });
      h += "</div>";
    }
    setApp(h);
  }

  /* ---------- 视图：课程 ---------- */
  function viewCourse(cid) {
    setNav("");
    var c = courseById(cid);
    if (!c) { viewHome(); return; }
    var p = courseProgress(c);
    var subj = subjectOfCourse(c.id);
    var lv = levelOfCourse(c.id);
    var h = subj
      ? '<a class="crumb" href="#/subject/' + subj.id + '">‹ ' + esc(subj.name) + "</a>"
      : '<a class="crumb" href="#/">‹ 全部学科</a>';
    h += '<section class="card">';
    h += '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">';
    h += '<span class="course-badge ' + c.badgeCls + '">' + esc(c.badge) + "</span>";
    h += "<div style=\"flex:1;min-width:200px\"><h1 style=\"margin:0\">" + esc(c.title) + "</h1>" +
         '<p class="desc" style="margin:4px 0 0;color:var(--ink2);font-size:13.5px">' + esc(c.desc) + "</p></div>";
    h += '<a class="btn small" href="#/quiz/' + c.id + '">随机测验 10 题</a>';
    h += "</div>";
    /* 能力等级说明：告诉学习者这门课把 - 带到哪一级、拿什么当验收证据 */
    if (lv) {
      h += '<div class="lv-box"><span class="lv-chip lv-' + lv.id.toLowerCase() + '">' + lv.id + " " + esc(lv.name) + "</span>" +
           '<div class="lv-body"><b>学完到达 ' + lv.id + " · " + esc(lv.name) + "</b>" +
           "<p>能做到：" + esc(lv.can) + "</p>" +
           "<p>验收证据：" + esc(lv.evid) + "</p></div></div>";
    }
    h += '<div class="stat" style="display:flex;align-items:center;gap:12px;margin-top:14px">' +
         "<b style=\"font-size:14px;color:var(--brand)\">" + p.solved + " / " + p.total + " 题</b>" +
         '<div class="pbar"><i style="width:' + p.pct + '%"></i></div><b style="font-size:14px;color:var(--brand)">' + p.pct + "%</b></div>";

    /* 学习目标 / 前置课程 / 岗位方向 */
    if (c.goal) h += '<div class="note-box goal-box"><b>学完能做什么</b><p>' + esc(c.goal) + "</p></div>";
    if (c.dep && c.dep.length) {
      var depNames = c.dep.map(courseById).filter(Boolean);
      if (depNames.length) {
        h += '<div class="note-box"><b>建议先学（前置课程）</b><p>' +
             depNames.map(function (d) { return '<a href="#/course/' + d.id + '">' + esc(d.title) + "</a>"; }).join("、") +
             "</p></div>";
      }
    }
    if (c.roles && c.roles.length) {
      var rs = ROLE_ROUTES.filter(function (r) { return c.roles.indexOf(r.id) >= 0; });
      if (rs.length) {
        h += '<div class="note-box"><b>对应岗位方向</b><p>' +
             rs.map(function (r) { return '<a href="#/route/' + r.id + '">' + esc(r.name) + "</a>"; }).join("、") +
             "</p></div>";
      }
    }
    h += "</section>";

    h += '<div class="sec-title">章节目录</div>';
    h += '<div class="ch-list">';
    c.chapters.forEach(function (ch, i) {
      var solved = 0;
      ch.quiz.forEach(function (q) { if (isSolved(q)) solved++; });
      var done = solved >= ch.qTotal && ch.qTotal > 0;
      h += '<a class="ch-row' + (done ? " done" : "") + '" href="#/chapter/' + ch.id + '">';
      h += '<span class="ch-num">' + (i + 1) + "</span>";
      h += '<span class="ch-main"><span class="ch-title">' + esc(ch.title) + "</span>" +
           '<span class="ch-brief" style="display:block">' + esc(ch.brief || "") + "</span>" +
           '<span class="ch-meta" style="display:block">' + ch.pTotal + " 个知识点 · " + ch.qTotal + " 题" + (solved > 0 ? " · 已掌握 " + solved + " 题" : "") + "</span></span>";
      h += '<span class="ch-prog"><span class="pbar thin" style="flex:1"><i style="width:' + pct(solved, ch.qTotal) + '%"></i></span><span>' + pct(solved, ch.qTotal) + "%</span></span>";
      h += '<span class="ch-arrow">›</span>';
      h += "</a>";
    });
    h += "</div>";

    /* ---------- 学完这门去哪 ----------
       一个「一站式学习平台」最该回答的问题之一。学科页给了整体顺序，
       但学完一门课如果只停在章节目录，学习者就不知道下一步该干什么。
       这里给三个明确去处：同学科下一门（最多两门）、本学科走完则提示下一个学科、回学科总览。 */
    h += '<div class="sec-title">学完这门去哪</div><div class="next-row">';
    var order = subj ? (subj.ids || []) : [];
    var myIdx = order.indexOf(c.id);
    var nexts = myIdx >= 0 ? order.slice(myIdx + 1, myIdx + 3) : [];
    nexts.forEach(function (nid) {
      var nc = courseById(nid);
      if (!nc) return;
      h += '<a class="next-card" href="#/course/' + nc.id + '">' +
           '<span class="next-kind">同学科 · 下一门</span>' +
           "<b>" + esc(nc.title) + "</b>" + levelChip(nc.id) +
           '<span class="next-why">' + esc(nc.brief || nc.desc) + "</span></a>";
    });
    if (!nexts.length && subj) {
      var si2 = SUBJECTS.indexOf(subj);
      var following = si2 >= 0 ? SUBJECTS[si2 + 1] : null;
      var firstOfNext = (following && (following.ids || []).length) ? courseById(following.ids[0]) : null;
      if (firstOfNext) {
        h += '<a class="next-card" href="#/course/' + firstOfNext.id + '">' +
             '<span class="next-kind">本学科已到最后一门 · 建议进入下一个学科</span>' +
             "<b>" + esc(following.name) + "</b>" + levelChip(firstOfNext.id) +
             '<span class="next-why">从《' + esc(firstOfNext.title) + "》开始</span></a>";
      }
    }
    if (subj) {
      h += '<a class="next-card" href="#/subject/' + subj.id + '">' +
           '<span class="next-kind">回学科总览</span>' +
           "<b>" + esc(subj.name) + "</b>" +
           '<span class="next-why">看这个学科的完整学习顺序与完成标准</span></a>';
    }
    h += "</div>";

    setApp(h);
  }

  /* ---------- 视图：章节 ---------- */
  function viewChapter(chId) {
    setNav("");
    var ch = CHMAP[chId];
    if (!ch) { viewHome(); return; }
    var c = courseById(ch.courseId);
    var solved = 0;
    ch.quiz.forEach(function (q) { if (isSolved(q)) solved++; });

    var idx0 = c.chapters.indexOf(ch);
    var prevCh0 = idx0 > 0 ? c.chapters[idx0 - 1] : null;

    var h = '<a class="crumb" href="#/course/' + c.id + '">‹ ' + esc(c.title) + "</a>";
    h += '<section class="card chap-head">';
    h += "<h1>" + esc(ch.title) + "</h1>";
    if (ch.brief) h += '<p class="brief">' + esc(ch.brief) + "</p>";
    h += '<p class="chap-stat">共 <b>' + ch.pTotal + "</b> 个知识点 · <b>" + ch.qTotal + "</b> 道练习题 · 已掌握 <b>" + solved + "</b> 题</p>";

    /* 前置依赖：显式 pre 字段优先，否则按课程顺序取上一章 */
    h += '<div class="dep-line"><b>前置</b>';
    if (ch.pre && ch.pre.length) {
      var preNames = ch.pre.map(function (id) {
        var pc = CHMAP[id];
        return pc ? '<a href="#/chapter/' + pc.id + '">' + esc(pc.title) + "</a>" : "";
      }).filter(Boolean);
      h += "<span>" + (preNames.length ? preNames.join("、") : "无") + "</span>";
    } else if (prevCh0) {
      h += '<span><a href="#/chapter/' + prevCh0.id + '">' + esc(prevCh0.title) + "</a>（同课程上一章）</span>";
    } else {
      h += '<span>本课程第 1 章，可直接开始</span>';
    }
    h += "</div>";

    /* 学习流程引导：小白最常卡在「知道要学，但不知道具体该做什么」。
       把这一章要做的三个动作按顺序摆出来，并明确「第一次看不懂很正常」——降低心理门槛。 */
    h += '<div class="study-flow"><b>这一章怎么学（三步）</b>' +
         '<span class="sf-step"><i>1</i>往下读「知识点精讲」。第一次看不懂很正常，先通读一遍，别停下来抠细节。</span>' +
         '<span class="sf-step"><i>2</i>读「例题精讲」。它会手把手把一道题从头做出来给你看，这一步最关键。</span>' +
         '<span class="sf-step"><i>3</i>自己做「练习」。做完点「提交答案」；错了不要紧，会自动进错题本。</span>' +
         "</div>";

    /* 最低完成标准：这个说法其他文档会引用，保留；但补一句人话解释，别让它读起来像压力 */
    h += '<div class="note-box std-box"><b>本章最低完成标准</b>' +
         '<p class="std-hint">做到下面这几条，这一章才算真的学会了。暂时做不到也没关系，回头再读一遍就行。</p><ul>';
    h += "<li>把这 <b>" + ch.qTotal + "</b> 道练习题全部做对（答错会自动进错题本，重做答对才移出）</li>";
    h += "<li>知识点里的示例代码，至少在电脑上敲一遍跑通</li>";
    h += "<li>合上讲解，能用自己的话把本章 2~3 个核心概念讲清楚（讲不清就是没会）</li>";
    if (ch.std && ch.std.length) {
      ch.std.forEach(function (s) { h += "<li>" + esc(s) + "</li>"; });
    }
    h += "</ul></div>";
    h += "</section>";

    h += chapterToc(ch);
    h += backToTop();
    h += '<div class="sec-title">知识点精讲 <small>点击标题可折叠</small></div>';
    ch.points.forEach(function (pt) {
      h += '<details class="point" open id="' + pt.id + '"><summary>' + esc(pt.t) + "</summary>";
      /* 笔记/收藏 */
      h += noteBarHTML(ch.id, pt);
      if (pt.baby) {
        /* 有宝宝级讲解时它当主体；原讲解不删，收进折叠区留给进阶阅读。
           前置/下游导航对新手同样重要，所以留在主体而不是折叠区。 */
        h += '<div class="pt-body">' + babyBlock(pt) + kpLinksHTML(pt) + "</div>";
        h += '<details class="baby-orig"><summary>想更深入：看完整版讲解</summary>' +
             '<div class="pt-body">' + pt.h;
        if (pt.code) h += codeBlock(pt.code);
        h += "</div></details>";
      } else {
        h += '<div class="pt-body">' + pt.h;
        if (pt.code) h += codeBlock(pt.code);
        h += kpLinksHTML(pt);
        h += "</div>";
      }
      h += "</details>";
    });

    /* 例题精讲：先讲「这道题是怎么做出来的」，再让学习者自己动手做练习。
       教学顺序上例题必须排在练习前面；但推导默认折叠，
       逼学习者先按 ex.think 里的提示自己想一想，再对答案。 */
    var exCount = (ch.examples || []).length;
    if (exCount) {
      h += '<div class="sec-title">例题精讲 <small>共 ' + exCount + " 道 · 先自己想一遍再看推导</small></div>";
      ch.examples.forEach(function (ex, i) {
        h += '<div class="ex-card">';
        h += '<div class="ex-head"><span class="ex-no">例 ' + (i + 1) + "</span><b>" + esc(ex.t) + "</b></div>";
        h += '<div class="ex-q">' + ex.q + "</div>";
        if (ex.think) {
          h += '<details class="ex-think"><summary>先自己想一想</summary><p>' + ex.think + "</p></details>";
        }
        h += '<details class="ex-sol"><summary>看完整推导</summary>';
        if (ex.steps && ex.steps.length) {
          h += '<ol class="ex-steps">';
          ex.steps.forEach(function (s) { h += "<li>" + s + "</li>"; });
          h += "</ol>";
        }
        if (ex.code) h += codeBlock(ex.code);
        if (ex.key) h += '<div class="ex-key"><b>关键点与易错处</b><p>' + ex.key + "</p></div>";
        h += "</details></div>";
      });
    }

    h += '<div class="sec-title">练习 <small>共 ' + ch.qTotal + " 题，答对全部即完成本章</small></div>";
    ch.quiz.forEach(function (q, i) {
      h += questionCard(q, { index: i + 1 });
    });

    /* 上下章导航 */
    var idx = c.chapters.indexOf(ch);
    var prev = idx > 0 ? c.chapters[idx - 1] : null;
    var next = idx < c.chapters.length - 1 ? c.chapters[idx + 1] : null;
    h += '<div class="chap-nav">';
    if (prev) h += '<a href="#/chapter/' + prev.id + '"><small>上一章</small>' + esc(prev.title) + "</a>";
    if (next) h += '<a class="next" href="#/chapter/' + next.id + '"><small>下一章</small>' + esc(next.title) + "</a>";
    h += "</div>";
    setApp(h);
  }

  /* ---------- 视图：岗位路线 ---------- */
  function viewRoute(rid) {
    setNav("route");
    var r = routeById(rid);
    if (!r) { viewHome(); return; }
    var list = r.courses.map(courseById).filter(Boolean);
    var total = 0, solved = 0, chapters = 0;
    list.forEach(function (c) {
      var p = courseProgress(c);
      total += p.total; solved += p.solved; chapters += c.chapters.length;
    });
    var h = '<a class="crumb" href="#/">‹ 全部课程</a>';
    h += '<section class="card">';
    h += '<span class="route-tag">' + esc(r.tag) + "</span>";
    h += "<h1 style=\"margin:8px 0 6px;font-size:23px\">" + esc(r.name) + "</h1>";
    h += '<p style="color:var(--ink2);font-size:14.5px;margin:0 0 10px">' + esc(r.desc) + "</p>";
    h += '<div class="note-box goal-box"><b>路线目标（完成标准）</b><p>' + esc(r.outcome) + "</p></div>";
    h += '<div class="stat" style="display:flex;align-items:center;gap:12px;margin-top:10px">' +
         '<b style="font-size:14px;color:var(--brand)">' + solved + " / " + total + " 题</b>" +
         '<div class="pbar"><i style="width:' + pct(solved, total) + '%"></i></div>' +
         '<b style="font-size:14px;color:var(--brand)">' + pct(solved, total) + "%</b></div>";
    h += '<p class="ch-meta" style="margin-top:8px">本路线共 ' + list.length + " 门课 · " + chapters + " 章 · " + total + " 题</p>";
    h += "</section>";

    /* 其他路线切换 */
    h += '<div class="chip-row">';
    ROLE_ROUTES.forEach(function (x) {
      h += '<a class="chip' + (x.id === r.id ? " on" : "") + '" href="#/route/' + x.id + '">' + esc(x.name) + "</a>";
    });
    h += "</div>";

    h += '<div class="sec-title">推荐学习顺序 <small>按序号推进，前一门没吃透不要跳</small></div>';
    h += '<div class="ch-list">';
    list.forEach(function (c, i) {
      var p = courseProgress(c);
      var done = p.total > 0 && p.solved >= p.total;
      h += '<a class="ch-row route-row' + (done ? " done" : "") + '" href="#/course/' + c.id + '">';
      h += '<span class="ch-num">' + (i + 1) + "</span>";
      h += '<span class="ch-main">';
      h += '<span class="ch-title">' + esc(c.title) + "</span>";
      h += '<span class="ch-brief" style="display:block">' + esc(c.brief || c.desc) + "</span>";
      if (c.goal) h += '<span class="ch-goal" style="display:block">验收：' + esc(c.goal) + "</span>";
      h += '<span class="ch-meta" style="display:block">' + c.chapters.length + " 章 · " + p.total + " 题" + (p.solved > 0 ? " · 已掌握 " + p.solved + " 题" : "") + "</span>";
      h += "</span>";
      h += '<span class="ch-prog"><span class="pbar thin" style="flex:1"><i style="width:' + p.pct + '%"></i></span><span>' + p.pct + "%</span></span>";
      h += '<span class="ch-arrow">›</span></a>';
    });
    h += "</div>";
    setApp(h);
  }

  function chapterToc(ch) {
    if (!ch || !ch.points || ch.points.length < 3) return "";
    var h = '<div class="sec-nav" id="chapterToc"><b>本章目录</b>';
    ch.points.forEach(function (pt) {
      h += '<a href="#' + pt.id + '">' + esc(String(pt.t).slice(0, 18)) + '</a>';
    });
    h += '<a href="#/cheatsheet/' + ch.id + '">速查卡</a></div>';
    return h;
  }
  function backToTop() {
    return '<button type="button" class="btn-to-top" id="btnToTop" aria-label="回到顶部">↑ 顶部</button>';
  }
  function cheatSheet(chId) {
    setNav("");
    var ch = CHMAP[chId];
    if (!ch) { viewHome(); return; }
    var c = courseById(ch.courseId);
    var h = '<a class="crumb" href="#/chapter/' + ch.id + '">‹ ' + esc(ch.title) + '</a>';
    h += '<section class="card"><h1>本章速查卡</h1>';
    h += '<p class="ch-meta">复习用：只看标题、要点和例题结论，不必重读全文。</p></section>';
    h += '<div class="sec-title">知识点清单</div>';
    h += '<div class="ch-list">';
    ch.points.forEach(function (pt) {
      h += '<div class="ch-row"><span class="ch-main"><span class="ch-title">' + esc(pt.t) + '</span>';
      h += '<span class="ch-brief">' + esc(stripTags(pt.h).slice(0, 120)) + '…</span></span></div>';
    });
    h += '</div>';
    if (ch.examples && ch.examples.length) {
      h += '<div class="sec-title">例题结论</div>';
      ch.examples.forEach(function (ex) {
        h += '<div class="ex-card"><b>' + esc(ex.t) + '</b>';
        if (ex.key) h += '<div class="meta">' + stripTags(ex.key).slice(0, 160) + '</div>';
        h += '</div>';
      });
    }
    h += '<div class="q-actions"><a class="btn small" href="#/chapter/' + ch.id + '">回章节做题</a>';
    h += '<a class="btn ghost small" href="#/review">今日复习</a></div>';
    setApp(h);
  }
  /* ---------- 视图：全站搜索 ---------- */
  function viewSearch(kw) {
    setNav("search");
    kw = kw || "";
    var h = '<a class="crumb" href="#/">‹ 全部课程</a>';
    h += '<section class="card">';
    h += "<h1 style=\"margin:0 0 10px\">全站搜索</h1>";
    h += '<form class="search-form" id="searchForm">' +
         '<input id="searchInput" class="search-input" type="search" autocomplete="off" placeholder="搜知识点 / 协议 / 芯片 / 工具 / 题目原文，例如：epoll、优先级反转、断电保护、volatile" value="' + esc(kw) + '" />' +
         '<button class="btn small" type="submit">搜索</button></form>';
    h += '<p class="ch-meta">覆盖 ' + COURSES.length + " 门课的课程简介、章节说明、全部知识点正文与全部题目解析，共 " + SIDX.length + " 条索引。</p>";
    h += "</section>";

    if (!kw) {
      h += '<section class="card"><h3 style="margin-top:0">常用检索词</h3><div class="chip-row" style="margin-top:6px">';
      ["epoll", "优先级反转", "掉电保护", "volatile", "指针", "Cache 一致性", "MQTT", "GATT", "看门狗", "交叉编译", "MISRA", "OTA 回滚", "栈溢出", "状态机", "面试"].forEach(function (w) {
        h += '<a class="chip" href="#/search/' + encodeURIComponent(w) + '">' + esc(w) + "</a>";
      });
      h += "</div></section>";
      setApp(h);
      return;
    }

    var res = searchAll(kw);
    var byKind = { course: [], chapter: [], point: [], quiz: [] };
    res.forEach(function (it) { byKind[it.k].push(it); });
    var kindName = { course: "课程", chapter: "章节", point: "知识点", quiz: "题目" };
    h += '<section class="card"><b>“' + esc(kw) + "” 共命中 " + res.length + " 条</b>" +
         '<p class="ch-meta">课程 ' + byKind.course.length + " · 章节 " + byKind.chapter.length +
         " · 知识点 " + byKind.point.length + " · 题目 " + byKind.quiz.length + "</p></section>";

    if (!res.length) {
      h += '<section class="card empty"><div class="big">空</div>没有匹配内容。试试更短的关键词（如只用“指针”“TCP”“OTA”两个字），或换用英文术语。</section>';
      setApp(h);
      return;
    }
    ["course", "chapter", "point", "quiz"].forEach(function (k) {
      if (!byKind[k].length) return;
      h += '<div class="sec-title">' + kindName[k] + " <small>" + byKind[k].length + " 条</small></div>";
      byKind[k].slice(0, 40).forEach(function (it) {
        h += '<a class="s-item" href="' + it.href + '">';
        h += '<span class="s-kind k-' + k + '">' + kindName[k] + "</span>";
        h += '<span class="s-main"><span class="s-title">' + esc(it.title) + "</span>";
        h += '<span class="s-snip">' + esc(snippet(it.body, kw)) + "</span></span>";
        h += '<span class="s-from">' + esc(it.from) + "</span></a>";
      });
    });
    setApp(h);
  }

  /* ---------- 视图：薄弱点回顾 ---------- */
  function viewWeak() {
    setNav("weak");
    var h = '<a class="crumb" href="#/">‹ 全部课程</a>';

    /* 统计每个章节的作答情况 */
    var rows = [];
    COURSES.forEach(function (c) {
      c.chapters.forEach(function (ch) {
        var done = 0, ok = 0, bad = 0, wrongNow = 0;
        ch.quiz.forEach(function (q) {
          var a = store.ans[q.id];
          if (a) { done++; ok += a.ok; bad += a.bad; }
          if (store.wrong[q.id]) wrongNow++;
        });
        if (done > 0 || wrongNow > 0) {
          rows.push({ c: c, ch: ch, done: done, ok: ok, bad: bad, wrongNow: wrongNow,
                      errRate: (ok + bad) ? Math.round(bad * 100 / (ok + bad)) : 0 });
        }
      });
    });
    var weakCh = rows.filter(function (r) { return r.bad > 0; })
                     .sort(function (a, b) { return (b.wrongNow - a.wrongNow) || (b.errRate - a.errRate); });
    var untouched = [];
    COURSES.forEach(function (c) {
      var p = courseProgress(c);
      if (p.solved === 0) untouched.push({ c: c, total: p.total });
    });

    h += '<section class="card">';
    h += "<h1 style=\"margin:0 0 6px\">薄弱点回顾</h1>";
    h += '<p style="color:var(--ink2);font-size:14px;margin:0">按章节聚合你的答题记录：答错次数越多、错误率越高的章节越靠前。' +
         "<b>先补最上面三章</b>，比漫无目的地继续往后学效率高得多。</p>";
    if (!rows.length) {
      h += '<p class="ch-meta">还没有答题记录，先去任意一门课做几道题，这里就会显示你的薄弱章节。</p>';
    }
    h += "</section>";

    if (weakCh.length) {
      h += '<div class="sec-title">最需要补的章节 <small>按待清错题数排序</small></div>';
      h += '<div class="ch-list">';
      weakCh.slice(0, 12).forEach(function (r) {
        h += '<a class="ch-row' + (r.wrongNow === 0 ? " done" : "") + '" href="#/chapter/' + r.ch.id + '">';
        h += '<span class="ch-num">' + (r.wrongNow > 0 ? r.wrongNow : "✓") + "</span>";
        h += '<span class="ch-main"><span class="ch-title">' + esc(r.ch.title) + "</span>";
        h += '<span class="ch-brief" style="display:block">' + esc(r.c.title) + "</span>";
        h += '<span class="ch-meta" style="display:block">作答 ' + r.done + " 题 · 答对 " + r.ok + " 次 · 答错 " + r.bad + " 次 · 错误率 " + r.errRate + "%" +
             (r.wrongNow > 0 ? " · <b style=\"color:var(--bad)\">待清错题 " + r.wrongNow + "</b>" : " · 错题已清空") + "</span></span>";
        h += '<span class="ch-prog"><span class="pbar thin" style="flex:1"><i style="width:' + Math.max(3, r.errRate) + '%"></i></span><span>' + r.errRate + "%</span></span>";
        h += '<span class="ch-arrow">›</span></a>';
      });
      h += "</div>";
    }

    /* 阶段复盘：按课程给出完成度 */
    var started = [];
    COURSES.forEach(function (c) {
      var p = courseProgress(c);
      if (p.solved > 0) started.push({ c: c, p: p });
    });
    if (started.length) {
      h += '<div class="sec-title">阶段复盘 <small>各课程完成度</small></div>';
      h += '<div class="ch-list">';
      started.sort(function (a, b) { return b.p.pct - a.p.pct; }).forEach(function (x) {
        h += '<a class="ch-row' + (x.p.pct >= 100 ? " done" : "") + '" href="#/course/' + x.c.id + '">';
        h += '<span class="ch-num">' + x.p.pct + "%</span>";
        h += '<span class="ch-main"><span class="ch-title">' + esc(x.c.title) + "</span>";
        h += '<span class="ch-meta" style="display:block">已掌握 ' + x.p.solved + " / " + x.p.total + " 题" +
             (x.p.pct >= 100 ? " · <b style=\"color:var(--ok)\">已完成</b>" : "") + "</span></span>";
        h += '<span class="ch-prog"><span class="pbar thin" style="flex:1"><i style="width:' + x.p.pct + '%"></i></span></span>';
        h += '<span class="ch-arrow">›</span></a>';
      });
      h += "</div>";
    }

    if (untouched.length) {
      h += '<div class="sec-title">还没有开始的课程 <small>' + untouched.length + " 门</small></div>";
      h += '<div class="chip-row">';
      untouched.forEach(function (x) {
        h += '<a class="chip" href="#/course/' + x.c.id + '">' + esc(x.c.title) + "（" + x.total + " 题）</a>";
      });
      h += "</div>";
    }
    setApp(h);
  }

  /* ---------- 视图：错题本 ---------- */
  function viewWrong() {
    setNav("wrong");
    var ids = Object.keys(store.wrong).filter(function (id) { return QMAP[id]; });
    var h = '<a class="crumb" href="#/">‹ 学习路线</a>';
    h += '<section class="card"><h1 style="margin:0 0 6px">错题本</h1>' +
         '<p style="color:var(--ink2);font-size:14px;margin:0">答错过的题都在这里，重做并答对后自动移出。当前 ' + ids.length + " 题。</p></section>";
    if (ids.length === 0) {
      h += '<section class="card empty"><div class="big">空</div>错题本是空的，很棒。<br/>去学习路线里继续推进，或者来一次随机测验。</section>';
    } else {
      ids.forEach(function (id) {
        var q = QMAP[id];
        var c = courseById(q.chapter.courseId);
        h += questionCard(q, { showFrom: c.title + " · " + q.chapter.title });
      });
    }
    setApp(h);
  }

  /* ---------- 笔记与收藏 / 进度导出导入 ---------- */
  function viewNotes() {
    setNav("");
    var items = (window.Notes && window.Notes.all) ? window.Notes.all() : [];
    var h = '<a class="crumb" href="#/">‹ 回到首页</a>';
    h += '<section class="card"><h1>我的笔记与收藏</h1>';
    h += '<p style="color:var(--ink2);font-size:14px">收藏和笔记都存在本机浏览器。换设备请先导出再导入。</p>';
    h += '<div class="q-actions" style="margin-top:10px">';
    h += '<button type="button" class="btn small" id="btnExport">导出学习进度 JSON</button>';
    h += '<label class="btn ghost small" for="importFile">导入进度</label>';
    h += '<input type="file" id="importFile" accept="application/json" style="position:absolute;left:-9999px" />';
    h += '</div></section>';
    if (!items.length) {
      h += '<section class="card empty"><div class="big">空</div>还没有笔记。到章节里点「收藏」或在知识点下写笔记。</section>';
    } else {
      items.forEach(function (it) {
        h += '<section class="card">';
        h += '<div class="meta"><b>' + esc(it.title || it.key) + '</b>' + (it.fav ? ' <span class="pill">已收藏</span>' : '') + '</div>';
        if (it.note) h += '<p style="margin:8px 0 0;font-size:14px;line-height:1.7">' + esc(it.note) + '</p>';
        h += '<p class="meta" style="margin-top:8px"><a href="#/chapter/' + esc(it.ch) + '">去章节</a></p>';
        h += '</section>';
      });
    }
    setApp(h);
    var b = document.getElementById("btnExport");
    if (b) b.addEventListener("click", function () { exportProgress(); });
    var f = document.getElementById("importFile");
    if (f) f.addEventListener("change", function (e) { importProgress(e); });
  }
  function exportProgress() {
    try {
      var payload = {
        ver: 1,
        exportedAt: new Date().toISOString(),
        study: JSON.parse(localStorage.getItem("emb-study-v1") || "{}"),
        review: JSON.parse(localStorage.getItem("emb-review-v1") || "{}"),
        notes: JSON.parse(localStorage.getItem("emb-notes-v1") || "{}"),
        motivate: JSON.parse(localStorage.getItem("emb-motivate-v1") || "{}")
      };
      var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "emb-study-export-" + Date.now() + ".json";
      a.click();
      announce("进度已导出");
    } catch (e) {
      announce("导出失败");
      alert("导出失败：" + e.message);
    }
  }
  function importProgress(e) {
    var file = e && e.target && e.target.files && e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(String(reader.result || "{}"));
        if (data.study) localStorage.setItem("emb-study-v1", JSON.stringify(data.study));
        if (data.review) localStorage.setItem("emb-review-v1", JSON.stringify(data.review));
        if (data.notes) localStorage.setItem("emb-notes-v1", JSON.stringify(data.notes));
        if (data.motivate) localStorage.setItem("emb-motivate-v1", JSON.stringify(data.motivate));
        announce("进度已导入");
        location.reload();
      } catch (err) {
        alert("导入失败：文件格式不对");
      }
    };
    reader.readAsText(file);
  }
  function streakDays() {
    if (window.Motivate && window.Motivate.headerHTML) {
      var days = {};
      try { days = JSON.parse(localStorage.getItem("emb-study-v1") || "{}").days || {}; } catch (e) {}
      var n = 0;
      var d = new Date();
      function key(dt) {
        var m = dt.getMonth() + 1, day = dt.getDate();
        return dt.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (day < 10 ? "0" : "") + day;
      }
      var k = key(d);
      if (!days[k]) { d.setDate(d.getDate() - 1); k = key(d); }
      while (days[k]) {
        n++;
        d.setDate(d.getDate() - 1);
        k = key(d);
      }
      return n;
    }
    return 0;
  }

  function noteBarHTML(chId, pt) {
    if (!window.Notes) return "";
    var idx = pt.id ? String(pt.id).split(":")[1] || "1" : "1";
    var n = window.Notes.get(chId, idx);
    var h = '<div class="note-bar" data-note-ch="' + esc(chId) + '" data-note-idx="' + esc(idx) + '" data-note-title="' + esc(pt.t) + '">';
    h += '<button type="button" class="btn ghost small btn-fav' + (n.fav ? " on" : "") + '" data-fav="1">' + (n.fav ? "★ 已收藏" : "☆ 收藏") + '</button>';
    h += '<label class="sr-only" for="note-' + esc(chId) + '-' + esc(idx) + '">笔记</label>';
    h += '<input class="note-input" id="note-' + esc(chId) + '-' + esc(idx) + '" placeholder="写一句笔记…" value="' + esc(n.note || "") + '" />';
    h += '<button type="button" class="btn small" data-save-note="1">保存笔记</button>';
    h += '</div>';
    return h;
  }

  /* ---------- 视图：今日待复习（间隔重复） ---------- */
  function viewReview() {
    setNav("");
    var ids = (window.Review && window.Review.dueList) ? window.Review.dueList() : [];
    ids = ids.filter(function (id) { return QMAP[id]; });
    var h = '<a class="crumb" href="#/">‹ 回到首页</a>';
    h += '<section class="card">';
    h += '<h2 style="margin:0 0 6px">今日待复习</h2>';
    h += '<p style="color:var(--ink2);font-size:14px;margin:0">按 <b>1-3-7-15 天</b> 间隔把做过的题再过一遍。答对会升档、下次更久再见；答错会回档、很快再见。当前 <b>' + ids.length + "</b> 题到期。</p>";
    h += '<div class="q-actions" style="margin-top:10px">';
    if (ids.length) {
      h += '<a class="btn primary small" href="#/quiz/review">开始复习测验（最多 10 题）›</a>';
    }
    h += '<a class="btn ghost small" href="#/wrong">去错题本</a>';
    h += '<a class="btn ghost small" href="#/course/zero">去学新内容</a>';
    h += "</div></section>";
    if (ids.length === 0) {
      h += '<section class="card empty"><div class="big">✓</div>今天没有到期复习。<br/>去刷题或学新课，答对的题会自动排进复习队列。</section>';
    } else {
      h += '<div class="sec-title">到期队列 <small>从最急的开始</small></div>';
      ids.forEach(function (id) {
        var q = QMAP[id];
        var c = courseById(q.chapter.courseId);
        h += questionCard(q, { showFrom: c.title + " · " + q.chapter.title });
      });
    }
    setApp(h);
  }

  /* ---------- 视图：随机测验 ---------- */
  var currentQuiz = null;
  function viewQuiz(cid) {
    setNav("");
    /* 复习测验：从今日到期队列抽题 */
    if (cid === "review") {
      var due = (window.Review && window.Review.dueList) ? window.Review.dueList() : [];
      due = due.filter(function (id) { return QMAP[id]; });
      if (!due.length) { viewReview(); return; }
      var rpool = shuffle(due.map(function (id) { return QMAP[id]; })).slice(0, 10);
      currentQuiz = {
        course: { id: "review", title: "今日复习" },
        pool: rpool, i: 0, ok: 0, total: rpool.length, isReview: true
      };
      renderQuizQ();
      return;
    }
    var c = courseById(cid);
    if (!c) { viewHome(); return; }
    var pool = [];
    c.chapters.forEach(function (ch) { pool = pool.concat(ch.quiz); });
    pool = shuffle(pool).slice(0, Math.min(10, pool.length));
    currentQuiz = { course: c, pool: pool, i: 0, ok: 0, total: pool.length };
    renderQuizQ();
  }
  function renderQuizQ() {
    var s = currentQuiz;
    var q = s.pool[s.i];
    var h = '<section class="card quiz-head">';
    if (s.isReview) {
      h += '<a class="crumb" href="#/review">‹ 今日待复习</a>';
      h += "<h2>复习测验 · 间隔重复</h2>";
    } else {
      h += '<a class="crumb" href="#/course/' + s.course.id + '">‹ ' + esc(s.course.title) + "</a>";
      h += "<h2>随机测验 · " + esc(s.course.title) + "</h2>";
    }
    h += '<div class="pbar"><i style="width:' + pct(s.i, s.total) + '%"></i></div>';
    h += '<p class="quiz-meta">第 ' + (s.i + 1) + " / " + s.total + " 题 · 已答对 " + s.ok + " 题</p>";
    h += "</section>";
    h += '<div id="quizBox">' + questionCard(q, {}) + "</div>";
    setApp(h);
  }
  function renderQuizResult() {
    var s = currentQuiz;
    var p = pct(s.ok, s.total);
    var sub = p >= 90 ? "非常扎实，可以进入下一门课了。" :
              p >= 70 ? "掌握得不错，错题记得回炉。" :
              p >= 60 ? "刚过及格线，把错题本清一清再继续。" :
              "基础还不够牢，建议回章节里把知识点重读一遍。";
    var h = '<section class="card quiz-result">';
    if (s.isReview) {
      h += '<a class="crumb" href="#/review">‹ 今日待复习</a>';
    } else {
      h += '<a class="crumb" href="#/course/' + s.course.id + '">‹ ' + esc(s.course.title) + "</a>";
    }
    h += '<div class="score">' + s.ok + " / " + s.total + "</div>";
    h += '<div class="sub">正确率 ' + p + "% · " + sub + "</div>";
    h += '<div class="q-actions" style="justify-content:center">';
    h += '<button type="button" class="btn small btn-requiz" data-course="' + s.course.id + '">再来一组</button>';
    h += '<a class="btn ghost small" href="#/wrong">查看错题本</a>';
    if (s.isReview) h += '<a class="btn ghost small" href="#/review">回到复习队列</a>';
    else h += '<a class="btn ghost small" href="#/course/' + s.course.id + '">返回课程</a>';
    h += "</div></section>";
    setApp(h);
  }

  /* ---------- 答题钩子（测验模式下追加“下一题”按钮） ---------- */
  var answerHook = null;
  function setupQuizHook() {
    answerHook = function (q, ok) {
      if (!currentQuiz) return;
      if (ok) currentQuiz.ok++;
      var box = $("#quizBox");
      if (!box) return;
      var fb = box.querySelector(".q-feedback");
      if (!fb) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn small btn-next";
      btn.textContent = currentQuiz.i + 1 < currentQuiz.total ? "下一题 ›" : "查看结果";
      fb.appendChild(btn);
    };
  }

  /* ---------- 顶栏数据 ---------- */
  function refreshChrome() {
    var solved = 0;
    ALLQ.forEach(function (q) { if (isSolved(q)) solved++; });
    var el = document.getElementById("globalPct");
    if (el) el.textContent = pct(solved, ALLQ.length) + "%";
    /* 激励徽章：等级 + 连胜 */
    try {
      var mh = document.getElementById("motivateChip");
      if (mh && window.Motivate && window.Motivate.headerHTML) mh.innerHTML = window.Motivate.headerHTML();
    } catch (e) {}
    var badge = document.getElementById("wrongCount");
    if (badge) {
      var n = Object.keys(store.wrong).length;
      badge.textContent = n;
      badge.hidden = n === 0;
    }
    /* 顶栏的同步状态小徽标：未登录显示「登录同步」，登录后显示同步中/已同步/失败 */
    var chip = document.getElementById("csChip");
    if (chip && window.CloudSync && window.CloudSync.statusChipHTML) {
      chip.innerHTML = window.CloudSync.statusChipHTML();
    }
  }

  /* ---------- 面试训练中心 ---------- */
  function viewInterview() {
    setNav("interview");
    var c = courseById("ivx");
    if (!c) { viewHome(); return; }
    var h = '<a class="crumb" href="#/">‹ 全部课程</a>';
    h += '<section class="card hero"><span class="course-badge cb-iv">面试</span>';
    h += '<h1>嵌入式面试训练中心</h1>';
    h += '<p>不要只背答案。按真实面试顺序训练：<b>笔试 → 手写代码 → 技术问答 → 连续追问 → 项目深挖 → 故障排查 → 系统设计</b>。</p>';
    h += '<div class="note-box"><b>统一答题方法</b><ol><li>先说结论和定义</li><li>结合项目或运行场景</li><li>补充边界、异常和资源限制</li><li>说明如何验证，而不是只说“加日志”</li></ol></div>';
    h += '<div class="q-actions"><a class="btn small" href="#/quiz/ivx">开始随机面试测验</a><a class="btn ghost small" href="#/course/ivx">进入完整课程</a></div></section>';
    h += '<div class="sec-title">面试环节范围 <small>每个环节都有对应训练</small></div>';
    h += '<div class="course-grid">';
    [{n:"笔试基础",d:"C、数据结构、ARM、Linux、网络和 RTOS 高频题",u:"先建立知识底座"},{n:"在线编程 / 手撕代码",d:"环形队列、协议解析、位操作、边界检查",u:"先写再看参考实现"},{n:"技术问答与追问",d:"定义、场景、底层原因、反例和取舍",u:"训练两分钟表达"},{n:"项目深挖",d:"职责、架构、数据流、故障、测试证据",u:"必须说清自己做了什么"},{n:"故障排查",d:"HardFault、死锁、乱码、OTA、断网和功耗",u:"按现象—假设—验证—修复"},{n:"系统设计",d:"采集系统、通信状态机、OTA、日志和可靠性",u:"覆盖正常、失败、恢复"}].forEach(function (x) {
      h += '<a class="course-card" href="#/course/ivx"><span class="course-badge cb-iv">面试</span><h3>' + esc(x.n) + '</h3><p class="desc">' + esc(x.d) + '</p><div class="meta">' + esc(x.u) + '</div><span class="go">开始训练 ›</span></a>';
    });
    h += '</div><div class="sec-title">五个专项章节 <small>按顺序推进</small></div><div class="ch-list">';
    c.chapters.forEach(function (ch, i) {
      h += '<a class="ch-row" href="#/chapter/' + ch.id + '"><span class="ch-num">' + (i + 1) + '</span><span class="ch-main"><span class="ch-title">' + esc(ch.title) + '</span><span class="ch-brief" style="display:block">' + esc(ch.brief) + '</span><span class="ch-meta" style="display:block">' + ch.quiz.length + ' 道题 · 含编程任务与参考解析</span></span><span class="ch-arrow">›</span></a>';
    });
    h += '</div>';
    setApp(h);
  }

  /* ---------- 模拟面试：先答、保存、再看评分要点 ---------- */
  var MOCK_KEY = "emb-mock-interview-v1";
  var MOCKS = [
    { id: "m1", stage: "技术一面 · C/嵌入式", q: "请解释 volatile 的作用、三个常见使用场景，以及它不能解决什么问题。", rubric: "应包含：禁止编译器消除或合并访问；寄存器、中断共享变量、并发共享变量；不能提供原子性、互斥和完整线程安全。" },
    { id: "m2", stage: "故障排查面", q: "设备运行几小时后看门狗复位，你会如何从现象开始定位？请按假设—验证顺序回答。", rubric: "应包含：保存复位原因和现场；区分任务卡死、内存泄漏、队列积压和喂狗设计问题；用心跳、资源水位、队列水位和长稳测试验证。" },
    { id: "m3", stage: "项目深挖面", q: "介绍一个你做过的嵌入式项目，并说明你本人负责的模块、一次故障和最终测试证据。", rubric: "应包含：背景目标、个人职责、架构/数据流、关键难点、异常处理、可复现测试条件和量化结果。" },
    { id: "m4", stage: "RTOS / 系统设计面", q: "设计一个多任务传感器采集系统，说明任务划分、ISR 边界、数据所有权、同步方式和队列满时的处理。", rubric: "应包含：ISR 不阻塞；采集/解析/上报分工；缓冲区所有权；同步原语选择；超时、丢弃、背压和故障统计。" },
    { id: "m5", stage: "综合追问面", q: "你的 OTA 方案如何保证升级断电后还能启动？新版本启动后如何确认健康并回滚？", rubric: "应包含：完整性或签名校验、A/B 或备用镜像、试运行标志、启动计数、自检确认、失败回滚和随机断电验证。" }
  ];
  function mockStore() { try { return JSON.parse(localStorage.getItem(MOCK_KEY) || "{}") || {}; } catch (e) { return {}; } }
  function viewMockInterview() {
    setNav("mock");
    var saved = mockStore(), answered = 0, rated = 0;
    MOCKS.forEach(function (x) { if (saved[x.id] && saved[x.id].answer) answered++; if (saved[x.id] && saved[x.id].rating) rated++; });
    var h = '<a class="crumb" href="#/interview">‹ 面试训练中心</a><section class="card hero"><span class="course-badge cb-iv">实战</span><h1>模拟面试</h1><p>先独立回答，再保存并查看评分要点。建议每题限时 3～8 分钟，回答必须包含<b>结论、场景、边界和验证证据</b>。</p><div class="note-box"><b>当前形式</b><p>这是“自我录入 + 结构化复盘”，不会假装替代真人面试官。保存后可交给 AI 或真人二次点评。</p></div><div class="stat"><b>已回答 ' + answered + ' / ' + MOCKS.length + '</b><div class="pbar"><i style="width:' + Math.round(answered / MOCKS.length * 100) + '%"></i></div><span class="quiz-meta">已自评 ' + rated + ' 题</span></div></section>';
    MOCKS.forEach(function (x, i) {
      var a = saved[x.id] || {};
      h += '<section class="card mock-card" data-mock-id="' + x.id + '"><div class="q-head"><span class="q-type t-code">' + esc(x.stage) + '</span><span class="q-index">第 ' + (i + 1) + ' 题</span></div><h3>' + esc(x.q) + '</h3><textarea class="mock-answer" rows="7" placeholder="先自己回答，不要急着看要点…">' + esc(a.answer || '') + '</textarea><div class="q-actions"><button type="button" class="btn small btn-save-mock">保存回答</button><button type="button" class="btn ghost small btn-show-rubric">查看评分要点</button></div><div class="mock-feedback" hidden><div class="fb fb-sol"><b>评分要点</b><p>' + esc(x.rubric) + '</p><p>自评：定义是否准确？是否结合项目？是否覆盖失败路径？是否给出验证证据？</p><div class="mock-rate"><span>给自己评分：</span><button type="button" class="btn ghost small btn-rate" data-rate="1">1</button><button type="button" class="btn ghost small btn-rate" data-rate="2">2</button><button type="button" class="btn ghost small btn-rate" data-rate="3">3</button><button type="button" class="btn ghost small btn-rate" data-rate="4">4</button><button type="button" class="btn ghost small btn-rate" data-rate="5">5</button></div></div></div></section>';
    });
    setApp(h);
  }

  /* ---------- 路由 ---------- */
  /* ---------- 视图：知识地图 ----------
     目的：把「知识点之间的隐性依赖」画出来，解决前后知识脱节。
     呈现取舍：不用力导向图那类炫技可视化——对学习者没用，还看不清。
     改用**分层清单 + 关联胶囊**：
       · 顶部统计：有多少知识点、多少条关联，你的掌握度
       · 按课程分组，每组内按章节顺序列出知识点
       · 每个知识点显示「前置 N / 下游 M」，点击展开看具体是什么、可跳转
       · 支持只看「已建立关联的」和全部课程筛选
     这样一眼能看出「我要学 X，得先会 Y」，也能看出「Y 学了之后在哪用得上」。 */
  var MAP_FILTER = { onlyLinked: true, q: "" };

  function kpHasLinks(p) {
    return (p.kp && p.kp.length) || (p.next && p.next.length) || (p.vs && p.vs.length) ||
           (buildNextMap()[p.id] || []).length;
  }
  /* 某个知识点是否「已掌握」：本章题目全部答对视为掌握（与章节完成口径一致） */
  function kpMastered(p) {
    var ch = p.chapter;
    if (!ch || !ch.qTotal) return false;
    var s = 0;
    ch.quiz.forEach(function (q) { if (isSolved(q)) s++; });
    return s >= ch.qTotal;
  }

  function viewMap() {
    setNav("map");
    /* 统计 */
    var linked = 0, edgeCount = 0, vsCount = 0, coursesWithData = {};
    var nm = buildNextMap();
    ALLP.forEach(function (p) {
      if (kpHasLinks(p)) { linked++; coursesWithData[p.course.id] = 1; }
      edgeCount += (p.kp || []).length;
      vsCount += (p.vs || []).length;
    });
    var coursesWithCourses = Object.keys(coursesWithData).length;

    var h = '<a class="crumb" href="#/">‹ 全部课程</a>';
    h += '<section class="card hero">';
    h += "<h1>知识地图</h1>";
    h += "<p>学不动的常见原因不是笨，是<b>不知道这块知识挂在哪儿</b>：它依赖什么、学完能用在哪、和哪个概念容易搞混。这一页把这三件事显式列出来，全部可点击跳转。</p>";
    h += '<div class="map-stat">';
    h += '<div><b>' + ALLP.length + "</b><span>全站知识点</span></div>";
    h += '<div><b>' + linked + "</b><span>已建立关联</span></div>";
    h += '<div><b>' + edgeCount + "</b><span>前置关系</span></div>";
    h += '<div><b>' + vsCount + "</b><span>易混淆对</span></div>";
    h += "</div>";
    h += '<p class="map-note">关联目前覆盖 <b>' + coursesWithCourses + "</b> 门课（" +
         (linked ? Math.round(linked / ALLP.length * 100) : 0) +
         "% 的知识点）。这是一项持续补齐的工作——<b>优先补最容易被卡住的课程</b>（C 语言、指针、数据结构、Linux、C++、Qt），再逐步铺开。</p>";
    h += "</section>";

    /* 计数口径：这张表只统计「关联区」的规模，不重复计入章节题的掌握度 */
    var linkedCourses = COURSES.filter(function (c) { return coursesWithData[c.id]; });

    /* 筛选栏 */
    h += '<div class="map-bar">';
    h += '<label class="map-toggle"><input type="checkbox" id="mapOnlyLinked"' +
         (MAP_FILTER.onlyLinked ? " checked" : "") + ' /><span>只看已建立关联的知识点</span></label>';
    h += '<input class="map-search" id="mapSearch" type="search" placeholder="过滤知识点关键词…" value="' +
         esc(MAP_FILTER.q) + '" />';
    h += "</div>";

    /* 按课程分组渲染 */
    var totalShown = 0;
    linkedCourses.forEach(function (c) {
      /* 本章内按顺序列出；受筛选条件控制 */
      var groups = [];
      c.chapters.forEach(function (ch) {
        var pts = ch.points.filter(function (p) {
          if (MAP_FILTER.onlyLinked && !kpHasLinks(p)) return false;
          if (MAP_FILTER.q) {
            var kw = MAP_FILTER.q.toLowerCase();
            var hay = (p.t + " " + stripTags(p.h)).toLowerCase();
            if (hay.indexOf(kw) < 0) return false;
          }
          return true;
        });
        if (pts.length) groups.push({ ch: ch, pts: pts });
      });
      if (!groups.length) return;

      var cLinked = 0;
      c.chapters.forEach(function (ch) {
        ch.points.forEach(function (p) { if (kpHasLinks(p)) cLinked++; });
      });
      h += '<div class="group-title"><h2>' + esc(c.title) + "</h2><span>" +
           cLinked + " / " + c.chapters.reduce(function (a, ch) { return a + ch.points.length; }, 0) +
           " 个知识点已有：关联</span></div>";

      groups.forEach(function (g) {
        h += '<div class="map-chap"><b>' + esc(g.ch.title) + "</b></div>";
        h += '<div class="map-grid">';
        g.pts.forEach(function (p) {
          totalShown++;
          var pre = (p.kp || []).filter(pointById);
          var down = downstreamOf(p).filter(pointById);
          var vs = p.vs || [];
          var done = kpMastered(p);
          h += '<details class="map-card' + (done ? " done" : "") + '">';
          h += "<summary>";
          h += '<span class="map-kp-t">' + esc(p.t) + "</span>";
          h += '<span class="map-badges">';
          if (pre.length) h += '<i class="mb mb-pre">前置 ' + pre.length + "</i>";
          if (down.length) h += '<i class="mb mb-next">下游 ' + down.length + "</i>";
          if (vs.length) h += '<i class="mb mb-vs">易混 ' + vs.length + "</i>";
          if (done) h += '<i class="mb mb-done">已掌握</i>';
          h += "</span></summary>";
          h += '<div class="map-card-body">';
          if (p.why) h += '<p class="map-why"><b>为什么要学</b>' + esc(p.why) + "</p>";
          if (pre.length) {
            h += '<div class="kp-row kp-pre"><b>前置知识</b><div class="kp-list">' +
                 pre.map(kpChip).join("") + "</div></div>";
          }
          if (down.length) {
            h += '<div class="kp-row kp-next"><b>往下会用到</b><div class="kp-list">' +
                 down.map(kpChip).join("") + "</div></div>";
          }
          if (vs.length) {
            h += '<div class="kp-row kp-vs"><b>别搞混</b><div class="kp-vs-list">';
            vs.forEach(function (v) {
              h += '<div class="kp-vs-item"><span class="kp-vs-name">' + esc(v.t) + "</span>" +
                   '<span class="kp-vs-d">' + esc(v.d) + "</span></div>";
            });
            h += "</div></div>";
          }
          h += '<div class="map-go"><a class="btn ghost small" href="#/chapter/' + p.chapter.id +
               '">去读这一节 ›</a></div>';
          h += "</div></details>";
        });
        h += "</div>";
      });
    });

    if (!totalShown) {
      h += '<section class="card empty"><div class="big">·</div>' +
           (MAP_FILTER.q ? "没有匹配的知识点，换个关键词试试。" : "当前筛选下没有内容，取消「只看已建立关联」试试。") +
           "</section>";
    }
    setApp(h);
  }

  /* ---------- 视图：页面不存在 ----------
     以前未知 hash 会静默回落到首页，用户以为「点错了」却得不到任何反馈，
     链接过期时也查不出原因。现在明确告诉他不存在，并给出三个去处。 */
  function viewNotFound(hash) {
    setNav("");
    setApp('<a class="crumb" href="#/">‹ 回到首页</a>' +
      '<section class="card empty"><div class="big">?</div>' +
      "<h1>没有这个页面</h1>" +
      '<p style="color:var(--ink2);font-size:14px">地址 <code>#/' + esc(hash) + "</code> 不存在——" +
      "可能是链接过期，或者课程 / 章节被改名了（章节 id 改名会同时让旧链接失效）。</p>" +
      '<p class="nf-links"><a class="btn small" href="#/">全部学科</a>' +
      '<a class="btn small" href="#/map">知识地图</a>' +
      '<a class="btn small" href="#/search">搜索全站</a>' +
      '<a class="btn small" href="#/wrong">错题本</a></p></section>');
  }

  /* ---------- 视图：使用说明（写给完全没有技术背景的人） ----------
     设计原则（改这一页时请守住）：
       1. 不出现"知识点""断言""调用栈"这类词 —— 出现了就必须在同页解释清楚
       2. 每个术语都翻译成"它其实就是" + "你该怎么用"
       3. 先回答"我该干什么"，再解释"每个按钮是什么"
       4. 不用"详见图表""参见文档"这类把人推走的话，答案直接写在页面上 */
  function viewHelp() {
    setNav("");
    var h = '<a class="crumb" href="#/">‹ 回到首页</a>';

    h += '<section class="card">';
    h += "<h1>使用说明（写给完全没接触过编程的你）</h1>";
    h += '<p class="lead">用一句话说：这是一个<b>能自己练的电子课本</b>。' +
         "不用装任何软件，打开网页就能读、能做题、并且<b>马上知道自己做得对不对</b>。</p>";
    h += '<div class="note-box goal-box"><b>完全不懂电脑技术，能用吗？</b>' +
         "<p>能。里面有一门课叫《C 语言零基础精讲》，它是从「什么是变量」这种最基础的地方讲起的，" +
         "默认你什么都不会。你不需要提前准备任何东西。</p></div>";
    h += "</section>";

    h += '<div class="sec-title">第一次来，按这 3 步走</div>';
    h += '<div class="steps-3">';
    h += '<div class="step-card"><span class="step-no">1</span><b>花两分钟看完这一页</b>' +
         "<span>知道每个按钮是干什么的，后面就不会点错。</span></div>";
    h += '<div class="step-card"><span class="step-no">2</span><b>点下面的按钮开始第一课</b>' +
         "<span>从最基础的那门课开始，一次只学一小节（大约 15 分钟）。</span></div>";
    h += '<div class="step-card"><span class="step-no">3</span><b>读完一小节就做几道题</b>' +
         "<span>做错了不要紧，会自动收进「错题本」，隔天再做一次就好。</span></div>";
    h += "</div>";
    h += '<p class="cta-row"><a class="btn primary big" href="#/course/zero">从零开始学第一课 ›</a>' +
         '<a class="btn big" href="#/">先看看全部课程</a></p>';
    h += '<div class="note-box"><b>想在电脑和手机之间接着学？</b>' +
         "<p>用邮箱注册一个账号登录就行，两边的进度会自动合到一起。" +
         "这一步<b>可以以后再做</b> —— 不登录也能正常学，只是进度只留在这台设备上。</p>" +
         '<p class="cta-row"><a class="btn small" href="#/account">去登录 / 注册（可选）</a></p></div>';

    h += '<div class="sec-title">页面上的词都是什么意思（人话版）</div>';
    h += '<section class="card"><p class="hint-line">看到看不懂的词，回到这一页查一下就行。</p>';
    h += '<div class="glossary">';
    var TERMS = [
      ["课程 / 章节 / 知识点", "一本书 / 书里的一章 / 章里的一小段", "一段一段往下读就行，不用跳"],
      ["学科", "一个大方向，比如「编程基础」「硬件」「求职」", "不用特意管，首页会自动帮你分好"],
      ["能力等级 L0~L5", "你现在大概学到哪一步了。L0 是什么都不会，L5 是能教别人", "从 L0 开始，不用怕起点低"],
      ["主线能力阶梯", "一张「从零到会」的路线图，每级都列了对应的课", "找到自己那一级，直接点进去"],
      ["例题精讲", "老师先带你做一遍的示范题", "先按里面的提示自己想一想，再看推导"],
      ["练习 / 练习题", "自己动手做的题", "做完点「提交答案」"],
      ["编程任务", "需要你自己写一小段代码的题", "先自己写，写不出再点「看标准答案」"],
      ["实验室", "在网页里直接试跑代码的地方（像个小沙盘）", "不用装任何软件，点开就能试"],
      ["检查我写的对不对", "自动帮你打分，并告诉你哪一条没过", "写完点一下，错了会显示「你写的」和「应该的」"],
      ["标准答案", "参考答案。想不出来时才点开", "先自己试，实在不行再看"],
      ["错题本", "做错的题会自动收到这里", "隔天回来重做，做对了就自动移走"],
      ["哪里还不熟", "把你做错的题按章节归好，看出哪一块最弱", "不知道学什么时，先看这里"],
      ["知识地图", "知识点之间的先后关系图", "想知道「学这个之前要先会什么」时看"],
      ["想找什么工作", "按就业方向排好的学习顺序", "有明确目标时按这个顺序学"],
      ["前置", "学这一段之前，最好先会什么", "卡住了就点回去补，很正常"],
      ["别搞混", "两个容易混淆的概念的对比", "记混的时候专门看这一段"],
      ["登录 / 我的账号", "注册一个账号，让电脑和手机共用同一份进度", "想换设备学的时候再登录，不登录也能正常学"],
      ["同步", "把几台设备上的学习记录合起来，让它们看起来是一样的", "登录后自动做，不用你手动操作"],
      ["验证码", "发到你邮箱里的一串数字，用来确认「这个邮箱是你的」", "收到后填进网页里就行"]
    ];
    TERMS.forEach(function (t) {
      h += '<div class="gl-row"><span class="gl-term">' + esc(t[0]) + "</span>" +
           '<span class="gl-mean">' + esc(t[1]) + "</span>" +
           '<span class="gl-use">' + esc(t[2]) + "</span></div>";
    });
    h += "</div></section>";

    h += '<div class="sec-title">常见疑问</div>';
    h += '<section class="card"><div class="faq">';
    var FAQ = [
      ["一次要学多久？", "建议一次一小节（约 15 分钟）+ 5 道题。宁可每天一点点，也不要一次看三小时然后一周不打开。"],
      ["做错了会怎么样？", "不会扣分，也没有人会看到。错题会自动收进「错题本」，隔天重做一遍，做对就自动移出。"],
      ["要背很多东西吗？", "不用。重点是「能看懂、能动手写出来」。读不懂的地方就回去看例题，例题是手把手讲的。"],
      ["需要装编程软件吗？", "做题不需要。网站里的「实验室」能直接在网页上跑代码。只有 C++ 和 Qt 那部分需要在你自己的电脑上操作，那些地方会写清楚每一步怎么做。"],
      ["我的学习进度会丢吗？", "不登录的话，进度存在你这台设备的浏览器里 —— 换电脑、换浏览器或清理浏览器数据就会看不到。所以别轻易点底部的「重置全部进度」。"],
      ["我有电脑也有手机，能一起用吗？", "能。到「我的账号」用邮箱注册并登录，电脑和手机登录同一个邮箱，两边的进度会自动合到一起：做过的题加在一起，错题本按最后一次的结果算，不会互相覆盖。不登录也能正常学，只是进度只留在这台设备上。"],
      ["登录会不会很麻烦？", "不会，只要一个邮箱。填邮箱 → 收一封验证码邮件 → 填进网页就能登录，不用记密码（也可以顺手设一个）。没有账号的在同一个页面就能注册。"],
      ["看不懂某个专业词怎么办？", "回到这一页从上往下找一遍。上面那张表就是为此准备的。找不到的话说明这个词该补进表格，可以告诉维护的人。"],
      ["学完这些能干什么？", "看「想找什么工作」那一页，每条方向都写清了「学完能做到什么」和「面试会问什么」。"]
    ];
    FAQ.forEach(function (f) {
      h += '<details class="faq-item"><summary>' + esc(f[0]) + "</summary><p>" + esc(f[1]) + "</p></details>";
    });
    h += "</div></section>";

    h += '<section class="card"><p class="hint-line">还想更详细地了解这个网站是怎么组织的？' +
         '可以看首页底部的「怎么用这个站」，那里写的是给有基础的人看的版本。</p></section>';
    setApp(h);
    return h;
  }

  /* ---------- 视图：我的账号 ----------
     页面的渲染与交互都由 cloud-sync.js 负责，这里只提供容器。
     分开的好处：登录相关的代码集中在一处，改动不会牵连主程序。 */
  function viewAccount() {
    var inner = (window.CloudSync && window.CloudSync.renderAccountHTML)
      ? window.CloudSync.renderAccountHTML()
      : '<section class="card"><h2>我的账号</h2><p>云同步组件没有加载，暂时无法使用登录。</p></section>';
    var h = '<a class="crumb" href="#/">‹ 学习路线</a>';
    h += '<div id="csAccount">' + inner + "</div>";
    setApp(h);
  }

  /* ---------- 视图：想找什么工作（岗位能力地图） ----------
     这一页要回答三个很具体的问题：
       ① 有哪些方向可选，各自的薪资量级大概在什么位置；
       ② 每个方向要哪些能力，站内哪门课对应（直接可点）；
       ③ 我还要补什么（包括站内确实没覆盖的部分，如实说）。
     薪资数字一律标注性质并附免责说明 —— 把估算当权威数据是最容易误导人的做法。 */
  function viewJobs() {
    setNav("jobs");
    var M = window.JOB_MAP;
    if (!M) {
      setApp('<section class="card"><h2>想找什么工作</h2><p>岗位数据没有加载。</p></section>');
      return;
    }

    var h = '<a class="crumb" href="#/">‹ 全部课程</a>';
    h += '<section class="card">';
    h += '<span class="course-badge cb-job">就业</span>';
    h += '<h1 style="margin:8px 0 6px;font-size:23px">想找什么工作：把「学会」接上「高薪岗位」</h1>';
    h += '<p style="color:var(--ink2);font-size:14.5px;margin:0 0 12px">' +
         "同样叫「嵌入式工程师」，有人月薪 8K、有人 30K。差别不在努力程度，而在三件可以主动选择的事：" +
         "<b>会不会操作系统</b>、<b>做的产品要求多高的可靠性</b>、<b>站在供应链的哪个位置</b>。" +
         "这一页把六个方向摆在一起，让你先看清地图再走路。</p>";
    h += '<div class="note-box warn-box"><b>先说清楚：下面薪资数字的性质</b><p>' + esc(M.disclaimer) + "</p></div>";
    h += '<p class="cta-row"><a class="btn primary" href="#/course/job">读《就业与高薪岗位》这门课 ›</a>' +
         '<a class="btn" href="#/route/mcu">看岗位路线的学习顺序</a></p>';
    h += "</section>";

    /* ---- 薪资量级表 ---- */
    h += '<div class="sec-title">六个方向的薪资量级 <small>一线城市 · 仅用于建立量级感</small></div>';
    h += '<section class="card"><div class="band-table">';
    h += '<div class="band-row band-head"><span>方向</span><span>应届</span><span>3~5 年</span><span>更资深</span></div>';
    M.bands.forEach(function (b) {
      var dash = "—";
      h += '<div class="band-row">';
      h += "<span><b>" + esc(b.name) + "</b></span>";
      h += "<span>" + (b.fresh ? esc(b.fresh) : dash) + "</span>";
      h += "<span>" + (b.mid ? esc(b.mid) : dash) + "</span>";
      h += "<span>" + (b.senior ? esc(b.senior) : dash) + "</span>";
      h += "</div>";
      h += '<div class="band-note">' + esc(b.note) + "</div>";
    });
    h += "</div></section>";

    /* ---- 地域与公司类型：两个「不努力也能改变」的变量 ---- */
    h += '<div class="sec-title">另外两个影响很大的变量 <small>换城市或换公司类型，比多学一个框架影响更大</small></div>';
    h += '<section class="card">';
    h += '<div class="map-sub">岗位集中的城市</div><div class="city-grid">';
    M.cities.forEach(function (c) {
      h += '<div class="city-card"><b>' + esc(c.name) + "</b><span>" + esc(c.note) + "</span></div>";
    });
    h += "</div>";
    h += '<div class="map-sub">公司类型的排序</div>';
    h += '<p class="tier-line">' + M.tiers.order + "</p>";
    h += '<p class="hint-line">' + esc(M.tiers.note) + "</p>";
    h += "</section>";

    /* ---- 岗位能力地图：每个方向一张卡 ---- */
    h += '<div class="sec-title">岗位能力地图 <small>点能力标签直接跳到对应课程</small></div>';
    M.jobs.forEach(function (j) {
      h += '<section class="card job-map-card">';
      h += '<div class="jm-head"><b>' + esc(j.name) + "</b>";
      if (j.route) h += '<a class="btn small" href="#/route/' + esc(j.route) + '">看这条路的课程顺序</a>';
      h += "</div>";
      h += '<p class="jm-entry">' + esc(j.entry) + "</p>";
      h += '<div class="map-sub">要哪些能力（点击进入课程）</div>';
      h += '<div class="chip-row">';
      j.skills.forEach(function (s) {
        h += '<a class="chip" href="#/course/' + esc(s.c) + '">' + esc(s.s) + "</a>";
      });
      h += "</div>";
      h += '<div class="jm-two">';
      h += '<div><div class="map-sub">拿什么证明（作品集）</div><ul class="jm-list">';
      j.portfolio.forEach(function (x) { h += "<li>" + esc(x) + "</li>"; });
      h += "</ul></div>";
      h += '<div><div class="map-sub">面试会问到</div><ul class="jm-list">';
      j.ask.forEach(function (x) { h += "<li>" + esc(x) + "</li>"; });
      h += "</ul></div>";
      h += "</div>";
      h += '<p class="jm-gap"><b>容易卡住的地方：</b>' + esc(j.gap) + "</p>";
      h += "</section>";
    });

    /* ---- 如实标注的内容缺口 ---- */
    h += '<div class="sec-title">这门站还没有覆盖的方向 <small>如实列出，不假装完整</small></div>';
    h += '<section class="card"><ul class="jm-list">';
    M.gaps.forEach(function (g) {
      h += "<li><b>" + esc(g.what) + "</b> —— " + esc(g.why) + "</li>";
    });
    h += "</ul>";
    h += '<p class="hint-line">知道缺口在哪，比以为全都学了更安全：面试被问到不会的东西，诚实说明比硬答更能得分。</p>';
    h += "</section>";

    setApp(h);
  }

  function route() {
    answerHook = null;
    currentQuiz = null;
    closeNavMenu();   /* 跳转后收起窄屏的折叠菜单，否则面板会盖在新页面上 */
    var h = location.hash.replace(/^#\/?/, "");
    var seg = h.split("/");
    if (seg[0] === "" || seg[0] === undefined) viewHome();
    else if (seg[0] === "help") viewHelp();
    else if (seg[0] === "account") viewAccount();
    else if (seg[0] === "jobs") viewJobs();
    else if (seg[0] === "subject" && seg[1]) viewSubject(seg[1]);
    else if (seg[0] === "course" && seg[1]) viewCourse(seg[1]);
    else if (seg[0] === "chapter" && seg[1]) viewChapter(seg[1]);
    else if (seg[0] === "wrong") viewWrong();
    else if (seg[0] === "review") viewReview();
    else if (seg[0] === "notes") viewNotes();
    else if (seg[0] === "cheatsheet" && seg[1]) cheatSheet(seg[1]);
    else if (seg[0] === "export") { exportProgress(); viewNotes(); }
    else if (seg[0] === "weak") viewWeak();
    else if (seg[0] === "route" && seg[1]) viewRoute(seg[1]);
    else if (seg[0] === "interview") viewInterview();
    else if (seg[0] === "mock-interview") viewMockInterview();
    else if (seg[0] === "map") viewMap();
    else if (seg[0] === "search") viewSearch(decodeURIComponent(seg.slice(1).join("/")));
    else if (seg[0] === "lab") viewLab();
    else if (seg[0] === "quiz" && seg[1]) { setupQuizHook(); viewQuiz(seg[1]); }
    else if (seg[0]) viewNotFound(seg.join("/"));   /* 有地址但认不出来：明确报「不存在」 */
    else viewHome();                                 /* 空 hash：正常回首页 */
  }

  /* ---------- 视图：虚拟实验室 ---------- */
  function viewLab() {
    setNav("lab");
    if (!window.Lab) { setApp('<section class="card empty"><div class="big">!</div>虚拟实验室脚本未加载。</section>'); return; }
    setApp(window.Lab.html());
    window.Lab.init(document.getElementById("app"));
  }

  /* ---------- 全局事件（事件委托） ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target;
    /* 笔记与收藏 */
    if (t.id === "btnToTop" || (t.closest && t.closest("#btnToTop"))) {
      window.scrollTo(0, 0);
      announce("已回到顶部");
      return;
    }
    var fav = t.closest ? t.closest(".btn-fav") : null;
    if (fav && window.Notes) {
      var bar = fav.closest(".note-bar");
      if (bar) {
        var on = window.Notes.toggleFav(bar.getAttribute("data-note-ch"), bar.getAttribute("data-note-idx"), bar.getAttribute("data-note-title"));
        fav.textContent = on ? "★ 已收藏" : "☆ 收藏";
        fav.classList.toggle("on", on);
        announce(on ? "已收藏" : "已取消收藏");
        return;
      }
    }
    var sn = t.closest ? t.closest("[data-save-note]") : null;
    if (sn && window.Notes) {
      var bar2 = sn.closest(".note-bar");
      if (bar2) {
        var inp = bar2.querySelector(".note-input");
        window.Notes.setNote(bar2.getAttribute("data-note-ch"), bar2.getAttribute("data-note-idx"), inp ? inp.value : "", bar2.getAttribute("data-note-title"));
        sn.textContent = "已保存";
        announce("笔记已保存");
        return;
      }
    }
    /* 新手引导卡的「×」：关掉后记进独立的存储键，之后不再出现 */
    var gc = t.closest ? t.closest("#guideClose") : null;
    if (gc) {
      dismissGuide();
      var card = document.getElementById("guideCard");
      if (card && card.parentNode) card.parentNode.removeChild(card);
      return;
    }
    var lb = t.closest ? t.closest(".btn-lab") : null;
    if (lb) {
      var code = LABC[lb.getAttribute("data-lab-code")];
      if (code) openLab(code);
      return;
    }
    var opt = t.closest ? t.closest(".opt") : null;
    if (opt) {
      var inter = opt.closest(".q-interactive");
      if (inter.classList.contains("locked")) return;
      inter.querySelectorAll(".opt").forEach(function (o) { o.classList.remove("sel"); });
      opt.classList.add("sel");
      return;
    }
    var check = t.closest ? t.closest(".btn-check") : null;
    if (check) {
      var card = check.closest(".qcard");
      var q = QMAP[card.getAttribute("data-qid")];
      if (q) evalSingle(card, q);
      return;
    }
    var jb = t.closest ? t.closest(".judge-btn") : null;
    if (jb) {
      var card2 = jb.closest(".qcard");
      var q2 = QMAP[card2.getAttribute("data-qid")];
      if (q2) evalJudge(card2, q2, jb.getAttribute("data-val"));
      return;
    }
    var cb = t.closest ? t.closest(".btn-check-blank") : null;
    if (cb) {
      var card3 = cb.closest(".qcard");
      var q3 = QMAP[card3.getAttribute("data-qid")];
      if (q3) evalBlank(card3, q3);
      return;
    }
    var rt = t.closest ? t.closest(".btn-retry") : null;
    if (rt) { resetCard(rt.closest(".qcard")); return; }
    var ex = t.closest ? t.closest(".btn-expand") : null;
    if (ex) {
      var wrap = ex.closest(".code-wrap");
      if (wrap) {
        var pre = wrap.querySelector("pre.code");
        var on = pre.classList.toggle("expanded");
        ex.textContent = on ? "收起代码" : "展开全部";
      }
      return;
    }
    var rv = t.closest ? t.closest(".btn-reveal") : null;
    if (rv) {
      var c4 = rv.closest(".qcard");
      var q4 = QMAP[c4.getAttribute("data-qid")];
      if (q4) revealSolution(c4, q4);
      return;
    }
    var sok = t.closest ? t.closest(".btn-self-ok") : null;
    if (sok) {
      var c5 = sok.closest(".qcard");
      var q5 = QMAP[c5.getAttribute("data-qid")];
      if (q5) selfAssess(c5, q5, true);
      return;
    }
    var sbad = t.closest ? t.closest(".btn-self-bad") : null;
    if (sbad) {
      var c6 = sbad.closest(".qcard");
      var q6 = QMAP[c6.getAttribute("data-qid")];
      if (q6) selfAssess(c6, q6, false);
      return;
    }
    /* ---- 编程任务的「测试我的实现」---- */
    var tt = t.closest ? t.closest(".btn-test-task") : null;
    if (tt) {
      var tb = tt.closest(".code-task").querySelector(".testbench");
      if (tb) {
        tb.hidden = !tb.hidden;
        tt.textContent = tb.hidden ? "测试我的实现" : "收起测试台";
      }
      return;
    }
    var tf = t.closest ? t.closest(".btn-test-fill") : null;
    if (tf) {
      var tb2 = tf.closest(".testbench");
      var qf = QMAP[tf.closest(".qcard").getAttribute("data-qid")];
      var ta2 = tb2.querySelector(".tb-src");
      if (ta2 && qf) ta2.value = String(qf.code || "");
      return;
    }
    var tr = t.closest ? t.closest(".btn-test-run") : null;
    if (tr) {
      var tb3 = tr.closest(".testbench");
      var q7 = QMAP[tr.closest(".qcard").getAttribute("data-qid")];
      var src7 = tb3.querySelector(".tb-src").value;
      var out7 = tb3.querySelector(".tb-out");
      if (!window.TestBench || !window.TestBench.runTask) {
        out7.innerHTML = '<p class="tb-msg bad">测试台没有加载，请刷新页面。</p>';
        return;
      }
      var res7;
      try { res7 = window.TestBench.runTask(src7, String(q7.sol || "")); }
      catch (e) { out7.innerHTML = '<p class="tb-msg bad">测试台内部出错：' + esc(e && e.message ? e.message : String(e)) + "</p>"; return; }
      out7.innerHTML = renderTestResult(res7);
      return;
    }
    var sm = t.closest ? t.closest(".btn-save-mock") : null;
    if (sm) { var mc = sm.closest(".mock-card"), mid = mc.getAttribute("data-mock-id"), ms = mockStore(), ta = mc.querySelector(".mock-answer"); ms[mid] = { answer: ta ? ta.value : "", savedAt: new Date().toISOString() }; try { localStorage.setItem(MOCK_KEY, JSON.stringify(ms)); } catch (e) {} sm.textContent = "已保存"; return; }
    var br = t.closest ? t.closest(".btn-rate") : null;
    if (br) { var bc = br.closest(".mock-card"), bid = bc.getAttribute("data-mock-id"), bs = mockStore(); bs[bid] = bs[bid] || {}; bs[bid].rating = Number(br.getAttribute("data-rate")); try { localStorage.setItem(MOCK_KEY, JSON.stringify(bs)); } catch (e) {} br.parentNode.querySelectorAll(".btn-rate").forEach(function (b) { b.classList.remove("on"); }); br.classList.add("on"); return; }
    var sr = t.closest ? t.closest(".btn-show-rubric") : null;
    if (sr) { var mf = sr.closest(".mock-card").querySelector(".mock-feedback"); if (mf) mf.hidden = false; sr.disabled = true; sr.textContent = "评分要点已显示"; return; }
    var nx = t.closest ? t.closest(".btn-next") : null;
    if (nx && currentQuiz) {
      currentQuiz.i++;
      if (currentQuiz.i >= currentQuiz.total) renderQuizResult();
      else renderQuizQ();
      return;
    }
    var rq = t.closest ? t.closest(".btn-requiz") : null;
    if (rq) { setupQuizHook(); viewQuiz(rq.getAttribute("data-course")); return; }
  });

  document.addEventListener("submit", function (e) {
    var t = e.target;
    if (t && t.id === "searchForm") {
      e.preventDefault();
      var inp = document.getElementById("searchInput");
      var kw = inp ? inp.value.trim() : "";
      location.hash = kw ? "#/search/" + encodeURIComponent(kw) : "#/search";
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    var t = e.target;
    if (t && t.classList && t.classList.contains("blank")) {
      var card = t.closest(".qcard");
      if (card) {
        var btn = card.querySelector(".btn-check-blank");
        if (btn) btn.click();
      }
    }
  });

  /* ---------- 知识地图的筛选交互 ----------
     用事件委托，且只在 #/map 页生效（元素不存在时直接返回）。
     勾选/输入后重渲染整页：知识地图内容量不大，简单可靠优于局部更新。 */
  document.addEventListener("change", function (e) {
    var t = e.target;
    if (t && t.id === "mapOnlyLinked") {
      MAP_FILTER.onlyLinked = !!t.checked;
      viewMap();
    }
  });
  document.addEventListener("input", function (e) {
    var t = e.target;
    if (t && t.id === "mapSearch") {
      MAP_FILTER.q = String(t.value || "");
      viewMap();
      /* 重渲染会丢焦点，把光标放回输入框末尾，否则输不了连续几个字 */
      var again = document.getElementById("mapSearch");
      if (again) { again.focus(); try { again.setSelectionRange(again.value.length, again.value.length); } catch (err) {} }
    }
  });

  /* ---------- 重置进度 ---------- */
  document.getElementById("resetBtn").addEventListener("click", function () {
    if (!window.confirm("确定要清空全部学习进度和错题本吗？此操作不可恢复。")) return;
    if (!window.confirm("再次确认：真的要全部重来吗？")) return;
    store = { ans: {}, wrong: {} };
    saveStore();
    refreshChrome();
    route();
  });

  /* ---------- 顶栏搜索框 ---------- */
  var searchForm = document.getElementById("topSearch");
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var inp = document.getElementById("topSearchInput");
      var kw = inp ? inp.value.trim() : "";
      if (!kw) { location.hash = "#/search"; return; }
      location.hash = "#/search/" + encodeURIComponent(kw);
    });
  }

  /* ---------- 主题切换按钮 ---------- */
  var themeBtn = document.getElementById("themeBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      applyTheme(currentTheme() === "dark" ? "light" : "dark");
    });
  }

  /* ---------- 启动 ---------- */
  initTheme();
  window.addEventListener("hashchange", route);
  /* ---------- 顶栏折叠菜单（≤900px 时导航收进下拉面板） ----------
     为什么要做：桌面端 8 个导航项并排没问题，但实测在 ≤834px 时它们会被挤到
     逐字换行，导航高度涨到 106~115px，而顶栏只有 56~62px —— 溢出后直接压住正文。
     所以窄屏改为「菜单」按钮 + 下拉面板。
     元素一律惰性查找（每次现查），这样不必关心这段与 route() 的初始化顺序。 */
  function setNavOpen(open) {
    var navEl = document.getElementById("nav");
    var btn = document.getElementById("navToggle");
    if (!navEl || !btn) return;
    if (open) navEl.classList.add("open"); else navEl.classList.remove("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
  }
  /* 导航收起：窄屏折叠面板与桌面端「更多」下拉一起关。
     路由切换、Esc、点外部都走这里，避免两套菜单状态不同步。 */
  function closeNavMenu() {
    setNavOpen(false);
    var mw = document.getElementById("navMore");
    var mb = document.getElementById("navMoreBtn");
    if (mw) mw.classList.remove("open");
    if (mb) mb.setAttribute("aria-expanded", "false");
  }
  (function wireNavToggle() {
    var navEl = document.getElementById("nav");
    var btn = document.getElementById("navToggle");
    if (!navEl || !btn) return;
    btn.addEventListener("click", function (e) {
      /* 别让下面那条「点面板外面就收起」立刻把刚打开的菜单关掉 */
      if (e && e.stopPropagation) e.stopPropagation();
      setNavOpen(!navEl.classList.contains("open"));
    });
    /* 点面板里的链接后立即收起 */
    navEl.addEventListener("click", function (e) {
      var t = e && e.target;
      if (t && t.closest && t.closest("a")) setNavOpen(false);
    });
    /* 点面板与按钮之外的地方收起 */
    document.addEventListener("click", function (e) {
      if (!navEl.classList.contains("open")) return;
      var t = e && e.target;
      if (t && t.closest && (t.closest("#nav") || t.closest("#navToggle"))) return;
      closeNavMenu();
    });
    /* Esc 收起 */
    document.addEventListener("keydown", function (e) {
      if (e && (e.key === "Escape" || e.keyCode === 27)) closeNavMenu();
    });

    /* ---------- 桌面端的「更多」下拉 ----------
       窄屏时这个按钮是隐藏的（CSS），分组也被 display:contents 摊平，
       所以这段逻辑只在宽屏生效，不冲突。 */
    var moreWrap = document.getElementById("navMore");
    var moreBtn = document.getElementById("navMoreBtn");
    if (moreWrap && moreBtn) {
      moreBtn.addEventListener("click", function (e) {
        if (e && e.stopPropagation) e.stopPropagation();
        var open = !moreWrap.classList.contains("open");
        moreWrap.classList.toggle("open", open);
        moreBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      /* 点了面板里的入口就收起 */
      moreWrap.addEventListener("click", function (e) {
        var t = e && e.target;
        if (t && t.closest && t.closest("a")) {
          moreWrap.classList.remove("open");
          moreBtn.setAttribute("aria-expanded", "false");
        }
      });
      /* 点面板外面收起 */
      document.addEventListener("click", function (e) {
        if (!moreWrap.classList.contains("open")) return;
        var t = e && e.target;
        if (t && t.closest && t.closest("#navMore")) return;
        moreWrap.classList.remove("open");
        moreBtn.setAttribute("aria-expanded", "false");
      });
    }
  })();

  /* ---------- 云同步接入 ----------
     初始化只挂钩子、不发任何网络请求（云服务组件是懒加载的），
     所以离线打开、双击打开 html 都不会被拖慢。
     状态变化时只刷新顶栏徽标和状态文字 —— 不整页重渲染，
     否则用户正在填密码框时被清空，那是个很难查的体验 bug。 */
  if (window.CloudSync && window.CloudSync.init) {
    window.CloudSync.init({
      readPayload: cloudReadPayload,
      applyPayload: cloudApplyPayload,
      onStatus: function () {
        refreshChrome();
        try { if (window.CloudSync.patchStatus) window.CloudSync.patchStatus(); } catch (e) {}
      }
    });
  }

  refreshChrome();
  route();

  /* 调试/自动化测试钩子：让 Node 侧的渲染冒烟脚本能主动触发一次路由，
     从而在无浏览器环境里验证「页面是否真的渲染出了预期结构」。
     只暴露一个只读函数，不影响正常使用。 */
  window.__kpRoute = route;
  /* 代码语言判定器的测试钩子：smoke-test 用它验证「C 代码给实验室按钮、
     C++/JS/Shell/配置片段不给」这条口径没有跑偏 */
  window.__looksCppOrQt = looksCppOrQt;
  window.__looksNonC = looksNonC;
})();
