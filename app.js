(function () {

var STORAGE_KEY = "cold_chain_vouchers_v1";

var STEP_DEFS = {
  "箱温偏高": [
    { title: "第一步：重新测箱温", desc: "走到货厢前再测一次厢内温度，记下数值拍照记录" },
    { title: "第二步：拍货厢全貌", desc: "把货厢内部货物摆放、温度计读数、车门状态各拍一张照" },
    { title: "第三步：填写证据信息", desc: "记下照片文件名、联系调度的时间和沟通内容、门店在场人员姓名" },
    { title: "第四步：询问收货意见", desc: "问门店是否能收货，不能的话要在备注上写清楚原因并签字" },
    { title: "第五步：门店签字确认", desc: "让门店人员在凭证备注栏写'情况属实'后签名，留好底单" }
  ],
  "开门时间过长": [
    { title: "第一步：记录开门时长", desc: "看表记下从开门到现在的总分钟数，写在凭证上" },
    { title: "第二步：拍现场环境", desc: "拍一张开着门的货厢和周围环境，证明当时的情况" },
    { title: "第三步：填写证据信息", desc: "照片文件名、联系调度、门店在场人员姓名" },
    { title: "第四步：提醒加快卸货", desc: "跟门店沟通尽快卸货，减少货品暴露时间" },
    { title: "第五步：门店签字确认", desc: "让门店确认开门时长属实后签字" }
  ],
  "温度计损坏": [
    { title: "第一步：拍损坏的仪表", desc: "对准仪表盘拍清楚特写，显示异常读数或黑屏" },
    { title: "第二步：用备用温度计测", desc: "用手持温度计或手机APP再测一次厢内温度" },
    { title: "第三步：填写证据信息", desc: "两张照片文件名、联系调度、门店在场人员姓名" },
    { title: "第四步：告知调度报修", desc: "给调度打电话说明设备损坏，要求安排维修或更换" },
    { title: "第五步：门店签字确认", desc: "门店确认温度实测情况后签字" }
  ],
  "门店等待卸货": [
    { title: "第一步：记录等待开始", desc: "看好时间，记下开始等待的准确时刻" },
    { title: "第二步：拍车辆就位照片", desc: "拍一张车停在卸货位、没人卸货的场景" },
    { title: "第三步：填写证据信息", desc: "照片文件名、联系调度时间、门店人员姓名" },
    { title: "第四步：再联系门店催促", desc: "找到门店主管，再催促一次卸货安排" },
    { title: "第五步：门店签字确认", desc: "让门店确认等待时长属实后签字" }
  ],
  "货品解冻": [
    { title: "第一步：拍货品特写", desc: "拍清楚变软/渗水的货品，放大能看出融化状态" },
    { title: "第二步：测货品表面温度", desc: "用温度计测几个点位的货品表面温度" },
    { title: "第三步：填写证据信息", desc: "照片文件名、联系调度、门店人员姓名" },
    { title: "第四步：问门店是否拒收", desc: "明确记录门店是拒收、部分收货还是让步接收" },
    { title: "第五步：门店签字确认", desc: "让门店在拒收或让步条款上签字" }
  ],
  "其他异常": [
    { title: "第一步：描述具体异常", desc: "先在脑中理清异常的前因后果，准备好具体描述" },
    { title: "第二步：拍摄关键场景", desc: "把异常现场相关的地方都拍清楚" },
    { title: "第三步：填写证据信息", desc: "照片文件名、联系调度、门店在场人员姓名" },
    { title: "第四步：联系调度汇报", desc: "打电话跟调度说清情况，听调度进一步安排" },
    { title: "第五步：门店签字确认", desc: "让门店确认情况描述属实后签字" }
  ]
};

var FOLLOW_ITEMS = {
  "箱温偏高": [
    "核查该车次温度记录仪全程曲线",
    "联系门店确认收货意见和是否有损耗",
    "检查该车辆制冷机组是否有故障或维护记录",
    "通知司机培训标准温度操作流程"
  ],
  "开门时间过长": [
    "核对卸货时长是否超出标准，是门店原因还是司机原因",
    "协调门店优化卸货排班，避免再次长时间等待",
    "评估货品暴露时长是否对品质造成影响",
    "若有损耗，走相关赔付流程"
  ],
  "温度计损坏": [
    "安排维修或更换该车辆的温度记录设备",
    "核查近一周该车辆所有运输记录温度是否可信",
    "通知司机出车前必须确认设备完好",
    "建立车辆温度设备周检制度"
  ],
  "门店等待卸货": [
    "协调门店和车队改善到店卸货时间窗",
    "确认等待期间货品温度保持情况",
    "核对等待时长是否计入司机超时补贴",
    "若有温控风险，加测货品温度"
  ],
  "货品解冻": [
    "判断解冻原因（货厢/门店/途中），明确责任",
    "联系品质部和客户走品质异常流程",
    "确认拒收/报废/让步数量和金额",
    "形成异常案例通报给全体司机"
  ],
  "其他异常": [
    "了解异常具体情况，补充完善信息",
    "涉及责任的进行多方核实",
    "按规定流程报备或上报",
    "形成闭环处理，跟踪后续改进"
  ]
};

var STATUS_LABEL = {
  pending: "待跟进",
  processing: "处理中",
  reviewing: "回访中",
  done: "已完成"
};
var STATUS_CLASS = {
  pending: "pending",
  processing: "processing",
  reviewing: "reviewing",
  done: "done"
};
var STAGE_PROGRESS = {
  pending: 10,
  processing: 40,
  reviewing: 70,
  done: 100
};

var state = {
  selectedScenario: null,
  formData: {},
  completedSteps: [],
  stepTimes: {},
  stepEvidence: {},
  startTime: 0,
  voucherNo: "",
  currentStep: 1,
  currentMode: "driver",
  currentViewId: null,
  lastPersistedVoucher: null
};

/* ---------- 工具函数 ---------- */
function $(id) { return document.getElementById(id); }
function pad2(n) { return n < 10 ? "0" + n : "" + n; }
function fmtTime(d) {
  return pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());
}
function fmtDateTime(d) {
  return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()) + " " + fmtTime(d);
}
function fmtDateOnly(d) {
  return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
}
function startOfDay(d) {
  var x = new Date(d);
  x.setHours(0,0,0,0);
  return x.getTime();
}
function endOfDay(d) {
  var x = new Date(d);
  x.setHours(23,59,59,999);
  return x.getTime();
}
function toast(msg, type) {
  var t = $("toast");
  t.className = "toast show" + (type ? " " + type : "");
  t.textContent = msg;
  setTimeout(function () { t.className = "toast"; }, 2600);
}
function genVoucherNo() {
  var d = new Date();
  var rand = Math.floor(Math.random() * 9000 + 1000);
  return "CC" + d.getFullYear() + pad2(d.getMonth()+1) + pad2(d.getDate()) + pad2(d.getHours()) + pad2(d.getMinutes()) + rand;
}
function scenarioTagClass(s) {
  if (s === "箱温偏高") return "hot";
  if (s === "开门时间过长") return "door";
  if (s === "温度计损坏") return "meter";
  if (s === "门店等待卸货") return "wait";
  if (s === "货品解冻") return "thaw";
  return "other";
}
function escHtml(s) {
  if (s == null) return "";
  return String(s).replace(/[&<>"']/g, function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c];
  });
}

/* ---------- 存储 ---------- */
function getAllRecords() {
  try {
    var s = localStorage.getItem(STORAGE_KEY);
    if (!s) return [];
    var arr = JSON.parse(s);
    return Array.isArray(arr) ? arr : [];
  } catch (e) { return []; }
}
function saveAllRecords(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
function addRecord(rec) {
  var list = getAllRecords();
  list.unshift(rec);
  saveAllRecords(list);
}
function updateRecord(id, patch) {
  var list = getAllRecords();
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      for (var k in patch) {
        if (patch.hasOwnProperty(k)) list[i][k] = patch[k];
      }
      list[i].updatedAt = Date.now();
      saveAllRecords(list);
      return list[i];
    }
  }
  return null;
}
function deleteRecord(id) {
  var list = getAllRecords();
  var nl = [];
  for (var i = 0; i < list.length; i++) {
    if (list[i].id !== id) nl.push(list[i]);
  }
  saveAllRecords(nl);
}
function findRecord(id) {
  var list = getAllRecords();
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === id) return list[i];
  }
  return null;
}

/* ---------- 时钟 ---------- */
function updateClock() {
  var el = $("currentTime");
  if (el) el.textContent = fmtDateTime(new Date());
}

/* ---------- 模式切换 ---------- */
function switchMode(mode) {
  state.currentMode = mode;
  var tabs = document.querySelectorAll(".mode-tab");
  for (var i = 0; i < tabs.length; i++) {
    if (tabs[i].getAttribute("data-mode") === mode) tabs[i].classList.add("active");
    else tabs[i].classList.remove("active");
  }
  var panels = document.querySelectorAll(".mode-panel");
  for (var j = 0; j < panels.length; j++) panels[j].classList.remove("active");
  var pid = "mode-" + mode;
  var p = document.getElementById(pid);
  if (p) p.classList.add("active");

  if (mode === "board") refreshBoard();
  else if (mode === "history") runQuery();
  else if (mode === "handover") initHandoverPage();
}

/* ---------- 步骤切换（司机登记） ---------- */
function gotoStep(n) {
  state.currentStep = n;
  for (var i = 1; i <= 3; i++) {
    $("window" + i).classList.toggle("active", i === n);
  }
  var navs = document.querySelectorAll(".nav-btn");
  for (var j = 0; j < navs.length; j++) {
    var s = parseInt(navs[j].getAttribute("data-step"));
    navs[j].classList.toggle("active", s === n);
    navs[j].classList.toggle("done", s < n);
  }
}

/* ---------- 场景选择 ---------- */
function bindScenarioCards() {
  var cards = document.querySelectorAll(".scenario-card");
  for (var i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", function () {
      var s = this.getAttribute("data-scenario");
      state.selectedScenario = s;
      document.querySelectorAll(".scenario-card").forEach(function(c){ c.classList.remove("selected"); });
      this.classList.add("selected");
    });
  }
}

/* ---------- 验证第一步 ---------- */
function validateStep1() {
  if (!state.selectedScenario) { toast("请先选择一个异常场景", "error"); return false; }
  var plate = $("plateNo").value.trim();
  var goods = $("goodsType").value.trim();
  var ct = $("currentTemp").value.trim();
  var rt = $("requiredTemp").value.trim();
  var driver = $("driverName").value.trim();
  var store = $("storeName").value.trim();

  if (!plate) { toast("请填写车牌号", "error"); $("plateNo").focus(); return false; }
  if (!goods) { toast("请填写货品种类", "error"); $("goodsType").focus(); return false; }
  if (ct === "" || ct === null || isNaN(parseFloat(ct))) {
    toast("请填写当前温度，这是凭证重要依据，不能留空", "error");
    $("currentTemp").focus(); return false;
  }
  if (rt === "" || rt === null || isNaN(parseFloat(rt))) {
    toast("请填写要求温度，这是凭证重要依据，不能留空", "error");
    $("requiredTemp").focus(); return false;
  }
  if (!driver) { toast("请填写司机姓名", "error"); $("driverName").focus(); return false; }
  if (!store) { toast("请填写到达门店", "error"); $("storeName").focus(); return false; }

  state.formData = {
    plate: plate, goods: goods,
    currentTemp: parseFloat(ct), requiredTemp: parseFloat(rt),
    driver: driver, store: store,
    remark: $("remark").value.trim()
  };
  return true;
}

/* ---------- 渲染处置步骤 ---------- */
function renderSteps() {
  var container = $("stepsContainer");
  var scenario = state.selectedScenario;
  var steps = STEP_DEFS[scenario] || STEP_DEFS["其他异常"];
  $("currentScenario").textContent = scenario;

  var html = "";
  for (var i = 0; i < steps.length; i++) {
    var st = steps[i];
    var idx = i + 1;
    var done = state.completedSteps.indexOf(idx) >= 0;
    var isActive = !done && state.completedSteps.length === i;
    html += '<div class="step-item' + (done ? ' done' : (isActive ? ' active' : '')) + '" data-idx="' + idx + '">';
    html += '  <div class="step-head">';
    html += '    <div class="step-check" data-idx="' + idx + '">&#10003;</div>';
    html += '    <div class="step-index">' + idx + '</div>';
    html += '    <div class="step-title">' + escHtml(st.title) + '</div>';
    html += '    <div class="step-desc">' + escHtml(st.desc) + '</div>';
    html += '    <div class="step-time" id="stime_' + idx + '">' + (state.stepTimes[idx] || "--:--") + '</div>';
    html += '  </div>';
    html += '  <div class="step-evidence">';
    html += '    <div class="evidence-title">现场证据记录（选填，建议尽量齐全）</div>';
    html += '    <div class="evidence-grid">';
    html += '      <div class="ev-item"><label>照片文件名</label><input type="text" class="ev-photo" data-idx="' + idx + '" placeholder="如 IMG_20260621_1530.jpg"></div>';
    html += '      <div class="ev-item"><label>联系调度时间</label><input type="text" class="ev-contact" data-idx="' + idx + '" placeholder="如 15:32 张调度"></div>';
    html += '      <div class="ev-item"><label>门店人员姓名</label><input type="text" class="ev-staff" data-idx="' + idx + '" placeholder="如 李主管"></div>';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';
  }
  container.innerHTML = html;

  var checks = container.querySelectorAll(".step-check");
  for (var c = 0; c < checks.length; c++) {
    checks[c].addEventListener("click", function () {
      var idx = parseInt(this.getAttribute("data-idx"));
      toggleStep(idx);
    });
  }

  var evs = state.stepEvidence;
  for (var k in evs) {
    if (evs.hasOwnProperty(k)) {
      var e = evs[k];
      var p = container.querySelector('.ev-photo[data-idx="' + k + '"]');
      var ct2 = container.querySelector('.ev-contact[data-idx="' + k + '"]');
      var st2 = container.querySelector('.ev-staff[data-idx="' + k + '"]');
      if (p) p.value = e.photo || "";
      if (ct2) ct2.value = e.contact || "";
      if (st2) st2.value = e.staff || "";
    }
  }
  updateNextBtn();
}

function toggleStep(idx) {
  var pos = state.completedSteps.indexOf(idx);
  collectEvidenceFromDom();
  if (pos >= 0) {
    state.completedSteps.splice(pos, 1);
    delete state.stepTimes[idx];
  } else {
    if (state.completedSteps.length + 1 < idx) {
      toast("请按顺序完成前面的步骤", "warn"); return;
    }
    state.completedSteps.push(idx);
    state.stepTimes[idx] = fmtTime(new Date());
  }
  state.completedSteps.sort(function(a,b){return a-b;});
  renderSteps();
}

function collectEvidenceFromDom() {
  var container = $("stepsContainer");
  if (!container) return;
  var photos = container.querySelectorAll(".ev-photo");
  for (var i = 0; i < photos.length; i++) {
    var idx = parseInt(photos[i].getAttribute("data-idx"));
    if (!state.stepEvidence[idx]) state.stepEvidence[idx] = {};
    state.stepEvidence[idx].photo = photos[i].value.trim();
  }
  var contacts = container.querySelectorAll(".ev-contact");
  for (var j = 0; j < contacts.length; j++) {
    var idx2 = parseInt(contacts[j].getAttribute("data-idx"));
    if (!state.stepEvidence[idx2]) state.stepEvidence[idx2] = {};
    state.stepEvidence[idx2].contact = contacts[j].value.trim();
  }
  var staffs = container.querySelectorAll(".ev-staff");
  for (var k = 0; k < staffs.length; k++) {
    var idx3 = parseInt(staffs[k].getAttribute("data-idx"));
    if (!state.stepEvidence[idx3]) state.stepEvidence[idx3] = {};
    state.stepEvidence[idx3].staff = staffs[k].value.trim();
  }
}

function updateNextBtn() {
  var scenario = state.selectedScenario;
  var steps = STEP_DEFS[scenario] || STEP_DEFS["其他异常"];
  $("toStep3").disabled = state.completedSteps.length < steps.length;
}

/* ---------- 构建凭证内容 ---------- */
function buildTimelineData() {
  var scenario = state.selectedScenario;
  var steps = STEP_DEFS[scenario] || STEP_DEFS["其他异常"];
  var items = [];
  items.push({
    time: fmtTime(new Date(state.startTime)),
    title: "到达门店发现异常",
    desc: state.formData.store + "，司机" + state.formData.driver + "到场登记异常：" + scenario,
    evidence: null
  });
  for (var i = 0; i < steps.length; i++) {
    var idx = i + 1;
    if (state.completedSteps.indexOf(idx) < 0) continue;
    var st = steps[i];
    var ev = state.stepEvidence[idx] || {};
    items.push({
      time: state.stepTimes[idx] || "--:--",
      title: st.title,
      desc: st.desc,
      evidence: ev
    });
  }
  items.push({
    time: fmtTime(new Date()),
    title: "凭证生成完成",
    desc: "司机完成全部处置步骤，确认留存凭证",
    evidence: null
  });
  return items;
}

function buildDriverNoteWithEvidence() {
  var lines = [];
  var scenario = state.selectedScenario;
  var steps = STEP_DEFS[scenario] || STEP_DEFS["其他异常"];
  lines.push("【司机说明】");
  lines.push("异常类型：" + scenario);
  if (state.formData.remark) lines.push("情况补充：" + state.formData.remark);
  lines.push("");
  lines.push("【现场证据汇总】");
  var hasEv = false;
  for (var i = 0; i < steps.length; i++) {
    var idx = i + 1;
    var ev = state.stepEvidence[idx] || {};
    var parts = [];
    if (ev.photo) parts.push("照片：" + ev.photo);
    if (ev.contact) parts.push("联系调度：" + ev.contact);
    if (ev.staff) parts.push("门店人员：" + ev.staff);
    if (parts.length > 0) {
      hasEv = true;
      lines.push("  " + idx + ". " + steps[i].title);
      for (var j = 0; j < parts.length; j++) lines.push("     " + parts[j]);
    }
  }
  if (!hasEv) lines.push("  （未填写证据信息）");
  return lines.join("\n");
}

function renderTimelineInDom(targetId, items) {
  var el = $(targetId);
  if (!el) return;
  var html = "";
  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    html += '<div class="tl-item">';
    html += '  <div class="tl-time">' + escHtml(it.time) + '</div>';
    html += '  <div class="tl-title">' + escHtml(it.title) + '</div>';
    html += '  <div class="tl-desc">' + escHtml(it.desc) + '</div>';
    if (it.evidence && (it.evidence.photo || it.evidence.contact || it.evidence.staff)) {
      html += '  <div class="tl-ev">';
      if (it.evidence.photo) html += '<div><span>照片：</span>' + escHtml(it.evidence.photo) + '</div>';
      if (it.evidence.contact) html += '<div><span>联系调度：</span>' + escHtml(it.evidence.contact) + '</div>';
      if (it.evidence.staff) html += '<div><span>门店人员：</span>' + escHtml(it.evidence.staff) + '</div>';
      html += '  </div>';
    }
    html += '</div>';
  }
  el.innerHTML = html;
}

function renderFollowList(targetId, list) {
  var el = $(targetId);
  if (!el) return;
  var html = "";
  for (var i = 0; i < list.length; i++) {
    html += '<li>' + (i+1) + '. ' + escHtml(list[i]) + '</li>';
  }
  el.innerHTML = html;
}

/* ---------- 生成凭证 ---------- */
function generateVoucher() {
  collectEvidenceFromDom();
  state.voucherNo = genVoucherNo();
  state.startTime = state.startTime || Date.now();

  var followItems = FOLLOW_ITEMS[state.selectedScenario] || FOLLOW_ITEMS["其他异常"];
  var timeline = buildTimelineData();
  var note = buildDriverNoteWithEvidence();
  var now = new Date();

  var rec = {
    id: "v_" + state.voucherNo,
    voucherNo: state.voucherNo,
    createdAt: now.getTime(),
    scenario: state.selectedScenario,
    formData: JSON.parse(JSON.stringify(state.formData)),
    completedSteps: state.completedSteps.slice(),
    stepTimes: JSON.parse(JSON.stringify(state.stepTimes)),
    stepEvidence: JSON.parse(JSON.stringify(state.stepEvidence)),
    followItems: followItems.slice(),
    timeline: timeline,
    driverNote: note,
    startTime: state.startTime,
    status: "pending",
    officer: "",
    handleTime: "",
    reviewTime: "",
    responsibility: "",
    risk: "normal",
    result: "",
    reviewResult: "",
    processHistory: []
  };
  addRecord(rec);
  state.lastPersistedVoucher = rec;

  $("voucherNo").textContent = state.voucherNo;
  $("v_plate").textContent = state.formData.plate;
  $("v_driver").textContent = state.formData.driver;
  $("v_store").textContent = state.formData.store;
  $("v_goods").textContent = state.formData.goods;
  $("v_temp").textContent = state.formData.currentTemp + " ℃";
  $("v_reqTemp").textContent = state.formData.requiredTemp + " ℃";
  $("v_scenario").textContent = state.selectedScenario;
  $("v_followStatus").textContent = STATUS_LABEL[rec.status] || STATUS_LABEL.pending;
  $("voucherTime").textContent = fmtDateTime(now);

  $("v_processSection").style.display = "none";

  renderTimelineInDom("timeline", timeline);
  $("v_remark").textContent = note;
  renderFollowList("followList", followItems);
}

/* ---------- 从记录重建凭证 HTML ---------- */
function buildVoucherHTMLErrorFree(rec) {
  var html = "";
  html += '<div class="voucher">';
  html += '  <div class="voucher-head"><h3>冷链运输温控异常处置凭证</h3><div class="voucher-no">编号：' + escHtml(rec.voucherNo) + '</div></div>';
  html += '  <div class="voucher-section"><h4>基本信息</h4>';
  var fd = rec.formData || {};
  html += '    <div class="info-row"><span>车牌号：</span><b>' + escHtml(fd.plate||"-") + '</b></div>';
  html += '    <div class="info-row"><span>司机姓名：</span><b>' + escHtml(fd.driver||"-") + '</b></div>';
  html += '    <div class="info-row"><span>到达门店：</span><b>' + escHtml(fd.store||"-") + '</b></div>';
  html += '    <div class="info-row"><span>货品种类：</span><b>' + escHtml(fd.goods||"-") + '</b></div>';
  html += '    <div class="info-row"><span>当前温度：</span><b>' + (fd.currentTemp != null ? fd.currentTemp + " ℃" : "-") + '</b></div>';
  html += '    <div class="info-row"><span>要求温度：</span><b>' + (fd.requiredTemp != null ? fd.requiredTemp + " ℃" : "-") + '</b></div>';
  html += '    <div class="info-row"><span>异常类型：</span><b>' + escHtml(rec.scenario||"-") + '</b></div>';
  html += '    <div class="info-row"><span>跟进状态：</span><b>' + escHtml(STATUS_LABEL[rec.status]||STATUS_LABEL.pending);
  if (rec.officer) html += '（处理人：' + escHtml(rec.officer) + '）';
  html += '</b></div>';
  if (rec.responsibility) html += '    <div class="info-row"><span>责任判断：</span><b>' + escHtml(rec.responsibility) + '</b></div>';
  if (rec.risk && rec.risk !== "normal") {
    var rtxt = "一般";
    if (rec.risk === "high") rtxt = "高风险";
    else if (rec.risk === "warning") rtxt = "关注";
    html += '    <div class="info-row"><span>风险等级：</span><b>' + rtxt + '</b></div>';
  }
  html += '  </div>';

  html += '  <div class="voucher-section"><h4>处置时间线（含现场证据）</h4><div class="timeline">';
  var tl = rec.timeline || [];
  for (var i = 0; i < tl.length; i++) {
    var it = tl[i];
    html += '<div class="tl-item">';
    html += '  <div class="tl-time">' + escHtml(it.time) + '</div>';
    html += '  <div class="tl-title">' + escHtml(it.title) + '</div>';
    html += '  <div class="tl-desc">' + escHtml(it.desc) + '</div>';
    if (it.evidence && (it.evidence.photo || it.evidence.contact || it.evidence.staff)) {
      html += '  <div class="tl-ev">';
      if (it.evidence.photo) html += '<div><span>照片：</span>' + escHtml(it.evidence.photo) + '</div>';
      if (it.evidence.contact) html += '<div><span>联系调度：</span>' + escHtml(it.evidence.contact) + '</div>';
      if (it.evidence.staff) html += '<div><span>门店人员：</span>' + escHtml(it.evidence.staff) + '</div>';
      html += '  </div>';
    }
    html += '</div>';
  }
  html += '  </div></div>';

  html += '  <div class="voucher-section"><h4>现场证据与备注</h4>';
  html += '    <div class="driver-note">' + escHtml(rec.driverNote || "") + '</div>';
  html += '  </div>';

  html += '  <div class="voucher-section"><h4>需调度跟进事项</h4><ul class="follow-list">';
  var fl = rec.followItems || [];
  for (var k = 0; k < fl.length; k++) {
    html += '<li>' + (k+1) + '. ' + escHtml(fl[k]) + '</li>';
  }
  html += '  </ul></div>';

  if (rec.officer || rec.result || rec.reviewResult) {
    html += '  <div class="voucher-section"><h4>调度处理记录</h4><div class="process-block">';
    if (rec.officer) html += '<div class="pb-row"><span>处理人：</span><b>' + escHtml(rec.officer) + '</b></div>';
    if (rec.handleTime) html += '<div class="pb-row"><span>处理时间：</span><b>' + escHtml(rec.handleTime) + '</b></div>';
    if (rec.reviewTime) html += '<div class="pb-row"><span>回访时间：</span><b>' + escHtml(rec.reviewTime) + '</b></div>';
    if (rec.responsibility) html += '<div class="pb-row"><span>责任判断：</span><b>' + escHtml(rec.responsibility) + '</b></div>';
    if (rec.result) html += '<div class="pb-note"><b>处理结果与措施：</b><br>' + escHtml(rec.result).replace(/\n/g,"<br>") + '</div>';
    if (rec.reviewResult) html += '<div class="pb-note" style="margin-top:8px;"><b>回访结果：</b><br>' + escHtml(rec.reviewResult).replace(/\n/g,"<br>") + '</div>';
    if (rec.processHistory && rec.processHistory.length) {
      html += '<div class="pb-note" style="margin-top:8px;"><b>处理历史：</b><br>';
      for (var p = 0; p < rec.processHistory.length; p++) {
        var ph = rec.processHistory[p];
        html += '<div style="margin-top:4px;">&bull; [' + escHtml(ph.time) + '] ' + escHtml(ph.officer) + ' → ' + escHtml(STATUS_LABEL[ph.stage]||ph.stage);
        if (ph.note) html += '<br>&nbsp;&nbsp;' + escHtml(ph.note);
        html += '</div>';
      }
      html += '</div>';
    }
    html += '    </div></div>';
  }

  html += '  <div class="voucher-sign">';
  html += '    <div class="sign-box"><div class="sign-label">司机签字：</div><div class="sign-line"></div></div>';
  html += '    <div class="sign-box"><div class="sign-label">门店签字：</div><div class="sign-line"></div></div>';
  html += '    <div class="sign-box"><div class="sign-label">调度签字：</div><div class="sign-line"></div></div>';
  html += '  </div>';
  html += '  <div class="voucher-foot">';
  html += '    本凭证由系统生成，一式三份（司机、门店、调度各一份），本机已留存记录<br>';
  html += '    生成时间：' + escHtml(fmtDateTime(new Date(rec.createdAt)));
  if (rec.updatedAt) html += '<br>最近更新：' + escHtml(fmtDateTime(new Date(rec.updatedAt)));
  html += '  </div>';
  html += '</div>';
  return html;
}

/* ---------- 打印和保存 ---------- */
function printVoucherHTML(html, addTitle) {
  var w = window.open("", "_blank", "width=960,height=900");
  var pageTitle = addTitle || "冷链异常凭证打印";
  w.document.write("<!DOCTYPE html><html><head><meta charset='UTF-8'><title>" + pageTitle + "</title>");
  w.document.write('<link rel="stylesheet" href="style.css">');
  w.document.write("</head><body>" + html);
  w.document.write("<" + "script>setTimeout(function(){window.print();},500);<" + "/script>");
  w.document.write("</body></html>");
  w.document.close();
}
function saveVoucherHTML(html, fileName) {
  var cssText = "";
  var links = document.querySelectorAll('link[rel="stylesheet"]');
  for (var j = 0; j < links.length; j++) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", links[j].href, false);
      xhr.send();
      if (xhr.status === 200) cssText += xhr.responseText;
    } catch(e){}
  }
  var styles = document.getElementsByTagName("style");
  for (var i = 0; i < styles.length; i++) cssText += styles[i].innerHTML;

  var full = "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>" + escHtml(fileName) + "</title><style>" + cssText + "</style></head><body>" + html + "</body></html>";
  var blob = new Blob([full], { type: "text/html;charset=utf-8" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
}

/* ---------- 今日看板 ---------- */
function refreshBoard() {
  var all = getAllRecords();
  var today = startOfDay(new Date());
  var tmr = today + 24 * 3600 * 1000;
  var todayList = all.filter(function(r){ return r.createdAt >= today && r.createdAt < tmr; });

  $("boardDateTip").textContent = fmtDateOnly(new Date()) + " 今日统计概览";

  var total = todayList.length;
  var hot = 0, door = 0, meter = 0, wait = 0, thaw = 0, other = 0;
  for (var i = 0; i < todayList.length; i++) {
    var s = todayList[i].scenario;
    if (s === "箱温偏高") hot++;
    else if (s === "开门时间过长") door++;
    else if (s === "温度计损坏") meter++;
    else if (s === "门店等待卸货") wait++;
    else if (s === "货品解冻") thaw++;
    else other++;
  }
  $("statTotal").textContent = total;
  $("statHot").textContent = hot;
  $("statDoor").textContent = door;
  $("statMeter").textContent = meter;
  $("statWait").textContent = wait;
  $("statThaw").textContent = thaw;
  $("statOther").textContent = other;
  $("todayBadge").textContent = total;

  var pendingList = todayList.filter(function(r){ return r.status !== "done"; });
  pendingList.sort(function(a,b){ return b.createdAt - a.createdAt; });
  $("pendingCount").textContent = "共" + pendingList.length + "条";
  renderPendingList(pendingList);

  var recent = todayList.slice().sort(function(a,b){ return b.createdAt - a.createdAt; }).slice(0, 8);
  renderRecentList(recent);
}

function renderPendingList(list) {
  var el = $("pendingList");
  if (!list || list.length === 0) {
    el.innerHTML = '<div class="empty-state">暂无未跟进事项，一切顺利！</div>';
    return;
  }
  el.innerHTML = buildRecordItemsHTML(list);
  bindListActions(el);
}
function renderRecentList(list) {
  var el = $("recentList");
  if (!list || list.length === 0) {
    el.innerHTML = '<div class="empty-state">今日暂无登记记录</div>';
    return;
  }
  el.innerHTML = buildRecordItemsHTML(list);
  bindListActions(el);
}
function buildRecordItemsHTML(list) {
  var html = "";
  for (var i = 0; i < list.length; i++) {
    var r = list[i];
    var fd = r.formData || {};
    var cls = STATUS_CLASS[r.status] || "pending";
    var rh = (r.risk === "high") ? " high" : "";
    html += '<div class="record-item ' + cls + rh + '" data-id="' + r.id + '">';
    html += '  <div class="rc-time">' + escHtml(fmtTime(new Date(r.createdAt))) + '</div>';
    html += '  <div class="rc-plate">' + escHtml(fd.plate||"-") + '</div>';
    html += '  <div class="rc-driver">' + escHtml(fd.driver||"-") + '</div>';
    html += '  <div class="rc-store">' + escHtml(fd.store||"-") + '</div>';
    html += '  <div><span class="scenario-tag ' + scenarioTagClass(r.scenario) + '">' + escHtml(r.scenario) + '</span></div>';
    html += '  <div><span class="status-tag ' + cls + '">' + escHtml(STATUS_LABEL[r.status]||STATUS_LABEL.pending) + '</span>';
    if (r.risk && r.risk !== "normal") {
      var rtxt2 = "关注";
      if (r.risk === "high") rtxt2 = "高风险";
      html += ' <span class="risk-tag ' + r.risk + '">' + rtxt2 + '</span>';
    }
    html += '</div>';
    html += '  <div class="rc-actions">';
    html += '    <button class="small-btn primary btn-view">查看/处理</button>';
    html += '  </div>';
    html += '</div>';
  }
  return html;
}
function bindListActions(container) {
  var views = container.querySelectorAll(".btn-view");
  for (var i = 0; i < views.length; i++) {
    views[i].addEventListener("click", function () {
      var rid = this.closest(".record-item").getAttribute("data-id");
      openViewModal(rid);
    });
  }
}

/* ---------- 历史查询 ---------- */
function runQuery() {
  var plate = $("q_plate").value.trim();
  var store = $("q_store").value.trim();
  var scenario = $("q_scenario").value;
  var status = $("q_status").value;
  var df = $("q_dateFrom").value;
  var dt = $("q_dateTo").value;
  var all = getAllRecords();
  var result = [];
  for (var i = 0; i < all.length; i++) {
    var r = all[i];
    var fd = r.formData || {};
    if (plate && (fd.plate||"").indexOf(plate) < 0) continue;
    if (store && (fd.store||"").indexOf(store) < 0) continue;
    if (scenario && r.scenario !== scenario) continue;
    if (status) {
      if (status === "pending" && r.status !== "pending") continue;
      if (status === "processing" && (r.status !== "processing" && r.status !== "reviewing")) continue;
      if (status === "done" && r.status !== "done") continue;
    }
    if (df) {
      var fromTs = new Date(df).getTime();
      if (r.createdAt < fromTs) continue;
    }
    if (dt) {
      var toTs = endOfDay(new Date(dt)).getTime();
      if (r.createdAt > toTs) continue;
    }
    result.push(r);
  }
  $("resultCount").textContent = "共 " + result.length + " 条";
  renderHistoryTable(result);
}

function renderHistoryTable(list) {
  var tbody = $("historyBody");
  var empty = $("emptyHistory");
  if (!list.length) {
    tbody.innerHTML = "";
    empty.style.display = "";
    $("historyTable").style.display = "none";
    return;
  }
  $("historyTable").style.display = "";
  empty.style.display = "none";
  var html = "";
  for (var i = 0; i < list.length; i++) {
    var r = list[i];
    var fd = r.formData || {};
    var cls = STATUS_CLASS[r.status] || "pending";
    html += '<tr data-id="' + r.id + '">';
    html += '<td>' + escHtml(fmtDateTime(new Date(r.createdAt))) + '</td>';
    html += '<td><b>' + escHtml(fd.plate||"-") + '</b></td>';
    html += '<td>' + escHtml(fd.driver||"-") + '</td>';
    html += '<td>' + escHtml(fd.store||"-") + '</td>';
    html += '<td><span class="scenario-tag ' + scenarioTagClass(r.scenario) + '">' + escHtml(r.scenario) + '</span></td>';
    html += '<td>' + (fd.currentTemp != null ? fd.currentTemp : "-") + '</td>';
    html += '<td><span class="status-tag ' + cls + '">' + escHtml(STATUS_LABEL[r.status]||STATUS_LABEL.pending) + '</span></td>';
    html += '<td>' + escHtml(r.officer || "-") + '</td>';
    html += '<td>' + escHtml(r.responsibility || "-") + '</td>';
    html += '<td>';
    html += '  <button class="small-btn primary btn-view">查看</button>';
    html += '  <button class="small-btn danger btn-del">删除</button>';
    html += '</td>';
    html += '</tr>';
  }
  tbody.innerHTML = html;
  tbody.querySelectorAll(".btn-view").forEach(function(b){
    b.addEventListener("click", function(){
      var id = this.closest("tr").getAttribute("data-id");
      openViewModal(id);
    });
  });
  tbody.querySelectorAll(".btn-del").forEach(function(b){
    b.addEventListener("click", function(){
      var id = this.closest("tr").getAttribute("data-id");
      if (!confirm("确定删除这条凭证记录吗？删除后无法恢复！")) return;
      deleteRecord(id);
      toast("已删除", "success");
      runQuery();
      refreshBoardBadgeOnly();
    });
  });
}

function refreshBoardBadgeOnly() {
  var all = getAllRecords();
  var today = startOfDay(new Date());
  var tmr = today + 24 * 3600 * 1000;
  var c = 0;
  for (var i = 0; i < all.length; i++) {
    if (all[i].createdAt >= today && all[i].createdAt < tmr) c++;
  }
  $("todayBadge").textContent = c;
}

/* ---------- 凭证详情弹窗 + 跟进处理 ---------- */
function openViewModal(id) {
  var rec = findRecord(id);
  if (!rec) return;
  state.currentViewId = id;
  var body = $("modalBody");
  body.innerHTML = buildVoucherHTMLErrorFree(rec);
  $("modalTitle").textContent = "凭证详情与跟进处理 - " + rec.voucherNo;
  loadFollowForm(rec);
  renderProgress(rec.status);
  renderProcessHistory(rec.processHistory || []);
  $("viewModal").classList.add("active");
}
function closeModal() {
  state.currentViewId = null;
  $("viewModal").classList.remove("active");
}
function loadFollowForm(rec) {
  $("f_stage").value = rec.status || "pending";
  $("f_officer").value = rec.officer || "";
  $("f_handleTime").value = rec.handleTime || "";
  $("f_reviewTime").value = rec.reviewTime || "";
  $("f_responsibility").value = rec.responsibility || "";
  $("f_risk").value = rec.risk || "normal";
  $("f_result").value = rec.result || "";
  $("f_reviewResult").value = rec.reviewResult || "";
}
function renderProgress(status) {
  var pct = STAGE_PROGRESS[status] || 0;
  $("progressFill").style.width = pct + "%";
  var dots = document.querySelectorAll(".progress-dot");
  var map = { pending: 1, processing: 2, reviewing: 3, done: 4 };
  var cur = map[status] || 1;
  for (var i = 0; i < dots.length; i++) {
    var s = parseInt(dots[i].getAttribute("data-stage"));
    if (s <= cur) dots[i].classList.add("active");
    else dots[i].classList.remove("active");
  }
}
function renderProcessHistory(list) {
  var box = $("processHistory");
  if (!list || list.length === 0) {
    box.innerHTML = '<h5>&#128220; 处理历史</h5><div class="process-empty">暂无处理记录</div>';
    return;
  }
  var html = '<h5>&#128220; 处理历史</h5>';
  for (var i = 0; i < list.length; i++) {
    var ph = list[i];
    html += '<div class="ph-item">';
    html += '  <div class="ph-time">' + escHtml(ph.time || "") + '</div>';
    html += '  <div class="ph-title">' + escHtml(STATUS_LABEL[ph.stage]||ph.stage) + '  —  ' + escHtml(ph.officer||"") + '</div>';
    if (ph.note) html += '  <div class="ph-detail">' + escHtml(ph.note) + '</div>';
    html += '</div>';
  }
  box.innerHTML = html;
}
function saveFollowProgress() {
  if (!state.currentViewId) return;
  var rec = findRecord(state.currentViewId);
  if (!rec) return;
  var stage = $("f_stage").value;
  var officer = $("f_officer").value.trim();
  var handleTime = $("f_handleTime").value.trim();
  var reviewTime = $("f_reviewTime").value.trim();
  var responsibility = $("f_responsibility").value;
  var risk = $("f_risk").value;
  var result = $("f_result").value.trim();
  var reviewResult = $("f_reviewResult").value.trim();

  if (stage !== "pending" && !officer) {
    toast("请填写调度处理人", "error"); $("f_officer").focus(); return;
  }
  if ((stage === "reviewing" || stage === "done") && !reviewResult) {
    if (stage === "done") { toast("完成前请填写回访结果", "warn"); $("f_reviewResult").focus(); return; }
  }

  var history = rec.processHistory ? rec.processHistory.slice() : [];
  var changed = false;
  if ((rec.status || "pending") !== stage) changed = true;
  if ((rec.officer || "") !== officer) changed = true;
  if ((rec.responsibility || "") !== responsibility) changed = true;
  if ((rec.risk || "normal") !== risk) changed = true;
  if ((rec.result || "") !== result) changed = true;
  if ((rec.reviewResult || "") !== reviewResult) changed = true;

  var parts = [];
  if (rec.status !== stage) parts.push("阶段→" + STATUS_LABEL[stage]);
  if (responsibility && (rec.responsibility || "") !== responsibility) parts.push("责任：" + responsibility);
  if (risk && risk !== "normal" && (rec.risk || "normal") !== risk) parts.push("风险：" + (risk==="high"?"高风险":"关注"));
  var note = parts.join("；");
  if (result) note += (note ? "；" : "") + "措施：" + result.replace(/\n/g," / ");
  if (reviewResult) note += (note ? "；" : "") + "回访：" + reviewResult.replace(/\n/g," / ");

  if (changed) {
    history.unshift({
      time: fmtDateTime(new Date()),
      officer: officer || rec.officer || "未填",
      stage: stage,
      note: note || "更新了处理信息"
    });
  }

  var patch = {
    status: stage,
    officer: officer || rec.officer,
    handleTime: handleTime || rec.handleTime,
    reviewTime: reviewTime || rec.reviewTime,
    responsibility: responsibility || rec.responsibility,
    risk: risk || rec.risk,
    result: result || rec.result,
    reviewResult: reviewResult || rec.reviewResult,
    processHistory: history
  };

  var updated = updateRecord(rec.id, patch);
  if (!updated) { toast("保存失败", "error"); return; }

  toast("处理进度已保存", "success");
  renderProcessHistory(history);
  renderProgress(stage);
  $("modalBody").innerHTML = buildVoucherHTMLErrorFree(updated);
  refreshBoard();
  if (state.currentMode === "history") runQuery();
}

/* ---------- 交接班 ---------- */
function initHandoverPage() {
  if (!$("h_date").value) $("h_date").value = fmtDateOnly(new Date());
}

function renderHandoverItemList(list, highlight) {
  if (!list.length) return '<div class="empty-state" style="padding:20px;">（本类无记录）</div>';
  var html = '<div class="hr-list">';
  for (var i = 0; i < list.length; i++) {
    var r = list[i];
    var fd = r.formData || {};
    var cls = STATUS_CLASS[r.status] || "pending";
    var rh = highlight || r.risk === "high";
    html += '<div class="hr-item' + (rh ? ' high' : '') + '" data-id="' + r.id + '">';
    html += '  <div>' + escHtml(fmtTime(new Date(r.createdAt))) + '<br><span style="color:#64748b;font-size:12px;">#' + escHtml(r.voucherNo).substr(-6) + '</span></div>';
    html += '  <div><b>' + escHtml(fd.plate||"-") + '</b><br><span style="color:#64748b;font-size:12px;">' + escHtml(fd.driver||"-") + '</span></div>';
    html += '  <div>' + escHtml(fd.store||"-") + '</div>';
    html += '  <div><span class="scenario-tag ' + scenarioTagClass(r.scenario) + '">' + escHtml(r.scenario) + '</span> ';
    if (r.risk === "high") html += '<span class="risk-tag high">高风险</span>';
    html += '</div>';
    html += '  <div><span class="status-tag ' + cls + '">' + escHtml(STATUS_LABEL[r.status]||STATUS_LABEL.pending) + '</span>';
    if (r.officer) html += '<br><span style="font-size:12px;color:#475569;">' + escHtml(r.officer) + '</span>';
    html += '</div>';
    html += '</div>';
  }
  html += '</div>';
  return html;
}

function generateHandoverReport() {
  var dateStr = $("h_date").value;
  var officer = $("h_officer").value.trim();
  var nextOfficer = $("h_next").value.trim();
  var shift = $("h_shift").value;

  if (!dateStr) { toast("请选择交班日期", "error"); return; }
  if (!officer) { toast("请填写交班调度姓名", "error"); return; }

  var d = new Date(dateStr);
  var start = startOfDay(d);
  var end = endOfDay(d);
  var all = getAllRecords();
  var dayList = all.filter(function(r){ return r.createdAt >= start && r.createdAt <= end; });
  dayList.sort(function(a,b){ return a.createdAt - b.createdAt; });

  var total = dayList.length;
  var hot = 0, door = 0, meter = 0, wait = 0, thaw = 0, other = 0;
  var pendingL = [], processingL = [], doneL = [], highRisk = [];
  for (var i = 0; i < dayList.length; i++) {
    var r = dayList[i];
    if (r.scenario === "箱温偏高") hot++;
    else if (r.scenario === "开门时间过长") door++;
    else if (r.scenario === "温度计损坏") meter++;
    else if (r.scenario === "门店等待卸货") wait++;
    else if (r.scenario === "货品解冻") thaw++;
    else other++;
    if (r.status === "pending") pendingL.push(r);
    else if (r.status === "processing" || r.status === "reviewing") processingL.push(r);
    else if (r.status === "done") doneL.push(r);
    if (r.risk === "high") highRisk.push(r);
  }

  var docNo = "HJ" + genVoucherNo();

  var html = "";
  html += '<div class="handover-report" id="handoverDoc">';
  html += '  <div class="hr-head">';
  html += '    <h3>冷链温控异常调度交接班单</h3>';
  html += '    <div class="hr-meta">';
  html += '      交班日期：' + escHtml(dateStr) + '　　班次：' + escHtml(shift) + '<br>';
  html += '      交班调度：<b>' + escHtml(officer) + '</b>　　接班调度：<b>' + escHtml(nextOfficer || "________") + '</b><br>';
  html += '      打印时间：' + escHtml(fmtDateTime(new Date())) + '　　单据编号：' + escHtml(docNo);
  html += '    </div>';
  html += '  </div>';

  html += '  <div class="hr-section"><h4>一、异常分类总览（当日共 ' + total + ' 单）</h4>';
  html += '    <div class="hr-summary">';
  html += '      <div class="hr-sum-item" style="border-top-color:#1e293b;"><div class="hr-sum-num">' + total + '</div><div class="hr-sum-label">总异常</div></div>';
  html += '      <div class="hr-sum-item" style="border-top-color:#ef4444;"><div class="hr-sum-num">' + hot + '</div><div class="hr-sum-label">箱温偏高</div></div>';
  html += '      <div class="hr-sum-item" style="border-top-color:#f97316;"><div class="hr-sum-num">' + door + '</div><div class="hr-sum-label">开门过长</div></div>';
  html += '      <div class="hr-sum-item" style="border-top-color:#8b5cf6;"><div class="hr-sum-num">' + meter + '</div><div class="hr-sum-label">温度计坏</div></div>';
  html += '      <div class="hr-sum-item" style="border-top-color:#0ea5e9;"><div class="hr-sum-num">' + wait + '</div><div class="hr-sum-label">等待卸货</div></div>';
  html += '      <div class="hr-sum-item" style="border-top-color:#06b6d4;"><div class="hr-sum-num">' + thaw + '</div><div class="hr-sum-label">货品解冻</div></div>';
  html += '      <div class="hr-sum-item" style="border-top-color:#6b7280;"><div class="hr-sum-num">' + other + '</div><div class="hr-sum-label">其他异常</div></div>';
  html += '    </div>';
  html += '  </div>';

  html += '  <div class="hr-section"><h4>二、处置进度概览</h4>';
  html += '    <div class="hr-summary" style="grid-template-columns:repeat(4,1fr);">';
  html += '      <div class="hr-sum-item" style="border-top-color:#ef4444;"><div class="hr-sum-num">' + pendingL.length + '</div><div class="hr-sum-label">待跟进</div></div>';
  html += '      <div class="hr-sum-item" style="border-top-color:#f59e0b;"><div class="hr-sum-num">' + processingL.length + '</div><div class="hr-sum-label">处理/回访中</div></div>';
  html += '      <div class="hr-sum-item" style="border-top-color:#10b981;"><div class="hr-sum-num">' + doneL.length + '</div><div class="hr-sum-label">已完成</div></div>';
  html += '      <div class="hr-sum-item" style="border-top-color:#dc2626;"><div class="hr-sum-num">' + highRisk.length + '</div><div class="hr-sum-label">高风险</div></div>';
  html += '    </div>';
  html += '  </div>';

  html += '  <div class="hr-section"><h4>三、待跟进清单（接班组优先处理）- ' + pendingL.length + ' 项</h4>';
  html += renderHandoverItemList(pendingL, true);
  html += '  </div>';

  html += '  <div class="hr-section"><h4>四、处理中/回访中（需持续跟进）- ' + processingL.length + ' 项</h4>';
  html += renderHandoverItemList(processingL, false);
  html += '  </div>';

  html += '  <div class="hr-section"><h4>五、已完成凭证 - ' + doneL.length + ' 项</h4>';
  html += renderHandoverItemList(doneL, false);
  html += '  </div>';

  if (highRisk.length) {
    html += '  <div class="hr-section"><h4>六、高风险记录（单独列出，请重点关注）- ' + highRisk.length + ' 项</h4>';
    html += renderHandoverItemList(highRisk, true);
    html += '  </div>';
  }

  html += '  <div class="hr-section"><h4>七、交班调度备注（班组特殊事项）</h4>';
  html += '    <div class="driver-note" style="min-height:80px;">（请交班调度手写补充：其他需要交接的车辆、门店、设备或人员事项）</div>';
  html += '  </div>';

  html += '  <div class="hr-sign-row">';
  html += '    <div class="hr-sign"><div class="hr-sign-label">交班调度：</div><div class="hr-sign-line"></div></div>';
  html += '    <div class="hr-sign"><div class="hr-sign-label">接班调度：</div><div class="hr-sign-line"></div></div>';
  html += '    <div class="hr-sign"><div class="hr-sign-label">主管签字：</div><div class="hr-sign-line"></div></div>';
  html += '  </div>';
  html += '</div>';

  html += '<div class="action-bar">';
  html += '  <button class="big-btn primary" id="h_printBtn">&#128424; 打印交接单</button>';
  html += '  <button class="big-btn success" id="h_saveBtn">&#128190; 保存交接单（HTML文件）</button>';
  html += '</div>';

  $("handoverReport").innerHTML = html;

  $("h_printBtn").addEventListener("click", function(){
    var doc = document.getElementById("handoverDoc");
    if (!doc) return;
    printVoucherHTML(doc.outerHTML, "调度交接班单-" + dateStr);
  });
  $("h_saveBtn").addEventListener("click", function(){
    var doc = document.getElementById("handoverDoc");
    if (!doc) return;
    saveVoucherHTML(doc.outerHTML, "交接班单-" + dateStr + "-" + shift + "-" + officer + ".html");
    toast("交接单已保存到本机", "success");
  });
}

/* ---------- 备份与恢复 ---------- */
function exportAllRecords() {
  var all = getAllRecords();
  if (!all.length) { toast("暂无记录可导出", "warn"); return; }
  var payload = {
    exportTime: fmtDateTime(new Date()),
    exportVersion: 1,
    count: all.length,
    records: all
  };
  var json = JSON.stringify(payload, null, 2);
  var blob = new Blob([json], { type: "application/json;charset=utf-8" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  var stamp = fmtDateOnly(new Date()).replace(/-/g,"") + "_" + pad2(new Date().getHours()) + pad2(new Date().getMinutes());
  a.download = "冷链凭证备份_" + stamp + "_" + all.length + "条.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
  toast("已导出 " + all.length + " 条记录", "success");
}

function triggerImportFile() {
  $("importFile").click();
}

function handleImportFile(file) {
  if (!file) return;
  if (file.name.toLowerCase().indexOf(".json") < 0) {
    toast("请选择 JSON 备份文件", "error"); return;
  }
  var reader = new FileReader();
  reader.onload = function (ev) {
    try {
      var data = JSON.parse(ev.target.result);
      var incoming = [];
      if (Array.isArray(data)) incoming = data;
      else if (data && Array.isArray(data.records)) incoming = data.records;
      else { toast("备份文件格式不正确", "error"); return; }

      if (!incoming.length) { toast("文件中没有记录", "warn"); return; }

      var cur = getAllRecords();
      var map = {};
      for (var i = 0; i < cur.length; i++) map[cur[i].id] = true;

      var mode = "merge";
      if (cur.length > 0) {
        var ans = prompt("本机已有 " + cur.length + " 条记录，备份文件含 " + incoming.length + " 条。\n\n请输入导入方式：\n  merge = 合并（保留本机+新增，跳过重复）【默认】\n  overwrite = 覆盖（本机全部删除，只留备份文件内容）\n  cancel = 取消导入", "merge");
        if (!ans) { toast("已取消导入", "warn"); return; }
        ans = ans.toLowerCase().trim();
        if (ans === "cancel") { toast("已取消导入", "warn"); return; }
        if (ans === "overwrite") mode = "overwrite";
        else mode = "merge";
      }

      var added = 0, skipped = 0, replaced = 0;
      var finalList = [];

      if (mode === "overwrite") {
        finalList = incoming.slice();
        added = incoming.length;
      } else {
        // 先加本机记录（按 id 去重）
        var seen = {};
        for (var ci = 0; ci < cur.length; ci++) {
          if (!seen[cur[ci].id]) {
            seen[cur[ci].id] = true;
            finalList.push(cur[ci]);
          }
        }
        // 合并导入
        for (var ii = 0; ii < incoming.length; ii++) {
          var rec = incoming[ii];
          if (!rec || !rec.id) continue;
          if (seen[rec.id]) {
            // 如果导入记录更新时间更晚，则替换
            var importTime = rec.updatedAt || rec.createdAt || 0;
            var existingIdx = -1;
            for (var k = 0; k < finalList.length; k++) {
              if (finalList[k].id === rec.id) { existingIdx = k; break; }
            }
            if (existingIdx >= 0) {
              var existTime = finalList[existingIdx].updatedAt || finalList[existingIdx].createdAt || 0;
              if (importTime > existTime) {
                finalList[existingIdx] = rec;
                replaced++;
              } else {
                skipped++;
              }
            } else skipped++;
          } else {
            seen[rec.id] = true;
            finalList.push(rec);
            added++;
          }
        }
        // 重新按 createdAt 倒序
        finalList.sort(function(a,b){ return (b.createdAt||0) - (a.createdAt||0); });
      }

      if (!confirm("即将导入：\n  模式：" + (mode === "overwrite" ? "覆盖本机" : "合并新增") + "\n  结果：新增 " + added + " 条" + (mode === "merge" ? ("，替换 " + replaced + " 条，跳过重复 " + skipped + " 条") : "") + "\n  导入后总数：" + finalList.length + " 条\n\n确认执行？")) {
        toast("已取消", "warn"); return;
      }
      saveAllRecords(finalList);
      toast("导入完成，共 " + finalList.length + " 条记录", "success");
      runQuery();
      refreshBoardBadgeOnly();
    } catch (err) {
      toast("导入失败：" + err.message, "error");
    }
  };
  reader.onerror = function () { toast("读取文件失败", "error"); };
  reader.readAsText(file, "utf-8");
}

/* ---------- 事件绑定与初始化 ---------- */
function bindEvents() {
  // 模式 Tab
  var tabs = document.querySelectorAll(".mode-tab");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", function () {
      switchMode(this.getAttribute("data-mode"));
    });
  }

  // 步骤内导航
  var navBtns = document.querySelectorAll(".nav-btn");
  for (var n = 0; n < navBtns.length; n++) {
    navBtns[n].addEventListener("click", function () {
      var s = parseInt(this.getAttribute("data-step"));
      if (s === 1) gotoStep(1);
      if (s === 2) { if (validateStep1()) { state.startTime = state.startTime || Date.now(); renderSteps(); gotoStep(2); } }
      if (s === 3) { collectEvidenceFromDom(); var steps = STEP_DEFS[state.selectedScenario]||[]; if (state.completedSteps.length < steps.length){toast("请先完成全部处置步骤", "warn"); return;} generateVoucher(); gotoStep(3); }
    });
  }

  // Step 1 按钮
  $("toStep2").addEventListener("click", function(){
    if (!validateStep1()) return;
    state.startTime = state.startTime || Date.now();
    renderSteps();
    gotoStep(2);
  });
  $("backToStep1").addEventListener("click", function(){ gotoStep(1); });
  $("toStep3").addEventListener("click", function(){
    collectEvidenceFromDom();
    var steps = STEP_DEFS[state.selectedScenario]||[];
    if (state.completedSteps.length < steps.length) { toast("请先完成全部处置步骤（打勾）", "warn"); return; }
    generateVoucher();
    gotoStep(3);
    refreshBoardBadgeOnly();
    toast("凭证已生成本机记录", "success");
  });
  $("backToStep2").addEventListener("click", function(){ gotoStep(2); });

  // Step 3 按钮
  $("saveBtn").addEventListener("click", function(){
    var rec = state.lastPersistedVoucher;
    if (!rec) { toast("凭证尚未生成", "error"); return; }
    var html = buildVoucherHTMLErrorFree(rec);
    saveVoucherHTML(html, "异常凭证_" + rec.voucherNo + "_" + rec.formData.plate + ".html");
    toast("凭证已保存", "success");
  });
  $("printBtn").addEventListener("click", function(){
    var rec = state.lastPersistedVoucher;
    if (!rec) { toast("凭证尚未生成", "error"); return; }
    var html = buildVoucherHTMLErrorFree(rec);
    printVoucherHTML(html, "冷链异常凭证-" + rec.voucherNo);
  });
  $("newRecordBtn").addEventListener("click", function(){
    // 重置 state
    state.selectedScenario = null;
    state.formData = {};
    state.completedSteps = [];
    state.stepTimes = {};
    state.stepEvidence = {};
    state.startTime = 0;
    state.voucherNo = "";
    state.lastPersistedVoucher = null;
    document.querySelectorAll(".scenario-card").forEach(function(c){ c.classList.remove("selected"); });
    ["plateNo","goodsType","currentTemp","requiredTemp","driverName","storeName","remark"].forEach(function(id){ $(id).value = ""; });
    gotoStep(1);
    toast("已清空，可以开始新的登记", "success");
  });

  // 看板
  $("boardRefresh").addEventListener("click", function(){ refreshBoard(); toast("看板已刷新", "success"); });

  // 历史查询
  $("queryBtn").addEventListener("click", runQuery);
  $("resetBtn").addEventListener("click", function(){
    ["q_plate","q_store","q_scenario","q_status","q_dateFrom","q_dateTo"].forEach(function(id){ $(id).value = ""; });
    runQuery();
  });

  // 备份恢复
  $("btnExport").addEventListener("click", exportAllRecords);
  $("btnImport").addEventListener("click", triggerImportFile);
  $("importFile").addEventListener("change", function(ev){
    var f = ev.target.files && ev.target.files[0];
    handleImportFile(f);
    ev.target.value = "";
  });

  // 弹窗
  $("modalClose").addEventListener("click", closeModal);
  $("modalCloseBtn").addEventListener("click", closeModal);
  $("viewModal").querySelector(".modal-mask").addEventListener("click", closeModal);
  $("f_saveBtn").addEventListener("click", saveFollowProgress);
  $("modalPrint").addEventListener("click", function(){
    if (!state.currentViewId) return;
    var rec = findRecord(state.currentViewId);
    if (!rec) return;
    var html = buildVoucherHTMLErrorFree(rec);
    printVoucherHTML(html, "冷链异常凭证-" + rec.voucherNo);
  });
  $("modalSave").addEventListener("click", function(){
    if (!state.currentViewId) return;
    var rec = findRecord(state.currentViewId);
    if (!rec) return;
    var html = buildVoucherHTMLErrorFree(rec);
    saveVoucherHTML(html, "异常凭证_" + rec.voucherNo + "_" + (rec.formData.plate||"") + ".html");
    toast("凭证已保存到本机", "success");
  });

  // 交接班
  $("h_genBtn").addEventListener("click", generateHandoverReport);
}

function init() {
  bindScenarioCards();
  bindEvents();
  updateClock();
  setInterval(updateClock, 1000);
  gotoStep(1);
  refreshBoardBadgeOnly();
}

init();

})();
