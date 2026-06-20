(function () {
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
    startTime: null,
    voucherNo: null,
    currentStep: 1
  };

  function $(id) { return document.getElementById(id); }

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

  function switchStep(step) {
    state.currentStep = step;
    var windows = document.querySelectorAll(".window");
    for (var i = 0; i < windows.length; i++) windows[i].classList.remove("active");
    var navBtns = document.querySelectorAll(".nav-btn");
    for (var j = 0; j < navBtns.length; j++) navBtns[j].classList.remove("active");
    $("window" + step).classList.add("active");
    document.querySelector('.nav-btn[data-step="' + step + '"]').classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function formatTime(date) {
    var h = String(date.getHours()).padStart(2, "0");
    var m = String(date.getMinutes()).padStart(2, "0");
    var s = String(date.getSeconds()).padStart(2, "0");
    return h + ":" + m + ":" + s;
  }

  function formatDate(date) {
    var y = date.getFullYear();
    var mo = String(date.getMonth() + 1).padStart(2, "0");
    var d = String(date.getDate()).padStart(2, "0");
    return y + "-" + mo + "-" + d;
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
    if (!plate) {
      showToast("请填写车牌号！", "error");
      $("plateNo").focus();
      return false;
    }
    if (!goods) {
      showToast("请填写货品种类！", "error");
      $("goodsType").focus();
      return false;
    }
    if (!driver) {
      showToast("请填写司机姓名！", "error");
      $("driverName").focus();
      return false;
    }
    state.formData = {
      plateNo: plate,
      goodsType: goods,
      currentTemp: $("currentTemp").value.trim(),
      requiredTemp: $("requiredTemp").value.trim(),
      driverName: driver,
      storeName: $("storeName").value.trim(),
      remark: $("remark").value.trim()
    };
    return true;
  }

  function goToStep2() {
    if (!validateStep1()) return;
    state.startTime = new Date();
    state.completedSteps = [];
    state.stepTimes = [];
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
      var div = document.createElement("div");
      div.className = "step-item";
      div.dataset.index = i;
      div.innerHTML =
        '<div class="step-check" data-index="' + i + '">✓</div>' +
        '<div class="step-content">' +
        '  <div class="step-title"><span class="step-num">步骤 ' + (i + 1) + '</span>' + step.title + '</div>' +
        '  <div class="step-desc">' + step.desc + '</div>' +
        '  <div class="step-time">完成时间：<span class="st-ts"></span></div>' +
        '</div>';
      container.appendChild(div);
    }
    var activeIdx = findNextActiveIndex();
    if (activeIdx !== -1) {
      container.children[activeIdx].classList.add("active");
    }
    var checks = document.querySelectorAll(".step-check");
    for (var k = 0; k < checks.length; k++) {
      checks[k].addEventListener("click", function () {
        var idx = parseInt(this.dataset.index);
        toggleStep(idx);
      });
    }
  }

  function findNextActiveIndex() {
    var steps = STEP_DEFS[state.selectedScenario] || STEP_DEFS["其他异常"];
    for (var i = 0; i < steps.length; i++) {
      if (state.completedSteps.indexOf(i) < 0) return i;
    }
    return -1;
  }

  function toggleStep(index) {
    var items = document.querySelectorAll(".step-item");
    var pos = state.completedSteps.indexOf(index);
    if (pos >= 0) {
      state.completedSteps.splice(pos, 1);
      state.stepTimes.splice(pos, 1);
      items[index].classList.remove("done");
      items[index].querySelector(".st-ts").textContent = "";
    } else {
      var now = new Date();
      state.completedSteps.push(index);
      state.stepTimes.push({ index: index, time: now });
      items[index].classList.add("done");
      items[index].querySelector(".st-ts").textContent = formatTime(now);
    }
    var allItems = document.querySelectorAll(".step-item");
    for (var i = 0; i < allItems.length; i++) allItems[i].classList.remove("active");
    var activeIdx = findNextActiveIndex();
    if (activeIdx !== -1) {
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
    generateVoucher();
    switchStep(3);
    showToast("凭证已生成，请核对后打印", "success");
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

  function generateVoucher() {
    state.voucherNo = generateVoucherNo();
    $("voucherNo").textContent = state.voucherNo;
    $("v_plate").textContent = state.formData.plateNo || "—";
    $("v_driver").textContent = state.formData.driverName || "—";
    $("v_store").textContent = state.formData.storeName || "—";
    $("v_goods").textContent = state.formData.goodsType || "—";
    $("v_temp").textContent = state.formData.currentTemp ? state.formData.currentTemp + "℃" : "—";
    $("v_reqTemp").textContent = state.formData.requiredTemp ? state.formData.requiredTemp + "℃" : "—";
    $("v_scenario").textContent = state.selectedScenario || "—";

    var tl = $("timeline");
    tl.innerHTML = "";
    var timelineData = buildTimeline();
    for (var i = 0; i < timelineData.length; i++) {
      var t = timelineData[i];
      var row = document.createElement("div");
      row.className = "timeline-item";
      row.innerHTML = '<div class="tl-time">' + t.time + '</div><div class="tl-text">' + t.text + '</div>';
      tl.appendChild(row);
    }
    $("v_remark").textContent = state.formData.remark || "司机未填写特别说明。";

    var follow = FOLLOW_ITEMS[state.selectedScenario] || FOLLOW_ITEMS["其他异常"];
    var fl = $("followList");
    fl.innerHTML = "";
    for (var j = 0; j < follow.length; j++) {
      var li = document.createElement("li");
      li.textContent = follow[j];
      fl.appendChild(li);
    }
    var nowTime = new Date();
    $("voucherTime").textContent = formatDate(nowTime) + " " + formatTime(nowTime);
  }

  function buildTimeline() {
    var result = [];
    result.push({
      time: formatTime(state.startTime),
      text: "【到站登记】车牌号" + state.formData.plateNo + "到达" + (state.formData.storeName || "门店") + "，发现异常类型：" + state.selectedScenario
    });
    var steps = STEP_DEFS[state.selectedScenario] || STEP_DEFS["其他异常"];
    var sortedTimes = state.stepTimes.slice().sort(function (a, b) { return a.time - b.time; });
    for (var i = 0; i < sortedTimes.length; i++) {
      var st = sortedTimes[i];
      result.push({
        time: formatTime(st.time),
        text: "【处置完成】" + steps[st.index].title
      });
    }
    result.push({
      time: formatTime(new Date()),
      text: "【凭证生成】司机完成全部处置步骤，生成异常处置凭证"
    });
    return result;
  }

  function printVoucher() {
    window.print();
  }

  function saveVoucher() {
    var voucherEl = $("voucher");
    var now = new Date();
    var fileName = "温控异常凭证_" + (state.formData.plateNo || "车牌") + "_" + formatDate(now) + ".html";
    var styleTag = document.createElement("style");
    styleTag.textContent = [
      'body { font-family: "Microsoft YaHei", sans-serif; padding: 40px; background: #f5f5f5; color: #1e293b; }',
      '.voucher { max-width: 820px; margin: 0 auto; background: white; border: 2px solid #cbd5e1; border-radius: 12px; padding: 36px 44px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); }',
      '.voucher-head { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #334155; margin-bottom: 24px; }',
      '.voucher-head h3 { font-size: 30px; color: #0f172a; margin-bottom: 10px; }',
      '.voucher-no { font-size: 18px; color: #64748b; font-family: Consolas, monospace; }',
      '.voucher-section { margin-bottom: 24px; }',
      '.voucher-section h4 { font-size: 20px; color: #0284c7; margin-bottom: 14px; padding-bottom: 6px; border-bottom: 2px solid #e2e8f0; }',
      '.info-row { display: flex; padding: 8px 0; font-size: 19px; border-bottom: 1px dashed #e2e8f0; }',
      '.info-row:last-child { border-bottom: none; }',
      '.info-row span { width: 140px; color: #475569; flex-shrink: 0; }',
      '.info-row b { color: #0f172a; flex: 1; }',
      '.timeline { padding-left: 8px; }',
      '.timeline-item { display: flex; gap: 16px; padding: 12px 0; border-bottom: 1px dashed #e2e8f0; align-items: flex-start; }',
      '.timeline-item:last-child { border-bottom: none; }',
      '.tl-time { font-family: Consolas, monospace; font-size: 16px; color: #0284c7; background: #e0f2fe; padding: 4px 10px; border-radius: 6px; white-space: nowrap; flex-shrink: 0; font-weight: 600; }',
      '.tl-text { font-size: 18px; color: #1e293b; line-height: 1.5; }',
      '.driver-note { font-size: 18px; color: #1e293b; background: #fef9c3; padding: 14px 18px; border-radius: 8px; border-left: 4px solid #eab308; line-height: 1.6; min-height: 50px; }',
      '.follow-list { list-style: none; padding: 0; margin: 0; }',
      '.follow-list li { font-size: 18px; color: #991b1b; padding: 10px 0 10px 28px; position: relative; border-bottom: 1px dashed #fecaca; line-height: 1.5; }',
      '.follow-list li:last-child { border-bottom: none; }',
      '.voucher-sign { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 36px; padding-top: 24px; border-top: 2px solid #e2e8f0; }',
      '.sign-box { display: flex; flex-direction: column; gap: 10px; }',
      '.sign-label { font-size: 17px; color: #475569; font-weight: 600; }',
      '.sign-line { height: 44px; border-bottom: 2px solid #334155; }',
      '.voucher-foot { text-align: center; margin-top: 28px; padding-top: 18px; border-top: 2px dashed #94a3b8; font-size: 14px; color: #64748b; line-height: 1.8; }'
    ].join(" ");

    var htmlContent = "<!DOCTYPE html>" +
      '<html lang="zh-CN">' +
      "<head>" +
      '<meta charset="UTF-8">' +
      "<title>温控异常处置凭证 - " + state.voucherNo + "</title>" +
      styleTag.outerHTML +
      "</head>" +
      "<body>" +
      voucherEl.outerHTML +
      "</body>" +
      "</html>";

    var blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("凭证已保存到本地", "success");
  }

  function bindEvents() {
    $("toStep2").addEventListener("click", goToStep2);
    $("toStep3").addEventListener("click", goToStep3);
    $("backToStep1").addEventListener("click", function () { switchStep(1); });
    $("backToStep2").addEventListener("click", function () { switchStep(2); });
    $("printBtn").addEventListener("click", printVoucher);
    $("saveBtn").addEventListener("click", saveVoucher);

    var navBtns = document.querySelectorAll(".nav-btn");
    for (var i = 0; i < navBtns.length; i++) {
      navBtns[i].addEventListener("click", function () {
        var target = parseInt(this.dataset.step);
        if (target === 1) {
          switchStep(1);
        } else if (target === 2) {
          if (state.selectedScenario && state.formData.plateNo) {
            switchStep(2);
          } else {
            showToast("请先完成异常选择！", "error");
          }
        } else if (target === 3) {
          var steps = STEP_DEFS[state.selectedScenario] || STEP_DEFS["其他异常"];
          if (state.completedSteps.length >= steps.length) {
            generateVoucher();
            switchStep(3);
          } else {
            showToast("请先完成处置步骤！", "error");
          }
        }
      });
    }
  }

  function init() {
    initClock();
    initScenarioSelection();
    bindEvents();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
