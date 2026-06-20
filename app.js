(function () {
  var STORAGE_KEY = "cold_chain_vouchers_v1";

  var STEP_DEFS = {
    "箱温偏高": [
      { title: "使用手持温度计复测温度", desc: "请拿手持温度枪，在货厢内前、中、后三个位置各测一次温度，记录最高值。如果没有手持温度计，请立即联系调度。" },
      { title: "拍摄货厢内温度显示照片", desc: "请用手机拍下货厢温度显示屏的照片，确保照片中数字清晰可辨。如显示异常，请多拍几张不同角度的照片。" },
      { title: "拍摄整批货品外观照片", desc: "请打开货厢门，从门口向内拍摄货品整体堆放的照片，确认货品外观是否有解冻、变形、出水等情况。" },
      { title: "记录制冷机组运行状态", desc: "检查制冷机组是否在运转、指示灯是否正常。如机组停机，请按机组开关尝试重启，并记录机组显示的故障代码。" },
      { title: "请门店在备注栏签字确认", desc: "请门店收货人员在下方情况说明处签字，确认当前温度状态属实。如门店拒绝收货，请让门店写明拒收原因并签字。" }
    ],
    "开门时间过长": [
      { title: "立即关闭货厢门", desc: "如果正在卸货，请立即暂停卸货，关闭货厢门，让制冷机组运行15分钟以上，待温度回落后再继续操作。" },
      { title: "记录开门时长和原因", desc: "请记录从开门到现在的总时长，以及开门原因（如：卸货慢、门店人手不足、等待叉车等）。" },
      { title: "测量货厢内实时温度", desc: "用温度计或通过温度显示屏查看并记录当前货厢内的温度数值，确认是否已超过允许范围。" },
      { title: "拍摄货品状态和开门场景", desc: "请拍摄货品外观照片（看是否有解冻迹象）以及开门卸货的现场照片，照片中能看到开门状态。" },
      { title: "请门店签字确认开门时长", desc: "请门店负责人在凭证上签字，确认从到达至收货完成的总时间以及实际开门时长。" }
    ],
    "温度计损坏": [
      { title: "使用备用温度计复测", desc: "请使用您携带的备用手持温度计，在货厢内多个点（前、中、后、上、下）测量温度并记录数值。" },
      { title: "拍摄损坏的温度计照片", desc: "请近距离拍摄货厢内安装的温度显示屏或温度计，拍下黑屏、乱码、异常读数等故障现象。" },
      { title: "检查制冷机组是否运转", desc: "听制冷机组是否有运转声音，查看机组出风口是否有冷气排出，记录机组运行状态。" },
      { title: "用手感受货品温度", desc: "请用手轻触货品表面，感受是否仍有冻硬状态或已变软，判断货品是否受温度影响。" },
      { title: "请门店确认并签字", desc: "请门店确认当前货品实际状态，在凭证上写明温度计故障情况并签字。" }
    ],
    "门店等待卸货": [
      { title: "记录到达门店的时间", desc: "请准确记录您的车辆到达门店的时间。到达后请立即向门店报到，并保留报到记录（通话、微信等）。" },
      { title: "记录实际开始卸货时间", desc: "请记录门店实际开始安排卸货的时间，计算等待时长。期间请勿开启货厢门，保持机组运行。" },
      { title: "每30分钟记录一次温度", desc: "在等待期间，每隔30分钟查看一次货厢温度并记录，如果温度开始上升，请及时联系调度。" },
      { title: "拍摄车辆停在门店外的照片", desc: "请拍摄车头加门店招牌的合影照片，证明车辆确实按约定时间到达门店等待卸货。" },
      { title: "请门店签字确认等待时长", desc: "请门店负责人在凭证上写明到达时间、开始卸货时间，并签字确认等待时长属实。" }
    ],
    "货品解冻": [
      { title: "测量货厢当前温度", desc: "立即使用温度计测量货厢内温度，并查看温度记录是否有异常升温时段。" },
      { title: "拍摄解冻货品的特写照片", desc: "请近距离拍摄解冻、软化、出水的货品，多拍几个包装，照片中能清晰看到货品状态异常。" },
      { title: "区分解冻货品和正常货品", desc: "请确认是全部货品都已解冻，还是部分货品。如是部分，请标识具体是哪几板或哪几箱。" },
      { title: "检查包装是否破损", desc: "检查货品外箱是否有破损、湿水痕迹，包装破损可能是客户提货或装车时造成的问题。" },
      { title: "请门店签字确认货损状态", desc: "请门店检查后在凭证上写明货损情况，对受损货品数量进行确认并签字。" }
    ],
    "其他异常": [
      { title: "用文字详细描述异常情况", desc: "请在下方说明栏中用文字写清楚发生了什么，尽量写清楚时间、地点、经过、涉及人员等信息。" },
      { title: "拍摄现场照片", desc: "无论什么异常情况，都请拍摄现场照片，越多越好，照片比文字更有说服力。" },
      { title: "记录关键时间点", desc: "请记录发现异常的时间、联系调度的时间、门店反馈的时间等关键时间点。" },
      { title: "联系调度说明情况", desc: "请立即拨打调度电话，将异常情况当面说明白，听取调度的进一步指示。" },
      { title: "请相关方签字确认", desc: "如有门店、装卸工、其他司机等在场，请让他们在凭证上签字确认异常情况属实。" }
    ]
  };

  var FOLLOW_ITEMS = {
    "箱温偏高": [
      "核查运输全程温度记录曲线，确认箱温偏高发生时段",
      "排查制冷机组是否存在故障，安排检修",
      "核实货品损失数量，评估报损金额",
      "确认是否因中途开门不当导致，加强司机培训"
    ],
    "开门时间过长": [
      "核实门店实际等待时长，评估对货品品质的影响",
      "与门店沟通协调卸货排班，避免长时间开门",
      "核查司机是否按操作规范开关车门",
      "如产生货损，根据责任归属进行处理"
    ],
    "温度计损坏": [
      "安排维修或更换货厢内温度计或温度记录设备",
      "核对手持测温数据与机组实际运行状态",
      "确认货品是否因温度异常受损",
      "后续加强运输途中温度监控"
    ],
    "门店等待卸货": [
      "核查门店等待时长是否超过约定标准",
      "与门店沟通改善卸货效率，明确到店卸货流程",
      "向业务端反馈，评估是否收取额外等待费用",
      "确认长时间等待对货品品质的影响"
    ],
    "货品解冻": [
      "核查全程温度记录，确认解冻发生的时间节点",
      "区分运输责任、装卸责任还是客户方责任",
      "统计受损货品数量和金额，启动报损流程",
      "如为运输原因，复盘运输过程中的操作问题"
    ],
    "其他异常": [
      "根据司机说明的具体情况做进一步调查",
      "收集各方证据（照片、签字、记录等）后判定责任",
      "与相关方沟通后续处理方案",
      "总结问题，完善操作规范"
    ]
  };

  var state = {
    selectedScenario: null,
    formData: {},
    completedSteps: [],
    stepTimes: [],
    stepEvidence: {},
    startTime: null,
    voucherNo: null,
    currentStep: 1,
    currentMode: "driver",
    currentViewId: null
  };

  function $(id) { return document.getElementById(id); }

  function getAllRecords() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function saveAllRecords(records) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      showToast("保存失败：" + e.message, "error");
    }
  }

  function addRecord(rec) {
    var all = getAllRecords();
    all.unshift(rec);
    saveAllRecords(all);
    updateBadge();
  }

  function updateRecord(id, patch) {
    var all = getAllRecords();
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === id) {
        for (var k in patch) {
          if (patch.hasOwnProperty(k)) all[i][k] = patch[k];
        }
        saveAllRecords(all);
        return all[i];
      }
    }
    return null;
  }

  function findRecord(id) {
    var all = getAllRecords();
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === id) return all[i];
    }
    return null;
  }

  function initClock() {
    function update() {
      var now = new Date();
      var h = String(now.getHours()).padStart(2, "0");
      var m = String(now.getMinutes()).padStart(2, "0");
      var s = String(now.getSeconds()).padStart(2, "0");
      $("currentTime").textContent = h + ":" + m + ":" + s;
    }
    update();
    setInterval(update, 1000);
  }

  function showToast(msg, type) {
    var toast = $("toast");
    toast.textContent = msg;
    toast.className = "toast show " + (type || "");
    setTimeout(function () {
      toast.className = "toast " + (type || "");
    }, 2200);
  }

  function switchMode(mode) {
    state.currentMode = mode;
    var tabs = document.querySelectorAll(".mode-tab");
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.toggle("active", tabs[i].dataset.mode === mode);
    }
    var panels = document.querySelectorAll(".mode-panel");
    for (var j = 0; j < panels.length; j++) {
      panels[j].classList.toggle("active", panels[j].id === "mode-" + mode);
    }
    if (mode === "board") refreshBoard();
    if (mode === "history") runQuery();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function switchStep(step) {
    state.currentStep = step;
    var windows = document.querySelectorAll(".window");
    for (var i = 0; i < windows.length; i++) windows[i].classList.remove("active");
    var navBtns = document.querySelectorAll(".nav-btn");
    for (var j = 0; j < navBtns.length; j++) navBtns[j].classList.remove("active");
    $("window" + step).classList.add("active");
    var sel = document.querySelector('.nav-btn[data-step="' + step + '"]');
    if (sel) sel.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function formatTime(date) {
    var h = String(date.getHours()).padStart(2, "0");
    var m = String(date.getMinutes()).padStart(2, "0");
    var s = String(date.getSeconds()).padStart(2, "0");
    return h + ":" + m + ":" + s;
  }

  function formatDateTime(date) {
    var y = date.getFullYear();
    var mo = String(date.getMonth() + 1).padStart(2, "0");
    var d = String(date.getDate()).padStart(2, "0");
    return y + "-" + mo + "-" + d + " " + formatTime(date);
  }

  function formatDate(date) {
    var y = date.getFullYear();
    var mo = String(date.getMonth() + 1).padStart(2, "0");
    var d = String(date.getDate()).padStart(2, "0");
    return y + "-" + mo + "-" + d;
  }

  function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }

  function initScenarioSelection() {
    var cards = document.querySelectorAll(".scenario-card");
    for (var i = 0; i < cards.length; i++) {
      cards[i].addEventListener("click", function () {
        for (var j = 0; j < cards.length; j++) cards[j].classList.remove("selected");
        this.classList.add("selected");
        state.selectedScenario = this.dataset.scenario;
      });
    }
  }

  function validateStep1() {
    if (!state.selectedScenario) {
      showToast("请先选择一个异常场景！", "error");
      return false;
    }
    var plate = $("plateNo").value.trim();
    var goods = $("goodsType").value.trim();
    var driver = $("driverName").value.trim();
    var store = $("storeName").value.trim();
    var curTemp = $("currentTemp").value.trim();
    var reqTemp = $("requiredTemp").value.trim();

    if (!plate) { showToast("请填写车牌号！", "error"); $("plateNo").focus(); return false; }
    if (!goods) { showToast("请填写货品种类！", "error"); $("goodsType").focus(); return false; }
    if (!driver) { showToast("请填写司机姓名！", "error"); $("driverName").focus(); return false; }
    if (!store) { showToast("请填写到达门店！", "error"); $("storeName").focus(); return false; }
    if (curTemp === "") { showToast("请填写当前温度！温度是凭证重要依据，不能留空。", "error"); $("currentTemp").focus(); return false; }
    if (reqTemp === "") { showToast("请填写要求温度！温度是凭证重要依据，不能留空。", "error"); $("requiredTemp").focus(); return false; }

    state.formData = {
      plateNo: plate,
      goodsType: goods,
      currentTemp: curTemp,
      requiredTemp: reqTemp,
      driverName: driver,
      storeName: store,
      remark: $("remark").value.trim()
    };
    return true;
  }

  function goToStep2() {
    if (!validateStep1()) return;
    state.startTime = new Date();
    state.completedSteps = [];
    state.stepTimes = [];
    state.stepEvidence = {};
    $("currentScenario").textContent = state.selectedScenario;
    renderSteps();
    updateStep3Button();
    switchStep(2);
    showToast("请按下方步骤依次操作", "success");
  }

  function renderSteps() {
    var container = $("stepsContainer");
    var steps = STEP_DEFS[state.selectedScenario] || STEP_DEFS["其他异常"];
    container.innerHTML = "";
    for (var i = 0; i < steps.length; i++) {
      var step = steps[i];
      var evidence = state.stepEvidence[i] || { photo: "", contactTime: "", staff: "" };
      var div = document.createElement("div");
      div.className = "step-item";
      div.dataset.index = i;
      div.innerHTML =
        '<div class="step-main">' +
        '  <div class="step-check" data-index="' + i + '">&#10003;</div>' +
        '  <div class="step-content">' +
        '    <div class="step-title"><span class="step-num">步骤 ' + (i + 1) + '</span>' + step.title + '</div>' +
        '    <div class="step-desc">' + step.desc + '</div>' +
        '    <div class="step-time">完成时间：<span class="st-ts"></span></div>' +
        '  </div>' +
        '</div>' +
        '<div class="step-evidence">' +
        '  <div class="evidence-title">&#128221; 留存本步证据（填一项即可，尽量完整）</div>' +
        '  <div class="evidence-grid">' +
        '    <div class="ev-item"><label>照片文件名</label><input type="text" class="ev-photo" data-step="' + i + '" placeholder="如 IMG_20260621_1530.jpg" value="' + (evidence.photo || "") + '"></div>' +
        '    <div class="ev-item"><label>联系调度时间</label><input type="text" class="ev-contact" data-step="' + i + '" placeholder="如 15:32 接通 张调度" value="' + (evidence.contactTime || "") + '"></div>' +
        '    <div class="ev-item"><label>门店人员姓名</label><input type="text" class="ev-staff" data-step="' + i + '" placeholder="如 李主管/收货员王师傅" value="' + (evidence.staff || "") + '"></div>' +
        '  </div>' +
        '</div>';
      container.appendChild(div);
    }
    var activeIdx = findNextActiveIndex();
    if (activeIdx !== -1 && container.children[activeIdx]) {
      container.children[activeIdx].classList.add("active");
    }
    for (var k = 0; k < state.completedSteps.length; k++) {
      markStepDone(state.completedSteps[k], state.stepTimes[k] ? state.stepTimes[k].time : new Date(), false);
    }
    var checks = document.querySelectorAll(".step-check");
    for (var m = 0; m < checks.length; m++) {
      checks[m].addEventListener("click", function () {
        var idx = parseInt(this.dataset.index);
        toggleStep(idx);
      });
    }
    bindEvidenceInputs();
  }

  function bindEvidenceInputs() {
    var fields = ["photo", "contact", "staff"];
    var cls = ["ev-photo", "ev-contact", "ev-staff"];
    for (var c = 0; c < cls.length; c++) {
      var inputs = document.querySelectorAll("." + cls[c]);
      for (var i = 0; i < inputs.length; i++) {
        (function (input, fieldName) {
          input.addEventListener("input", function () {
            var idx = parseInt(input.dataset.step);
            if (!state.stepEvidence[idx]) state.stepEvidence[idx] = {};
            state.stepEvidence[idx][fieldName] = input.value.trim();
          });
        })(inputs[i], fields[c]);
      }
    }
  }

  function findNextActiveIndex() {
    var steps = STEP_DEFS[state.selectedScenario] || STEP_DEFS["其他异常"];
    for (var i = 0; i < steps.length; i++) {
      if (state.completedSteps.indexOf(i) < 0) return i;
    }
    return -1;
  }

  function markStepDone(index, time, record) {
    var items = document.querySelectorAll(".step-item");
    if (!items[index]) return;
    items[index].classList.add("done");
    var ts = items[index].querySelector(".st-ts");
    if (ts) ts.textContent = formatTime(time);
    if (record !== false) {
      // noop - handled by caller
    }
  }

  function toggleStep(index) {
    var items = document.querySelectorAll(".step-item");
    var pos = state.completedSteps.indexOf(index);
    if (pos >= 0) {
      state.completedSteps.splice(pos, 1);
      state.stepTimes.splice(pos, 1);
      items[index].classList.remove("done");
      var ts = items[index].querySelector(".st-ts");
      if (ts) ts.textContent = "";
    } else {
      var now = new Date();
      state.completedSteps.push(index);
      state.stepTimes.push({ index: index, time: now });
      markStepDone(index, now);
    }
    var allItems = document.querySelectorAll(".step-item");
    for (var i = 0; i < allItems.length; i++) allItems[i].classList.remove("active");
    var activeIdx = findNextActiveIndex();
    if (activeIdx !== -1 && allItems[activeIdx]) {
      allItems[activeIdx].classList.add("active");
    }
    updateStep3Button();
  }

  function updateStep3Button() {
    var steps = STEP_DEFS[state.selectedScenario] || STEP_DEFS["其他异常"];
    var allDone = state.completedSteps.length >= steps.length;
    $("toStep3").disabled = !allDone;
  }

  function goToStep3() {
    var steps = STEP_DEFS[state.selectedScenario] || STEP_DEFS["其他异常"];
    if (state.completedSteps.length < steps.length) {
      showToast("请完成所有处置步骤！", "error");
      return;
    }
    // 收集证据
    collectEvidenceFromDom();
    var rec = generateVoucher();
    persistVoucher(rec);
    switchStep(3);
    showToast("凭证已生成并自动存入本机记录", "success");
  }

  function collectEvidenceFromDom() {
    var photoInputs = document.querySelectorAll(".ev-photo");
    var contactInputs = document.querySelectorAll(".ev-contact");
    var staffInputs = document.querySelectorAll(".ev-staff");
    for (var i = 0; i < photoInputs.length; i++) {
      var idx = parseInt(photoInputs[i].dataset.step);
      if (!state.stepEvidence[idx]) state.stepEvidence[idx] = {};
      state.stepEvidence[idx].photo = photoInputs[i].value.trim();
    }
    for (var j = 0; j < contactInputs.length; j++) {
      var idx2 = parseInt(contactInputs[j].dataset.step);
      if (!state.stepEvidence[idx2]) state.stepEvidence[idx2] = {};
      state.stepEvidence[idx2].contactTime = contactInputs[j].value.trim();
    }
    for (var k = 0; k < staffInputs.length; k++) {
      var idx3 = parseInt(staffInputs[k].dataset.step);
      if (!state.stepEvidence[idx3]) state.stepEvidence[idx3] = {};
      state.stepEvidence[idx3].staff = staffInputs[k].value.trim();
    }
  }

  function generateVoucherNo() {
    var now = new Date();
    var y = now.getFullYear();
    var mo = String(now.getMonth() + 1).padStart(2, "0");
    var d = String(now.getDate()).padStart(2, "0");
    var h = String(now.getHours()).padStart(2, "0");
    var mi = String(now.getMinutes()).padStart(2, "0");
    var rand = String(Math.floor(Math.random() * 9000) + 1000);
    return "LL" + y + mo + d + h + mi + rand;
  }

  function buildTimelineData() {
    var result = [];
    result.push({
      time: formatTime(state.startTime),
      text: "【到站登记】车牌号" + state.formData.plateNo + "到达" + (state.formData.storeName || "门店") + "，发现异常类型：" + state.selectedScenario,
      evidence: null
    });
    var steps = STEP_DEFS[state.selectedScenario] || STEP_DEFS["其他异常"];
    var sortedTimes = state.stepTimes.slice().sort(function (a, b) { return a.time - b.time; });
    for (var i = 0; i < sortedTimes.length; i++) {
      var st = sortedTimes[i];
      var ev = state.stepEvidence[st.index] || null;
      result.push({
        time: formatTime(st.time),
        text: "【处置完成】" + steps[st.index].title,
        evidence: ev
      });
    }
    result.push({
      time: formatTime(new Date()),
      text: "【凭证生成】司机完成全部处置步骤，生成异常处置凭证",
      evidence: null
    });
    return result;
  }

  function buildDriverNoteWithEvidence() {
    var parts = [];
    if (state.formData.remark) parts.push("【司机说明】" + state.formData.remark);
    var steps = STEP_DEFS[state.selectedScenario] || STEP_DEFS["其他异常"];
    var hasEv = false;
    var evLines = [];
    for (var i = 0; i < steps.length; i++) {
      var ev = state.stepEvidence[i];
      if (!ev) continue;
      var items = [];
      if (ev.photo) items.push("照片：" + ev.photo);
      if (ev.contactTime) items.push("联系调度：" + ev.contactTime);
      if (ev.staff) items.push("门店人员：" + ev.staff);
      if (items.length > 0) {
        hasEv = true;
        evLines.push("步骤" + (i + 1) + " " + steps[i].title + " - " + items.join(" / "));
      }
    }
    if (hasEv) {
      parts.push("【现场证据】" + evLines.join("；"));
    }
    return parts.length ? parts.join("\n") : "司机未填写特别说明。";
  }

  function generateVoucher() {
    state.voucherNo = generateVoucherNo();
    $("voucherNo").textContent = state.voucherNo;
    $("v_plate").textContent = state.formData.plateNo || "-";
    $("v_driver").textContent = state.formData.driverName || "-";
    $("v_store").textContent = state.formData.storeName || "-";
    $("v_goods").textContent = state.formData.goodsType || "-";
    $("v_temp").textContent = state.formData.currentTemp ? state.formData.currentTemp + "\u2103" : "-";
    $("v_reqTemp").textContent = state.formData.requiredTemp ? state.formData.requiredTemp + "\u2103" : "-";
    $("v_scenario").textContent = state.selectedScenario || "-";

    var tl = $("timeline");
    tl.innerHTML = "";
    var tlData = buildTimelineData();
    for (var t = 0; t < tlData.length; t++) {
      var item = tlData[t];
      var row = document.createElement("div");
      row.className = "timeline-item";
      var html = '<div class="tl-time">' + item.time + '</div><div class="tl-text">' + item.text;
      if (item.evidence) {
        var evItems = [];
        if (item.evidence.photo) evItems.push("照片文件：" + item.evidence.photo);
        if (item.evidence.contactTime) evItems.push("联系调度：" + item.evidence.contactTime);
        if (item.evidence.staff) evItems.push("门店人员：" + item.evidence.staff);
        if (evItems.length) html += '<div class="tl-ev">' + evItems.join("  |  ") + '</div>';
      }
      html += '</div>';
      row.innerHTML = html;
      tl.appendChild(row);
    }
    $("v_remark").textContent = buildDriverNoteWithEvidence();

    var follow = FOLLOW_ITEMS[state.selectedScenario] || FOLLOW_ITEMS["其他异常"];
    var fl = $("followList");
    fl.innerHTML = "";
    for (var f = 0; f < follow.length; f++) {
      var li = document.createElement("li");
      li.textContent = follow[f];
      fl.appendChild(li);
    }

    var nowTime = new Date();
    $("voucherTime").textContent = formatDate(nowTime) + " " + formatTime(nowTime);

    var record = {
      id: state.voucherNo,
      voucherNo: state.voucherNo,
      createdAt: nowTime.getTime(),
      createdAtStr: formatDateTime(nowTime),
      dateStr: formatDate(nowTime),
      plateNo: state.formData.plateNo,
      driverName: state.formData.driverName,
      storeName: state.formData.storeName,
      goodsType: state.formData.goodsType,
      currentTemp: state.formData.currentTemp,
      requiredTemp: state.formData.requiredTemp,
      scenario: state.selectedScenario,
      remark: state.formData.remark,
      stepEvidence: state.stepEvidence,
      stepTimes: state.stepTimes.map(function (s) { return { index: s.index, time: s.time.getTime() }; }),
      startTime: state.startTime.getTime(),
      followStatus: "pending",
      followedAt: null,
      fullNote: buildDriverNoteWithEvidence(),
      timeline: tlData
    };
    return record;
  }

  function persistVoucher(rec) {
    var existing = findRecord(rec.id);
    if (!existing) addRecord(rec);
    return rec;
  }

  function buildVoucherHTML(rec) {
    var steps = STEP_DEFS[rec.scenario] || STEP_DEFS["其他异常"];
    var follow = FOLLOW_ITEMS[rec.scenario] || FOLLOW_ITEMS["其他异常"];
    var evSummaryLines = [];
    for (var i = 0; i < steps.length; i++) {
      var ev = rec.stepEvidence ? rec.stepEvidence[i] : null;
      if (!ev) continue;
      var items = [];
      if (ev.photo) items.push("照片：" + ev.photo);
      if (ev.contactTime) items.push("联系调度：" + ev.contactTime);
      if (ev.staff) items.push("门店人员：" + ev.staff);
      if (items.length) evSummaryLines.push("步骤" + (i + 1) + " " + steps[i].title + " - " + items.join(" / "));
    }
    var driverNote = "";
    if (rec.remark) driverNote += "【司机说明】" + rec.remark;
    if (evSummaryLines.length) {
      if (driverNote) driverNote += "\n";
      driverNote += "【现场证据】" + evSummaryLines.join("；");
    }
    if (!driverNote) driverNote = "司机未填写特别说明。";

    var tlHTML = "";
    for (var t = 0; t < rec.timeline.length; t++) {
      var itm = rec.timeline[t];
      var evHtml = "";
      if (itm.evidence) {
        var bits = [];
        if (itm.evidence.photo) bits.push("照片文件：" + itm.evidence.photo);
        if (itm.evidence.contactTime) bits.push("联系调度：" + itm.evidence.contactTime);
        if (itm.evidence.staff) bits.push("门店人员：" + itm.evidence.staff);
        if (bits.length) evHtml = '<div class="tl-ev">' + bits.join("  |  ") + '</div>';
      }
      tlHTML += '<div class="timeline-item"><div class="tl-time">' + itm.time + '</div><div class="tl-text">' + itm.text + evHtml + '</div></div>';
    }

    var flHTML = "";
    for (var f = 0; f < follow.length; f++) {
      flHTML += "<li>" + follow[f] + "</li>";
    }

    return '<div class="voucher-container"><div class="voucher">' +
      '<div class="voucher-head"><h3>冷链运输温控异常处置凭证</h3><div class="voucher-no">编号：' + rec.voucherNo + '</div></div>' +
      '<div class="voucher-section"><h4>基本信息</h4>' +
      '<div class="info-row"><span>车牌号：</span><b>' + rec.plateNo + '</b></div>' +
      '<div class="info-row"><span>司机姓名：</span><b>' + rec.driverName + '</b></div>' +
      '<div class="info-row"><span>到达门店：</span><b>' + rec.storeName + '</b></div>' +
      '<div class="info-row"><span>货品种类：</span><b>' + rec.goodsType + '</b></div>' +
      '<div class="info-row"><span>当前温度：</span><b>' + (rec.currentTemp ? rec.currentTemp + "\u2103" : "-") + '</b></div>' +
      '<div class="info-row"><span>要求温度：</span><b>' + (rec.requiredTemp ? rec.requiredTemp + "\u2103" : "-") + '</b></div>' +
      '<div class="info-row"><span>异常类型：</span><b>' + rec.scenario + '</b></div>' +
      '<div class="info-row"><span>跟进状态：</span><b>' + (rec.followStatus === "done" ? "已跟进" : "待跟进") + '</b></div>' +
      '</div>' +
      '<div class="voucher-section"><h4>处置时间线（含现场证据）</h4><div class="timeline">' + tlHTML + '</div></div>' +
      '<div class="voucher-section"><h4>现场证据与备注</h4><div class="driver-note">' + driverNote.replace(/\n/g, "<br>") + '</div></div>' +
      '<div class="voucher-section"><h4>需调度跟进事项</h4><ul class="follow-list">' + flHTML + '</ul></div>' +
      '<div class="voucher-sign">' +
      '<div class="sign-box"><div class="sign-label">司机签字：</div><div class="sign-line"></div></div>' +
      '<div class="sign-box"><div class="sign-label">门店签字：</div><div class="sign-line"></div></div>' +
      '<div class="sign-box"><div class="sign-label">调度签字：</div><div class="sign-line"></div></div>' +
      '</div>' +
      '<div class="voucher-foot">本凭证由系统生成，一式三份（司机、门店、调度各一份），本机已留存记录<br>生成时间：' + rec.createdAtStr + '</div>' +
      '</div></div>';
  }

  function printVoucherHTML(html) {
    var w = window.open("", "_blank", "width=900,height=700");
    if (!w) {
      showToast("浏览器阻止了新窗口，请允许弹出窗口后重试", "error");
      return;
    }
    var styles = [
      'body { font-family: "Microsoft YaHei", sans-serif; padding: 40px; background: #fff; color: #1e293b; }',
      '.voucher { max-width: 820px; margin: 0 auto; background: white; border: 2px solid #cbd5e1; border-radius: 12px; padding: 32px 40px; }',
      '.voucher-head { text-align: center; padding-bottom: 18px; border-bottom: 2px solid #334155; margin-bottom: 22px; }',
      '.voucher-head h3 { font-size: 28px; color: #0f172a; margin-bottom: 8px; }',
      '.voucher-no { font-size: 17px; color: #64748b; font-family: Consolas, monospace; }',
      '.voucher-section { margin-bottom: 22px; }',
      '.voucher-section h4 { font-size: 19px; color: #0284c7; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 2px solid #e2e8f0; }',
      '.info-row { display: flex; padding: 7px 0; font-size: 18px; border-bottom: 1px dashed #e2e8f0; }',
      '.info-row:last-child { border-bottom: none; }',
      '.info-row span { width: 130px; color: #475569; flex-shrink: 0; }',
      '.info-row b { color: #0f172a; flex: 1; }',
      '.timeline { padding-left: 6px; }',
      '.timeline-item { display: flex; gap: 14px; padding: 10px 0; border-bottom: 1px dashed #e2e8f0; align-items: flex-start; }',
      '.timeline-item:last-child { border-bottom: none; }',
      '.tl-time { font-family: Consolas, monospace; font-size: 15px; color: #0284c7; background: #e0f2fe; padding: 4px 9px; border-radius: 6px; white-space: nowrap; flex-shrink: 0; font-weight: 600; }',
      '.tl-text { font-size: 17px; color: #1e293b; line-height: 1.6; }',
      '.tl-ev { margin-top: 6px; padding: 6px 10px; background: #f8fafc; border-left: 3px solid #94a3b8; border-radius: 4px; font-size: 14px; color: #475569; line-height: 1.6; }',
      '.driver-note { font-size: 17px; color: #1e293b; background: #fef9c3; padding: 14px 18px; border-radius: 8px; border-left: 4px solid #eab308; line-height: 1.7; min-height: 50px; }',
      '.follow-list { list-style: none; padding: 0; margin: 0; }',
      '.follow-list li { font-size: 17px; color: #991b1b; padding: 8px 0 8px 26px; position: relative; border-bottom: 1px dashed #fecaca; line-height: 1.5; }',
      '.follow-list li:last-child { border-bottom: none; }',
      '.voucher-sign { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 32px; padding-top: 22px; border-top: 2px solid #e2e8f0; }',
      '.sign-box { display: flex; flex-direction: column; gap: 8px; }',
      '.sign-label { font-size: 16px; color: #475569; font-weight: 600; }',
      '.sign-line { height: 40px; border-bottom: 2px solid #334155; }',
      '.voucher-foot { text-align: center; margin-top: 24px; padding-top: 16px; border-top: 2px dashed #94a3b8; font-size: 13px; color: #64748b; line-height: 1.8; }'
    ].join(" ");
    var pageTitle = "冷链异常凭证打印";
    w.document.write("<!DOCTYPE html><html><head><meta charset='UTF-8'><title>" + pageTitle + "</title><style>" + styles + "</style></head><body>" + html + "</body></html>");
    w.document.close();
    setTimeout(function () {
      try { w.print(); } catch (e) {}
    }, 400);
  }

  function printVoucher() {
    window.print();
  }

  function saveVoucherHTML(html, fileName) {
    var fullHTML = "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>" + fileName + "</title></head><body>" + html + "</body></html>";
    var blob = new Blob([fullHTML], { type: "text/html;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function saveVoucher() {
    var html = $("voucher").outerHTML;
    var fileName = "温控异常凭证_" + state.formData.plateNo + "_" + formatDate(new Date()) + ".html";
    saveVoucherHTML(html, fileName);
    showToast("凭证已保存到本地", "success");
  }

  function resetDriverForm() {
    state.selectedScenario = null;
    state.formData = {};
    state.completedSteps = [];
    state.stepTimes = [];
    state.stepEvidence = {};
    state.startTime = null;
    state.voucherNo = null;
    state.currentStep = 1;

    var cards = document.querySelectorAll(".scenario-card");
    for (var i = 0; i < cards.length; i++) cards[i].classList.remove("selected");
    var ids = ["plateNo", "goodsType", "currentTemp", "requiredTemp", "driverName", "storeName", "remark"];
    for (var j = 0; j < ids.length; j++) {
      var el = $(ids[j]);
      if (el) el.value = "";
    }
    switchStep(1);
    switchMode("driver");
    showToast("已清空，可开始新的登记", "success");
  }

  function updateBadge() {
    var all = getAllRecords();
    var today = new Date();
    var cnt = 0;
    for (var i = 0; i < all.length; i++) {
      if (isSameDay(new Date(all[i].createdAt), today)) cnt++;
    }
    $("todayBadge").textContent = cnt;
  }

  function refreshBoard() {
    var all = getAllRecords();
    var today = new Date();
    var todays = [];
    for (var i = 0; i < all.length; i++) {
      if (isSameDay(new Date(all[i].createdAt), today)) todays.push(all[i]);
    }
    $("boardDateTip").textContent = formatDate(today) + " 统计概览";
    $("statTotal").textContent = todays.length;

    var counts = { "箱温偏高": 0, "开门时间过长": 0, "温度计损坏": 0, "门店等待卸货": 0, "货品解冻": 0, "其他异常": 0 };
    var pending = [];
    for (var j = 0; j < todays.length; j++) {
      var r = todays[j];
      if (counts.hasOwnProperty(r.scenario)) counts[r.scenario]++;
      else counts["其他异常"]++;
      if (r.followStatus !== "done") pending.push(r);
    }
    $("statHot").textContent = counts["箱温偏高"];
    $("statDoor").textContent = counts["开门时间过长"];
    $("statWait").textContent = counts["门店等待卸货"];
    $("statThaw").textContent = counts["货品解冻"];
    $("statOther").textContent = counts["温度计损坏"] + counts["其他异常"];

    var pendingList = $("pendingList");
    pendingList.innerHTML = "";
    if (pending.length === 0) {
      pendingList.innerHTML = '<div class="empty-state">暂无未跟进事项，做得不错！</div>';
    } else {
      for (var p = 0; p < pending.length; p++) {
        pendingList.appendChild(buildRecordRow(pending[p], true));
      }
    }

    var recentList = $("recentList");
    recentList.innerHTML = "";
    var recent = todays.slice(0, 8);
    if (recent.length === 0) {
      recentList.innerHTML = '<div class="empty-state">今日还没有异常登记</div>';
    } else {
      for (var k = 0; k < recent.length; k++) {
        recentList.appendChild(buildRecordRow(recent[k], false));
      }
    }
    updateBadge();
  }

  function buildRecordRow(rec, isPending) {
    var div = document.createElement("div");
    div.className = "record-item " + (rec.followStatus === "done" ? "done" : "pending");
    div.innerHTML =
      '<div class="record-time">' + rec.createdAtStr.substring(5) + '</div>' +
      '<div class="record-plate">' + rec.plateNo + '</div>' +
      '<span class="record-scenario">' + rec.scenario + '</span>' +
      '<div class="record-store">' + rec.storeName + '</div>' +
      '<div class="record-driver">' + rec.driverName + '</div>' +
      '<div class="record-status ' + (rec.followStatus === "done" ? "done" : "pending") + '">' + (rec.followStatus === "done" ? "已跟进" : "待跟进") + '</div>' +
      '<div style="margin-left:auto;"><button class="small-btn primary" data-id="' + rec.id + '">查看</button></div>';
    var btn = div.querySelector("button");
    btn.addEventListener("click", function () {
      openViewModal(rec.id);
    });
    return div;
  }

  function runQuery() {
    var qPlate = $("q_plate").value.trim();
    var qStore = $("q_store").value.trim();
    var qScenario = $("q_scenario").value;
    var qFrom = $("q_dateFrom").value;
    var qTo = $("q_dateTo").value;

    var all = getAllRecords();
    var list = [];
    for (var i = 0; i < all.length; i++) {
      var r = all[i];
      if (qPlate && r.plateNo && r.plateNo.indexOf(qPlate) < 0) continue;
      if (qStore && r.storeName && r.storeName.indexOf(qStore) < 0) continue;
      if (qScenario && r.scenario !== qScenario) continue;
      if (qFrom) {
        var fromTs = new Date(qFrom + "T00:00:00").getTime();
        if (r.createdAt < fromTs) continue;
      }
      if (qTo) {
        var toTs = new Date(qTo + "T23:59:59").getTime();
        if (r.createdAt > toTs) continue;
      }
      list.push(r);
    }
    $("resultCount").textContent = "共 " + list.length + " 条";
    var tbody = $("historyBody");
    tbody.innerHTML = "";
    $("emptyHistory").style.display = list.length === 0 ? "block" : "none";
    $("historyTable").style.display = list.length === 0 ? "none" : "";
    for (var j = 0; j < list.length; j++) {
      tbody.appendChild(buildHistoryRow(list[j]));
    }
  }

  function buildHistoryRow(rec) {
    var tr = document.createElement("tr");
    tr.innerHTML =
      '<td>' + rec.createdAtStr.substring(0, 16) + '</td>' +
      '<td><b>' + rec.plateNo + '</b></td>' +
      '<td>' + rec.driverName + '</td>' +
      '<td>' + rec.storeName + '</td>' +
      '<td><span class="scenario-tag ' + rec.scenario + '">' + rec.scenario + '</span></td>' +
      '<td>' + (rec.currentTemp ? rec.currentTemp + "\u2103" : "-") + '</td>' +
      '<td><span class="status-tag ' + (rec.followStatus === "done" ? "done" : "pending") + '">' + (rec.followStatus === "done" ? "已跟进" : "待跟进") + '</span></td>' +
      '<td><div class="table-ops"><button class="small-btn primary" data-act="view" data-id="' + rec.id + '">查看</button><button class="small-btn danger" data-act="del" data-id="' + rec.id + '">删除</button></div></td>';
    var btns = tr.querySelectorAll("button");
    for (var i = 0; i < btns.length; i++) {
      (function (b) {
        b.addEventListener("click", function () {
          var id = b.dataset.id;
          var act = b.dataset.act;
          if (act === "view") openViewModal(id);
          else if (act === "del") deleteRecord(id);
        });
      })(btns[i]);
    }
    return tr;
  }

  function deleteRecord(id) {
    if (!confirm("确定删除这条凭证记录吗？此操作不可恢复。")) return;
    var all = getAllRecords();
    var left = [];
    for (var i = 0; i < all.length; i++) {
      if (all[i].id !== id) left.push(all[i]);
    }
    saveAllRecords(left);
    showToast("已删除", "success");
    runQuery();
    updateBadge();
  }

  function openViewModal(id) {
    var rec = findRecord(id);
    if (!rec) { showToast("记录不存在", "error"); return; }
    state.currentViewId = id;
    $("modalTitle").textContent = "凭证详情 - " + rec.voucherNo;
    $("modalBody").innerHTML = buildVoucherHTML(rec);
    $("viewModal").classList.add("show");
    var doneBtn = $("modalDone");
    if (rec.followStatus === "done") {
      doneBtn.textContent = "\u2713 已跟进（取消）";
    } else {
      doneBtn.textContent = "\u2713 标记已跟进";
    }
  }

  function closeModal() {
    $("viewModal").classList.remove("show");
    state.currentViewId = null;
  }

  function markCurrentViewDone() {
    if (!state.currentViewId) return;
    var rec = findRecord(state.currentViewId);
    if (!rec) return;
    var newStatus = rec.followStatus === "done" ? "pending" : "done";
    updateRecord(state.currentViewId, { followStatus: newStatus, followedAt: newStatus === "done" ? Date.now() : null });
    showToast(newStatus === "done" ? "已标记为已跟进" : "已取消跟进标记", "success");
    openViewModal(state.currentViewId);
    if (state.currentMode === "board") refreshBoard();
    if (state.currentMode === "history") runQuery();
  }

  function modalPrint() {
    if (!state.currentViewId) return;
    var rec = findRecord(state.currentViewId);
    if (!rec) return;
    var html = buildVoucherHTML(rec);
    printVoucherHTML(html);
  }

  function modalSave() {
    if (!state.currentViewId) return;
    var rec = findRecord(state.currentViewId);
    if (!rec) return;
    var html = buildVoucherHTML(rec);
    var fileName = "温控异常凭证_" + rec.plateNo + "_" + rec.dateStr + ".html";
    saveVoucherHTML(html, fileName);
    showToast("凭证已保存到本地", "success");
  }

  function resetQuery() {
    $("q_plate").value = "";
    $("q_store").value = "";
    $("q_scenario").value = "";
    $("q_dateFrom").value = "";
    $("q_dateTo").value = "";
    runQuery();
  }

  function bindEvents() {
    $("toStep2").addEventListener("click", goToStep2);
    $("toStep3").addEventListener("click", goToStep3);
    $("backToStep1").addEventListener("click", function () { switchStep(1); });
    $("backToStep2").addEventListener("click", function () { collectEvidenceFromDom(); switchStep(2); });
    $("printBtn").addEventListener("click", printVoucher);
    $("saveBtn").addEventListener("click", saveVoucher);
    $("newRecordBtn").addEventListener("click", function () {
      if (confirm("开始新的登记将清空当前填写内容，确定吗？")) resetDriverForm();
    });

    var navBtns = document.querySelectorAll(".nav-btn");
    for (var n = 0; n < navBtns.length; n++) {
      navBtns[n].addEventListener("click", function () {
        var target = parseInt(this.dataset.step);
        if (target === 1) switchStep(1);
        else if (target === 2) {
          if (state.selectedScenario && state.formData.plateNo) switchStep(2);
          else showToast("请先完成异常选择！", "error");
        } else if (target === 3) {
          var steps = STEP_DEFS[state.selectedScenario] || STEP_DEFS["其他异常"];
          if (state.completedSteps.length >= steps.length) {
            collectEvidenceFromDom();
            var rec = generateVoucher();
            persistVoucher(rec);
            switchStep(3);
          } else {
            showToast("请先完成处置步骤！", "error");
          }
        }
      });
    }

    var modeTabs = document.querySelectorAll(".mode-tab");
    for (var m = 0; m < modeTabs.length; m++) {
      modeTabs[m].addEventListener("click", function () {
        switchMode(this.dataset.mode);
      });
    }

    $("boardRefresh").addEventListener("click", refreshBoard);

    $("queryBtn").addEventListener("click", runQuery);
    $("resetBtn").addEventListener("click", resetQuery);

    $("modalClose").addEventListener("click", closeModal);
    $("modalCloseBtn").addEventListener("click", closeModal);
    document.querySelector("#viewModal .modal-mask").addEventListener("click", closeModal);
    $("modalPrint").addEventListener("click", modalPrint);
    $("modalSave").addEventListener("click", modalSave);
    $("modalDone").addEventListener("click", markCurrentViewDone);
  }

  function init() {
    initClock();
    initScenarioSelection();
    bindEvents();
    updateBadge();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
