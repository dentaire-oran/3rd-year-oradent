function getDeviceType() {
  var ua = navigator.userAgent;
  if (/iPad/i.test(ua) || (/Macintosh/i.test(ua) && (navigator.maxTouchPoints || 0) > 1)) return "tablet";
  if (/Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|webOS|Windows Phone/i.test(ua)) return "mobile";
  return "pc";
}

function getDeviceModel() {
  var ua = navigator.userAgent;
  if (/iPhone/i.test(ua)) {
    var w = window.screen.width, h = window.screen.height, dpr = window.devicePixelRatio || 1;
    if ((w===430&&h===932)||(w===932&&h===430)) return "iPhone 16/15/14 Pro Max";
    if ((w===393&&h===852)||(w===852&&h===393)) return "iPhone 16/15/14 Pro";
    if ((w===390&&h===844)||(w===844&&h===390)) return "iPhone 14/15/16/13 Pro";
    if ((w===375&&h===812)||(w===812&&h===375)) return "iPhone 11 Pro/XS";
    if ((w===375&&h===667)||(w===667&&h===375)) return "iPhone SE/8/7";
    return "iPhone";
  }
  if (/Android/i.test(ua)) {
    var patterns = [
      {p:/SM-S938|S25 Ultra/i,n:"Samsung Galaxy S25 Ultra"},{p:/SM-S931/i,n:"Samsung Galaxy S25"},
      {p:/SM-S928|S24 Ultra/i,n:"Samsung Galaxy S24 Ultra"},{p:/SM-S921/i,n:"Samsung Galaxy S24"},
      {p:/SM-S918|S23 Ultra/i,n:"Samsung Galaxy S23 Ultra"},{p:/SM-S911/i,n:"Samsung Galaxy S23"},
      {p:/SM-F956|Z Fold6/i,n:"Samsung Z Fold 6"},{p:/SM-F741|Z Flip6/i,n:"Samsung Z Flip 6"},
      {p:/SM-A556|A55/i,n:"Samsung Galaxy A55"},{p:/SM-A546|A54/i,n:"Samsung Galaxy A54"},
    ];
    for (var i=0;i<patterns.length;i++) if (patterns[i].p.test(ua)) return patterns[i].n;
    var gs = ua.match(/SM-([A-Z][0-9]{3,4}[A-Z]?)/i);
    if (gs) return "Samsung Galaxy (SM-"+gs[1]+")";
    if (/Pixel/i.test(ua)) { var pm=ua.match(/Pixel\s?([0-9]+[a-zA-Z\s]*)/i); return pm?"Google Pixel "+pm[1].trim():"Google Pixel"; }
    var ad = ua.match(/Android\s[0-9.]+;\s?([^;)]+?)\s?(?:Build|;|\))/i);
    if (ad&&ad[1]&&ad[1].length>2&&ad[1].length<40) return ad[1].trim();
    return "Android Device";
  }
  if (/Windows NT/i.test(ua)) return "Windows PC";
  if (/Macintosh/i.test(ua)) return "Mac";
  if (/Linux/i.test(ua)) return "Linux PC";
  return "Unknown Device";
}

function getBrowserInfo() {
  var ua = navigator.userAgent;
  if (/Edg\//i.test(ua)) { var v=ua.match(/Edg\/([0-9]+)/); return "Edge "+(v?v[1]:""); }
  if (/Chrome\//i.test(ua)&&!/Edg/i.test(ua)) { var v=ua.match(/Chrome\/([0-9]+)/); return "Chrome "+(v?v[1]:""); }
  if (/Firefox/i.test(ua)) { var v=ua.match(/Firefox\/([0-9]+)/); return "Firefox "+(v?v[1]:""); }
  if (/Safari/i.test(ua)&&!/Chrome/i.test(ua)) { var v=ua.match(/Version\/([0-9]+)/); return "Safari "+(v?v[1]:""); }
  if (/SamsungBrowser/i.test(ua)) { var v=ua.match(/SamsungBrowser\/([0-9]+)/); return "Samsung Internet "+(v?v[1]:""); }
  return "Browser";
}

function getOSInfo() {
  var ua = navigator.userAgent;
  var iOS = ua.match(/iPhone OS ([0-9_]+)|iPad.*OS ([0-9_]+)/i);
  if (iOS) return "iOS "+(iOS[1]||iOS[2]).replace(/_/g,".");
  var android = ua.match(/Android ([0-9.]+)/);
  if (android) return "Android "+android[1];
  var windows = ua.match(/Windows NT ([0-9.]+)/);
  if (windows) return "Windows "+( {"10.0":"10/11","6.3":"8.1","6.1":"7"}[windows[1]]||windows[1] );
  var macOS = ua.match(/Mac OS X ([0-9_]+)/);
  if (macOS) return "macOS "+macOS[1].replace(/_/g,".");
  return "Unknown OS";
}

function getDeviceDisplayString() {
  var t2 = getDeviceType(), m = getDeviceModel(), b = getBrowserInfo(), o = getOSInfo();
  var icon = t2==="mobile"?"📱":t2==="tablet"?"📲":"💻";
  return icon+" "+m+" ("+o+", "+b+")";
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
  if (td!==null&&td!==undefined&&td!=="Abs") { pts+=parseFloat(td)*1; div+=1; }
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
