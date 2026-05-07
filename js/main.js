var App = App || {};
var isAdmin = false;
var isAdminLite = false;
var currentLang = "fr";
var originalDoLogin = App.auth.doLogin;
App.auth.doLogin = function () {
  alert("doLogin est appelé !");
  return originalDoLogin();
};

App.currentView = "login";

App.showView = function(v) {
  ["Login","Student","Account","Admin"].forEach(function(n){
    document.getElementById("view"+n).classList.add("hidden");
  });
  document.getElementById("view"+v.charAt(0).toUpperCase()+v.slice(1)).classList.remove("hidden");
  App.currentView = v;
  App.updateSidebarNav();
  App.updateBreadcrumb();
  var leaveBtn = document.getElementById("leaveAdminLiteBtn");
  if (leaveBtn) leaveBtn.style.display = (viewingAsAdminLite && v === "admin") ? "inline-flex" : "none";
};

App.updateSidebarNav = function() {
  var nav = document.getElementById("sidebarNav");
  if (!nav) return;
  var h = '<button onclick="App.goHome();closeMenu();" class="nav-link glass"><i class="ph-bold ph-house text-xl"></i><span>'+t("home")+'</span></button>';
  if (App.currentView === "student" || App.currentView === "account") {
    h += '<button onclick="App.showView(\'student\');closeMenu();" class="nav-link glass '+(App.currentView==="student"?"active":"")+'"><i class="ph-bold ph-chart-bar text-xl"></i><span>'+t("myResults")+'</span></button>';
    h += '<button onclick="App.student.showAccount();closeMenu();" class="nav-link glass '+(App.currentView==="account"?"active":"")+'"><i class="ph-bold ph-user-circle text-xl"></i><span>'+t("myAccount")+'</span></button>';
  }
  if (App.currentView === "admin") {
    h += '<button onclick="App.showView(\'admin\');closeMenu();" class="nav-link glass active"><i class="ph-bold ph-shield text-xl"></i><span>'+t("adminInterface")+'</span></button>';
    if (viewingAsAdminLite) {
      h += '<button onclick="App.student.leaveAdminLiteMode();closeMenu();" class="nav-link glass"><i class="ph-bold ph-arrow-left text-xl"></i><span>Retour à mon compte</span></button>';
    }
  }
  h += '<div class="w-full h-px my-2" style="background:var(--glass-border);"></div>';
  if (App.currentView !== "login") h += '<button onclick="App.auth.logout();closeMenu();" class="nav-link glass"><i class="ph-bold ph-sign-out text-xl"></i><span>'+t("logout")+'</span></button>';
  nav.innerHTML = h;
};

App.updateBreadcrumb = function() {
  var bc = document.getElementById("breadcrumb");
  if (App.currentView === "login") { bc.style.display = "none"; bc.innerHTML = ""; return; }
  bc.style.display = "flex";
  var p = ['<button class="breadcrumb-btn" onclick="App.goHome()"><i class="ph-bold ph-house" style="font-size:0.65rem;"></i> '+t("home")+'</button>'];
  p.push('<span class="breadcrumb-sep">›</span>');
  if (App.currentView === "student") p.push('<span class="breadcrumb-btn" style="color:var(--text-main);cursor:default;">'+t("results")+'</span>');
  else if (App.currentView === "account") {
    p.push('<button class="breadcrumb-btn" onclick="App.showView(\'student\')">'+t("results")+'</button>');
    p.push('<span class="breadcrumb-sep">›</span>');
    p.push('<span class="breadcrumb-btn" style="color:var(--text-main);cursor:default;">'+t("myAccount")+'</span>');
  }
  else if (App.currentView === "admin") p.push('<span class="breadcrumb-btn" style="color:var(--text-main);cursor:default;">'+t("adminInterface")+'</span>');
  bc.innerHTML = p.join('');
};

App.goHome = function() { window.location.href = "dental-guide.html#year-3"; };

function translatePage(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) el.textContent = TRANSLATIONS[lang][key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
    var key = el.getAttribute('data-i18n-placeholder');
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) el.placeholder = TRANSLATIONS[lang][key];
  });
  var signalModule = document.getElementById('signalModule');
  if (signalModule && signalModule.options[0]) signalModule.options[0].textContent = TRANSLATIONS[lang].chooseModule;
  App.updateSidebarNav();
  App.updateBreadcrumb();
}

var langPill = document.getElementById("langPill");
var langBtns = document.querySelectorAll(".lang-btn");
function getLang() { return localStorage.getItem("lang") || "fr"; }
function setLangPill(lang) {
  var idx = lang === "fr" ? 0 : lang === "en" ? 1 : 2;
  if (langPill) langPill.style.transform = "translateX(" + (idx * 100) + "%)";
  for (var i = 0; i < langBtns.length; i++) langBtns[i].classList.toggle("active", langBtns[i].getAttribute("data-lang") === lang);
}
function initLang() {
  var lang = getLang(); currentLang = lang;
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  setLangPill(lang);
  translatePage(lang);
}
for (var _i = 0; _i < langBtns.length; _i++) {
  (function(btn) {
    btn.addEventListener("click", function() {
      var lang = btn.getAttribute("data-lang");
      document.body.classList.add("switching-lang"); setLangPill(lang);
      setTimeout(function() {
        document.documentElement.setAttribute("lang", lang);
        document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
        localStorage.setItem("lang", lang); translatePage(lang);
        requestAnimationFrame(function() { document.body.classList.remove("switching-lang"); });
      }, 300);
    });
  })(langBtns[_i]);
}

function initTheme() {
  var th = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", th);
}
document.getElementById("themeBtn").addEventListener("click", function() {
  var cur = document.documentElement.getAttribute("data-theme");
  var next = cur === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});

var sidebar = document.getElementById("sidebar"), overlay = document.getElementById("overlay"), menuBtn = document.getElementById("menuBtn");
menuBtn.onclick = function(e) { e.stopPropagation(); sidebar.classList.toggle("open"); overlay.classList.toggle("hidden", !sidebar.classList.contains("open")); };
window.closeMenu = function() { sidebar.classList.remove("open"); overlay.classList.add("hidden"); };

window.showToast = function(msg, type) {
  type = type || "info";
  var colors = { success: "var(--success)", danger: "var(--danger)", warning: "var(--warning)", info: "#a5b4fc" };
  var icons = { success: "ph-check-circle", danger: "ph-x-circle", warning: "ph-warning", info: "ph-info" };
  var c = document.getElementById("toastContainer");
  var toastEl = document.createElement("div");
  toastEl.className = "toast-item glass";
  toastEl.innerHTML = '<i class="ph-fill ' + icons[type] + '" style="color:' + colors[type] + ';font-size:1.1rem;"></i> ' + msg;
  c.appendChild(toastEl);
  requestAnimationFrame(function() { toastEl.classList.add("show"); });
  setTimeout(function() { toastEl.classList.remove("show"); setTimeout(function() { toastEl.remove(); }, 400); }, 3500);
};

document.getElementById("inputMdp").addEventListener("keydown", function(e) { if (e.key === "Enter") App.auth.doLogin(); });
document.getElementById("inputNom").addEventListener("keydown", function(e) { if (e.key === "Enter") App.auth.doLogin(); });

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("sw.js").then(function(registration) {
      console.log("Service Worker enregistré avec succès :", registration.scope);
    }, function(err) {
      console.log("Échec de l'enregistrement du Service Worker :", err);
    });
  });
}



initTheme();
initLang();
App.updateSidebarNav();
App.updateBreadcrumb();
App.auth.checkSession();
