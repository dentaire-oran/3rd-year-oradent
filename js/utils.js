function getDeviceType() {
  var ua = navigator.userAgent;
  if (/iPad/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return "Tablette";
  if (/Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|webOS|Windows Phone/i.test(ua)) return "Mobile";
  return "PC";
}

function getDeviceModel() {
  var ua = navigator.userAgent;
  var w = screen.width, h = screen.height;
  var dpr = window.devicePixelRatio || 1;
  // ---------- iPhone ----------
  if (/iPhone/i.test(ua)) {
    // iPhone 14/15/16 Pro Max (430x932)
    if ((w===430 && h===932) || (w===932 && h===430)) {
      // On ne peut pas distinguer 14/15/16 Pro Max uniquement par résolution, on renvoie la plage
      return "iPhone 14/15/16 Pro Max";
    }
    // iPhone 14/15/16 Pro (393x852)
    if ((w===393 && h===852) || (w===852 && h===393)) {
      return "iPhone 14/15/16 Pro";
    }
    // iPhone 14/15/16 (390x844)
    if ((w===390 && h===844) || (w===844 && h===390)) {
      return "iPhone 14/15/16";
    }
    // iPhone 12/13 Pro Max (428x926)
    if ((w===428 && h===926) || (w===926 && h===428)) {
      return "iPhone 12/13 Pro Max";
    }
    // iPhone 12/13 Pro (390x844) → déjà couvert
    // iPhone 12/13 (390x844) → même résolution, mais on pourrait affiner avec dpr
    // iPhone 11 Pro Max / XS Max (414x896)
    if ((w===414 && h===896) || (w===896 && h===414)) {
      return "iPhone 11 Pro Max / XS Max";
    }
    // iPhone XR / 11 (414x896)
    // iPhone X / XS / 11 Pro (375x812)
    if ((w===375 && h===812) || (w===812 && h===375)) {
      return "iPhone X / XS / 11 Pro";
    }
    // iPhone 6/7/8 Plus (414x736)
    if ((w===414 && h===736) || (w===736 && h===414)) {
      return "iPhone 6/7/8 Plus";
    }
    // iPhone 6/7/8 / SE 2/3 (375x667)
    if ((w===375 && h===667) || (w===667 && h===375)) {
      return "iPhone 6/7/8 / SE 2/3";
    }
    // iPhone 5 / SE 1 (320x568)
    if ((w===320 && h===568) || (w===568 && h===320)) {
      return "iPhone 5 / SE 1";
    }
    return "iPhone (résolution " + w + "x" + h + ")";
  }
  // ---------- iPad ----------
  if (/iPad/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) {
    // iPad Pro 12.9" (1024x1366)
    if ((w===1024 && h===1366) || (w===1366 && h===1024)) {
      return "iPad Pro 12.9\"";
    }
    // iPad Pro 11" / iPad Air (834x1112 ou 820x1180...)
    if ((w===834 && h===1112) || (w===1112 && h===834)) {
      return "iPad Pro 11\" / iPad Air";
    }
    if ((w===820 && h===1180) || (w===1180 && h===820)) {
      return "iPad 10.9\" (10th gen)";
    }
    // iPad 10.2" (810x1080)
    if ((w===810 && h===1080) || (w===1080 && h===810)) {
      return "iPad 10.2\"";
    }
    // iPad Mini (768x1024)
    if ((w===768 && h===1024) || (w===1024 && h===768)) {
      return "iPad Mini";
    }
    return "iPad (résolution " + w + "x" + h + ")";
  }
  // ---------- Android mobiles ----------
  if (/Android/i.test(ua)) {
    // Samsung Galaxy S Ultra (ex S26 Ultra, S25 Ultra...)
    if (/SM-S938/i.test(ua)) return "Samsung Galaxy S25 Ultra";
    if (/SM-S931/i.test(ua)) return "Samsung Galaxy S25";
    if (/SM-S928/i.test(ua)) return "Samsung Galaxy S24 Ultra";
    if (/SM-S921/i.test(ua)) return "Samsung Galaxy S24";
    if (/SM-S918/i.test(ua)) return "Samsung Galaxy S23 Ultra";
    if (/SM-S911/i.test(ua)) return "Samsung Galaxy S23";
    if (/SM-S908/i.test(ua)) return "Samsung Galaxy S22 Ultra";
    if (/SM-S901/i.test(ua)) return "Samsung Galaxy S22";
    // Samsung Galaxy Z Fold / Flip
    if (/SM-F956/i.test(ua)) return "Samsung Galaxy Z Fold 6";
    if (/SM-F741/i.test(ua)) return "Samsung Galaxy Z Flip 6";
    if (/SM-F946/i.test(ua)) return "Samsung Galaxy Z Fold 5";
    if (/SM-F731/i.test(ua)) return "Samsung Galaxy Z Flip 5";
    // Samsung Galaxy A series
    if (/SM-A556/i.test(ua)) return "Samsung Galaxy A55";
    if (/SM-A546/i.test(ua)) return "Samsung Galaxy A54";
    // Google Pixel
    if (/Pixel 10 Pro XL/i.test(ua)) return "Google Pixel 10 Pro XL";
    if (/Pixel 10 Pro/i.test(ua)) return "Google Pixel 10 Pro";
    if (/Pixel 10/i.test(ua)) return "Google Pixel 10";
    if (/Pixel 9 Pro XL/i.test(ua)) return "Google Pixel 9 Pro XL";
    if (/Pixel 9 Pro/i.test(ua)) return "Google Pixel 9 Pro";
    if (/Pixel 9/i.test(ua)) return "Google Pixel 9";
    if (/Pixel 8 Pro/i.test(ua)) return "Google Pixel 8 Pro";
    if (/Pixel 8/i.test(ua)) return "Google Pixel 8";
    if (/Pixel 7 Pro/i.test(ua)) return "Google Pixel 7 Pro";
    if (/Pixel 7/i.test(ua)) return "Google Pixel 7";
    // OnePlus
    if (/OnePlus 12/i.test(ua)) return "OnePlus 12";
    if (/OnePlus 11/i.test(ua)) return "OnePlus 11";
    if (/OnePlus Nord/i.test(ua)) return "OnePlus Nord";
    // Xiaomi / Redmi / POCO
    if (/Xiaomi/i.test(ua)) {
      var xm = ua.match(/Xiaomi\s?([\w\s]+?)(?:\)|;|Build)/i);
      if (xm) return "Xiaomi " + xm[1].trim();
      xm = ua.match(/MIX\s[\w]+/i);
      if (xm) return "Xiaomi " + xm[0];
      return "Xiaomi (modèle non identifié)";
    }
    if (/Redmi/i.test(ua)) {
      var rm = ua.match(/Redmi\s?([\w\s]+?)(?:\)|;|Build)/i);
      if (rm) return "Redmi " + rm[1].trim();
      return "Redmi (modèle non identifié)";
    }
    if (/POCO/i.test(ua)) {
      var po = ua.match(/POCO\s?([\w\s]+?)(?:\)|;|Build)/i);
      if (po) return "POCO " + po[1].trim();
      return "POCO (modèle non identifié)";
    }
    // Huawei
    if (/HUAWEI/i.test(ua)) {
      var hw = ua.match(/HUAWEI\s?([\w\s-]+?)(?:\)|;|Build)/i);
      if (hw) return "Huawei " + hw[1].trim();
      return "Huawei (modèle non identifié)";
    }
    // Oppo
    if (/OPPO/i.test(ua)) {
      var op = ua.match(/OPPO\s?([\w\s]+?)(?:\)|;|Build)/i);
      if (op) return "Oppo " + op[1].trim();
      return "Oppo (modèle non identifié)";
    }
    // Realme
    if (/realme/i.test(ua)) {
      var rl = ua.match(/realme\s?([\w\s]+?)(?:\)|;|Build)/i);
      if (rl) return "Realme " + rl[1].trim();
      return "Realme (modèle non identifié)";
    }
    // Motorola
    if (/Motorola/i.test(ua)) {
      var mo = ua.match(/Motorola\s?([\w\s]+?)(?:\)|;|Build)/i);
      if (mo) return "Motorola " + mo[1].trim();
      return "Motorola (modèle non identifié)";
    }
    // Détection générique Android
    var generic = ua.match(/;\s?([^;)]+?)\s?(?:Build|;|\))/);
    if (generic && generic[1].length > 2 && generic[1].length < 40) {
      return generic[1].trim();
    }
    return "Appareil Android";
  }
  // ---------- PC ----------
  if (/Windows NT/i.test(ua)) {
    return "PC Windows";
  }
  if (/Macintosh/i.test(ua) && !(/iPhone|iPad/i.test(ua))) {
    return "Mac";
  }
  if (/Linux/i.test(ua) && !/Android/i.test(ua)) {
    return "PC Linux";
  }
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
  return "Navigateur inconnu";
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
