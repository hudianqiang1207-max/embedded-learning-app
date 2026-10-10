/* bundle-data.js 首屏核心课程 */

/* ==== data-learning.js ==== */

/* 嵌入式学习方法与实战闭环：把知识变成能力 */
window.COURSES = window.COURSES || [];
window.COURSES.push({
  id: "learn", badge: "方法", badgeCls: "cb-learn", title: "学习与实战闭环",
  brief: "从看懂知识到独立编码、仿真、调试和面试",
  desc: "不是再讲一门技术，而是教你如何拆知识、练代码、做实验、复习、串项目和证明自己真的会了。",
  goal: "建立一套可重复的学习方法：每学一个主题，都能完成理解、编码、验证、故障排查、项目复用和面试表达。",
  roles: ["mcu", "rtos", "linux", "drv", "iot"], dep: ["zero", "c"],
  chapters: [
    { id: "learn1", title: "从零开始：先建立地图再学细节", brief: "目标、前置、主线项目和能力等级", std: ["能为一个岗位目标画出课程依赖", "能把章节目标写成可验证的行为"], points: [
      { t: "不要从目录第一章盲目往下读", h: "<p>先选一个目标岗位，再反推学习顺序。MCU 方向优先 C、硬件、外设、调试和 RTOS；Linux 应用优先 C、Linux、并发、网络和构建；驱动方向还要加入 ARM 启动、设备树和内核调试。</p><p>每次学习前写下三件事：<b>我为什么学、学完要能做什么、用什么证据证明做到了</b>。目标必须是动作，例如“能独立写环形队列并通过边界测试”，不要只写“理解环形队列”。</p>" },
      { t: "六级能力模型", h: "<ol><li><b>L0 看过</b>：知道名词</li><li><b>L1 理解</b>：能用自己的话解释</li><li><b>L2 模仿</b>：跟着示例完成</li><li><b>L3 独立实现</b>：不看答案写出并处理边界</li><li><b>L4 调试应用</b>：能从现象到证据再到根因</li><li><b>L5 工程交付</b>：能设计、测试、优化、发布和维护</li></ol><p>课程主要帮助你从 L0 走到 L3，仿真和项目帮助冲到 L4；真正的 L5 需要真实硬件、团队协作和长期维护。</p>" },
      { t: "建立贯穿全站的项目主线", h: "<p>不要每门课做一个互相孤立的 demo。建议维护一个“传感器联网终端”：先用 C 处理数据，再加入环形缓冲区、UART、ADC、RTOS 多任务、Flash 参数、TCP/MQTT、OTA、日志、测试和故障恢复。后面的知识不断改造同一个项目，前后联系自然产生。</p>" },
      { t: "本章行动清单", h: "<ul><li>选定一个目标岗位</li><li>写出前置知识和暂时跳过的内容</li><li>建立项目仓库和 CHANGELOG</li><li>给每章写一个“完成证据”</li><li>每周只推进一个可验收里程碑</li></ul>" }
    ], quiz: [
      { type: "single", q: "最合格的学习目标是哪一个？", opts: ["掌握 RTOS", "理解指针", "能独立实现环形队列并通过空、满、回绕测试", "看完这一章"], ans: 2, exp: "好目标必须是可观察、可操作、可验证的行为。" },
      { type: "judge", q: "学完一章并把文章读完，就可以认为已经掌握了这项技能。", ans: false, exp: "阅读只是 L0/L1。至少还要有独立编码、边界测试、实验或故障排查证据。" },
      { type: "code", q: "编程任务：为任意一个知识点写出三条完成证据。", hint: "证据要能观察，例如代码、测试结果、日志、波形、故障复盘或口头解释。", sol: "/* 示例：\n * 1. 不看答案实现核心函数；\n * 2. 通过空、满、边界和异常输入测试；\n * 3. 能解释设计取舍并定位一处故障。\n */", exp: "把“我感觉会了”换成可检查的证据，是学习闭环的第一步。" }
    ] },
    { id: "learn2", title: "编码训练阶梯：从读代码到独立实现", brief: "逐级降低提示，真正提高写代码能力", std: ["完成同一主题的读、补、改、写四级训练", "能说明自己的边界条件"], points: [
      { t: "四级编码阶梯", h: "<ol><li><b>读代码</b>：追踪变量、调用和输出</li><li><b>补代码</b>：保留接口和测试，只补关键实现</li><li><b>改代码</b>：修 bug 或增加一个需求</li><li><b>独立写</b>：只给需求、接口、约束和测试</li></ol><p>如果独立写不出来，不要反复看讲义，退回上一级，再合上答案重写。每次提示都应逐步减少。</p>" },
      { t: "写代码前先写不变量", h: "<p>以环形队列为例，先写：<code>0 &lt;= count &lt;= CAP</code>；空时不能 pop，满时不能 push；head/tail 到末尾必须回绕。以协议解析为例，先写状态、长度上限、超时和重新同步条件。先写不变量能显著减少“代码能跑但边界错”。</p>" },
      { t: "测试用例不是最后才写", h: "<p>至少准备正常、最小、最大、空输入、错误输入、连续重复、资源不足和中途取消。嵌入式代码尤其要测：中断与任务同时发生、队列满、设备断开、掉电、超时和重试上限。</p>" },
      { t: "代码复盘模板", h: "<ul><li>接口是否表达了输入输出和所有权</li><li>失败返回值是否被处理</li><li>数组和长度是否都做边界检查</li><li>是否有隐式溢出、生命周期或并发问题</li><li>测试是否能证明修复有效</li></ul>" }
    ], quiz: [
      { type: "single", q: "独立编码完全写不出来时，最有效的下一步是什么？", opts: ["直接复制答案", "退回补全或改错级，完成后合上答案重写", "跳过所有编码题", "只继续读理论"], ans: 1, exp: "训练需要逐级降低支架；复制答案没有形成提取能力。" },
      { type: "single", q: "环形队列最应该先明确什么？", opts: ["变量名好不好看", "空、满、回绕和 count 的不变量", "先写所有函数", "先优化到极致"], ans: 1, exp: "不变量是实现和测试的共同依据。" },
      { type: "code", q: "编程任务：列出一个 UART 帧解析器的 6 个最小测试用例。", hint: "覆盖正常帧、最短、最长、非法长度、校验错、超时或截断。", sol: "/* 正常完整帧；最短合法帧；最大长度帧；长度超过上限；校验和错误；收到一半后超时并重新同步。 */", exp: "测试用例要覆盖状态机的边界和恢复路径，不只测一条正常路径。" }
    ] },
    { id: "learn3", title: "仿真与真实硬件：知道模型的边界", brief: "先在电脑验证逻辑，再到硬件验证时序和电气", points: [
      { t: "仿真的四个层次", h: "<ol><li><b>C 语义仿真</b>：变量、指针、调用栈和算法</li><li><b>协议仿真</b>：帧、CRC、拆包、超时和重试</li><li><b>系统仿真</b>：任务、队列、外设事件和故障注入</li><li><b>真实硬件</b>：电源、时钟、噪声、波形、功耗和上电时序</li></ol>" },
      { t: "现有实验室能做什么", h: "<p>本站实验室适合练 C 语义、指针、数组、结构体、位运算、函数调用、基础状态机和执行轨迹。它不能等同于真实 GCC/ARM 环境，不能证明线程、Socket、真实寄存器、链接脚本、Cache、波形或功耗行为一定正确。</p>" },
      { t: "仿真结果如何迁移到真机", h: "<p>每个实验都写“模型假设”和“真机差异”。例如 UART 仿真可以证明帧解析逻辑，但真机还要验证波特率误差、电平、DMA、FIFO、噪声和中断延迟。仿真通过后，必须补一个真机或 QEMU/PC 运行证据。</p>" },
      { t: "故障注入比正常演示更重要", h: "<p>主动制造越界、队列满、I2C 不响应、任务不再运行、网络断开、OTA 断电和配置损坏，然后按“现象—假设—验证—根因—修复—回归”记录。只会正常路径，不算会做嵌入式。</p>" }
    ], quiz: [
      { type: "single", q: "仿真通过后，哪项仍必须用真实硬件验证？", opts: ["变量加法", "C 语法", "电源、波形、噪声和实际功耗", "字符串拼接逻辑"], ans: 2, exp: "电气和时序现象无法由普通 C 解释器证明。" },
      { type: "judge", q: "虚拟 UART 帧解析测试通过，就能证明真实 UART 电平和波特率配置正确。", ans: false, exp: "它只能证明解析逻辑；电平、时钟、波特率、噪声和 DMA 仍需真机或仪器验证。" },
      { type: "code", q: "编程任务：写出一个故障复盘记录的字段。", hint: "至少包含现象、证据、假设、验证、根因、修复和回归。", sol: "/* symptom / evidence / hypothesis / experiment / root_cause / fix / regression */", exp: "固定记录格式能把一次故障转化为以后可复用的知识。" }
    ] },
    { id: "learn4", title: "间隔复习与主动回忆", brief: "让知识在需要时能被调用", points: [
      { t: "不要只重新阅读", h: "<p>重新阅读会产生熟悉感，但不一定能在空白时写出来。复习先隐藏答案，尝试解释、画图、写代码或预测故障，再打开讲义核对。答案应在回忆之后出现。</p>" },
      { t: "建议复习节奏", h: "<p>新知识可在当天、1 天、3 天、7 天、14 天和 30 天复习。答错不代表失败，而是把间隔缩短；连续答对并能独立应用，才逐步拉长间隔。</p>" },
      { t: "混合练习", h: "<p>学 RTOS 时不要只做 RTOS 题，还要混入 C 指针、环形队列、中断、内存可见性和协议解析。真实工作不会按课程章节给你出题，混合练习才会训练知识调用。</p>" },
      { t: "用自己的话讲给别人", h: "<p>每章结束录一段两分钟讲解：它解决什么问题、怎么工作、什么时候不用、最容易错在哪里、如何验证。讲不清楚的地方就是下一次复习入口。</p>" }
    ], quiz: [
      { type: "single", q: "最有效的复习起点是什么？", opts: ["再次通读全文", "先隐藏答案主动回忆，再核对遗漏", "只看高亮", "只背 API 名称"], ans: 1, exp: "主动提取比被动阅读更能检验是否真的能调用知识。" },
      { type: "judge", q: "复习时只做当前章节题，不混入旧知识更容易形成长期能力。", ans: false, exp: "混合练习能训练跨章节调用，接近真实项目的思考方式。" },
      { type: "code", q: "编程任务：为 volatile 写出三个主动回忆问题。", hint: "一个问作用，一个问不能解决什么，一个问真实场景。", sol: "/* 它改变了什么编译器行为？\n * 为什么它不能代替锁或原子操作？\n * 在寄存器或 ISR 共享变量中如何使用？ */", exp: "好问题要求自己生成答案，而不是认出答案。" }
    ] },
    { id: "learn5", title: "知识连接：把前后章节串成系统", brief: "前置、后续、项目和面试四向链接", points: [
      { t: "每个知识点都要回答四个问题", h: "<ol><li>学习它前需要什么？</li><li>它解决什么问题？</li><li>后面哪些模块会复用它？</li><li>企业面试或故障中如何出现？</li></ol><p>例如 DMA 前置是指针、内存和中断，后续会连接传感器采集、环形缓冲区、Cache 一致性和 RTOS 通信。</p>" },
      { t: "建立概念链而不是孤立卡片", h: "<p><code>指针 → 缓冲区 → 环形队列 → UART 接收 → DMA → RTOS 队列 → TCP 分包 → OTA 数据块</code> 是一条可以贯穿多个课程的链。学习后面的主题时，系统应主动要求你调用前面的实现。</p>" },
      { t: "跨章节复用任务", h: "<p>学完 C 指针，回到 UART 做一次缓冲区；学完 RTOS，给它加任务和队列；学完网络，上传采集结果；学完可靠性，加入掉线和断电恢复。每次只增加一个约束，避免项目突然膨胀。</p>" },
      { t: "发现断层怎么办", h: "<p>如果后面章节读不懂，不要硬顶。记录卡住的术语和代码行，沿知识链回退一个节点，完成一个最小补课任务，再回来继续。薄弱点不是按错题数量判断，还要看它阻断了哪些后续能力。</p>" }
    ], quiz: [
      { type: "single", q: "学习 DMA 时最合理的前置关联是什么？", opts: ["只需要背 DMA API", "指针、内存、缓冲区、中断，以及后续的 Cache/RTOS 场景", "只需要会 HTML", "与其他知识无关"], ans: 1, exp: "DMA 是跨模块知识，必须同时理解内存地址、所有权、事件通知和一致性。" },
      { type: "judge", q: "课程按章节学习，所以每章的知识不需要在后续项目中重复使用。", ans: false, exp: "重复调用和逐步增加约束，才会形成稳定的知识网络。" },
      { type: "code", q: "编程任务：为“协议解析器”写出 3 个前置知识和 3 个后续应用。", hint: "前置可从 C、内存、状态机找；后续可从 RTOS、网络、OTA 找。", sol: "/* 前置：数组/指针、边界检查、状态机；\n * 后续：UART DMA 接收、TCP 拆包、OTA 镜像解析。 */", exp: "强制写出前后连接，可以发现自己只是背过名词还是理解了迁移关系。" }
    ] },
    { id: "learn6", title: "故障排查：从现象到证据", brief: "训练工程师最重要的调试思维", points: [
      { t: "不要从猜根因开始", h: "<p>先描述现象：何时发生、频率、输入、版本、温度、电压和最近改动。再列证据，随后提出可证伪的假设。比如“可能是内存泄漏”不是结论，必须说明怎样测分配/释放差值来验证。</p>" },
      { t: "验证顺序要有信息量", h: "<p>优先做成本低、能区分多个假设的检查：复位原因、日志时间线、资源水位、队列长度、任务状态、Fault 寄存器、抓包或波形。不要一上来随机改代码，那会破坏复现条件。</p>" },
      { t: "修复不等于删掉现象", h: "<p>重启设备、加更长延时、无限重试可能暂时掩盖问题。修复要说明根因、为什么不会再次发生、边界如何处理，并用原始复现步骤和回归测试证明。</p>" },
      { t: "故障实验报告模板", h: "<pre>现象：\n证据：\n假设：\n验证步骤：\n验证结果：\n根因：\n修复：\n回归证据：\n遗留风险：</pre>" }
    ], quiz: [
      { type: "single", q: "偶发死机的第一步更应该做什么？", opts: ["随机修改优先级", "保存复位/异常现场并描述复现条件", "立刻增加延时", "删除日志"], ans: 1, exp: "先保存证据和边界条件，才能缩小根因范围。" },
      { type: "judge", q: "只要重启后现象消失，就可以认为故障已经修复。", ans: false, exp: "重启可能只是掩盖问题；必须解释根因并完成回归验证。" },
      { type: "code", q: "编程任务：为“UART 乱码”列出三个互相可区分的假设。", hint: "从配置、硬件信号、软件接收路径分别考虑。", sol: "/* 波特率/数据位配置不一致；电平或接线/噪声问题；接收缓冲区溢出或帧解析错位。 */", exp: "好的排查计划让每个实验都能排除一类假设。" }
    ] },
    { id: "learn7", title: "项目验收与作品集", brief: "把学习成果变成可展示的工程证据", points: [
      { t: "项目最小交付物", h: "<ul><li>README：需求、环境、启动步骤和限制</li><li>架构图：模块、数据流、任务和中断边界</li><li>代码：可构建、接口清晰、错误处理明确</li><li>测试：正常、边界、故障和回归记录</li><li>调试记录：至少一个真实问题和证据链</li><li>版本记录：需求变化和取舍</li></ul>" },
      { t: "能力不是功能数量", h: "<p>一个只有 LED 的项目，如果能说明时序、驱动边界、异常状态、测试和功耗，可能比堆十个外设但无法解释的项目更有价值。项目要突出你的判断和验证，而不是代码行数。</p>" },
      { t: "作品集中的诚实边界", h: "<p>明确区分：已在真机验证、在仿真验证、只做过静态分析、尚未验证。面试官追问时，诚实说明限制比编造“完全可靠”更专业。</p>" },
      { t: "阶段验收问题", h: "<ol><li>能否不看教程重新构建？</li><li>能否解释关键模块每个输入输出？</li><li>能否制造并定位一个故障？</li><li>能否给出资源、性能和测试证据？</li><li>能否说清下一步风险？</li></ol>" }
    ], quiz: [
      { type: "single", q: "作品集最有价值的证据是什么？", opts: ["代码行数", "可复现的构建、测试条件、结果和故障修复记录", "项目名字很大", "截图越多越好"], ans: 1, exp: "工程能力需要可复现证据和取舍说明。" },
      { type: "judge", q: "项目只要功能能跑，README、测试和故障记录都是可有可无的。", ans: false, exp: "这些材料证明你能交付和维护，而不是只完成一次演示。" },
      { type: "code", q: "编程任务：写出一个项目发布前的 5 项检查清单。", hint: "从构建、功能、边界、故障和文档各选一项。", sol: "/* 可构建；核心功能通过；边界输入通过；故障恢复已验证；README/版本/限制已更新。 */", exp: "发布检查清单把“我觉得差不多”变成可执行门禁。" }
    ] },
    { id: "learn8", title: "面试复盘：把能力说出来", brief: "从会做，到能解释、能被追问", points: [
      { t: "两分钟项目表达", h: "<p>按“背景目标 → 我的职责 → 架构 → 一个难点 → 一次故障 → 测试结果 → 反思”组织。不要从项目历史流水账开始，也不要把团队成果全部说成自己完成。</p>" },
      { t: "技术题的四层回答", h: "<ol><li>一句话定义</li><li>一个真实使用场景</li><li>一个常见坑或反例</li><li>如何验证和如何取舍</li></ol><p>例如回答 <code>volatile</code>，不能停在“防止优化”，还要说它不保证原子性，不能替代锁。</p>" },
      { t: "把错题回到课程", h: "<p>面试题答错后，不要只记标准答案。标记自己缺的是概念、代码、场景、调试还是表达，再跳回对应课程和实验重做。题库是检测器，不是课程本身。</p>" },
      { t: "面试能力的真实目标", h: "<p>应届生不需要假装有多年经验，但要能诚实说明：我做过什么、我如何验证、我遇到什么限制、如果继续做我会如何改进。可靠的思考过程比背出所有术语更重要。</p>" }
    ], quiz: [
      { type: "single", q: "技术面回答一个概念时，最完整的顺序是什么？", opts: ["背定义结束", "定义 → 场景 → 坑/反例 → 验证与取舍", "先讲项目历史", "只讲 API"], ans: 1, exp: "这个结构能显示理解、迁移和工程判断。" },
      { type: "judge", q: "面试题做错后只背标准答案，不需要回到代码和实验。", ans: false, exp: "背答案不能保证能写、能调试或迁移，应该回到对应知识和实验补证据。" },
      { type: "code", q: "编程任务：写出一个项目深挖问题，并列出面试官可能继续追问的两点。", hint: "问题要涉及架构、异常、资源或测试。", sol: "/* 问：为什么用队列传感器数据？\n * 追问：队列满怎么办？ISR 与任务同时访问时如何保证安全？ */", exp: "提前练追问，能避免只准备项目介绍而无法深入。" }
    ] }
  ]
});


/* ==== data-lad.js ==== */

/* ============================================================
   课程：编码训练阶梯（L0 ~ L5）
   ------------------------------------------------------------
   这门课解决的是一个具体问题：看得懂代码，但写不出来。
   核心思路是把「写代码」拆成六个能力台阶，每级只加一个难度维度：
     L0 读代码 → L1 补代码 → L2 改代码 → L3 写函数 → L4 独立小程序 → L5 工程集成
   每一级都有「自评记录」，答完后请如实点「独立完成 / 看了提示 / 抄了参考」，
   站点会用它算出你的真实能力曲线，而不是用「做过了」冒充「会做了」。

   代码规范（本课所有代码块都遵守，方便实验室跑起来）：
     - 中文叙述用全角引号 “”，C 代码里的引号写成 \"，换行写成 \\n
     - 参考实现里用 // @case 声明测试用例，实验室测试台会自动跑并比对输出
   ============================================================ */
window.COURSES = window.COURSES || [];
window.COURSES.push({
  id: "lad", badge: "LAD", badgeCls: "cb-lad", title: "编码训练阶梯 L0→L5",
  brief: "从看懂代码到写出工程代码，六级台阶逐一攻克",
  desc: "专治“课听得懂、题刷得动、一让自己写就卡住”。把写代码拆成六个台阶：读代码、补代码、改代码、写函数、独立小程序、工程集成，每级配真实任务与自评记录。",
  goal: "能在不看参考实现的情况下，独立写出带边界检查、返回值约定和测试用例的完整函数与小程序，并说清自己的代码在什么输入下会失败。",
  roles: ["mcu", "rtos", "linux", "drv", "iot"],
  dep: ["c", "learn"],
  chapters: [

  /* ---------------- L0 ---------------- */
  {
    id: "lad0",
    title: "L0 读代码：先能读懂，再谈写",
    brief: "把一段陌生代码的执行过程在纸上走一遍",
    pre: ["learn2"],
    std: ["能对任意 30 行以内的函数逐行说出它的输入、输出和修改了什么内存", "能找到代码里的隐含前提（比如“这个函数假设调用者已经加锁”）"],
    points: [
      { t: "为什么读代码要排在写代码前面",
        h: "<p>写不出代码的人，通常不是“不会打字”，而是<b>脑子里没有可执行的模型</b>。读代码是把别人的可执行模型搬进自己脑子最快的方式。</p><p>读代码的有效方法不是“看一遍”，而是<b>手动执行</b>：拿一张纸，画三个框——变量当前值、被修改的内存、已经产生的输出。每读一行就更新这三个框。坚持二十个函数，你会发现自己开始能“猜”到下一行。</p>" },
      { t: "读代码要抓的四件事",
        h: "<ol><li><b>输入契约</b>：参数合法范围是什么？空指针允不允许？长度能不能为 0？</li><li><b>输出契约</b>：返回值 0 是成功还是失败？出错时是返回 -1、返回 NULL，还是什么都不做？</li><li><b>副作用</b>：除了返回值，它还改了哪些内存？打印了什么？</li><li><b>隐含前提</b>：它假设调用者已经做了什么（初始化、加锁、保证长度）？</li></ol><p>这四件事问清楚，你就从一个“读代码的人”变成了“审查代码的人”。</p>" },
      { t: "示例：手动执行一次取最小值",
        h: "<p>下面这段代码只有 6 行，但它包含了读代码需要的全部要素。先别看结论，自己在纸上走一遍下表。</p>",
        code: "#include <stddef.h>\n\n/* 在数组里找最小值：要求 len > 0，arr 非空 */\nint min_of(const int *arr, size_t len) {\n    size_t i;\n    int m = arr[0];            /* 先假设第一个最小 */\n    for (i = 1; i < len; i++) {\n        if (arr[i] < m) m = arr[i];\n    }\n    return m;\n}" },
      { t: "手动执行表（arr = {7, 3, 9}, len = 3）",
        h: "<table><tr><th>i</th><th>arr[i]</th><th>arr[i] &lt; m ?</th><th>m</th></tr><tr><td>-</td><td>-</td><td>-</td><td>7</td></tr><tr><td>1</td><td>3</td><td>3&lt;7 成立</td><td>3</td></tr><tr><td>2</td><td>9</td><td>9&lt;3 不成立</td><td>3</td></tr></table><p>返回 3。到这里你还没写字，但已经掌握了一次完整的执行模型。</p>" },
      { t: "读出它的隐含前提",
        h: "<p>这段代码有四条没写出来的前提，全靠调用者守规矩：</p><ul><li><b>arr 不能是空指针</b>——否则 <code>arr[0]</code> 直接崩溃</li><li><b>len 不能是 0</b>——否则先用 <code>arr[0]</code> 读了非法内存，而且循环也不会执行</li><li><b>它假设 arr 在调用期间不会被别的线程改</b>——否则读到的值可能前后不一致</li><li><b>它不改动 arr</b>——const 只约束这个函数，不约束别人</li></ul><p>面试时能主动说出这四条，比写出代码更值钱。</p>" },
      { t: "什么时候该推翻重写，而不是继续读",
        h: "<p>如果一段代码有以下特征，先别急着读懂，优先考虑替换：<b>超过三层嵌套的 if/for</b>、<b>同一个函数干三件不相关的事</b>、<b>用了 10 个以上的全局变量</b>、<b>没有注释却到处是魔法数字</b>。读垃圾代码的时间成本，往往比重新写一遍高。</p>" }
    ],
    quiz: [
      { type: "single", q: "读一段陌生代码时，最有效的做法是？",
        opts: ["从头到尾默读一遍，凭感觉判断", "拿纸手动执行，追踪变量值、被修改的内存和输出", "直接编译运行，看结果对不对就行", "先看有多少行，太长就跳过"],
        ans: 1,
        exp: "“能跑”和“读懂了”是两件事。只有手动执行过，你才能预测输入变化时行为怎么变，也才能发现那些只是碰巧跑通的分支。" },
      { type: "judge", q: "函数 min_of(const int *arr, size_t len) 中的 const 保证了 arr 指向的数组在整个程序运行期间都不会被修改。",
        ans: false,
        exp: "const 只是这个函数对外的承诺：本函数不改。别的函数只要拿到非 const 指针，照样能改。const 是接口契约，不是全局内存保护。这也是“隐含前提”要单独列一条的原因。" },
      { type: "single", q: "下面这段代码的隐含前提，最需要警惕的是哪一条？",
        code: "int pick(int *arr, size_t len) {\n    int m = arr[0];\n    for (size_t i = 1; i < len; i++) if (arr[i] > m) m = arr[i];\n    return m;\n}",
        opts: ["返回值类型应该是 size_t", "arr 非空且 len > 0，否则 arr[0] 就是非法访问", "循环应该从 0 开始", "arr 应该是 const"],
        ans: 1,
        exp: "size_t 是无符号类型，len 为 0 时 for 条件 1 < 0 不成立会直接跳过，但 arr[0] 已经先读了——所以空数组是真实崩溃点。改法是开头加 if (!arr || len == 0) return 0; 或改用返回错误码的接口。" },
      { type: "single", q: "读代码时，以下哪种行为最能体现你已经在“审查”而不是“浏览”？",
        opts: ["能背出代码有多少行", "能说出这个函数在什么输入下会失效", "能说出用了几个 if", "能说出作者是谁"],
        ans: 1,
        exp: "找出失效条件 = 建立起了边界意识。这种能力直接等价于写代码时的防御性思维，也是从 L0 迈向 L1 的关键信号。" },
      { type: "single", q: "遇到一段超过 200 行、嵌套四层、到处是全局变量的旧代码，最好的策略是？",
        opts: ["逐行精读，全部读懂再动手", "先确认它的对外行为（输入输出），再评估重写成本", "直接删掉重写，不用看", "先格式化换行再说"],
        ans: 1,
        exp: "先锁行为、再决定读或重写。行为是必须保住的契约；实现只是达成契约的一种方式。跳过行为直接重写，是线上事故的常见源头。" }
    ]
  },

  /* ---------------- L1 ---------------- */
  {
    id: "lad1",
    title: "L1 补代码：填一个空白，但要想清三件事",
    brief: "填空不是猜，是先把约束想明白再落笔",
    pre: ["lad0"],
    std: ["能独立填出本章所有 {{n}} 空白并说明为什么是这个写法", "能说出每个空白的错误写法会导致什么具体故障"],
    points: [
      { t: "填空时要在心里回答的三个问题",
        h: "<ol><li><b>边界是什么</b>：空指针、长度 0、容量满，这三种情况这一行要不要管？</li><li><b>返回值约定是什么</b>：这一行该 return 0 还是 -1？调用者靠它判断成败。</li><li><b>如果我写错，会以什么方式暴露</b>：崩溃、静默返回错值、还是数据被悄悄改坏？</li></ol><p>能把第三个问题答清楚，你的填空就从“背写法”升级成了“设计”。</p>" },
      { t: "示例：补全环形队列的 push",
        h: "<p>这是一个真实面试题，也是嵌入式里最常见的缓冲结构。先自己想清楚再点开答案。</p>",
        code: "#include <stddef.h>\n#define CAP 8\n\ntypedef struct {\n    int buf[CAP];\n    size_t head, tail, count;   /* count 是不变量：空为 0，满为 CAP */\n} Queue;\n\nint queue_push(Queue *q, int v) {\n    if ({{1}}) return -1;          /* 空指针，或已经满了 */\n    q->buf[q->tail] = v;\n    q->tail = {{2}};               /* 回绕到 0 */\n    q->count++;\n    return 0;\n}" },
      { t: "为什么用 count 而不是靠 head/tail 判断满空",
        h: "<p>如果只用 <code>head == tail</code> 判空，那么“空”和“满”的条件完全一样，无法区分。三种常见解法：</p><ul><li><b>加 count 字段</b>（本示例）——最简单，代价是 4 字节和一次自增</li><li><b>牺牲一个槽位</b>——满的条件变成 <code>(tail+1)%CAP == head</code>，容量少 1</li><li><b>用位运算的环形缓冲技巧</b>——容量取 2 的幂，用 <code>&amp;(CAP-1)</code> 代替取模，速度更快</li></ul><p>嵌入式里第三种很常见，因为 ARM 上取模是除法，很慢；<code>&amp; 7</code> 只要一个周期。</p>" },
      { t: "错误写法会怎么炸",
        h: "<table><tr><th>错误写法</th><th>后果</th></tr><tr><td>忘记判 <code>count == CAP</code></td><td>覆盖还没被读走的数据，表现为“偶尔丢一条消息”，最难查</td></tr><tr><td>下标用 <code>tail++</code> 不回绕</td><td>越界写坏相邻内存，可能毫无症状直到别处崩</td></tr><tr><td>忘了 <code>count++</code></td><td>队列永远显示为空，pop 一直失败</td></tr><tr><td>先 count++ 再判满</td><td>满队列下 count 变成 CAP+1，后续判断全乱</td></tr></table>" }
    ],
    quiz: [
      { type: "blank", q: "补全环形队列 push 的两个空白（{{1}} 判空判满，{{2}} 回绕下标）。",
        code: "int queue_push(Queue *q, int v) {\n    if ({{1}}) return -1;\n    q->buf[q->tail] = v;\n    q->tail = {{2}};\n    q->count++;\n    return 0;\n}",
        blanks: [
          { acc: ["!q || q->count == CAP", "q == NULL || q->count == CAP", "!q||q->count==CAP", "!q || q->count >= CAP"], hint: "两种拒绝情形：指针无效，或者已经满了" },
          { acc: ["(q->tail + 1) % CAP", "(q->tail+1)%CAP", "(q->tail + 1u) % CAP"], hint: "写出加一之后对容量取模的表达式" }
        ],
        exp: "不变量是 count==0 为空、count==CAP 为满。回绕必须取模，否则 tail 会一直增长直到越界。" },
      { type: "blank", q: "补全 pop：从队头取值，成功返回 0，失败返回 -1。",
        code: "int queue_pop(Queue *q, int *out) {\n    if ({{1}}) return -1;\n    *out = q->buf[q->head];\n    q->head = {{2}};\n    q->count--;\n    return 0;\n}",
        blanks: [
          { acc: ["!q || !out || q->count == 0", "q == NULL || out == NULL || q->count == 0", "!q || !out || q->count==0"], hint: "三个条件：队列指针、输出指针、队列非空" },
          { acc: ["(q->head + 1) % CAP", "(q->head+1)%CAP", "(q->head + 1u) % CAP"], hint: "和 push 对称的回绕表达式" }
        ],
        exp: "out 也要判空——这是新手最容易漏的。调用者传 NULL 时，写入就是一次静默的内存破坏。" },
      { type: "blank", q: "补全位操作：把寄存器 REG 的第 3 位置 1，第 5 位清 0，其他位保持不变。",
        code: "#define REG (*(volatile unsigned int *)0x40000000u)\n\nvoid cfg(void) {\n    REG {{1}};   /* 第 3 位置 1 */\n    REG {{2}};   /* 第 5 位清 0 */\n}",
        blanks: [
          { acc: ["|= (1u << 3)", "|= (1 << 3)", "|= (1u<<3)", "|= (1 << 3u)"], hint: "置位用或运算" },
          { acc: ["&= ~(1u << 5)", "&= ~(1 << 5)", "&= ~(1u<<5)", "&= ~(1 << 5u)"], hint: "清零用与上取反" }
        ],
        exp: "置位 |= 掩码，清零 &= ~掩码。绝对不能写 REG = (1<<3)，那会把其他位全清掉——这是驱动里最经典的踩坑。" },
      { type: "judge", q: "在环形队列里，先执行 count++ 再检查是否超过容量，只要检查及时就没有问题。",
        ans: false,
        exp: "count 是不变量，一旦越界（比如变成 CAP+1），所有依赖它的判断都不可信，后续 push/pop 会连锁出错，而且这种错误往往表现为“偶发”，极难定位。原则：先校验，再改状态。" }
    ]
  },

  /* ---------------- L2 ---------------- */
  {
    id: "lad2",
    title: "L2 改代码：找出错误并说清它为什么错",
    brief: "Debug 的第一步不是加打印，是看懂代码",
    pre: ["lad1"],
    std: ["能指出本章每处错误的现象、根因和最小区分用例", "能写出一个能稳定复现该错误的输入"],
    points: [
      { t: "改代码的固定套路：现象 → 证据 → 假设 → 验证",
        h: "<p>新手改 bug 的方式是“把觉得可疑的地方改一改试试”，这在简单代码里能碰对，在复杂系统里就是随机游走。正确顺序是：</p><ol><li><b>写清现象</b>——“偶尔丢数据”不是现象，“连续发 1000 条，平均丢 3 条，丢的都是第 8 条的倍数”才是</li><li><b>拿到证据</b>——日志、变量值、抓包、寄存器状态</li><li><b>提出假设</b>——必须能被证伪，“可能是内存问题”不算假设</li><li><b>设计验证</b>——最小输入、最小复现路径</li></ol>" },
      { t: "示例：一个典型的越界写",
        h: "<p>下面这段代码看起来完全正常，甚至多数时候也能跑通。找找问题在哪。</p>",
        code: "#include <string.h>\n\nvoid copy_name(char *dst, const char *src) {\n    /* dst 是调用者提供的缓冲区 */\n    for (int i = 0; i <= (int)strlen(src); i++) {\n        dst[i] = src[i];\n    }\n}",
        codeNote: "这段代码的功能是复制字符串，包括结尾的 \\0。" },
      { t: "它错在哪：out-of-bounds write 就在一个等号上",
        h: "<p>问题不在 <code>for</code> 本身——用 <code>&lt;=</code> 是为了把结尾的 <code>\\0</code> 一起复制，这是对的。真正的问题是<b>函数完全没有检查 dst 的容量</b>。</p><p>调用者如果这样写：</p><p><code>char buf[8]; copy_name(buf, \"a_very_long_name\");</code></p><p>那就是一次干净的缓冲区溢出：越界写坏栈上的相邻变量。严重时覆盖返回地址，程序直接跳到垃圾地址执行。这类漏洞是真实世界被利用最多的类型之一。</p>" },
      { t: "两种正确的改法，以及各自的取舍",
        h: "<p><b>改法一：把容量变成参数（推荐）</b></p><p><code>int copy_name(char *dst, size_t cap, const char *src)</code>，内部判断 <code>if (len + 1 &gt; cap) return -1;</code> 再复制，并保证一定写入 <code>\\0</code>。</p><p><b>改法二：用标准库并明确语义</b></p><p><code>snprintf(dst, cap, \"%s\", src)</code> 天然安全且一定补 <code>\\0</code>，但要注意返回值是被截断前的长度，用错反而引入新 bug。</p><p><b>嵌入式补充</b>：三面墙（栈、堆、静态区）都很小，宁可用显式容量参数的接口，也不要依赖运行时的越界检测——很多平台根本没有 MMU。</p>" },
      { t: "一个可以稳定复现的用例",
        h: "<p>复现用例的价值在于“稳定”。下面这条能在任何编译器、任何优化等级下复现：</p><p><code>char buf[4]; copy_name(buf, \"hello\");</code> 需要写 6 字节（含 <code>\\0</code>），必然越界 2 字节。</p><p>写 bug 报告时把这条写进去，别人拿到就能重现，这就是从“我觉得有问题”升级到“这里有证据”。</p>" }
    ],
    quiz: [
      { type: "code", q: "编程任务：把 copy_name 改成安全版本。要求：带容量参数；空间不足时返回 -1 且不改动 dst；成功时返回复制长度并保证以 \\0 结尾。",
        hint: "先算 strlen，再判断 len+1 > cap；不足就立刻返回，一个字都不要写进去。",
        code: "/* 安全字符串复制\n *\n * 要求：\n *   1. 空间不足（len + 1 > cap）时返回 -1，且不能改动 dst 的任何字节\n *   2. 成功时返回复制内容的长度（不含结尾 \\0），并保证 dst 以 \\0 结尾\n *   3. dst、src 为 NULL 或 cap 为 0 时返回 -1\n *\n * 测试用例写在注释里，实验室自动校验：\n *   // @case copy_name(dst, 16, \"hello\") => 5\n *   // @case copy_name(dst, 4, \"hello\") => -1\n */\n#include <string.h>\n#include <stddef.h>\n\nint copy_name(char *dst, size_t cap, const char *src) {\n    /* 在这里实现 */\n    return -1;\n}",
        sol: "#include <string.h>\n#include <stddef.h>\n\nint copy_name(char *dst, size_t cap, const char *src) {\n    size_t len;\n\n    /* 先做全部参数校验，任何一条不满足都不写内存 */\n    if (dst == NULL || src == NULL || cap == 0) return -1;\n\n    len = strlen(src);\n    if (len + 1 > cap) return -1;   /* 空间不足：宁可失败，也不截断 */\n\n    memcpy(dst, src, len + 1);      /* 连结尾的 \\0 一起复制 */\n    return (int)len;\n}\n\nint main(void) {\n    char small[4];\n    char big[16];\n    printf(\"%d\\n\", copy_name(big, sizeof(big), \"hello\"));   /* 5 */\n    printf(\"%d\\n\", copy_name(small, sizeof(small), \"hello\")); /* -1 */\n    printf(\"%d\\n\", copy_name(NULL, 0, \"x\"));                 /* -1 */\n    return 0;\n}\n// @in\n// @case main => 5\\n-1\\n-1",
        exp: "三个关键点：① 校验全部前置，失败路径零写入；② 判断条件必须是 len+1 而不是 len，否则漏掉 \\0；③ 用 memcpy 复制 len+1 字节比循环更清晰也更快。\n注意“空间不足时返回 -1 且不改动 dst”这一条：如果先复制一部分再发现放不下，就已经把 dst 改坏了——很多库函数就是栽在这里。" }
    ]
  },

  /* ---------------- L3 ---------------- */
  {
    id: "lad3",
    title: "L3 写函数：从接口定义开始写起",
    brief: "先写注释和签名，再写实现",
    pre: ["lad2"],
    std: ["能独立完成本章全部编程任务且不参看参考实现", "每个函数都能说出空指针、零长度、容量不足三种边界的行为"],
    points: [
      { t: "「先写签名和注释」为什么真的有用",
        h: "<p>凭空开始写实现，脑子里同时要装“做什么”和“怎么做”两件事，很容易写着写着跑偏。正确顺序是：</p><ol><li>写函数名和参数——名字要能读出意图，<code>calc</code> 不如 <code>crc16_calc</code></li><li>写返回值的含义——0 是成功还是长度？错误码有哪些？</li><li>写三行注释：做什么、边界、失败时怎样</li><li>最后才写函数体</li></ol><p>这个顺序的价值在于：<b>接口想清楚了，实现就只剩搬运。</b></p>" },
      { t: "接口设计的三条硬要求",
        h: "<ul><li><b>返回值能区分失败原因</b>：统一用 0 成功、负数是错误码，比“返回 NULL 表示出错”更好用</li><li><b>输出参数在失败时不被修改</b>：调用者拿到失败返回值后还能安全地忽略输出参数</li><li><b>不假设调用者做过什么</b>：不要在函数里假设“调用者已经初始化过了”，能在函数内校验就校验</li></ul>" },
      { t: "示例：经典面试题「字符串转整数」，看接口怎么定",
        h: "<p>这题人人会写，但多数人的版本一遇到边界就崩。请看它的完整形态。</p>",
        code: "#include <stddef.h>\n#include <limits.h>\n\n/* 把十进制字符串转成 int\n * 返回：0 = 成功，-1 = 空指针或空串，-2 = 含非法字符，-3 = 溢出\n * 失败时 *out 不被修改 */\nint str_to_int(const char *s, int *out) {\n    int sign = 1;\n    long acc = 0;\n    const char *p = s;\n\n    if (s == NULL || out == NULL || *s == '\\0') return -1;\n\n    if (*p == '+' || *p == '-') {\n        if (*p == '-') sign = -1;\n        p++;\n        if (*p == '\\0') return -1;   /* 只有一个符号，不算合法数字 */\n    }\n\n    for (; *p != '\\0'; p++) {\n        if (*p < '0' || *p > '9') return -2;\n        acc = acc * 10 + (*p - '0');\n        if (acc > 2147483647L + (sign < 0)) return -3;   /* 提前判溢出 */\n    }\n\n    *out = (int)(sign * acc);\n    return 0;\n}" },
      { t: "为什么这里先累加到 long，而不是直接判 INT_MAX",
        h: "<p>直接写 <code>if (acc &gt; INT_MAX)</code> 有个致命问题：<b>acc 在比较之前可能已经溢出了</b>，此时比较的是垃圾值，结果不可信。</p><p>两个可行做法：</p><ul><li><b>用更宽的类型累加</b>（本示例把 int 累加进 long），代价是多一个类型</li><li><b>在乘法之前判断</b>：<code>if (acc &gt; (INT_MAX - digit) / 10) return -3;</code>——不用宽类型，但要小心写法</li></ul><p>另外注意 <code>+ (sign &lt; 0)</code> 这个技巧：负数能表示的范围比正数多 1（能到 -2147483648，而正数最大 2147483647），所以要允许边界多走一格。</p>" },
      { t: "写完之后的必做动作：测试用例",
        h: "<p>函数写完不算完，要给它配用例。四类用例必须覆盖：<b>正常值</b>、<b>边界值</b>、<b>非法输入</b>、<b>极端值</b>。</p><p>本站的实验室测试台支持在代码里直接声明用例，写法是：</p><p><code>// @case str_to_int(\"123\", &amp;v) =&gt; 0</code></p><p>格式是 <code>@case 调用形式 =&gt; 期望结果</code>。编程任务里把它写在参考实现的注释中，运行测试台时就会自动逐条比对输出。</p>" }
    ],
    quiz: [
      { type: "code", q: "编程任务：实现 str_to_int。要求区分四类失败（空指针/空串、非法字符、溢出）并保证失败时 *out 不被修改。",
        hint: "用 long 累加避免中间溢出；符号位单独处理；负数下界比正数上界多 1。",
        code: "/* 把十进制字符串转成 int\n *\n * 返回：0 成功，-1 空指针或空串，-2 含非法字符，-3 溢出\n * 失败时 *out 必须保持原值\n *\n * 在 main 里打印每种情况，按 “返回值,out值” 逐行输出\n * 测试用例：\n *   \"123\"     -> \"0,123\"\n *   \"-45\"     -> \"0,-45\"\n *   \"\"        -> \"-1,7\"       (out 保持初始值 7)\n *   \"12a\"     -> \"-2,7\"\n *   \"99999999999\" -> \"-3,7\"\n */\n#include <stddef.h>\n\nint str_to_int(const char *s, int *out) {\n    /* 在这里实现 */\n    return -1;\n}\n\nint main(void) {\n    /* 在这里写测试输出：每个用例打印 “返回值,out的值” */\n    return 0;\n}",
        sol: "#include <stdio.h>\n#include <stddef.h>\n\nint str_to_int(const char *s, int *out) {\n    int sign = 1;\n    long acc = 0;\n    const char *p = s;\n\n    if (s == NULL || out == NULL || *s == '\\0') return -1;\n\n    if (*p == '+' || *p == '-') {\n        if (*p == '-') sign = -1;\n        p++;\n        if (*p == '\\0') return -1;\n    }\n\n    for (; *p != '\\0'; p++) {\n        if (*p < '0' || *p > '9') return -2;\n        acc = acc * 10 + (*p - '0');\n        if (acc > 2147483647L + (sign < 0)) return -3;\n    }\n\n    *out = (int)(sign * acc);\n    return 0;\n}\n\nint main(void) {\n    int v;\n\n    v = 7; printf(\"%d,%d\\n\", str_to_int(\"123\", &v), v);\n    v = 7; printf(\"%d,%d\\n\", str_to_int(\"-45\", &v), v);\n    v = 7; printf(\"%d,%d\\n\", str_to_int(\"\", &v), v);\n    v = 7; printf(\"%d,%d\\n\", str_to_int(\"12a\", &v), v);\n    v = 7; printf(\"%d,%d\\n\", str_to_int(\"99999999999\", &v), v);\n    return 0;\n}\n// @in\n// @case main => 0,123\\n0,-45\\n-1,7\\n-2,7\\n-3,7",
        exp: "四个考点：① 空串和“只有符号”都要归到 -1；② 用 long 累加是稳妥的防溢出手段；③ 负数边界多一格，写成 2147483647L + (sign < 0) 比硬编码 INT_MIN 更不易出错；④ 失败路径要在赋值 *out 之前 return，否则“失败时保持原值”这条契约就破了。" },
      { type: "code", q: "编程任务：实现一个安全的十六进制字符串解析 hex_to_u32，把 \"0x1A2B\" 或 \"1a2b\" 解析成无符号整数，非法字符返回 -1。",
        hint: "可以用一个 helper 把字符映射成 0~15；注意处理可选的 0x 前缀和大小写。",
        code: "/* 解析十六进制字符串\n *\n * 接受：可选前缀 0x/0X，随后是 1 个及以上十六进制数字（大小写均可）\n * 返回：0 成功（结果写入 *out），-1 参数无效或格式非法\n * 失败时 *out 不被修改\n *\n * 用例：\n *   \"0x1A2B\" -> 6699\n *   \"1a2b\"   -> 6699\n *   \"FF\"     -> 255\n *   \"0x\"     -> -1\n *   \"12G4\"   -> -1\n */\n#include <stdint.h>\n\nint hex_to_u32(const char *s, uint32_t *out) {\n    /* 在这里实现 */\n    return -1;\n}\n\nint main(void) {\n    uint32_t v;\n    /* 打印每个用例的 “返回值,out值”，失败用例的 out 初始为 999 */\n    return 0;\n}",
        sol: "#include <stdio.h>\n#include <stdint.h>\n#include <stddef.h>\n\nstatic int hex_val(char c) {\n    if (c >= '0' && c <= '9') return c - '0';\n    if (c >= 'a' && c <= 'f') return c - 'a' + 10;\n    if (c >= 'A' && c <= 'F') return c - 'A' + 10;\n    return -1;\n}\n\nint hex_to_u32(const char *s, uint32_t *out) {\n    uint32_t acc = 0;\n    const char *p = s;\n    int digits = 0;\n\n    if (s == NULL || out == NULL) return -1;\n\n    if (p[0] == '0' && (p[1] == 'x' || p[1] == 'X')) p += 2;\n\n    for (; *p != '\\0'; p++) {\n        int d = hex_val(*p);\n        if (d < 0) return -1;\n        acc = (acc << 4) | (uint32_t)d;\n        digits++;\n    }\n\n    if (digits == 0) return -1;\n    *out = acc;\n    return 0;\n}\n\nint main(void) {\n    uint32_t v;\n    v = 999; printf(\"%d,%u\\n\", hex_to_u32(\"0x1A2B\", &v), v);\n    v = 999; printf(\"%d,%u\\n\", hex_to_u32(\"1a2b\", &v), v);\n    v = 999; printf(\"%d,%u\\n\", hex_to_u32(\"FF\", &v), v);\n    v = 999; printf(\"%d,%u\\n\", hex_to_u32(\"0x\", &v), v);\n    v = 999; printf(\"%d,%u\\n\", hex_to_u32(\"12G4\", &v), v);\n    return 0;\n}\n// @in\n// @case main => 0,6699\\n0,6699\\n0,255\\n-1,999\\n-1,999",
        exp: "三个细节：① digits == 0 判断必须有，否则 \"0x\" 会“成功”返回 0；② 用 (acc << 4) | d 比 acc*16+d 更符合位运算直觉，两者等价；③ helper 用 static 限定可见性，这是驱动代码的基本修养。" },
      { type: "blank", q: "补全一个常见的“安全除零检查 + 取模回绕”写法。",
        code: "/* 把 idx 在 0..n-1 之间循环推进，n 可能为 0 */\nsize_t next_idx(size_t idx, size_t n) {\n    if ({{1}}) return 0;              /* 无法循环的情形 */\n    return (idx + 1) {{2}};           /* 推进并回绕 */\n}",
        blanks: [
          { acc: ["n == 0", "n==0", "n < 1"], hint: "容量为 0 时循环没有意义，也避免下面除零" },
          { acc: ["% n", "%n"], hint: "取模实现回绕" }
        ],
        exp: "先挡住 n==0，再取模。顺序反了就是一次除零崩溃。这也解释了为什么 L1 里那句“先校验再改状态”要反复强调。" }
    ]
  },

  /* ---------------- L4 ---------------- */
  {
    id: "lad4",
    title: "L4 独立小程序：从函数到可运行的程序",
    brief: "第一次面对“没有任何提示，写出一个完整能跑的东西”",
    pre: ["lad3"],
    std: ["能从需求开始，自己拆出数据结构、函数划分和主流程", "程序能处理非法输入而不是崩溃"],
    points: [
      { t: "小程序和大函数的区别：多了“流程”和“状态”",
        h: "<p>写函数时，输入输出是别人给的。写程序时，你需要自己决定：</p><ul><li><b>数据存在哪</b>——数组、结构体、全局还是栈上</li><li><b>流程怎么走</b>——先输入、再处理、最后输出，出错在哪一步退出</li><li><b>状态怎么维护</b>——比如“已输入几个数”“当前最大值是多少”</li></ul><p>这三点想清楚，程序就写完了大半。</p>" },
      { t: "一个可复用的程序骨架",
        h: "<p>几乎所有小程序的骨架都是这五步，可以直接背下来：</p>",
        code: "#include <stdio.h>\n\nint main(void) {\n    /* 1. 定义所有需要的变量，就地初始化 */\n    /* 2. 读输入（并检查是否读到） */\n    /* 3. 处理数据 */\n    /* 4. 输出结果 */\n    return 0;\n}" },
      { t: "示例：统计一串整数里的最大值、最小值和平均值",
        h: "<p>需求：先输入个数 n，再输入 n 个整数，输出最大值、最小值和平均值（平均值保留两位小数）。n 为 0 或负数时输出错误提示。</p><p>先自己写，再看下面的参考实现。</p>",
        code: "#include <stdio.h>\n\nint main(void) {\n    int n, i, v;\n    int mx, mn, sum = 0;\n\n    if (scanf(\"%d\", &n) != 1 || n <= 0 || n > 100000) {\n        printf(\"invalid n\\n\");\n        return 0;\n    }\n\n    mx = mn = 0;\n    for (i = 0; i < n; i++) {\n        if (scanf(\"%d\", &v) != 1) { printf(\"bad input\\n\"); return 0; }\n        if (i == 0) { mx = mn = v; }\n        else {\n            if (v > mx) mx = v;\n            if (v < mn) mn = v;\n        }\n        sum += v;\n    }\n\n    printf(\"max=%d min=%d avg=%.2f\\n\", mx, mn, (double)sum / n);\n    return 0;\n}\n// @in 5\\n3 -7 10 0 4\n// @case main => max=10 min=-7 avg=2.00" },
      { t: "这段代码里最值得学的三个细节",
        h: "<ol><li><b>检查 scanf 的返回值</b>：<code>scanf</code> 返回成功读入的项数。输入不是数字时它返回 0 并让 <code>v</code> 保持旧值，不检查就会拿着垃圾数据继续算。</li><li><b>用 i == 0 初始化最值</b>：不能把 mx 初始化成 0，否则全是负数时最大值会错成 0。这是初学者最常犯的错。</li><li><b>求平均前转 double</b>：<code>sum / n</code> 是整数除法会截断，必须写 <code>(double)sum / n</code>。</li></ol>" }
    ],
    quiz: [
      { type: "code", q: "编程任务：统计字符串里的单词数、最长单词长度和数字字符个数。单词以空白分隔。",
        hint: "用一个 in_word 标志记录“当前是否在单词内”，遇到空白就把标志清掉。",
        code: "/* 需求：读入一行文本（可含空格），统计并输出：\n *   单词数（连续非空白字符算一个单词）\n *   最长单词长度\n *   数字字符 '0'~'9' 的个数\n * 输出格式：words=%d maxlen=%d digits=%d\n *\n * 用例：输入 \"hello world 42 abc\"\n *       输出 words=4 maxlen=5 digits=2\n */\n#include <stdio.h>\n\nint main(void) {\n    /* 在这里实现。可以用 getchar() 逐字符读取。 */\n    return 0;\n}",
        sol: "#include <stdio.h>\n\nint main(void) {\n    int c;\n    int in_word = 0;\n    int words = 0, maxlen = 0, digits = 0, cur = 0;\n\n    while ((c = getchar()) != EOF && c != '\\n') {\n        if (c == ' ' || c == '\\t' || c == '\\r') {\n            in_word = 0;\n            cur = 0;\n            continue;\n        }\n        if (c >= '0' && c <= '9') digits++;\n        if (!in_word) { in_word = 1; words++; }\n        cur++;\n        if (cur > maxlen) maxlen = cur;\n    }\n\n    printf(\"words=%d maxlen=%d digits=%d\\n\", words, maxlen, digits);\n    return 0;\n}\n// @in hello world 42 abc\n// @case main => words=4 maxlen=5 digits=2",
        exp: "核心是 in_word 状态机：进入单词时（in_word 由 0 变 1）才 words++，遇到空白时复位。只用“当前字符是空白吗”判断会把单词数算多。\n另外注意 getchar 读到 EOF 或换行都要停——只判 EOF 在某些输入下会一直等下去。" },
      { type: "code", q: "编程任务：把输入的整数数组做去重并按升序输出（重复元素只保留一个）。",
        hint: "先读进数组，排序（冒泡最简单），然后遍历时只输出与前一个不同的元素。",
        code: "/* 需求：先输入个数 n，再输入 n 个整数\n * 输出：升序、去重后的一行，元素之间用一个空格分隔，末尾不带空格\n *\n * 用例：输入 7 后跟 \"3 1 3 2 1 5 2\"\n *       输出 1 2 3 5\n */\n#include <stdio.h>\n\n#define MAXN 1000\n\nint main(void) {\n    int n, i, j, t;\n    int a[MAXN];\n    /* 在这里实现 */\n    return 0;\n}",
        sol: "#include <stdio.h>\n\n#define MAXN 1000\n\nint main(void) {\n    int n, i, j, t;\n    int a[MAXN];\n\n    if (scanf(\"%d\", &n) != 1 || n <= 0 || n > MAXN) {\n        printf(\"invalid n\\n\");\n        return 0;\n    }\n    for (i = 0; i < n; i++) {\n        if (scanf(\"%d\", &a[i]) != 1) { printf(\"bad input\\n\"); return 0; }\n    }\n\n    /* 冒泡排序：稳定、写法最短，小数据量足够 */\n    for (i = 0; i < n - 1; i++) {\n        for (j = 0; j < n - 1 - i; j++) {\n            if (a[j] > a[j + 1]) { t = a[j]; a[j] = a[j + 1]; a[j + 1] = t; }\n        }\n    }\n\n    /* 去重输出：第一个元素无条件输出，之后的与前一个不同才输出 */\n    int first = 1;\n    for (i = 0; i < n; i++) {\n        if (i > 0 && a[i] == a[i - 1]) continue;\n        if (!first) printf(\" \");\n        printf(\"%d\", a[i]);\n        first = 0;\n    }\n    printf(\"\\n\");\n    return 0;\n}\n// @in 7\\n3 1 3 2 1 5 2\n// @case main => 1 2 3 5",
        exp: "排序后用“与前一个比较”去重是最省事的写法，O(n log n) 或 O(n²) 都行。\n真正的考点其实是输出格式：末尾不能带空格，所以要用 first 标志而不是一律 printf(\"%d \", x)。\n还应该会回答：数组上限 MAXN 就是栈压力，如果 n 可能很大就得改静态数组或动态分配——嵌入式里栈通常只有几 KB。" },
      { type: "single", q: "在“统计最值”的程序里，把 mx 初始化为 0 会有什么问题？",
        opts: ["没有问题，0 是最小值", "如果输入全是负数，最大值会被错误地输出为 0", "会导致编译错误", "只影响性能"],
        ans: 1,
        exp: "最值的初始值必须来自真实数据（第一个元素），而不能是“看起来合理”的常量。这是“哨兵值选错”这一类 bug 的典型代表，同类问题还有用 0 当作“未找到”的标志。" },
      { type: "single", q: "scanf(\"%d\", &v) 的返回值代表什么，为什么必须检查？",
        opts: ["返回读到的数值本身", "返回成功匹配并赋值的输入项个数；不检查会拿着未更新的变量继续计算", "返回剩余可读字符数", "没有返回值"],
        ans: 1,
        exp: "scanf 返回成功赋值的项数，读到 EOF 返回 EOF(-1)。输入 abc 时它返回 0 且不改 v，于是 v 里是上一次的旧值或未初始化的垃圾——这类 bug 的症状是“结果偶尔很离谱”。" }
    ]
  },

  /* ---------------- L5 ---------------- */
  {
    id: "lad5",
    title: "L5 工程集成：把函数装进一个能长期维护的结构里",
    brief: "分层、接口、日志、测试——让它像真实项目一样",
    pre: ["lad4"],
    std: ["能把一个功能拆成接口层/实现层并对上层隐藏内部结构", "为主流程补上错误码、日志和至少三条测试用例"],
    points: [
      { t: "从“能跑”到“能维护”，差的是这四件事",
        h: "<ol><li><b>分层</b>——上层只依赖接口，不依赖内部实现细节</li><li><b>错误码统一</b>——全项目用同一套约定，而不是每个函数自己发明</li><li><b>可观测</b>——出问题时能从日志还原现场</li><li><b>可验证</b>——有测试用例，改动后能立刻知道有没有破坏原有行为</li></ol><p>L5 的练习不是学新语法，而是练这四件事的组合。</p>" },
      { t: "接口层与实现层的标准写法",
        h: "<p>以环形缓冲为例，接口头文件只暴露“能做什么”，不暴露“怎么做的”：</p>",
        code: "/* ringbuf.h —— 对外接口，使用方只 include 这个文件 */\n#ifndef RINGBUF_H\n#define RINGBUF_H\n\n#include <stddef.h>\n\ntypedef struct ringbuf ringbuf_t;   /* 不完整类型：调用者看不到内部字段 */\n\n/* 生命周期 */\nringbuf_t *rb_create(size_t cap);\nvoid       rb_destroy(ringbuf_t *rb);\n\n/* 数据操作：成功返回 0，失败返回负的错误码 */\nint rb_push(ringbuf_t *rb, unsigned char byte);\nint rb_pop(ringbuf_t *rb, unsigned char *out);\n\n/* 查询 */\nsize_t rb_size(const ringbuf_t *rb);\nsize_t rb_capacity(const ringbuf_t *rb);\n\n#endif /* RINGBUF_H */" },
      { t: "不完整类型带来了什么",
        h: "<p><code>typedef struct ringbuf ringbuf_t;</code> 只声明了“有这么个类型”，没告诉别人里面有什么。好处很实在：</p><ul><li>调用者无法直接访问内部字段，只能走接口——将来你换实现，他们不用改代码</li><li>结构体大小只在实现文件里可见，改内部布局不需要重新编译所有调用者</li><li>配合 <code>rb_create</code> / <code>rb_destroy</code>，资源的生命周期也被封装住了</li></ul><p>代价是多一次指针间接访问，以及需要显式的创建销毁——在资源紧张的嵌入式里，这个代价是值得的，因为它避免了全局变量满天飞。</p>" },
      { t: "统一错误码：小项目也要早做",
        h: "<p>不统一错误码的典型症状是：有的函数返回 -1 表示失败，有的返回 NULL，有的返回 false，还有的错误时什么都不返回但把数据写坏。上层代码只好写一堆 if 套 if。</p><p>统一约定建议用这几条：</p><ul><li><code>0</code> = 成功；负数是错误码；正数留给“实际长度/个数”这类返回值</li><li>错误码用枚举集中定义，不要散落魔数</li><li>每个错误码都要对应一句人能看懂的原因</li></ul>",
        code: "typedef enum {\n    RB_OK          =  0,\n    RB_ERR_PARAM   = -1,   /* 空指针或容量为 0 */\n    RB_ERR_NOMEM   = -2,   /* 内存不足 */\n    RB_ERR_FULL    = -3,   /* 队列已满 */\n    RB_ERR_EMPTY   = -4    /* 队列为空 */\n} rb_err_t;" },
      { t: "可观测性：日志要在“出问题之前”就埋好",
        h: "<p>日志不是出事了才加，而是写代码时就该有的。三条最低要求：</p><ul><li><b>记录输入和结果</b>：参数值 + 返回码，一句话就够</li><li><b>记录计数而不是刷屏</b>：错误计数比每条错误都打印更实用，尤其在没有串口的场景</li><li><b>分等级</b>：error 必须存，warn 可关，info 默认关</li></ul><p>嵌入式里日志最忌讳的是在中断里 printf——那会阻塞整个系统。正确做法是中断只置标志或投递到队列，由任务去写日志。</p>" },
      { t: "测试用例：让改动变安全的唯一办法",
        h: "<p>没有测试的项目，每次改动都是一次赌博。哪怕只有三条用例，也能挡住大部分低级事故：</p><ul><li><b>正常路径</b>：连续 push 几个再 pop，顺序对不对</li><li><b>边界</b>：push 满之后再 push 必须失败；空队列 pop 必须失败</li><li><b>异常</b>：传 NULL 不能崩</li></ul><p>本站编程任务里用 <code>// @case</code> 写测试用例，实验室测试台会真的执行并比对输出——这就是最小可用的回归测试。</p>" }
    ],
    quiz: [
      { type: "code", q: "编程任务（L5 综合）：实现一个分层的字节环形缓冲，含创建/销毁/push/pop/查询，并写测试输出。",
        hint: "内部用 struct 保存 buf 指针、head、tail、count、cap；push 满时返回 -3，pop 空时返回 -4，空指针返回 -1。",
        code: "/* L5 综合任务：环形缓冲（字节流）\n *\n * 要求：\n *   1. rb_create(cap)：cap 为 0 返回 NULL；分配失败返回 NULL\n *   2. rb_destroy(NULL) 必须安全（不崩）\n *   3. rb_push：满返回 -3，空指针返回 -1\n *   4. rb_pop：空返回 -4，空指针返回 -1\n *   5. rb_size / rb_capacity：空指针返回 0\n *\n * 提示：教学仿真没有真实堆，malloc 返回固定缓冲即可；\n *      也可以直接用静态数组实现，不必真的动态分配。\n *\n * 用例：cap=4 的缓冲，push 'a','b','c','d' 全成功，第 5 次失败\n *       pop 4 次依次得到 a,b,c,d，第 5 次失败\n *       输出格式：每个结果一行\n */\n#include <stdio.h>\n#include <stddef.h>\n\n#define RB_MAX 64\n\ntypedef struct {\n    unsigned char buf[RB_MAX];\n    size_t cap, head, tail, count;\n} rb_t;\n\nrb_t *rb_create(size_t cap) {\n    /* 在这里实现 */\n    return NULL;\n}\n\nint rb_push(rb_t *rb, unsigned char b) {\n    /* 在这里实现 */\n    return -1;\n}\n\nint rb_pop(rb_t *rb, unsigned char *out) {\n    /* 在这里实现 */\n    return -1;\n}\n\nsize_t rb_size(const rb_t *rb) {\n    /* 在这里实现 */\n    return 0;\n}\n\nint main(void) {\n    /* 在这里写测试：覆盖正常、满、空、NULL 四种情况 */\n    return 0;\n}",
        sol: "#include <stdio.h>\n#include <stddef.h>\n\n#define RB_MAX 64\n\ntypedef struct {\n    unsigned char buf[RB_MAX];\n    size_t cap, head, tail, count;\n    int used;\n} rb_t;\n\nstatic rb_t g_pool;\n\nrb_t *rb_create(size_t cap) {\n    if (cap == 0 || cap > RB_MAX) return NULL;\n    g_pool.cap = cap;\n    g_pool.head = 0;\n    g_pool.tail = 0;\n    g_pool.count = 0;\n    g_pool.used = 1;\n    return &g_pool;\n}\n\nint rb_push(rb_t *rb, unsigned char b) {\n    if (rb == NULL || !rb->used) return -1;\n    if (rb->count == rb->cap) return -3;\n    rb->buf[rb->tail] = b;\n    rb->tail = (rb->tail + 1) % rb->cap;\n    rb->count++;\n    return 0;\n}\n\nint rb_pop(rb_t *rb, unsigned char *out) {\n    if (rb == NULL || out == NULL || !rb->used) return -1;\n    if (rb->count == 0) return -4;\n    *out = rb->buf[rb->head];\n    rb->head = (rb->head + 1) % rb->cap;\n    rb->count--;\n    return 0;\n}\n\nsize_t rb_size(const rb_t *rb) {\n    if (rb == NULL) return 0;\n    return rb->count;\n}\n\nint main(void) {\n    rb_t *rb = rb_create(4);\n    unsigned char b;\n    int i;\n\n    /* 正常路径：连续 push 4 个 */\n    for (i = 0; i < 4; i++) {\n        printf(\"push %c -> %d\\n\", 'a' + i, rb_push(rb, (unsigned char)('a' + i)));\n    }\n    /* 边界：满了再 push */\n    printf(\"push full -> %d\\n\", rb_push(rb, 'z'));\n    /* 正常路径：pop 4 个 */\n    for (i = 0; i < 4; i++) {\n        int r = rb_pop(rb, &b);\n        printf(\"pop -> %d %c\\n\", r, b);\n    }\n    /* 边界：空了再 pop */\n    printf(\"pop empty -> %d\\n\", rb_pop(rb, &b));\n    /* 异常：空指针 */\n    printf(\"null push -> %d\\n\", rb_push(NULL, 'x'));\n    printf(\"null pop -> %d\\n\", rb_pop(rb, NULL));\n    printf(\"size -> %u\\n\", (unsigned)rb_size(rb));\n    return 0;\n}\n// @in\n// @case main => push a -> 0\\npush b -> 0\\npush c -> 0\\npush d -> 0\\npush full -> -3\\npop -> 0 a\\npop -> 0 b\\npop -> 0 c\\npop -> 0 d\\npop empty -> -4\\nnull push -> -1\\nnull pop -> -1\\nsize -> 0",
        exp: "L5 的核心不在环形缓冲本身，而在这几个工程习惯：\n① 失败路径全覆盖：满、空、NULL、容量非法，每一条都有明确的错误码，而不是“返回 -1 就完事”；\n② 用 count 作为不变量，空/满判断不依赖 head==tail 这种有歧义的写法；\n③ 测试用例覆盖正常、边界、异常三类，并且能稳定复现——这就是最小回归测试的价值；\n④ 教学仿真没有真实堆，所以用静态池代替 malloc，同时保留 rb_create/rb_destroy 的接口形态，将来换成真堆不需要改上层代码。" },
      { type: "single", q: "头文件里写 typedef struct ringbuf ringbuf_t;（不完整类型）的主要好处是？",
        opts: ["让编译更快", "调用者无法依赖内部布局，将来换实现不必改调用方代码", "可以省内存", "避免使用指针"],
        ans: 1,
        exp: "这叫信息隐藏。接口稳定 = 上层代码稳定。真实项目里换掉内部实现而不动上层，是“可维护”最直接的体现。代价是一次指针间接访问和显式的创建销毁。" },
      { type: "single", q: "在中断服务函数里直接调用 printf 打日志，最主要的问题是？",
        opts: ["printf 不能打印整数", "printf 内部可能加锁、涉及缓冲区并依赖硬件，在中断上下文里会造成阻塞或重入问题", "printf 会改变中断优先级", "完全没有问题"],
        ans: 1,
        exp: "中断里要尽量短、不能阻塞、不能依赖不可重入的库函数。正确做法是中断只记录事件（置标志、写环形缓冲），由任务去做格式化输出。这正是 L5 讲的“可观测性也要讲工程约束”。" },
      { type: "single", q: "一个函数在参数错误时返回 -1，另一个在参数错误时返回 NULL，还有一个直接返回 false。这样做的直接后果是？",
        opts: ["编译不过", "上层需要为每个函数记一套判断规则，抽象层无法统一处理错误", "运行更慢", "内存泄漏"],
        ans: 1,
        exp: "错误码不统一，抽象就漏了。上层无法写一份通用的错误处理，只能到处特判，最终结果是错误处理被省略——而省略错误处理正是线上故障的主要来源。所以小项目也应该尽早定义统一错误码。" }
    ]
  }

  ]
});


/* ==== data-zero1.js ==== */

/* ============================================================
   课程十三：C 语言零基础精讲（第 1-4 章）
   教师讲义式讲解：为什么 → 是什么 → 图 → 示例逐行 → 坑 → 面试 → 作业
   ============================================================ */
window.COURSES = window.COURSES || [];
window.COURSES.push({
  id: "zero",
  badge: "精讲",
  badgeCls: "cb-zero",
  title: "C 语言零基础精讲",
  brief: "像上课一样，从第一行代码讲到内存",
  desc: "10 章完整讲义：每章有概念引入、原理插图、示例逐行解析、常见坑、面试追问怎么答、课后练习与作业。真正从零到一，不需要另找资料。",
  goal: "能独立写出 100 行以内的 C 程序，讲清变量、分支、循环、函数、数组、指针、结构体与内存管理的基本原理。",
  roles: ["mcu", "rtos", "linux", "drv", "iot"],
  dep: [],
  chapters: [

  /* ---------------- 第 1 章 ---------------- */
  {
    id: "z1",
    title: "第 1 章 程序是怎么跑起来的",
    brief: "先理解全过程，再写下第一行代码",
    points: [
      { t: "开篇：为什么先学这个",
        h: "<p>很多同学学 C 语言的第一天就被\"编译\"\"链接\"\"段错误\"这些词搞懵，然后开始背语法。这是反的。正确顺序是：<b>先知道一行代码要经过哪些步骤才能变成 .exe 里的机器指令</b>，之后所有报错你都能立刻判断\"问题出在哪一步\"。</p><p>打个比方：写 C 语言像<strong>写菜谱</strong>（人看得懂），编译像<strong>翻译成厨房机器人能执行的指令</strong>（机器看得懂），链接像<strong>把多份菜谱和调料包装订成一本完整的操作手册</strong>。你写的代码机器不能直接跑，中间必须经过这层翻译。</p><p><b>本章目标</b>：能说出编译的四个步骤、每步的产物与常见报错；能独立写出、编译、运行第一个程序。</p>" },
      { t: "核心概念：四步编译，一步都不能少",
        h: "<table><tr><th>步骤</th><th>输入</th><th>输出</th><th>做了什么</th><th>这一步的典型报错</th></tr><tr><td>预处理</td><td>hello.c</td><td>hello.i</td><td>展开 #include 头文件、替换 #define 宏、处理条件编译</td><td>找不到头文件：<code>No such file or directory</code></td></tr><tr><td>编译</td><td>hello.i</td><td>hello.s</td><td>把 C 语句翻译成汇编，做语法检查与优化</td><td>语法错误：<code>expected ';'</code>（少分号）</td></tr><tr><td>汇编</td><td>hello.s</td><td>hello.o</td><td>把汇编翻译成机器码（目标文件）</td><td>汇编语法错误（手写汇编才遇到）</td></tr><tr><td>链接</td><td>多个 .o + 库</td><td>a.out</td><td>把目标文件与库函数实现拼在一起，分配地址</td><td><code>undefined reference to 'foo'</code>（函数只有声明没有实现）</td></tr></table><p><b>关键理解</b>：语法错误在<b>编译</b>阶段报，找不到函数实现在<b>链接</b>阶段报。看出报错类型就能立刻缩小排查范围——这是新手和熟手的第一道差距。</p>",
    next: ["z1:6"],
    vs: [
          { t: "编译错误 vs 链接错误", d: "编译错误是语法 / 类型问题，报在某个 .c 文件里；链接错误是「找不到实现」，报的是符号名（undefined reference）。", to: "z1:6" },
          { t: "预处理 vs 编译", d: "预处理只做文本层面的事（展开头文件、替换宏、条件编译），不做语法检查；真正的语法检查在编译阶段。" }
        ],
    why: "读懂编译错误的前提：知道错误是哪个阶段报的，才知道要改什么。"
  },
      { t: "图示：从源代码到可执行文件",
        h: "<p>下图是完整链路。注意每个方框上标的是<b>产物文件名</b>，下方标的是<b>这一步在做什么</b>。中间任何一步失败，后面都不会执行。</p><svg viewBox='0 0 680 150' width='100%' role='img'><rect x='30' y='34' width='100' height='46' rx='8' fill='#eef3ff' stroke='#2b5cff'/><text x='80' y='54' text-anchor='middle' font-size='12' fill='#1c2333'>hello.c</text><text x='80' y='70' text-anchor='middle' font-size='10.5' fill='#5a6478'>我写的源码</text><line x1='130' y1='57' x2='152' y2='57' stroke='#8b98b0' stroke-width='1.2' marker-end='url(#ar)'/><rect x='155' y='34' width='100' height='46' rx='8' fill='#f4f7ff' stroke='#7f9cf5'/><text x='205' y='54' text-anchor='middle' font-size='12' fill='#1c2333'>hello.i</text><text x='205' y='70' text-anchor='middle' font-size='10.5' fill='#5a6478'>预处理</text><line x1='255' y1='57' x2='277' y2='57' stroke='#8b98b0' stroke-width='1.2' marker-end='url(#ar)'/><rect x='280' y='34' width='100' height='46' rx='8' fill='#f4f7ff' stroke='#7f9cf5'/><text x='330' y='54' text-anchor='middle' font-size='12' fill='#1c2333'>hello.s</text><text x='330' y='70' text-anchor='middle' font-size='10.5' fill='#5a6478'>编译（查语法）</text><line x1='380' y1='57' x2='402' y2='57' stroke='#8b98b0' stroke-width='1.2' marker-end='url(#ar)'/><rect x='405' y='34' width='100' height='46' rx='8' fill='#f4f7ff' stroke='#7f9cf5'/><text x='455' y='54' text-anchor='middle' font-size='12' fill='#1c2333'>hello.o</text><text x='455' y='70' text-anchor='middle' font-size='10.5' fill='#5a6478'>汇编（机器码）</text><line x1='505' y1='57' x2='527' y2='57' stroke='#8b98b0' stroke-width='1.2' marker-end='url(#ar)'/><rect x='530' y='34' width='120' height='46' rx='8' fill='#e8fbf3' stroke='#0e9f6e'/><text x='590' y='54' text-anchor='middle' font-size='12' fill='#1c2333'>hello（可执行）</text><text x='590' y='70' text-anchor='middle' font-size='10.5' fill='#0f7a52'>链接（拼库+定地址）</text><text x='80' y='104' text-anchor='middle' font-size='10.5' fill='#e02424'>缺头文件</text><line x1='80' y1='88' x2='80' y2='96' stroke='#e02424' stroke-width='1'/><text x='330' y='104' text-anchor='middle' font-size='10.5' fill='#e02424'>语法错误在这报</text><line x1='330' y1='88' x2='330' y2='96' stroke='#e02424' stroke-width='1'/><text x='590' y='104' text-anchor='middle' font-size='10.5' fill='#e02424'>undefined reference 在这报</text><line x1='590' y1='88' x2='590' y2='96' stroke='#e02424' stroke-width='1'/><defs><marker id='ar' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='6' markerHeight='6' orient='auto-start-reverse'><path d='M2 1L8 5L2 9' fill='none' stroke='#8b98b0' stroke-width='1.4'/></marker></defs></svg>" },
      { t: "示例：第一个程序，逐行拆开讲",
        h: "<p>逐行解释（<b>每一行都要能说清作用</b>，面试第一课就问这个）：</p><ul><li><b>第 1 行</b><code>#include &lt;stdio.h&gt;</code>：以 # 开头的是预处理指令。stdio = standard input output，这个头文件里声明了 printf。不含它，编译器就不认识 printf，会警告 <code>implicit declaration</code>。</li><li><b>第 3 行</b><code>int main(void)</code>：程序的入口函数，操作系统从这里开始执行。int 表示返回一个整数给系统，void 表示不接收参数。</li><li><b>第 4-7 行</b>大括号：函数体，语句必须以分号结尾（这是 C 语言的硬规定，别问为什么，记牢）。</li><li><b>第 5 行</b><code>printf(\"Hello, World!\\n\");</code>：printf 是\"按规则格式化输出到屏幕\"的函数；引号里是格式字符串；<code>\\n</code> 是转义字符，表示换行（两个字符的组合，代表一个换行符）。</li><li><b>第 6 行</b><code>return 0;</code>：把 0 返回给操作系统，表示\"正常结束\"。非 0 通常表示出错。Linux 里可以用 <code>echo $?</code> 查看这个返回值。</li></ul>",
        code: "#include <stdio.h>\n\nint main(void)\n{\n    printf(\"Hello, World!\\n\");\n    return 0;\n}",
    next: ["z2:2"],
    vs: [
          { t: "一次报 20 条错怎么办", d: "只看第一条。编译器报错常常连锁——第一条是真的，后面全是它引发的假象。" }
        ]
  },
      { t: "编译与运行：命令逐条解释",
        h: "<p>把上面代码保存为 hello.c，在终端里执行：</p>",
        code: "# 最常用的一条：编译并生成可执行文件\n#   gcc      : 编译器\n#   hello.c  : 输入源文件\n#   -o hello : 输出的可执行文件名\n#   -Wall    : 打开所有常用警告（强烈建议永远加上）\ngcc -Wall hello.c -o hello\n\n# 运行（Windows 是 .\\hello.exe）\n./hello\n# 输出：Hello, World!\n\n# 如果只想检查语法、不生成可执行文件：\ngcc -Wall -fsyntax-only hello.c\n\n# 分步执行，观察每一步的产物：\ngcc -E hello.c -o hello.i    # 预处理\ngcc -S hello.i -o hello.s    # 编译\ngcc -c hello.s -o hello.o    # 汇编\ngcc hello.o -o hello         # 链接" },
      { t: "常见错误与坑（新手必踩）",
        h: "<ul><li><b>写成中文标点</b>：<code>；</code>（全角分号）和 <code>;</code> 编译器分不清，会报一堆莫名其妙的错。输入法切英文</li><li><b>忘 #include &lt;stdio.h&gt;</b>：printf 未声明，可能出现奇怪输出或崩溃</li><li><b>main 写成 mian / Main</b>：链接报 <code>undefined reference to 'main'</code></li><li><b>缺少分号</b>：报错行号常常指向<b>下一行</b>，别只盯着报错那一行看</li><li><b>不加 -Wall</b>：类型不匹配、未使用变量等隐患被静默放过</li><li>把 <code>\\n</code> 写成 <code>/n</code>：反斜杠才是转义符，<code>/n</code> 会原样打印 /n</li></ul>" },
      { t: "面试怎么答：编译流程类问题",
        h: "<p><b>问：C 程序的编译过程分为几步？</b></p><p>答：四步。<b>预处理</b>展开头文件与宏替换，产物 .i；<b>编译</b>翻译成汇编并做语法检查，产物 .s；<b>汇编</b>生成机器码目标文件 .o；<b>链接</b>把多个目标文件与库函数拼装、分配地址，生成可执行文件。语法错误在编译期发现，未定义引用（undefined reference）在链接期发现。</p><p><b>追问：预处理具体做了什么？</b>答：① 把 #include 的头文件内容原样插入；② 把 #define 的宏做文本替换；③ 处理 #if/#ifdef 等条件编译；④ 去掉注释。注意它只是\"文本操作\"，不懂语法。</p><p><b>追问：为什么头文件里一般只放声明？</b>答：因为头文件会被多个 .c 包含，若放函数实现，链接时同一符号出现多份定义会报重复定义错误。声明（原型）可以重复，定义不可以。</p>" },
      { t: "课后练习与作业",
        h: "<p><b>课堂练习</b>（做完本章题目）：3 道单选题检验概念，2 道读程序题，1 道编程任务。</p><p><b>作业（务必亲手做）</b>：</p><ol><li>敲一遍 hello.c，<b>故意删掉分号</b>，看报错行号并解释为什么指向下一行；</li><li>用 <code>gcc -E</code> 预处理后打开 .i 文件，找到 printf 的声明，体会\"头文件是插入进来的\"；</li><li>故意调用一个不存在的函数（如 foo()），观察链接阶段的报错信息并抄下来；</li><li>把 main 改名成 mian，观察链接报错。</li></ol><p><b>完成后你应该能回答</b>：报错信息 <code>expected ';'</code> 和 <code>undefined reference</code> 分别属于哪个阶段？</p>" }
    ],
    quiz: [
      { type: "single", q: "C 程序的编译过程，正确的顺序是？",
        opts: ["编译 → 预处理 → 链接 → 汇编", "预处理 → 编译 → 汇编 → 链接", "预处理 → 汇编 → 编译 → 链接", "汇编 → 编译 → 预处理 → 链接"], ans: 1,
        exp: "记忆锚点：预处理处理 # 开头的文本，编译翻译成汇编（查语法），汇编生成机器码，最后链接拼装成可执行文件。" },
      { type: "single", q: "报错 \"undefined reference to `foo`\" 说明什么？",
        opts: ["语法写错了", "链接阶段找不到 foo 的函数实现（只声明了没定义，或没链接对应库）", "头文件没包含", "机器码生成失败"], ans: 1,
        exp: "这是链接错误而不是语法错误。常见原因：函数只有声明没写实现、函数名拼错、忘记加 -lm 之类的库。学会用它反推问题所在阶段，能省很多时间。" },
      { type: "single", q: "语句末尾的分号是给谁看的？",
        opts: ["给人看的，可以省略", "给编译器看的：它是语句结束的标记，编译阶段就需要", "给链接器看的", "给操作系统看的"], ans: 1,
        exp: "分号在编译阶段被解析，少了会直接语法错误。报错行号常指向下一行，因为编译器读到下一行才发现上一条语句没结束。" },
      { type: "blank", q: "补全命令：编译 hello.c 生成名为 hello 的可执行文件，并打开所有警告。",
        code: "gcc {{0}} hello.c -o hello",
        blanks: [{ acc: ["-Wall"] }],
        exp: "养成永远加 -Wall 的习惯。警告往往是 bug 的前兆，尤其是类型不匹配（printf 格式符与参数不一致这类）。" },
      { type: "judge", q: "#include <stdio.h> 的作用是让编译器在预处理阶段把该头文件的内容插入到这一行位置。", ans: true,
        exp: "这就是\"展开\"的含义。可以用 gcc -E 生成 .i 文件亲眼看到插入结果——比背结论更让人信服。" },
      { type: "blank", q: "读程序写输出：",
        code: "#include <stdio.h>\nint main(void)\n{\n    printf(\"A\\nB\\n\");\n    return 0;\n}",
        blanks: [{ acc: ["AB"] }],
        exp: "\\n 让两行分开打印为 A 和 B（上下两行）。题目要求\"连续无空格\"，所以填 AB。" },
      { type: "code", q: "编程任务：写一个程序，打印出你的姓名、学校/培训班名称和一句自我介绍，共三行；要求用一次 printf 完成（提示：用 \\n 换行），并在最后返回 0。",
        hint: "<p>一个 printf 里可以写多个 \\n 换行；注意所有标点都要用英文（除非在字符串里想输出内容）。</p>",
        sol: "#include <stdio.h>\n\nint main(void)\n{\n    /* 一次 printf 输出三行：用 \\n 分隔 */\n    printf(\"姓名：张三\\n\"\n           \"培训班：GZ2619 嵌入式\\n\"\n           \"自我介绍：正在从零开始学 C 语言，目标嵌入式开发岗。\\n\");\n    return 0;\n}\n\n/* 说明：\n * 相邻的字符串字面量会被编译器自动拼接，\n * 所以可以把长字符串拆成多行写，便于阅读，效果完全一样。\n */",
        exp: "这个任务练两件事：① \\n 的用法（一个 printf 输出多行）；② 字符串自动拼接写法（长字符串拆行更易读）。编译运行后能一次看到三行输出就算完成。" }
    ]
  },

  /* ---------------- 第 2 章 ---------------- */
  {
    id: "z2",
    title: "第 2 章 变量与数据类型",
    brief: "给数据找合适的\"盒子\"",
    points: [
      { t: "开篇：为什么需要\"类型\"",
        h: "<p>程序本质是<b>处理数据</b>：算价格、算温度、记状态。数据得先存在内存里才能处理，而内存就是一大堆编号的字节（每个字节 8 位）。问题来了——我往地址 0x1000 处写了 4 个字节，这段数据到底是\"整数 100\"还是\"浮点数 0.5\"还是\"4 个字符\"？</p><p><b>类型就是给这段内存的解释说明书</b>：告诉编译器占几个字节、怎么解读、能做哪些运算。<code>int</code> 表示\"按 4 字节有符号整数解读\"，<code>float</code> 表示\"按 IEEE 754 单精度浮点解读\"。</p><p><b>本章目标</b>：会选类型、会用 sizeof 验证、理解有无符号与取值范围、会做进制的换算。</p>" },
      { t: "核心概念：常用类型与取值范围",
        h: "<table><tr><th>类型</th><th>字节数</th><th>取值范围</th><th>典型用途</th></tr><tr><td>char / unsigned char</td><td>1</td><td>-128~127 / 0~255</td><td>字符、原始字节数据</td></tr><tr><td>short</td><td>2</td><td>-32768~32767</td><td>省内存的小整数</td></tr><tr><td>int</td><td>4</td><td>约 ±21 亿</td><td>通用整数（默认选择）</td></tr><tr><td>long / long long</td><td>4 或 8 / 8</td><td>更大范围</td><td>大数值、时间戳</td></tr><tr><td>float</td><td>4</td><td>约 ±3.4e38，精度 6~7 位有效数字</td><td>一般浮点计算</td></tr><tr><td>double</td><td>8</td><td>约 ±1.8e308，精度 15~16 位</td><td>精度要求高的计算</td></tr></table><p><b>取值范围怎么来的</b>：n 位无符号 = 0 ~ 2ⁿ-1；n 位有符号 = -2ⁿ⁻¹ ~ 2ⁿ⁻¹-1。所以 8 位有符号是 -128~127，注意负数比正数多一个（因为 0 占了正数侧的一个位置）。</p>",
    kp: ["z1:2"],
    next: ["z2:4", "e1:1", "c2:1"],
    vs: [
          { t: "sizeof(数组) vs sizeof(指针)", d: "数组名在同一作用域内 sizeof 得整个数组字节数；一旦传进函数退化成指针，sizeof 恒为 8（64 位）。" }
        ]
  },
      { t: "图示：变量在内存里长什么样",
        h: "<p>下图左边是内存地址（示意），右边是每个字节。三个变量从上往下依次存放：<code>char c</code> 占 1 字节，<code>int a</code> 占 4 字节，<code>double d</code> 占 8 字节。<b>变量的类型决定它占几格</b>，这就是 sizeof 的含义。</p><svg viewBox='0 0 680 200' width='100%' role='img'><text x='30' y='24' font-size='12' fill='#1c2333'>内存（地址只是示意，真实地址由系统分配）</text><rect x='150' y='36' width='90' height='26' fill='#eef3ff' stroke='#2b5cff'/><text x='195' y='53' text-anchor='middle' font-size='11' fill='#1c2333'>0x1000</text><rect x='240' y='36' width='90' height='26' fill='#eef3ff' stroke='#2b5cff'/><text x='285' y='53' text-anchor='middle' font-size='11' fill='#1c2333'>0x1001</text><rect x='330' y='36' width='90' height='26' fill='#eef3ff' stroke='#2b5cff'/><text x='375' y='53' text-anchor='middle' font-size='11' fill='#1c2333'>0x1002</text><rect x='420' y='36' width='90' height='26' fill='#eef3ff' stroke='#2b5cff'/><text x='465' y='53' text-anchor='middle' font-size='11' fill='#1c2333'>0x1003</text><rect x='510' y='36' width='90' height='26' fill='#eef3ff' stroke='#2b5cff'/><text x='555' y='53' text-anchor='middle' font-size='11' fill='#1c2333'>0x1004</text><rect x='600' y='36' width='50' height='26' fill='#f6f7fa' stroke='#c8cfdb'/><text x='625' y='53' text-anchor='middle' font-size='10.5' fill='#8b98b0'>…</text><rect x='150' y='76' width='90' height='30' fill='#e8fbf3' stroke='#0e9f6e'/><text x='195' y='95' text-anchor='middle' font-size='11.5' fill='#0f7a52'>char c</text><rect x='240' y='76' width='360' height='30' fill='#fff4e6' stroke='#ea580c'/><text x='420' y='95' text-anchor='middle' font-size='11.5' fill='#b45309'>int a（4 字节）</text><rect x='150' y='120' width='90' height='45' fill='#f4f0ff' stroke='#7c3aed'/><text x='195' y='146' text-anchor='middle' font-size='11.5' fill='#5b21b6'>double d</text><rect x='240' y='120' width='360' height='45' fill='#fdf2f8' stroke='#db2777'/><text x='420' y='146' text-anchor='middle' font-size='11.5' fill='#9d174d'>double d（8 字节）</text><text x='70' y='95' font-size='11.5' fill='#5a6478'>1 格</text><text x='55' y='146' font-size='11.5' fill='#5a6478'>2 格 → 展开占 8 格</text><text x='150' y='188' font-size='11.5' fill='#5a6478'>sizeof(char)=1　sizeof(int)=4　sizeof(double)=8</text></svg>" },
      { t: "核心概念：溢出与类型转换",
        h: "<p><b>溢出</b>：给变量赋值超出它的范围会怎样？<b>无符号数会\"回绕\"</b>（256 存不进 uint8_t，变成 0；255+1 也是 0），<b>有符号数溢出是未定义行为</b>（可能得到意外结果）。嵌入式里读传感器、算时间差经常踩这个坑，所以宁可算完前放大类型。</p><p><b>自动类型转换（隐式）</b>：不同类型混合运算时，范围小的自动提升为范围大的（char/short → int → long → float → double）。所以 <code>1 + 2.0</code> 的结果是 double。</p><p><b>强制转换（显式）</b>：<code>(int)3.9</code> 得到 3（向零截断，不是四舍五入）。想四舍五入要写 <code>(int)(x + 0.5)</code>——只对正数成立。</p>",
        code: "#include <stdio.h>\n#include <stdint.h>\n\nint main(void)\n{\n    uint8_t u = 255;\n    u = u + 1;              /* 回绕：255+1 = 0 */\n    printf(\"u = %u\\n\", u);      /* 0 */\n\n    int i = 3.99;\n    printf(\"i = %d\\n\", i);      /* 3，截断不是四舍五入 */\n\n    printf(\"7/2 = %d\\n\", 7 / 2);       /* 3：整数除法 */\n    printf(\"7/2.0 = %.2f\\n\", 7 / 2.0); /* 3.50：有浮点参与 */\n\n    printf(\"sizeof(int) = %zu\\n\", sizeof(int));\n    return 0;\n}",
    kp: ["z2:2"],
    next: ["e1:2", "c2:4"],
    vs: [
          { t: "溢出 vs 截断", d: "溢出是超出目标类型的表示范围（结果回绕）；截断是大类型赋值给小类型时高位被直接丢掉。两者都静默发生，编译器通常不报错。" },
          { t: "有符号 vs 无符号比较", d: "有符号与无符号混比时，有符号会被转成无符号再比，于是 -1 > 0 成立。这是嵌入式里极其常见的 bug。" }
        ]
  },
      { t: "核心概念：进制与 sizeof 的用法",
        h: "<p>嵌入式必须熟练三种进制：<b>二进制</b>（看位）、<b>十六进制</b>（缩写二进制，4 位一组）、<b>十进制</b>（人习惯）。C 语言写法：<code>0x1F</code> 十六进制，<code>017</code> 八进制（注意前导 0！），十进制直接写。</p><p><b>十六进制速记</b>：0x1 = 1, 0xA = 10, 0xF = 15, 0x10 = 16, 0xFF = 255, 0x100 = 256。看到 0xFF 要立刻想到\"一个字节全 1\"。</p><p><b>sizeof 的正确用法</b>：它是运算符（编译期求值），<code>sizeof(变量)</code> 或 <code>sizeof 变量</code> 都行；求数组元素个数用 <code>sizeof(a)/sizeof(a[0])</code>；打印用 <code>%zu</code>（size_t 类型）。</p>",
    next: ["e1:1"],
    vs: [
          { t: "sizeof 是运算符不是函数", d: "它在编译期求值，所以 sizeof(i++) 里的 i 根本不会自增。" }
        ]
  },
      { t: "常见错误与坑",
        h: "<ul><li><b>八进制陷阱</b>：<code>int x = 010;</code> 不是 10 而是 8。给数字补前导 0 是本能的排版习惯，在 C 里是个 bug</li><li><b>整数除法</b>：<code>3/2</code> 得 1，算平均值、比例时必须转成浮点：<code>(double)sum / n</code></li><li><b>浮点相等比较</b>：<code>0.1+0.2 == 0.3</code> 不成立！要用误差范围 <code>fabs(a-b) &lt; 1e-6</code></li><li><b>用 %d 打印 float</b>：格式符与类型必须匹配，否则输出垃圾值（编译警告会提示，所以务必开 -Wall）</li><li><b>变量未初始化</b>：局部变量的初值是垃圾值，可能让程序行为诡异。<b>定义时就初始化</b>是铁律</li><li><b>把 char 当字符串</b>：<code>'a'</code> 是字符（1 字节），<code>\"a\"</code> 是字符串（2 字节，含 \\0）</li></ul>" },
      { t: "面试怎么答：类型相关追问",
        h: "<p><b>问：sizeof(int) 是多少？</b>答：C 标准只规定\"不小于 short\"，具体由平台决定。常见 32/64 位平台上 int 是 4 字节。要跨平台确定宽度就用 <code>&lt;stdint.h&gt;</code> 的 int8_t/uint16_t/uint32_t。</p><p><b>问：unsigned 和 signed 的区别，什么时候用？</b>答：最高位是否当符号位。取值范围不同：8 位 unsigned 是 0~255，signed 是 -128~127。嵌入式处理原始字节、位掩码、寄存器时应显式用 unsigned，避免右移补符号位等意外行为。</p><p><b>追问：为什么无符号数减到负数不会报错反而变成大数？</b>答：无符号运算按模 2ⁿ 回绕（C 标准明确规定），所以 0-1 会得到 255。这不是 bug 而是定义行为；但工程上要注意\"时间差计算\"\"余额扣减\"这类场景，否则会得到荒唐的大数。</p><p><b>追问：浮点为什么不能直接比相等？</b>答：二进制无法精确表示 0.1 这类十进制小数，存储与运算都有舍入误差。判断相等要用绝对误差（fabs(a-b)&lt;eps）或相对误差。</p>" },
      { t: "课后练习与作业",
        h: "<p><b>作业</b>：</p><ol><li>写程序打印出 char/short/int/long/float/double 的 sizeof，记录你机器上的结果；</li><li>验证 <code>int i = 3.99;</code> 与 <code>(int)(3.99 + 0.5)</code> 的差别并解释；</li><li>写程序输出 0x1F、017、0b1010（GCC 扩展）的十进制值，解释八进制那个为什么不是 31；</li><li>故意让 uint8_t 从 0 减到 -1，打印结果并说明回绕规则。</li></ol><p><b>完成后你应该能回答</b>：为什么算平均值时要先转 double？</p>" }
    ],
    quiz: [
      { type: "single", q: "为什么需要\"数据类型\"这个概念？",
        opts: ["为了少写代码", "内存只是字节序列，类型告诉编译器这段数据占几字节、如何解释（整数/浮点/字符）、能做哪些运算", "为了让变量名更好看", "为了让程序运行更快"], ans: 1,
        exp: "这是理解 C 语言的地基：同一串比特，按 int 解释是 100，按 float 解释可能是 1.4e-43。类型就是解释说明书。" },
      { type: "single", q: "8 位有符号整数的取值范围是？",
        opts: ["-127 ~ 127", "-128 ~ 127", "0 ~ 255", "-128 ~ 128"], ans: 1,
        exp: "n 位有符号 = -2^(n-1) ~ 2^(n-1)-1。负数比正数多一个，因为 0 占据了正数侧的一个编码。" },
      { type: "single", q: "int x = 010; 中 x 的值是？",
        opts: ["10", "8", "100", "编译错误"], ans: 1,
        exp: "以 0 开头是八进制！010 = 1×8 + 0 = 8。这是排版习惯引发的经典 bug，写十进制千万别补前导 0。" },
      { type: "blank", q: "读程序写输出（数字连续，无空格）：",
        code: "int a = 7, b = 2;\nprintf(\"%d\", a / b);\nprintf(\"%d\", (int)(a / 2.0));",
        blanks: [{ acc: ["33"] }],
        exp: "第一个是整数除法 7/2 = 3；第二个分母是 2.0，先做浮点除法得 3.5，再强制转 int 截断得 3。连起来输出 33。" },
      { type: "single", q: "算一批整数的平均值，正确写法是？",
        opts: ["avg = sum / n;", "avg = (double)sum / n;", "avg = sum / (double)n; 与前者等价，都行", "avg = sum * 1.0 / n; 与前者等价，都行"], ans: 1,
        exp: "关键是把参与运算的一边转成浮点，让除法走浮点路径。选项 C、D 也对——总之不能让两个 int 相除。这就是\"整数除法\"最常踩的地方。" },
      { type: "judge", q: "在 32 位和 64 位平台上，long 类型的大小一定相同。", ans: false,
        exp: "C 标准只规定 long ≥ int。Linux 32 位是 4 字节，Linux 64 位是 8 字节（Windows 64 位是 4 字节）。要确定性宽度就用 stdint.h 的 int32_t/int64_t。" },
      { type: "blank", q: "读程序写输出：",
        code: "uint8_t x = 200;\nx = x + 100;\nprintf(\"%u\\n\", x);",
        blanks: [{ acc: ["44"] }],
        exp: "300 超出 8 位范围，按模 256 回绕：300 - 256 = 44。无符号回绕是标准定义行为，不是未定义。" },
      { type: "code", q: "编程任务：写一个程序，定义你的身高（double）、年龄（int）、首字母（char）、学号（long）四个变量并初始化，用一次 printf 按格式输出，同时打印每个变量占用的字节数。",
        hint: "<p>格式符要匹配类型：double 用 %.2f，int 用 %d，char 用 %c，long 用 %ld，sizeof 用 %zu。注意 printf 里格式符顺序必须与参数顺序一致。</p>",
        sol: "#include <stdio.h>\n\nint main(void)\n{\n    double height = 175.5;     /* 身高 cm */\n    int    age    = 22;        /* 年龄 */\n    char   initial = 'L';      /* 姓氏首字母 */\n    long   stu_id = 2026001234L;\n\n    /* 一组 printf 按行输出，便于对照格式符 */\n    printf(\"身高 %.1f cm（占 %zu 字节）\\n\", height, sizeof(height));\n    printf(\"年龄 %d 岁（占 %zu 字节）\\n\",   age,    sizeof(age));\n    printf(\"首字母 %c（占 %zu 字节）\\n\",   initial, sizeof(initial));\n    printf(\"学号 %ld（占 %zu 字节）\\n\",    stu_id, sizeof(stu_id));\n\n    /* 也可以用一行输出：注意格式符顺序与参数顺序严格对应 */\n    printf(\"合计占用 %zu 字节\\n\",\n           sizeof(height) + sizeof(age) + sizeof(initial) + sizeof(stu_id));\n    return 0;\n}\n\n/* 课堂追问：\n * 1) long 用 %ld 而不是 %d，因为宽度不同；\n * 2) 想跨平台确定宽度，应使用 <stdint.h> 的 int32_t / int64_t；\n * 3) sizeof 返回 size_t，用 %zu 打印最标准（老编译器可用 %lu）。\n */",
        exp: "这个任务把\"类型—格式符—sizeof\"三件事串起来练。做完你会对每种类型占几字节、该用什么格式符有肌肉记忆，这是后面所有输入输出题的前提。" }
    ]
  },

  /* ---------------- 第 3 章 ---------------- */
  {
    id: "z3",
    title: "第 3 章 运算符与表达式",
    brief: "让数据开始\"算账\"",
    points: [
      { t: "开篇：表达式是什么",
        h: "<p><b>表达式</b> = 由变量、常量、运算符组成的式子，它会算出一个值。<code>a + b * 2</code> 是表达式，它有一个结果值，可以赋给变量、可以放进 if 判断。</p><p>本章把运算符分成五类来学，每类都只讲两件事：<b>它做什么</b>、<b>最容易踩的坑在哪</b>。学完要能达到\"看一个表达式能口算结果\"。这是笔试第一题就考的能力。</p><p><b>本章目标</b>：能手算混合表达式、说清短路求值、分清前置后置自增、背下优先级几条硬规则。</p>" },
      { t: "第一类：算术运算符",
        h: "<p><code>+ - * / %</code>（还有自增 ++、自减 --）。三条必须记牢的规则：</p><ul><li><b>整数相除只取整数部分</b>：7/2 = 3（不是 3.5），-7/2 = -3（向零截断）</li><li><b>% 只能用于整数</b>：7%2 = 1（取余数）。想对浮点取余要用 fmod()</li><li><b>正负号跟随被除数</b>：7%-3 = 1，-7%3 = -1</li></ul><p><b>实用技巧</b>：判断奇偶用 <code>x % 2</code>（0 为偶）；判断能否被 n 整除用 <code>x % n == 0</code>；循环取模做周期性任务（如每 100 次刷一次屏）用 <code>i % 100 == 0</code>。</p>" },
      { t: "第二类：关系与逻辑运算符（含图示）",
        h: "<p>关系：<code>&gt; &gt;= &lt; &lt;= == !=</code>，结果是 <b>1（真）或 0（假）</b>。逻辑：<code>&amp;&amp;</code> 与、<code>||</code> 或、<code>!</code> 非。</p><p><b>短路求值</b>是重点：<code>a &amp;&amp; b</code> 中若 a 为假则 b <b>根本不执行</b>；<code>a || b</code> 中若 a 为真则 b 不执行。下面的图说明执行路径。</p>",
        code: "int i = 0;\nif (i != 0 && 10 / i > 1) {   /* i==0 时右边不会执行，避免除零 */ }\n\nint p = 5;\nif (p > 0 || ++p < 0) { }     /* ++p 不会执行，p 仍然是 5 */\nprintf(\"%d\\n\", p);            /* 5 */" },
      { t: "图示：短路求值的两条路径",
        h: "<p>左图是 <code>A &amp;&amp; B</code>：A 为假就直接得出假，B 被跳过（这既省时间，也能用来做保护）。右图是 <code>A || B</code>：A 为真就直接得出真。</p><svg viewBox='0 0 680 190' width='100%' role='img'><text x='40' y='22' font-size='12' fill='#1c2333'>A &amp;&amp; B</text><rect x='40' y='34' width='110' height='38' rx='8' fill='#eef3ff' stroke='#2b5cff'/><text x='95' y='58' text-anchor='middle' font-size='11.5' fill='#1c2333'>计算 A</text><line x1='150' y1='53' x2='186' y2='53' stroke='#8b98b0' stroke-width='1.2' marker-end='url(#a2)'/><rect x='190' y='34' width='86' height='38' rx='8' fill='#f6f7fa' stroke='#c8cfdb'/><text x='233' y='58' text-anchor='middle' font-size='11.5' fill='#5a6478'>A 为假?</text><line x1='233' y1='72' x2='233' y2='100' stroke='#e02424' stroke-width='1.2' marker-end='url(#a2)'/><text x='233' y='118' text-anchor='middle' font-size='11' fill='#e02424'>直接得假，B 不执行</text><line x1='276' y1='53' x2='312' y2='53' stroke='#8b98b0' stroke-width='1.2' marker-end='url(#a2)'/><text x='300' y='44' text-anchor='middle' font-size='10.5' fill='#0e9f6e'>否</text><rect x='316' y='34' width='110' height='38' rx='8' fill='#e8fbf3' stroke='#0e9f6e'/><text x='371' y='58' text-anchor='middle' font-size='11.5' fill='#0f7a52'>计算 B</text><text x='440' y='58' font-size='11' fill='#5a6478'>← 只有 A 为真才算 B</text><text x='400' y='22' font-size='12' fill='#1c2333'>A || B</text><rect x='400' y='118' width='110' height='38' rx='8' fill='#eef3ff' stroke='#2b5cff'/><text x='455' y='142' text-anchor='middle' font-size='11.5' fill='#1c2333'>计算 A</text><line x1='510' y1='137' x2='546' y2='137' stroke='#8b98b0' stroke-width='1.2' marker-end='url(#a2)'/><rect x='550' y='118' width='86' height='38' rx='8' fill='#f6f7fa' stroke='#c8cfdb'/><text x='593' y='142' text-anchor='middle' font-size='11.5' fill='#5a6478'>A 为真?</text><line x1='593' y1='118' x2='593' y2='96' stroke='#0e9f6e' stroke-width='1.2' marker-end='url(#a2)'/><text x='593' y='88' text-anchor='middle' font-size='11' fill='#0e9f6e'>直接得真，B 不执行</text><text x='360' y='180' font-size='11.5' fill='#5a6478'>用短路做保护：if (p != NULL &amp;&amp; p-&gt;value &gt; 0) —— p 为空时绝不解引用</text><defs><marker id='a2' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='6' markerHeight='6' orient='auto-start-reverse'><path d='M2 1L8 5L2 9' fill='none' stroke='#8b98b0' stroke-width='1.4'/></marker></defs></svg>" },
      { t: "第三类：自增自减的前置后置",
        h: "<p><code>++i</code>（前置）：先把 i 加 1，再用新值参与运算；<code>i++</code>（后置）：先用 i 的旧值参与运算，运算后再加 1。<b>单独成句时两者没区别</b>，混在表达式里就有区别。</p>",
        code: "int i = 5;\nint a = ++i;    /* i 先变 6，a = 6 */\nint b = i++;    /* b = 6（用旧值），然后 i 变 7 */\nprintf(\"i=%d a=%d b=%d\\n\", i, a, b);   /* i=7 a=6 b=6 */\n\n/* 危险写法（未定义行为，不同编译器结果可能不同） */\n/* int x = i++ + i++;   绝对不要这么写 */" },
      { t: "第四类：赋值与复合赋值",
        h: "<p><code>=</code> 是赋值，<code>==</code> 才是判断相等。这个区别造成的 bug 数量在 C 语言里能排前二。</p><p>复合赋值 <code>+= -= *= /= %= &amp;= |= ^= &lt;&lt;= &gt;&gt;=</code> 是\"运算 + 赋值\"的缩写：<code>a += 3</code> 等价于 <code>a = a + 3</code>。它不仅短，还避免了重复求值（当左边是复杂表达式时能少写一次）。</p>",
        code: "int x = 5;\nx += 3;      /* x = 8 */\nx *= 2;      /* x = 16 */\nx |= 1;      /* x = 17（按位或，细节见位运算章节） */\n\nint y = 0;\nif (y = 3) { }   /* 恒为真！把 == 写成了 = ，经典 bug */" },
      { t: "第五类：优先级与结合性（这几条必须背）",
        h: "<p>不需要背完整优先级表，但下面几条必须记牢（都是踩过坑才总结出来的）：</p><table><tr><th>规则</th><th>说明与例子</th></tr><tr><td>括号最高</td><td>拿不准就加括号，代码可读性比省几个字符重要</td></tr><tr><td>单目 &gt; 算术 &gt; 移位 &gt; 关系 &gt; 相等 &gt; 位运算 &gt; 逻辑 &gt; 三目 &gt; 赋值</td><td>大致顺序，够用了</td></tr><tr><td>$+$ 高于 $&lt;&lt;$</td><td><code>1 &lt;&lt; 2 + 3</code> 是 1&lt;&lt;5 = 32，不是 7</td></tr><tr><td>位运算低于比较</td><td><code>x &amp; 1 == 0</code> 实际是 <code>x &amp; (1==0)</code>，必须写 <code>(x &amp; 1) == 0</code></td></tr><tr><td>赋值优先级很低</td><td>且从右往左结合：<code>a = b = c = 1</code> 表示三个都赋 1</td></tr><tr><td>三目 <code>? :</code></td><td><code>max = a &gt; b ? a : b;</code> 轻量 if，可嵌套但别嵌套超过两层</td></tr></table>" },
      { t: "常见错误与坑",
        h: "<ul><li><b>= 与 ==</b> 混淆（前面讲过，杀手级 bug）</li><li><b>整数除法丢小数</b>：算百分比要先乘后除，或先转 double</li><li><b>位运算与逻辑运算混用</b>：<code>&amp;</code> 是逐位与，<code>&amp;&amp;</code> 是逻辑与；<code>if (a &amp; b)</code> 在判断标志位时是对的，但代替 <code>a &amp;&amp; b</code> 就错了</li><li><b>在表达式里多次修改同一变量</b>：<code>i++ + i++</code>、<code>a = a++</code> 都是未定义行为</li><li><b>浮点判等</b>：用误差范围</li><li><b>取模负数</b>：结果符号跟随左操作数，-7%3 = -1，与数学上的模运算不同</li></ul>" },
      { t: "面试怎么答：表达式类问题",
        h: "<p><b>问：i++ 和 ++i 有什么区别？</b>答：前置是先自增再取值，后置是先取值再自增。单独使用时等价；参与表达式时有区别。注意\"同一表达式里多次修改同一变量\"是未定义行为，工程上禁止。</p><p><b>追问：为什么说 && 有短路特性，有什么用？</b>答：左操作数已能决定结果时右操作数不执行。作用有二：① 省去无谓计算；② 做安全保护，如 <code>p != NULL &amp;&amp; p-&gt;val &gt; 0</code> 防止空指针解引用、<code>i != 0 &amp;&amp; 10/i &gt; 1</code> 防止除零。</p><p><b>追问：x &amp; 1 == 0 有什么问题？</b>答：== 优先级高于 &amp;，表达式实际是 x &amp; (1==0) 即 x &amp; 0，恒为 0。正确写法 (x &amp; 1) == 0。这类题几乎每场笔试都有。</p>" },
      { t: "课后练习与作业",
        h: "<p><b>作业</b>：</p><ol><li>手算下列表达式的值，再写程序验证：<code>7/2</code>、<code>-7/2</code>、<code>7%-3</code>、<code>1&lt;&lt;2+3</code>、<code>x &amp; 1 == 0</code>（x=2）</li><li>写程序用短路求值实现\"安全除法\"：分母为 0 时不执行除法并提示</li><li>写程序验证 <code>i++</code> 与 <code>++i</code> 在混合表达式中的差别</li><li>用三目运算符改写一个 if-else，体会两者适用场景</li></ol><p><b>完成后你应该能回答</b>：为什么 <code>(x &amp; 1) == 0</code> 必须加括号？</p>" }
    ],
    quiz: [
      { type: "single", q: "表达式 1 << 2 + 3 的值是？",
        opts: ["32", "7", "13", "16"], ans: 0,
        exp: "加法优先级高于左移，先算 2+3=5，再 1<<5 = 32。这类题笔试常出，记忆法：位运算优先级很低，凡是要参与别处运算都加括号。" },
      { type: "single", q: "int i = 0; if (i != 0 && 10 / i > 1) 这段代码会怎样？",
        opts: ["除零崩溃", "因为短路，i!=0 为假时右边的除法根本不执行，安全通过", "编译报错", "输出警告"], ans: 1,
        exp: "短路求值在这里是\"保护性写法\"：先判断除数非零，再去算除法。这是 C 语言里最常见的防御模式之一。" },
      { type: "blank", q: "读程序写输出（数字连续，无空格）：",
        code: "int i = 5;\nint a = ++i;\nint b = i++;\nprintf(\"%d%d%d\", i, a, b);",
        blanks: [{ acc: ["766"] }],
        exp: "++i 先把 i 加到 6 并返回 6（a=6）；i++ 返回旧值 6（b=6）再把 i 加到 7。所以 i=7, a=6, b=6。" },
      { type: "single", q: "x & 1 == 0 这个表达式实际的计算结果是？",
        opts: ["判断 x 是否为偶数", "恒为 0，因为先算 1==0 得 0，再 x & 0", "恒为 1", "编译错误"], ans: 1,
        exp: "比较运算符优先级高于按位与。要判断偶数必须写 (x & 1) == 0。这种\"优先级陷阱\"是面试官最爱的送分题（也是送命题）。" },
      { type: "judge", q: "表达式 i++ + i++ 的结果在不同编译器上可能不同，因为这是未定义行为。", ans: true,
        exp: "C 标准规定在同一个序列点之间多次修改同一对象是未定义行为。工程代码里绝对不要这么写，笔试遇到也要回答\"未定义\"。" },
      { type: "blank", q: "读程序写输出：",
        code: "int a = 3, b = 5;\nprintf(\"%d\\n\", a > b ? a : b);\nprintf(\"%d\\n\", a % 2);",
        blanks: [{ acc: ["51"] }],
        exp: "三目取较大值 5；3%2 = 1（奇数）。输出 5 和 1，连续写为 51。" },
      { type: "single", q: "关于赋值运算符 =，下列说法正确的是？",
        opts: ["它和 == 完全等价", "它是赋值（把右边的值存进左边），而 == 是判断相等；两者混淆是最常见的逻辑 bug", "它只能用于 int", "它的优先级最高"], ans: 1,
        exp: "写 if (y = 3) 会恒为真（3 非 0）。防御技巧：把常量写左边 if (3 == y)，写错成 = 会直接编译报错，无法通过编译。" },
      { type: "code", q: "编程任务：写一个\"成绩换算\"程序——输入 0~100 的分数，用表达式计算：是否及格（关系运算结果 0/1）、等级（三目运算符）、分数除以 10 的整数部分与余数，并按格式输出。",
        hint: "<p>用 && 组合范围判断；用嵌套三目或 if-else 分级；整数除法和取模搭配可以得到十位与个位。注意先判断输入范围合法性。</p>",
        sol: "#include <stdio.h>\n\nint main(void)\n{\n    int score;\n    printf(\"请输入分数（0~100）：\");\n    if (scanf(\"%d\", &score) != 1) {\n        printf(\"输入不是数字\\n\");\n        return 1;\n    }\n\n    /* 1. 范围校验：用逻辑与组合两个条件 */\n    if (score < 0 || score > 100) {\n        printf(\"分数超出范围\\n\");\n        return 1;\n    }\n\n    /* 2. 是否及格：关系表达式的结果就是 0 或 1，可直接存进变量 */\n    int pass = (score >= 60);\n    printf(\"是否及格：%d（1=及格 0=不及格）\\n\", pass);\n\n    /* 3. 等级：三目嵌套表达（层数不宜过多，超过两层建议改 if-else） */\n    const char *level = (score >= 90) ? \"A\" :\n                        (score >= 80) ? \"B\" :\n                        (score >= 70) ? \"C\" :\n                        (score >= 60) ? \"D\" : \"F\";\n    printf(\"等级：%s\\n\", level);\n\n    /* 4. 整数除法与取模：得到十位与个位 */\n    printf(\"十位：%d，个位：%d\\n\", score / 10, score % 10);\n\n    /* 5. 百分比换算：注意先乘后除，避免整数除法丢精度 */\n    printf(\"占满分百分比：%.1f%%\\n\", score * 100.0 / 100);\n\n    return 0;\n}",
        exp: "本题把五类运算符都用上了：关系（及格判断）、逻辑（范围校验）、三目（等级）、整除取模（拆位）、算术（百分比）。特别注意百分比那行——如果写成 score/100*100 会因为整数除法得 0。" }
    ]
  },

  /* ---------------- 第 4 章 ---------------- */
  {
    id: "z4",
    title: "第 4 章 输入输出与格式化",
    brief: "让程序和用户说上话",
    points: [
      { t: "开篇：为什么输入输出要单独讲",
        h: "<p>之前的程序都是\"自己算完自己打印\"。真实程序必须能<b>接收用户数据</b>（scanf、fgets）并<b>输出给人看</b>（printf）。这两件事看似简单，但新手 80% 的诡异问题都出在这里：输入的换行符没处理、格式符写错导致输出垃圾、scanf 卡住不返回。</p><p><b>本章目标</b>：背熟常用格式符、会正确读入整数/浮点/字符串、理解输入缓冲区与残留换行符、知道 scanf 与 fgets 的分工。</p>" },
      { t: "核心概念：printf 格式符对照表",
        h: "<table><tr><th>格式符</th><th>对应类型</th><th>例子</th><th>输出</th></tr><tr><td>%d / %i</td><td>int</td><td>printf(\"%d\", -3)</td><td>-3</td></tr><tr><td>%u</td><td>unsigned int</td><td>printf(\"%u\", 300u)</td><td>300</td></tr><tr><td>%ld / %lld</td><td>long / long long</td><td>printf(\"%ld\", 123456789L)</td><td>123456789</td></tr><tr><td>%f</td><td>float / double</td><td>printf(\"%.2f\", 3.14159)</td><td>3.14</td></tr><tr><td>%c</td><td>char（字符）</td><td>printf(\"%c\", 'A')</td><td>A</td></tr><tr><td>%s</td><td>字符串</td><td>printf(\"%s\", \"hi\")</td><td>hi</td></tr><tr><td>%%</td><td>输出百分号本身</td><td>printf(\"100%%\")</td><td>100%</td></tr><tr><td>%x / %o</td><td>十六进制 / 八进制</td><td>printf(\"%x\", 255)</td><td>ff</td></tr><tr><td>%zu</td><td>size_t（sizeof 的结果）</td><td>printf(\"%zu\", sizeof(int))</td><td>4</td></tr><tr><td>%p</td><td>指针（地址）</td><td>printf(\"%p\", &amp;a)</td><td>0x7ffd...</td></tr></table><p><b>格式符与参数必须一一对应</b>：数量不匹配、类型不匹配，输出就是垃圾值甚至崩溃。所以永远开 -Wall。</p>" },
      { t: "格式控制：宽度、精度、对齐",
        h: "<p>格式符里可以夹数字来控制排版，写报表、日志时很有用：<code>%5d</code> 宽度 5 右对齐、<code>%-5d</code> 左对齐、<code>%05d</code> 前补 0、<code>%.2f</code> 保留 2 位小数、<code>%8.2f</code> 总宽 8 且保留 2 位小数、<code>%x</code> 十六进制小写。</p>",
        code: "printf(\"[%5d]\\n\", 42);      /* [   42] */\nprintf(\"[%-5d]\\n\", 42);     /* [42   ] */\nprintf(\"[%05d]\\n\", 42);     /* [00042] */\nprintf(\"[%.2f]\\n\", 3.14159); /* [3.14] */\nprintf(\"[%8.2f]\\n\", 3.14159);/* [    3.14] */\nprintf(\"[%08.2f]\\n\", 3.14);  /* [00003.14] */" },
      { t: "核心概念：输入缓冲区与残留换行符（重点）",
        h: "<p>这是新手最常遇到的\"诡异现象\"：先 <code>scanf(\"%d\", &n)</code> 读一个数，紧接着 <code>scanf(\"%c\", &ch)</code> 读一个字符，结果 ch 里是回车而不是你输入的字符。</p><p><b>原因</b>：键盘输入先进\"输入缓冲区\"，scanf 按格式取走需要的内容，<b>多余的字符（尤其是换行 \\n）留在缓冲区里</b>，下一次 scanf 就直接读到了它。看图：</p><svg viewBox='0 0 680 210' width='100%' role='img'><text x='30' y='22' font-size='12' fill='#1c2333'>你在键盘上敲： 5 2 ⏎  →  缓冲区里实际是这些字符</text><rect x='30' y='36' width='52' height='34' fill='#eef3ff' stroke='#2b5cff'/><text x='56' y='58' text-anchor='middle' font-size='13' fill='#1c2333'>5</text><rect x='82' y='36' width='52' height='34' fill='#eef3ff' stroke='#2b5cff'/><text x='108' y='58' text-anchor='middle' font-size='13' fill='#1c2333'>2</text><rect x='134' y='36' width='52' height='34' fill='#fff4e6' stroke='#ea580c'/><text x='160' y='58' text-anchor='middle' font-size='13' fill='#b45309'>\\n</text><rect x='186' y='36' width='150' height='34' fill='#f6f7fa' stroke='#c8cddb'/><text x='261' y='58' text-anchor='middle' font-size='11' fill='#8b98b0'>（空）</text><text x='360' y='58' font-size='11.5' fill='#5a6478'>缓冲区：编号 0 1 2 …</text><line x1='56' y1='90' x2='56' y2='112' stroke='#2b5cff' stroke-width='1.2' marker-end='url(#a4)'/><text x='56' y='130' text-anchor='middle' font-size='11.5' fill='#2b5cff'>scanf(\"%d\") 取走 5</text><line x1='108' y1='90' x2='108' y2='112' stroke='#2b5cff' stroke-width='1.2' marker-end='url(#a4)'/><text x='112' y='130' text-anchor='middle' font-size='11.5' fill='#2b5cff'>下一个 scanf(\"%d\") 取走 2</text><line x1='160' y1='90' x2='160' y2='152' stroke='#e02424' stroke-width='1.2' marker-end='url(#a4)'/><text x='150' y='170' text-anchor='middle' font-size='11.5' fill='#e02424'>\\n 留在缓冲区！</text><text x='360' y='170' font-size='11.5' fill='#e02424'>于是 scanf(\"%c\") 读到的是 \\n，不是你想输入的那个字符</text><text x='40' y='198' font-size='11.5' fill='#0f7a52'>解法一：在 %c 前加一个空格—— scanf(\" %c\", &amp;ch)（空格表示\"跳过所有空白字符\"）</text><defs><marker id='a4' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='6' markerHeight='6' orient='auto-start-reverse'><path d='M2 1L8 5L2 9' fill='none' stroke='#8b98b0' stroke-width='1.4'/></marker></defs></svg><p><b>解法二（更通用）</b>：改用 fgets 读整行再解析；或读完后手动清空缓冲区 <code>while (getchar() != '\\n');</code>。</p>" },
      { t: "scanf 与 fgets：各管一摊",
        h: "<table><tr><th></th><th>scanf</th><th>fgets</th></tr><tr><td>擅长</td><td>按格式读数字、多个值</td><td>读一整行（含空格）</td></tr><tr><td>遇空格</td><td>%s 遇空格就停（无法读带空格的姓名）</td><td>空格照读，直到换行或缓冲满</td></tr><tr><td>安全性</td><td>%s 不限宽会溢出，要写 %15s</td><td>自带长度限制，安全</td></tr><tr><td>换行符</td><td>留在缓冲区（坑）</td><td>会读进来，需自己去掉</td></tr><tr><td>返回值</td><td>成功赋值的项数（必须判断）</td><td>成功返回缓冲指针，失败/EOF 返回 NULL</td></tr></table><p><b>工程建议</b>：菜单类交互用 fgets 读整行（安全、不易卡住）；结构化数据用 scanf 并检查返回值。混用时注意残留换行符。</p>",
        code: "char name[32];\nprintf(\"请输入姓名（可含空格）：\");\nif (fgets(name, sizeof(name), stdin) == NULL) return 1;\nname[strcspn(name, \"\\n\")] = '\\0';   /* 去掉行尾换行符 */\nprintf(\"你好，%s！\\n\", name);" },
      { t: "常见错误与坑",
        h: "<ul><li><b>格式符不匹配</b>：用 %d 打印 double、用 %f 打印 int → 输出垃圾。<b>double 必须用 %f/%lf 系列</b>（printf 里 float 会被提升为 double，用 %f 即可）</li><li><b>scanf 忘了 &amp;</b>：<code>scanf(\"%d\", n)</code> 把变量值当地址用，直接段错误。数组名本身是地址，所以字符串读入不用加 &amp;</li><li><b>不检查 scanf 返回值</b>：输入字母时匹配失败，变量保持旧值，循环里会反复打印同一提示（死循环刷屏）</li><li><b>%s 不限宽</b>：输入超长直接越界写穿内存，是安全漏洞的经典入口</li><li><b>混用 scanf 与 fgets</b>：scanf 留下的 \\n 会被 fgets 当成\"一个空行\"读走</li><li><b>想输出 % 却没写 %%</b>：printf(\"进度 50%\") 后面跟着未定义行为</li></ul>" },
      { t: "面试怎么答：输入输出类问题",
        h: "<p><b>问：scanf 和 fgets 的区别？</b>答：scanf 按格式符解析、遇空白符分隔、会留下未消费字符；fgets 读整行（直到 \\n 或缓冲上限），能读空格、不残留、天然限长更安全。工程上读字符串/整行优先 fgets，读结构化数值用 scanf 且必须检查返回值。</p><p><b>追问：scanf(\"%d\") 之后紧接着 scanf(\"%c\") 读不到字符，为什么？</b>答：上一次输入的回车（\\n）留在输入缓冲区，%c 直接把它读走了。三种解法：\" %c\"（前导空格跳过空白）、清空缓冲区 while(getchar()!='\\n')、或改用 fgets 统一读行。</p><p><b>追问：printf 的返回值是什么？</b>答：实际输出的字符个数，出错返回负数。可以用它检查输出是否被截断（比如输出到固定大小缓冲区时用 snprintf 的返回值判断截断）。</p>" },
      { t: "课后练习与作业",
        h: "<p><b>作业</b>：</p><ol><li>输入两个整数，输出它们的和、差、积、商（商保留两位小数）；</li><li>复现\"残留换行符\"问题，再用两种方法修好（\" %c\" 与清缓冲）；</li><li>用 fgets 读入带空格的姓名并输出问候语，注意去掉行尾 \\n；</li><li>用宽度/精度控制打印一张对齐的小表格（姓名、分数、排名）；</li><li>故意用 %d 打印一个 double，观察输出与警告信息。</li></ol><p><b>完成后你应该能回答</b>：为什么读字符串时用 %15s 比 %s 安全？</p>" }
    ],
    quiz: [
      { type: "single", q: "printf 打印 double 类型应该用哪个格式符？",
        opts: ["%d", "%f", "%c", "%s"], ans: 1,
        exp: "浮点用 %f（可通过 %.2f 控制小数位）。在 printf 里 float 会自动提升为 double，所以统一用 %f 即可；用 %d 打印浮点会输出垃圾值，这是典型的\"格式符不匹配\"错误。" },
      { type: "single", q: "scanf(\"%d\", &n) 之后立刻 scanf(\"%c\", &ch)，ch 读到的是什么？",
        opts: ["用户输入的字符", "上一次输入残留的换行符 \\n", "随机值", "空格"], ans: 1,
        exp: "残留换行符是最经典的输入坑。修法：scanf(\" %c\", &ch)（前导空格让 %c 先跳过空白），或读完后清空缓冲区。" },
      { type: "single", q: "为什么读字符串建议写 scanf(\"%15s\", buf) 而不是 scanf(\"%s\", buf)？",
        opts: ["速度更快", "%15s 限定了最大读入长度，避免输入超长时越界写穿内存（缓冲区溢出）；%s 完全不限长", "15 表示读 15 行", "没有区别"], ans: 1,
        exp: "缓冲区溢出是 C 语言最严重的安全问题之一（历史上大量漏洞源于此）。限宽的思路在所有输入函数里都要用：strncpy、snprintf、fgets 同理。" },
      { type: "blank", q: "补全代码：清空输入缓冲区里残留的换行符（标准写法）。",
        code: "while (getchar() != {{0}})\n    ;   /* 空循环体：一直读到换行符为止 */",
        blanks: [{ acc: ["'\\n'"] }],
        exp: "读到换行符就停，等于把这一行剩下的输入都吃掉。注意空循环体那个分号别漏。另一种更简洁的做法是在 %c 前加一个空格：scanf(\" %c\", &ch)，让 %c 自己跳过空白字符。" },
      { type: "judge", q: "用 printf(\"100%\") 想输出百分号，这样写是安全的、能正确输出 100%。", ans: false,
        exp: "要输出 % 必须写 %%。写成单个 % 后，printf 会去找后面的参数格式化，导致未定义行为（通常输出垃圾值）。" },
      { type: "blank", q: "读程序写输出（按行看，写出三行内容，用 / 分隔）：",
        code: "printf(\"[%5d]\\n\", 42);\nprintf(\"[%-4d]\\n\", 7);\nprintf(\"[%06.1f]\\n\", 2.5);",
        blanks: [{ acc: ["[   42]/[7   ]/[0002.5]"] }],
        exp: "%5d 宽度 5 右对齐 → \"[   42]\"；%-4d 左对齐 → \"[7   ]\"；%06.1f 总宽 6、补 0、保留 1 位小数 → \"[0002.5]\"。格式化输出在写日志和报表时必用。" },
      { type: "single", q: "scanf 的返回值应该怎么用？",
        opts: ["忽略它，永远为 0", "判断成功赋值的项数：等于预期项数才算成功，否则要清缓冲或提示重输，避免死循环刷屏", "只能用于浮点", "必须与 printf 配对"], ans: 1,
        exp: "标准写法 if (scanf(\"%d\", &x) != 1) { 处理错误 }。不判断返回值的话，输入字母会让变量保持旧值、循环反复输出同样的提示。" },
      { type: "code", q: "编程任务：写一个\"个人信息录入\"程序。要求：先用 scanf 读入年龄（int）与身高（double）；再用 fgets 读入带空格的兴趣爱好；注意处理两者混用时的换行符问题；最后用对齐格式打印一张小卡片。",
        hint: "<p>scanf 之后会残留 \\n，紧接着 fgets 会读到空行——解决办法：scanf 之后再执行一次 getchar() 吃掉 \\n，或统一用 fgets 读所有输入再转换。</p>",
        sol: "#include <stdio.h>\n#include <string.h>\n\nint main(void)\n{\n    int    age = 0;\n    double height = 0.0;\n    char   hobby[64];\n\n    printf(\"年龄：\");\n    if (scanf(\"%d\", &age) != 1) { printf(\"年龄输入错误\\n\"); return 1; }\n\n    printf(\"身高(cm)：\");\n    if (scanf(\"%lf\", &height) != 1) { printf(\"身高输入错误\\n\"); return 1; }\n\n    /* 关键：scanf 之后缓冲区里残留了换行符，\n     * 若直接 fgets 会读到一个空行，所以先吃掉它 */\n    getchar();\n\n    printf(\"兴趣爱好（可含空格）：\");\n    if (fgets(hobby, sizeof(hobby), stdin) == NULL) return 1;\n    hobby[strcspn(hobby, \"\\n\")] = '\\0';     /* 去掉行尾换行 */\n    if (hobby[0] == '\\0') strcpy(hobby, \"（未填写）\");\n\n    /* 对齐打印：左对齐宽度 10、右对齐宽度 12 */\n    printf(\"\\n+-------------------------------\\n\");\n    printf(\"| %-10s | %12d 岁\\n\", \"年龄\", age);\n    printf(\"| %-10s | %12.1f cm\\n\", \"身高\", height);\n    printf(\"| %-10s | %12s\\n\", \"兴趣\", hobby);\n    printf(\"+-------------------------------\\n\");\n    return 0;\n}",
        exp: "本题是输入坑的集大成：① scanf 与 fgets 混用必须吃掉残留换行符；② fgets 读进来带 \\n 要手动去掉；③ 空输入要有兜底；④ 用宽度控制做对齐排版。做完这道题，交互式程序对你来说就不神秘了。" }
    ]
  }
  ]
});


/* ==== data-zero2.js ==== */

/* ============================================================
   课程十三：C 语言零基础精讲（第 5-7 章）
   分支 / 循环 / 函数
   ============================================================ */
(function () {
  var ch = window.COURSES[window.COURSES.length - 1].chapters;

  /* ---------------- 第 5 章 ---------------- */
  ch.push({
    id: "z5",
    title: "第 5 章 分支：让程序会做判断",
    brief: "if / else / switch 与“真假”的本质",
    points: [
      { t: "开篇：程序需要做选择",
        h: "<p>前面写的程序是“一条直线”：从第一行执行到最后一行。但真实逻辑充满分岔：分数够 60 就及格、密码对就登录、温度超阈值就报警。<b>分支就是让程序根据条件走不同路径</b>。</p><p>关键要先建立一个认知：<b>C 语言里没有真正的“布尔类型”（早期标准）——0 是假，非 0 就是真</b>。所以 <code>if (5)</code>、<code>if (-1)</code>、<code>if ('a')</code> 条件都成立。理解这一点，很多奇怪写法就通了。</p><p><b>本章目标</b>：会写 if/else 链与 switch；能说清悬垂 else、贯穿（fall-through）；会把复杂的多条件判断写清楚。</p>" },
      { t: "核心概念：if / else if / else",
        h: "<p>三种形态：单分支 <code>if</code>；双分支 <code>if/else</code>；多分支 <code>if / else if / else</code>（从上往下判断，命中一个后其余全部跳过）。</p>",
        code: "if (score >= 90) {\n    grade = 'A';\n} else if (score >= 80) {      /* 走到这里说明 score < 90，不必再写 score < 90 */\n    grade = 'B';\n} else if (score >= 60) {\n    grade = 'C';\n} else {\n    grade = 'F';\n}" },
      { t: "图示：多分支的执行路径",
        h: "<p>注意每个菱形判断只有“通过 / 不通过”两条路：不通过就往下一个条件走，全不通过才落到 else。这种结构天然是“互斥”的。</p><svg viewBox='0 0 680 250' width='100%' role='img'><rect x='40' y='24' width='150' height='34' rx='8' fill='#eef3ff' stroke='#2b5cff'/><text x='115' y='46' text-anchor='middle' font-size='11.5' fill='#1c2333'>score &gt;= 90 ?</text><line x1='190' y1='41' x2='252' y2='41' stroke='#0e9f6e' stroke-width='1.2' marker-end='url(#a5)'/><text x='222' y='34' text-anchor='middle' font-size='10.5' fill='#0e9f6e'>是</text><rect x='256' y='24' width='100' height='34' rx='8' fill='#e8fbf3' stroke='#0e9f6e'/><text x='306' y='46' text-anchor='middle' font-size='11.5' fill='#0f7a52'>grade = 'A'</text><line x1='115' y1='58' x2='115' y2='86' stroke='#e02424' stroke-width='1.2' marker-end='url(#a5)'/><text x='128' y='78' font-size='10.5' fill='#e02424'>否</text><rect x='40' y='90' width='150' height='34' rx='8' fill='#eef3ff' stroke='#2b5cff'/><text x='115' y='112' text-anchor='middle' font-size='11.5' fill='#1c2333'>score &gt;= 80 ?</text><line x1='190' y1='107' x2='252' y2='107' stroke='#0e9f6e' stroke-width='1.2' marker-end='url(#a5)'/><text x='222' y='100' text-anchor='middle' font-size='10.5' fill='#0e9f6e'>是</text><rect x='256' y='90' width='100' height='34' rx='8' fill='#e8fbf3' stroke='#0e9f6e'/><text x='306' y='112' text-anchor='middle' font-size='11.5' fill='#0f7a52'>grade = 'B'</text><line x1='115' y1='124' x2='115' y2='152' stroke='#e02424' stroke-width='1.2' marker-end='url(#a5)'/><text x='128' y='144' font-size='10.5' fill='#e02424'>否</text><rect x='40' y='156' width='150' height='34' rx='8' fill='#eef3ff' stroke='#2b5cff'/><text x='115' y='178' text-anchor='middle' font-size='11.5' fill='#1c2333'>score &gt;= 60 ?</text><line x1='115' y1='190' x2='115' y2='212' stroke='#e02424' stroke-width='1.2' marker-end='url(#a5)'/><text x='128' y='206' font-size='10.5' fill='#e02424'>否</text><rect x='40' y='216' width='150' height='30' rx='8' fill='#fdeaea' stroke='#e02424'/><text x='115' y='236' text-anchor='middle' font-size='11.5' fill='#b91c1c'>grade = 'F'（不及格）</text><text x='380' y='112' font-size='11.5' fill='#5a6478'>一旦命中一个分支，</text><text x='380' y='132' font-size='11.5' fill='#5a6478'>后面的条件不再判断，</text><text x='380' y='152' font-size='11.5' fill='#5a6478'>所以条件顺序很重要：</text><text x='380' y='172' font-size='11.5' fill='#c2410c'>从最严格（90）到最宽松（60）</text><text x='380' y='198' font-size='11.5' fill='#5a6478'>若写成先判 &gt;=60，则 95 分</text><text x='380' y='218' font-size='11.5' fill='#5a6478'>也会被归入 C 级 —— 逻辑错误</text><defs><marker id='a5' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='6' markerHeight='6' orient='auto-start-reverse'><path d='M2 1L8 5L2 9' fill='none' stroke='#8b98b0' stroke-width='1.4'/></marker></defs></svg>" },
      { t: "核心概念：switch 与贯穿",
        h: "<p>当判断依据是<b>同一个整型表达式的多个离散取值</b>时，switch 比一长串 if-else 更清晰。三条规则：</p><ul><li>case 后必须是<b>编译期确定的整型常量</b>（不能是变量、不能是浮点、不能是字符串）</li><li>匹配后会<b>顺序往下执行</b>，直到遇到 break 或 switch 结束——这叫贯穿（fall-through），忘记 break 是经典 bug</li><li>一定要写 default 兜底（处理非法输入、也能让编译器检查是否覆盖全）</li></ul>",
        code: "switch (cmd) {\ncase 1:\n    printf(\"开始\\n\");\n    break;                 /* 少了它会继续执行 case 2 的代码 */\ncase 2:\n    printf(\"暂停\\n\");\n    break;\ncase 3:                    /* 故意贯穿：3 和 4 做同一件事 */\ncase 4:\n    printf(\"停止\\n\");\n    break;\ndefault:\n    printf(\"未知命令\\n\");\n    break;\n}" },
      { t: "常见错误与坑",
        h: "<ul><li><b>悬垂 else</b>：else 总是与最近的、未配对的 if 结合。多分支务必用大括号明确归属</li><li><b>浮点数用 == 比较</b>：<code>if (f == 0.3)</code> 可能永远不成立，要用 <code>fabs(f - 0.3) &lt; 1e-6</code></li><li><b>if (x = 0)</b>：赋值表达式值为 0，条件恒假；想判断相等要写 ==。防御写法：<code>if (0 == x)</code>，写错直接编译报错</li><li><b>只写一行就省大括号</b>：将来加一行代码极易忘了补大括号，导致逻辑改变（苹果著名的 goto fail 漏洞就是这么来的）</li><li><b>switch 的 case 里定义变量</b>：需要加一对大括号限定作用域，否则可能编译错误</li><li><b>条件顺序搞反</b>：多分支从最严格到最宽松排序</li></ul>" },
      { t: "面试怎么答：分支类问题",
        h: "<p><b>问：if / else if 里的条件会全部判断吗？</b>答：不会。命中一个分支后其余条件全部跳过，所以条件顺序影响结果（例如分级判断必须从严格到宽松）。</p><p><b>追问：switch 里忘写 break 会怎样？</b>答：会发生 fall-through，继续执行后续 case 的代码，直到 break 或 switch 结束。有时故意利用这一点来合并多个 case（如 case 3/case 4 共用代码），但必须写注释说明是有意为之，否则评审会被当成 bug。</p><p><b>追问：switch 能用于字符串吗？</b>答：不能，case 必须是整型常量表达式。判断字符串要用 strcmp 配合 if-else。也可以先把字符串映射成枚举或整型命令字再 switch——这是协议解析里的常见做法。</p><p><b>追问：if (a = 5) 会怎样？</b>答：先赋值得到 5，非 0 为真，条件恒成立。这种 bug 编译器通常会给警告（-Wall 下可见），所以警告一定要清零。</p>" },
      { t: "课后练习与作业",
        h: "<p><b>作业</b>：</p><ol><li>写程序判断闰年（能被 4 整除且不能被 100 整除，或能被 400 整除）——把条件写成一个复合逻辑表达式；</li><li>用 switch 写一个四则运算菜单，要求对除零做保护；</li><li>复现“悬垂 else”问题：写一个没有大括号的嵌套 if，观察 else 与谁配对，再用大括号修正；</li><li>写一段代码，故意漏掉 break，观察输出并解释；</li><li>把分级判断的顺序故意写错，观察错误结果，体会“顺序影响逻辑”。</li></ol><p><b>完成后你应该能回答</b>：为什么 <code>if (0 == x)</code> 比 <code>if (x == 0)</code> 更安全？</p>" }
    ],
    quiz: [
      { type: "single", q: "在 C 语言里，下面哪个条件判断为“假”？",
        opts: ["if (5)", "if (-1)", "if ('A')", "if (0)"], ans: 3,
        exp: "C 语言没有真正的布尔类型，0 为假、非 0 为真。所以 'A'（ASCII 65）为真、-1 也为真。理解这一点才能看懂 p != NULL 这类惯用写法。" },
      { type: "single", q: "switch 的某个 case 结尾忘了 break，会发生什么？",
        opts: ["编译错误", "继续执行后面 case 的代码（贯穿），直到遇到 break 或 switch 结束", "立即跳出 switch", "跳到 default 分支"], ans: 1,
        exp: "这就是 fall-through。有时故意利用它合并多个 case，但必须加注释说明；忘记写且不是有意为之，就是逻辑 bug。" },
      { type: "single", q: "if / else if 链中，条件应该按什么顺序写？",
        opts: ["随意，结果一样", "从最严格（最不容易满足）到最宽松，否则先命中的宽松条件会截胡", "从最宽松到最严格", "按字母顺序"], ans: 1,
        exp: "例如分级判断里先写 score>=60 的话，95 分也会被判成 C 级。记住\"命中即跳出\"这个特性，条件排序就自然清楚了。" },
      { type: "blank", q: "补全代码：判断闰年（能被 4 整除且不能被 100 整除，或能被 400 整除）。",
        code: "if ((y % 4 == 0 && y % 100 != 0) {{0}} y % 400 == 0)\n    printf(\"闰年\\n\");",
        blanks: [{ acc: ["||"] }],
        exp: "两个条件用逻辑或连接。注意括号位置决定了运算顺序：前面的 && 组合要先算完再与后面相或——这就是加括号的价值。" },
      { type: "judge", q: "if (x = 0) 这个写法是合法的，但条件恒为假，属于逻辑 bug。", ans: true,
        exp: "赋值表达式的值是所赋的值，0 为假。防御写法是 if (0 == x)，把常量放左边，写错成 = 就无法通过编译。" },
      { type: "blank", q: "读程序写输出（数字连续，无空格）：",
        code: "int s = 95;\nif (s >= 60)      printf(\"C\");\nelse if (s >= 90) printf(\"A\");\nelse              printf(\"F\");",
        blanks: [{ acc: ["C"] }],
        exp: "条件顺序反了：95 先命中 >=60，输出 C 之后其余分支不再判断。这就是“顺序影响逻辑”的实证——正确写法应先判 >=90。" },
      { type: "code", q: "编程任务：写一个简易计算器，用 switch 实现四则运算。要求：除零时给出明确提示；非法运算符走 default；输入用 scanf 并检查返回值；输出结果保留两位小数。",
        hint: "<p>用 double 参与运算避免整数除法；除零判断放在 case '/' 里；scanf(\"%lf %c %lf\") 可以一次读入形如 3.5*2 的算式（注意中间可能有空格，格式串里可加空格跳过）。</p>",
        sol: "#include <stdio.h>\n\nint main(void)\n{\n    double a, b, result = 0.0;\n    char   op;\n    int    ok = 1;              /* 标记是否需要输出结果 */\n\n    printf(\"请输入算式（例如 3.5*2）：\");\n    if (scanf(\"%lf %c %lf\", &a, &op, &b) != 3) {\n        printf(\"输入格式错误\\n\");\n        return 1;\n    }\n\n    switch (op) {\n    case '+':\n        result = a + b;\n        break;\n    case '-':\n        result = a - b;\n        break;\n    case '*':\n        result = a * b;\n        break;\n    case '/':\n        if (b == 0) {                    /* 除零保护：必须在做除法之前判断 */\n            printf(\"错误：除数不能为 0\\n\");\n            ok = 0;\n        } else {\n            result = a / b;\n        }\n        break;\n    default:\n        printf(\"错误：不支持的运算符 '%c'\\n\", op);\n        ok = 0;\n        break;\n    }\n\n    if (ok)\n        printf(\"%g %c %g = %.2f\\n\", a, op, b, result);\n    return 0;\n}",
        exp: "要点：① 用 double 避免整数除法；② 除零判断必须在实际除法之前；③ default 兜底处理非法符号；④ scanf 返回值要判断，否则输入字母会死循环。这也是后面“菜单式程序”的基础骨架。" }
    ]
  });

  /* ---------------- 第 6 章 ---------------- */
  ch.push({
    id: "z6",
    title: "第 6 章 循环：让程序会重复做事",
    brief: "while / for / do-while 与执行轨迹",
    points: [
      { t: "开篇：为什么要循环",
        h: "<p>要算 1+2+...+100，手写 100 行加法是灾难。循环让程序<b>重复执行一段代码</b>，只要写清三件事：<b>从哪开始、什么时候停、每轮怎么变</b>。这三件事写成 for 语句就是 <code>for (初始; 条件; 更新)</code>。</p><p><b>本章目标</b>：选对循环形式、能画出执行轨迹、会用 break/continue、认得出死循环与边界错误、初步建立“这段代码跑几次”的量化能力（为复杂度分析打基础）。</p>" },
      { t: "核心概念：三种循环及选择",
        h: "<table><tr><th>形式</th><th>结构</th><th>适用场景</th><th>特点</th></tr><tr><td>for</td><td>for(初始; 条件; 更新)</td><td>次数已知（遍历数组 100 个元素）</td><td>三段集中，最不易漏写更新语句</td></tr><tr><td>while</td><td>while(条件) { }</td><td>次数未知（读到文件结束、等待用户输入正确）</td><td>先判断后执行，可能一次都不执行</td></tr><tr><td>do-while</td><td>do { } while(条件);</td><td>至少执行一次（菜单、输入校验重试）</td><td>先执行后判断，注意结尾有分号</td></tr></table>" },
      { t: "图示：for 的执行顺序与轨迹",
        h: "<p>for 括号里三部分<b>执行时机不同</b>：初始化只做一次；然后“条件 → 循环体 → 更新”循环往复。下面的轨迹表用 <code>for (i = 1; i &lt;= 3; i++) sum += i;</code> 走了一遍，<b>照着表格把每轮的值写出来，是排查循环问题的通用方法</b>。</p><svg viewBox='0 0 680 230' width='100%' role='img'><rect x='30' y='24' width='120' height='34' rx='8' fill='#eef3ff' stroke='#2b5cff'/><text x='90' y='46' text-anchor='middle' font-size='11.5' fill='#1c2333'>① 初始化 i=1</text><line x1='150' y1='41' x2='184' y2='41' stroke='#8b98b0' stroke-width='1.2' marker-end='url(#a6)'/><rect x='188' y='24' width='120' height='34' rx='8' fill='#eef3ff' stroke='#2b5cff'/><text x='248' y='46' text-anchor='middle' font-size='11.5' fill='#1c2333'>② 条件 i&lt;=3 ?</text><line x1='308' y1='41' x2='342' y2='41' stroke='#0e9f6e' stroke-width='1.2' marker-end='url(#a6)'/><text x='325' y='34' text-anchor='middle' font-size='10.5' fill='#0e9f6e'>是</text><rect x='346' y='24' width='130' height='34' rx='8' fill='#e8fbf3' stroke='#0e9f6e'/><text x='411' y='46' text-anchor='middle' font-size='11.5' fill='#0f7a52'>③ 循环体 sum+=i</text><line x1='476' y1='41' x2='510' y2='41' stroke='#8b98b0' stroke-width='1.2' marker-end='url(#a6)'/><rect x='514' y='24' width='120' height='34' rx='8' fill='#fff4e6' stroke='#ea580c'/><text x='574' y='46' text-anchor='middle' font-size='11.5' fill='#b45309'>④ 更新 i++</text><path d='M574 58 L574 74 L248 74 L248 58' fill='none' stroke='#8b98b0' stroke-width='1.2' marker-end='url(#a6)'/><text x='411' y='88' text-anchor='middle' font-size='11' fill='#5a6478'>回到步骤② 继续判断（直到条件为假）</text><line x1='248' y1='58' x2='248' y2='104' stroke='#e02424' stroke-width='1.2' marker-end='url(#a6)'/><text x='260' y='100' font-size='10.5' fill='#e02424'>否</text><rect x='188' y='108' width='120' height='30' rx='8' fill='#fdeaea' stroke='#e02424'/><text x='248' y='128' text-anchor='middle' font-size='11.5' fill='#b91c1c'>退出循环</text><rect x='30' y='156' width='604' height='62' rx='8' fill='#f6f7fa' stroke='#c8cfdb'/><text x='46' y='176' font-size='11.5' fill='#1c2333'>执行轨迹（每轮各变量的值）：</text><text x='46' y='196' font-size='11.5' fill='#5a6478'>第1轮：i=1 条件真 → sum=0+1=1 → i++ 得 2　　第2轮：i=2 条件真 → sum=1+2=3 → i 得 3</text><text x='46' y='212' font-size='11.5' fill='#5a6478'>第3轮：i=3 条件真 → sum=3+3=6 → i 得 4　　第4轮：i=4 条件假 → 退出，最终 sum=6</text><defs><marker id='a6' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='6' markerHeight='6' orient='auto-start-reverse'><path d='M2 1L8 5L2 9' fill='none' stroke='#8b98b0' stroke-width='1.4'/></marker></defs></svg>" },
      { t: "核心概念：break 与 continue",
        h: "<p><b>break</b>：立即跳出<b>整层</b>循环（在 switch 里是跳出 switch）。<b>continue</b>：跳过本轮剩余代码，直接进入下一轮判断。</p>",
        code: "for (int i = 1; i <= 10; i++) {\n    if (i % 2 == 0) continue;   /* 偶数跳过本轮，不执行下面的打印 */\n    if (i > 7)      break;      /* 到 9 就整体退出 */\n    printf(\"%d \", i);          /* 输出 1 3 5 7 */\n}\n\n/* 嵌套循环里 break 只跳出最内层；要跳出多层需用标志变量或 goto */\nfor (int i = 0; i < 3; i++)\n    for (int j = 0; j < 3; j++)\n        if (a[i][j] == key) { found = 1; break; }   /* 只跳出 j 循环 */" },
      { t: "常见错误与坑",
        h: "<ul><li><b>死循环</b>：忘写更新语句 <code>for (i = 0; i &lt; 10; )</code>，或条件永远成立。写循环先确认“变量一定会趋向结束条件”</li><li><b>差一错误（off-by-one）</b>：<code>i &lt;= 10</code> 与 <code>i &lt; 10</code> 差一轮。数组遍历用 <code>i &lt; n</code>（下标 0~n-1）</li><li><b>循环变量在循环外使用</b>：C99 允许在 for 里声明 <code>for (int i = 0; ...)</code>，此时 i 出了循环就不可见；老式写法 <code>int i;</code> 放外面则可见</li><li><b>浮点做循环变量</b>：<code>for (f = 0.1; f != 1.0; f += 0.1)</code> 因误差可能永不相等 → 死循环。用整数计数再换算</li><li><b>在 for 后误加分号</b>：<code>for (i = 0; i &lt; 10; i++);</code> 空循环体，后面的语句只执行一次</li><li><b>循环里改循环变量</b>：会导致跳轮或死循环，尽量避免</li><li><b>无限循环 while(1)</b>：在嵌入式里是常态（主循环），但必须保证有明确的退出路径或响应中断</li></ul>" },
      { t: "面试怎么答：循环与复杂度初识",
        h: "<p><b>问：for、while、do-while 怎么选？</b>答：次数已知用 for；条件驱动、可能一次都不执行用 while；至少要执行一次（如输入校验重试）用 do-while。三者可互相改写，选择看可读性。</p><p><b>追问：这段双层循环的时间复杂度是多少？</b>答：若各跑 n 次，总执行次数 n²，复杂度 O(n²)。单层 O(n)，每轮规模减半是 O(log n)。这种\"数执行次数\"的能力是算法课的地基，面试也常让现场估。</p><p><b>追问：break 和 continue 的区别？</b>答：break 结束整个循环（或 switch），continue 只结束本轮。嵌套循环里 break 只作用于最内层——想跳出多层可用标志变量或 goto（goto 在 C 里允许，但仅建议用于跳出多层循环这类场景）。</p><p><b>追问：如何避免死循环？</b>答：确保循环变量在每轮都朝结束条件移动；循环体内不要修改循环变量；边界用 i &lt; n 这类明确形式；写完先在心里跑两轮。</p>" },
      { t: "课后练习与作业",
        h: "<p><b>作业</b>：</p><ol><li>求 1~100 的和、奇数和、偶数和（三个变量，循环一次算完）；</li><li>打印九九乘法表（嵌套循环 + 格式化对齐）；</li><li>猜数字游戏：用 while(1) + break 实现，记录猜的次数；</li><li>用 do-while 实现“密码最多输错 3 次”的校验；</li><li>故意写一个差一错误的循环（i &lt;= n），观察后果并修正；</li><li>用手工表格法记录一段双层循环每轮的变量值，并与实际输出对照。</li></ol><p><b>完成后你应该能回答</b>：为什么遍历数组用 i &lt; n 而不是 i &lt;= n？</p>" }
    ],
    quiz: [
      { type: "single", q: "for (int i = 1; i <= 5; i++) 的循环体一共执行几次？",
        opts: ["4 次", "5 次", "6 次", "无限次"], ans: 1,
        exp: "i 取 1,2,3,4,5 共 5 次；i 变成 6 时条件为假退出。数循环次数最稳的方法是列出首尾值：从 1 到 5 含两端 = 5 次。" },
      { type: "single", q: "break 与 continue 的区别是？",
        opts: ["没有区别", "break 结束整个循环，continue 只跳过本轮剩余代码进入下一轮", "break 只能用于 switch", "continue 会结束所有嵌套循环"], ans: 1,
        exp: "记忆口诀：break 是\"不干了\"，continue 是\"这轮跳过，继续下一轮\"。嵌套循环里 break 只作用于最内层。" },
      { type: "single", q: "遍历长度为 n 的数组时，循环条件应该写？",
        opts: ["i <= n", "i < n", "i <= n-1 与 i < n 都不对", "i != n"], ans: 1,
        exp: "下标范围是 0 ~ n-1，所以 i < n 最直观。写成 i <= n 会多访问一次 a[n]，属于越界（C 不检查，后果不可预料）。" },
      { type: "blank", q: "读程序写输出（数字连续，无空格）：",
        code: "int sum = 0;\nfor (int i = 1; i <= 4; i++)\n    if (i % 2) sum += i;\nprintf(\"%d\\n\", sum);",
        blanks: [{ acc: ["4"] }],
        exp: "i%2 非 0 表示奇数（1 和 3），1+3 = 4。注意 if (i % 2) 这种写法就是利用\"非 0 为真\"的特性。" },
      { type: "judge", q: "do-while 循环的循环体至少会执行一次，即使条件一开始就不成立。", ans: true,
        exp: "这是 do-while 与 while 的核心差别（先执行后判断）。适合\"至少要问一次\"的场景，如输入校验重试、菜单至少显示一次。" },
      { type: "blank", q: "分析循环次数并写出结果（连续输出，无空格）：",
        code: "int i = 1, cnt = 0;\nwhile (i < 100) { i *= 2; cnt++; }\nprintf(\"%d\", cnt);",
        blanks: [{ acc: ["7"] }],
        exp: "i 依次变成 1→2→4→8→16→32→64→128，共 7 次（第 7 次后 128 不满足 128<100）。这类“每轮翻倍”的循环次数是 log₂n 量级，是复杂度分析的典型例子。" },
      { type: "single", q: "下面的 for 语句有什么问题？  for (int i = 0; i < 10; i++);",
        opts: ["没有循环体，后面的语句只执行一次——这是误加分号造成的", "编译报错", "会执行 10 次空循环，后面的语句也执行 10 次", "i 会越界"], ans: 0,
        exp: "分号让循环体变成空语句，循环只是空转 10 次，紧随其后的语句与循环无关。这是很难肉眼发现的 bug，写 for 时警惕行尾分号。" },
      { type: "code", q: "编程任务：打印九九乘法表。要求：输出成下三角形状（第 i 行输出 i 个算式），用格式化宽度对齐；并在最后统计一共打印了多少个算式。",
        hint: "<p>外层 i 从 1 到 9，内层 j 从 1 到 i；用 printf(\"%d*%d=%-3d\", j, i, i*j) 控制每格宽度（注意 %-3d 让结果左对齐占 3 位）；每行结束打印换行。</p>",
        sol: "#include <stdio.h>\n\nint main(void)\n{\n    int count = 0;\n\n    for (int i = 1; i <= 9; i++) {          /* 被乘数（行） */\n        for (int j = 1; j <= i; j++) {      /* 乘数（列），到 i 为止形成三角 */\n            printf(\"%d*%d=%-3d\", j, i, i * j);\n            count++;\n        }\n        printf(\"\\n\");                        /* 本行结束换行 */\n    }\n\n    printf(\"共打印 %d 个算式\\n\", count);     /* 应为 45 */\n    return 0;\n}\n\n/* 输出示例：\n * 1*1=1\n * 1*2=2  2*2=4\n * 1*3=3  2*3=6  3*3=9\n * ...\n * 总数 1+2+...+9 = 45\n */",
        exp: "经典嵌套循环练习。要点：① 内层边界依赖外层变量（j<=i）形成三角；② %-3d 让算式对齐美观；③ 顺便验证了\"总次数 = 1+2+...+9 = 45\"，这就是循环次数的量化能力。" }
    ]
  });

  /* ---------------- 第 7 章 ---------------- */
  ch.push({
    id: "z7",
    title: "第 7 章 函数：把代码切成积木",
    brief: "参数、返回值、值传递、栈帧、递归",
    points: [
      { t: "开篇：为什么要函数",
        h: "<p>如果所有代码都堆在 main 里，程序会变成三百行连在一起的“面条”：改一个地方影响一片、同一段逻辑复制三份、没法单独测试。</p><p><b>函数解决三个问题</b>：① <b>复用</b>（写一次，到处调用）；② <b>隔离</b>（内部改动不影响外部）；③ <b>可读</b>（<code>calc_total()</code> 一眼知道干什么，比读二十行循环强）。</p><p>工程上的经验法则：<b>一个函数只做一件事，长度控制在一屏内（约 50 行）</b>。面试官看你的代码，第一眼看的就是函数划分。</p><p><b>本章目标</b>：会定义/声明/调用；彻底理解值传递；会画栈帧；会用 static 控制生命周期；会写递归并知道风险。</p>" },
      { t: "核心概念：定义、声明、调用",
        h: "<p><b>定义</b>：写清函数体的完整实现。<b>声明（原型）</b>：只写返回类型、名字、参数类型，以分号结尾，让编译器提前知道怎么调用它。<b>调用</b>：按签名传参并接受返回值。</p><p>为什么需要声明？因为 C 是<b>从上往下解析</b>的：函数定义在调用点之后时，编译器没见过它，就不知道参数个数和类型。把声明放进头文件，多个 .c 都能用。</p>",
        code: "/* ---------- 声明（原型）：放头文件或文件顶部 ---------- */\nint add(int a, int b);\nvoid print_result(const char *tag, int value);\n\nint main(void)\n{\n    int s = add(3, 5);              /* 调用 */\n    print_result(\"sum\", s);\n    return 0;\n}\n\n/* ---------- 定义：函数体 ---------- */\nint add(int a, int b)\n{\n    return a + b;                   /* return 把值交回调用者 */\n}\n\nvoid print_result(const char *tag, int value)\n{\n    printf(\"%s = %d\\n\", tag, value);\n    /* void 函数可以不写 return，或写裸 return; */\n}" },
      { t: "图示：函数调用时栈上发生了什么",
        h: "<p>每次调用函数，系统都会在<b>栈</b>上为它开一块空间（称为栈帧），存放参数、返回地址、局部变量。函数返回时这块空间被回收——这就是“局部变量在函数返回后就没了”的原因。</p><svg viewBox='0 0 680 250' width='100%' role='img'><text x='40' y='22' font-size='12' fill='#1c2333'>栈（向下增长，地址从高到低）</text><rect x='40' y='34' width='300' height='56' rx='8' fill='#eef3ff' stroke='#2b5cff'/><text x='190' y='54' text-anchor='middle' font-size='11.5' fill='#1c2333'>main 的栈帧</text><text x='190' y='74' text-anchor='middle' font-size='11' fill='#5a6478'>局部变量 s、返回地址</text><rect x='40' y='96' width='300' height='86' rx='8' fill='#e8fbf3' stroke='#0e9f6e'/><text x='190' y='116' text-anchor='middle' font-size='11.5' fill='#0f7a52'>add 的栈帧（调用期间存在）</text><text x='190' y='136' text-anchor='middle' font-size='11' fill='#5a6478'>参数 a=3、b=5（值的副本）</text><text x='190' y='154' text-anchor='middle' font-size='11' fill='#5a6478'>返回地址（回到 main 的哪一行）</text><text x='190' y='172' text-anchor='middle' font-size='11' fill='#5a6478'>局部变量 t</text><line x1='340' y1='139' x2='392' y2='139' stroke='#8b98b0' stroke-width='1.2' marker-end='url(#a7)'/><text x='404' y='120' font-size='11.5' fill='#1c2333'>add 返回时：</text><text x='404' y='140' font-size='11.5' fill='#5a6478'>① 返回值放进寄存器</text><text x='404' y='158' font-size='11.5' fill='#5a6478'>② 弹出 add 的栈帧（内存回收）</text><text x='404' y='176' font-size='11.5' fill='#5a6478'>③ 按返回地址跳回 main 继续跑</text><rect x='40' y='196' width='600' height='44' rx='8' fill='#fff9ec' stroke='#f0dcae'/><text x='56' y='214' font-size='11.5' fill='#8a5a09'>由此推出两个结论：</text><text x='56' y='232' font-size='11.5' fill='#8a5a09'>① 局部变量的值在函数返回后失效（返回它的地址是严重 bug）　② 递归太深 = 栈帧堆太多 = 栈溢出</text><defs><marker id='a7' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='6' markerHeight='6' orient='auto-start-reverse'><path d='M2 1L8 5L2 9' fill='none' stroke='#8b98b0' stroke-width='1.4'/></marker></defs></svg>" },
      { t: "核心概念：值传递（最容易误解的一点）",
        h: "<p><b>C 语言的参数传递永远是“值传递”</b>：实参的值被<b>复制</b>一份给形参。所以函数内修改形参，不影响外面的变量。</p><p>想让函数“改到外面”，只能传<b>地址</b>（指针），让函数拿着地址去修改那块内存。这是指针存在的第一个理由。</p>",
        code: "#include <stdio.h>\n\nvoid bad_swap(int a, int b)          /* 改的是副本，外面无变化 */\n{\n    int t = a; a = b; b = t;\n}\n\nvoid good_swap(int *a, int *b)       /* 拿到地址，改的是真身 */\n{\n    int t = *a; *a = *b; *b = t;\n}\n\nint main(void)\n{\n    int x = 1, y = 2;\n    bad_swap(x, y);\n    printf(\"bad_swap 之后: x=%d y=%d\\n\", x, y);    /* 1 2 没变 */\n\n    good_swap(&x, &y);                             /* 传地址 */\n    printf(\"good_swap 之后: x=%d y=%d\\n\", x, y);   /* 2 1 交换成功 */\n    return 0;\n}",
    next: ["z9:2", "c5:2"],
    vs: [
          { t: "值传递 vs 传指针", d: "C 只有值传递。传指针「能改外部变量」，不是因为传引用，而是因为你把地址这个值拷了进去，函数顺着地址找到了原变量。" },
          { t: "形参 vs 实参", d: "形参是函数内部新建的局部变量（副本），实参是调用方的东西。改形参永远不影响实参，除非改的是形参指向的内存。" }
        ]
  },
      { t: "核心概念：作用域与生命周期",
        h: "<table><tr><th>变量类型</th><th>作用域（哪里能用）</th><th>生命周期（活多久）</th><th>存放位置</th></tr><tr><td>局部变量</td><td>所在函数/代码块内</td><td>函数执行期间</td><td>栈</td></tr><tr><td>全局变量</td><td>整个程序（其他文件需 extern 声明）</td><td>程序全程</td><td>全局区</td></tr><tr><td>static 局部变量</td><td>所在函数内</td><td>程序全程（只初始化一次）</td><td>全局区</td></tr><tr><td>static 全局变量/函数</td><td>仅本文件</td><td>程序全程</td><td>全局区</td></tr></table><p><b>static 局部变量</b>是面试常问点：作用域没变（还在函数内），但生命周期变成全程，且<b>只初始化一次</b>——适合做“调用计数器”、“懒初始化缓存”。</p>",
        code: "int counter(void)\n{\n    static int n = 0;     /* 只在这里第一次执行时初始化一次 */\n    return ++n;           /* 每次调用都记住上次的值 */\n}\n\nint main(void)\n{\n    printf(\"%d %d %d\\n\", counter(), counter(), counter());\n    /* 注意：参数求值顺序未定义，若想确定输出应分三次调用：\n     * printf(\"%d \", counter()); 连续三次 → 1 2 3\n     */\n    return 0;\n}" },
      { t: "核心概念：递归——自己调用自己",
        h: "<p>递归 = 把大问题拆成同类型的更小问题。写递归必须抓住<b>两件事</b>：</p><ol><li><b>终止条件</b>（什么时候不再递归、直接返回）</li><li><b>递推关系</b>（每层怎么把规模变小，确保趋向终止条件）</li></ol><p>风险：每层递归都占一个栈帧，深度过大会<b>栈溢出</b>。嵌入式设备栈往往只有几 KB，递归深度要心里有数。</p>",
        code: "/* 阶乘：n! = n * (n-1)!  ，终止条件 n<=1 返回 1 */\nint fact(int n)\n{\n    if (n <= 1) return 1;          /* 终止条件：必须先判断！ */\n    return n * fact(n - 1);        /* 递推：规模变小 */\n}\n\n/* 斐波那契（朴素递归，指数级复杂度，n 大时会很慢） */\nint fib(int n)\n{\n    if (n <= 1) return n;\n    return fib(n - 1) + fib(n - 2);\n}",
    kp: ["z7:2"],
    next: ["c10:4", "r2:2"],
    vs: [
          { t: "递归 vs 迭代", d: "递归写法短但每层吃一帧栈，深度不可控；迭代不占额外栈但代码啰嗦。嵌入式里深度超过几十层的递归要警惕。" }
        ]
  },
      { t: "常见错误与坑",
        h: "<ul><li><b>忘记声明或参数类型不符</b>：老标准下会隐式推断出错；C99 起是错误。声明与定义的签名必须完全一致</li><li><b>忘了 return 或漏掉分支的 return</b>：非 void 函数没有 return 会返回垃圾值。<b>每个分支都要有返回</b></li><li><b>以为传参能改外部变量</b>：这是值传递，必须传指针</li><li><b>返回局部变量的地址</b>：<code>return &amp;local;</code> 函数一返回地址就失效（栈帧被回收），使用它是未定义行为——非常典型的面试题</li><li><b>递归没有终止条件或方向错了</b>：无限递归 → 栈溢出（Segmentation fault）</li><li><b>函数太长、做太多事</b>：可读性和可测试性都会崩</li><li><b>把 static 局部变量当全局变量滥用</b>：会让函数有隐藏状态、难测试，只在确实需要记忆时使用</li></ul>" },
      { t: "面试怎么答：函数类问题",
        h: "<p><b>问：C 语言的参数传递是值传递还是引用传递？</b>答：只有值传递。传指针时也是值传递（传递的是地址这个值），只是通过这个地址能修改到原内存，所以产生了“引用传递”的效果。</p><p><b>追问：为什么 swap(int a, int b) 交换不了，swap(int *a, int *b) 可以？</b>答：前者操作的是实参的副本；后者拿到地址，通过解引用修改的是原变量。</p><p><b>追问：函数能不能返回局部变量的地址？</b>答：不能。局部变量在栈上，函数返回后栈帧被回收，那块内存随时会被别的调用覆盖。可以使用 static 变量、全局变量、堆内存（malloc）或由调用者传入缓冲区。</p><p><b>追问：递归和循环怎么选？</b>答：递归代码更贴近问题的数学定义（树遍历、分治），但每层消耗栈、有栈溢出风险、函数调用有开销；能用循环且逻辑不复杂时优先循环。嵌入式里对栈用量敏感，更倾向循环。</p>" },
      { t: "课后练习与作业",
        h: "<p><b>作业</b>：</p><ol><li>写 is_prime(n) 判断素数，用循环优化（只试到 √n）；</li><li>写数组求和、求最大值两个函数，参数为数组与长度（体会“数组传参”）；</li><li>用 static 局部变量写一个调用计数器，验证三次调用输出 1 2 3；</li><li>写递归版阶乘与循环版阶乘，比较 n=20 时的行为（提示：int 会溢出，试 long long）；</li><li>故意 return 一个局部变量的地址，调用后打印它，观察输出为什么是垃圾值；</li><li>把之前所有练习里的重复逻辑抽成函数（如输入校验、打印分隔线）。</li></ol><p><b>完成后你应该能回答</b>：为什么函数里改了形参，外面的变量没变？</p>" }
    ],
    quiz: [
      { type: "single", q: "void bad_swap(int a, int b) { int t=a; a=b; b=t; } 调用后为什么没交换成功？",
        opts: ["语法写错了", "C 语言是值传递，函数收到的是实参的副本，交换副本不影响外面的变量；要交换必须传指针", "return 语句缺失", "需要加 const"], ans: 1,
        exp: "值传递是 C 语言最容易被误解的点。理解它才能理解\"为什么要指针\"。正确写法是传地址，通过解引用修改原变量。" },
      { type: "single", q: "函数内的 static int n = 0; 与普通局部变量 int n = 0; 的区别是？",
        opts: ["没有区别", "static 局部变量只初始化一次、生命周期是程序全程（跨调用保留值），但作用域仍在函数内", "static 让它变成全局变量，其它文件也能访问", "static 让它存在栈上"], ans: 1,
        exp: "三个维度记牢：作用域不变（仍只在函数内）、生命周期变全程、只初始化一次。用它做计数器、缓存很合适，但会让函数有隐藏状态，别滥用。" },
      { type: "single", q: "下列关于函数的说法，错误的是？",
        opts: ["函数定义前需要声明才能被提前调用", "非 void 函数在某些分支忘记 return，会返回垃圾值", "函数可以返回局部变量的地址", "函数参数类型必须与声明一致"], ans: 2,
        exp: "绝对不能返回局部变量地址：函数返回后栈帧被回收，那块内存随时被复用，读它属于未定义行为。可以使用 static 变量、全局变量或 malloc 的内存。" },
      { type: "blank", q: "补全 swap 函数，使其能真正交换两个整数。",
        code: "void swap(int *a, int *b)\n{\n    int t = *a;\n    *a = *b;\n    {{0}};\n}",
        blanks: [{ acc: ["*b=t", "*b = t"] }],
        exp: "三步交换：暂存 *a，把 *b 写到 *a，最后把暂存值写回 *b。指针参数配合解引用才能真正改到调用者的变量。" },
      { type: "blank", q: "读程序写输出：",
        code: "int f(int n)\n{\n    if (n <= 1) return 1;\n    return n * f(n - 1);\n}\nprintf(\"%d\\n\", f(4));",
        blanks: [{ acc: ["24"] }],
        exp: "4! = 4×3×2×1 = 24。递归读法：先确认终止条件 f(1)=1，再一层层展开 f(2)=2, f(3)=6, f(4)=24。" },
      { type: "judge", q: "递归函数只要逻辑正确，无论深度多深都能安全运行。", ans: false,
        exp: "每层递归都占用一个栈帧，深度过大会栈溢出。嵌入式设备栈常常只有几 KB，递归深度必须评估；必要时改写成循环或用显式栈。" },
      { type: "single", q: "函数声明（原型）的主要作用是？",
        opts: ["提高运行速度", "让编译器在调用点就知道函数的参数类型与返回类型，从而做类型检查并生成正确调用代码", "分配内存给函数", "让函数可以被其它文件调用（这是唯一手段）"], ans: 1,
        exp: "声明是给编译器的\"说明书\"。工程上把声明集中放头文件，实现放 .c，配合 static 控制可见性——这就是模块化的基础。" },
      { type: "code", q: "编程任务：写三个函数组成一个小工具箱——is_prime(n) 判断素数、count_primes(a, b) 统计区间内素数个数、print_primes(a, b) 打印区间内所有素数（每行 10 个）。要求 is_prime 用 √n 优化，并在 main 里调用验证 1~100。",
        hint: "<p>is_prime：n&lt;2 返回 0；从 2 试到 i*i &lt;= n（等价于 √n 上界，避免浮点开方）；count_primes 里累加 is_prime 的结果；print_primes 里用计数器控制换行（每 10 个输出一个 \\n）。</p>",
        sol: "#include <stdio.h>\n\n/* 判断素数：只需试除到 sqrt(n)，写成 i*i <= n 避免浮点运算 */\nint is_prime(int n)\n{\n    if (n < 2) return 0;               /* 0 和 1 不是素数 */\n    for (int i = 2; (long)i * i <= n; i++) {\n        if (n % i == 0) return 0;      /* 找到因子，立即返回 */\n    }\n    return 1;\n}\n\n/* 统计 [a, b] 区间内素数个数 */\nint count_primes(int a, int b)\n{\n    int cnt = 0;\n    for (int n = a; n <= b; n++)\n        if (is_prime(n)) cnt++;\n    return cnt;\n}\n\n/* 打印 [a, b] 内所有素数，每行 10 个 */\nvoid print_primes(int a, int b)\n{\n    int col = 0;\n    for (int n = a; n <= b; n++) {\n        if (!is_prime(n)) continue;\n        printf(\"%4d\", n);\n        if (++col % 10 == 0) printf(\"\\n\");   /* 每 10 个换行 */\n    }\n    if (col % 10 != 0) printf(\"\\n\");         /* 最后一行补齐换行 */\n}\n\nint main(void)\n{\n    printf(\"1~100 内素数个数：%d\\n\", count_primes(1, 100));   /* 25 */\n    print_primes(1, 100);\n    return 0;\n}",
        exp: "这个任务练三件事：① 把逻辑拆成小函数（一个函数一件事）；② 用 i*i <= n 代替 sqrt 避免浮点误差与库依赖；③ 用\"计数器 % 10\"控制排版换行。这三条在日常写代码时反复用到。" }
    ]
  });
})();


/* ==== data-zero3.js ==== */

/* ============================================================
   课程十三：C 语言零基础精讲（第 8-10 章）
   数组与字符串 / 指针 / 结构体与内存管理
   ============================================================ */
(function () {
  var ch = window.COURSES[window.COURSES.length - 1].chapters;

  /* ---------------- 第 8 章 ---------------- */
  ch.push({
    id: "z8",
    title: "第 8 章 数组与字符串",
    brief: "一批同类型数据怎么存",
    points: [
      { t: "开篇：为什么需要数组",
        h: "<p>要存 40 个学生的成绩，写 40 个变量 <code>s1, s2, s3...</code> 显然不可行。数组让<b>一批同类型数据共用一块连续内存</b>，用一个名字加下标访问：<code>score[0]</code> 到 <code>score[39]</code>。</p><p>两个必须一开始就记住的事实：<b>下标从 0 开始</b>（为什么？因为下标本质是“距离开头的偏移量”，第一个元素偏移 0）；<b>C 不检查越界</b>（写 <code>score[40]</code> 不会报错，但会偷偷改坏别的内存）。第二条是无数诡异 bug 的源头。</p><p><b>本章目标</b>：会定义/初始化/遍历数组；彻底理解字符串的 \\0 结尾；分清 sizeof 与 strlen；会写自己的字符串处理函数。</p>" },
      { t: "一维数组：定义、初始化、遍历",
        h: "<p>三种初始化方式，以及一个非常实用的惯例：<code>sizeof(a)/sizeof(a[0])</code> 求元素个数。</p>",
        code: "int a[5];                       /* 未初始化，内容是垃圾值 */\nint b[5] = {1, 2, 3};           /* 后两个自动补 0：1 2 3 0 0 */\nint c[]  = {1, 2, 3, 4};        /* 长度自动推导为 4 */\nint d[5] = {0};                 /* 全部清零的常用写法 */\nint n = sizeof(c) / sizeof(c[0]);   /* 元素个数 = 16/4 = 4 */\n\nfor (int i = 0; i < n; i++)      /* 遍历：i < n，不要写 i <= n */\n    printf(\"%d \", c[i]);" },
      { t: "图示：数组在内存中是连续的",
        h: "<p>关键认识：<code>a[i]</code> 的地址 = 起始地址 + i × 单个元素字节数。所以按下标访问是 O(1)（一步算出来，不用遍历），这也是数组比链表“查得快”的根本原因。</p><svg viewBox='0 0 680 200' width='100%' role='img'><text x='30' y='22' font-size='12' fill='#1c2333'>int a[5] 的内存布局（int 占 4 字节）</text><text x='146' y='44' text-anchor='middle' font-size='10.5' fill='#5a6478'>0x1000</text><text x='266' y='44' text-anchor='middle' font-size='10.5' fill='#5a6478'>0x1004</text><text x='386' y='44' text-anchor='middle' font-size='10.5' fill='#5a6478'>0x1008</text><text x='506' y='44' text-anchor='middle' font-size='10.5' fill='#5a6478'>0x100C</text><text x='606' y='44' text-anchor='middle' font-size='10.5' fill='#5a6478'>0x1010</text><rect x='100' y='48' width='92' height='40' fill='#eef3ff' stroke='#2b5cff'/><text x='146' y='72' text-anchor='middle' font-size='12' fill='#1c2333'>a[0]=10</text><rect x='220' y='48' width='92' height='40' fill='#eef3ff' stroke='#2b5cff'/><text x='266' y='72' text-anchor='middle' font-size='12' fill='#1c2333'>a[1]=20</text><rect x='340' y='48' width='92' height='40' fill='#eef3ff' stroke='#2b5cff'/><text x='386' y='72' text-anchor='middle' font-size='12' fill='#1c2333'>a[2]=30</text><rect x='460' y='48' width='92' height='40' fill='#eef3ff' stroke='#2b5cff'/><text x='506' y='72' text-anchor='middle' font-size='12' fill='#1c2333'>a[3]=40</text><rect x='580' y='48' width='80' height='40' fill='#eef3ff' stroke='#2b5cff'/><text x='620' y='72' text-anchor='middle' font-size='12' fill='#1c2333'>a[4]=50</text><line x1='100' y1='102' x2='660' y2='102' stroke='#8b98b0' stroke-width='1' stroke-dasharray='4 3'/><text x='380' y='120' text-anchor='middle' font-size='11' fill='#5a6478'>地址连续递增，每个元素固定 4 字节</text><rect x='100' y='136' width='560' height='52' rx='8' fill='#e8fbf3' stroke='#0e9f6e'/><text x='116' y='156' font-size='11.5' fill='#0f7a52'>a[i] 的地址 = &amp;a[0] + i * sizeof(int)　→　按下标访问是一步计算，复杂度 O(1)</text><text x='116' y='176' font-size='11.5' fill='#e02424'>a[5] 已越过数组末尾：C 不报错，会写入别的变量或只读区 → 数据错乱或段错误</text></svg>" },
      { t: "字符串：以 \\0 结尾的字符数组",
        h: "<p>C 语言没有专门的字符串类型，字符串就是<b>以 <code>\\0</code>（数值 0）结尾的 char 数组</b>。这个结尾符是自动加的，它决定了三件事：字符串长度、函数怎么知道结尾、以及为什么 sizeof 和 strlen 不同。</p><p><b>sizeof(数组)=占用的总字节数（含 \\0）；strlen(字符串)=有效字符个数（不含 \\0）</b>。这条区别是笔试超高频考点。</p><svg viewBox='0 0 680 190' width='100%' role='img'><text x='30' y='22' font-size='12' fill='#1c2333'>char s[] = \"abc\";　实际占用 4 个字节</text><rect x='100' y='36' width='70' height='40' fill='#eef3ff' stroke='#2b5cff'/><text x='135' y='60' text-anchor='middle' font-size='13' fill='#1c2333'>a</text><rect x='170' y='36' width='70' height='40' fill='#eef3ff' stroke='#2b5cff'/><text x='205' y='60' text-anchor='middle' font-size='13' fill='#1c2333'>b</text><rect x='240' y='36' width='70' height='40' fill='#eef3ff' stroke='#2b5cff'/><text x='275' y='60' text-anchor='middle' font-size='13' fill='#1c2333'>c</text><rect x='310' y='36' width='70' height='40' fill='#fff4e6' stroke='#ea580c'/><text x='345' y='60' text-anchor='middle' font-size='13' fill='#b45309'>\\0</text><text x='100' y='94' font-size='11' fill='#5a6478'>下标 0　　　　　1　　　　　2　　　　　3</text><text x='100' y='116' font-size='11.5' fill='#0f7a52'>sizeof(s) = 4　（含结尾 \\0）</text><text x='100' y='136' font-size='11.5' fill='#0f7a52'>strlen(s) = 3　（不含结尾 \\0）</text><text x='360' y='116' font-size='11.5' fill='#5a6478'>遍历字符串的标准写法：</text><text x='360' y='136' font-size='11.5' fill='#5a6478'>while (s[i] != '\\0') i++;</text><text x='360' y='156' font-size='11.5' fill='#e02424'>忘写 \\0 → 函数会一直往后读，直到撞上随机出现的 0</text></svg>",
    next: ["c6:3", "c8:3"],
    vs: [
          { t: "sizeof vs strlen", d: "sizeof 算的是数组本身占的字节数（含末尾 \\0）；strlen 数到 \\0 为止，不含 \\0。char s[10]=\"abc\" 时 sizeof=10、strlen=3。" },
          { t: "字符数组 vs 字符串字面量", d: "char a[]=\"abc\" 是可改的数组；char *p=\"abc\" 指向只读常量区，改 p[0] 会段错误。" }
        ]
  },
      { t: "常用字符串函数（必须背下来）",
        h: "<p>都在 <code>&lt;string.h&gt;</code> 里。注意它们的返回值含义，特别是 strcmp。</p><table><tr><th>函数</th><th>作用</th><th>返回值/注意</th></tr><tr><td>strlen(s)</td><td>求长度</td><td>字符个数（不含 \\0）</td></tr><tr><td>strcpy(d, s)</td><td>拷贝字符串</td><td>目标空间不够会溢出！安全版 strncpy</td></tr><tr><td>strcat(d, s)</td><td>把 s 接到 d 末尾</td><td>d 必须有足够剩余空间</td></tr><tr><td>strcmp(a, b)</td><td>比较</td><td><b>相等返回 0</b>，a&lt;b 返回负数，a&gt;b 返回正数</td></tr><tr><td>strncpy / snprintf</td><td>限长拷贝 / 格式化到缓冲</td><td>更安全，推荐</td></tr><tr><td>strchr / strstr</td><td>查找字符/子串</td><td>返回指针，找不到返回 NULL</td></tr></table>",
        code: "#include <stdio.h>\n#include <string.h>\n\nint main(void)\n{\n    char dst[16];\n\n    /* 安全拷贝：留出 \\0 的位置，再手动保底 */\n    strncpy(dst, \"hello\", sizeof(dst) - 1);\n    dst[sizeof(dst) - 1] = '\\0';\n\n    printf(\"长度=%zu 内容=%s\\n\", strlen(dst), dst);\n\n    /* 比较：相等时返回 0，所以判断相等要写 == 0 */\n    if (strcmp(dst, \"hello\") == 0)\n        printf(\"相同\\n\");\n\n    strcat(dst, \"!\");          /* 拼接后是 hello! */\n    printf(\"%s 长度=%zu\\n\", dst, strlen(dst));\n    return 0;\n}" },
      { t: "常见错误与坑",
        h: "<ul><li><b>数组越界</b>：<code>int a[5]</code> 只能用到 a[4]。越界写会改坏相邻变量（可能看不出问题）或撞到只读区（段错误）</li><li><b>字符串忘了 \\0</b>：手动逐字符填充时必须自己补结尾符，否则 printf(\"%s\") 会一直往后读到随机 0</li><li><b>char *s = \"abc\"; 然后 s[0] = 'x';</b> → 崩溃。字面量在只读常量区；要能改必须用 char s[] = \"abc\";（拷贝到栈上的数组）</li><li><b>数组名大小陷阱</b>：<code>sizeof(a)</code> 在定义它的作用域里是数组总大小，但<b>传参后退化成指针</b>，sizeof 变成 4 或 8。所以函数必须额外接收长度参数</li><li><b>strcpy 目标空间不足</b>：最经典的缓冲区溢出。用 strncpy/snprintf 并保证结尾</li><li><b>strcmp 返回值当布尔用</b>：相等返回 0（假），所以 <code>if (strcmp(a,b))</code> 的语义是“不相等时成立”，容易写反</li><li><b>用 scanf(\"%s\") 读字符串</b>：不限长会溢出，且遇空格就停。用 fgets 或 \"%15s\"</li></ul>" },
      { t: "面试怎么答：数组与字符串问题",
        h: "<p><b>问：数组名和指针是一回事吗？</b>答：不是。数组名代表一块连续内存，可在多数场景退化为指向首元素的指针，但 sizeof(数组名) 得到整个数组大小，且数组名不可被赋值。指针则是一个存地址的变量，可重新指向、有自身大小。</p><p><b>追问：为什么数组传参后 sizeof 就不对了？</b>答：形参数组退化为指针，sizeof 得到指针大小（4/8 字节）。所以函数必须额外传长度参数——这也是所有标准库函数的做法（memcpy、fread 都要长度）。</p><p><b>追问：sizeof 与 strlen 的区别？</b>答：sizeof 是编译期运算符，得占用的字节数（数组含 \\0）；strlen 是运行期函数，数到第一个 \\0 为止（不含 \\0）。对 char s[]=\"abc\"，sizeof=4，strlen=3。</p><p><b>追问：字符串字面量为什么不能改？</b>答：字面量存放在只读的常量区，修改会触发段错误。需要修改就复制到数组里：char buf[] = \"abc\";。</p>" },
      { t: "课后练习与作业",
        h: "<p><b>作业</b>：</p><ol><li>输入 10 个整数存入数组，输出最大值、最小值、平均值、总和；</li><li>不调用库函数，自己实现 strlen 与 strcpy（注意循环结束条件与结尾符）；</li><li>实现字符串逆置函数（双指针首尾交换）并打印结果；</li><li>用二维数组存 3 名学生 4 门课成绩，输出每人的总分与平均分；</li><li>故意写 a[5]（长度为 5 的数组），观察是否有报错、结果是否异常，并解释为什么。</li><li>写程序验证 sizeof 与 strlen 在数组与指针上的不同结果。</li></ol><p><b>完成后你应该能回答</b>：为什么字符串函数不需要长度参数，而数组函数需要？</p>" }
    ],
    quiz: [
      { type: "single", q: "char s[] = \"abc\"; 中 sizeof(s) 与 strlen(s) 分别是？",
        opts: ["3 和 3", "4 和 3", "3 和 4", "4 和 4"], ans: 1,
        exp: "sizeof 得到数组占用的总字节数，含自动添加的结尾 \\0 所以是 4；strlen 数到第一个 \\0 为止，所以是 3。这是笔试必考的第一题级别。" },
      { type: "single", q: "为什么按下标访问数组元素 a[i] 的复杂度是 O(1)？",
        opts: ["因为编译器做了缓存", "因为地址可以直接算出来：起始地址 + i × 元素字节数，不需要遍历", "因为数组元素很少", "因为 CPU 有数组加速指令"], ans: 1,
        exp: "连续存储 + 固定元素大小 = 地址可计算。这是数组相比链表的核心优势，也是后面学哈希表、二分查找的前提。" },
      { type: "single", q: "int a[5]; 之后访问 a[5] 会怎样？",
        opts: ["编译报错", "运行时报错并停止", "越界访问：不报错但会读写到数组之外的内存，可能改坏其它变量或导致段错误", "自动扩展数组"], ans: 2,
        exp: "C 语言不做越界检查，这是它高效但也危险的根源。所有遍历都要用 i < n 的形式，边界值单独想清楚。" },
      { type: "blank", q: "补全代码：遍历字符串直到结尾（用字符字面量表示结尾符）。",
        code: "int i = 0;\nwhile (s[i] != {{0}}) {\n    putchar(s[i]);\n    i++;\n}",
        blanks: [{ acc: ["'\\0'", "0"] }],
        exp: "字符串以 \\0（数值 0）结尾。写 s[i] != '\\0' 或 s[i] != 0 都可以——因为 \\0 本质就是整数 0，这也是“非 0 为真”的又一体现。" },
      { type: "single", q: "判断两个字符串是否相等，正确写法是？",
        opts: ["if (a == b)", "if (strcmp(a, b) == 0)", "if (strcmp(a, b) == 1)", "if (a = b)"], ans: 1,
        exp: "strcmp 相等时返回 0（不是 1！）。用 == 比较的是两个指针的地址，永远不等于内容。这两个坑合起来坑了无数初学者。" },
      { type: "judge", q: "char *s = \"abc\"; 然后执行 s[0] = 'x'; 会修改字符串内容。", ans: false,
        exp: "字面量存于只读常量区，修改会段错误。要能修改必须用数组形式 char s[] = \"abc\";——这样字符串会拷贝到栈上的可写内存。" },
      { type: "blank", q: "读程序写输出：",
        code: "char a[] = \"hello\";\nint n = sizeof(a) / sizeof(a[0]);\nprintf(\"%d\\n\", n);",
        blanks: [{ acc: ["6"] }],
        exp: "hello 是 5 个字符 + 结尾 \\0 = 6 字节。sizeof(a)/sizeof(a[0]) 是求元素个数的标准写法，在定义所在作用域内有效。" },
      { type: "code", q: "编程任务：不调用库函数，自己实现三个字符串函数——my_strlen、my_strcpy、my_reverse（原地逆置）。要求：my_strcpy 返回目标地址以便链式调用；my_reverse 用双指针实现；在 main 里各测试一次并打印结果。",
        hint: "<p>my_strlen：while (*s++) n++; 或下标循环到 '\\0'。my_strcpy：用指针复制包括结尾 \\0。my_reverse：两个下标从首尾向中间交换，条件是 i &lt; j。</p>",
        sol: "#include <stdio.h>\n\n/* 求长度：数到 \\0 为止，不含 \\0 */\nsize_t my_strlen(const char *s)\n{\n    size_t n = 0;\n    while (s[n] != '\\0') n++;\n    return n;\n}\n\n/* 拷贝：连同结尾 \\0 一起复制，返回目标首地址 */\nchar *my_strcpy(char *dst, const char *src)\n{\n    char *ret = dst;                  /* 保存首地址用于返回 */\n    while ((*dst++ = *src++) != '\\0')\n        ;                             /* 空循环体：赋值表达式同时完成判断 */\n    return ret;\n}\n\n/* 原地逆置：双指针向中间靠拢 */\nvoid my_reverse(char *s)\n{\n    size_t len = my_strlen(s);\n    if (len < 2) return;\n    size_t i = 0, j = len - 1;\n    while (i < j) {\n        char t = s[i];\n        s[i] = s[j];\n        s[j] = t;\n        i++;\n        j--;\n    }\n}\n\nint main(void)\n{\n    const char *src = \"hello\";\n    char buf[32];\n\n    printf(\"长度 = %zu\\n\", my_strlen(src));      /* 5 */\n    printf(\"拷贝后 = %s\\n\", my_strcpy(buf, src));\n\n    my_reverse(buf);\n    printf(\"逆置后 = %s\\n\", buf);                /* olleh */\n    return 0;\n}\n\n/* 课堂提示：\n * while ((*dst++ = *src++) != '\\0');  这一行很经典：\n *   先复制一个字符，再判断它是否为 0；不是 0 就继续。\n * 注意赋值的括号不能省，否则优先级会出错。\n */",
        exp: "自己实现一遍，才能真正理解：① 字符串函数靠 \\0 判断结尾，所以不需要长度参数；② my_strcpy 保存首地址再返回（链式调用友好）；③ 逆置用双指针，是后面链表反转、回文判断的同一思想。" }
    ]
  });

  /* ---------------- 第 9 章 ---------------- */
  ch.push({
    id: "z9",
    title: "第 9 章 指针：C 语言的灵魂",
    brief: "地址、解引用、指针与数组、三大事故",
    points: [
      { t: "开篇：先建立直观模型",
        h: "<p>把内存想象成<b>一排带门牌号的小房间</b>，每间房能放一个字节。门牌号就是<b>地址</b>。变量是“住在某些房间里的一份数据”，而<b>指针就是一个专门用来记录门牌号的变量</b>。</p><p>两个运算符必须分清：</p><ul><li><code>&amp;变量</code>：取地址 → 得到“门牌号”</li><li><code>*指针</code>：解引用 → 顺着门牌号去房间里取/放东西</li></ul><p>指针难，难在它是“间接”的——程序里多绕了一层。但一旦想通“指针存的是地址、解引用是访问那个地址”，剩下的都是细节。<b>嵌入式开发里寄存器操作、缓冲区、链表、驱动接口全是指针，绕不开</b>。</p><p><b>本章目标</b>：能画出指针指向关系；会用指针修改外部变量、遍历数组；彻底记住三大指针事故及其防护。</p>" },
      { t: "核心概念：三个基本事实",
        h: "<ol><li><b>指针变量自己也有地址</b>，也有大小：32 位平台 4 字节、64 位平台 8 字节，与其指向什么类型<b>无关</b>。</li><li><b>类型决定两件事</b>：解引用时读几个字节、加 1 时走多远。<code>int *</code> 加 1 跳 4 字节，<code>char *</code> 加 1 跳 1 字节。</li><li><b>指针可以不指向任何有效内存</b>：NULL 表示“明确无效”，未初始化表示“随机地址（野指针）”，指向已释放内存表示“悬垂指针”。后两者是事故高发区。</li></ol>",
        code: "#include <stdio.h>\n\nint main(void)\n{\n    int a = 42;\n    int *p = &a;              /* p 存 a 的地址 */\n\n    printf(\"a 的值      = %d\\n\", a);\n    printf(\"a 的地址    = %p\\n\", (void *)&a);\n    printf(\"p 里存的值  = %p\\n\", (void *)p);      /* 与上一行相同 */\n    printf(\"p 的地址    = %p\\n\", (void *)&p);      /* 指针自己也有地址 */\n    printf(\"*p 的值     = %d\\n\", *p);             /* 42：顺着地址取值 */\n\n    *p = 100;                  /* 通过指针改 a */\n    printf(\"改完后 a    = %d\\n\", a);              /* 100 */\n\n    printf(\"sizeof(int*)   = %zu\\n\", sizeof(int *));\n    printf(\"sizeof(char*)  = %zu\\n\", sizeof(char *));  /* 与上面相同 */\n    return 0;\n}",
    kp: ["z2:2", "z7:4"],
    next: ["z9:4", "c7:1", "ds3:1"],
    vs: [
          { t: "指针变量 vs 它指向的值", d: "p 是「存地址的盒子」，*p 是「顺着地址找到的东西」。搞混这一点，后面所有指针问题都会连锁崩。" },
          { t: "NULL 指针 vs 野指针", d: "NULL 是明确不指向任何地方（解引用必然崩，好排查）；野指针是没初始化的随机地址（可能悄悄改坏数据，最危险）。" }
        ]
  },
      { t: "图示：指针存的是地址",
        h: "<p>看图把两层关系分清：左侧是变量 <code>a</code>（房间里放着 42），右侧是指针 <code>p</code>（房间里放着 a 的门牌号 0x1000）。<b>箭头表示“指向”</b>——这就是“指针”这个名字的由来。</p><svg viewBox='0 0 680 210' width='100%' role='img'><text x='40' y='22' font-size='12' fill='#1c2333'>内存</text><rect x='40' y='120' width='150' height='56' rx='8' fill='#eef3ff' stroke='#2b5cff'/><text x='115' y='142' text-anchor='middle' font-size='11.5' fill='#1c2333'>变量 a（int）</text><text x='115' y='162' text-anchor='middle' font-size='12' fill='#0f7a52'>值 = 42</text><text x='115' y='192' text-anchor='middle' font-size='10.5' fill='#5a6478'>地址 0x1000</text><rect x='430' y='120' width='150' height='56' rx='8' fill='#fff4e6' stroke='#ea580c'/><text x='505' y='142' text-anchor='middle' font-size='11.5' fill='#b45309'>变量 p（int *）</text><text x='505' y='162' text-anchor='middle' font-size='12' fill='#b45309'>值 = 0x1000</text><text x='505' y='192' text-anchor='middle' font-size='10.5' fill='#5a6478'>地址 0x2000（p 自己也有地址）</text><path d='M430 148 C360 148 300 148 192 148' fill='none' stroke='#ea580c' stroke-width='1.6' marker-end='url(#p9)'/><text x='300' y='138' text-anchor='middle' font-size='11' fill='#b45309'>p 指向 a</text><rect x='40' y='40' width='540' height='56' rx='8' fill='#f6f7fa' stroke='#c8cfdb'/><text x='56' y='60' font-size='11.5' fill='#1c2333'>两条核心语句：</text><text x='56' y='80' font-size='11.5' fill='#5a6478'>int *p = &amp;a;　→　把 a 的地址装进 p（此时 p 指向 a）　　　*p = 100;　→　顺着 p 里的地址，把那个房间的内容改成 100</text><defs><marker id='p9' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M2 1L8 5L2 9' fill='none' stroke='#ea580c' stroke-width='1.6'/></marker></defs></svg>" },
      { t: "指针与数组：为什么 a[i] 等价于 *(a+i)",
        h: "<p>数组名在多数场景会<b>退化为指向首元素的指针</b>，于是：<code>a[i]</code> ≡ <code>*(a + i)</code> ≡ <code>*(p + i)</code>（当 p = a 时）。下标访问本质上就是“指针运算 + 解引用”的语法糖。</p><p>但数组和指针<b>不是一回事</b>：<code>sizeof(a)</code> 是整个数组大小，<code>sizeof(p)</code> 是指针大小；数组名不能被赋值（<code>a = p</code> 非法）。</p>",
        code: "int a[4] = {10, 20, 30, 40};\nint *p = a;               /* 等价于 p = &a[0] */\n\nprintf(\"%d\\n\", a[2]);    /* 30 */\nprintf(\"%d\\n\", *(a+2));  /* 30：完全等价 */\nprintf(\"%d\\n\", p[2]);    /* 30：指针也能用下标 */\nprintf(\"%d\\n\", *(p+2));  /* 30 */\n\np++;                      /* 指针前移一个元素（+4 字节，不是 +1 字节！） */\nprintf(\"%d\\n\", *p);      /* 20 */\n\nprintf(\"sizeof(a)=%zu, sizeof(p)=%zu\\n\", sizeof(a), sizeof(p));  /* 16 和 8 */",
    kp: ["z9:2", "z8:2"],
    next: ["c8:2", "c8:1"],
    vs: [
          { t: "a[i] vs *(a+i)", d: "两者完全等价，[] 就是指针运算的语法糖。理解这点，二维数组、指针数组、数组指针全都能推出来。" },
          { t: "数组 vs 指针", d: "数组是一块连续内存，指针是一个存地址的变量。数组名不能被赋值（a = p 非法），但指针可以。" }
        ]
  },
      { t: "指针的实战用途（三个典型场景）",
        h: "<p><b>场景一：通过指针修改调用者的变量</b>（函数只能值传递时唯一的出路）。<b>场景二：数组传参</b>（数组退化成指针，所以必须额外传长度）。<b>场景三：遍历与输出参数</b>（函数通过指针参数“返回”多个值）。</p>",
        code: "/* 场景一：交换 */\nvoid swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }\n\n/* 场景二：数组求和，必须知道长度 */\nint sum(const int *arr, int n)\n{\n    int s = 0;\n    for (int i = 0; i < n; i++)\n        s += arr[i];\n    return s;\n}\n\n/* 场景三：同时返回最大值和最小值（输出参数） */\nvoid min_max(const int *a, int n, int *out_min, int *out_max)\n{\n    *out_min = *out_max = a[0];\n    for (int i = 1; i < n; i++) {\n        if (a[i] < *out_min) *out_min = a[i];\n        if (a[i] > *out_max) *out_max = a[i];\n    }\n}\n\nint main(void)\n{\n    int a[5] = {3, 7, 1, 9, 4};\n    int lo, hi;\n    min_max(a, 5, &lo, &hi);          /* 传地址，函数才能写回结果 */\n    printf(\"min=%d max=%d\\n\", lo, hi);\n    return 0;\n}",
    next: ["c8:3", "c9:2", "c8:4"]
  },
      { t: "三大指针事故与防护",
        h: "<table><tr><th>事故</th><th>怎么产生</th><th>症状</th><th>防护</th></tr><tr><td>解引用 NULL</td><td>函数返回失败但没判空就去解引用</td><td>立刻段错误（反而是最好查的）</td><td>用前 <code>if (p != NULL)</code></td></tr><tr><td>野指针</td><td>指针未初始化，里面是随机地址</td><td>症状飘忽：有时崩、有时悄悄改坏数据</td><td>定义即初始化（NULL 或有效地址）</td></tr><tr><td>悬垂指针</td><td>free 之后没置 NULL，或返回了局部变量地址</td><td>use-after-free：读到垃圾或崩溃</td><td>free 后立即置 NULL；不返回局部地址</td></tr></table>",
        code: "/* 错误示例：返回局部变量的地址 —— 面试经典题 */\nint *bad(void)\n{\n    int local = 10;\n    return &local;      /* 函数已返回，local 所在栈帧已回收 */\n}\n\n/* 正确做法一：用调用者提供的缓冲 */\nvoid good(int *out) { *out = 10; }\n\n/* 正确做法二：用 static（要注意生命周期与线程安全） */\nint *also_ok(void)\n{\n    static int s = 10;  /* 存放在全局区，函数返回后仍有效 */\n    return &s;\n}",
    kp: ["z9:2"],
    next: ["c7:4", "c10:3", "e4:2"],
    vs: [
          { t: "段错误 vs 静默改坏数据", d: "解引用 NULL 立刻段错误——这是好事，死得快好定位；野指针改坏别的变量可能几天后才表现为诡异 bug。" }
        ]
  },
      { t: "面试怎么答：指针类问题（每场必问）",
        h: "<p><b>问：指针和引用的区别？</b>答：C 里没有引用（那是 C++）。C 语言里要区分“指针”和“数组名”：指针是变量可重新指向，数组名代表固定内存不可赋值，且 sizeof 不同。</p><p><b>追问：sizeof(指针) 和 sizeof(数组) 有什么区别？</b>答：指针大小只与平台位数有关（4 或 8，与指向类型无关）；数组大小是元素数 × 元素大小。数组传参后退化为指针，此时 sizeof 得到指针大小。</p><p><b>追问：什么是野指针、悬垂指针？怎么避免？</b>答：野指针是未初始化、值随机的指针；悬垂指针指向已释放或已失效的内存。避免方式：定义即初始化、用前判空、free 后置 NULL、绝不返回局部变量地址。</p><p><b>追问：p++ 与 (*p)++ 有什么区别？</b>答：p++ 让指针本身前移一个元素（地址变），(*p)++ 让指针所指的<b>值</b>加一（地址不变）。这是因为后置 ++ 优先级高于 *，所以 *p++ 实际是 *(p++)。</p>" },
      { t: "课后练习与作业",
        h: "<p><b>作业</b>：</p><ol><li>写程序打印一个 int 变量的值、地址、以及通过指针访问的值（用 %p 打印地址）；</li><li>实现 swap 函数并验证交换成功；</li><li>用指针遍历数组求最大值与和（不用下标写法）；</li><li>写 min_max 函数，通过指针参数返回最大值和最小值；</li><li>故意写出野指针解引用与解引用 NULL，观察段错误信息（学会看崩溃）；</li><li>把第 8 章的字符串逆置函数改用指针实现。</li></ol><p><b>完成后你应该能回答</b>：为什么 <code>int *p</code> 加 1 会跳 4 个字节？</p>" }
    ],
    quiz: [
      { type: "single", q: "int a = 42; int *p = &a; 那么 p 里存的是什么？",
        opts: ["42", "a 的地址", "0x2000 这样的固定值", "a 的字节数"], ans: 1,
        exp: "指针变量存的是地址。& 取地址、* 解引用，这一对运算符方向相反。搞清楚这一点，指针就通了一半。" },
      { type: "single", q: "在 64 位平台上，sizeof(int*) 与 sizeof(char*) 分别是？",
        opts: ["4 和 1", "8 和 8", "4 和 8", "8 和 4"], ans: 1,
        exp: "指针大小只取决于平台地址位宽（64 位平台 8 字节），与指向的类型无关。类型影响的是解引用宽度和指针运算的步长。" },
      { type: "single", q: "int a[4]; int *p = a; 执行 p++ 后，p 的地址增加了多少字节？",
        opts: ["1", "2", "4", "8"], ans: 2,
        exp: "指针加 1 移动“一个所指向类型”的大小。int 占 4 字节，所以加 4。char* 加 1 才是加 1 字节。" },
      { type: "blank", q: "补全代码：通过指针把变量 a 改成 100。",
        code: "int a = 42;\nint *p = &a;\n{{0}};",
        blanks: [{ acc: ["*p=100", "*p = 100"] }],
        exp: "*p = 100 表示“顺着 p 里的地址找到那个房间，把内容改成 100”。写成 p = 100 是把地址改成 100，属于灾难性错误。" },
      { type: "single", q: "函数返回局部变量地址会有什么问题？",
        opts: ["没有问题，可以正常使用", "局部变量在栈上，函数返回后栈帧被回收，该地址随时可能被别的调用覆盖——使用它是未定义行为", "编译不通过", "只是浪费内存"], ans: 1,
        exp: "这是面试必考题。三条替代方案：用 static 变量、用全局变量、让调用者传入缓冲区（malloc 也行但要谁申请谁释放）。" },
      { type: "judge", q: "int a[5]; 中 a 与 int *p = a; 里的 p 完全等价，可以互相赋值。", ans: false,
        exp: "数组名可退化为指针，但它是常量，不能被赋值（a = p 非法）；sizeof(a) 是数组总大小而 sizeof(p) 是指针大小。数组不是指针。" },
      { type: "blank", q: "读程序写输出（数字连续，无空格）：",
        code: "int a[3] = {10, 20, 30};\nint *p = a;\nprintf(\"%d\", *p);\nprintf(\"%d\", *(p + 2));",
        blanks: [{ acc: ["1030"] }],
        exp: "*p 取 a[0]=10；*(p+2) 取 a[2]=30（指针前移两个元素）。这就是 a[i] ≡ *(a+i) 的实证。" },
      { type: "code", q: "编程任务：写一个函数 split_sum(const int *a, int n, int *even_sum, int *odd_sum)，通过指针参数返回数组中偶数之和与奇数之和；在 main 中定义数组并调用，打印两个结果。",
        hint: "<p>输出参数用指针：函数内用 *even_sum 累加。注意初始化两个输出参数为 0（在函数开头赋值）。判断奇偶可以用 x % 2（不要用 x & 1 除非你确定理解补码）。</p>",
        sol: "#include <stdio.h>\n\n/* 通过指针参数返回两个统计结果 */\nvoid split_sum(const int *a, int n, int *even_sum, int *odd_sum)\n{\n    if (a == NULL || even_sum == NULL || odd_sum == NULL) return;  /* 参数校验 */\n\n    *even_sum = 0;               /* 输出参数必须在函数内初始化，\n                                  * 不能假设调用者已经清零 */\n    *odd_sum  = 0;\n\n    for (int i = 0; i < n; i++) {\n        if (a[i] % 2 == 0)\n            *even_sum += a[i];\n        else\n            *odd_sum += a[i];\n    }\n}\n\nint main(void)\n{\n    const int data[] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};\n    int n = (int)(sizeof(data) / sizeof(data[0]));\n    int even = 0, odd = 0;\n\n    split_sum(data, n, &even, &odd);\n    printf(\"偶数和 = %d，奇数和 = %d\\n\", even, odd);   /* 30 和 25 */\n    return 0;\n}\n\n/* 要点总结：\n * 1) 数组参数写成 const int *a，长度必须另传（退化问题）；\n * 2) 输出参数用指针，调用时传 &变量；\n * 3) 输出参数要在函数内初始化，避免依赖调用者的初值；\n * 4) 入口做 NULL 校验，这是工程代码的基本素养。\n */",
        exp: "这个任务把指针的两个核心用途一次练到：数组传参（并用 const 表达“只读”意图）+ 输出参数（一次返回多个结果）。工程里大量接口都是这个形状，例如 read(fd, buf, len) 返回读到的字节数、gettimeofday(&tv, NULL) 通过指针写回时间。" }
    ]
  });

  /* ---------------- 第 10 章 ---------------- */
  ch.push({
    id: "z10",
    title: "第 10 章 结构体与内存管理",
    brief: "打包数据、申请内存、看清程序的内存地图",
    points: [
      { t: "开篇：把相关数据打包成一个整体",
        h: "<p>描述一个学生要姓名、年龄、成绩三样数据。若用三个独立数组，改动和传递都很麻烦。<b>结构体（struct）把不同类型的数据打包成一个整体</b>，用一个名字管理——这是 C 语言里唯一的“自定义数据类型”手段，也是后面链表、协议报文、驱动描述的基础。</p><p><b>本章目标</b>：会定义/初始化/访问结构体；理解内存对齐；会 malloc/free 并避开四大内存事故；能画出程序的内存分区图。</p>" },
      { t: "核心概念：定义、初始化、访问",
        h: "<p>写法三步：<b>typedef struct 起名字 → 定义变量 → 用 . 或 -&gt; 访问成员</b>。变量用点号，指针用箭头（<code>p-&gt;age</code> 等价于 <code>(*p).age</code>）。同类型结构体变量之间<b>可以整体赋值</b>。</p>",
        code: "#include <stdio.h>\n#include <string.h>\n\n/* 用 typedef 起短名字，方便后续使用 */\ntypedef struct {\n    char  name[16];\n    int   age;\n    float score;\n} Student;\n\nint main(void)\n{\n    /* 方式一：按顺序初始化 */\n    Student s1 = {\"Tom\", 20, 88.5f};\n\n    /* 方式二：指定成员初始化（推荐，不怕字段顺序变化） */\n    Student s2 = { .name = \"Jerry\", .age = 19, .score = 92.0f };\n\n    /* 整体赋值（同类型之间可以） */\n    Student s3 = s1;\n\n    printf(\"%s %d %.1f\\n\", s1.name, s1.age, s1.score);\n\n    /* 通过指针访问：箭头运算符 */\n    Student *p = &s1;\n    p->age = 21;                       /* 等价于 (*p).age = 21 */\n    printf(\"改年龄后：%d\\n\", s1.age);\n    printf(\"整体赋值副本：%s\\n\", s3.name);\n    return 0;\n}" },
      { t: "图示：结构体在内存里与字节对齐",
        h: "<p>结构体成员按定义顺序依次存放，但为了提高访问效率，编译器会做<b>内存对齐</b>：让每个成员起始地址是它自身大小的整数倍，必要时插入填充字节。<code>char + int</code> 因此占 8 字节而不是 5。</p><svg viewBox='0 0 680 220' width='100%' role='img'><text x='30' y='22' font-size='12' fill='#1c2333'>struct { char c; int i; }　占用 8 字节</text><rect x='60' y='36' width='70' height='38' fill='#eef3ff' stroke='#2b5cff'/><text x='95' y='60' text-anchor='middle' font-size='11.5' fill='#1c2333'>c</text><rect x='130' y='36' width='70' height='38' fill='#f6f7fa' stroke='#c8cfdb' stroke-dasharray='4 3'/><text x='165' y='60' text-anchor='middle' font-size='10.5' fill='#8b98b0'>填充</text><rect x='200' y='36' width='70' height='38' fill='#f6f7fa' stroke='#c8cfdb' stroke-dasharray='4 3'/><text x='235' y='60' text-anchor='middle' font-size='10.5' fill='#8b98b0'>填充</text><rect x='270' y='36' width='70' height='38' fill='#f6f7fa' stroke='#c8cfdb' stroke-dasharray='4 3'/><text x='305' y='60' text-anchor='middle' font-size='10.5' fill='#8b98b0'>填充</text><rect x='340' y='36' width='140' height='38' fill='#fff4e6' stroke='#ea580c'/><text x='410' y='60' text-anchor='middle' font-size='11.5' fill='#b45309'>i（4 字节）</text><text x='60' y='94' font-size='11' fill='#5a6478'>偏移 0　　　1　　　2　　　3　　　4 ~ 7</text><text x='60' y='118' font-size='11.5' fill='#c2410c'>为什么要填充：让 int 的起始地址是 4 的倍数 —— 未对齐访问在某些 CPU 上会变慢甚至触发异常</text><text x='60' y='142' font-size='11.5' fill='#0f7a52'>省内存技巧：把大成员放前面（int 在前、char 在后）可减少填充</text><rect x='60' y='158' width='560' height='50' rx='8' fill='#f6f7fa' stroke='#c8cfdb'/><text x='76' y='178' font-size='11.5' fill='#1c2333'>需要“按字节精确排布”时（如通信报文、存盘结构）用紧凑模式：</text><text x='76' y='198' font-size='11.5' fill='#5a6478'>#pragma pack(1) 或 __attribute__((packed)) —— 代价是可能未对齐访问，性能与平台兼容性要权衡</text></svg>",
    next: ["e3:4"],
    vs: [
          { t: "结构体大小不等于成员之和", d: "成员按自身大小自然对齐，中间会填空洞。struct{char c; int i;} 在多数平台是 8 字节而不是 5。" },
          { t: "自然对齐 vs 紧凑排列", d: "默认自然对齐（快但占空间）；协议 / 存储结构体用 #pragma pack(1) 压紧，代价是某些架构上未对齐访问变慢甚至异常。" }
        ]
  },
      { t: "核心概念：程序的内存地图（五区）",
        h: "<p>理解内存分区能解释很多现象：为什么局部变量返回就失效（栈回收）、为什么全局数组不能太大（空间有限）、为什么 malloc 要配对 free（堆手动管理）。</p><svg viewBox='0 0 680 250' width='100%' role='img'><text x='30' y='20' font-size='11.5' fill='#5a6478'>高地址</text><rect x='90' y='28' width='420' height='42' rx='6' fill='#eef3ff' stroke='#2b5cff'/><text x='300' y='54' text-anchor='middle' font-size='12' fill='#1c2333'>栈 stack　← 向下增长</text><rect x='90' y='78' width='420' height='42' rx='6' fill='#fff4e6' stroke='#ea580c'/><text x='300' y='104' text-anchor='middle' font-size='12' fill='#b45309'>堆 heap　→ 向上增长（malloc/free 管理）</text><rect x='90' y='128' width='420' height='34' rx='6' fill='#eef3ff' stroke='#2b5cff'/><text x='300' y='150' text-anchor='middle' font-size='12' fill='#1c2333'>未初始化全局/静态区 bss</text><rect x='90' y='170' width='420' height='34' rx='6' fill='#eef3ff' stroke='#2b5cff'/><text x='300' y='192' text-anchor='middle' font-size='12' fill='#1c2333'>已初始化全局/静态区 data</text><rect x='90' y='212' width='420' height='30' rx='6' fill='#f6f7fa' stroke='#c8cfdb'/><text x='300' y='232' text-anchor='middle' font-size='11.5' fill='#5a6478'>常量区（字符串字面量）＋ 代码区</text><text x='40' y='242' font-size='11.5' fill='#5a6478'>低地址</text><text x='524' y='54' font-size='11' fill='#2b5cff'>局部变量、函数参数、调用帧</text><text x='524' y='104' font-size='11' fill='#ea580c'>malloc / calloc / realloc</text><text x='524' y='150' font-size='11' fill='#2b5cff'>int g;（自动清零）</text><text x='524' y='192' font-size='11' fill='#2b5cff'>int g = 1;（初值存在镜像里）</text><text x='524' y='232' font-size='11' fill='#5a6478'>只读，修改会段错误</text></svg>",
    kp: ["z10:2"],
    next: ["c10:1", "o3:1", "c10:4"],
    vs: [
          { t: "栈 vs 堆", d: "栈由编译器自动管理（进出函数自动伸缩）、空间小、分配极快；堆手动申请手动释放、空间大、容易泄漏和碎片。" },
          { t: "栈溢出 vs 堆溢出", d: "栈溢出通常是递归太深或局部数组太大；堆溢出是越界写坏相邻堆块。前者立刻崩，后者常常埋雷。" }
        ]
  },
      { t: "核心概念：malloc 与 free",
        h: "<p>栈上的数据编译期就确定大小；需要<b>运行时决定大小</b>、或需要<b>活得更久</b>的数据，就得用堆：<code>malloc(n)</code> 申请 n 字节（内容不清零），<code>calloc(cnt, size)</code> 申请并清零，<code>realloc</code> 调整大小，<code>free</code> 归还。</p><p><b>三条铁律</b>：① malloc 可能失败，必须判空；② 谁申请谁释放，且只能释放一次；③ free 之后立刻把指针置 NULL。</p>",
        code: "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void)\n{\n    int n = 5;\n\n    /* 申请 n 个 int 的空间：用 sizeof 计算更稳妥 */\n    int *arr = malloc((size_t)n * sizeof(int));\n    if (arr == NULL) {                 /* 必须判空 */\n        fprintf(stderr, \"内存申请失败\\n\");\n        return 1;\n    }\n\n    /* 初始化并遍历 */\n    for (int i = 0; i < n; i++)\n        arr[i] = (i + 1) * 10;\n\n    for (int i = 0; i < n; i++)\n        printf(\"%d \", arr[i]);\n    printf(\"\\n\");\n\n    free(arr);                         /* 配对释放 */\n    arr = NULL;                        /* 防止悬垂指针 */\n    return 0;\n}",
    kp: ["z10:4", "z9:2"],
    next: ["c10:2", "c10:3", "o3:3"],
    vs: [
          { t: "malloc vs calloc", d: "malloc 只给空间、内容是垃圾值；calloc 给空间并清零，代价是多一遍写。" },
          { t: "free(p) 之后 p 还能用吗", d: "不能。free 只是把这块内存还给分配器，p 里的地址仍在，再访问就是 use after free。规范做法是 free 后立刻 p = NULL。" }
        ]
  },
      { t: "常见错误与坑",
        h: "<ul><li><b>内存泄漏</b>：malloc 了没 free，长期运行的程序内存会持续增长（嵌入式设备最怕这个）</li><li><b>重复 free</b>：同一块内存释放两次，堆结构被破坏，通常是崩溃或莫名其妙的数据错乱</li><li><b>use-after-free</b>：free 之后继续使用（悬垂指针）。多线程下更隐蔽</li><li><b>越界写</b>：申请了 5 个 int 却写了 6 个，踩坏堆管理结构，症状延迟出现</li><li><b>栈上开大数组</b>：<code>int buf[1000000];</code> 在局部变量里会爆栈（Linux 默认栈 8MB，嵌入式只有几 KB）</li><li><b>结构体传值开销</b>：大结构体作为参数会整体拷贝，应该传指针（只读就加 const）</li><li><b>结构体对齐导致 sizeof 与原以为的不一致</b>：报文结构必须 pack，否则收发两端对不齐</li></ul>" },
      { t: "面试怎么答：结构与内存问题",
        h: "<p><b>问：malloc 和 calloc 的区别？</b>答：malloc 只分配不清零（内容是垃圾值）；calloc 按“个数 × 大小”分配并清零。需要初始为 0 时用 calloc，性能敏感时用 malloc 再按需初始化。</p><p><b>追问：程序的内存分区有哪些？</b>答：代码区、常量区（只读）、全局区（已初始化 data + 未初始化 bss）、堆（malloc/free 手动管理）、栈（局部变量与调用帧，自动管理）。局部变量在栈上，函数返回即失效。</p><p><b>追问：为什么结构体会有填充字节？</b>答：为了内存对齐——让成员的起始地址是其大小的整数倍，从而让 CPU 一次访问完成。代价是占更多空间；用 #pragma pack(1) 可以取消填充，但会造成未对齐访问（某些架构会异常或在性能上吃亏）。</p><p><b>追问：内存泄漏怎么排查？</b>答：valgrind 一查一个准（Linux）；也可以配合 ASan（-fsanitize=address）编译。工程手段：谁申请谁释放、配对检查、把申请释放封装在成对的 init/destroy 接口里。</p>" },
      { t: "课后练习与作业（含综合小项目）",
        h: "<p><b>作业</b>：</p><ol><li>定义 Student 结构体，输入 3 个学生信息并输出平均分（体会结构体数组）；</li><li>写函数按姓名查找学生并返回指针（找不到返回 NULL）；</li><li>用 malloc 动态申请一个长度由用户输入的 int 数组，排序后输出，最后 free；</li><li>打印 sizeof 验证结构体对齐（如 struct {char c; int i;} 是 8）；</li><li>用 valgrind 或 ASan 检查一个“故意泄漏”的小程序，看它怎么报错；</li><li><b>综合小项目</b>：把第 4~10 章内容串起来，写一个“通讯录”程序：结构体数组存联系人（姓名/电话）、菜单用 switch、循环用 while、字符串用 strcmp 查找、删除用前移覆盖。这个项目在训练营里有详细引导，可对照学习。</li></ol><p><b>完成后你应该能回答</b>：为什么 free(arr) 之后要写 arr = NULL？</p>" }
    ],
    quiz: [
      { type: "single", q: "为什么 struct { char c; int i; } 的 sizeof 通常是 8 而不是 5？",
        opts: ["编译器有 bug", "为了内存对齐：int 的起始地址必须是 4 的倍数，所以在 char 后插入 3 个填充字节，整体大小也要向上取整", "因为 char 实际占 4 字节", "因为指针占 8 字节"], ans: 1,
        exp: "对齐是为了让 CPU 一次访问就能读写成员。想取消填充用 #pragma pack(1)，但会带来未对齐访问的代价——通信协议结构体常用这个技巧。" },
      { type: "single", q: "关于 malloc 与 free，正确的说法是？",
        opts: ["malloc 分配的内存会自动清零", "malloc 可能失败返回 NULL，必须判空；free 之后应把指针置 NULL 防止悬垂指针", "free 之后指针自动变成 NULL", "同一块内存可以 free 两次以彻底释放"], ans: 1,
        exp: "三条铁律：判空、配对、置 NULL。free 不会修改你的指针变量，重复 free 会破坏堆结构。" },
      { type: "single", q: "程序运行时，函数内的局部变量（非 static）存放在哪个区？",
        opts: ["全局区", "堆", "栈", "常量区"], ans: 2,
        exp: "局部变量在栈上，随函数调用产生、随返回销毁。这也解释了为什么返回局部变量地址是危险的。" },
      { type: "blank", q: "补全代码：申请能存放 10 个 int 的堆内存，并检查是否成功。",
        code: "int *arr = {{0}};\nif (arr == NULL) return 1;",
        blanks: [{ acc: ["malloc(10*sizeof(int))", "malloc(sizeof(int)*10)", "malloc(10 * sizeof(int))"] }],
        exp: "推荐 malloc(10 * sizeof(int))：用 sizeof 计算而不是硬编码字节数，换平台或换类型时不用改代码。" },
      { type: "judge", q: "结构体变量可以用 = 直接整体赋值给同类型的另一个变量，而数组不能整体赋值。", ans: true,
        exp: "这是结构体的“特权”（逐个成员拷贝）。数组只能用 memcpy 或循环拷贝。注意浅拷贝问题：若结构体里有指针成员，整体赋值只拷贝指针值（两个结构体指向同一块内存）。" },
      { type: "blank", q: "读程序写输出（数字连续，无空格）：",
        code: "typedef struct { char name[8]; int age; } P;\nP p = { .name = \"Li\", .age = 20 };\nP *q = &p;\nq->age = 25;\nprintf(\"%d\", p.age);\nprintf(\"%s\", p.name);",
        blanks: [{ acc: ["25Li"] }],
        exp: "q->age = 25 等价于 (*q).age = 25，改的是同一个结构体，所以 p.age 变成 25；p.name 仍是 \"Li\"。顺便体会：字符串用 %s 打印、字符数组整体赋值要用 strcpy。" },
      { type: "single", q: "把大结构体作为函数参数时，推荐的写法是？",
        opts: ["直接传值，让编译器拷贝", "传结构体指针（只读场景加 const），避免整体拷贝的开销", "拆成多个基本类型参数", "改成全局变量"], ans: 1,
        exp: "传值会整体拷贝（可能几十上百字节，还占栈），传指针只传一个地址。只读场景加 const 既表达意图又防止误改——这是接口设计的基本素养。" },
      { type: "code", q: "编程任务：写一个“动态数组”小模块——用 malloc 按用户输入的长度申请 int 数组，读入数据、计算平均值、找出最大值、最后释放。要求全程检查 malloc 是否成功，并在释放后把指针置 NULL。",
        hint: "<p>长度用 scanf 读入后判断 &gt;0；malloc 参数用 (size_t)n * sizeof(int)；求平均时必须转 double（否则整数除法）；释放后置 NULL 并打印状态确认。</p>",
        sol: "#include <stdio.h>\n#include <stdlib.h>\n\nint main(void)\n{\n    int n = 0;\n    printf(\"请输入数据个数：\");\n    if (scanf(\"%d\", &n) != 1 || n <= 0) {\n        printf(\"个数非法\\n\");\n        return 1;\n    }\n\n    /* 1. 申请内存：用 sizeof 计算，避免硬编码字节数 */\n    int *arr = malloc((size_t)n * sizeof(int));\n    if (arr == NULL) {\n        printf(\"内存申请失败\\n\");\n        return 1;\n    }\n\n    /* 2. 读入数据 */\n    for (int i = 0; i < n; i++) {\n        printf(\"第 %d 个数据：\", i + 1);\n        if (scanf(\"%d\", &arr[i]) != 1) {\n            printf(\"输入错误\\n\");\n            free(arr);              /* 出错路径也要释放！ */\n            arr = NULL;\n            return 1;\n        }\n    }\n\n    /* 3. 统计：和、平均、最大值 */\n    long long sum = 0;              /* 用 long long 防止大数组求和溢出 */\n    int max = arr[0];\n    for (int i = 0; i < n; i++) {\n        sum += arr[i];\n        if (arr[i] > max) max = arr[i];\n    }\n\n    printf(\"总和 = %lld\\n\", sum);\n    printf(\"平均 = %.2f\\n\", (double)sum / n);   /* 关键：先转 double */\n    printf(\"最大 = %d\\n\", max);\n\n    /* 4. 释放：配对 + 置 NULL */\n    free(arr);\n    arr = NULL;\n    printf(\"内存已释放，指针已置空\\n\");\n    return 0;\n}",
        exp: "这个任务把所有内存管理要素都覆盖了：申请、判空、使用、错误路径释放、配对释放、置 NULL，还顺带练了“整数除法要转 double”“long long 防溢出”。能独立写出来，就说明你已经具备写真实 C 程序的基础。" }
    ]
  });
})();


/* ==== data-c.js ==== */

/* ============================================================
   课程一：C 语言系统学习（第 1-7 章）
   ============================================================ */
window.COURSES = window.COURSES || [];
window.COURSES.push({
  id: "c",
  badge: "C",
  badgeCls: "cb-c",
  title: "C 语言系统学习",
  desc: "变量、指针、内存、文件、位运算——嵌入式开发的地基，13 章打透。",
  goal: "打透 C 语言与内存模型：能看懂编译错误、写出健壮的函数与结构体，并把指针与内存管理讲成面试可用的深度。",
  roles: ["mcu", "rtos", "linux", "drv", "iot"],
  dep: ["zero"],
  chapters: [

  /* ---------------- 第 1 章 ---------------- */
  {
    id: "c1",
    title: "初识 C 与编译流程",
    brief: "一行代码是怎么变成可执行程序的",
    points: [
      { t: "从一个最小程序开始",
        h: "<p>每个 C 程序都从 <code>main</code> 函数开始执行。<code>#include &lt;stdio.h&gt;</code> 把标准输入输出的声明引入进来，这样编译器才认识 <code>printf</code>。<code>return 0</code> 表示程序正常结束，返回给操作系统。</p>",
        code: "#include <stdio.h>\n\nint main(void)\n{\n    printf(\"Hello, Embedded!\\n\");\n    return 0;\n}" },
      { t: "编译四步曲：预处理 → 编译 → 汇编 → 链接",
        h: "<p>平时一条 <code>gcc hello.c -o hello</code> 其实背后做了四件事：</p><ul><li><b>预处理</b>（.i）：处理所有 <code>#</code> 开头的东西——头文件展开、宏替换、条件编译</li><li><b>编译</b>（.s）：把 C 代码翻译成汇编代码，<b>语法错误在这一步报</b></li><li><b>汇编</b>（.o）：把汇编翻译成机器码目标文件</li><li><b>链接</b>（可执行文件）：把多个 .o 和库函数（如 printf 的实现）拼到一起，<b>“未定义引用”错误在这一步报</b></li></ul>",
        code: "gcc -E hello.c -o hello.i   # 只预处理\ngcc -S hello.i -o hello.s   # 编译成汇编\ngcc -c hello.s -o hello.o   # 汇编成目标文件\ngcc hello.o -o hello        # 链接生成可执行文件",
    kp: ["z1:2"],
    next: ["c12:1", "c11:1", "bd1:1"],
    vs: [
          { t: "-o 是做什么的", d: "-o 指定输出文件名，它不属于编译四步中的任何一步，只是告诉 gcc 结果写到哪里。" },
          { t: "目标文件 .o vs 可执行文件", d: ".o 里的地址还没最终定下来（重定位表）；链接器把所有 .o 拼起来、填好地址，才成为可执行文件。" }
        ]
  },
      { t: "错误也分阶段",
        h: "<p>排查问题时先分清错误类型，能少走弯路：</p><ul><li><b>编译错误</b>：语法问题，如少分号、括号不配对</li><li><b>编译警告</b>：能通过但隐患很大（如格式符不匹配），建议 <code>gcc -Wall</code> 全开并当作错误对待</li><li><b>链接错误</b>：undefined reference，函数只声明没定义、或忘记链接库</li><li><b>运行时错误</b>：段错误（野指针/越界）、死循环、内存泄漏——最难查，需要调试工具</li></ul>" }
    ],
    quiz: [
      { type: "single", q: "gcc 命令中，-c 选项的产物是什么？",
        opts: ["预处理后的 .i 文件", "汇编文件 .s", "目标文件 .o", "可执行文件"], ans: 2,
        exp: "-c 表示只编译汇编不链接，产物是目标文件 .o；链接需要再执行 gcc xx.o -o xx。" },
      { type: "single", q: "下列哪项工作发生在“预处理”阶段？",
        opts: ["把 #include 的头文件内容展开进来", "检查变量是否未初始化", "把汇编翻译成机器码", "把 printf 的实现代码拼接进来"], ans: 0,
        exp: "预处理只处理 # 开头的指令：头文件展开、宏替换、条件编译。printf 的拼接是链接阶段的事。" },
      { type: "judge", q: "main 函数返回 int，return 0 表示程序正常结束。", ans: true,
        exp: "返回 0 表示成功，非 0 表示异常，shell 里可以用 echo $? 查看这个返回值。" },
      { type: "blank", q: "补全代码：引入标准输入输出头文件。",
        code: "{{0}} <stdio.h>\nint main(void)\n{\n    printf(\"hi\\n\");\n    return 0;\n}",
        blanks: [{ acc: ["#include"] }],
        exp: "#include 是预处理指令，负责在预处理阶段把头文件内容复制进来。注意它开头是 #，末尾不加分号。" },
      { type: "single", q: "程序报 “undefined reference to `foo`”，这个错误发生在哪个阶段？",
        opts: ["预处理阶段", "编译阶段", "汇编阶段", "链接阶段"], ans: 3,
        exp: "undefined reference 是链接错误：链接器找不到函数的实现（只写了声明没写定义，或者没链接对应的库）。" },
      { type: "judge", q: "编译警告可以忽略，反正程序能跑。", ans: false,
        exp: "警告往往是 bug 的前兆（类型不匹配、忘记 return 等）。建议始终加 -Wall 编译，把警告清零。" }
    ]
  },

  /* ---------------- 第 2 章 ---------------- */
  {
    id: "c2",
    title: "数据类型与变量",
    brief: "类型、大小、范围、进制与转换",
    points: [
      { t: "基本类型与 sizeof",
        h: "<p>常见类型在 32/64 位平台的大小：<code>char</code> 恒为 1 字节；<code>short</code> 2 字节；<code>int</code> 通常 4 字节；<code>long</code> 在 32 位 Linux 是 4 字节、64 位 Linux 是 8 字节；<code>float</code> 4 字节；<code>double</code> 8 字节。<code>sizeof</code> 是<b>运算符</b>不是函数，编译期就确定结果。</p>",
        code: "#include <stdio.h>\nint main(void)\n{\n    printf(\"int: %zu\\n\", sizeof(int));    /* 4 */\n    printf(\"double: %zu\\n\", sizeof(double)); /* 8 */\n    return 0;\n}",
    kp: ["z2:2"],
    next: ["e3:4", "c9:1"],
    vs: [
          { t: "int 一定是 4 字节吗", d: "不保证。C 标准只规定「short ≤ int ≤ long」，具体宽度由平台决定。跨平台代码要用 <stdint.h> 的 int32_t 这类明确宽度的类型。" }
        ]
  },
      { t: "有符号与无符号",
        h: "<p><code>char</code> 默认是否有符号因平台而异，嵌入式里涉及原始字节数据时习惯明确写 <code>unsigned char</code> 或 <code>int8_t/uint8_t</code>（需 <code>&lt;stdint.h&gt;</code>）。n 位无符号范围是 0 ~ 2^n-1；有符号范围是 -2^(n-1) ~ 2^(n-1)-1。无符号数减到负数会“回绕”成一个巨大的正数，这是嵌入式常见 bug。</p>",
        code: "uint8_t x = 0;\nx = x - 1;        /* x 变成 255，而不是 -1 */",
    next: ["e1:2", "e1:3"],
    vs: [
          { t: "unsigned 溢出 vs signed 溢出", d: "无符号溢出是标准明确规定的「回绕」（定义良好）；有符号溢出是未定义行为，编译器可以做任何事，优化时甚至会把判断直接删掉。" }
        ]
  },
      { t: "进制与字面量",
        h: "<p>C 语言里：<code>0x</code> 开头是十六进制，<code>0</code> 开头是八进制（容易踩坑！），C23 之前没有官方二进制字面量（GCC 支持 <code>0b1010</code> 扩展）。后缀 <code>U</code> 表示无符号、<code>L</code> 表示 long、<code>f</code> 表示 float。嵌入式读寄存器手册、看内存 dump 全是十六进制，必须熟练。</p>",
        code: "int a = 0x1F;   /* 十六进制 = 31 */\nint b = 031;    /* 八进制！= 25，不是 31 */\nfloat f = 1.5f;\nunsigned long ul = 100UL;" },
      { t: "隐式转换与强制转换",
        h: "<p>不同类型混运算时，编译器自动“小转大”：char/short 会提升为 int，int 与 double 运算会转为 double。<b>赋值时大转小会截断</b>：<code>int i = 3.9;</code> 得到 3（直接丢小数，不是四舍五入）。强制转换写法 <code>(目标类型)值</code>，指针转换在嵌入式中很常用（如把地址转成寄存器指针）。</p>",
        code: "int i = 3.9;        /* i = 3，截断 */\ndouble d = 5 / 2;  /* d = 2.0！整数除法先发生 */\ndouble e = 5 / 2.0;/* e = 2.5 */\nint x = (int)3.99; /* 显式转换，x = 3 */",
    kp: ["c2:2"],
    next: ["e1:2", "c8:4"],
    vs: [
          { t: "隐式转换 vs 强制转换", d: "隐式转换由编译器按「小转大」规则自动做，出问题时悄无声息；强制转换是你明确告诉编译器「我知道风险」，但风险仍在。" },
          { t: "指针强转为什么危险", d: "强转不改变内存里的字节，只改变解释方式。转错类型（如把 int* 当 char* 用）后读写的位置和长度都会错。" }
        ]
  }
    ],
    quiz: [
      { type: "single", q: "sizeof(char) 的值是多少？",
        opts: ["由编译器决定，可能是 2", "恒为 1 字节", "32 位平台是 1，64 位平台是 2", "恒为 8 位以上"], ans: 1,
        exp: "C 标准规定 sizeof(char) 恒为 1。它是其它类型大小的度量单位。" },
      { type: "single", q: "8 位无符号数（uint8_t）能表示的最大值是？",
        opts: ["127", "128", "255", "256"], ans: 2,
        exp: "无符号 8 位范围是 0 ~ 2^8-1 = 255。有符号 8 位才是 -128 ~ 127。" },
      { type: "single", q: "十六进制 0x1F 等于十进制多少？",
        opts: ["31", "15", "1F 不合法", "33"], ans: 0,
        exp: "0x1F = 1×16 + 15 = 31。记住 A=10, B=11, C=12, D=13, E=14, F=15。" },
      { type: "blank", q: "读程序写输出：",
        code: "int a = 5, b = 2;\nprintf(\"%d\\n\", a / b);\nprintf(\"%d\\n\", a % b);",
        blanks: [{ acc: ["2"], hint: "第一个输出" }, { acc: ["1"], hint: "第二个输出" }],
        exp: "两个 int 相除是整数除法，5/2=2（向零取整）；% 是取余，5%2=1。这是笔试高频题。" },
      { type: "judge", q: "sizeof 是一个函数，运行时计算大小。", ans: false,
        exp: "sizeof 是运算符，编译期就确定，对变量可以不加括号（sizeof x 也合法）。" },
      { type: "single", q: "int i = 3.7; 执行后 i 的值是？",
        opts: ["4（四舍五入）", "3（截断小数）", "3.7 存不进去，编译报错", "未定义行为"], ans: 1,
        exp: "浮点转整数是向零截断，直接丢掉小数部分。想要四舍五入可以 (int)(x + 0.5)。" },
      { type: "single", q: "以下哪个是八进制常量？",
        opts: ["0x10", "010", "10", "0b10"], ans: 1,
        exp: "以 0 开头就是八进制！010 = 8。想写十进制 10 别手滑加前导 0。" }
    ]
  },

  /* ---------------- 第 3 章 ---------------- */
  {
    id: "c3",
    title: "运算符与表达式",
    brief: "整除、取模、自增、短路求值与优先级",
    points: [
      { t: "算术运算的坑",
        h: "<p>整数相除结果还是整数；<code>%</code> 只能用于整数。自增自减分<b>前置</b>（先加后用）和<b>后置</b>（先用后加），在同一个表达式里多次使用同一变量属于未定义行为，面试会考概念，工程里别这么写。</p>",
        code: "int a = 5;\nint b = a++;  /* b=5, 然后 a=6 */\nint c = ++a;  /* a 先变 7, c=7 */\nint d = 7 % 3; /* d = 1 */" },
      { t: "关系、逻辑与短路求值",
        h: "<p><code>&amp;&amp;</code> 左边为假时右边<b>不再执行</b>；<code>||</code> 左边为真时右边不再执行。这叫短路求值，既是优化更是保护手段——指针判空后解引用的标准写法就靠它。</p>",
        code: "if (p != NULL && p->count > 0) { /* p 为空时不会去解引用 */ }\nif (i >= n || arr[i] == x) { /* i 越界时不会访问 arr[i] */ }" },
      { t: "位运算速览",
        h: "<p><code>&amp;</code> 按位与、<code>|</code> 按位或、<code>^</code> 按位异或、<code>~</code> 按位取反、<code>&lt;&lt;</code> 左移、<code>&gt;&gt;</code> 右移。逻辑运算符（&amp;&amp; 等）结果只有 0 和 1，位运算作用于每一位。嵌入式里位运算是家常便饭，后面专项还会专门练。</p>",
        code: "0x0F & 0x03;  /* = 0x03 */\n0x0F | 0xF0;  /* = 0xFF */\n0xFF ^ 0x0F;  /* = 0xF0 */\n1 << 4;       /* = 16, 即 0x10 */",
    next: ["c13:1", "e2:2"],
    vs: [
          { t: "逻辑运算 vs 位运算", d: "&& 只看真假，结果是 0 或 1；& 逐位运算，结果依赖每一位。把 && 写成 & 不会报错，但语义和性能都变了。" },
          { t: "左移 vs 乘 2", d: "对无符号数左移 n 位等价于乘 2^n，也是编译器最终生成的指令；但对有符号负数左移是未定义行为。" }
        ]
  },
      { t: "优先级：拿不准就加括号",
        h: "<p>只需记牢几条：<code>=</code> 是赋值、<code>==</code> 才是判断，写错是经典 bug；<code>&amp;</code>、<code>|</code> 的优先级<b>低于</b>比较运算（所以 <code>x &amp; 1 == 0</code> 实际是 <code>x &amp; (1==0)</code>，必须写 <code>(x &amp; 1) == 0</code>）；三目 <code>a ? b : c</code> 可当轻量 if 用。</p>",
        code: "int x = (5 == 5); /* x = 1, 关系运算结果是 0 或 1 */\nint y = 0;\nif (y = 3) { }     /* 恒为真！把 == 写成了 = */" }
    ],
    quiz: [
      { type: "single", q: "int a = 5; int b = a++; 执行后 a 和 b 分别是？",
        opts: ["a=6, b=5", "a=5, b=6", "a=6, b=6", "a=5, b=5"], ans: 0,
        exp: "后置自增：先用旧值赋给 b（b=5），然后 a 自己加 1（a=6）。" },
      { type: "blank", q: "读程序写输出：",
        code: "int a = 10;\nprintf(\"%d\\n\", a / 3 * a);",
        blanks: [{ acc: ["30"] }],
        exp: "从左到右：10/3 是整数除法得 3，再 3*10=30。注意不是先乘后除！" },
      { type: "judge", q: "表达式 if (p && p->next) 中，若 p 为 NULL，p->next 不会被执行。", ans: true,
        exp: "&& 短路求值：左边为假（NULL）时右边直接跳过，所以不会对空指针解引用。" },
      { type: "single", q: "表达式 !5 的值是？",
        opts: ["5", "0", "1", "-5"], ans: 1,
        exp: "5 非 0 为真，取反得 0。C 语言里任何非 0 值都是“真”。" },
      { type: "single", q: "x & 1 == 0 这个写法的真实含义是？",
        opts: ["判断 x 是偶数", "x & (1 == 0)，即 x & 0，恒为 0", "语法错误", "判断 x 的最低位是 1"], ans: 1,
        exp: "== 优先级高于 &，先算 1==0 得 0，再 x&0 恒为 0。判断偶数必须写 (x & 1) == 0。" },
      { type: "blank", q: "读程序写输出：",
        code: "int x = 2;\nprintf(\"%d\\n\", 1 << x);",
        blanks: [{ acc: ["4"] }],
        exp: "1 左移 2 位 = 4。左移 n 位相当于乘 2 的 n 次方。" },
      { type: "judge", q: "5 % 2.0 是合法的表达式。", ans: false,
        exp: "取余运算符 % 只能用于整数类型，操作数出现浮点数直接编译错误。" }
    ]
  },

  /* ---------------- 第 4 章 ---------------- */
  {
    id: "c4",
    title: "分支与循环",
    brief: "if / switch / while / for / break / continue",
    points: [
      { t: "if 与一个经典陷阱",
        h: "<p>if 的条件必须是“零或非零”。<code>if (a = 5)</code> 是赋值恒真，经典 bug。另外浮点数不要直接用 == 比较，要用误差范围。else 总是和最近的、还没配对的 if 结合——长分支记得用大括号明确归属。</p>",
        code: "if (fabs(f - 0.3) < 1e-6) { /* 浮点判等的标准姿势 */ }\nif (a == 5) { }  /* 注意是 == */" },
      { t: "switch 与 break",
        h: "<p>switch 匹配的是<b>整型常量表达式</b>（char、enum 也算），case 后必须是编译期能确定的值。忘写 break 会<b>贯穿</b>执行后面的 case——有时是故意的技巧，但 99% 是 bug。一定写 default 兜底。</p>",
        code: "switch (cmd) {\ncase 1:\n    start();\n    break;        /* 少了它会继续执行 case 2 */\ncase 2:\n    stop();\n    break;\ndefault:\n    break;\n}" },
      { t: "三种循环与选择",
        h: "<p><code>for</code> 适合已知次数；<code>while</code> 适合先判断再执行；<code>do-while</code> 至少执行一次（菜单、重试输入常用）。<code>break</code> 跳出<b>整层</b>循环，<code>continue</code> 只跳过<b>本轮</b>剩余部分。</p>",
        code: "for (int i = 0; i < 10; i++) {\n    if (i % 2) continue; /* 跳过奇数 */\n    if (i > 7) break;    /* 到 8 就整体退出 */\n    printf(\"%d \", i);\n}" },
      { t: "while(1)：嵌入式的心跳",
        h: "<p>嵌入式裸机程序是“不允许结束”的——main 里必然有一个死循环（前台/后台系统）。这不是坏味道，而是行业惯例。配合状态机和中断标志位，主循环就是系统的大脑。</p>",
        code: "int main(void)\n{\n    system_init();\n    while (1) {\n        handle_tasks();   /* 主循环轮询 */\n        feed_watchdog();  /* 喂看门狗 */\n    }\n    /* 不会执行到 return */\n}" }
    ],
    quiz: [
      { type: "single", q: "switch 语句中，某个 case 结尾忘记写 break，会发生什么？",
        opts: ["编译报错", "继续执行后续 case 的代码（贯穿）", "直接退出 switch", "跳到 default"], ans: 1,
        exp: "switch 匹配后顺序执行，遇到 break 或 switch 结尾才停。忘写 break 会“贯穿”到后面的 case。" },
      { type: "judge", q: "continue 会终止整个循环。", ans: false,
        exp: "continue 只结束本轮循环体，进入下一轮判断；break 才是终止整层循环。" },
      { type: "single", q: "do-while 循环的循环体至少执行几次？",
        opts: ["0 次", "1 次", "2 次", "由条件决定"], ans: 1,
        exp: "do-while 先执行后判断，所以至少 1 次。while 先判断，可能 0 次。" },
      { type: "blank", q: "补全代码：用 while 循环求 1+2+...+100。",
        code: "int i = 1, sum = 0;\nwhile (i <= 100) {\n    {{0}};\n    i++;\n}",
        blanks: [{ acc: ["sum+=i", "sum=sum+i", "sum= sum+i"] }],
        exp: "累加语句 sum += i。每轮把 i 加进 sum，再让 i 自增。" },
      { type: "blank", q: "读程序写输出（连续输出无分隔）：",
        code: "for (int i = 0; i < 5; i++) {\n    if (i == 3) break;\n    printf(\"%d\", i);\n}",
        blanks: [{ acc: ["012"] }],
        exp: "i 为 0、1、2 时各打印一次；i==3 时 break 整体退出，所以输出 012。" },
      { type: "single", q: "表达式 if (1 < a < 5) 的判断结果？",
        opts: ["判断 a 是否在开区间 (1,5)", "先算 1<a 得 0 或 1，再与 5 比较，恒为真", "编译错误", "等价于 a>1 && a<5"], ans: 1,
        exp: "从左到右：1<a 结果只能是 0 或 1，都小于 5，所以整个条件恒真。数学写法在 C 里不成立！" },
      { type: "single", q: "嵌入式裸机程序的 main 函数里通常有什么？",
        opts: ["return 语句在开头", "一个 while(1) 死循环", "exit(0) 调用", "递归调用"], ans: 1,
        exp: "裸机系统不允许程序结束，main 里是初始化 + while(1) 主循环（轮询任务/状态机）。" }
    ]
  },

  /* ---------------- 第 5 章 ---------------- */
  {
    id: "c5",
    title: "函数",
    brief: "值传递、作用域、递归",
    points: [
      { t: "定义、声明与调用",
        h: "<p>函数先声明（原型）后使用。把原型放进头文件，实现放在 .c 文件，是多文件编程的基础。如果函数定义在调用点之前，声明可以省略，但工程上习惯统一在头文件里声明。</p>",
        code: "int add(int a, int b);   /* 原型声明 */\n\nint add(int a, int b)    /* 定义 */\n{\n    return a + b;\n}" },
      { t: "值传递：C 语言的铁律",
        h: "<p>C 函数参数永远是<b>值的拷贝</b>（值传递）。形参是实参的副本，函数内改形参不影响外部变量。想让函数“改”外部数据，只能传<b>指针</b>，让函数顺着地址去找原变量。</p>",
        code: "void change(int x) { x = 100; }        /* 改不动外面的 a */\nvoid change2(int *x) { *x = 100; }     /* 可以，操作的是 a 本尊 */\n\nint a = 1;\nchange(a);   /* a 还是 1 */\nchange2(&a); /* a 变成 100 */",
    kp: ["z7:4"],
    next: ["c9:2", "c8:3"],
    vs: [
          { t: "返回值 vs 出参", d: "返回值适合「一个结果」；需要返回多个结果、或结果是大结构体时，用指针出参（调用方提供缓冲区）更常见。" }
        ]
  },
      { t: "作用域与生命周期",
        h: "<p>局部变量在栈上，函数返回即销毁；全局变量整个程序周期存在。函数内加 <code>static</code> 的局部变量：作用域还在函数内，但生命周期变成全程、只初始化一次——很适合做“调用计数器”。</p>",
        code: "int count_calls(void)\n{\n    static int cnt = 0;  /* 只在首次执行时初始化 */\n    return ++cnt;        /* 每次调用都记住上次的值 */\n}",
    next: ["c10:1", "c10:4"],
    vs: [
          { t: "作用域 vs 生命周期", d: "作用域是「名字在哪儿看得见」（编译期概念）；生命周期是「这块内存在运行时活多久」。两者经常不重合：static 局部变量作用域在函数内，生命周期却是整个程序。" }
        ]
  },
      { t: "递归：函数调用自己",
        h: "<p>递归必须有<b>终止条件</b>，且每层递归要向终止条件逼近，否则栈溢出。经典例子：阶乘、斐波那契。每次函数调用都会在栈上压入一帧（参数、局部变量、返回地址），递归太深就会把栈吃光——这是嵌入式设备上真实会发生的事故。</p>",
        code: "int fact(int n)\n{\n    if (n <= 1) return 1;        /* 终止条件 */\n    return n * fact(n - 1);      /* 逼近终止 */\n}",
    kp: ["z7:6"],
    next: ["c10:4", "ds6:3"],
    vs: [
          { t: "终止条件 vs 递推式", d: "终止条件是「什么时候停」，写错就栈溢出；递推式是「怎么变小」。两个都要对，缺一不可。" }
        ]
  }
    ],
    quiz: [
      { type: "single", q: "C 语言中，函数参数的传递方式是？",
        opts: ["引用传递", "值传递（拷贝一份）", "全局共享", "由参数类型决定"], ans: 1,
        exp: "C 只有值传递。传指针本质也是值传递——传递的“值”是地址。" },
      { type: "blank", q: "补全 swap 函数，使其能真正交换两个 int。",
        code: "void swap(int *x, int *y)\n{\n    int t = *x;\n    *x = *y;\n    {{0}};\n}",
        blanks: [{ acc: ["*y=t"] }],
        exp: "三步交换：t 存 *x，*x 拿走 *y，最后 *y = t 拿回暂存的旧值。" },
      { type: "single", q: "函数内定义 static int cnt = 0; 以下说法正确的是？",
        opts: ["每次调用都重新初始化为 0", "只在首次初始化，之后跨调用保留值", "cnt 变成了全局变量，任何文件都能访问", "编译错误，static 不能修饰局部变量"], ans: 1,
        exp: "static 局部变量：作用域仍在函数内，但生命周期是整个程序，且只初始化一次。" },
      { type: "blank", q: "补全递归阶乘函数：",
        code: "int fact(int n)\n{\n    if (n <= 1) return 1;\n    return {{0}};\n}",
        blanks: [{ acc: ["n*fact(n-1)", "n*fact(n - 1)"] }],
        exp: "n! = n × (n-1)!，即 n * fact(n-1)。终止条件 n<=1 返回 1。" },
      { type: "single", q: "递归层次过深，最直接的后果是？",
        opts: ["内存泄漏", "栈溢出（stack overflow）", "堆损坏", "编译警告"], ans: 1,
        exp: "每次调用压一帧栈，递归深度超过栈容量就崩溃。嵌入式栈通常只有几 KB，更要小心。" },
      { type: "judge", q: "函数可以没有 return 语句，只要返回类型是 void。", ans: true,
        exp: "void 函数可以不写 return（或写裸 return;）。但非 void 函数忘记 return，返回值是垃圾值。" },
      { type: "single", q: "以下哪个写法能让函数修改调用者的变量？",
        opts: ["void f(int x) 并调用 f(a)", "void f(int *x) 并调用 f(&a)", "void f(int x[]) 并调用 f(a)", "void f(const int *x) 并调用 f(&a)"], ans: 1,
        exp: "传地址 f(&a)，函数内通过 *x 修改原变量。选项 D 加了 const 反而禁止修改。注意数组传参本质也是传首地址。" }
    ]
  },

  /* ---------------- 第 6 章 ---------------- */
  {
    id: "c6",
    title: "数组与字符串",
    brief: "越界、\\0、strlen 与 sizeof",
    points: [
      { t: "一维数组",
        h: "<p>下标从 0 开始，到 n-1 结束。C <b>不检查越界</b>——越界读写不会报编译错误，但会悄悄破坏别的内存，是段错误和“灵异 bug”的头号来源。初始化列表不够的元素自动补 0。</p>",
        code: "int a[5] = {1, 2, 3};   /* a[3]、a[4] 自动为 0 */\nint b[] = {1, 2, 3};     /* 长度自动推断为 3 */\n/* a[5] = 1;  越界！合法下标只有 0~4 */" },
      { t: "二维数组",
        h: "<p>逻辑上是一张表，物理上<b>按行连续存放</b>。定义时行数可省、列数不可省。遍历按行的顺序访问对缓存更友好。</p>",
        code: "int m[3][4];            /* 3 行 4 列，共 12 个 int */\nint g[2][3] = {{1,2,3},{4,5,6}};\nfor (int i = 0; i < 3; i++)\n    for (int j = 0; j < 4; j++)\n        m[i][j] = i * 4 + j;" },
      { t: "字符串：带 \\0 的字符数组",
        h: "<p>C 没有 string 类型，字符串就是以 <code>\\0</code> 结尾的 char 数组。<b>sizeof 算的是整个数组占的字节数（含 \\0），strlen 算的是 \\0 之前的字符个数</b>——两者必考。</p>",
        code: "char s[] = \"abc\";\n/* s 实际是 {'a','b','c','\\0'}，4 个字节 */\nsizeof(s);   /* 4 */\nstrlen(s);   /* 3 */\nchar t[8] = \"abc\";  /* 后面 4 字节自动补 0 */",
    kp: ["z8:4"],
    next: ["c8:3", "lx4:4"],
    vs: [
          { t: "char 数组 vs 字符串", d: "字符串一定以 \\0 结尾；char 数组不一定有 \\0（如从串口读来的裸数据）。把裸数据当字符串处理就会越界读。" }
        ]
  },
      { t: "常用字符串函数",
        h: "<p><code>&lt;string.h&gt;</code> 四件套：<code>strcpy(dst,src)</code> 拷贝、<code>strcat(dst,src)</code> 拼接、<code>strcmp(a,b)</code> 比较（相等返回 0，不是返回 1！）、<code>strlen(s)</code> 求长度。它们都假定目标空间足够大——目标 buffer 太小就是缓冲区溢出，安全漏洞的常客。安全替代：<code>strncpy</code>、<code>snprintf</code>。</p>",
        code: "char buf[16];\nstrncpy(buf, \"hello\", sizeof(buf) - 1);\nbuf[sizeof(buf) - 1] = '\\0';   /* 手动保底 */\nif (strcmp(buf, \"hello\") == 0) { /* 比较：返回 0 才是相等 */ }",
    next: ["c8:3", "lx4:4", "qa1:1"],
    vs: [
          { t: "strcpy vs strncpy", d: "strcpy 不检查目标容量，必然有溢出风险；strncpy 限长但可能不补 \\0，用完要手动补，否则后面又变成越界读。" }
        ]
  }
    ],
    quiz: [
      { type: "single", q: "char s[] = \"abc\"; 则 sizeof(s) 是？",
        opts: ["3", "4", "8", "由编译器决定"], ans: 1,
        exp: "字符串字面量带隐藏的 \\0，数组大小是 4。strlen(s) 才是 3。" },
      { type: "single", q: "strlen(\"hello\") 的返回值是？",
        opts: ["5", "6", "4", "不确定"], ans: 0,
        exp: "strlen 数的是 \\0 之前的字符个数：h-e-l-l-o 共 5 个。" },
      { type: "judge", q: "数组下标越界时，编译器一定会报错。", ans: false,
        exp: "C 不做越界检查，越界代码能编译通过，运行时可能崩溃、可能默默改坏别的数据。必须自己守住边界。" },
      { type: "single", q: "strcmp(\"apple\", \"banana\") 的返回值？",
        opts: ["0", "正数", "负数", "未定义"], ans: 2,
        exp: "按字典序逐字符比较，'a' < 'b'，返回负数。相等返回 0。判断相等必须写 == 0。" },
      { type: "blank", q: "读程序写输出：",
        code: "int a[5] = {1, 2, 3};\nprintf(\"%d %d\\n\", a[2], a[4]);",
        blanks: [{ acc: ["30"] }],
        exp: "初始化列表只给了前 3 个，其余补 0：a[2]=3，a[4]=0。输出 \"3 0\"（去空格后 30）。" },
      { type: "blank", q: "补全代码：遍历字符串直到结尾。",
        code: "int i = 0;\nwhile (s[i] != {{0}}) {\n    putchar(s[i]);\n    i++;\n}",
        blanks: [{ acc: ["'\\0'", "0"] }],
        exp: "字符串以 \\0（即整数 0）结尾。写 s[i] != '\\0' 或 s[i] != 0 都对。" },
      { type: "single", q: "int a[3][4] 一共有多少个元素？",
        opts: ["7", "12", "3", "34"], ans: 1,
        exp: "3 行 × 4 列 = 12 个 int，sizeof(a) = 48（int 按 4 字节算）。" }
    ]
  },

  /* ---------------- 第 7 章 ---------------- */
  {
    id: "c7",
    title: "指针（一）：基础",
    brief: "&、*、NULL、野指针",
    points: [
      { t: "指针就是“存地址的变量”",
        h: "<p>内存每个字节都有编号（地址）。指针变量存的值就是某个地址。<code>&amp;x</code> 取 x 的地址；<code>*p</code> 解引用——顺着 p 里存的地址去访问那块内存。定义时 <code>int *p</code> 表示“p 是指向 int 的指针”。</p>",
        code: "int a = 5;\nint *p = &a;   /* p 存 a 的地址 */\n*p = 10;       /* 通过 p 改 a，a 变成 10 */\nprintf(\"%d\\n\", a);   /* 10 */\nprintf(\"%p\\n\", p);   /* 打印地址 */",
    kp: ["z9:2", "z2:2"],
    next: ["c8:1", "c8:2", "z9:5"],
    vs: [
          { t: "int *p 里的 * 属于谁", d: "int *p 应读作「p 是 int 的指针」；int *p, q 里 q 是 int 不是指针——想要两个指针就写 int *p, *q。" }
        ]
  },
      { t: "指针大小与类型",
        h: "<p>指针本身的大小只跟平台位数有关：32 位平台 4 字节、64 位平台 8 字节，<b>与指向什么类型无关</b>。类型的作用是告诉编译器：解引用时读几个字节、加 1 时走多远。<code>int *</code> 加 1 跳 4 字节，<code>char *</code> 加 1 跳 1 字节。</p>",
        code: "printf(\"%zu\\n\", sizeof(int *));    /* 8 (64位) */\nprintf(\"%zu\\n\", sizeof(char *));   /* 8, 一样大 */",
    next: ["c8:1", "c8:4"],
    vs: [
          { t: "指针大小 vs 指向类型大小", d: "所有指针在 64 位平台上都是 8 字节（类型不改变指针本身大小）；但类型决定「加 1 走多远」和「解引用读几字节」。", to: "c8:1" }
        ]
  },
      { t: "NULL 与初始化的好习惯",
        h: "<p>指针定义时若暂时没有目标，<b>必须</b>初始化为 <code>NULL</code>。未初始化的指针里是随机地址（野指针），解引用它等于朝随机方向开枪。用完释放后也立刻置 NULL，防止悬垂指针再次被误用。</p>",
        code: "int *p = NULL;    /* 好习惯 */\nif (p != NULL) { *p = 1; }   /* 先判空再用 */",
    kp: ["c7:1"],
    next: ["c7:4", "c10:3"],
    vs: [
          { t: "NULL vs 0 vs 反斜杠零", d: "在指针上下文它们都是空指针常量；反斜杠零是给字符用的写法。风格上指针用 NULL（或 C++ 的 nullptr）。" }
        ]
  },
      { t: "三大指针事故现场",
        h: "<ul><li><b>解引用 NULL</b>：立刻段错误，反而是“最好”的错——死得快、好定位</li><li><b>野指针</b>：地址随机，可能改坏无关数据，症状飘忽</li><li><b>悬垂指针</b>：指向已 free / 已销毁的内存，读写都是未定义行为</li></ul><p>排查工具：printf 打印指针、gdb、valgrind（内存问题全家桶）。</p>",
    kp: ["c7:3", "z9:6"],
    next: ["c10:3", "qa1:1", "d2:2"],
    vs: [
          { t: "野指针 vs 悬垂指针", d: "野指针从没初始化，地址是随机的；悬垂指针曾经合法、所指内存已被释放。前者防在定义时，后者防在释放后置空。" }
        ],
    why: "面试几乎每场必问，而且现场排 bug 时「症状飘忽」的案子十有八九是这三类之一。"
  }
    ],
    quiz: [
      { type: "single", q: "int a = 5; int *p = &a; 则 *p 的值是？",
        opts: ["a 的地址", "5", "p 的地址", "不确定"], ans: 1,
        exp: "p 存 a 的地址；*p 解引用，顺着地址取到 a 的值 5。& 是取地址，* 是解引用，方向相反。" },
      { type: "single", q: "在 64 位平台上，sizeof(char *) 与 sizeof(int *) 分别是？",
        opts: ["1 和 4", "8 和 8", "4 和 8", "8 和 4"], ans: 1,
        exp: "指针大小只取决于平台位数（64 位 → 8 字节），与指向的类型无关。类型影响的是解引用宽度与步长。" },
      { type: "blank", q: "补全代码：通过指针把变量 a 改成 10。",
        code: "int a = 5;\nint *p = &a;\n{{0}};",
        blanks: [{ acc: ["*p=10"] }],
        exp: "*p = 10：解引用 p 找到 a，赋值为 10。写 p = 10 是把地址改成 10，完全错误。" },
      { type: "single", q: "“野指针”指的是？",
        opts: ["指向 NULL 的指针", "未初始化或已失效、指向随机内存的指针", "指向只读区的指针", "类型不匹配的指针"], ans: 1,
        exp: "野指针 = 内容不可控的指针：未初始化的随机值，或 free 后没置 NULL 的悬垂地址。解引用它是未定义行为。" },
      { type: "judge", q: "p = NULL; 之后执行 *p = 1; 是安全的，因为 p 已经有了确定的值。", ans: false,
        exp: "NULL 是“明确的无效地址”，解引用它一样是段错误。NULL 的意义是让你能用 if (p != NULL) 提前判断。" },
      { type: "single", q: "int *p; *p = 10; 这两行代码的问题是？",
        opts: ["没有问题", "p 未初始化，把 10 写进了随机地址", "编译不通过", "*p 只能读不能写"], ans: 1,
        exp: "p 是野指针，*p = 10 向随机内存写入——可能立刻崩溃，也可能悄悄改坏别的数据。定义指针必须初始化。" },
      { type: "single", q: "解引用空指针最典型的后果是？",
        opts: ["编译错误", "链接错误", "运行时段错误（Segmentation fault）", "内存泄漏"], ans: 2,
        exp: "空指针指向的地址不允许访问，一解引用 CPU 就触发异常，程序崩溃退出。编译期是查不出来的。" }
    ]
  }
  ]
});


/* ==== data-c2.js ==== */

/* ============================================================
   课程一：C 语言系统学习（第 8-13 章）
   ============================================================ */
(function () {
  var ch = window.COURSES[window.COURSES.length - 1].chapters;

  /* ---------------- 第 8 章 ---------------- */
  ch.push({
    id: "c8",
    title: "指针（二）：数组、传参与函数指针",
    brief: "指针运算、数组名退化、函数指针",
    points: [
      { t: "指针运算：走一步是多远",
        h: "<p>指针加 1，地址增加“一个所指向类型”的大小：<code>int *</code> 加 1 走 4 字节，<code>char *</code> 加 1 走 1 字节。所以 <code>*(p + i)</code> 与 <code>p[i]</code> 完全等价——下标就是指针运算的语法糖。</p>",
        code: "int a[] = {10, 20, 30};\nint *p = a;\n/* p+1 地址加 4 字节 */\nprintf(\"%d %d\\n\", *(p + 2), p[2]);  /* 都是 30 */",
    kp: ["c7:2"],
    next: ["c8:2", "c8:3", "e2:2"],
    vs: [
          { t: "p+1 vs (int)p+1", d: "p+1 走「一个元素」大小（int* 是 4 字节）；(int)p+1 是裸地址加 1 字节。混用后越界访问，症状极难查。" }
        ]
  },
      { t: "数组名的“退化”规则",
        h: "<p>数组名在大多数表达式里<b>自动退化成指向首元素的指针</b>，所以能 <code>p = a</code>、能 <code>a[i]</code>。两个例外：<code>sizeof(a)</code> 得整个数组大小；<code>&amp;a</code> 得“指向整个数组”的指针（类型是 int(*)[n]）。数组不是指针：数组名不能被赋值（<code>a = p</code> 非法）。</p>",
        code: "int a[5];\nsizeof(a);      /* 20：整个数组 */\nsizeof(a[0]);   /* 4：一个元素 */\nint n = sizeof(a) / sizeof(a[0]);  /* 求元素个数的惯用法 */",
    kp: ["c8:1", "c6:1"],
    next: ["c8:3", "c8:4"],
    vs: [
          { t: "数组名 vs 指向数组的指针", d: "a 退化后是 int*（指向首元素）；&a 是 int(*)[n]（指向整个数组）。两者地址数值相同，加 1 走的距离天差地别。" },
          { t: "sizeof(a) 在哪生效", d: "只有在定义 a 的同一作用域内 sizeof 才得整块大小；传进函数后退化成指针，所得的只是指针大小。" }
        ]
  },
      { t: "数组传参：长度必须另传",
        h: "<p>数组作为参数传给函数时，<b>退化成指针</b>——函数内 <code>sizeof</code> 拿到的是指针大小，不是数组大小。所以数组长度必须作为额外参数传入，这个约定贯穿整个 C 生态。传进去的是首地址，函数内改 <code>arr[i]</code> 会直接影响原数组。</p>",
        code: "void fill(int arr[], int n)   /* 等价于 int *arr */\n{\n    for (int i = 0; i < n; i++)\n        arr[i] = i;    /* 直接改到调用者的数组 */\n}",
    kp: ["c8:2", "c5:2", "c6:4"],
    next: ["c9:2", "lx4:4"],
    vs: [
          { t: "传数组 vs 传指针", d: "写 void f(int a[]) 和 void f(int *a) 对编译器完全一样，都是传一个指针值；方括号只是给你看的提示（也容易让人误以为函数里知道长度）。" }
        ]
  },
      { t: "指针数组 vs 数组指针 vs 函数指针",
        h: "<p>三个笔试常客，靠优先级区分：<code>[]</code> 和 <code>()</code> 优先级高于 <code>*</code>。</p><ul><li><code>int *a[10]</code>：先和 [] 结合 → <b>指针数组</b>，10 个 int*（如字符串表）</li><li><code>int (*a)[10]</code>：先和 * 结合 → <b>数组指针</b>，指向含 10 个 int 的数组（如二维数组行指针）</li><li><code>void (*fp)(int)</code>：<b>函数指针</b>，指向“参数 int、返回 void”的函数——回调、中断向量表、状态机都靠它</li></ul>",
        code: "void hello(void) { printf(\"hi\\n\"); }\n\nvoid (*fp)(void) = hello;  /* 函数名就是地址 */\nfp();                      /* 调用方式一 */\n(*fp)();                   /* 调用方式二，等价 */",
    kp: ["c8:2"],
    next: ["m4:1", "e4:3", "cpp5:2"],
    vs: [
          { t: "指针数组 vs 数组指针", d: "看名字从右往左读、看结合优先级：int *a[10] 是「10 个 int*」（数组）；int (*a)[10] 是「指向 10 个 int 的数组的指针」。" },
          { t: "函数指针 vs 回调", d: "函数指针是「怎么存」；回调是「怎么用」——把函数地址交给别人，让别人在合适时机调用你。状态机跳转表、Qt 信号槽底层都是这个思想。", to: "qt2:1" }
        ],
    why: "这三个是笔试常客，也是「驱动 / 回调 / 状态机」这些工程写法的语法基础。"
  }
    ],
    quiz: [
      { type: "single", q: "int a[5]; 则 a[i] 完全等价于？",
        opts: ["&a[i]", "*a + i", "*(a + i)", "a + i"], ans: 2,
        exp: "下标是语法糖：a[i] ≡ *(a+i)。a + i 是地址，* 才取值。" },
      { type: "single", q: "32 位平台下，int *p 指向数组首元素，p+1 的地址增加了多少字节？",
        opts: ["1", "2", "4", "8"], ans: 2,
        exp: "步长 = 所指类型大小。int 是 4 字节。char* 加 1 才是加 1 字节。" },
      { type: "judge", q: "数组作为函数参数传递时，函数内 sizeof(数组参数) 得到的是指针大小。", ans: true,
        exp: "传参时数组退化为指针，sizeof 拿到 4 或 8（平台决定）。所以数组长度必须作为独立参数传。" },
      { type: "single", q: "int (*p)[10] 定义的是什么？",
        opts: ["10 个指针组成的数组", "指向“含 10 个 int 的数组”的指针", "指向 int 的指针，共 10 个", "语法错误"], ans: 1,
        exp: "括号强制 p 先和 * 结合，p 是指针，指向整个数组 int[10]。对比 int *p[10] 是指针数组。" },
      { type: "single", q: "sizeof(a)/sizeof(a[0]) 这个惯用法的作用是？",
        opts: ["求数组占的总字节数", "求数组元素个数", "求指针大小", "求数组地址"], ans: 1,
        exp: "总字节数 ÷ 单元素字节数 = 元素个数。注意：只在数组定义所在的作用域里有效，传参后失效。" },
      { type: "blank", q: "读程序写输出：",
        code: "int a[] = {1, 2, 3};\nint *p = a;\np++;\nprintf(\"%d\\n\", *p);",
        blanks: [{ acc: ["2"] }],
        exp: "p 初始指向 a[0]；p++ 后指向 a[1]，解引用得 2。" },
      { type: "blank", q: "补全代码：通过函数指针调用 hello 函数。",
        code: "void hello(void) { printf(\"hi\\n\"); }\n\nint main(void)\n{\n    void (*fp)(void) = hello;\n    {{0}};\n    return 0;\n}",
        blanks: [{ acc: ["fp()", "(*fp)()", "(*fp) ();"] }],
        exp: "函数指针两种调用写法等价：fp() 和 (*fp)()。函数名 hello 本身就是函数地址。" }
    ]
  });

  /* ---------------- 第 9 章 ---------------- */
  ch.push({
    id: "c9",
    title: "结构体、联合与枚举",
    brief: ". 与 ->、typedef、union 判大小端",
    points: [
      { t: "struct：把数据打包",
        h: "<p>结构体把不同类型的成员打包成新类型。变量用 <code>.</code> 访问成员；指针用 <code>-&gt;</code>（<code>p-&gt;age</code> 是 <code>(*p).age</code> 的语法糖）。同类型结构体变量可以<b>整体赋值</b>（逐字节拷贝）。工程上几乎必配 <code>typedef</code> 起个短名。</p>",
        code: "typedef struct {\n    char name[16];\n    int  age;\n    float score;\n} Stu;\n\nStu s = {\"Tom\", 20, 88.5};\nStu *p = &s;\nprintf(\"%d\\n\", s.age);\nprintf(\"%d\\n\", p->age);   /* 等价于 (*p).age */",
    kp: ["c2:1"],
    next: ["c9:2", "e3:4", "e1:4"],
    vs: [
          { t: "点号 vs 箭头", d: "变量（或结构体本身）用点号；指向结构体的指针用箭头。p->age 只是 (*p).age 的语法糖，省了写括号。" }
        ]
  },
      { t: "结构体传参：大的传指针",
        h: "<p>结构体传值会整块拷贝，又慢又费栈；传指针只拷 8 字节地址。只在结构体很小时才考虑传值。只想读不想被改，就加 <code>const</code>。这同样是嵌入式通信协议解析（结构体 ↔ 字节流）的基石。</p>",
        code: "void print_stu(const Stu *p)   /* 推荐 */\n{\n    printf(\"%s %d\\n\", p->name, p->age);\n}",
    kp: ["c9:1", "c5:2"],
    next: ["c10:4", "pt2:2"],
    vs: [
          { t: "值传结构体 vs 传指针", d: "值传整块拷贝（大结构体又慢又费栈）；传指针只拷 8 字节地址。只想读就在参数上加 const。" }
        ],
    why: "通信协议解析、驱动层参数传递全靠这一条：结构体与字节流的来回转换。"
  },
      { t: "union：共享同一块内存",
        h: "<p>联合的所有成员<b>从同一地址开始</b>，任一时刻只有一个成员有效。大小 = 最大成员（还要考虑对齐）。经典应用：判断大小端——往 int 成员写 0x01，再读 char 成员，是 1 就是小端。</p>",
        code: "union U {\n    int  i;\n    char c;\n};\nunion U u;\nu.i = 0x01;\nif (u.c == 0x01) /* 小端：低字节存在低地址 */\n    puts(\"little endian\");",
    kp: ["c9:1", "e1:2"],
    next: ["e1:4", "pt1:1"],
    vs: [
          { t: "struct vs union", d: "struct 各成员地址依次排开、总大小是成员之和（含对齐填充）；union 所有成员共用同一地址、总大小等于最大成员。struct 是「都要」，union 是「轮流用」。" },
          { t: "union 大小不等于最大成员", d: "还要考虑对齐：union{char c; int i;} 大小是 4 而不是 1，因为整体要按最大成员对齐。" }
        ]
  },
      { t: "enum：给整数起名字",
        h: "<p>枚举是一组命名的整型常量，默认从 0 递增，也可手动指定。价值在于可读性：状态机、命令字、错误码都该用枚举而不是裸数字。switch 处理枚举时配合 -Wall 能提示漏掉的分支。</p>",
        code: "enum state { S_IDLE = 0, S_RUN, S_ERR = 100 };\nenum state st = S_RUN;   /* st 实际是 1 */",
    next: ["e4:3", "y1:4", "c12:1"],
    vs: [
          { t: "enum vs #define", d: "enum 是真正的类型（编译器看得见、有作用域、能进调试信息）；#define 只是预处理文本替换，不参与任何检查。" }
        ]
  }
    ],
    quiz: [
      { type: "single", q: "p 是指向结构体的指针，访问其 name 成员的正确写法是？",
        opts: ["p.name", "p->name", "p::name", "*p.name"], ans: 1,
        exp: "指针用 ->。p->name 等价于 (*p).name。变量才用点号。" },
      { type: "single", q: "union U { char c; int i; }; 在 int 为 4 字节的平台上，sizeof(union U) 是？",
        opts: ["1", "4", "5", "8"], ans: 1,
        exp: "联合大小 = 最大成员的大小（本例 int 的 4 字节）。所有成员共享这块内存。" },
      { type: "blank", q: "读程序写输出（小端机器，char 有符号）：",
        code: "union { int i; unsigned char c; } u;\nu.i = 0x12345678;\nprintf(\"%02X\\n\", u.c);",
        blanks: [{ acc: ["78", "0x78"] }],
        exp: "小端机低地址存低字节，u.c 读到的是最低字节 0x78。这也是判大小端的经典手法。" },
      { type: "judge", q: "两个同类型结构体变量可以用 = 直接整体赋值。", ans: true,
        exp: "C 支持结构体整体赋值（逐成员拷贝），数组和字符串数组都不行，这是结构体的“特权”。" },
      { type: "single", q: "enum Color { RED, GREEN, BLUE }; 则 GREEN 的值是？",
        opts: ["0", "1", "2", "\"GREEN\""], ans: 1,
        exp: "枚举默认从 0 开始递增：RED=0, GREEN=1, BLUE=2。枚举成员是整数，不是字符串。" },
      { type: "single", q: "向函数传递较大的结构体时，推荐做法是？",
        opts: ["传值，让编译器拷贝", "传结构体指针（可加 const）", "拆成多个基本类型参数", "放在全局变量里"], ans: 1,
        exp: "传指针只拷 8 字节地址，高效；只读场景加 const 防止误改。" },
      { type: "blank", q: "补全代码：通过指针修改学生年龄。",
        code: "Stu s = {\"Tom\", 20};\nStu *p = &s;\n{{0}} = 21;",
        blanks: [{ acc: ["p->age"] }],
        exp: "指针访问成员用 ->：p->age = 21。等价写法 (*p).age = 21。" }
    ]
  });

  /* ---------------- 第 10 章 ---------------- */
  ch.push({
    id: "c10",
    title: "内存管理",
    brief: "内存分区、malloc/free、常见事故",
    points: [
      { t: "程序内存布局五区",
        h: "<p>从低地址到高地址：<b>代码区</b>（指令）、<b>常量区</b>（字符串字面量等只读）、<b>全局区</b>（全局/static 变量，分已初始化 data 和未初始化 bss）、<b>堆</b>（malloc 系列，向高地址生长，手动管理）、<b>栈</b>（局部变量、函数调用，向低地址生长，自动管理）。面试常考“某个变量在哪个区”。</p>",
        code: "int g = 1;          /* 全局区 */\nint g2;             /* bss */\nconst char *s = \"hi\";  /* \"hi\"在常量区, s在全局区 */\nint main(void)\n{\n    int a = 1;          /* 栈 */\n    int *p = malloc(4); /* p在栈, *p指向的4字节在堆 */\n}",
    kp: ["z10:4", "c2:1"],
    next: ["c10:2", "o3:1", "a3:1", "dr1:1"],
    vs: [
          { t: "常量区 vs 代码区", d: "两者都只读，区别在内容：常量区放字符串字面量和 const 全局量，代码区放机器指令。把字符串字面量当可写的用就是往只读页写，必崩。" },
          { t: "已初始化 vs 未初始化全局变量", d: "已初始化的在 data 段（占可执行文件体积）；未初始化（或初值为 0）的放 bss 段，可执行文件里只留大小，不占实际字节。" }
        ],
    why: "面试问「这个变量在哪个区」几乎必考，也是理解「为什么函数内大数组会崩」的根。"
  },
      { t: "malloc 家族",
        h: "<p><code>malloc(n)</code> 申请 n 字节（内容为垃圾值，不清零）；<code>calloc</code> 申请并清零；<code>realloc</code> 调整大小。返回 <code>void *</code>，失败返回 NULL——<b>用前必须判空</b>。用完必须 <code>free</code>，谁申请谁释放。free 后把指针置 NULL 是防悬垂的好习惯。</p>",
        code: "int *p = malloc(10 * sizeof(int));\nif (p == NULL) { /* 一定要判 */ return -1; }\n/* ... 使用 ... */\nfree(p);\np = NULL;   /* 防止之后误用 */",
    kp: ["c10:1", "z10:5"],
    next: ["c10:3", "o3:3", "r5:2"],
    vs: [
          { t: "malloc vs 局部数组", d: "局部数组在栈上，自动回收但空间小、无法按需增长；malloc 在堆上，大小运行时决定、要手工释放。嵌入式里很多规范干脆禁用 malloc（碎片不可控）。" },
          { t: "realloc 之后旧指针", d: "realloc 可能整块搬到新位置，旧指针立刻失效。必须用返回值覆盖原指针，并判空防止泄漏。" }
        ]
  },
      { t: "四大内存事故",
        h: "<ul><li><b>内存泄漏</b>：malloc 了没 free，程序越跑越占内存</li><li><b>重复 free</b>：同一段内存释放两次，堆结构被破坏</li><li><b>越界写</b>：写超出申请范围，踩坏相邻堆块（可能当场崩，可能埋雷）</li><li><b>use after free</b>：free 后继续使用（悬垂指针）</li></ul><p>工具：valgrind 一查一个准；gcc -fsanitize=address 也能定位。</p>",
    kp: ["c10:2"],
    next: ["qa1:1", "d2:2", "y1:1", "cpp4:2"],
    vs: [
          { t: "内存泄漏 vs 内存碎片", d: "泄漏是「总量一直涨」（忘了 free）；碎片是「总量够但没有连续的大块」（频繁不同大小分配释放）。两者都表现为最终 malloc 失败，排查手段完全不同。" },
          { t: "越界写 vs 越界读", d: "越界写会改坏别人的数据（可能几天后才发作）；越界读通常不崩但会把垃圾当数据用，症状是「偶发的诡异值」。" }
        ],
    why: "这四个事故是 C 语言项目现场 debug 的主战场，也是面试「你怎么保证代码不崩」的落点。"
  },
      { t: "栈的纪律",
        h: "<p>栈空间有限（Linux 默认 8MB，嵌入式 RTOS 可能只有几 KB）。<b>不要在函数里定义巨大的局部数组</b>（如 int buf[1000000]），要么 static/全局，要么 malloc。递归深度也要心里有数。</p>",
        code: "void bad(void)\n{\n    int buf[1024 * 1024];  /* 4MB 局部数组，爆栈！ */\n}",
    kp: ["z7:6", "c9:2"],
    next: ["r5:1", "y1:1"],
    vs: [
          { t: "Linux 栈 vs RTOS 栈", d: "Linux 主线程默认 8MB，够用；RTOS 任务栈要自己指定，常只有几百字节到几 KB，一个大局部数组就爆。同样是「栈溢出」，两边的排查直觉完全不同。" }
        ]
  }
    ],
    quiz: [
      { type: "single", q: "malloc 函数的返回类型是？",
        opts: ["int *", "char *", "void *", "NULL"], ans: 2,
        exp: "malloc 返回 void*（通用指针），可隐式转换为任意目标类型；申请失败返回 NULL。" },
      { type: "single", q: "函数内的局部变量（非 static）存放在哪个区？",
        opts: ["全局区", "堆", "栈", "常量区"], ans: 2,
        exp: "局部变量在栈上，函数返回自动回收。堆需要手动 malloc/free。" },
      { type: "judge", q: "free(p) 之后，指针 p 会自动变成 NULL。", ans: false,
        exp: "free 只释放内存，p 里仍存着旧地址（悬垂指针）。必须手动 p = NULL。" },
      { type: "blank", q: "补全代码：申请能存 10 个 int 的堆内存。",
        code: "int *p = {{0}};\nif (p == NULL) return -1;",
        blanks: [{ acc: ["malloc(10*sizeof(int))", "malloc(sizeof(int)*10)", "malloc(40)", "malloc(10 * sizeof(int))", "malloc(10*sizeof(int))"] }],
        exp: "推荐 malloc(10 * sizeof(int))：类型变化时不用改代码。10 个 int 在 32 位平台恰好 40 字节。" },
      { type: "single", q: "“内存泄漏”指的是？",
        opts: ["访问了已释放的内存", "动态申请的内存用完没释放，且再也无法访问它", "数组越界写", "栈空间不够用"], ans: 1,
        exp: "泄漏 = 分配了不归还。长期运行的程序（尤其是嵌入式设备）会被慢慢拖垮。" },
      { type: "single", q: "一个需要 4MB 缓冲区的数据，正确的存放方案是？",
        opts: ["函数内 int buf[4*1024*1024/4];", "定义成全局/静态数组或用 malloc 申请", "放在寄存器里", "放在 const 常量区"], ans: 1,
        exp: "大块数据放栈上会爆栈。全局数组、static 数组或堆内存都可以。" },
      { type: "single", q: "malloc 与 calloc 的区别是？",
        opts: ["没有区别", "calloc 会把申请的内存清零，malloc 不清", "calloc 只能申请字符数组", "malloc 失败返回 0，calloc 失败返回 -1"], ans: 1,
        exp: "calloc(count, size) 参数是“个数 × 大小”且自动清零；malloc 的内存内容是随机的垃圾值。" }
    ]
  });

  /* ---------------- 第 11 章 ---------------- */
  ch.push({
    id: "c11",
    title: "文件操作",
    brief: "fopen/fread/fclose 与文件描述符概念",
    points: [
      { t: "FILE* 与打开模式",
        h: "<p>标准 C 用 <code>FILE *</code>（文件流）操作文件：<code>fopen(路径, 模式)</code> 打开，失败返回 NULL（必须判！）。模式：r 读（不存在则失败）、w 写（清空或创建）、a 追加、加 b 表示二进制、加 + 表示读写。用完必须 <code>fclose</code>——数据还在缓冲区时，不关闭可能丢失。</p>",
        code: "FILE *fp = fopen(\"data.txt\", \"r\");\nif (fp == NULL) {\n    perror(\"fopen\");   /* 打印失败原因 */\n    return -1;\n}\n/* ... */\nfclose(fp);" },
      { t: "读写函数一览",
        h: "<ul><li>文本：<code>fgets</code>/<code>fputs</code>（按行）、<code>fprintf</code>/<code>fscanf</code>（格式化）</li><li>二进制：<code>fread(buf, size, n, fp)</code>/<code>fwrite</code>（整块搬运，任何文件都能用）</li><li>单字符：<code>fgetc</code>/<code>fputc</code></li></ul><p>fgets 读到文件尾返回 NULL；它会把换行符一起读进来，解析时记得去掉。</p>",
        code: "char line[128];\nwhile (fgets(line, sizeof(line), fp) != NULL) {\n    /* line 末尾带 '\\n' */\n}\n/* 二进制读写结构体 */\nfwrite(&stu, sizeof(Stu), 1, fp);" },
      { t: "定位与文件大小",
        h: "<p><code>fseek(fp, 0, SEEK_END)</code> 跳到末尾，<code>ftell(fp)</code> 得当前位置——两者配合可求文件大小，然后 <code>rewind</code> 回开头。注意 <b>feof 的坑</b>：它是“上次读取失败后才为真”，不能用作循环条件，正确姿势是判断读函数返回值。</p>",
        code: "fseek(fp, 0, SEEK_END);\nlong size = ftell(fp);   /* 文件字节数 */\nrewind(fp);" },
      { t: "和 Linux 文件 IO 的关系",
        h: "<p>标准 C 的 FILE* 是对操作系统“文件描述符 fd”的封装（带用户态缓冲）。你的课程笔记里的 <code>open/read/write/close</code> 就是直接操作 fd 的 Linux 系统调用——两层 API 学完 C 后马上会用到。</p>",
    kp: ["c1:2"],
    next: ["lx2:1", "lx2:2", "o4:2"],
    vs: [
          { t: "FILE* vs 文件描述符 fd", d: "FILE* 是 C 库在 fd 之上加的「用户态缓冲 + 格式化」壳子；fd 是内核认的句柄。混用两套 API（如 write 和 fwrite 同一文件）会因缓冲不同步而乱序。" },
          { t: "fflush vs fsync", d: "fflush 只把 C 库缓冲推进内核；fsync 才真正落盘。掉电安全场景两者都不能少。" }
        ]
  }
    ],
    quiz: [
      { type: "single", q: "以 \"r\" 模式打开一个不存在的文件，fopen 返回？",
        opts: ["空文件继续执行", "NULL", "新创建该文件", "阻塞等待"], ans: 1,
        exp: "r 模式要求文件必须已存在，否则返回 NULL。w 模式才会创建/清空。所以 fopen 后必须判空。" },
      { type: "single", q: "想往文件末尾追加内容且不覆盖原内容，应该用哪种模式？",
        opts: ["\"w\"", "\"r+\"", "\"a\"", "\"wb\""], ans: 2,
        exp: "a = append 追加模式，写入永远接在文件末尾。w 会直接清空原文件！" },
      { type: "blank", q: "补全代码：打开文件并检查是否失败。",
        code: "FILE *fp = fopen(\"log.txt\", \"r\");\nif (fp == {{0}}) {\n    perror(\"fopen\");\n    return -1;\n}",
        blanks: [{ acc: ["NULL", "0"] }],
        exp: "fopen 失败返回 NULL。perror 会顺带打印系统错误原因（如 No such file or directory）。" },
      { type: "single", q: "读写任意类型文件（图片、结构体数据）最合适的函数是？",
        opts: ["fprintf / fscanf", "fread / fwrite", "puts / gets", "printf / scanf"], ans: 1,
        exp: "fread/fwrite 按字节原样搬运，不关心内容格式；fprintf/fscanf 是文本方式，遇到二进制数据会坏。" },
      { type: "single", q: "fseek(fp, 0, SEEK_END) 的作用是？",
        opts: ["回到文件开头", "跳到文件末尾", "删除文件内容", "读一个字符"], ans: 1,
        exp: "第三个参数是基准：SEEK_SET 开头、SEEK_CUR 当前、SEEK_END 末尾。配合 ftell 可求文件大小。" },
      { type: "judge", q: "程序结束前不调用 fclose 也没关系，反正操作系统会回收。", ans: false,
        exp: "文件可能还没刷盘（数据在缓冲区），并且长期运行的程序会耗尽文件描述符。用完必须 fclose。" },
      { type: "single", q: "用 feof(fp) 作为读循环条件的经典问题是？",
        opts: ["编译不通过", "feof 要在读操作失败后才变真，末尾会多处理一次", "feof 只对二进制文件有效", "没有问题"], ans: 1,
        exp: "feof 是“事后报告”。标准姿势：while (fgets(...) != NULL) ——用读函数的返回值当循环条件。" }
    ]
  });

  /* ---------------- 第 12 章 ---------------- */
  ch.push({
    id: "c12",
    title: "预处理与多文件编程",
    brief: "#define、头文件保护、extern/static",
    points: [
      { t: "#define：文本替换而已",
        h: "<p>宏是<b>预处理阶段的纯文本替换</b>，没有类型检查、没有计算优先级。定义“函数式宏”时每个参数和整体都要套括号，否则 <code>SQ(1+2)</code> 会展开成 <code>1+2*1+2 = 5</code>。宏末尾<b>不加分号</b>。想定义“常量”，现代 C 更推荐 const 或 enum。</p>",
        code: "#define SQ(x) ((x) * (x))   /* 括号齐全的写法 */\n#define PI 3.14159           /* 末尾无分号 */",
    next: ["c12:2", "c12:4", "bd1:1"],
    vs: [
          { t: "宏 vs 函数", d: "宏是预处理期文本替换，没有类型检查、不占调用开销，但副作用（参数多次求值）和优先级坑多；函数有类型检查，但是真实调用。" },
          { t: "宏 vs const / enum", d: "定义常量优先用 const 或 enum（有类型、能进调试信息、有作用域）；宏只适合「必须文本替换」的场合：条件编译、头文件保护、通用工具宏。" }
        ]
  },
      { t: "#include 与头文件",
        h: "<p><code>&lt;stdio.h&gt;</code> 在系统目录找，<code>\"my.h\"</code> 先在当前目录找。<b>头文件放声明，.c 放定义</b>：函数原型、extern 变量声明、类型定义、宏都进 .h；函数体和全局变量定义留 .c。多次 include 同一个头会重复定义——必须加保护。</p>",
        code: "/* mymath.h */\n#ifndef MYMATH_H        /* 头文件保护 */\n#define MYMATH_H\nint add(int a, int b);   /* 只声明 */\n#endif" },
      { t: "extern 与 static",
        h: "<p><code>extern int g;</code> 告诉编译器“g 在别的 .c 里定义”，实现跨文件共享。<code>static</code> 修饰全局变量/函数：只在本 .c 可见（内部链接）——多文件同名不冲突，也是“模块私有”的手段。static 修饰局部变量：只初始化一次、生命周期全程（上一章讲过）。</p>",
        code: "/* a.c */\nint g = 10;          /* 定义 */\n/* b.c */\nextern int g;        /* 声明：我要用 a.c 的 g */",
    next: ["bd1:1", "c10:1"],
    vs: [
          { t: "extern vs static（函数 / 全局变量）", d: "extern 说「这个符号在别处定义」，把名字暴露给链接器；static 说「只在本文件可见」，链接期改成本地符号。写驱动时用 static 收窄可见性是基本功。" },
          { t: "static 局部变量 vs 全局变量", d: "static 局部变量作用域仍在函数内（外面看不见），但生命周期是整个程序，且初始化只做一次。它在 .bss / .data 里，不在栈上。" }
        ]
  },
      { t: "条件编译",
        h: "<p><code>#if / #ifdef / #ifndef / #endif</code> 让代码按条件参与编译。用途：头文件保护、按平台裁剪代码（嵌入式必备）、调试开关（<code>#ifdef DEBUG</code> 打印日志）。注意条件编译是“裁剪”，与 if 运行时判断完全不同。</p>",
        code: "#ifdef DEBUG\n    printf(\"debug: x=%d\\n\", x);\n#endif\n\n#ifdef STM32F407\n    /* 仅在 F407 平台编译 */\n#endif",
    next: ["bd1:1", "y3:1", "qa3:1"],
    vs: [
          { t: "#if vs if", d: "#if 在预处理期决定「这段代码要不要参与编译」（不参与就不占空间、连语法都不用对）；if 是运行期分支，两边代码都必须合法。" }
        ]
  }
    ],
    quiz: [
      { type: "single", q: "#define SQ(x) x*x，则 SQ(1+2) 的值是？",
        opts: ["9", "5", "6", "编译错误"], ans: 1,
        exp: "文本替换：1+2*1+2 = 5。这就是函数式宏必须给参数和整体都加括号的原因。" },
      { type: "single", q: "#include \"mymath.h\" 与 #include <stdio.h> 的区别是？",
        opts: ["没有区别", "双引号先在源文件所在目录查找", "尖括号只能用于 C++", "双引号会执行两次包含"], ans: 1,
        exp: "双引号：先当前目录（或指定路径），再系统目录；尖括号：只搜系统目录。自定义头文件用双引号。" },
      { type: "blank", q: "补全头文件保护的第一行：",
        code: "{{0}} MYMATH_H\n#define MYMATH_H\nint add(int a, int b);\n#endif",
        blanks: [{ acc: ["#ifndef"] }],
        exp: "ifndef = if not defined：第一次包含时未定义，进入并定义 MYMATH_H；再次包含时已定义，整段跳过。" },
      { type: "single", q: "static 修饰一个全局变量的效果是？",
        opts: ["变量存放在栈上", "变量只能在本源文件内访问", "变量会变成常量", "其它文件可以用 extern 访问它"], ans: 1,
        exp: "static 全局变量是内部链接，仅本 .c 可见。跨文件共享要用非 static 定义 + extern 声明。" },
      { type: "judge", q: "头文件里应该放函数的实现代码（函数体）。", ans: false,
        exp: "头文件放声明（原型、extern、类型、宏），定义放 .c。实现放头文件被多处包含时会产生重复定义链接错误。" },
      { type: "single", q: "extern int g; 语句的作用是？",
        opts: ["定义一个全局变量 g 并初始化为 0", "声明 g 在别处定义，本文件可以直接使用", "把 g 限制在本文件内", "删除变量 g"], ans: 1,
        exp: "extern 是声明不是定义：不分配内存，只是告诉编译器“这个符号存在，链接时再找”。" },
      { type: "single", q: "以下哪种手段可以“按平台裁剪代码，不满足条件的部分完全不参与编译”？",
        opts: ["if...else 语句", "switch 语句", "条件编译 #ifdef ... #endif", "三目运算符"], ans: 2,
        exp: "条件编译发生在预处理阶段，被裁掉的代码根本不进入编译；if 是运行时判断，两个分支都会被编译。" }
    ]
  });

  /* ---------------- 第 13 章 ---------------- */
  ch.push({
    id: "c13",
    title: "位运算与嵌入式 C 风格",
    brief: "六大位运算、掩码技巧",
    points: [
      { t: "六个位运算符",
        h: "<p><code>&amp;</code>（有 0 则 0）、<code>|</code>（有 1 则 1）、<code>^</code>（相同 0 不同 1）、<code>~</code>（逐位取反）、<code>&lt;&lt;</code> 左移、<code>&gt;&gt;</code> 右移。核心用途：<b>用整数当开关集合</b>——每个二进制位是一个标志位，寄存器、权限、状态全这么玩。</p>",
        code: "0b1100 & 0b1010;  /* 1000 */\n0b1100 | 0b1010;  /* 1110 */\n0b1100 ^ 0b1010;  /* 0110 */\n~0x0F;            /* 0xF0（按8位看） */\n1 << 3;           /* 0b1000 = 8 */",
    kp: ["c3:3", "e1:1"],
    next: ["c13:2", "e2:2", "pt1:1"],
    vs: [
          { t: "左移 vs 有符号右移", d: "无符号右移是逻辑移位（高位补 0）；有符号负数右移是实现定义（可能算术移位补符号位）。要保证行为就先用无符号类型。" }
        ]
  },
      { t: "置位 / 清零 / 翻转 / 读取：背下来",
        h: "<p>这四句话是嵌入式操作寄存器的“字母表”（BIT(n) 即 1&lt;&lt;n）：</p><ul><li><b>置位</b>：REG |= BIT(n) —— 不动其它位</li><li><b>清零</b>：REG &amp;= ~BIT(n)</li><li><b>翻转</b>：REG ^= BIT(n)</li><li><b>读取</b>：bit = (REG &gt;&gt; n) &amp; 1</li></ul>",
        code: "#define BIT(n) (1u << (n))\nreg |= BIT(3);        /* 第3位置1 */\nreg &= ~BIT(3);       /* 第3位清0 */\nreg ^= BIT(3);        /* 第3位取反 */\nint b = (reg >> 3) & 1;  /* 读第3位 */",
    kp: ["c13:1"],
    next: ["e2:2", "m3:3", "dr2:1"],
    vs: [
          { t: "置位 / 清零 / 翻转 的写法", d: "置位用 |= BIT(n)（不动其它位）；清零必须用 &= ~BIT(n)（不能写 -= 或直接赋 0）；翻转用 ^= BIT(n)。写错清零是新手点灯失败的第一号原因。", to: "e2:2" },
          { t: "BIT(n) vs 1<<n", d: "完全等价。用宏是为了可读性和「一次定义，处处一致」，注意宏参数要加括号。" }
        ],
    why: "这是嵌入式操作寄存器的「字母表」，四句话必须背到不用想。"
  },
      { t: "异或的三个特性",
        h: "<p>a^a = 0；a^0 = a；交换律结合律成立。因此：<b>清零自己</b> x ^= x；不用临时变量<b>交换</b> a ^= b; b ^= a; a ^= b;（面试爱问，工程上可读性差慎用）；某些校验/加密也靠它。</p>",
        code: "a ^= b; b ^= a; a ^= b;  /* 交换 a,b（前提：两者地址不同） */",
    kp: ["c13:1"],
    next: ["ds3:3", "pt2:2"],
    vs: [
          { t: "异或校验 vs 求和校验", d: "异或是按位加减（不进位），实现最简单、能检出所有单比特错；求和 / CRC 检错能力更强但计算更重。选谁取决于链路可靠性和算力。" }
        ]
  },
      { t: "移位与乘除",
        h: "<p>左移 1 位 = ×2；<b>无符号数</b>右移 1 位 = ÷2（逻辑右移补 0）。有符号数右移是算术右移（补符号位）——依赖编译器实现，负数右移别用来做除法。优先用无符号类型做位运算。嵌入式笔试还爱考“统计二进制中 1 的个数”。</p>",
        code: "unsigned x = 13;      /* 1101 */\nx >> 1;               /* 6, 110 */\nint cnt = 0;\nwhile (x) { x &= x - 1; cnt++; }  /* 每次消掉最低位的1 */" }
    ],
    quiz: [
      { type: "single", q: "把变量 reg 的第 3 位（从 0 数）清零、其它位保持不变，正确的写法是？",
        opts: ["reg &= ~(1 << 3)", "reg |= ~(1 << 3)", "reg ^= (1 << 3)", "reg = 0"], ans: 0,
        exp: "清零 = 与上“该位为 0、其它位全 1”的掩码，即 ~BIT(3)。用 | 会把其它位全置 1，用 ^ 是翻转不是清零。" },
      { type: "single", q: "x = 0b1010，执行 x |= (1 << 0) 后 x 是？",
        opts: ["0b1010", "0b1011", "0b1000", "0b1111"], ans: 1,
        exp: "置位第 0 位：最低位变 1，得 0b1011。|= 只会把位改成 1，不会破坏其它位。" },
      { type: "blank", q: "读程序写输出（十六进制两位大写）：",
        code: "unsigned char x = 0x0F;\nx ^= 0xFF;\nprintf(\"%02X\\n\", x);",
        blanks: [{ acc: ["F0", "0xF0"] }],
        exp: "0x0F 异或 0xFF = 按位取反 = 0xF0。异或全 1 等价于取反。" },
      { type: "single", q: "a ^ a 的结果是？",
        opts: ["a", "0", "1", "全 1"], ans: 1,
        exp: "每一位自己异或自己都是 0。经典应用：x ^= x 快速清零。" },
      { type: "blank", q: "补全代码：读取变量 reg 的第 2 位。",
        code: "int bit = (reg >> 2) & {{0}};",
        blanks: [{ acc: ["1"] }],
        exp: "先右移把目标位挪到最低位，再 & 1 屏蔽其余位——读位的固定套路。" },
      { type: "single", q: "左移 2 位相当于什么算术运算？",
        opts: ["×2", "÷2", "×4", "÷4"], ans: 2,
        exp: "左移 n 位 = ×2^n。左移 2 位 = ×4。嵌入式里移位比乘法快，驱动代码里常见 x << 1 代替 x * 2。" },
      { type: "single", q: "统计二进制中 1 的个数，while (x) { x &= x - 1; cnt++; } 每次 x &= x-1 的效果是？",
        opts: ["把最高位清零", "把最低位的 1 清零", "把所有 1 清零", "把最低位翻转"], ans: 1,
        exp: "x-1 会借位：最低位的 1 变 0、其后所有 0 变 1，与原数相与正好消掉这个 1。循环次数就是 1 的个数。" }
    ]
  });
})();


/* ==== data-ds.js ==== */

/* ============================================================
   课程二：数据结构入门（9 章）
   ============================================================ */
window.COURSES = window.COURSES || [];
window.COURSES.push({
  id: "ds",
  badge: "DS",
  badgeCls: "cb-ds",
  title: "数据结构入门",
  desc: "复杂度、链表、栈队列、二叉树、查找排序——笔试面试的核心考点。",
  goal: "能手写顺序表、链表、栈、队列、二叉树与常用排序，并说清时间复杂度与适用场景。",
  roles: ["mcu", "rtos", "linux", "drv", "iot"],
  dep: ["c"],
  chapters: [

  /* ---------------- 第 1 章 ---------------- */
  {
    id: "ds1",
    title: "算法复杂度",
    brief: "大 O 表示法：衡量算法的“增长趋势”",
    points: [
      { t: "大 O：看趋势，不看常数",
        h: "<p>大 O 表示<b>数据量增大时耗时的增长趋势</b>，忽略常数和低阶项。O(2n) 写作 O(n)，O(n²+n) 写作 O(n²)。常见的从快到慢：</p><p><code>O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n²) &lt; O(2ⁿ)</code></p><p>n = 10000 时：O(n) 一万步，O(n²) 一亿步，O(2ⁿ) 直接放弃。</p>",
    kp: ["z6:6"],
    next: ["ds2:2", "ds7:1", "ds8:2"],
    vs: [
          { t: "O(1) vs 常数大", d: "O(1) 只说明「不随 n 增长」，不说明快。哈希表查询是 O(1)，但哈希函数可能比数组下标慢几十倍。" },
          { t: "平均 vs 最坏", d: "面试必须分清：哈希表平均 O(1) 最坏 O(n)；快排平均 O(n log n) 最坏 O(n²)。工程上要按最坏情况留余量。" }
        ]
  },
      { t: "怎么一眼估复杂度",
        h: "<ul><li>顺序执行、无循环：O(1)</li><li>单层循环跑 n 次：O(n)</li><li>两层嵌套循环各 n 次：O(n²)</li><li>每步把规模砍半（二分、快排递归树）：O(log n) / O(n log n)</li><li>每步分支翻倍（枚举子集）：O(2ⁿ)</li></ul>",
        code: "for (i = 0; i < n; i++)          /* O(n) */\n    sum += a[i];\n\nfor (i = 0; i < n; i++)          /* O(n^2) */\n    for (j = 0; j < n; j++)\n        s += a[i][j];\n\nwhile (i < n) i *= 2;            /* O(log n) */" },
      { t: "空间复杂度与权衡",
        h: "<p>空间复杂度看“额外开了多少内存”。归并排序快但要 O(n) 辅助数组；快排平均快且 O(log n) 栈空间；原地哈希表换查找速度。嵌入式内存小，<b>时空权衡</b>是日常决策。</p>" }
    ],
    quiz: [
      { type: "single", q: "二分查找的典型时间复杂度是？",
        opts: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], ans: 1,
        exp: "每次比较排除一半，n → n/2 → ... → 1，共约 log₂n 步。" },
      { type: "single", q: "两层嵌套 for 循环，各循环 n 次，总复杂度是？",
        opts: ["O(2n)", "O(n log n)", "O(n²)", "O(n)"], ans: 2,
        exp: "内层完整跑 n 遍，共 n×n = n² 次。注意顺序执行的两个 O(n) 循环才是 O(2n)=O(n)。" },
      { type: "judge", q: "O(1) 表示算法耗时与数据规模无关。", ans: true,
        exp: "O(1) = 常数时间：数组按下标访问、哈希表理想查找。不是说“只执行一条语句”，而是执行次数固定。" },
      { type: "blank", q: "分析循环的量级（填 O 记号，如 On / Ologn）：",
        code: "int i = 1;\nwhile (i < n)\n    i = i * 2;",
        blanks: [{ acc: ["Ologn", "O(logn)", "O(log n)", "logn", "O(log₂n)"] }],
        exp: "i 翻倍逼近 n：2^k ≥ n 时结束，循环次数 k = log₂n，所以是 O(log n)。" },
      { type: "single", q: "快速排序的平均时间复杂度是？",
        opts: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], ans: 1,
        exp: "快排平均 O(n log n)，最坏（已有序 + 首元素做基准）退化到 O(n²)。" },
      { type: "single", q: "以下哪种操作通常是 O(1)？",
        opts: ["在链表中查找某个值", "数组按下标访问 a[i]", "在链表头部之外的位置插入", "遍历整棵二叉树"], ans: 1,
        exp: "数组随机访问 = 首地址 + 偏移量计算，一步到位。链表查找要顺着指针走 O(n)。" }
    ]
  },

  /* ---------------- 第 2 章 ---------------- */
  {
    id: "ds2",
    title: "顺序表（数组）",
    brief: "随机访问 O(1)，插删要搬家",
    points: [
      { t: "顺序表：一整块连续内存",
        h: "<p>顺序表就是“用数组 + 长度变量”实现的线性表。优点：<b>按下标随机访问 O(1)</b>、内存紧凑、缓存友好。缺点：插入/删除要移动元素；容量固定（动态扩容需要整体搬家）。</p>",
        code: "#define N 100\ntypedef struct {\n    int data[N];\n    int len;      /* 当前元素个数 */\n} SqList;" },
      { t: "插入删除：为什么是 O(n)",
        h: "<p>在下标 i 处插入：把 i 到末尾的元素<b>整体后移</b>再放入新值；删除则整体前移填补。平均要移动约 n/2 个元素，所以都是 O(n)。头部插入最惨，移动全部 n 个。</p>",
        code: "/* 在下标 pos 插入 x */\nfor (int j = L->len; j > pos; j--)\n    L->data[j] = L->data[j - 1];   /* 依次后移 */\nL->data[pos] = x;\nL->len++;" }
    ],
    quiz: [
      { type: "single", q: "顺序表按下标访问第 i 个元素的复杂度是？",
        opts: ["O(1)", "O(i)", "O(n)", "O(log n)"], ans: 0,
        exp: "连续存储 + 下标直接算地址：data + i*sizeof(元素)，一步到位，与 n 无关。" },
      { type: "single", q: "含 n 个元素的顺序表，在头部插入一个新元素，需要移动多少个元素？",
        opts: ["0", "1", "n/2", "n"], ans: 3,
        exp: "头部插入要把原 n 个元素全部后移一位。移动 n 个，O(n)。" },
      { type: "judge", q: "在任意位置插入删除时，顺序表通常比链表慢。", ans: true,
        exp: "顺序表插删要整体搬家 O(n)；链表只要改几个指针 O(1)（前提是已定位到位置）。" },
      { type: "single", q: "顺序表相比链表的核心优点是？",
        opts: ["插入删除更快", "随机访问快且存储紧凑", "不需要预估容量", "天然支持排序"], ans: 1,
        exp: "连续内存带来 O(1) 随机访问和缓存友好；代价是插删慢、扩容要搬家。" },
      { type: "blank", q: "读程序：插入操作结束后 len 变成多少？",
        code: "/* len = 5，在下标 2 处插入元素 */\nfor (j = L->len; j > 2; j--)\n    L->data[j] = L->data[j-1];\nL->data[2] = 9;\nL->len++;",
        blanks: [{ acc: ["6"] }],
        exp: "插入一个元素后长度加一：5 + 1 = 6。" }
    ]
  },

  /* ---------------- 第 3 章 ---------------- */
  {
    id: "ds3",
    title: "链表",
    brief: "指针串起来的结点",
    points: [
      { t: "单链表的结构",
        h: "<p>每个结点 = 数据 + 指向下一结点的指针，内存<b>不连续</b>。头指针指向第一个结点，末结点 next 为 NULL。<b>带哨兵头结点</b>（不存数据）能统一“头部/中间”的插入删除逻辑，是工程上的常用技巧。</p>",
        code: "typedef struct node {\n    int data;\n    struct node *next;\n} Node;\n\nNode *head = NULL;   /* 空表 */",
    kp: ["z9:2", "c7:1"],
    next: ["ds3:2", "ds4:1", "ds5:1"],
    vs: [
          { t: "头结点 vs 首元结点", d: "带头结点时 head 本身不存数据，空表就是 head->next == NULL，插入删除不用特判表头；不带头结点则每次操作首元素都要改 head 指针。" }
        ]
  },
      { t: "插入与删除：改指针，不搬家",
        h: "<p>在 p 之后插入 s：<code>s-&gt;next = p-&gt;next; p-&gt;next = s;</code>（顺序不能反！）。删除 p 的后继：<code>p-&gt;next = p-&gt;next-&gt;next;</code> 别忘了 free 被删结点。头插法建表 O(1)；找尾结点要从头遍历（除非维护尾指针）。</p>",
        code: "/* 在 p 后插入 s */\ns->next = p->next;\np->next = s;\n\n/* 删除 p 的后继 */\nNode *t = p->next;\np->next = t->next;\nfree(t);",
    kp: ["ds3:1"],
    next: ["ds3:3", "ds4:2"],
    vs: [
          { t: "链表 vs 顺序表", d: "链表插入删除 O(1)（前提是已定位）、随机访问 O(n)、有额外指针开销；顺序表随机访问 O(1)、插入删除 O(n)、内存紧凑。选型就是选「你更多做什么」。" }
        ]
  },
      { t: "经典题：反转链表（三指针）",
        h: "<p>笔试超高频。思想：用 prev/cur/nextp 三个指针，逐个把 next 指向前一个。写不出代码也要能讲清过程。</p>",
        code: "Node *reverse(Node *head)\n{\n    Node *prev = NULL, *cur = head;\n    while (cur) {\n        Node *nextp = cur->next; /* 先存后继 */\n        cur->next = prev;        /* 掉头 */\n        prev = cur;              /* 双双前进 */\n        cur = nextp;\n    }\n    return prev;   /* 新表头 */\n}",
    kp: ["ds3:2", "c8:1"],
    next: ["iv2:1", "lad4:1"],
    vs: [
          { t: "迭代反转 vs 递归反转", d: "迭代用三个指针（prev/cur/next）原地改指向，O(1) 空间；递归代码短但吃 O(n) 栈空间，链表长时会爆栈。" }
        ],
    why: "手撕代码第一题，考的不是算法而是「能不能把指针操作说清楚」。"
  },
      { t: "与顺序表对比",
        h: "<table><tr><th></th><th>顺序表</th><th>链表</th></tr><tr><td>随机访问</td><td>O(1)</td><td>O(n)</td></tr><tr><td>插删(已定位)</td><td>O(n) 移动</td><td>O(1) 改指针</td></tr><tr><td>内存</td><td>连续、紧凑</td><td>分散、每结点多一个指针开销</td></tr></table><p>另有双向链表（可进可退）和循环链表（尾指向头），思想相同。</p>" }
    ],
    quiz: [
      { type: "single", q: "在单链表中已知结点 p，在 p 之后插入新结点的复杂度是？",
        opts: ["O(1)", "O(n)", "O(log n)", "取决于链表长度"], ans: 0,
        exp: "只改两个指针。但“找到 p”本身可能是 O(n)——链表的快，仅限于已经拿着位置的情况。" },
      { type: "single", q: "访问单链表的第 i 个结点，复杂度是？",
        opts: ["O(1)", "O(i)", "O(n)", "O(log n)"], ans: 1,
        exp: "必须从头顺着 next 走 i 步。链表没有随机访问能力。" },
      { type: "blank", q: "补全反转链表的核心语句：",
        code: "Node *prev = NULL, *cur = head;\nwhile (cur) {\n    Node *nextp = cur->next;\n    cur->next = {{0}};   /* 掉头 */\n    prev = cur;\n    cur = nextp;\n}",
        blanks: [{ acc: ["prev"] }],
        exp: "让当前结点指向前驱 prev，这正是“反转”动作本身。prev/cur 再整体前移。" },
      { type: "single", q: "在 p 之后插入 s，正确的语句顺序是？",
        opts: ["p->next = s; s->next = p->next;", "s->next = p->next; p->next = s;", "顺序无所谓", "s->next = p; p->next = s;"], ans: 1,
        exp: "先把 p 的后继存到 s->next，再让 p 指向 s。若先执行 p->next = s，原后继就丢了。" },
      { type: "single", q: "单链表找中间结点的高效技巧是？",
        opts: ["先遍历计数再走一半", "快慢指针：快指针走两步、慢指针走一步", "二分查找", "递归"], ans: 1,
        exp: "快指针到尾时，慢指针恰好在中间，一次遍历 O(n) 且只走一遍。经典快慢指针应用。" },
      { type: "judge", q: "链表的各结点在内存中可以不连续。", ans: true,
        exp: "链表靠指针串联，结点可以散落在堆的任何角落；不连续正是插删不用搬家的原因。" }
    ]
  },

  /* ---------------- 第 4 章 ---------------- */
  {
    id: "ds4",
    title: "栈",
    brief: "后进先出 LIFO",
    points: [
      { t: "栈：只开一个口的容器",
        h: "<p>栈只允许在<b>栈顶</b>入栈（push）和出栈（pop），<b>后进先出</b>。顺序栈 = 数组 + top 指针（top 指向栈顶元素下标，空栈常用 top = -1）。</p>",
        code: "typedef struct {\n    int data[100];\n    int top;          /* -1 表示空 */\n} Stack;\nvoid push(Stack *s, int x) { s->data[++s->top] = x; }\nint  pop (Stack *s)       { return s->data[s->top--]; }" },
      { t: "栈的真实应用",
        h: "<ul><li><b>函数调用</b>：调用帧（返回地址、局部变量）压栈，return 弹栈——递归太深栈溢出就是这个栈满了</li><li><b>括号匹配</b>：左括号进栈，右括号找栈顶配对</li><li><b>表达式求值</b>：中缀转后缀、计算后缀都靠栈</li><li><b>浏览器后退、编辑器撤销</b>：天然的“最近使用”模型</li></ul>",
    kp: ["ds4:1"],
    next: ["z7:6", "o2:1", "ds9:3"],
    vs: [
          { t: "数据结构栈 vs 函数调用栈", d: "逻辑一样（后进先出），但一个是你在代码里维护的容器，一个是 CPU / 编译器在内存里维护的调用现场。递归爆栈指的是后者。" }
        ]
  },
      { t: "出栈序列合法性",
        h: "<p>1,2,3 依次入栈（可随时出栈），可能得到 123 / 132 / 213 / 231 / 321，唯独 <b>312 不可能</b>：先出 3 说明 1、2 都在栈里且 2 在栈顶，下一个出的只能是 2，不可能先出 1。判定口诀：出栈序列中若 i 先于 j 且 j 先于更小的 k……直接动手模拟最稳。</p>" }
    ],
    quiz: [
      { type: "single", q: "栈的核心特征是？",
        opts: ["先进先出", "后进先出", "随机访问", "按关键字排序"], ans: 1,
        exp: "LIFO：最后入栈的最先出来。队列才是先进先出 FIFO。" },
      { type: "single", q: "1、2、3 依次入栈，中途允许随时出栈，以下哪个出栈序列不可能？",
        opts: ["1 2 3", "3 2 1", "3 1 2", "2 1 3"], ans: 2,
        exp: "3 先出栈时，1 和 2 都还压在栈里，2 在 1 上面，必须 2 先出——所以 312 不可能。" },
      { type: "single", q: "括号匹配算法最适合用什么数据结构？",
        opts: ["队列", "栈", "哈希表", "二叉树"], ans: 1,
        exp: "最近遇到的左括号要最先被配对——正是后进先出。" },
      { type: "judge", q: "函数调用（含递归）依赖栈保存返回地址和局部变量。", ans: true,
        exp: "每次调用压一帧，返回时弹一帧。递归过深 = 栈被压满 = stack overflow。" },
      { type: "blank", q: "读程序写输出（数字连续输出，无分隔符）：",
        code: "/* 栈初始为空 */\npush(1); push(2); push(3);\nprintf(\"%d\", pop());\nprintf(\"%d\", pop());\npush(4);\nprintf(\"%d\", pop());\nprintf(\"%d\", pop());",
        blanks: [{ acc: ["3241"] }],
        exp: "先弹 3、2；压入 4 后弹 4；最后只剩 1 弹出。输出 3241。" }
    ]
  },

  /* ---------------- 第 5 章 ---------------- */
  {
    id: "ds5",
    title: "队列",
    brief: "先进先出 FIFO 与循环队列",
    points: [
      { t: "队列：一头进一头出",
        h: "<p>队尾入队（rear），队头出队（front），<b>先进先出</b>。普通数组队列的问题：<b>假溢出</b>——出队后前部空间空着，rear 却已到数组尽头。解法：把数组首尾相接成<b>循环队列</b>。</p>" },
      { t: "循环队列：下标取模绕圈",
        h: "<p>进队出队下标都 <code>+1 后对容量 M 取模</code>。判空：front == rear。判满（牺牲一个格子的经典方案）：<code>(rear + 1) % M == front</code>——实际只能存 M-1 个元素。也可用计数器变量区分空和满。</p>",
        code: "#define M 8\nint data[M], front = 0, rear = 0;\n\n/* 入队 */\ndata[rear] = x;\nrear = (rear + 1) % M;\n/* 出队 */\nx = data[front];\nfront = (front + 1) % M;",
    kp: ["ds5:1"],
    next: ["pt2:2", "m6:3", "r3:1"],
    vs: [
          { t: "空 vs 满 的判定", d: "用「留一个空位」的方案时，(tail+1)%N == head 是满、tail == head 是空；也可以额外维护 count 变量，两种都行但必须自洽。" }
        ]
  },
      { t: "队列的用武之地",
        h: "<ul><li><b>缓冲区</b>：串口接收环形缓冲区（嵌入式天天用）</li><li><b>任务/消息队列</b>：RTOS、GUI 事件系统</li><li><b>BFS 广度优先搜索</b>：逐层扩展</li><li><b>打印机/请求排队</b>：先来先服务</li></ul>" }
    ],
    quiz: [
      { type: "single", q: "队列的核心特征是？",
        opts: ["后进先出", "先进先出", "两端都可进出且无限制", "按优先级出队"], ans: 1,
        exp: "FIFO：先来的先走。两端无限制进出的是双端队列 deque。" },
      { type: "single", q: "循环队列主要为了解决什么问题？",
        opts: ["存储空间太大", "顺序队列的假溢出", "插入太慢", "无法判空"], ans: 1,
        exp: "普通数组队列出队后前部空间浪费；取模绕圈后所有空间可重复利用。" },
      { type: "single", q: "容量为 M 的循环队列（牺牲一格法），判满条件是？",
        opts: ["front == rear", "(rear + 1) % M == front", "rear - front == M", "front == 0"], ans: 1,
        exp: "rear 再走一格就追上 front 时视为满。代价是最多存 M-1 个元素。" },
      { type: "blank", q: "补全循环队列入队的下标移动（容量 M）：",
        code: "data[rear] = x;\nrear = {{0}};",
        blanks: [{ acc: ["(rear+1)%M", "(rear + 1) % M"] }],
        exp: "(rear + 1) % M：越过数组末尾就绕回 0，这是“循环”的实现核心。" },
      { type: "single", q: "广度优先搜索（BFS）借助哪种数据结构实现？",
        opts: ["栈", "队列", "链表", "堆"], ans: 1,
        exp: "BFS 逐层扩展：先发现的先处理——队列。DFS 才用栈（或递归）。" },
      { type: "judge", q: "嵌入式串口收发常用的“环形缓冲区”本质就是一个循环队列。", ans: true,
        exp: "中断里入队（生产者），主循环里出队（消费者），环形缓冲区解耦两边速度差。" }
    ]
  },

  /* ---------------- 第 6 章 ---------------- */
  {
    id: "ds6",
    title: "树与二叉树",
    brief: "性质、四种遍历、由遍历重建",
    points: [
      { t: "基本术语",
        h: "<p><b>度</b>：一个结点的孩子数；<b>叶子</b>：度为 0 的结点；<b>深度/高度</b>：从根往下数的层数。<b>二叉树</b>：每个结点最多 2 个孩子（左孩子、右孩子，顺序有意义）。特殊二叉树：满二叉树（每层都满）、完全二叉树（只许最后一层从右往右缺）——堆就是完全二叉树。</p>" },
      { t: "必背的三条性质",
        h: "<ul><li>第 i 层最多 <b>2^(i-1)</b> 个结点（i 从 1 数）</li><li>高度为 h 的二叉树最多 <b>2^h - 1</b> 个结点</li><li>叶子数 n0 = 度为 2 的结点数 n2 + 1，即 <b>n0 = n2 + 1</b></li></ul>",
        code: "typedef struct TreeNode {\n    int val;\n    struct TreeNode *left, *right;\n} TreeNode;" },
      { t: "四种遍历",
        h: "<p>位置决定名字——根在哪，就叫什么序：</p><ul><li><b>前序</b>：根 → 左 → 右</li><li><b>中序</b>：左 → 根 → 右</li><li><b>后序</b>：左 → 右 → 根</li><li><b>层序</b>：一层一层来（用队列）</li></ul><p>前序 + 中序，或后序 + 中序，可以<b>唯一重建</b>一棵二叉树；前序 + 后序不能（分不清独子是左是右）。</p>",
        code: "void preorder(TreeNode *t)\n{\n    if (!t) return;\n    printf(\"%d \", t->val);   /* 根 */\n    preorder(t->left);        /* 左 */\n    preorder(t->right);       /* 右 */\n}",
    kp: ["z7:6", "ds4:2"],
    next: ["ds7:1", "ds9:3"],
    vs: [
          { t: "前序 / 中序 / 后序", d: "区别只在「根」什么时候访问。中序对 BST 出来就是有序序列，这是 BST 最常用的一条性质。" }
        ]
  },
      { t: "二叉搜索树（BST）",
        h: "<p>左子树所有结点 &lt; 根 &lt; 右子树所有结点。<b>中序遍历 BST 得到升序序列</b>——笔试常考。查找/插入平均 O(log n)，最坏（有序插入成链）退化 O(n)，平衡树（AVL/红黑树）解决此问题。</p>" }
    ],
    quiz: [
      { type: "single", q: "二叉树第 3 层最多有多少个结点？",
        opts: ["2", "3", "4", "8"], ans: 2,
        exp: "第 i 层最多 2^(i-1) 个：第 1 层 1 个，第 2 层 2 个，第 3 层 4 个。" },
      { type: "single", q: "一棵二叉树有 8 个叶子结点（n0），则度为 2 的结点（n2）有几个？",
        opts: ["7", "8", "9", "不确定"], ans: 0,
        exp: "恒等式 n0 = n2 + 1，所以 n2 = 7。这条性质笔试必背。" },
      { type: "single", q: "以下哪两种遍历组合能唯一确定一棵二叉树？",
        opts: ["前序 + 后序", "前序 + 中序", "层序 + 后序", "任意两种都可以"], ans: 1,
        exp: "前序/后序定根，中序分左右子树，可唯一重建。前序+后序无法区分独生子是左还是右。" },
      { type: "single", q: "对二叉搜索树（BST）做中序遍历，得到的是？",
        opts: ["降序序列", "升序序列", "原插入顺序", "随机序列"], ans: 1,
        exp: "BST 定义“左 < 根 < 右”与中序“左-根-右”天然吻合，输出必为升序。" },
      { type: "blank", q: "写出这棵树的中序遍历序列（数字连续，无空格）：",
        code: "/*        4\n        /   \\\n       2     6\n      / \\   /\n     1   3 5     */",
        blanks: [{ acc: ["123456"] }],
        exp: "中序 = 左-根-右：先 2 的左子树(1)，再 2，再 3，回到 4，然后 6 的左子树(5)，最后 6 → 123456。" },
      { type: "single", q: "层序遍历需要借助的数据结构是？",
        opts: ["栈", "队列", "哈希表", "优先队列"], ans: 1,
        exp: "一层一层访问 = 先遇到先处理 = 队列。把结点入队，出队时把孩子入队即可。" },
      { type: "judge", q: "完全二叉树适合用数组顺序存储。", ans: true,
        exp: "完全二叉树层序连续无空洞，数组下标能精确映射：孩子 = 2i+1、2i+2。堆排序就靠这个。" }
    ]
  },

  /* ---------------- 第 7 章 ---------------- */
  {
    id: "ds7",
    title: "查找与哈希表",
    brief: "二分查找、哈希冲突",
    points: [
      { t: "二分查找：前提是有序 + 随机访问",
        h: "<p>每次与中间元素比较，排除一半，O(log n)。两个前提：<b>序列有序</b>；<b>支持随机访问</b>（数组可以，链表不行——找中点就要 O(n)）。边界写法是重灾区，推荐“左闭右闭 [low, high]”模板并背熟。</p>",
        code: "int bsearch1(int *a, int n, int key)\n{\n    int low = 0, high = n - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;  /* 防溢出写法 */\n        if (a[mid] == key) return mid;\n        if (a[mid] < key) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}" },
      { t: "哈希表：用空间换查找速度",
        h: "<p>哈希函数把关键字映射成数组下标，理想情况查找 <b>O(1)</b>。不同关键字可能映射到同一下标——<b>哈希冲突</b>。两大解决流派：</p><ul><li><b>链地址法</b>：每个下标挂一条链表（Linux 内核、Redis 常用）</li><li><b>开放定址法</b>：冲突了就按规则找下一个空位（线性探测等）</li></ul>" },
      { t: "负载因子",
        h: "<p>负载因子 = 已存元素数 / 桶数组大小，衡量拥挤程度。超过阈值（如 0.75）就 <b>rehash 扩容</b>：开更大的桶数组，把所有元素重新映射搬过去，均摊 O(1)。</p>" }
    ],
    quiz: [
      { type: "single", q: "二分查找要求数据满足什么条件？",
        opts: ["元素互不相同", "有序且支持随机访问", "数量大于 100", "存放在链表中"], ans: 1,
        exp: "有序才能判断往哪半边找；随机访问才能 O(1) 跳到中点。链表二分是伪需求。" },
      { type: "blank", q: "补全二分查找防溢出的 mid 计算写法：",
        code: "int mid = low + ({{0}}) / 2;",
        blanks: [{ acc: ["high-low", "high - low"] }],
        exp: "low + (high-low)/2 与 (low+high)/2 数学等价，但后者在 low、high 都很大时会整数溢出。" },
      { type: "single", q: "哈希表发生冲突时，“每个桶挂一条链表”的解决方案叫？",
        opts: ["开放定址法", "链地址法（拉链法）", "再哈希法", "顺延法"], ans: 1,
        exp: "链地址法：冲突元素串在同一下标的链表上。开放定址法则是去别的空位找位置。" },
      { type: "single", q: "理想情况下哈希表的查找复杂度是？",
        opts: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], ans: 0,
        exp: "一次哈希计算直达桶，理想 O(1)。冲突严重时退化到 O(n)。" },
      { type: "single", q: "哈希表负载因子过高时的标准处理是？",
        opts: ["删除一半元素", "扩容桶数组并重新哈希", "改用链表存储", "改用二分查找"], ans: 1,
        exp: "rehash：开更大的桶数组、全部元素重新映射。均摊下来仍是 O(1)。" },
      { type: "judge", q: "在有序链表上做二分查找，效率和有序数组一样好。", ans: false,
        exp: "链表不支持随机访问，找中点本身就要 O(n)，二分失去意义。" }
    ]
  },

  /* ---------------- 第 8 章 ---------------- */
  {
    id: "ds8",
    title: "排序",
    brief: "O(n²) 三兄弟与 O(n log n) 三巨头",
    points: [
      { t: "O(n²) 三兄弟",
        h: "<table><tr><th>算法</th><th>思想</th><th>特点</th></tr><tr><td>冒泡</td><td>相邻逆序则交换，一轮冒出最值</td><td>稳定；基本不用，仅教学</td></tr><tr><td>选择</td><td>每轮选出最小值放到前面</td><td>不稳定；交换次数少</td></tr><tr><td>插入</td><td>像理扑克牌：新元素往前插</td><td>稳定；小数据/基本有序时极快（嵌入式常用）</td></tr></table>",
        code: "/* 插入排序 */\nfor (int i = 1; i < n; i++) {\n    int key = a[i], j = i - 1;\n    while (j >= 0 && a[j] > key) {\n        a[j + 1] = a[j];   /* 比key大的后移 */\n        j--;\n    }\n    a[j + 1] = key;         /* 插入空位 */\n}" },
      { t: "O(n log n) 三巨头",
        h: "<ul><li><b>快排</b>：选基准分区，小的去左大的去右，递归。平均 O(n log n)，<b>最坏 O(n²)</b>（已有序+首元素做基准）；原地排序但递归吃栈；不稳定</li><li><b>归并</b>：分两半各自排好再合并。稳定、性能稳定 O(n log n)，但<b>要 O(n) 辅助数组</b></li><li><b>堆排</b>：建大顶堆反复取堆顶。O(n log n) 且空间 O(1)，不稳定</li></ul>",
    kp: ["ds1:1"],
    next: ["iv2:1", "lad4:1"],
    vs: [
          { t: "快排 vs 归并", d: "快排原地、平均更快但最坏 O(n²) 且不稳定；归并稳定、最坏也 O(n log n)，但要额外 O(n) 空间。" },
          { t: "稳定 vs 不稳定", d: "稳定性指「相等元素保持原相对顺序」。对多关键字排序很关键，这时必须选稳定排序。" }
        ]
  },
      { t: "稳定性：什么意思",
        h: "<p>排序后<b>相等元素的相对顺序不变</b>叫稳定。单纯排数字看不出意义，但排序对象含多个字段时很重要（先按成绩排，再按班级稳定排序，成绩顺序得以保留）。记忆：冒泡、插入、归并<b>稳定</b>；选择、快排、堆排<b>不稳定</b>。</p>" },
      { t: "怎么选",
        h: "<p>小数据（几十个）或基本有序：<b>插入排序</b>（嵌入式裸机最爱）。要稳定：归并。要快且省内存：快排/堆排。快排的基准优化：三数取中、随机选取，避免最坏情况。</p>" }
    ],
    quiz: [
      { type: "single", q: "快速排序的最坏时间复杂度及触发条件是？",
        opts: ["O(n log n)，随机数据", "O(n²)，数据已有序且取首元素做基准", "O(n)，数据全相等", "O(2ⁿ)，递归太深"], ans: 1,
        exp: "已有序 + 首元素做基准 → 每次分区极度不平衡（1 vs n-1），退化 O(n²)。对策：随机选基准或三数取中。" },
      { type: "single", q: "以下哪种排序算法是稳定的？",
        opts: ["快速排序", "堆排序", "归并排序", "选择排序"], ans: 2,
        exp: "稳定三人组：冒泡、插入、归并。不稳三人组：选择、快排、堆排。" },
      { type: "single", q: "归并排序的空间复杂度是？",
        opts: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], ans: 2,
        exp: "合并两个有序段需要 O(n) 的辅助数组。这是它相比快排/堆排的主要代价。" },
      { type: "blank", q: "填空：冒泡排序一趟结束后，最（大/小）的元素一定到达正确位置（数组末尾，升序排序）。",
        code: "",
        blanks: [{ acc: ["大"] }],
        exp: "升序冒泡：相邻比较把大的往后顶，一趟后最大值“沉”到末尾。n 个元素做 n-1 趟即可完成。" },
      { type: "single", q: "数据基本有序时，实际表现最好的简单排序是？",
        opts: ["选择排序", "插入排序", "快速排序", "堆排序"], ans: 1,
        exp: "插入排序对基本有序数据接近 O(n)：每个新元素只挪一两步。小内存嵌入式场景的常见选择。" },
      { type: "blank", q: "补全插入排序的最后一步（把 key 放入空位）：",
        code: "int key = a[i], j = i - 1;\nwhile (j >= 0 && a[j] > key) {\n    a[j + 1] = a[j];\n    j--;\n}\n{{0}};",
        blanks: [{ acc: ["a[j+1]=key", "a[j + 1] = key"] }],
        exp: "比 key 大的都后移后，j+1 就是 key 的最终位置：a[j+1] = key。" },
      { type: "single", q: "堆排序的空间复杂度是？",
        opts: ["O(1)", "O(n)", "O(log n) 数组", "O(n log n)"], ans: 0,
        exp: "堆排在原数组上建堆、调整，只用到常数个临时变量——O(1) 额外空间。" }
    ]
  },

  /* ---------------- 第 9 章 ---------------- */
  {
    id: "ds9",
    title: "图",
    brief: "存储与遍历：DFS / BFS",
    points: [
      { t: "图的基本概念",
        h: "<p>图 = 顶点集 + 边集。边有方向是<b>有向图</b>，无方向是无向图；边带权是<b>网</b>。顶点的<b>度</b> = 关联的边数（有向图分出度/入度）。所有点连通的无向图叫连通图。树其实是“无环连通图”——图是更一般的结构。</p>" },
      { t: "两种存储",
        h: "<p><b>邻接矩阵</b>：n×n 二维数组，a[i][j]=1 表示有边。查边 O(1)，但空间 O(n²)，适合<b>稠密图</b>。<b>邻接表</b>：每个顶点挂一条邻接链表（或数组）。空间 O(n+e)，适合<b>稀疏图</b>。无向图的邻接矩阵是对称的。</p>",
        code: "/* 邻接表结点 */\ntypedef struct Edge {\n    int to;\n    struct Edge *next;\n} Edge;\nEdge *adj[N];   /* adj[u]: u 的所有邻居 */" },
      { t: "两种遍历",
        h: "<p><b>DFS 深度优先</b>：一条道走到黑再回头，用<b>递归（或栈）</b> + visited 标记。<b>BFS 广度优先</b>：一圈一圈扩散，用<b>队列</b> + visited。无权图 BFS 第一次到达即最短路。两者时间复杂度都是 O(n+e)。</p>",
        code: "void dfs(int u)\n{\n    visited[u] = 1;\n    for (Edge *e = adj[u]; e; e = e->next)\n        if (!visited[e->to])\n            dfs(e->to);\n}" },
      { t: "经典应用（概念了解）",
        h: "<ul><li>最短路：Dijkstra（无负权）、Floyd（多源）</li><li>最小生成树：Prim、Kruskal</li><li>拓扑排序：有向无环图（DAG）的任务依赖排序——编译系统、构建流程都在用</li></ul><p>面试对应届生一般考概念和 DFS/BFS 手写，先掌握遍历。</p>" }
    ],
    quiz: [
      { type: "single", q: "DFS（深度优先搜索）的实现依赖？",
        opts: ["队列", "栈（或递归）", "堆", "哈希表"], ans: 1,
        exp: "DFS 一条路走到黑、走不通回头——后退正是栈的行为，递归调用本身就压栈。" },
      { type: "single", q: "BFS（广度优先搜索）的实现依赖？",
        opts: ["栈", "队列", "链表", "并查集"], ans: 1,
        exp: "一圈一圈向外扩散：先发现的顶点先处理 = FIFO = 队列。" },
      { type: "single", q: "边数很少的稀疏图，更适合哪种存储？",
        opts: ["邻接矩阵", "邻接表", "三元组打表", "存成字符串"], ans: 1,
        exp: "邻接表空间 O(n+e)；邻接矩阵无论边多少都占 O(n²)，稀疏图下极度浪费。" },
      { type: "judge", q: "无向图的邻接矩阵一定是对称的。", ans: true,
        exp: "边无方向：a[i][j] 与 a[j][i] 同时为 1（或权值相同），故对称。有向图则不一定。" },
      { type: "single", q: "n 个顶点的图用邻接矩阵存储，空间复杂度是？",
        opts: ["O(n)", "O(e)", "O(n²)", "O(n+e)"], ans: 2,
        exp: "矩阵是 n×n，与边数无关。这也是它只适合稠密图的原因。" },
      { type: "single", q: "在无权图中求单源最短路，直接可用的方法是？",
        opts: ["DFS", "BFS", "Dijkstra", "拓扑排序"], ans: 1,
        exp: "无权图 BFS 按层扩散，第一次到达某点经过的边数就是最短距离。带权图才需要 Dijkstra。" }
    ]
  }
  ]
});


/* ==== data-emb.js ==== */

/* ============================================================
   课程四：嵌入式 C 专项（5 章）
   ============================================================ */
window.COURSES = window.COURSES || [];
window.COURSES.push({
  id: "emb",
  badge: "EM",
  badgeCls: "cb-emb",
  title: "嵌入式 C 专项",
  brief: "从 C 语言到硬件的最后一公里",
  desc: "进制补码、寄存器位操作、volatile、裸机结构、通信协议——从 C 到硬件的桥。",
  goal: "掌握补码与位运算、volatile/const/static、结构体对齐与寄存器操作等嵌入式 C 核心技能。",
  roles: ["mcu", "rtos", "linux", "drv", "iot"],
  dep: ["c"],
  chapters: [

  /* ---------------- 第 1 章 ---------------- */
  {
    id: "e1",
    title: "进制与补码",
    brief: "硬件世界的一门外语",
    points: [
      { t: "二进制 ↔ 十六进制：4 位一组",
        h: "<p>每 4 个二进制位恰好对应 1 个十六进制位，所以<b>十六进制是二进制的速记</b>。转换不用计算，查表即可：1010 = A，1111 = F。看到 0x3F 就应条件反射出 0b00111111。嵌入式的寄存器手册、内存 dump、逻辑分析仪界面全是十六进制。</p>",
        code: "0b1011 1100  ↔  0xBC\n0xFF        ↔  0b1111 1111  ↔  255" },
      { t: "补码：负数在芯片里的样子",
        h: "<p>计算机只有加法器，负数用<b>补码</b>表示：<b>按位取反，末位加一</b>。正数的补码就是原码。-1 的 8 位补码是 0xFF——所以无符号 255 和有符号 -1 是同一个比特串 11111111，<b>解释权在类型</b>。类型转换时比特不变、解释改变，是嵌入式最重要的世界观之一。</p>",
        code: "/* 求 -5 的 8 位补码 */\n 5      = 0000 0101\n取反    = 1111 1010\n加一    = 1111 1011   /* 0xFB = -5 */" },
      { t: "范围公式",
        h: "<p>n 位有符号范围：<b>-2^(n-1) ~ 2^(n-1)-1</b>。int8_t：-128 ~ 127；uint8_t：0 ~ 255。注意 128 的特殊性：-128 有，+128 没有——<code>int8_t x = -128</code> 合法而 <code>x = 128</code> 溢出。判断一个数在不在范围内时，先想清楚它是 signed 还是 unsigned。</p>" },
      { t: "大小端",
        h: "<p>多字节数据在内存里的排列顺序：<b>小端</b>（低字节放低地址，x86/多数 ARM 默认）、<b>大端</b>（相反，网络字节序）。通信协议解析、寄存器拼接 32 位值时必须考虑。用 union 或指针强转可以一行探测机器端序。</p>",
        code: "union { uint32_t i; uint8_t c; } t;\nt.i = 1;\nif (t.c == 1) /* 小端 */ ;" }
    ],
    quiz: [
      { type: "single", q: "二进制 1010 0111 转换成十六进制是？",
        opts: ["A7", "97", "107", "7A"], ans: 0,
        exp: "4 位一组：1010=A，0111=7，得 0xA7。练到看 0xC8 就知道是 200。" },
      { type: "single", q: "-1 的 8 位补码是？",
        opts: ["0x80", "0xFF", "0x01", "0x7F"], ans: 1,
        exp: "1 = 0000 0001，取反 1111 1110，加一 1111 1111 = 0xFF。同一串比特，按 int8_t 解释是 -1，按 uint8_t 是 255。" },
      { type: "single", q: "int8_t 能表示的最小值是？",
        opts: ["-127", "-128", "-255", "-256"], ans: 1,
        exp: "n 位有符号下限 = -2^(n-1) = -128；上限是 2^(n-1)-1 = 127。注意上下限不对称。" },
      { type: "blank", q: "填空：十六进制 0x2F 等于十进制多少？",
        code: "",
        blanks: [{ acc: ["47"] }],
        exp: "2×16 + 15 = 47。十六进制每位权重是 16 的幂。" },
      { type: "judge", q: "正数的补码与原码相同。", ans: true,
        exp: "补码规则只改变负数的表示；正数直接原样存储，最高位符号位为 0。" },
      { type: "single", q: "小端机器上，uint32_t 变量存 0x12345678 后，其第一个字节（最低地址处）是？",
        opts: ["0x12", "0x34", "0x56", "0x78"], ans: 3,
        exp: "小端 = 低字节在低地址：0x78 在前。大端则相反。网络传输按大端（所以才有 htonl/htons）。" }
    ]
  },

  /* ---------------- 第 2 章 ---------------- */
  {
    id: "e2",
    title: "寄存器位操作实战",
    brief: "置位/清零/翻转/读取，点灯的基本功",
    points: [
      { t: "寄存器：内存地图上的一个格子",
        h: "<p>单片机的外设（GPIO、定时器、串口）都被映射到固定地址，操作硬件 = <b>读写这些地址上的 32 位（或 16/8 位）整数</b>。每个二进制位（bit）控制一个开关：某位置 1 输出高电平，清 0 输出低电平。厂商 SDK 把地址封装成宏，本质都是 <code>*(volatile uint32_t *)地址</code>。</p>",
        code: "#define GPIO_BASE   0x40020000u\n#define GPIO_ODR     (*(volatile uint32_t *)(GPIO_BASE + 0x14))\n\nGPIO_ODR |= (1u << 5);   /* 第5脚输出高电平：点灯 */" },
      { t: "读-改-写：改位不变伤其它",
        h: "<p>寄存器有几十个位，各管各的。只想改第 3 位而<b>不动其它位</b>，必须用“读-改-写”复合赋值：<code>|=</code> 置位、<code>&amp;= ~</code> 清零、<code>^=</code> 翻转。直接赋值 REG = 0x08 会把其它位全部清掉——新手点灯失败的经典原因。</p>",
        code: "#define BIT(n) (1u << (n))\nREG |=  BIT(3);   /* 置位第3位 */\nREG &= ~BIT(3);   /* 清零第3位 */\nREG ^=  BIT(3);   /* 翻转第3位 */\nint b = (REG >> 3) & 1;  /* 读第3位 */" },
      { t: "掩码与多字段",
        h: "<p>寄存器常把一个字段连续占几位（如波特率占 [3:0] 四位）。修改字段的标准三步：<b>清字段 &amp;= ~MASK → 移到位置 → 或进去</b>。MASK = ((1&lt;&lt;位数)-1) &lt;&lt; 起始位。</p>",
        code: "/* 把字段 [3:2] 改为 0b10，其它位不动 */\n#define FIELD_MASK  (0x3u << 2)\nREG &= ~FIELD_MASK;\nREG |=  (0x2u << 2);" },
      { t: "组合写：一次配多个引脚",
        h: "<p>有些寄存器写 0 无副作用，可以直接一次赋值多个位（查手册确认）；有副作用的寄存器（如“写1清中断标志”型）绝不能乱 |=——会把别的中断标志也顺手清掉。<b>改寄存器前先读手册确认每位的行为</b>，这是硬件工程师的生存本能。</p>" }
    ],
    quiz: [
      { type: "blank", q: "补全代码：把寄存器 REG 的第 5 位置 1，其它位保持不变。",
        code: "REG {{0}} (1u << 5);",
        blanks: [{ acc: ["|="] }],
        exp: "置位用 |=：其它位与 1 相或保持原值，目标位被强制置 1。" },
      { type: "blank", q: "补全代码：把寄存器 REG 的第 2 位清 0，其它位不变。",
        code: "REG &= {{0}};",
        blanks: [{ acc: ["~(1u<<2)", "~(1u << 2)", "~(1<<2)"] }],
        exp: "清零 = 与上“该位为0、其它位为1”的掩码，即 ~(1u<<2)。" },
      { type: "single", q: "读寄存器 REG 第 n 位的值，标准写法是？",
        opts: ["REG & (1 << n)", "(REG >> n) & 1", "REG >> n", "REG[n]"], ans: 1,
        exp: "先右移把目标位挪到第 0 位，再 & 1 取出。只写 REG & (1<<n) 得到的是“带位置的掩码值”，判断相等时容易出错。" },
      { type: "single", q: "uint8_t r = 0x0F; 执行 r |= 0x30; 后 r 是？",
        opts: ["0x3F", "0x0F", "0x30", "0x3E"], ans: 0,
        exp: "0000 1111 | 0011 0000 = 0011 1111 = 0x3F。或运算只添 1 不减 1。" },
      { type: "single", q: "把某“写1清零型”中断标志寄存器随意执行 REG |= flag，可能的后果是？",
        opts: ["没有任何影响", "把其它中断的标志位也误清掉，丢中断", "寄存器复位", "程序死机"], ans: 1,
        exp: "这类寄存器“写 1 的位会被清零”。|= 是读-改-写：读出的其它标志位是 1，写回时就把它们也清了。必须直接赋值 REG = flag。" },
      { type: "single", q: "厂商头文件里 GPIO_ODR 这种宏，最可能的本质是？",
        opts: ["一个全局变量", "一个函数调用", "对固定地址的 volatile 指针解引用", "一个 const 常量"], ans: 2,
        exp: "*(volatile uint32_t *)地址——volatile 保证每次都真正读写内存（即硬件），编译器不敢优化。" },
      { type: "single", q: "修改寄存器中 [3:2] 这个两位字段为 0b01（其余位不动）的正确顺序是？",
        opts: ["直接 REG = 0x04", "REG &= ~0xC; REG |= 0x04;", "REG |= 0xC", "REG ^= 0xFF"], ans: 1,
        exp: "先清字段（掩码 0xC 即 11<<2），再或入新值。直接赋值会毁掉其它位。" }
    ]
  },

  /* ---------------- 第 3 章 ---------------- */
  {
    id: "e3",
    title: "关键字进阶：volatile / const / static / 对齐",
    brief: "嵌入式 C 区别于普通 C 的四个考点",
    points: [
      { t: "volatile：别自作聪明优化我",
        h: "<p>volatile 告诉编译器：<b>这个变量随时可能被你看不见的力量改变</b>（硬件、中断、其它线程），每次必须老老实实从内存读/写，不许缓存进寄存器、不许调整顺序删访问。三大场景：<b>内存映射寄存器</b>、<b>中断与主程序共享的变量</b>、<b>多线程共享变量</b>。</p>",
        code: "volatile uint32_t *reg = (volatile uint32_t *)0x40020000;\n\nvolatile int flag = 0;   /* 中断里置1，主循环轮询 */\nwhile (!flag) { }         /* 没有 volatile，可能被优化成死循环 */" },
      { t: "const 的四个位置",
        h: "<p><code>const int *p</code>：指向常量的指针——<b>数据</b>不可改，指针可改指向；<code>int * const p</code>：常量指针——<b>指针</b>不可改指向，数据可改；<code>const int * const p</code>：都锁死。口诀：<b>const 在 * 左边修饰数据，在 * 右边修饰指针本身</b>。函数参数只读时加 const 是专业素养。</p>",
        code: "const int *p1;        /* 数据只读 */\nint * const p2 = &a;  /* 指针只读 */\nconst int * const p3 = &a;  /* 双锁 */" },
      { t: "static 的三板斧",
        h: "<p>① 修饰<b>局部变量</b>：生命周期变全程、只初始化一次；② 修饰<b>全局变量/函数</b>：限制在本 .c 可见（模块私有）；③ 在头文件里修饰 inline 函数避免多重定义。驱动代码里大量用 static 把“内部工具函数”藏起来，只暴露接口。</p>" },
      { t: "内存对齐与 sizeof 陷阱",
        h: "<p>结构体成员按自身大小对齐（默认自然对齐）：char 后面跟 int，中间会<b>填充 3 个空洞</b>。struct {char c; int i;} 的 sizeof 是 8 不是 5！通信协议（如网络报文、存储结构体）要求数据紧密排列时用 <code>#pragma pack(1)</code> 或 __attribute__((packed))——代价是未对齐访问在某些架构上变慢甚至出错。</p>",
        code: "struct A { char c; int i; };      /* sizeof = 8 (1+3填充+4) */\n#pragma pack(1)\nstruct B { char c; int i; };      /* sizeof = 5, 紧凑 */\n#pragma pack()" }
    ],
    quiz: [
      { type: "single", q: "以下哪种变量必须加 volatile？",
        opts: ["循环计数器 i", "中断服务程序中修改、主循环中轮询的共享标志位", "函数内的临时变量", "const 常量表"], ans: 1,
        exp: "ISR 改了 flag 而主流程“看不见”，编译器可能把 while(!flag) 优化成只读一次的死循环。volatile 强制每次都从内存读。" },
      { type: "single", q: "const int *p 与 int * const p 的区别是？",
        opts: ["没有区别", "前者数据只读，后者指针只读", "前者指针只读，后者数据只读", "前者是常量，后者是变量"], ans: 1,
        exp: "口诀：const 在 * 左边管数据（指向的东西只读），在 * 右边管指针（指向关系不可变）。" },
      { type: "single", q: "struct { char c; int i; }; 在默认对齐下（char 1 字节、int 4 字节）sizeof 是？",
        opts: ["5", "6", "8", "12"], ans: 2,
        exp: "c 占 1 字节后填充 3 字节空洞，让 i 4 字节对齐：1+3+4 = 8。packed 后才是 5。" },
      { type: "judge", q: "static 修饰的局部变量每次函数调用都会重新初始化。", ans: false,
        exp: "static 局部变量只在程序开始时初始化一次，之后跨调用保留值——它存在全局区而非栈上。" },
      { type: "single", q: "驱动开发中给“模块内部使用的工具函数”加 static 的主要目的是？",
        opts: ["运行更快", "限制作用域在本文件，不污染全局命名空间、实现封装", "省内存", "允许递归"], ans: 1,
        exp: "static = 内部链接：别的 .c 看不见它，链接不冲突，模块只暴露头文件里的公开接口。" },
      { type: "single", q: "#pragma pack(1) 的作用与代价是？",
        opts: ["加快访问速度且无代价", "取消结构体填充使其紧凑排列，代价是可能未对齐访问变慢/出错", "让结构体更大", "只能用于全局变量"], ans: 1,
        exp: "通信协议和文件格式需要按字节精确布局时用 pack(1)；但未对齐访问在某些 CPU（如部分 ARM）会触发异常或性能惩罚，要权衡。" },
      { type: "single", q: "volatile 能解决的问题是？",
        opts: ["线程同步与互斥", "防止编译器对变量访问的过度优化", "内存泄漏", "字节序转换"], ans: 1,
        exp: "volatile 只保证“每次真的读写内存”，不提供原子性、不做互斥——多线程同步仍需锁/原子操作。它管可见性，不管排他性。" }
    ]
  },

  /* ---------------- 第 4 章 ---------------- */
  {
    id: "e4",
    title: "裸机程序结构",
    brief: "前后台系统、中断、状态机",
    points: [
      { t: "前后台系统",
        h: "<p>最经典的裸机架构：<b>前台 = 中断（异步事件）</b>，<b>后台 = while(1) 主循环（顺序轮询）</b>。中断只做“接客登记”（置标志、存数据到缓冲区），耗时处理留给主循环——这就是前后台分工。上电流程：启动文件（设栈、搬向量表）→ 系统时钟初始化 → 外设初始化 → while(1)。</p>",
        code: "volatile uint8_t rx_flag = 0;\n\nvoid UART_IRQHandler(void)   /* 前台：中断里越快越好 */\n{\n    rx_flag = 1;             /* 只登记，不干活 */\n}\n\nint main(void)\n{\n    while (1) {              /* 后台：慢慢处理 */\n        if (rx_flag) { rx_flag = 0; process(); }\n    }\n}" },
      { t: "中断服务程序（ISR）三条军规",
        h: "<p>① <b>短</b>：尽快返回，别 printf、别 delay；② 与主程序共享的变量加 <b>volatile</b>（多字节数据再加临界区保护）；③ <b>不调用不可重入函数</b>（如 malloc、非递归设计的静态缓冲区版函数）。ISR 里时间就是别人的钱——你占着 CPU，低优先级中断全部堵车。</p>" },
      { t: "状态机：把“流程”写成“状态”",
        h: "<p>裸机不能阻塞等待（一等主循环就停摆），流程控制靠<b>状态机</b>：enum 定义状态，switch 分发，事件驱动迁移。按键消抖、通信协议解析、菜单导航全是状态机。这也是面试“不用 delay 怎么实现按键消抖”的标准答案。</p>",
        code: "enum st { S_IDLE, S_PRESSED, S_CONFIRM };\nenum st state = S_IDLE;\n\nswitch (state) {\ncase S_IDLE:\n    if (key_down()) { state = S_PRESSED; t0 = now(); }\n    break;\ncase S_PRESSED:\n    if (now() - t0 >= 20) state = S_CONFIRM;  /* 消抖窗口 */\n    break;\n/* ... */\n}" },
      { t: "看门狗：最后的保险",
        h: "<p>看门狗定时器到点没被“喂”（清零计数）就强制复位芯片。主循环里定期喂狗——程序跑飞进死循环忘了喂，系统自动重启“自救”。这是工业产品的标配：程序可以崩，设备不能僵。</p>" }
    ],
    quiz: [
      { type: "single", q: "前后台系统中，“前台”指的是？",
        opts: ["主循环", "中断服务程序", "操作系统的窗口程序", "调试终端"], ans: 1,
        exp: "前台 = 中断（异步、随时打断）；后台 = while(1) 主循环（顺序执行）。中断登记，主循环干活。" },
      { type: "single", q: "在中断服务程序里调用 printf 长时间打印，最大的问题是？",
        opts: ["编译不通过", "占用 CPU 时间过长，阻塞其它中断和主程序", "printf 不能在 C 里调用", "会自动复位"], ans: 1,
        exp: "ISR 要短平快：打印交给主循环/后台任务。另外 printf 通常不可重入，与主流程同时调用还可能出乱子。" },
      { type: "single", q: "主循环与中断都会访问的共享标志变量，正确的声明是？",
        opts: ["int flag;", "volatile int flag;", "static int flag;", "const int flag;"], ans: 1,
        exp: "volatile 防止编译器把主循环里的 while(!flag) 优化成只读一次的死循环。" },
      { type: "blank", q: "补全状态机的状态迁移代码：",
        code: "enum st { S_IDLE, S_RUN, S_ERR };\nenum st state = S_IDLE;\n\nswitch (state) {\ncase S_IDLE:\n    if (start_button())\n        state = {{0}};   /* 按下启动键，进入运行态 */\n    break;\n}",
        blanks: [{ acc: ["S_RUN"] }],
        exp: "事件发生时切换到目标状态，下轮循环由 S_RUN 分支接管——状态机的骨架就是“switch(状态) + 事件迁移”。" },
      { type: "single", q: "看门狗（watchdog）的作用是？",
        opts: ["给程序提供精确时钟", "程序跑飞时强制复位系统", "监控内存泄漏", "加速中断响应"], ans: 1,
        exp: "定时器倒数，程序必须定期喂狗；程序卡死忘了喂 → 自动重启。是系统自愈的最后防线。" },
      { type: "judge", q: "裸机程序中，用阻塞 delay 等待按键消抖是最好的方案。", ans: false,
        exp: "阻塞期间整个主循环停摆，其它任务全部卡住。正确做法：记录时间戳的状态机（非阻塞消抖）。" },
      { type: "single", q: "上电后到进入 while(1) 之前，一般不包括哪一步？",
        opts: ["初始化系统时钟", "初始化用到的外设", "启动文件设置堆栈", "处理业务逻辑"], ans: 3,
        exp: "业务逻辑在主循环里做。上电初期做的是：启动文件（栈、向量表）→ 时钟 → 外设初始化 → 进主循环。" }
    ]
  },

  /* ---------------- 第 5 章 ---------------- */
  {
    id: "e5",
    title: "通信协议入门：UART / I2C / SPI",
    brief: "三兄弟的脾气与用法",
    points: [
      { t: "UART：最朴素的异步串口",
        h: "<p>两根线（TX 发、RX 收，交叉对接），<b>异步</b>——没有时钟线，双方约定好波特率对表。一帧 = 起始位(1) + 数据位(常见8) + 校验位(可无) + 停止位(1)。115200 波特率 ≈ 每秒 11520 字节。用途：调试打印（printf 重定向）、模块通信（GPS、蓝牙）。调试三板斧起步工具。</p>",
        code: "/* 常见配置写法：115200 8N1 */\n/* 115200 波特率, 8 数据位, 无校验, 1 停止位 */" },
      { t: "I2C：两线挂一群",
        h: "<p>两根线：<b>SCL 时钟</b> + <b>SDA 数据</b>，同步通信，<b>多从机</b>靠 7 位地址区分（一帧先发地址+读写位）。有 ACK 应答机制。速度标准 100k/400k。适合挂多个<b>低速</b>芯片：传感器（温湿度、IMU）、EEPROM、触摸屏。起止条件（SDA 在 SCL 高电平期间跳变）是协议灵魂。</p>" },
      { t: "SPI：四线飞驰",
        h: "<p>四根线：<b>SCK 时钟</b>、<b>MOSI 主出从入</b>、<b>MISO 主入从出</b>、<b>CS 片选</b>（每个从机一根）。全双工、速率高（几十 MHz），适合大流量：<b>TFT 屏幕、SD 卡、Flash 芯片</b>。代价是线多、每加一个从机多一根 CS。收发同体：发一个字节的同时也在收一个字节。</p>" },
      { t: "一张表选型",
        h: "<table><tr><th></th><th>UART</th><th>I2C</th><th>SPI</th></tr><tr><td>线数</td><td>2（TX/RX）</td><td>2（SCL/SDA）</td><td>4（SCK/MOSI/MISO/CS）</td></tr><tr><td>时钟</td><td>无（异步）</td><td>共享时钟</td><td>共享时钟</td></tr><tr><td>寻址</td><td>点对点</td><td>7位地址</td><td>CS 片选线</td></tr><tr><td>速度</td><td>低~中</td><td>低</td><td>高</td></tr><tr><td>典型外设</td><td>调试串口/模块</td><td>传感器/EEPROM</td><td>屏幕/SD/Flash</td></tr></table>" }
    ],
    quiz: [
      { type: "single", q: "UART 通信需要哪两根信号线？",
        opts: ["SCL 和 SDA", "TX 和 RX", "MOSI 和 MISO", "CLK 和 DATA"], ans: 1,
        exp: "TX 发、RX 收，交叉对接。SCL/SDA 是 I2C 的，MOSI/MISO 是 SPI 的。" },
      { type: "single", q: "I2C 总线上挂多个从机时，靠什么区分设备？",
        opts: ["各接一根 CS 片选线", "每个设备唯一的 7 位从机地址", "不同的波特率", "靠信号强弱"], ans: 1,
        exp: "I2C 每帧先广播地址，只有匹配的从机应答。SPI 才是每个从机拉一根 CS 片选线。" },
      { type: "single", q: "115200 的波特率大致意味着什么？",
        opts: ["每秒传输 115200 个字节", "每秒传输 115200 个比特", "通信距离 115200 米", "时钟频率 115.2GHz"], ans: 1,
        exp: "波特率单位是 bit/s。扣掉起始/停止位开销，每秒实际约 115200/10 ≈ 11520 字节。" },
      { type: "single", q: "要驱动一块高速 TFT 彩屏，最合适的接口是？",
        opts: ["UART", "I2C", "SPI", "USB"], ans: 2,
        exp: "屏幕刷新数据量大，SPI 速率高（几十 MHz）且全双工，是屏幕/SD 卡/Flash 的标配。" },
      { type: "blank", q: "填空：I2C 的两根线分别叫 SCL 和（　）。",
        code: "",
        blanks: [{ acc: ["SDA"] }],
        exp: "SCL 是时钟线，SDA 是数据线。记住口诀：I2C 两线（SCL/SDA），SPI 四线（SCK/MOSI/MISO/CS）。" },
      { type: "judge", q: "UART 是同步通信，双方共用一根时钟线。", ans: false,
        exp: "UART 是异步通信，没有时钟线，靠事先约定的波特率“对表”。I2C 和 SPI 才自带时钟线（同步）。" },
      { type: "single", q: "I2C 的 ACK 应答机制的作用是？",
        opts: ["加密数据", "接收方确认已收到每个字节，保证可靠传输", "提高时钟频率", "选择从机"], ans: 1,
        exp: "每传完一个字节，接收方在第 9 个时钟回拉 SDA 表示 ACK；无应答说明地址错或设备忙——通信可靠性的基础。" }
    ]
  }
  ]
});


/* ==== data-mcu.js ==== */

/* ============================================================
   课程五：单片机方向（51 / STM32 入门）
   ============================================================ */
window.COURSES = window.COURSES || [];
window.COURSES.push({
  id: "mcu",
  badge: "MCU",
  badgeCls: "cb-mcu",
  title: "单片机方向入门",
  brief: "从点亮第一颗 LED 到玩转外设",
  desc: "单片机概念、GPIO 点灯、中断、定时器 PWM、ADC 通信实战——从 C 到点亮第一块板子。",
  goal: "能用 GPIO、中断、定时器、ADC、串口独立完成一个单片机小项目，并会看寄存器手册。",
  roles: ["mcu", "rtos", "iot"],
  dep: ["c", "hw"],
  chapters: [

  /* ---------------- 第 1 章 ---------------- */
  {
    id: "m1",
    title: "认识单片机",
    brief: "MCU 的结构、51 与 STM32、最小系统",
    points: [
      { t: "单片机 = 一台浓缩的计算机",
        h: "<p>单片机（MCU）把 CPU、Flash（存程序）、RAM（存变量）、外设（GPIO/定时器/串口……）集成在一颗芯片里。<b>程序固化在片内 Flash，上电即跑</b>。与 PC 的 CPU 相比：主频低（MHz 级）、内存小（KB 级）、功耗低、引脚直接控制硬件——这是它统治嵌入式小设备的原因。电饭煲、遥控器、鼠标里都是它。</p>" },
      { t: "51 还是 STM32？",
        h: "<p><b>51</b>：结构简单（8 位、经典 12T 机器周期）、资料多，适合理解底层原理；生产中已少用。<b>STM32</b>：32 位 ARM Cortex-M 内核，外设丰富、库生态成熟，是目前国内嵌入式教学与中小产品的绝对主力。建议：51 快速过一遍思想，主力学 STM32（F1/F4 系列），面试也以 STM32 为主。</p>" },
      { t: "最小系统：缺一不可的三件套",
        h: "<p>让单片机跑起来的最小电路：</p><ul><li><b>电源</b>：VCC/GND（3.3V 或 5V），数字电路的心跳</li><li><b>时钟</b>：晶振 + 电容，给 CPU 提供节拍（51 常见 12MHz，STM32 常用 8MHz 外部晶振内部倍频到 72MHz+）</li><li><b>复位电路</b>：上电复位 + 按键复位，让 CPU 从确定状态开始</li></ul><p>STM32 还有 <b>BOOT 启动选择引脚</b>：BOOT0=0 从 Flash 启动（正常运行）；BOOT0=1、BOOT1=0 从系统存储器启动（串口 ISP 下载程序用）。</p>" },
      { t: "存储映射：地址也是资源",
        h: "<p>STM32 采用统一编址：Flash、RAM、外设寄存器都在同一张 4GB 地址地图上，各有固定区间（如 0x08000000 是 Flash、0x40000000 起是外设）。操作外设 = 读写对应地址——第 e2 章的位运算就是在这里派上用场的。</p>",
        code: "/* 操作 GPIOA 的输出数据寄存器 */\n#define GPIOA_ODR  (*(volatile uint32_t *)0x4001080Cu)\nGPIOA_ODR |= (1u << 5);   /* PA5 输出高电平 */" }
    ],
    quiz: [
      { type: "single", q: "单片机（MCU）与 PC 处理器最核心的区别是？",
        opts: ["MCU 不能运行程序", "MCU 集成了 CPU/存储/外设，可直接控制硬件，主频低功耗小", "MCU 主频一定更高", "两者没有区别"], ans: 1,
        exp: "MCU 是单芯片计算机：程序在片内 Flash、引脚直连外设电路，用 MHz 级主频和 KB 级内存换低成本低功耗。" },
      { type: "single", q: "STM32 的 BOOT0 接高电平、BOOT1 接低电平时的启动方式是？",
        opts: ["从 Flash 启动（正常运行程序）", "从系统存储器启动（可用串口下载程序）", "从 SRAM 启动", "不复位"], ans: 1,
        exp: "BOOT0=1 且 BOOT1=0 → 系统存储器启动，芯片内置的 ISP bootloader 生效，可通过 UART1 刷程序；BOOT0=0 才从 Flash 正常启动。" },
      { type: "judge", q: "单片机最小系统必须包含时钟电路，没有时钟芯片就无法按节拍执行指令。", ans: true,
        exp: "CPU 靠时钟沿推动指令执行：晶振提供节拍，上电复位提供确定起点。两者缺一不可。" },
      { type: "single", q: "STM32 中外设寄存器的地址区间通常起始于？",
        opts: ["0x00000000", "0x08000000", "0x40000000", "0xE0000000"], ans: 2,
        exp: "0x40000000 起是外设区域；0x08000000 是 Flash；0xE0000000 是内核私有外设（NVIC/SysTick）。这张地址地图要混个脸熟。" },
      { type: "single", q: "关于 51 和 STM32 的学习路线，业内主流建议是？",
        opts: ["只学 51，够用了", "51 快速理解原理，主力学 STM32（市场主流）", "只学 STM32，51 完全过时", "两者都必须精通才有资格面试"], ans: 1,
        exp: "51 结构简单适合建立底层概念；STM32 是招聘主力（库开发、外设生态）。面试考点基本围绕 STM32。" }
    ]
  },

  /* ---------------- 第 2 章 ---------------- */
  {
    id: "m2",
    title: "开发流程与工具链",
    brief: "从写代码到跑进芯片",
    points: [
      { t: "完整开发闭环",
        h: "<p><b>写代码 → 编译 → 下载 → 调试</b>，四步循环。工具链：Keil MDK / STM32CubeIDE（编译+调试）、ST-Link/J-Link（下载调试器，SWD 两线接芯片）、串口助手（打印调试）。STM32CubeMX 图形化配置引脚和时钟，自动生成初始化代码，是现代开发标配。</p>" },
      { t: "三种开发方式：寄存器 / 标准库 / HAL",
        h: "<p><b>寄存器开发</b>：直接读写寄存器地址——最难、最透明，理解原理必经之路（你前面的位运算就是为它准备的）。<b>标准库（SPL）</b>：函数封装寄存器操作，已停更但资料多。<b>HLL 库（HAL）</b>：ST 官方主推，配合 CubeMX 生成，抽象度高、跨芯片移植方便，但代码臃肿。学习路径：先用 HAL 快速出活建立成就感，再回头抠寄存器理解本质。</p>",
        code: "/* 寄存器版点灯 */\nGPIOA->ODR |= (1u << 5);\n/* HAL 库版点灯 */\nHAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_SET);" },
      { t: "下载与调试",
        h: "<p>SWD（串行线调试）两根线（SWDIO/SWCLK）即可下载 + 在线调试 + 查看变量。调试三板斧：<b>断点</b>（停住看现场）、<b>单步</b>（逐行跟逻辑）、<b>Watch 窗口</b>（盯变量变化）。没有屏幕的单片机时代，printf 重定向到串口是永恒的调试神器。</p>" },
      { t: "程序是怎么“跑起来”的",
        h: "<p>上电后硬件自动从 Flash 起始地址取出<b>向量表</b>（一张函数指针表：首项是栈顶地址，第二项是复位函数地址），跳去执行<b>启动文件</b>（汇编写的）：初始化栈 → 拷贝 .data 到 RAM → 清零 .bss → 跳进你的 main。理解这个流程，链接脚本和“变量为什么有初值”就都通了。</p>" }
    ],
    quiz: [
      { type: "single", q: "关于寄器开发和 HAL 库开发的对比，正确的是？",
        opts: ["HAL 更底层更高效", "寄存器开发直接操作地址，最透明但难度高；HAL 封装度高、开发快但代码较臃肿", "两者写法完全相同", "HAL 不能操作 GPIO"], ans: 1,
        exp: "寄存器 = 手动挡（看得见一切），HAL = 自动挡（CubeMX 生成、移植方便）。学习建议：HAL 建立成就感 + 寄存器补内功。" },
      { type: "single", q: "SWD 调试接口最少需要几根信号线？",
        opts: ["1 根", "2 根（SWDIO + SWCLK）", "4 根", "8 根"], ans: 1,
        exp: "SWD 只需 SWDIO（数据）和 SWCLK（时钟）两根，就能完成下载、断点、单步、看变量。JTAG 则需要更多引脚。" },
      { type: "judge", q: "单片机上电后第一条执行的代码就是你写的 main 函数。", ans: false,
        exp: "上电先由硬件取向量表，执行启动文件（汇编）：设栈、搬运 .data、清零 .bss，最后才跳到 main。main 之前还有一整段幕后工作。" },
      { type: "single", q: "STM32CubeMX 的主要作用是？",
        opts: ["画电路原理图", "图形化配置时钟/引脚/外设并生成初始化代码", "编译汇编代码", "仿真电路"], ans: 1,
        exp: "CubeMX 把“翻手册配寄存器”变成点鼠标，生成 HAL 初始化代码，是现代 STM32 开发的效率倍增器。" },
      { type: "single", q: "全局变量没写初值时上电为零、写了初值上电就有值，原因是？",
        opts: ["编译器随机安排", "启动文件把 .bss 段清零、把 .data 段初值从 Flash 拷贝到 RAM", "C 语言标准规定编译期写死", "变量存在 Flash 里所以不变"], ans: 1,
        exp: ".bss（未初始化全局）由启动代码统一清零；.data（已初始化全局）初值存在 Flash，启动时拷贝到 RAM。这正是启动文件干的两件脏活。" }
    ]
  },

  /* ---------------- 第 3 章 ---------------- */
  {
    id: "m3",
    title: "GPIO：点灯与按键",
    brief: "嵌入式世界的 Hello World",
    points: [
      { t: "GPIO 的八种模式（STM32）",
        h: "<p>输入四种：<b>浮空</b>（电平随缘，信号源可靠时用）、<b>上拉</b>（默认高，按键接地检测常用）、<b>下拉</b>（默认低）、<b>模拟</b>（给 ADC 用）。输出四种：<b>推挽</b>、<b>开漏</b>，各有普通/复用两变体。配置口诀：先开时钟，再配模式，然后读写。</p>" },
      { t: "推挽 vs 开漏：一对高频考点",
        h: "<p><b>推挽输出</b>：上下两个 MOS 管交替导通，高低电平都能<b>主动驱动</b>，驱动能力强，普通 IO 控制 LED/电平首选。<b>开漏输出</b>：只有下管，能拉低不能输出高——“高电平”要靠<b>外部上拉电阻</b>。开漏的好处：多设备线与（I2C 靠它）、电平转换（上拉到 5V 就输出 5V）。I2C 的 SDA 必须开漏。</p>" },
      { t: "点灯标准四步",
        h: "<p>① 开 GPIO 时钟（RCC 寄存器置位对应位）→ ② 配置引脚为输出模式 → ③ 写输出寄存器控制电平 → ④ 需要闪烁就在循环里翻转 + 延时。LED 阳极接电源、阴极接 IO 串联电阻：IO 输出低电平点亮（灌电流方式，大多数 MCU 灌电流能力更强）。</p>",
        code: "/* HAL 版点灯（CubeMX 已生成初始化） */\nwhile (1) {\n    HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);\n    HAL_Delay(500);   /* 500ms 翻转一次 */\n}" },
      { t: "按键：输入 + 消抖",
        h: "<p>机械按键按下/松开有 5~10ms 抖动（触点弹跳），直接判断会误触发多次。两种消抖：<b>阻塞延时</b>（简单但卡 CPU，裸机慎用）和<b>状态机/定时器采样</b>（连续 N 次采样一致才确认，不阻塞）——面试标准答案。按键一端接 IO、一端接地时，IO 要配<b>上拉输入</b>。</p>" }
    ],
    quiz: [
      { type: "single", q: "I2C 总线的 SDA 引脚必须配置成什么输出模式？",
        opts: ["推挽输出", "开漏输出（配合外部上拉）", "模拟输出", "任意模式都行"], ans: 1,
        exp: "开漏 + 上拉才能实现“线与”：任一设备拉低整条线就为低，多设备共享总线不会短路打架。推挽高低都硬顶，两设备同时输出相反电平会烧管子。" },
      { type: "single", q: "按键一端接 GPIO、另一端接地，检测“按下为低电平”，GPIO 应配置为？",
        opts: ["浮空输入", "上拉输入", "下拉输入", "推挽输出"], ans: 1,
        exp: "上拉让松开时稳定为高，按下被拉到地成低——电平确定无悬空。浮空输入会因干扰漂移误判。" },
      { type: "single", q: "裸机程序中，按键消抖的最佳实践是？",
        opts: ["检测到按下立刻响应", "检测到按下 delay 20ms 再查一次", "定时器周期采样 + 状态机确认（非阻塞）", "在中断里 while 等待松开"], ans: 2,
        exp: "定时采样/状态机消抖不阻塞主循环，是面试加分答案。delay 消抖能用但浪费 CPU，阻塞式等待更是大忌。" },
      { type: "judge", q: "推挽输出既能输出高电平也能输出低电平，且都有较强的驱动能力。", ans: true,
        exp: "推挽上下两管轮流导通，双向都“硬”。开漏只能拉低，高电平靠上拉电阻“软”拉出。" },
      { type: "single", q: "操作 STM32 某个 GPIO 引脚前，第一步必须做什么？",
        opts: ["直接写输出寄存器", "使能该 GPIO 端口的时钟", "配置中断", "复位芯片"], ans: 1,
        exp: "STM32 外设默认时钟关闭（省电），不先开时钟，写寄存器如同对着断电的设备喊话——毫无反应。新手第一大坑。" },
      { type: "single", q: "LED 阳极经限流电阻接 3.3V、阴极接 GPIO。点亮 LED 的正确操作是？",
        opts: ["GPIO 输出高电平", "GPIO 输出低电平", "GPIO 配置为输入", "关闭 GPIO 时钟"], ans: 1,
        exp: "此接法为“灌电流”：IO 拉低才有电流从电源流向 IO，LED 点亮。反过来“拉电流”接法（IO 接阳极）则输出高点亮。" }
    ]
  },

  /* ---------------- 第 4 章 ---------------- */
  {
    id: "m4",
    title: "中断系统（NVIC / EXTI）",
    brief: "让 CPU 学会“被打断”",
    points: [
      { t: "中断：硬件版的回调函数",
        h: "<p>CPU 顺序执行时，外部事件（按键按下、串口来数据、定时器到点）通过<b>中断线</b>打断它：保存现场 → 跳转执行 <b>ISR（中断服务程序）</b> → 恢复现场继续原任务。<b>向量表</b>就是“事件 → 处理函数”的映射表。轮询像不停开门看快递到没到；中断像快递员按门铃——效率天差地别。</p>" },
      { t: "NVIC：中断的调度中心",
        h: "<p>STM32 的 NVIC 管两套优先级：<b>抢占优先级</b>（pre-emption）：数值越小越优先，可以<b>打断</b>正在执行的低优先级中断（嵌套）；<b>响应优先级</b>（sub）：只在多个中断<b>同时挂起</b>时决定谁先执行，<b>不能嵌套</b>。两中断抢占优先级相同时，后到的不能打断先执行的。</p>" },
      { t: "外部中断 EXTI 使用流程",
        h: "<p>把 GPIO 映射到 EXTI 线（如 PA0 → EXTI0）→ 配置触发沿（上升/下降/双沿）→ NVIC 使能并设优先级 → 编写 ISR（函数名在启动文件里定死，如 EXTI0_IRQHandler）→ ISR 里<b>先清中断标志位</b>再干活。忘清标志 = 退出瞬间重进中断 = 看起来死机。</p>",
        code: "void EXTI0_IRQHandler(void)\n{\n    if (__HAL_GPIO_EXTI_GET_IT(GPIO_PIN_0)) {\n        __HAL_GPIO_EXTI_CLEAR_IT(GPIO_PIN_0); /* 先清标志！ */\n        key_pressed = 1;                     /* 登记后快速退出 */\n    }\n}" },
      { t: "ISR 军规（复习 + 扩展）",
        h: "<ul><li>短小快，不做耗时操作（printf/delay/malloc 禁入）</li><li>与主程序共享的变量加 volatile</li><li>入口清标志，出口快返回</li><li>多字节共享数据加临界区保护（关中断读写）</li><li>不可重入函数不许进 ISR</li></ul>" }
    ],
    quiz: [
      { type: "single", q: "抢占优先级和响应优先级的区别是？",
        opts: ["没有区别，只是名字不同", "抢占优先级可打断正在执行的中断（嵌套），响应优先级只决定同时挂起时谁先执行", "响应优先级可以嵌套，抢占不行", "两者数值越大越优先"], ans: 1,
        exp: "“抢占”= 能打断别人；“响应”= 只能排队抢先。同抢占级的中断之间永远不能互相嵌套——高频面试题。" },
      { type: "single", q: "进入中断服务程序后，第一件该做的事通常是？",
        opts: ["打印日志", "清除该中断的标志位", "长时间延时", "调用 main"], ans: 1,
        exp: "不清标志，退出时标志仍有效会立刻重进中断。先清标志再处理是标准流程（部分硬件清零方式不同，查手册）。" },
      { type: "single", q: "以下哪种做法放在 ISR 里是危险的？",
        opts: ["置一个 volatile 标志位", "往环形缓冲区推一个字节", "printf 打印一段长日志", "读取一个寄存器状态"], ans: 2,
        exp: "printf 慢且通常不可重入，会把中断时长拉长几个数量级，堵住同级和低级中断。打印交给主循环做。" },
      { type: "judge", q: "两个中断的抢占优先级相同时，后到者不能打断先到者正在执行的中断服务。", ans: true,
        exp: "能否嵌套只看抢占优先级。同抢占级（哪怕响应级不同）只能排队等当前 ISR 执行完。" },
      { type: "single", q: "与轮询方式相比，中断方式的核心优势是？",
        opts: ["代码一定更短", "CPU 无需反复查询，事件发生时才响应，可休眠省电、实时性高", "不需要配置任何寄存器", "不会出错"], ans: 1,
        exp: "中断 = 事件驱动；轮询 = 空转烧 CPU。低功耗产品（电池设备）几乎全靠中断 + 休眠架构。" },
      { type: "single", q: "中断“保存现场/恢复现场”指的是？",
        opts: ["保存用户数据到硬盘", "把被打断处的寄存器/返回地址压栈，ISR 结束后弹栈恢复原执行流", "重启程序", "复制中断向量表"], ans: 1,
        exp: "硬件自动压栈关键寄存器，ISR 结尾的中断返回指令弹栈——被打断的代码毫无察觉地继续跑，这是中断魔法的核心。" }
    ]
  },

  /* ---------------- 第 5 章 ---------------- */
  {
    id: "m5",
    title: "定时器与 PWM",
    brief: "精确的时间控制术",
    points: [
      { t: "定时器原理：数到头就中断",
        h: "<p>定时器 = <b>预分频器 PSC + 自动重装寄存器 ARR + 计数器 CNT</b>。时钟先被 PSC 分频，计数器每来一个脉冲加 1，数到 ARR 归零并触发<b>更新中断</b>。以 72MHz 定时器时钟为例：</p><p>定时时间 = (ARR+1) × (PSC+1) / 72MHz</p><p>PSC=7199（÷7200 → 10kHz）、ARR=9999（数 10000 个）→ 1 秒。先分频到“好算的整数频率”再数数，是配置的惯用思路。</p>",
        code: "/* HAL: 1s 定时中断（CubeMX 已配好 PSC/ARR） */\nHAL_TIM_Base_Start_IT(&htim2);\n\nvoid HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim)\n{\n    if (htim->Instance == TIM2) {\n        HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5); /* 每秒翻转 LED */\n    }\n}" },
      { t: "PWM：用占空比说“大小”",
        h: "<p>PWM（脉宽调制）：固定频率的方波，高电平时间占比 = <b>占空比</b>。频率由 PSC/ARR 决定：<b>f = 72MHz / ((PSC+1)×(ARR+1))</b>；占空比 = CCR / (ARR+1)。10% 占空比驱动 LED = 亮度 10%（人眼/惯性器件做天然滤波）。应用：调光、调速、舵机角度、蜂鸣器音调。</p>",
        code: "/* ARR=999: CCR=500 → 50% 占空比 */\n__HAL_TIM_SET_COMPARE(&htim3, TIM_CHANNEL_1, 500);" },
      { t: "HAL_Delay 为什么不能进 ISR",
        h: "<p>HAL_Delay 依赖 SysTick（系统节拍定时器）中断计数。若在更高优先级 ISR 里调用，SysTick 中断被压住，计数不动 → <b>死等卡死</b>。规则：ISR 里禁一切“靠中断推进”的阻塞等待。SysTick 本身是 RTOS 的心跳来源，1ms 一跳。</p>" },
      { t: "输入捕获与编码器（了解）",
        h: "<p>定时器还能<b>测量</b>：输入捕获记录边沿到达时刻 → 测频率/脉宽（超声波测距就靠它）；编码器模式直接数电机编码器脉冲 → 测速。定时器是 MCU 里最强大的外设，面试常问“定时器能干什么”，能答出定时/PWM/捕获/编码器四面就赢了大半。</p>" }
    ],
    quiz: [
      { type: "single", q: "STM32 定时器时钟 72MHz，要求 1 秒定时，下面哪组 PSC/ARR 配置是对的？",
        opts: ["PSC=71, ARR=999", "PSC=7199, ARR=9999", "PSC=1000, ARR=1000", "PSC=72, ARR=7200"], ans: 1,
        exp: "(9999+1)×(7199+1) = 72,000,000 = 72M 个时钟 = 1s。A 选项是 1000×72=72000 个 = 1ms。公式：(ARR+1)(PSC+1)/72MHz。" },
      { type: "single", q: "PWM 的占空比 25% 意思是？",
        opts: ["频率是 25kHz", "一个周期内高电平时间占 25%", "输出电压是 25V", "精度是 25 位"], ans: 1,
        exp: "占空比 = 高电平时间/周期。ARR=999 时 CCR=250 即约 25%。平均电压 ≈ Vcc × 占空比。" },
      { type: "single", q: "为什么不能在中断服务程序里调用 HAL_Delay？",
        opts: ["HAL_Delay 不支持定时", "HAL_Delay 依赖 SysTick 中断计数，高优先级 ISR 里它无法推进，造成死等", "占用内存太大", "会清掉其它中断标志"], ans: 1,
        exp: "经典死锁现场：ISR 优先级高于 SysTick → 节拍中断进不来 → 毫秒计数不变 → HAL_Delay 永远等不到头。ISR 内禁阻塞。" },
      { type: "blank", q: "计算：定时器时钟 72MHz，PSC=7199，ARR=4999，定时周期是多少毫秒？（填数字）",
        code: "周期 = (ARR+1) * (PSC+1) / 72000000 秒",
        blanks: [{ acc: ["500", "500ms", "500ms"] }],
        exp: "72000000/(7200×5000)=2 → 7200×5000=36,000,000 个时钟=0.5s=500ms。先分频：72M/7200=10kHz，每 tick 0.1ms，数 5000 个 = 500ms。" },
      { type: "judge", q: "PWM 调光时，人眼感觉 LED 变暗是因为占空比降低使平均功率下降。", ans: true,
        exp: "频率够高（高于人眼闪烁感知阈值，一般 >100Hz）时，看到的是平均亮度 = 占空比 × 全亮亮度。" },
      { type: "single", q: "SysTick 定时器在 STM32 系统中的典型角色是？",
        opts: ["只用来点灯", "为 HAL_Delay 和 RTOS 提供 1ms 系统节拍", "生成 PWM", "测量温度"], ans: 1,
        exp: "SysTick 是 Cortex-M 内核自带的 24 位向下定时器，专职产生系统节拍：HAL 的毫秒计数、FreeRTOS 调度全靠它。" }
    ]
  },

  /* ---------------- 第 6 章 ---------------- */
  {
    id: "m6",
    title: "ADC 与通信外设实战",
    brief: "读传感器、收发数据",
    points: [
      { t: "ADC：把电压变成数字",
        h: "<p>ADC（模数转换器）把连续电压转为数字。<b>分辨率</b>决定刻度：STM32F103 的 12 位 ADC，2^12 = 4096 级，参考电压 3.3V 时每个刻度约 0.8mV。换算：<b>电压 = 读取值 / 4096 × 3.3V</b>。接 NTC 热敏电阻/光敏电阻分压，就能测温度/光照（查表把电压换算成物理量）。</p>",
        code: "HAL_ADC_Start(&hadc1);\nHAL_ADC_PollForConversion(&hadc1, 100);\nuint16_t raw = HAL_ADC_GetValue(&hadc1);   /* 0~4095 */\nfloat volt = raw / 4096.0f * 3.3f;" },
      { t: "采样注意：阻抗与时间",
        h: "<p>采样电容充电需要时间：信号源内阻太大（如 100kΩ 的传感器直接接）会充不满导致读数偏低——加一级运放跟随或选更长采样周期。另外<b>输入引脚必须配成模拟模式</b>，忘了就会读出鬼值。</p>" },
      { t: "串口实战：printf 重定向",
        h: "<p>调试没屏幕？把 printf 重定向到 UART：实现 <code>fputc</code>（标准库）或 <code>_write</code>（GCC newlib），printf 就从串口飞向电脑串口助手。波特率两端一致（如 115200-8-N-1）。协议帧格式（起始位+数据+校验+停止位）见嵌入式 C 专项通信章。</p>",
        code: "/* 标准库版重定向 */\nint fputc(int ch, FILE *f)\n{\n    HAL_UART_Transmit(&huart1, (uint8_t *)&ch, 1, 0xFFFF);\n    return ch;\n}" },
      { t: "I2C 读传感器流程（通用套路）",
        h: "<p>以读温湿度传感器为例的通用时序：<b>起始 → 发“器件地址+写” → 发寄存器地址 → 重复起始 → 发“器件地址+读” → 读回数据（每字节回 ACK）→ 停止</b>。地址 7 位 + 读写位拼成第一字节（0x68&lt;&lt;1 | 0/1）。HAL 直接给 <code>HAL_I2C_Mem_Read</code> 一把梭，但面试要能手画时序。</p>" }
    ],
    quiz: [
      { type: "single", q: "STM32F103 的 12 位 ADC，参考电压 3.3V，读到的原始值是 2048，对应电压约多少？",
        opts: ["1.65V", "2.048V", "3.3V", "0.8V"], ans: 0,
        exp: "2048/4096 = 0.5 → 3.3V × 0.5 = 1.65V。公式：电压 = raw/4096 × Vref。满量程一半对应一半电压。" },
      { type: "single", q: "要读一个模拟电压信号，对应 GPIO 引脚应配置为？",
        opts: ["推挽输出", "上拉输入", "模拟模式（ADC 通道）", "开漏输出"], ans: 2,
        exp: "模拟模式关闭施密特触发器，引脚直连 ADC 采样电容。配成数字输入会读不到正确模拟值。" },
      { type: "single", q: "把 printf 输出改到串口的技术叫？",
        opts: ["串口重映射", "printf 重定向（实现 fputc/_write 底层输出）", "DMA 搬运", "中断转发"], ans: 1,
        exp: "重定向 = 接管标准库的字符输出接口，把字符逐个塞给 UART 发送寄存器。嵌入式调试必备技能。" },
      { type: "judge", q: "I2C 读传感器寄存器的典型时序中，需要先发“器件地址+写”指定寄存器，再“重复起始”后发“器件地址+读”取回数据。", ans: true,
        exp: "这就是“写完再读”的标准组合。很多新手忘记重复起始（直接发读地址），总线上没有起始信号时序就乱了。" },
      { type: "single", q: "ADC 读数总是偏低且跳动，以下哪个原因最可能？",
        opts: ["波特率设错", "信号源内阻太大且采样时间不足（采样电容没充满）", "LED 没接限流电阻", "看门狗没喂"], ans: 1,
        exp: "高内阻信号源 + 短采样时间 = 采样电容充不满。对策：加大采样周期、加运放缓冲、引脚配模拟模式。" },
      { type: "single", q: "两台设备串口通信，A 配 115200-8-N-1，B 配 9600-8-N-1，会出现什么现象？",
        opts: ["正常通信只是变慢", "收到乱码（波特率不匹配，位对不齐）", "自动协商到同一速率", "硬件损坏"], ans: 1,
        exp: "异步通信全靠事先对表：速率不一致，接收方在错误的时间点采样，解出乱码。两端必须同波特率、同格式。" }
    ]
  },

  /* ---------------- 第 7 章 ---------------- */
  {
    id: "m7",
    title: "从单片机到嵌入式 Linux",
    brief: "MCU / RTOS / Linux 的分水岭",
    points: [
      { t: "MCU 与 MPU（Linux 芯片）的区别",
        h: "<p><b>MCU</b>（如 STM32）：程序直接跑在芯片上（裸机/RTOS），实时性高、确定性强，资源 KB 级。<b>MPU</b>（如 i.MX、全志、树莓派芯片）：跑完整 Linux，有 MMU（虚拟内存）、文件系统、多进程，资源 MB/GB 级。选型口诀：<b>控制强实时选 MCU，复杂应用联网选 Linux</b>（很多产品两者都有：MCU 管电机，Linux 管界面和联网）。</p>" },
      { t: "裸机 / RTOS / Linux 三级跳",
        h: "<p><b>裸机</b>：while(1) + 中断，简单可控（你已掌握）。<b>RTOS</b>（FreeRTOS/RT-Thread）：多任务调度，任务各有栈，实时性好，仍直接操作硬件。<b>Linux</b>：进程/虚拟内存/驱动框架，应用不直接碰硬件（内核驱动代劳）。你 GZ2619 的课程主线就是 Linux 应用层；RTOS 是面试和 MCU 进阶的分水岭。</p>" },
      { t: "岗位地图（应届视角）",
        h: "<ul><li><b>单片机/驱动岗</b>：C + 寄存器 + RTOS + 硬件常识（看懂数据手册、示波器/万用表）</li><li><b>嵌入式 Linux 应用岗</b>：C + Linux 系统编程（文件/进程/网络）+ 你的 LVGL 项目经验</li><li><b>驱动/内核岗</b>（进阶）：Linux 内核模块、设备树、总线驱动模型</li></ul><p>你现在学的 C → 数据结构 → 单片机 → Linux 应用，正好覆盖前两类岗位的全部基础。</p>" },
      { t: "下一步学习路线建议",
        h: "<p>① 把本站 C 语言/数据结构刷完（地基）→ ② STM32 入门板（F103C8T6 蓝色药丸或 Nucleo）点灯→串口→定时器→I2C 传感器做小项目（温湿度计/电子钟）→ ③ 跟上 GZ2619 的 Linux 课程做阶段项目 → ④ 用 1~2 个完整项目写简历。项目不必高大上，<b>完整闭环 + 能讲清原理</b>就是应届生最好的筹码。</p>" }
    ],
    quiz: [
      { type: "single", q: "MCU 与跑 Linux 的 MPU 芯片的本质区别之一是？",
        opts: ["MCU 主频一定更低但都是 8 位", "MPU 有 MMU 支持虚拟内存和多进程，MCU 程序直接运行于物理地址", "MCU 不能接外设", "MPU 不能用 C 语言开发"], ans: 1,
        exp: "MMU = 虚拟内存 = 进程隔离 = 现代操作系统的地基。MCU 没有 MMU，所以跑裸机/RTOS；MPU 有，所以能跑 Linux。" },
      { type: "single", q: "FreeRTOS 这类 RTOS 与裸机相比，核心价值是？",
        opts: ["代码更短", "多任务调度：把复杂逻辑拆成独立任务，各自有栈，由调度器统一安排", "不需要中断", "运行速度一定更快"], ans: 1,
        exp: "裸机状态机写复杂逻辑容易绞成面条；RTOS 把“逻辑块”变成任务，交给调度器。代价是要学信号量/队列等同步机制。" },
      { type: "single", q: "一个产品需要“电机精确实时控制 + 触屏界面 + WiFi 联网”，典型架构是？",
        opts: ["只用一个 51 单片机搞定", "MCU 负责电机实时控制 + Linux 芯片负责界面与联网，分工协作", "只用 Linux 一块芯片最简单", "用模拟电路实现"], ans: 1,
        exp: "混合架构是行业常态：MCU 强实时管执行层，Linux 管应用层，两者用串口/SPI/网络通信。" },
      { type: "judge", q: "应届生做嵌入式岗位求职，项目经验重在完整闭环和能讲清原理，而不是盲目追高大上。", ans: true,
        exp: "面试官必问“你做了什么、遇到什么坑、怎么解决”。一个自己从头到尾做完的小项目，远胜跟风抄的高端 demo。" },
      { type: "single", q: "Linux 应用程序想要操作硬件（如点灯），正确途径是？",
        opts: ["直接读写物理地址", "通过内核驱动提供的设备文件（/dev/xxx）接口", "调用 BIOS 中断", "用 printf"], ans: 1,
        exp: "Linux 用户态不能直接碰硬件，须经内核驱动暴露的接口（设备文件/ioctl）。这正是 MCU 开发和 Linux 开发的思维分水岭。" }
    ]
  }
  ]
});


/* ==== data-linux.js ==== */

/* ============================================================
   课程三：Linux 应用编程（对齐 GZ2619 课程笔记）
   Linux 基础 / 文件 IO / 并发编程 / 网络编程 / LVGL
   ============================================================ */
window.COURSES = window.COURSES || [];
window.COURSES.push({
  id: "lx",
  badge: "LX",
  badgeCls: "cb-lx",
  title: "Linux 应用编程",
  desc: "对应你的课程笔记：Linux 基础、文件 IO、并发编程、网络编程、LVGL。",
  goal: "能独立开发文件 IO、多线程/多进程、网络通信与 LVGL 界面应用，并定位常见运行期错误。",
  roles: ["linux", "drv", "iot"],
  dep: ["c", "linsys"],
  chapters: [

  /* ---------------- 第 1 章 ---------------- */
  {
    id: "lx1",
    title: "Linux 基础与开发环境",
    brief: "目录结构、常用命令、vim 与 gcc",
    points: [
      { t: "一切皆文件",
        h: "<p>Linux 的核心哲学：<b>一切皆文件</b>——普通文件、目录、设备（/dev 下）、进程信息（/proc 下）都用统一的 open/read/write/close 接口访问。理解了这句话，后面的文件 IO 和驱动都通了。</p>" },
      { t: "目录结构速记",
        h: "<ul><li><code>/bin /usr/bin</code>：常用命令；<code>/sbin</code>：管理员命令</li><li><code>/home</code>：用户家目录；<code>/root</code>：root 的家</li><li><code>/etc</code>：配置文件（环境变量、服务配置都在这）</li><li><code>/dev</code>：设备文件；<code>/proc</code>：进程与内核信息（内存映射的假文件）</li><li><code>/lib</code>：库；<code>/usr/include</code>：头文件；<code>/var/log</code>：日志</li></ul>" },
      { t: "天天要用的命令",
        h: "<ul><li>文件：<code>ls cd pwd cp mv rm mkdir</code>（<code>rm -rf</code> 慎用！）</li><li>查看：<code>cat less head tail</code>，<code>tail -f xx.log</code> 滚动看日志</li><li>查找：<code>find 路径 -name \"*.c\"</code>、<code>grep -rn \"关键字\" 目录</code></li><li>权限：<code>chmod +x</code>、<code>sudo</code>；<code>ps aux | grep xxx</code> 查进程，<code>kill -9 pid</code> 强杀</li><li>网络：<code>ifconfig / ip a</code>、<code>ping</code></li><li>打包：<code>tar -xzvf xx.tar.gz</code>（解）、<code>-czvf</code>（压）</li></ul>" },
      { t: "vim 三模式 + gcc 编译",
        h: "<p>vim：<b>命令模式</b>（按 Esc）→ i/a/o 进入<b>插入模式</b>编辑 → :wq 保存退出、:q! 不保存强退。命令模式常用：dd 删行、yy 复制行、p 粘贴、/关键字 搜索。gcc：<code>gcc main.c -o main -Wall</code>；多文件：<code>gcc main.c utils.c -o app</code>。学 Makefile 前先记住：编译 = 把 .c 变 .o，链接 = 把 .o 拼成可执行文件。</p>" }
    ],
    quiz: [
      { type: "single", q: "Linux 系统中，用户的配置文件（如各种服务的配置）一般放在哪个目录？",
        opts: ["/bin", "/etc", "/dev", "/tmp"], ans: 1,
        exp: "/etc 是配置中心。/dev 是设备文件，/tmp 是临时文件（重启可能清空）。" },
      { type: "single", q: "在代码目录中递归查找包含 “socket” 的所有 .c 文件，用哪条命令？",
        opts: ["find . -name socket", "grep -rn \"socket\" . --include=*.c", "ls -R | grep socket", "cat socket *.c"], ans: 1,
        exp: "grep -r 递归搜索内容，-n 显示行号，--include 限定文件类型。find 按文件名找，不搜内容。" },
      { type: "single", q: "tail -f log.txt 的作用是？",
        opts: ["显示文件前 10 行", "滚动实时显示文件新增内容", "删除文件末尾", "统计文件行数"], ans: 1,
        exp: "tail -f 跟随文件增长，是调试后台服务和串口日志的标配。" },
      { type: "single", q: "vim 中从插入模式返回命令模式，按哪个键？",
        opts: ["Enter", "Esc", "Ctrl+C", "q"], ans: 1,
        exp: "Esc 回命令模式；然后 :wq 保存退出、:q! 强退、i 再进入插入。这套循环练到肌肉记忆。" },
      { type: "judge", q: "“一切皆文件”是 Linux 的设计哲学之一，设备也可以像文件一样读写。", ans: true,
        exp: "Linux 用统一接口（open/read/write）操作普通文件、设备、甚至进程信息（/proc），这是它设计上的优雅之处。" },
      { type: "single", q: "gcc -Wall 选项的作用是？",
        opts: ["显示所有警告信息", "生成调试信息", "链接数学库", "优化到最高级别"], ans: 0,
        exp: "-Wall = 打开常用警告集。工程上警告要清零；调试用 -g；链接 libm 用 -lm；优化 -O2。" }
    ]
  },

  /* ---------------- 第 2 章 ---------------- */
  {
    id: "lx2",
    title: "文件 IO（系统调用）",
    brief: "open/read/write/close 与文件描述符",
    points: [
      { t: "文件描述符 fd：小整数",
        h: "<p>Linux 用<b>文件描述符</b>（一个小整数）代表已打开的文件。进程启动自带三个：<b>0 标准输入、1 标准输出、2 标准错误</b>。之后每 open 成功一个文件，返回当前最小可用 fd（通常是 3、4、5……）。fd 是 POSIX 世界一切 IO 的通行证。</p>" },
      { t: "四大系统调用",
        h: "<p><code>open(路径, 标志, 权限)</code> 打开，失败返回 -1（<b>必须判 -1</b>，并 perror 打印原因）；<code>read(fd, buf, count)</code> 返回实际读到的字节数，<b>0 表示文件结束</b>；<code>write(fd, buf, count)</code> 返回实际写入数；<code>close(fd)</code> 关闭。它们和标准 C 的 FILE* 不同：无用户缓冲、更贴近内核。</p>",
        code: "#include <fcntl.h>\n#include <unistd.h>\n\nint fd = open(\"a.txt\", O_RDONLY);\nif (fd == -1) { perror(\"open\"); return -1; }\n\nchar buf[128];\nssize_t n = read(fd, buf, sizeof(buf));   /* n=0 读到结尾 */\nwhile (n > 0) {\n    write(1, buf, n);        /* 写到标准输出 */\n    n = read(fd, buf, sizeof(buf));\n}\nclose(fd);" },
      { t: "open 的常用标志",
        h: "<ul><li><code>O_RDONLY / O_WRONLY / O_RDWR</code>：只读/只写/读写（三选一）</li><li><code>O_CREAT</code>：不存在则创建（配合第三参数权限，如 0644）</li><li><code>O_APPEND</code>：追加写（日志必备）</li><li><code>O_TRUNC</code>：打开时清空</li><li><code>O_NONBLOCK</code>：非阻塞（设备/网络常用）</li></ul><p>标志用按位或组合：<code>O_WRONLY | O_CREAT | O_APPEND, 0644</code>——正是位运算的实战。</p>" },
      { t: "lseek 与偏移量",
        h: "<p>每个打开的文件维护一个<b>当前偏移量</b>，read/write 从偏移量处进行并自动前移。<code>lseek(fd, 0, SEEK_SET)</code> 回到开头；跳到末尾再读可求文件大小。fd 之间相互独立，同一文件两次 open 得到两个独立偏移量的 fd。</p>",
        code: "off_t size = lseek(fd, 0, SEEK_END);  /* 返回末尾位置=大小 */\nlseek(fd, 0, SEEK_SET);               /* 回到开头 */" }
    ],
    quiz: [
      { type: "single", q: "一个新启动的进程，未经任何 open，它已拥有的文件描述符是？",
        opts: ["没有任何 fd", "0=标准输入、1=标准输出、2=标准错误", "只有 0 和 1", "0 到 1024 全部"], ans: 1,
        exp: "0/1/2 是标准输入输出错误（stdin/stdout/stderr），所以新 open 的文件从 fd=3 开始。" },
      { type: "single", q: "read() 的返回值为 0 表示什么？",
        opts: ["出错", "读到了 0 号字节", "已到达文件末尾（EOF）", "缓冲区为空"], ans: 2,
        exp: "read 返回实际读取字节数；返回 0 = 读到文件尾；返回 -1 = 出错。这是读循环的标准判据。" },
      { type: "single", q: "要以“不存在就创建、写入永远追加到末尾”的方式打开日志文件，标志组合是？",
        opts: ["O_WRONLY | O_CREAT", "O_WRONLY | O_CREAT | O_APPEND", "O_RDWR | O_TRUNC", "O_RDONLY | O_APPEND"], ans: 1,
        exp: "O_CREAT 负责创建（配权限参数如 0644），O_APPEND 负责追加。少了 O_APPEND 会从开头覆盖！" },
      { type: "blank", q: "补全代码：判断 open 是否失败。",
        code: "int fd = open(\"data.bin\", O_RDONLY);\nif (fd == {{0}}) {\n    perror(\"open\");\n    return -1;\n}",
        blanks: [{ acc: ["-1"] }],
        exp: "系统调用失败统一返回 -1，errno 记录原因，perror 把它翻译成人话。" },
      { type: "single", q: "系统调用 read/write 与标准 C 库 fread/fwrite 的关系是？",
        opts: ["完全无关的两套体系", "标准库是对系统调用的封装（带缓冲）", "系统调用是标准库的封装", "只是名字不同，函数相同"], ans: 1,
        exp: "FILE* 在用户态维护缓冲区，最终仍调用 read/write。系统调用更底层、一次往返开销更大，库函数帮你攒批。" },
      { type: "single", q: "write(1, buf, n) 中数字 1 代表？",
        opts: ["写入 1 个字节", "标准输出 stdout", "返回值", "错误码"], ans: 1,
        exp: "fd=1 是标准输出。write(1,...) 等价往屏幕打印，write(2,...) 是标准错误——嵌入式调试常用的直接手段。" },
      { type: "single", q: "lseek(fd, 0, SEEK_SET) 的作用是？",
        opts: ["读到文件大小", "把文件偏移量移回文件开头", "清空文件", "移动文件位置"], ans: 1,
        exp: "SEEK_SET 以文件头为基准偏移 0 = 回到开头。SEEK_END 跳到末尾，配合返回值可求文件大小。" }
    ]
  },

  /* ---------------- 第 3 章 ---------------- */
  {
    id: "lx3",
    title: "并发编程：进程与线程",
    brief: "fork、pthread、互斥锁",
    points: [
      { t: "进程 vs 线程",
        h: "<p><b>进程</b> = 正在运行的程序实例，拥有独立地址空间（隔离好、切换贵）；<b>线程</b> = 进程内的执行流，共享同一地址空间（通信方便、但共享数据要加锁）。进程是资源分配单位，线程是调度单位。多线程操作同一变量 = 数据竞争，必须同步。</p>" },
      { t: "fork：复制出一个子进程",
        h: "<p><code>fork()</code> 一次调用<b>两次返回</b>：父进程返回子进程 pid（&gt;0），子进程返回 0，失败返回 -1。父子从 fork 之后并行执行，写时复制（COW）让“复制”很便宜。<code>exec</code> 系列让子进程“变身”成新程序；<code>wait/waitpid</code> 回收子进程避免僵尸。</p>",
        code: "#include <unistd.h>\n#include <sys/wait.h>\n\npid_t pid = fork();\nif (pid == 0) {\n    /* 子进程 */\n    execlp(\"ls\", \"ls\", \"-l\", NULL);\n} else if (pid > 0) {\n    /* 父进程 */\n    int st;\n    wait(&st);   /* 收尸，否则子进程变僵尸 */\n}" },
      { t: "pthread：多线程三件套",
        h: "<p><code>pthread_create(&amp;tid, NULL, 线程函数, 参数)</code> 创建；<code>pthread_join(tid, NULL)</code> 等待结束并回收；<code>pthread_exit</code> 线程自己退出。编译要加 <code>-lpthread</code>。线程函数签名固定：<code>void *(fn)(void *)</code>。</p>",
        code: "#include <pthread.h>\n\nvoid *worker(void *arg)\n{\n    /* 干活 */\n    return NULL;\n}\n\npthread_t tid;\npthread_create(&tid, NULL, worker, NULL);\npthread_join(tid, NULL);" },
      { t: "互斥锁：给共享数据上保险",
        h: "<p>两个线程同时执行 <code>count++</code>？++ 是“读-改-写”三步，会互相踩。用 <b>mutex 互斥锁</b>把临界区包起来：同一时刻只有一个线程能进。规矩：<b>锁的粒度尽量小、持锁时间尽量短、绝不在持锁时睡眠</b>。</p>",
        code: "pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;\n\npthread_mutex_lock(&lock);\ncount++;                 /* 临界区：一次只有一个线程 */\npthread_mutex_unlock(&lock);" },
      { t: "生产者-消费者模型",
        h: "<p>并发编程的“hello world”：生产者往缓冲区放数据，消费者取。缓冲区满/空需要<b>条件变量</b>或<b>信号量</b>配合互斥锁协调。这个模型对应嵌入式的消息队列、串口缓冲，面试必考，值得亲手写一遍。</p>" }
    ],
    quiz: [
      { type: "single", q: "fork() 在父、子进程中的返回值分别是？",
        opts: ["都是子进程 pid", "父进程返回子进程 pid（>0），子进程返回 0", "父返回 0，子返回 1", "都是 0"], ans: 1,
        exp: "一次调用两次返回：>0 说明“我是爸爸，这是孩子的 pid”；=0 说明“我是孩子”。失败才是 -1。" },
      { type: "single", q: "关于进程和线程，正确的说法是？",
        opts: ["线程拥有独立的地址空间", "同进程的线程共享地址空间，共享数据需要同步", "进程间通信比线程间更简单", "线程切换比进程切换开销更大"], ans: 1,
        exp: "线程共享所在进程的内存 → 直接读对方数据方便，但引出数据竞争 → 需要锁。进程隔离性好但通信麻烦（管道/共享内存等）。" },
      { type: "single", q: "两个线程同时对同一个 int 变量执行 count++，可能出问题的原因是？",
        opts: ["int 类型太小", "count++ 不是原子操作（读-改-写三步可能被打断）", "线程不能访问全局变量", "编译器不支持"], ans: 1,
        exp: "++ 分解为 load、add、store 三步，交错执行会丢更新。要么加互斥锁，要么用原子操作。" },
      { type: "blank", q: "补全临界区代码：",
        code: "{{0}}(&lock);\ncount++;\npthread_mutex_unlock(&lock);",
        blanks: [{ acc: ["pthread_mutex_lock"] }],
        exp: "pthread_mutex_lock / unlock 成对出现，包住临界区。同一时刻只有一个线程能拿到锁。" },
      { type: "single", q: "编译多线程程序需要链接哪个库？",
        opts: ["-lm", "-lpthread", "-lstdc++", "不需要额外选项"], ans: 1,
        exp: "gcc ... -lpthread。忘了会报 undefined reference to pthread_create（链接错误，现在你知道在哪一步了吧）。" },
      { type: "single", q: "父进程不调用 wait/waitpid 回收子进程，子进程结束后会变成？",
        opts: ["孤儿进程", "僵尸进程（zombie）", "守护进程", "立即消失"], ans: 1,
        exp: "子进程退出后保留一条“退出状态”记录等父进程读取，期间就是僵尸。孤儿进程是父先走子还在（会被 init 收养），别混淆。" },
      { type: "judge", q: "生产者-消费者模型中，缓冲区的操作只需要条件变量，不需要互斥锁。", ans: false,
        exp: "条件变量只负责“通知/等待”，缓冲区本身的数据操作仍要互斥锁保护。两者配合：锁管安全，条件变量管时机。" }
    ]
  },

  /* ---------------- 第 4 章 ---------------- */
  {
    id: "lx4",
    title: "网络编程基础",
    brief: "socket、TCP 客户端/服务端流程",
    points: [
      { t: "socket：网络的文件描述符",
        h: "<p>“一切皆文件”在网络上的体现：<code>socket()</code> 返回一个特殊 fd，后续 <code>read/write</code> 收发数据。TCP（可靠、有连接、字节流）和 UDP（快、无连接、数据报）是两种主力协议，socket 类型分别是 <code>SOCK_STREAM</code> 和 <code>SOCK_DGRAM</code>。</p>",
        code: "int fd = socket(AF_INET,      /* IPv4 */\n                 SOCK_STREAM,  /* TCP */\n                 0);" },
      { t: "TCP 服务端四步 vs 客户端两步",
        h: "<p>服务端：<b>socket → bind（绑定 IP:端口）→ listen（开始监听）→ accept（接客，返回新 fd）</b>。客户端：<b>socket → connect（拨号）</b>。accept 返回<b>新的 fd</b> 代表这条连接，原 fd 继续等下一个客户——这个设计一定要搞清。</p>",
        code: "/* 服务端骨架 */\nbind(lfd, (struct sockaddr *)&srv, sizeof(srv));\nlisten(lfd, 5);\nint cfd = accept(lfd, NULL, NULL);  /* 阻塞直到有客户端 */\n/* 之后用 cfd 收发数据 */" },
      { t: "网络字节序：大端",
        h: "<p>x86 是小端，网络规定<b>大端</b>传输。端口号和 IP 进 sockaddr 前必须转换：<code>htons</code>（host to network short，端口用）、<code>htonl</code>（IP 用）；收到后 <code>ntohs/ntohl</code> 反向。忘转端口是“明明 bind 成功却连不上”的头号原因。</p>",
        code: "struct sockaddr_in srv;\nsrv.sin_family = AF_INET;\nsrv.sin_port = htons(8888);            /* 必转！ */\nsrv.sin_addr.s_addr = htonl(INADDR_ANY); /* 监听所有网卡 */" },
      { t: "收发与字符串的坑",
        h: "<p><code>read/write</code> 在 TCP 上是<b>字节流</b>：一次 write 可能被对端分多次 read 收到（粘包/半包）。自定义协议要靠“长度前缀”或“分隔符”划定消息边界。字符串收发记得给 buffer 手动补 <code>\\0</code>，read 返回的字节数 n 是你唯一可靠的长度依据。</p>" }
    ],
    quiz: [
      { type: "single", q: "TCP 服务端的正确调用顺序是？",
        opts: ["socket → connect → listen", "socket → bind → listen → accept", "socket → bind → accept → listen", "socket → listen → bind"], ans: 1,
        exp: "socket 创建 → bind 绑定 IP:端口 → listen 转监听态 → accept 取出一条连接。客户端才用 connect。" },
      { type: "single", q: "accept() 的返回值是？",
        opts: ["监听 socket 本身", "代表这条新连接的新 fd", "客户端的 IP 字符串", "收到的字节数"], ans: 1,
        exp: "accept 返回新 fd 专门服务这个客户端，原监听 fd 继续接待下一个。给多个 fd 服务 = select/poll/epoll 的舞台。" },
      { type: "blank", q: "补全代码：把端口 9999 转为网络字节序。",
        code: "srv.sin_port = {{0}}(9999);",
        blanks: [{ acc: ["htons"] }],
        exp: "端口是 16 位 → htons（host to network short）。IP 地址用 htonl。记忆：s=short=端口。" },
      { type: "single", q: "TCP 与 UDP 的核心区别，正确的是？",
        opts: ["TCP 更快", "TCP 可靠有连接（字节流），UDP 无连接不可靠但开销小（数据报）", "UDP 只能局域网用", "TCP 不需要端口号"], ans: 1,
        exp: "TCP 有确认重传排序，可靠但慢；UDP 尽力而为，快、省资源——视频流、DNS 常用 UDP。" },
      { type: "judge", q: "TCP 是字节流协议，一次 write 的数据可能被对方分多次 read 收到。", ans: true,
        exp: "这就是“粘包/半包”。应用层要自定义边界：定长、长度前缀或分隔符（如 \\n）。" },
      { type: "single", q: "关于网络字节序，正确的说法是？",
        opts: ["网络用小端", "网络统一用大端，本机是小端时要 htons/htonl 转换", "字节序由网卡决定", "只有 IP 需要转换"], ans: 1,
        exp: "网络字节序=大端。x86/ARM Linux 常见小端，端口和 IP 填充 sockaddr 前必须转换。" }
    ]
  },

  /* ---------------- 第 5 章 ---------------- */
  {
    id: "lx5",
    title: "LVGL 图形库入门",
    brief: "控件、事件与主循环",
    points: [
      { t: "LVGL 是什么",
        h: "<p>LVGL（Light and Versatile Graphics Library）是最流行的开源嵌入式 GUI 库：纯 C 编写、资源占用小（几十 KB Flash 级别）、控件丰富（按钮、图表、列表、动画），跑在裸机或 RTOS 上，配合显示屏驱动点亮界面。智能家居、手表、车机面板上到处是它。</p>" },
      { t: "三大核心概念",
        h: "<ul><li><b>对象（obj）</b>：一切皆对象，控件继承自基础对象，构成父子树</li><li><b>控件（widget）</b>：lv_btn、lv_label、lv_slider……创建后设置属性</li><li><b>事件（event）</b>：LV_EVENT_CLICKED 等，用回调响应交互</li></ul>",
        code: "lv_obj_t *btn = lv_btn_create(lv_scr_act());   /* 按钮挂到当前屏幕 */\nlv_obj_set_size(btn, 120, 50);\nlv_obj_add_event_cb(btn, btn_cb, LV_EVENT_CLICKED, NULL);\n\nlv_obj_t *label = lv_label_create(btn);         /* 按钮里放文字 */\nlv_label_set_text(label, \"Click me\");" },
      { t: "心跳与主循环",
        h: "<p>LVGL 的时间引擎：周期性调用 <code>lv_tick_inc(ms)</code>（心跳，通常放定时器/心跳线程），主循环里调用 <code>lv_timer_handler()</code> 处理刷新与定时任务——它内部有内部定时器机制，处理动画、输入扫描、重绘。这两个函数没喂数据，界面就是一块死屏——排障先查它们。</p>",
        code: "while (1) {\n    lv_timer_handler();   /* LVGL 的调度器 */\n    usleep(5 * 1000);     /* 5ms，别让 CPU 空转 */\n}" },
      { t: "上手路线建议",
        h: "<p>先用 PC 模拟器（Linux/Windows 都有官方方案）把控件和事件玩熟，再迁移到开发板。学习重点顺序：label/btn 基础控件 → 事件回调 → 布局（flex/grid）→ 样式 → 动画 → 自定义绘制。这也是你课程“阶段项目”的敲门砖。</p>" }
    ],
    quiz: [
      { type: "single", q: "LVGL 的主要应用场景是？",
        opts: ["服务器后端开发", "嵌入式设备 GUI 界面（资源受限的屏幕交互）", "Windows 桌面软件", "数据库管理"], ans: 1,
        exp: "LVGL 为 MCU + 小屏幕设计：小体积、纯 C、控件全。手表、智能家居面板这类带屏嵌入式产品常用。" },
      { type: "single", q: "让 LVGL 保持界面刷新与响应，主循环里必须周期调用的是？",
        opts: ["lv_init()", "lv_timer_handler()", "printf", "sleep"], ans: 1,
        exp: "lv_timer_handler 是 LVGL 的心脏：处理输入、定时器、重绘。lv_init 只在启动时调一次。" },
      { type: "single", q: "响应用户点击按钮这个交互，LVGL 的做法是？",
        opts: ["在 while 里轮询按钮状态", "给对象添加事件回调（lv_obj_add_event_cb）", "覆写 main 函数", "注册中断"], ans: 1,
        exp: "lv_obj_add_event_cb(btn, cb, LV_EVENT_CLICKED, NULL)：事件驱动模型，点击时框架调用你的 cb。" },
      { type: "blank", q: "补全代码：给当前屏幕创建一个按钮。",
        code: "lv_obj_t *btn = lv_btn_create({{0}});",
        blanks: [{ acc: ["lv_scr_act()"] }],
        exp: "lv_scr_act() 返回当前活动屏幕，控件作为它的孩子显示出来（父子对象树）。" },
      { type: "judge", q: "LVGL 只能在高性能 Linux 主机上运行，单片机跑不动。", ans: false,
        exp: "恰恰相反：LVGL 为资源受限的 MCU 设计，最低几十 KB Flash、更少 RAM 即可运行，裸机 + 显示驱动就能跑。" },
      { type: "single", q: "以下哪个是学习 LVGL 的推荐顺序？",
        opts: ["先啃源码再写程序", "PC 模拟器练基础控件/事件 → 布局样式 → 迁移到开发板", "直接上开发板盲写", "先学 C++ 再学 LVGL"], ans: 1,
        exp: "PC 模拟器免掉硬件调试成本，专注学 API；熟了再迁到板子上对接显示驱动，曲线最平缓。" }
    ]
  }
  ]
});


/* ==== data-english.js ==== */

/* ============================================================
   英语六级（CET-6）主线  data-english.js
   ------------------------------------------------------------
   目标：达到大学英语六级水准（词汇 / 阅读 / 写作 / 翻译 / 听力），
   并保留工程场景可用表达。章节 id：en1 ~ en6（发布后不可改）。
   ============================================================ */
window.COURSES = window.COURSES || [];
window.COURSES.push({
  id: "eng",
  badge: "英语6",
  badgeCls: "cb-eng",
  title: "英语六级水准：词汇 · 阅读 · 写译 · 听力",
  brief: "按 CET-6 结构系统补强，兼顾技术英语与开口表达",
  desc: "按大学英语六级能力结构组织：高频词汇与词根、仔细阅读与长难句、写作模板与翻译、听力策略与口语。技术英语只保留「读手册/看报错/面试点」够用部分，主线是六级。",
  goal: "六级阅读能稳定做对主旨与细节题；写作能写 150~200 词结构完整议论文；翻译能处理社会/科技类段落；听力能抓主旨与关键数字；词汇量向 6000+ 靠拢。",
  roles: ["mcu", "iot", "linux"],
  dep: ["c"],
  chapters: [
    {
      id: "en1",
      title: "六级词汇：高频主题与词根词缀",
      brief: "6000+ 不靠死背：主题分块 + 词根推断",
      std: ["掌握 12 个高频主题词群", "能用词根猜生词方向"],
      points: [
        {
          t: "六级词汇怎么背才不崩",
          why: "按主题成块记，比 A-Z 词表有效。",
          h: "<p><b>六大高频主题</b>：社会与教育、经济与工作、科技与环境、健康与心理、文化与媒体、法律与伦理。</p>" +
             "<p>方法：每主题 80~120 词 + 5 个搭配；当天读一段含这些词的短文；第二天遮中文回忆。<b>用出来才算数。</b></p>"
        },
        {
          t: "词根词缀速推",
          why: "考场上生词也能猜方向。",
          h: "<p><b>前缀</b>：re- 再/回、over- 过度、under- 不足、inter- 之间、trans- 跨、mis- 错误、pre- 预先。</p>" +
             "<p><b>词根</b>：spect 看、dict 说、duct 引导、port 运送、scrib 写、mit/mis 发送、cess/ceed 走、struct 建造。</p>" +
             "<p><b>后缀</b>：-tion 名词、-ive 形容词、-ize 动词、-able 能…的、-ist 人。</p>" +
             "<p>例：<b>transportation</b> trans+port+ation → 运输。<b>prescription</b> pre+scrip+tion → 预先写下的 → 处方/规定。</p>"
        },
        {
          t: "动词搭配（写作/翻译必用）",
          why: "六级写译分数常卡在搭配不地道。",
          h: "<p>cause / lead to / result in 导致；cope with / deal with 应对；take measures 采取措施；place emphasis on 强调；be attributed to 归因于；pose a threat to 构成威胁；contribute to 有助于；in terms of 就…而言。</p>" +
             "<p><b>写作句</b>：<i>Several factors contribute to this phenomenon.</i> <i>It is essential that we take immediate measures.</i></p>"
        },
        {
          t: "熟词僻义（最爱考）",
          why: "认识单词却做错题。",
          h: "<p><b>address</b> 不只「地址」→ 处理、应对；<b>company</b> 可指「陪伴」；<b>subject</b> 使…遭受；<b>observe</b> 观察/遵守；<b>appreciate</b> 感激/意识到；<b>charge</b> 收费/指控/充电。</p>" +
             "<p>训练：阅读时先按上下文猜，再查词典，记「句子里的词义」。</p>"
        }
      ],
      quiz: [
        { type: "single", q: "“address the problem” 最接近？", opts: ["给问题写地址", "应对/处理问题", "回避问题", "制造问题"], ans: 1, exp: "address 作动词＝处理；熟词僻义高频。" },
        { type: "single", q: "词根 spect 通常与什么有关？", opts: ["看/视", "写", "跑", "说"], ans: 0, exp: "respect / inspect / spectator 均与「看」有关。" },
        { type: "judge", q: "六级词汇只靠背 A-Z 词表即可。", ans: false, exp: "主题词块 + 语境复现 + 搭配才稳。" },
        { type: "single", q: "“It is essential that we take immediate measures.” 适合用在？", opts: ["开头点题后的措施段", "只用于口语", "只用于广告", "不能用虚拟语气"], ans: 0, exp: "经典建议句；essential that 后可用 (should)+动词原形。" }
      ]
    },
    {
      id: "en2",
      title: "仔细阅读：长难句与题型",
      brief: "主旨、细节、推断、词义题通吃",
      std: ["能拆 3 层长难句", "五类题型各有解题顺序"],
      points: [
        {
          t: "长难句三步拆",
          why: "六级阅读卡句子。",
          h: "<p>① 找<b>主谓宾</b>（先剥从句与插入语）；② 标<b>连接词</b>（that/which/because/although/while）；③ 定<b>指代</b>（this/these/the former）。</p>" +
             "<p>例：Scientists warn that <u>unless</u> effective measures are taken, <u>the trend</u> will continue, <u>which</u> poses a threat to public health.<br>主干：Scientists warn that the trend will continue.</p>"
        },
        {
          t: "题型解题顺序",
          why: "顺序对了少纠结。",
          h: "<p><b>主旨</b>：首末段 + 各段首；排除太窄/太偏的。<br>" +
             "<b>细节</b>：题干定位词回文，同义替换常是答案。<br>" +
             "<b>推断</b>：答案是「文内逻辑+1」，不脑补。<br>" +
             "<b>词义</b>：代入法看上下文褒贬与并列。<br>" +
             "<b>态度</b>：抓情态与评价词（suggest, unfortunately, remarkably）。</p>"
        },
        {
          t: "定位与同义替换",
          why: "答案从不原句复读。",
          h: "<p>题干词 → 文中原词或同义：<b>improve → boost / enhance</b>；<b>problem → challenge / issue</b>；<b>many people → a large proportion of the population</b>。</p>" +
             "<p>时间分配：一篇 8~10 分钟；超过先做下一题，别死磕。</p>"
        },
        {
          t: "刷题纪律",
          why: "只对答案不复盘＝无效。",
          h: "<p>每篇记录：错因（没定位/句不懂/被干扰）；抄 1 句长难句；记 5 个同义替换对。<br>目标：仔细阅读正确率 70%+ 再提速。</p>"
        }
      ],
      quiz: [
        { type: "single", q: "主旨题最可靠的信息源是？", opts: ["某生词", "首末段与各段主题句", "注释", "附录"], ans: 1, exp: "英语说明文结构固定，主题句密度高。" },
        { type: "single", q: "推断题正确做法是？", opts: ["联系自身经历发挥", "基于原文再推一步，不跳远", "选最长选项", "选带绝对词的"], ans: 1, exp: "六级推断是「受控推断」。" },
        { type: "judge", q: "长难句先抓主谓宾，再处理修饰。", ans: true, exp: "主干优先，从句后挂。" },
        { type: "single", q: "遇到生词较合适的步骤是？", opts: ["马上查", "先按词根与上下文猜方向", "跳过全文", "换一篇"], ans: 1, exp: "考场不能查，要练猜读。" }
      ]
    },
    {
      id: "en3",
      title: "写作：三段式与高分句",
      brief: "议论文 150~200 词稳分结构",
      std: ["能 25 分钟写出完整三段文", "掌握 8 个高分句型"],
      points: [
        {
          t: "三段式骨架",
          why: "结构分先拿到。",
          h: "<p><b>Para1 引入+观点</b>：现象 → 不同看法 → 我方观点（一句话）。</p>" +
             "<p><b>Para2 论证 2 点</b>：论点1+解释/例子；论点2+解释/例子。</p>" +
             "<p><b>Para3 结论+建议</b>：重申观点 → 2 条措施/展望。</p>"
        },
        {
          t: "高分句型八条",
          why: "替换小学生句。",
          h: "<p>① <i>There is a growing awareness that…</i><br>" +
             "② <i>It is widely acknowledged that…</i><br>" +
             "③ <i>Several factors account for this phenomenon.</i><br>" +
             "④ <i>From my perspective, …</i><br>" +
             "⑤ <i>On the one hand, … On the other hand, …</i><br>" +
             "⑥ <i>Not only… but also…</i><br>" +
             "⑦ <i>Only in this way can we…</i>（倒装）<br>" +
             "⑧ <i>It is high time that we took measures to…</i></p>"
        },
        {
          t: "题材模板：利弊 / 现象 / 名言",
          why: "三种考法全覆盖。",
          h: "<p><b>利弊</b>：优点两点 + 缺点一点 + 我的选择与条件。<br>" +
             "<b>现象+建议</b>：描述现象 → 原因两条 → 个人/社会措施。<br>" +
             "<b>名言</b>：解释句意 → 论证必要性 → 结合行动。</p>"
        },
        {
          t: "扣分点自查",
          why: "写完 1 分钟自查能救命。",
          h: "<p>① 时态一致；② 主谓一致；③ 不抄题干凑字；④ 连接词不堆砌；⑤ 字数达标（150~200）。<br><b>宁可句式简单，不要语法事故。</b></p>"
        }
      ],
      quiz: [
        { type: "single", q: "六级作文最适合的结构是？", opts: ["一段流水账", "三段：引入-论证-结论", "十段诗歌体", "只写例子"], ans: 1, exp: "结构清晰是基本分。" },
        { type: "single", q: "“Only in this way can we…” 使用了？", opts: ["被动语态", "部分倒装", "进行时", "虚拟过去完成"], ans: 1, exp: "only 状语开头引起部分倒装，加分句型。" },
        { type: "judge", q: "作文里越长的词越好。", ans: false, exp: "准确与地道优先；错误长词更扣分。" },
        { type: "single", q: "结尾段更合适的是？", opts: ["突然新话题", "重申观点+建议/展望", "道歉", "抄阅读原文"], ans: 1, exp: "收束完整。" }
      ]
    },
    {
      id: "en4",
      title: "翻译：社会/科技段落策略",
      brief: "分句、选词、时态语态三步走",
      std: ["能译 150 字级段落无重大语法错", "掌握 20 个文化/科技套语"],
      points: [
        {
          t: "翻译三步法",
          why: "逐字译必崩。",
          h: "<p>① 切分意群；② 选主干句型（主谓宾/there be/it is…that）；③ 补修饰（定语从句/分词/介词短语）。</p>" +
             "<p>时态：现象与事实用一般现在；历史用过去；措施与展望用将来/should。</p>"
        },
        {
          t: "高频套语库",
          why: "段落题反复考这些。",
          h: "<p>改革开放 reform and opening-up；经济增长 economic growth；传统文化 traditional culture；智能手机智能手机 smart devices；互联网+ Internet Plus；一带一路 the Belt and Road；可持续发展 sustainable development；人民群众 people’s livelihood。</p>" +
             "<p><b>科技类</b>：人工智能 artificial intelligence；云计算 cloud computing；自动驾驶 autonomous driving。</p>"
        },
        {
          t: "动词与连接升级",
          why: "小词大用。",
          h: "<p>促进 promote / boost；保障 safeguard；完善 improve / perfect；发挥重要作用 play an important role；随着 with the development of；不仅…而且 not only… but also；越来越多的 an increasing number of。</p>"
        },
        {
          t: "自查清单",
          why: "译完必扫。",
          h: "<p>① 单复数与时态；② 主谓一致；③ 冠词 a/an/the；④ 不出现中式长串；⑤ 专有名词大写。</p>"
        }
      ],
      quiz: [
        { type: "single", q: "“可持续发展”规范译法是？", opts: ["keep developing", "sustainable development", "long development", "always grow"], ans: 1, exp: "固定术语。" },
        { type: "single", q: "翻译第一步应是？", opts: ["逐字替换", "切分意群并定主干", "查生僻词", "写书法体"], ans: 1, exp: "意群切分决定语序。" },
        { type: "judge", q: "翻译可以不看时态。", ans: false, exp: "时态语态是评分点。" },
        { type: "single", q: "“随着经济的发展”常用？", opts: ["With economic develop", "With the development of the economy", "Economy run", "By money"], ans: 1, exp: "固定搭配。" }
      ]
    },
    {
      id: "en5",
      title: "听力与口语：六级听力 + 能开口",
      brief: "预读、抓信号词、笔记符号",
      std: ["能抓长对话/短文主旨", "能用英语表达观点 3 句"],
      points: [
        {
          t: "听力预读与信号词",
          why: "听前 30 秒决定一半。",
          h: "<p>预读选项预测主题与数字；听时跟<b>转折</b>（but/however）、<b>建议</b>（should/why not）、<b>因果</b>（because/therefore）、<b>强调</b>（in fact/especially）。</p>" +
             "<p>笔记符号：↑增加 ↓减少 →导致 ?问题 !强调；数字与单位必记。</p>"
        },
        {
          t: "三大题型策略",
          why: "短对话/长对话/短文打法不同。",
          h: "<p><b>短对话</b>：听第二句与语气；弦外之音常见。<br>" +
             "<b>长对话</b>：先看题干定位，边听边记人-事-态度。<br>" +
             "<b>短文/讲座</b>：首尾句+每段首；例子为观点服务。</p>"
        },
        {
          t: "口语：3 句表达观点",
          why: "面试与口语考试都用。",
          h: "<p>① 观点：<i>From my perspective, …</i><br>② 原因：<i>One reason is that …</i><br>③ 例子/让步：<i>For instance, … / Admittedly, …</i></p>" +
             "<p>每日跟读 TTS 材料 10 分钟，录音对照，只改重音与流利度。</p>"
        },
        {
          t: "真题精听法",
          why: "泛听提升慢。",
          h: "<p>盲听 → 对答案 → 看原文跟读 → 遮文复述。一套真题精听 &gt; 十套只做题。</p>"
        }
      ],
      quiz: [
        { type: "single", q: "听力里 but 之后通常是？", opts: ["废话", "重要信息或态度", "无关细节", "题目要求"], ans: 1, exp: "转折后常出答案。" },
        { type: "single", q: "提升听力更有效的做法是？", opts: ["只看字幕", "真题精听+跟读复述", "只背单词", "加速到 2x 一次过"], ans: 1, exp: "精听复述建立语音-语义映射。" },
        { type: "judge", q: "口语表达要先求流利准确，再求复杂句。", ans: true, exp: "六级口语基本分来自清楚达意。" },
        { type: "single", q: "短文听力主要抓？", opts: ["每个虚词", "首尾与段首主旨句", "背景音", "说话人口音"], ans: 1, exp: "结构信号优先。" }
      ]
    },
    {
      id: "en6",
      title: "工程场景英语：够用即可",
      brief: "手册标题、报错、邮件与技术面（服务于六级与求职）",
      std: ["能读懂常见报错关键词", "能写简短工作邮件"],
      points: [
        {
          t: "报错与手册骨架",
          why: "工作够用，不深挖。",
          h: "<p>undeclared 未声明；undefined reference 链接缺符号；segmentation fault 段错误；stack overflow 栈溢出；<br>Datasheet / Reference Manual / Absolute Maximum Ratings / Electrical Characteristics。</p>"
        },
        {
          t: "简短工作邮件",
          why: "求职与实习都会用。",
          h: "<p>主题清晰；开头问候；2~3 句说明事由与请求；结尾致谢。<br><i>Could you please confirm the version? I’d appreciate your feedback.</i></p>"
        },
        {
          t: "技术面 60 秒",
          why: "六级口语能力落点。",
          h: "<p>Background → Stack → Project with a number → Role fit。<br><i>I built a logging device; 200 power-cut tests without data loss.</i></p>"
        },
        {
          t: "如何和六级一起练",
          why: "两条线不冲突。",
          h: "<p>六级主线（词汇阅读写译听力）每天 45 分钟；技术英语每周 2 次应用练习即可。<b>优先保六级过线能力。</b></p>"
        }
      ],
      quiz: [
        { type: "single", q: "工作邮件请求确认更礼貌的是？", opts: ["Give me answer.", "Could you please confirm the version?", "You must reply today.", "Send it now."], ans: 1, exp: "Could you please… 更得体。" },
        { type: "single", q: "undefined reference 通常在何时出现？", opts: ["运行时", "链接阶段", "写文档时", "安装时"], ans: 1, exp: "缺定义/库。" },
        { type: "judge", q: "技术英语要学到文学阅读水平。", ans: false, exp: "六级主线 + 工作够用即可。" },
        { type: "single", q: "六级与技术英语时间分配更合理的是？", opts: ["只学技术", "只学六级", "六级为主，技术定期应用", "都不学"], ans: 2, exp: "以六级过线能力为主轴。" }
      ]
    }
  ]
});


/* ==== data-russian.js ==== */

/* ============================================================
   俄语六级水准  data-russian.js
   ------------------------------------------------------------
   目标：大学俄语六级（词汇语法 / 阅读 / 写作 / 翻译 / 听力），
   并发挥高考俄语 142 的底子，兼顾日常与出差口语。
   章节 id：ru1 ~ ru6。
   ============================================================ */
window.COURSES = window.COURSES || [];
window.COURSES.push({
  id: "rus",
  badge: "俄语6",
  badgeCls: "cb-rus",
  title: "俄语六级水准：词汇语法 · 阅读 · 写译 · 听力",
  brief: "在高考俄语高分基础上冲六级：系统补语法、读写译与听力",
  desc: "面向大学俄语六级能力结构：高频词汇与语法、阅读长文、写作与翻译、听力策略；同时保留日常/出差口语。你有高考 142 底子，主攻「体系化 + 应试输出」。",
  goal: "六级阅读能处理中等长度论述文；写作能写结构完整短文；翻译能处理社会/科技段落；听力能抓主旨与事实；语法体系（动词体、格、形动词）稳定。",
  roles: ["mcu", "iot", "linux"],
  dep: ["c"],
  chapters: [
    {
      id: "ru1",
      title: "六级词汇与语法主干",
      brief: "动词体、格、形动词副动词",
      std: ["能判断体的用法", "能用格正确造句"],
      points: [
        {
          t: "动词体：完成体与未完成体",
          why: "六级翻译与语法题核心。",
          h: "<p><b>未完成体</b>：过程、经常、反复。<b>完成体</b>：结果、一次性、开始/结束。</p>" +
             "<p>对比：<i>Я читал книгу</i>（读过/在读）vs <i>Я прочитал книгу</i>（读完了）。<br>" +
             "<i>писать / написать</i>；<i>делать / сделать</i>；<i>открывать / открыть</i>。</p>" +
             "<p>命令式与将来时都要看体：邀请用未完成体，要求完成用完成体。</p>"
        },
        {
          t: "名词与形容词格用法",
          why: "句子骨架。",
          h: "<p><b>1</b> 主语；<b>2</b> 否定/数量/所属；<b>3</b> 间接宾语；<b>4</b> 直接宾语；<b>5</b> 工具/和…一起；<b>6</b> 前置词 о/в/на 等。</p>" +
             "<p>例：<i>говорить с другом</i>（5）；<i>интересоваться наукой</i>（5）；<i>делать уроки</i>（4）；<i>нуждаться в помощи</i>（6）。</p>"
        },
        {
          t: "形动词与副动词",
          why: "阅读长句提速关键。",
          h: "<p><b>形动词</b>＝带时态的形容词（…的）：читающий / прочитанный。<br><b>副动词</b>＝同时/先后动作：читая（一边读）、прочитав（读完后）。</p>" +
             "<p>阅读策略：先把形动词还原成从句，主干立刻清楚。</p>"
        },
        {
          t: "高频前缀与词根",
          why: "猜词与构词。",
          h: "<p>по- 开始/稍微、при- 到来/附加、вы- 出去、за- 开始/深入、пере- 重新/穿过、раз- 分解/打开、с- 汇集/离开。</p>" +
             "<p>词根：работ 工作、пис 写、говор 说、зн 知、вид 看、нос 带、ход 走、дав 压。</p>"
        }
      ],
      quiz: [
        { type: "single", q: "«Я прочитал эту книгу» 表示？", opts: ["正在读", "读完了", "经常读", "不想读"], ans: 1, exp: "完成体+过去＝有结果。" },
        { type: "single", q: "«говорить с врачом» 中 врачом 是？", opts: ["1 格", "2 格", "5 格", "6 格"], ans: 2, exp: "с + 5 格：和…一起。" },
        { type: "judge", q: "副动词表示主句动作的同时或先后状态。", ans: true, exp: "читая / прочитав。" },
        { type: "single", q: "前缀 вы- 常表示？", opts: ["进入", "出去/彻底", "否定", "被动"], ans: 1, exp: "如 выйти 出去。" }
      ]
    },
    {
      id: "ru2",
      title: "阅读：论述文与长难句",
      brief: "找主题句、拆从句、练速度",
      std: ["能 10 分钟读完 300~400 词并答主旨题", "能拆复合句"],
      points: [
        {
          t: "论述文结构",
          why: "俄语论说文结构可预期。",
          h: "<p>多为：问题提出 → 论证（原因/对比/例子）→ 结论建议。抓 <b>однако / однако же</b>（然而）、<b>итак</b>（总之）、<b>во-первых</b>（第一）。</p>"
        },
        {
          t: "长难句拆解",
          why: "从句套从句最耗时。",
          h: "<p>先找谓语动词组，再看连接词（что, который, если, когда, чтобы）。<br>«Те, кто хочет…, должны…» 主干＝Те должны…</p>" +
             "<p>指代：этот / такой / он 指上文最近的合理名词，勿乱跳。</p>"
        },
        {
          t: "题型与定位",
          why: "和英语六级类似。",
          h: "<p>主旨看首末段；细节题带关键词回文；观点题抓 автор认为/считает。<br>生词先词根再语境，不逐字翻。</p>"
        },
        {
          t: "提速训练",
          why: "读得慢＝时间不够。",
          h: "<p>每天 1 篇 300 词：先限时再精读；摘 5 个搭配；复述大意 3 句。目标：语速提升 30% 以上。</p>"
        }
      ],
      quiz: [
        { type: "single", q: "«однако» 主要作用是？", opts: ["而且", "然而/但是", "所以", "因为"], ans: 1, exp: "转折信号，后面常是重点。" },
        { type: "single", q: "拆复合句优先找？", opts: ["形容词", "谓语与连接词", "标点颜色", "段落长度"], ans: 1, exp: "主干定位。" },
        { type: "judge", q: "阅读时每个生词都要查。", ans: false, exp: "先猜后查，保住速度。" },
        { type: "single", q: "«кто хочет учиться» 在句中通常是？", opts: ["主句谓语", "从句（谁想学习）", "状语", "感叹"], ans: 1, exp: "кто 引导定语从句。" }
      ]
    },
    {
      id: "ru3",
      title: "写作：短文结构与连接",
      brief: "100~150 词论述/书信",
      std: ["能写三段式短文", "能写正式简短信函"],
      points: [
        {
          t: "三段式",
          why: "结构分稳定。",
          h: "<p>1 引入观点；2 论证两点（因为…；此外…）；3 结论与建议。<br>连接：сначала / затем / кроме того / наконец / итак。</p>"
        },
        {
          t: "常用句型",
          why: "直接套用。",
          h: "<p><i>Сегодня многие люди считают, что…</i><br><i>Я считаю, что…</i><br><i>С одной стороны… С другой стороны…</i><br><i>Таким образом, …</i><br><i>Необходимо принять меры, чтобы…</i></p>"
        },
        {
          t: "书信与申请",
          why: "六级与实务都可能考。",
          h: "<p>结构：称呼（Уважаемый…）→ 事由 → 请求/感谢 → 署名。<br><i>С уважением</i> 此致；<i>Заранее благодарю</i> 预致谢意。</p>"
        },
        {
          t: "常见扣分",
          why: "小错误拖后腿。",
          h: "<p>格错误、体误用、主谓一致、大小写与标点、词数不足。写完大声读一遍，顺口即可信。</p>"
        }
      ],
      quiz: [
        { type: "single", q: "表示「此外」较合适的是？", opts: ["кроме того", "однако", "поэтому", "едва ли"], ans: 0, exp: "递进连接。" },
        { type: "single", q: "正式信结尾常用？", opts: ["Пока", "С уважением", "Привет", "Давай"], ans: 1, exp: "致敬语。" },
        { type: "judge", q: "作文只需堆高级词，结构随意。", ans: false, exp: "结构清晰优先。" },
        { type: "single", q: "«Я считаю, что…» 用于？", opts: ["举例", "引出个人观点", "表示时间", "表示否定"], ans: 1, exp: "观点句。" }
      ]
    },
    {
      id: "ru4",
      title: "翻译：中俄互译策略",
      brief: "语序、体、固定搭配",
      std: ["能译 150 字级社会/科技段落", "掌握 20 个常用术语"],
      points: [
        {
          t: "翻译三步",
          why: "硬译会别扭。",
          h: "<p>① 切意群；② 定主谓与格；③ 调语序与体。<br>俄语语序灵活但语义靠格；汉语靠语序。</p>"
        },
        {
          t: "术语与套语",
          why: "段落题高频。",
          h: "<p>общество 社会；экономика 经济；образование 教育；окружающая среда 环境；наука и техника 科技；общественное развитие 社会发展；свободное время 休闲；здоровье 健康。</p>" +
             "<p>信息技术 информационные технологии；искусственный интеллект 人工智能。</p>"
        },
        {
          t: "句型转换",
          why: "中→俄要「变句式」。",
          h: "<p>汉语多流水句→俄语主从句；「因为…所以」避免双连词；被动可用无人称句或 -ся 动词。<br><i>Управляет ими компьютер.</i> 由计算机控制他们。</p>"
        },
        {
          t: "自查",
          why: "译完必读。",
          h: "<p>格是否配对、动词体、时态、专有名词、数字单位。</p>"
        }
      ],
      quiz: [
        { type: "single", q: "「经济发展」更规范？", opts: ["экономика развитие", "развитие экономики", "богатый деньги", "хорошо дело"], ans: 1, exp: "名词二格后置修饰。" },
        { type: "single", q: "翻译「他每天六点起床」动词体多用？", opts: ["完成体", "未完成体（习惯）", "命令式", "假定式"], ans: 1, exp: "经常性动作。" },
        { type: "judge", q: "俄语翻译只换词即可，不考虑格。", ans: false, exp: "格错了句义全歪。" },
        { type: "single", q: "「人工智能」是？", opts: ["искусственный интеллект", "умная голова", "новый компьютер", "быстрый мозг"], ans: 0, exp: "固定术语。" }
      ]
    },
    {
      id: "ru5",
      title: "听力与口语：抓事实 + 能说观点",
      brief: "六级听力与日常/出差口语",
      std: ["能抓短文主旨与数字", "能表达观点并请求重复"],
      points: [
        {
          t: "听力信号词",
          why: "俄语听力语速快。",
          h: "<p>转折 однако；原因 потому что；结果 поэтому；顺序 сначала/затем；举例 например。<br>数字、时间、地名先记符号。</p>"
        },
        {
          t: "短文与对话",
          why: "题型不同策略不同。",
          h: "<p>对话听意图与态度；短文听首尾与每句重点；新闻/讲座记时间地点人物事件。</p>"
        },
        {
          t: "口语观点三句",
          why: "考试与生活都能用。",
          h: "<p><i>Я думаю, что…</i><br><i>Потому что…</i><br><i>Например, …</i><br>救场：<i>Повторите, пожалуйста.</i> <i>Не совсем понял.</i></p>"
        },
        {
          t: "日常/出差补充",
          why: "和六级并行，不抢主线。",
          h: "<p>问路、住宿、点餐、时间约定各 3 句即可；重点仍是听读写译体系。</p>"
        }
      ],
      quiz: [
        { type: "single", q: "«однако» 在听力中提示？", opts: ["举例", "转折，后面常有重点", "时间", "感叹"], ans: 1, exp: "和英语 but 类似。" },
        { type: "single", q: "没听清时最合适的表达是？", opts: ["Молчать", "Повторите, пожалуйста", "Не хочу", "Громче музыка"], ans: 1, exp: "礼貌请求重复。" },
        { type: "judge", q: "听力只要背单词，不用练听写。", ans: false, exp: "语音流切分需要听写/跟读。" },
        { type: "single", q: "表达观点可用？", opts: ["Я думаю, что…", "Сколько стоит", "Где туалет", "До свидания"], ans: 0, exp: "我认为…" }
      ]
    },
    {
      id: "ru6",
      title: "日常与出差口语（够用层）",
      brief: "在六级体系外，把嘴皮练热",
      std: ["能完成点餐/问路/住宿对话", "能做 30 秒寒暄"],
      points: [
        {
          t: "寒暄与身份",
          why: "开口第一印象。",
          h: "<p><i>Здравствуйте! Меня зовут…</i>；<i>Очень приятно.</i>；<i>Я из Китая, из Гуанчжоу.</i></p>"
        },
        {
          t: "出行三场景",
          why: "出差高频。",
          h: "<p>问路：<i>Извините, как пройти к метро?</i><br>交通：<i>Один билет до центра, пожалуйста.</i><br>住宿：<i>У меня бронь на имя…</i></p>"
        },
        {
          t: "点餐与购物",
          why: "生活必备。",
          h: "<p><i>Меню, пожалуйста.</i> <i>Я буду это.</i> <i>Счёт, пожалуйста.</i><br><i>Сколько это стоит?</i> <i>Можно подешевле?</i></p>"
        },
        {
          t: "电话与约定",
          why: "工作沟通。",
          h: "<p><i>Алло, можно …?</i> <i>Давайте встретимся в четверг.</i> <i>Я перезвоню.</i></p>"
        }
      ],
      quiz: [
        { type: "single", q: "餐厅结账应说？", opts: ["Счёт, пожалуйста", "Уже поел", "Дорого не надо", "Где кухня"], ans: 0, exp: "买单。" },
        { type: "single", q: "「我有预订」可以说？", opts: ["У меня бронь", "Я здесь живу бесплатно", "Нет номера", "Только посмотреть"], ans: 0, exp: "入住常用。" },
        { type: "judge", q: "口语练习可以完全忽略六级听读。", ans: false, exp: "六级输入支撑口语输出，应并行。" },
        { type: "single", q: "约见面时间用？", opts: ["Давайте встретимся в четверг", "Не приходи", "Сейчас плохо", "Никогда"], ans: 0, exp: "让我们周四见。" }
      ]
    }
  ]
});


/* ==== data-hxp.js ==== */

/* AI Harness 工程：实战与排障（补足学科 3 门课） */
window.COURSES = window.COURSES || [];
window.COURSES.push({
  id: "hxp",
  badge: "H+",
  badgeCls: "cb-cpp",
  title: "AI Harness 实战问答与工作流",
  brief: "把 Harness 用成日常工具：提示、记忆、门禁、复盘",
  desc: "面向已经会装 Harness 的同学：如何写可执行提示、如何用记忆与检查单保证产出稳定、如何把一次任务变成可复用工作流。",
  goal: "能独立完成一条「提示 → 产出 → 校验 → 记忆」工作流，并能解释门禁为什么不能省。",
  roles: ["linux"],
  dep: ["harness"],
  chapters: [
    {
      id: "hxp1",
      title: "可执行提示怎么写",
      brief: "从「帮我改代码」到可验收任务",
      std: ["能写出含验收标准的提示", "能识别提示里的歧义"],
      points: [
        {
          t: "提示 = 目标 + 边界 + 验收",
          why: "模糊提示产出不可验收，返工成本高。",
          h: "<p><b>目标</b>：一句话说清要什么；<b>边界</b>：不要动什么、约束是什么；<b>验收</b>：怎么算完成（命令、截图、用例）。</p>" +
             "<p>例：「给 ringbuf 增加 push 边界检查，不要改 pop；验收：node validate 通过 + 新增 2 个 @case。」</p>" +
             "<p>常见歧义：「优化一下」「做成更好的体验」——必须落到可检查项。</p>"
        },
        {
          t: "拆任务与回滚点",
          why: "大任务一次做完难验收，也难回滚。",
          h: "<p>把大目标拆成 2~4 个可单独验收的小步；每步写清涉及文件。<br>失败时只回滚那一步，而不是整次重来。<br>与「文件领地」规则配合：一次一个聊天只改一组文件。</p>"
        }
      ],
      quiz: [
        { type: "judge", q: "「把项目做好一点」是可执行提示。", ans: false, exp: "缺少验收标准与边界。" },
        { type: "single", q: "提示里最重要的是？", opts: ["语气礼貌", "目标+边界+验收", "越长越好", "多用术语"], ans: 1, exp: "可验收才有闭环。" }
      ]
    },
    {
      id: "hxp2",
      title: "门禁与复盘：让结果可重复",
      brief: "校验命令、失败定位、记忆写入",
      std: ["能列出项目门禁清单", "能写一次任务复盘"],
      points: [
        {
          t: "门禁清单",
          why: "没有门禁的改动是赌博。",
          h: "<p>本学习站门禁：validate / smoke / render-check / grade-check（及 sim/testbench 按需）。<br>原则：改什么跑什么，跑完把输出里的数字记下来。<br>「校验不过就不交付」不是口号，是流程节点。</p>"
        },
        {
          t: "复盘三行",
          why: "不复盘会重复踩坑。",
          h: "<p>① 我改了什么、为什么；② 怎么验证的（命令+数字）；③ 坑与下次预防。<br>写进项目记忆或踩坑库，下一次直接查。</p>"
        }
      ],
      quiz: [
        { type: "single", q: "改完内容后首先？", opts: ["直接交付", "跑门禁", "发微博", "改文档"], ans: 1, exp: "先验证再交付。" },
        { type: "judge", q: "复盘只需写「做完了」。", ans: false, exp: "要有验证数字与坑。" }
      ]
    }
  ]
});


/* ==== data-hxs.js ==== */

/* AI Harness：故障与协作（学科第三门课） */
window.COURSES = window.COURSES || [];
window.COURSES.push({
  id: "hxs",
  badge: "H!",
  badgeCls: "cb-cvq",
  title: "AI Harness 故障排查与多会话协作",
  brief: "任务卡住、产出跑偏、多聊天并行时怎么对齐",
  desc: "讲 Harness 使用中的真实摩擦：提示被误解、上下文过长、多会话抢同一文件、记忆没写回。给出可执行的分流与对齐方法。",
  goal: "能诊断三类常见 Harness 故障，并按「看板 + 文件领地 + 收尾记忆」与其它会话协作。",
  roles: ["linux"],
  dep: ["hxp"],
  chapters: [
    {
      id: "hxs1",
      title: "三类高频故障",
      brief: "跑偏、卡住、重复劳动",
      std: ["能区分三类故障并给对策"],
      points: [
        {
          t: "产出跑偏",
          why: "模型理解目标错误，做了另一件事。",
          h: "<p>对策：提示里加「不要做 X」；验收先写；发现跑偏立即中断，改提示而不是继续等。<br>自检：每步输出是否仍能对上最初目标。</p>"
        },
        {
          t: "卡住与重复劳动",
          why: "上下文丢失或未看板认领。",
          h: "<p>卡住：缩小任务、给最小复现、换一问法。<br>重复：先读项目记忆与任务看板再动手；完成项在看板打勾。</p>"
        }
      ],
      quiz: [
        { type: "single", q: "发现 AI 在做无关重构，最合理？", opts: ["等它做完", "立即中断并收紧提示", "换话题", "删仓库"], ans: 1, exp: "止损+改提示。" },
        { type: "judge", q: "多聊天可同时改同一文件。", ans: false, exp: "文件领地规则禁止，防互相覆盖。" }
      ]
    },
    {
      id: "hxs2",
      title: "多会话协作协议",
      brief: "看板、接口契约、收尾同步",
      std: ["能按看板认领任务", "能写收尾同步条目"],
      points: [
        {
          t: "看板与领地",
          why: "并行不覆盖。",
          h: "<p>认领时写：负责人、涉及文件、依赖、验收。<br>接口由最先认领者定稿，他人只读。<br>收尾更新：完成情况、验证结果、遗留问题、下一步。</p>"
        },
        {
          t: "记忆落点",
          why: "跨会话靠磁盘不靠聊天记录。",
          h: "<p>新技能→30；新坑→20；项目进度→projects/&lt;名&gt;/记忆.md；日志→50。<br>禁止另建第二份记忆手册。</p>"
        }
      ],
      quiz: [
        { type: "single", q: "会话收尾必须？", opts: ["直接关窗口", "更新项目记忆与日志", "只改代码", "清空看板"], ans: 1, exp: "收尾必更记忆。" },
        { type: "judge", q: "接口契约由最后完成的人定稿。", ans: false, exp: "最先认领者定稿，避免中途改接口。" }
      ]
    }
  ]
});
