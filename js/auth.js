var App = App || {};
App.auth = {};

// Valeurs par défaut (fallback si Supabase est injoignable)
var ADMIN_ID = "admin";
var ADMIN_MDP_HASH = "2e3c969e2e9b367ade00279743f88ea0e32f283152223e3d9aaf1c14669d7cbe";
var ADMIN_LITE_ID = "user";
var ADMIN_LITE_MDP_HASH = "90d06112d5dc4274afd6ba187432cbf203586566e2ffe87b7494e9b1e1268187";

// Chargement des identifiants depuis Supabase (écrase les valeurs par défaut si trouvées)
(function loadAdminCredentials() {
  fetch(SUPABASE_URL + "/rest/v1/admin_accounts?select=role,username,password_hash", {
    headers: SB_HEADERS
  })
    .then(function(r) { return r.json(); })
    .then(function(rows) {
      if (rows && rows.length) {
        rows.forEach(function(r) {
          if (r.role === "admin") {
            ADMIN_ID = r.username;
            ADMIN_MDP_HASH = r.password_hash;
          } else if (r.role === "admin_lite") {
            ADMIN_LITE_ID = r.username;
            ADMIN_LITE_MDP_HASH = r.password_hash;
          }
        });
        // Mettre à jour le localStorage pour cohérence
        localStorage.setItem("admin_id_v2", ADMIN_ID);
        localStorage.setItem("admin_hash_v2", ADMIN_MDP_HASH);
        localStorage.setItem("admin_lite_id_v2", ADMIN_LITE_ID);
        localStorage.setItem("admin_lite_hash_v2", ADMIN_LITE_MDP_HASH);
      }
    })
    .catch(function() {
      // Fallback : on garde les valeurs par défaut ou le localStorage
      var storedAdminId = localStorage.getItem("admin_id_v2");
      if (storedAdminId) ADMIN_ID = storedAdminId;
      var storedAdminHash = localStorage.getItem("admin_hash_v2");
      if (storedAdminHash) ADMIN_MDP_HASH = storedAdminHash;
      var storedLiteId = localStorage.getItem("admin_lite_id_v2");
      if (storedLiteId) ADMIN_LITE_ID = storedLiteId;
      var storedLiteHash = localStorage.getItem("admin_lite_hash_v2");
      if (storedLiteHash) ADMIN_LITE_MDP_HASH = storedLiteHash;
    });
})();

App.auth.saveSession = function(v) { localStorage.setItem(SESSION_KEY, String(v)); };
App.auth.clearSession = function() { localStorage.removeItem(SESSION_KEY); };

App.auth.doLogin = async function() {
  var id = document.getElementById("inputNom").value.trim();
  var mdp = document.getElementById("inputMdp").value.trim();
  if (!id||!mdp) { App.auth.showLoginError(t("fillAllFields")); return; }
  var inputHash = await sha256(mdp);

  if (id===ADMIN_ID&&inputHash===ADMIN_MDP_HASH) {
    App.auth.saveSession("ADMIN"); isAdmin=true; isAdminLite=false;
    App.showView("admin"); App.admin.loadAdmin(); return;
  }
  if (id===ADMIN_LITE_ID&&inputHash===ADMIN_LITE_MDP_HASH) {
    App.auth.saveSession("ADMINLITE"); isAdmin=true; isAdminLite=true;
    App.showView("admin"); App.admin.loadAdmin();
    App.auth.logConnection("Admin Lite","N/A",t("adminLiteLogin")); return;
  }

  App.auth.setLoginLoading(true); App.auth.hideLoginError();
  App.auth.findEtudiant(id, mdp).then(function(et) {
    App.auth.setLoginLoading(false);
    if (!et) { App.auth.showLoginError(t("invalidCredentials")); return; }
    currentStudent = et; App.auth.saveSession(et.numero);
    App.showView("student"); App.student.renderStudent(et);
    App.auth.logConnection(et.nom+" "+et.prenom, et.numero, t("studentLogin"));
  }).catch(function(){App.auth.setLoginLoading(false); App.auth.showLoginError(t("connectionError"));});
};

App.auth.findEtudiant = function(id, mdp) {
  return fsList("etudiants").then(function(data) {
    if (!data.documents) return null;
    var all = data.documents;
    for (var i=0;i<all.length;i++) {
      var et = all[i];
      if (et.custom_id&&et.custom_mdp&&et.custom_id===id&&et.custom_mdp===mdp) return et;
      var nom = (et.nom+" "+et.prenom).trim();
      if (nom===id.trim()&&String(et.numero)===String(mdp)) return et;
    }
    return null;
  });
};

App.auth.logConnection = function (nom, numero, type) {
  var now = new Date().toLocaleString("fr-FR");
  var deviceInfo = getDeviceShortString();
  var deviceFull = getDeviceFullDescription();

  fsCreate("notifications", {
    etudiant_nom: nom,
    etudiant_numero: String(numero),
    module: "Système",
    type: type,
    message: "",
    date: now,
    lu: false,
    admin_only: false,
    device_info: deviceInfo,
    device_full: deviceFull
  });
};

App.auth.setLoginLoading = function(on) {
  var btn = document.getElementById("loginBtn");
  btn.innerHTML = on ? '<div class="spinner"></div> '+t("verifying") : '<i class="ph-bold ph-sign-in"></i> '+t("accessResults");
  btn.disabled = on;
};

App.auth.showLoginError = function(msg) {
  document.getElementById("loginErrorMsg").textContent=msg;
  document.getElementById("loginError").classList.add("show");
};

App.auth.hideLoginError = function() {
  document.getElementById("loginError").classList.remove("show");
};

App.auth.checkSession = function() {
  var s = localStorage.getItem(SESSION_KEY);
  if (!s) return;
  if (s === "ADMIN") {
    isAdmin=true; isAdminLite=false; App.showView("admin"); App.admin.loadAdmin(); return;
  }
  if (s === "ADMINLITE") {
    isAdmin=true; isAdminLite=true; App.showView("admin"); App.admin.loadAdmin();
    App.auth.logConnection("Admin Lite","N/A",t("pageRefresh")); return;
  }
  var num = parseInt(s);
  if (!num) return;
  fsGet("etudiants", String(num)).then(function(et) {
    if (!et) { App.auth.clearSession(); return; }
    currentStudent = et;
    App.showView("student"); App.student.renderStudent(et);
    App.auth.logConnection(et.nom+" "+et.prenom, et.numero, t("pageRefresh"));
  }).catch(function(){App.auth.clearSession();});
};

App.auth.logout = function() {
  viewingAsAdminLite = false;
  currentStudent=null; isAdmin=false; isAdminLite=false; adminData=[];
  App.auth.clearSession();
  document.getElementById("inputNom").value=""; document.getElementById("inputMdp").value="";
  App.auth.hideLoginError(); App.showView("login");
};
