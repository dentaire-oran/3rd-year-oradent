function getDeviceType() {
  var ua = navigator.userAgent;
  if (/iPad/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return "Tablette";
  if (/Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|webOS|Windows Phone/i.test(ua)) return "Mobile";
  return "PC";
}

function getDeviceModel() {
  var ua = navigator.userAgent;
  var w = screen.width, h = screen.height;
  // ---------- iPhone ----------
  if (/iPhone/i.test(ua)) {
    if ((w===430&&h===932)||(w===932&&h===430)) return "iPhone 14/15/16 Pro Max";
    if ((w===393&&h===852)||(w===852&&h===393)) return "iPhone 14/15/16 Pro";
    if ((w===390&&h===844)||(w===844&&h===390)) return "iPhone 14/15/16";
    if ((w===428&&h===926)||(w===926&&h===428)) return "iPhone 12/13 Pro Max";
    if ((w===414&&h===896)||(w===896&&h===414)) return "iPhone 11 Pro Max / XS Max";
    if ((w===375&&h===812)||(w===812&&h===375)) return "iPhone X/XS/11 Pro";
    if ((w===414&&h===736)||(w===736&&h===414)) return "iPhone 6/7/8 Plus";
    if ((w===375&&h===667)||(w===667&&h===375)) return "iPhone 6/7/8 / SE 2/3";
    if ((w===320&&h===568)||(w===568&&h===320)) return "iPhone 5 / SE 1";
    return "iPhone";
  }
  // ---------- iPad ----------
  if (/iPad/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) {
    if ((w===1024&&h===1366)||(w===1366&&h===1024)) return "iPad Pro 12.9\"";
    if ((w===834&&h===1112)||(w===1112&&h===834)) return "iPad Pro 11\" / iPad Air";
    if ((w===820&&h===1180)||(w===1180&&h===820)) return "iPad 10.9\" (10th gen)";
    if ((w===810&&h===1080)||(w===1080&&h===810)) return "iPad 10.2\"";
    if ((w===768&&h===1024)||(w===1024&&h===768)) return "iPad Mini";
    return "iPad";
  }
  // ---------- Android ----------
  if (/Android/i.test(ua)) {
    // Samsung Galaxy S
    if (/SM-S938/i.test(ua)) return "Samsung Galaxy S25 Ultra";
    if (/SM-S931/i.test(ua)) return "Samsung Galaxy S25";
    if (/SM-S928/i.test(ua)) return "Samsung Galaxy S24 Ultra";
    if (/SM-S921/i.test(ua)) return "Samsung Galaxy S24";
    if (/SM-S918/i.test(ua)) return "Samsung Galaxy S23 Ultra";
    if (/SM-S911/i.test(ua)) return "Samsung Galaxy S23";
    if (/SM-S908/i.test(ua)) return "Samsung Galaxy S22 Ultra";
    if (/SM-S901/i.test(ua)) return "Samsung Galaxy S22";
    // Samsung Fold/Flip
    if (/SM-F956/i.test(ua)) return "Samsung Galaxy Z Fold 6";
    if (/SM-F741/i.test(ua)) return "Samsung Galaxy Z Flip 6";
    if (/SM-F946/i.test(ua)) return "Samsung Galaxy Z Fold 5";
    if (/SM-F731/i.test(ua)) return "Samsung Galaxy Z Flip 5";
    // Samsung A series
    if (/SM-A556/i.test(ua)) return "Samsung Galaxy A55";
    if (/SM-A546/i.test(ua)) return "Samsung Galaxy A54";
    if (/SM-A536/i.test(ua)) return "Samsung Galaxy A53";
    // Samsung Tab
    if (/SM-T970/i.test(ua)) return "Samsung Galaxy Tab S7+";
    if (/SM-T870/i.test(ua)) return "Samsung Galaxy Tab S7";
    if (/SM-X900/i.test(ua)) return "Samsung Galaxy Tab S8 Ultra";
    if (/SM-X700/i.test(ua)) return "Samsung Galaxy Tab S8";
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
    if (/Pixel 6 Pro/i.test(ua)) return "Google Pixel 6 Pro";
    if (/Pixel 6/i.test(ua)) return "Google Pixel 6";
    if (/Pixel 5/i.test(ua)) return "Google Pixel 5";
    // OnePlus
    if (/OnePlus 12/i.test(ua)) return "OnePlus 12";
    if (/OnePlus 11/i.test(ua)) return "OnePlus 11";
    if (/OnePlus 10 Pro/i.test(ua)) return "OnePlus 10 Pro";
    if (/OnePlus Nord/i.test(ua)) return "OnePlus Nord";
    // Xiaomi / Redmi / POCO
    if (/Xiaomi/i.test(ua)) {
      var xm = ua.match(/Xiaomi\s?([\w\s]+?)(?:\)|;|Build)/i);
      if (xm) return "Xiaomi " + xm[1].trim();
      return "Xiaomi";
    }
    if (/Redmi/i.test(ua)) {
      var rm = ua.match(/Redmi\s?([\w\s]+?)(?:\)|;|Build)/i);
      if (rm) return "Redmi " + rm[1].trim();
      return "Redmi";
    }
    if (/POCO/i.test(ua)) {
      var po = ua.match(/POCO\s?([\w\s]+?)(?:\)|;|Build)/i);
      if (po) return "POCO " + po[1].trim();
      return "POCO";
    }
    // Huawei
    if (/HUAWEI/i.test(ua)) {
      var hw = ua.match(/HUAWEI\s?([\w\s-]+?)(?:\)|;|Build)/i);
      if (hw) return "Huawei " + hw[1].trim();
      return "Huawei";
    }
    // Oppo
    if (/OPPO/i.test(ua)) {
      var op = ua.match(/OPPO\s?([\w\s]+?)(?:\)|;|Build)/i);
      if (op) return "Oppo " + op[1].trim();
      return "Oppo";
    }
    // Realme
    if (/realme/i.test(ua)) {
      var rl = ua.match(/realme\s?([\w\s]+?)(?:\)|;|Build)/i);
      if (rl) return "Realme " + rl[1].trim();
      return "Realme";
    }
    // Motorola
    if (/Motorola/i.test(ua)) {
      var mo = ua.match(/Motorola\s?([\w\s]+?)(?:\)|;|Build)/i);
      if (mo) return "Motorola " + mo[1].trim();
      return "Motorola";
    }
    // Smartwatches (Wear OS)
    if (/Wear OS/i.test(ua)) return "Montre Wear OS";
    // Fallback générique
    var generic = ua.match(/;\s?([^;)]+?)\s?(?:Build|;|\))/);
    if (generic && generic[1].length > 2 && generic[1].length < 40) return generic[1].trim();
    return "Appareil Android";
  }
  // ---------- PC ----------
  if (/Windows NT/i.test(ua)) return "PC Windows";
  if (/Macintosh/i.test(ua)) return "Mac";
  if (/Linux/i.test(ua) && !/Android/i.test(ua)) return "PC Linux";
  return "Appareil inconnu";
}

function getBrowserInfo() {
  var ua = navigator.userAgent;
  if (/Edg\//i.test(ua)) { var v=ua.match(/Edg\/([0-9]+)/); return v?"Edge "+v[1]:"Edge"; }
  if (/Chrome\//i.test(ua)&&!/Edg/i.test(ua)) { var v=ua.match(/Chrome\/([0-9]+)/); return v?"Chrome "+v[1]:"Chrome"; }
  if (/Firefox\//i.test(ua)) { var v=ua.match(/Firefox\/([0-9]+)/); return v?"Firefox "+v[1]:"Firefox"; }
  if (/Safari/i.test(ua)&&!/Chrome/i.test(ua)) { var v=ua.match(/Version\/([0-9]+)/); return v?"Safari "+v[1]:"Safari"; }
  if (/SamsungBrowser/i.test(ua)) { var v=ua.match(/SamsungBrowser\/([0-9]+)/); return v?"Samsung Internet "+v[1]:"Samsung Internet"; }
  return "Navigateur inconnu";
}

function getOSInfo() {
  var ua = navigator.userAgent;
  if (/iPhone|iPad/.test(ua)) { var ios=ua.match(/OS (\d+_\d+)/); return ios?"iOS "+ios[1].replace(/_/g,"."):"iOS"; }
  if (/Android/i.test(ua)) { var a=ua.match(/Android\s([0-9.]+)/); return a?"Android "+a[1]:"Android"; }
  if (/Windows NT/i.test(ua)) { var w=ua.match(/Windows NT\s([0-9.]+)/); var wv=w?w[1]:""; var map={"10.0":"10/11","6.3":"8.1","6.2":"8","6.1":"7"}; return "Windows "+(map[wv]||wv); }
  if (/Macintosh/i.test(ua)) { var m=ua.match(/Mac OS X\s([0-9_.]+)/); return m?"macOS "+m[1].replace(/_/g,"."):"macOS"; }
  return "OS inconnu";
}

function getDeviceFullDescription() {
  return getDeviceType() + " | " + getDeviceModel() + " | " + getBrowserInfo() + " | " + getOSInfo();
}

function getDeviceDisplayString() {
  var t=getDeviceType(), m=getDeviceModel(), b=getBrowserInfo(), o=getOSInfo();
  var icone=t==="Mobile"?"📱":t==="Tablette"?"📲":"💻";
  return icone+" "+m+" ("+o+", "+b+")";
}

function getDeviceShortString() {
  return getDeviceType()+": "+getDeviceModel();
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
  toast.innerHTML = '<i class="ph-fill ' + icons[type] + '" style="color:' + colors[type] + ';"></i>' + msg;
  container.appendChild(toast);
  setTimeout(function () { toast.classList.add("show"); }, 20);
  setTimeout(function () { toast.classList.remove("show"); setTimeout(function () { if (toast.parentNode) toast.remove(); }, 500); }, 4000);
};

window.showConfirm = function (message) {
  return new Promise(function (resolve) {
    var modal = document.getElementById("confirmModal");
    var msg = document.getElementById("confirmMsg");
    var okBtn = document.getElementById("confirmOk");
    var cancelBtn = document.getElementById("confirmCancel");
    msg.textContent = message;
    modal.classList.remove("hidden");
    function cleanup() { modal.classList.add("hidden"); okBtn.removeEventListener("click", onOk); cancelBtn.removeEventListener("click", onCancel); }
    function onOk() { cleanup(); resolve(true); }
    function onCancel() { cleanup(); resolve(false); }
    okBtn.addEventListener("click", onOk);
    cancelBtn.addEventListener("click", onCancel);
  });
};
