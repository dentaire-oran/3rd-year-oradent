function getDeviceType() {
  var ua = navigator.userAgent;
  if (/iPad/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return "Tablette";
  if (/Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|webOS|Windows Phone/i.test(ua)) return "Mobile";
  return "PC";
}

function getDeviceModel() {
  var ua = navigator.userAgent;
  if (/iPhone/i.test(ua)) {
    var w = screen.width, h = screen.height;
    if ((w===430&&h===932)||(w===932&&h===430)) return "iPhone 14/15/16 Pro Max";
    if ((w===393&&h===852)||(w===852&&h===393)) return "iPhone 14/15/16 Pro";
    if ((w===390&&h===844)||(w===844&&h===390)) return "iPhone 12/13 Pro";
    if ((w===375&&h===812)||(w===812&&h===375)) return "iPhone X/XS/11 Pro";
    if ((w===375&&h===667)||(w===667&&h===375)) return "iPhone SE/6/7/8";
    return "iPhone";
  }
  if (/iPad/i.test(ua)) return "iPad";
  if (/Android/i.test(ua)) {
    var match = ua.match(/SM-[A-Za-z0-9]+/);
    if (match) return "Samsung " + match[0];
    match = ua.match(/Pixel\s?[0-9A-Za-z]*/);
    if (match) return "Google " + match[0];
    match = ua.match(/(?:OnePlus|OPPO|Xiaomi|Redmi|HUAWEI|realme|motorola|Moto\s?[A-Za-z]+)[\s-]?[A-Za-z0-9]+/);
    if (match) return match[0];
    match = ua.match(/Android\s[0-9.]+\s;\s(.+?)\s?(?:Build|;|\))/);
    if (match && match[1].length > 2) return match[1].trim();
    return "Android Device";
  }
  if (/Windows NT/i.test(ua)) return "PC Windows";
  if (/Macintosh/i.test(ua)) return "Mac";
  return "Appareil inconnu";
}

function getBrowserInfo() {
  var ua = navigator.userAgent;
  var res = "";
  if (/Edg\//i.test(ua)) {
    res = "Edge";
    var v = ua.match(/Edg\/([0-9]+)/);
    if (v) res += " " + v[1];
    return res;
  }
  if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) {
    res = "Chrome";
    var v = ua.match(/Chrome\/([0-9]+)/);
    if (v) res += " " + v[1];
    return res;
  }
  if (/Firefox\//i.test(ua)) {
    res = "Firefox";
    var v = ua.match(/Firefox\/([0-9]+)/);
    if (v) res += " " + v[1];
    return res;
  }
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
    res = "Safari";
    var v = ua.match(/Version\/([0-9]+)/);
    if (v) res += " " + v[1];
    return res;
  }
  if (/SamsungBrowser/i.test(ua)) {
    res = "Samsung Internet";
    var v = ua.match(/SamsungBrowser\/([0-9]+)/);
    if (v) res += " " + v[1];
    return res;
  }
  return "Browser";
}

function getOSInfo() {
  var ua = navigator.userAgent;
  if (/iPhone|iPad/.test(ua)) {
    var ios = ua.match(/OS (\d+_\d+)/);
    if (ios) return "iOS " + ios[1].replace(/_/g, ".");
    return "iOS";
  }
  if (/Android/i.test(ua)) {
    var android = ua.match(/Android\s([0-9.]+)/);
    if (android) return "Android " + android[1];
    return "Android";
  }
  if (/Windows NT/i.test(ua)) {
    var win = ua.match(/Windows NT\s([0-9.]+)/);
    if (win) {
      var ver = win[1];
      var map = {"10.0":"10/11","6.3":"8.1","6.2":"8","6.1":"7"};
      return "Windows " + (map[ver]||ver);
    }
    return "Windows";
  }
  if (/Macintosh/i.test(ua)) {
    var mac = ua.match(/Mac OS X\s([0-9_.]+)/);
    if (mac) return "macOS " + mac[1].replace(/_/g, ".");
    return "macOS";
  }
  return "OS inconnu";
}

function getDeviceFullDescription() {
  return getDeviceType() + " | " + getDeviceModel() + " | " + getBrowserInfo() + " | " + getOSInfo();
}

function getDeviceDisplayString() {
  var t = getDeviceType(), m = getDeviceModel(), b = getBrowserInfo(), o = getOSInfo();
  var icone = t==="Mobile"?"📱":t==="Tablette"?"📲":"💻";
  return icone + " " + m + " (" + o + ", " + b + ")";
}

function getDeviceShortString() {
  return getDeviceType() + ": " + getDeviceModel();
}

async function sha256(msg) {
  var buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(buf)).map(function(b){return b.toString(16).padStart(2,"0");}).join("");
}

function calcMoyModule(emd1, emd2, td, tp) {
  var pts=0, div=0, emdVals=[];
  if (emd1!==null&&emd1!==undefined&&emd1!=="Abs") emdVals.push(parseFloat(emd1));
  if (emd2!==null&&emd2!==undefined&&emd2!=="Abs") emdVals.push(parseFloat(emd2));
  if (emdVals.length>0) { pts+=(emdVals.reduce(function(a,b){return a+b;},0)/emdVals.length)*1; div+=1; }
  if (td!==null&&td!==undefined&&td!=="Abs") { pts+=parseFloat(td)*2; div+=2; }
  if (tp!==null&&tp!==undefined&&tp!=="Abs") { pts+=parseFloat(tp)*2; div+=2; }
  if (div===0) return null;
  return Math.round((pts/div)*10000)/10000;
}

function calcMoyGenerale(et) {
  var total=0, coefs=0;
  MODULES.forEach(function(mod) {
    var moy = et["moy_"+mod.key];
    if (moy!==null&&moy!==undefined&&moy!=="Abs") { var n=parseFloat(moy); if (!isNaN(n)) { total+=n*mod.coef; coefs+=mod.coef; } }
  });
  if (coefs===0) return null;
  return Math.round((total/coefs)*10000)/10000;
}

function t(key) {
  return TRANSLATIONS[currentLang]&&TRANSLATIONS[currentLang][key] ? TRANSLATIONS[currentLang][key] : key;
}

function getGradeBadge(value) {
  if (value === null || value === undefined || value === "Abs") return "";
  var n = parseFloat(value); if (isNaN(n)) return "";
  if (n >= 14) return '<span class="badge badge-gold" style="padding:2px 6px;font-size:0.7rem;margin-left:6px;">' + t("gold") + '</span>';
  if (n >= 13) return '<span class="badge badge-silver" style="padding:2px 6px;font-size:0.7rem;margin-left:6px;">' + t("silver") + '</span>';
  if (n >= 12) return '<span class="badge badge-bronze" style="padding:2px 6px;font-size:0.7rem;margin-left:6px;">' + t("bronze") + '</span>';
  return "";
}

function getRankBadge(rank) {
  if (!rank || rank === "—") return "";
  var r = parseInt(rank); if (isNaN(r)) return "";
  if (r <= 3) return '<span class="badge badge-diamond" style="padding:2px 6px;font-size:0.7rem;margin-left:6px;">' + t("diamond") + '</span>';
  return "";
}

function fn(v) {
  if (v===null||v===undefined) return '<span class="note-abs">—</span>';
  if (v==="Abs") return '<span class="note-abs">Abs</span>';
  var n=parseFloat(v); if (isNaN(n)) return v;
  return n.toFixed(2);
}

function nc(v) {
  if (v==="Abs"||v===null||v===undefined) return "note-abs";
  var n=parseFloat(v); if (isNaN(n)) return "";
  return n<5?"note-bad":n<10?"note-mid":"note-good";
}

function studentHasAllAccess(et) {
  return et && et.peer_view === "ALL";
}

function getPeerAccessInfo(et) {
  if (!et.peer_view) return { label: t("accessNone"), html: '<span style="color:var(--text-muted);font-size:0.82rem;">—</span>', count: 0 };
  if (et.peer_view === "ALL") return { label: "AL", html: '<span class="badge badge-al" style="font-size:0.7rem;padding:2px 8px;">⭐ AL</span>', count: -1 };
  try {
    var pv = JSON.parse(et.peer_view);
    if (Array.isArray(pv) && pv.length > 0) {
      var total = adminData.length || 444;
      return { label: pv.length + "/" + total, html: '<span style="font-family:\'JetBrains Mono\',monospace;font-size:0.82rem;font-weight:700;color:#a5b4fc;">' + pv.length + '<span style="color:var(--text-muted);font-weight:400;">/' + total + '</span></span>', count: pv.length };
    }
  } catch(e) {}
  return { label: t("accessNone"), html: '<span style="color:var(--text-muted);font-size:0.82rem;">—</span>', count: 0 };
}

window.showToast = function (msg, type) {
  type = type || "info";
  var icons = {
    success: "ph-check-circle",
    danger: "ph-x-circle",
    warning: "ph-warning",
    info: "ph-info"
  };
  var colors = {
    success: "var(--success)",
    danger: "var(--danger)",
    warning: "var(--warning)",
    info: "#a5b4fc"
  };

  var container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    document.body.appendChild(container);
  }

  var toast = document.createElement("div");
  toast.className = "toast-item " + type;
  toast.innerHTML =
    '<i class="ph-fill ' +
    icons[type] +
    '" style="color:' +
    colors[type] +
    ';"></i>' +
    msg;

  container.appendChild(toast);

  setTimeout(function () {
    toast.classList.add("show");
  }, 20);

  setTimeout(function () {
    toast.classList.remove("show");
    setTimeout(function () {
      if (toast.parentNode) toast.remove();
    }, 500);
  }, 4000);
};

window.showConfirm = function (message) {
  return new Promise(function (resolve) {
    var modal = document.getElementById("confirmModal");
    var msg = document.getElementById("confirmMsg");
    var okBtn = document.getElementById("confirmOk");
    var cancelBtn = document.getElementById("confirmCancel");

    msg.textContent = message;
    modal.classList.remove("hidden");

    function cleanup() {
      modal.classList.add("hidden");
      okBtn.removeEventListener("click", onOk);
      cancelBtn.removeEventListener("click", onCancel);
    }

    function onOk() { cleanup(); resolve(true); }
    function onCancel() { cleanup(); resolve(false); }

    okBtn.addEventListener("click", onOk);
    cancelBtn.addEventListener("click", onCancel);
  });
};
