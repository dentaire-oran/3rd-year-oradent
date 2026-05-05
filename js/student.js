var App = App || {};
App.student = {};

var currentStudent = null;
var viewingAsAdminLite = false;

App.student.renderStudent = function(et) {
  currentStudent = et;
  document.getElementById("studentName").textContent = et.nom+" "+et.prenom;
  document.getElementById("studentMeta").textContent = "N° "+et.numero+" | 3"+(currentLang==="ar"?"":"ème")+" "+t("year");

  var moy = et.moyenne_generale;
  var moyNum = moy ? parseFloat(moy) : null;
  document.getElementById("statMoy").textContent = moyNum ? moyNum.toFixed(3) : "—";
  document.getElementById("statRank").textContent = et.classement || "—";

  var extraMoyHtml = "";
  if (moyNum !== null) {
    var pct = Math.min(100, Math.max(0, (moyNum/20)*100)).toFixed(1);
    extraMoyHtml += '<div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:'+pct+'%;"></div></div>';
    extraMoyHtml += getGradeBadge(moyNum);
  }
  document.getElementById("statMoyExtra").innerHTML = extraMoyHtml;

  var extraRankHtml = getRankBadge(et.classement);
  var rankNum = parseInt(et.classement);
  if (!isNaN(rankNum)&&rankNum>0) {
    var topP = Math.ceil((rankNum/444)*100);
    extraRankHtml += '<div style="font-size:0.72rem;color:var(--text-muted);margin-top:0.2rem;">'+t("topPercent")+' '+topP+'%</div>';
  }
  document.getElementById("statRankExtra").innerHTML = extraRankHtml;

  var motivDiv = document.getElementById("motivMsg");
  if (motivDiv && moyNum !== null) {
    var msgs = MOTIV_MSGS[currentLang]||MOTIV_MSGS.fr;
    var msg = moyNum>=16?msgs.ex:moyNum>=14?msgs.gr:moyNum>=12?msgs.gd:moyNum>=10?msgs.ok:moyNum>=8?msgs.ef:msgs.lo;
    var bgColor = moyNum>=12?"rgba(42,212,165,0.08)":moyNum>=10?"rgba(255,201,74,0.08)":"rgba(255,100,124,0.08)";
    var bColor  = moyNum>=12?"rgba(42,212,165,0.25)":moyNum>=10?"rgba(255,201,74,0.25)":"rgba(255,100,124,0.25)";
    var tColor  = moyNum>=12?"var(--success)":moyNum>=10?"var(--warning)":"var(--danger)";
    motivDiv.className = "motiv-banner";
    motivDiv.style.cssText = "background:"+bgColor+";border:1px solid "+bColor+";color:"+tColor+";";
    motivDiv.innerHTML = '<i class="ph-fill ph-shooting-star" style="font-size:1.1rem;flex-shrink:0;"></i><span>'+msg+'</span>';
    motivDiv.classList.remove("hidden");
  } else if (motivDiv) { motivDiv.classList.add("hidden"); }

  var badge = document.getElementById("studentBadge");
  var res = et.resultat||"";
  if (res.indexOf("admis")!==-1||res.indexOf("Félicitations")!==-1)
    badge.innerHTML = '<span class="badge badge-success"><i class="ph-fill ph-check-circle"></i> '+t("admitted")+'</span>';
  else if (res.indexOf("Rattrapage")!==-1)
    badge.innerHTML = '<span class="badge badge-warning"><i class="ph-fill ph-warning"></i> '+t("catchup")+'</span>';
  else
    badge.innerHTML = '<span class="badge badge-danger"><i class="ph-fill ph-x-circle"></i> '+(res||"—")+'</span>';

  var tbody = document.getElementById("modulesBody");
  tbody.innerHTML = "";
  var sel = document.getElementById("signalModule");
  sel.innerHTML = '<option value="">'+t("chooseModule")+'</option>';

  MODULES.forEach(function(mod) {
    var k = mod.key;
    var e1=et[k+"_emd1"], e2=et[k+"_emd2"], td=et[k+"_td"], tp=et[k+"_tp"];
    var mm = et[k+"_moy_module"]!==undefined ? et[k+"_moy_module"] : et["moy_"+k];
    var tr = document.createElement("tr");
    tr.innerHTML =
      '<td><span style="font-weight:600;">'+mod.nom+'</span><span class="coef-badge">x'+mod.coef+'</span></td>'+
      '<td class="mono">'+mod.coef+'</td>'+
      '<td class="mono '+nc(e1)+'">'+fn(e1)+'</td>'+
      '<td class="mono '+nc(e2)+'">'+fn(e2)+'</td>'+
      '<td class="mono '+nc(et[k+"_moy_emd"])+'">'+fn(et[k+"_moy_emd"])+'</td>'+
      '<td class="mono '+nc(td)+'">'+fn(td)+'</td>'+
      '<td class="mono '+nc(tp)+'">'+fn(tp)+'</td>'+
      '<td class="mono '+nc(mm)+'" style="font-weight:700;">'+fn(mm)+getGradeBadge(mm)+'</td>';
    tbody.appendChild(tr);
    var opt=document.createElement("option"); opt.value=mod.nom; opt.textContent=mod.nom; sel.appendChild(opt);
  });

  var btnAdminLite = document.getElementById("btnAdminLiteAccess");
  if (studentHasAllAccess(et)) {
    btnAdminLite.style.display = "inline-flex";
  } else {
    btnAdminLite.style.display = "none";
  }

  App.student.initPeerComparison(et);
};

App.student.enterAdminLiteMode = function() {
  if (!currentStudent || !studentHasAllAccess(currentStudent)) return;
  viewingAsAdminLite = true;
  isAdmin = true;
  isAdminLite = true;
  App.showView("admin");
  App.admin.loadAdmin();
  document.getElementById("leaveAdminLiteBtn").style.display = "inline-flex";
  document.getElementById("adminLiteBadge").classList.remove("hidden");
};

App.student.leaveAdminLiteMode = function() {
  viewingAsAdminLite = false;
  isAdmin = false;
  isAdminLite = false;
  document.getElementById("leaveAdminLiteBtn").style.display = "none";
  App.showView("student");
  if (currentStudent) App.student.renderStudent(currentStudent);
};

App.student.showAccount = function() {
  if (!currentStudent) return;
  document.getElementById("accountSubtitle").textContent = currentStudent.nom+" "+currentStudent.prenom+" — N° "+currentStudent.numero;
  document.getElementById("newIdentifiant").value = currentStudent.custom_id||(currentStudent.nom+" "+currentStudent.prenom);
  document.getElementById("newMdp").value = "";
  document.getElementById("confirmMdp").value = "";
  App.showView("account");
};

App.student.saveAccount = function() {
  var newId  = document.getElementById("newIdentifiant").value.trim();
  var newMdp = document.getElementById("newMdp").value.trim();
  var conf   = document.getElementById("confirmMdp").value.trim();
  if (!newId) { showToast(t("identifierEmpty"),"danger"); return; }
  if (newMdp&&newMdp!==conf) { showToast(t("passwordMismatch"),"danger"); return; }
  var btn = document.getElementById("saveAccountBtn");
  btn.innerHTML='<div class="spinner"></div> '+t("saving"); btn.disabled=true;
  var fields={custom_id:newId};
  if (newMdp) fields.custom_mdp=newMdp;
  var changes="Identifiant: "+newId+(newMdp?" | Mot de passe modifie":"");
  var now=new Date().toLocaleString("fr-FR");
  var deviceInfo=getDeviceShortString(), deviceFull=getDeviceDisplayString();
  fsPatch("etudiants",String(currentStudent.numero),fields).then(function(){
    currentStudent.custom_id=newId; if(newMdp) currentStudent.custom_mdp=newMdp;
    return fsCreate("notifications",{etudiant_nom:currentStudent.nom+" "+currentStudent.prenom,etudiant_numero:currentStudent.numero,module:"—",type:t("accountModification"),message:changes,date:now,lu:false,admin_only:true,device_info:deviceInfo,device_full:deviceFull});
  }).then(function(){
    emailjs.init(EMAILJS_KEY);
    return emailjs.send(EMAILJS_SERVICE,EMAILJS_TEMPLATE,{etudiant_nom:currentStudent.nom+" "+currentStudent.prenom,etudiant_numero:String(currentStudent.numero),module:t("myAccount"),type_signalement:t("accountModification"),message:changes+" | "+t("device")+": "+deviceFull,date:now});
  }).then(function(){
    btn.innerHTML='<i class="ph-bold ph-floppy-disk"></i> '+t("saveChanges"); btn.disabled=false;
    showToast(t("accountUpdated"),"success"); App.showView("student");
  }).catch(function(){
    btn.innerHTML='<i class="ph-bold ph-floppy-disk"></i> '+t("saveChanges"); btn.disabled=false;
    showToast(t("accountUpdated"),"success"); App.showView("student");
  });
};

App.student.envoyerSignalement = function() {
  var module  = document.getElementById("signalModule").value;
  var type    = document.getElementById("signalType").value;
  var comment = document.getElementById("signalComment").value.trim();
  if (!module) { showToast(t("chooseModuleWarning"),"warning"); return; }
  var btn = document.getElementById("signalBtn");
  btn.innerHTML='<div class="spinner"></div> '+t("sending"); btn.disabled=true;
  var now=new Date().toLocaleString("fr-FR"), nom=currentStudent.nom+" "+currentStudent.prenom;
  var deviceInfo=getDeviceShortString(), deviceFull=getDeviceDisplayString();
  fsCreate("notifications",{etudiant_nom:nom,etudiant_numero:currentStudent.numero,module:module,type:type,message:comment||t("noComment"),date:now,lu:false,admin_only:false,device_info:deviceInfo,device_full:deviceFull})
  .then(function(){
    emailjs.init(EMAILJS_KEY);
    return emailjs.send(EMAILJS_SERVICE,EMAILJS_TEMPLATE,{etudiant_nom:nom,etudiant_numero:String(currentStudent.numero),module:module,type_signalement:type,message:(comment||t("noComment"))+" | "+t("device")+": "+deviceFull,date:now});
  }).then(function(){
    btn.innerHTML='<i class="ph-bold ph-paper-plane-right"></i> '+t("sendReport"); btn.disabled=false;
    document.getElementById("signalModule").value=""; document.getElementById("signalComment").value="";
    showToast(t("reportSent"),"success");
  }).catch(function(){
    btn.innerHTML='<i class="ph-bold ph-paper-plane-right"></i> '+t("sendReport"); btn.disabled=false;
    document.getElementById("signalModule").value=""; document.getElementById("signalComment").value="";
    showToast(t("reportSaved"),"warning");
  });
};

App.student.loadAllStudentsCache = function() {
  if (window._allStudentsCache) return Promise.resolve(window._allStudentsCache);
  return fetch(SUPABASE_URL+"/rest/v1/etudiants?select=numero,nom,prenom&limit=1000", {headers:SB_HEADERS})
    .then(function(r){return r.json();})
    .then(function(data){
      window._allStudentsCache = data.filter(Boolean);
      return window._allStudentsCache;
    });
};

App.student.searchAllStudents = function() {
  var q = document.getElementById("peerSearchInput").value.toLowerCase().trim();
  var resDiv = document.getElementById("peerSearchResults");
  if (!resDiv) return;
  if (!q) { resDiv.innerHTML = ""; return; }

  if (!window._allStudentsCache) {
    resDiv.innerHTML = '<div style="text-align:center;padding:0.5rem;"><div class="spinner" style="margin:0 auto;"></div></div>';
    App.student.loadAllStudentsCache().then(function(){
      App.student.showFilteredResults(q);
    });
    return;
  }
  App.student.showFilteredResults(q);
};

App.student.showFilteredResults = function(q) {
  var resDiv = document.getElementById("peerSearchResults");
  if (!resDiv) return;
  var all = window._allStudentsCache || [];
  var results = all.filter(function(s){
    var full = (s.nom+" "+s.prenom).toLowerCase();
    return full.includes(q) || String(s.numero).includes(q);
  }).slice(0, 10);
  resDiv.innerHTML = "";
  if (results.length === 0) {
    resDiv.innerHTML = '<span style="color:var(--text-muted);">Aucun résultat</span>';
    return;
  }
  results.forEach(function(s){
    var btn = document.createElement("button");
    btn.className = "btn-sm btn-ghost-sm";
    btn.style.display = "block";
    btn.style.marginBottom = "4px";
    btn.textContent = s.nom+" "+s.prenom+" (N°"+s.numero+")";
    btn.onclick = function(){ App.student.loadPeerComparison(s.numero); };
    resDiv.appendChild(btn);
  });
};

App.student.filterPeerSelect = function() {
  var filter = document.getElementById("peerFilterInput").value.toLowerCase().trim();
  var sel = document.getElementById("peerSelect");
  if (!sel) return;
  var options = sel.options;
  for (var i = 1; i < options.length; i++) {
    var opt = options[i];
    if (filter === "" || opt.textContent.toLowerCase().includes(filter)) {
      opt.style.display = "";
    } else {
      opt.style.display = "none";
    }
  }
  sel.value = "";
};

App.student.initPeerComparison = function(et) {
  var section = document.getElementById("peerComparisonSection");
  section.classList.remove("hidden");

  if (studentHasAllAccess(et)) {
    section.innerHTML = '<div class="text-center py-4"><div class="spinner" style="margin:0 auto;"></div></div>';
    App.student.loadAllStudentsCache().then(function(){
      section.innerHTML = '';
      var html = '';
      html += '<h3 class="font-bold text-lg mb-4 flex items-center gap-2"><i class="ph-fill ph-users-three" style="color:#818cf8;"></i> ' + t("peerComparison") + '</h3>';
      html += '<div class="mb-4"><label class="field-label">' + t("searchStudent") + '</label>';
      html += '<input type="text" class="calc-input" id="peerSearchInput" placeholder="Nom ou N°..." oninput="App.student.searchAllStudents()"></div>';
      html += '<div id="peerSearchResults" style="margin-bottom:1rem;"></div>';
      html += '<div id="peerComparisonTable"></div>';
      section.innerHTML = html;
    });
  } else {
    var peers;
    try { peers = JSON.parse(et.peer_view || "[]"); } catch(e) { peers = []; }
    if (!Array.isArray(peers)) peers = [];
    if (!peers.length) {
      section.classList.add("hidden");
      return;
    }
    section.innerHTML = '<div class="text-center py-4"><div class="spinner" style="margin:0 auto;"></div></div>';
    fetch(SUPABASE_URL+"/rest/v1/etudiants?numero=in.("+peers.join(",")+")&select=numero,nom,prenom", {headers:SB_HEADERS})
      .then(function(r){return r.json();})
      .then(function(peerData){
        peerData = peerData || [];
        section.innerHTML = '';
        var html = '';
        html += '<h3 class="font-bold text-lg mb-4 flex items-center gap-2"><i class="ph-fill ph-users-three" style="color:#818cf8;"></i> ' + t("peerComparison") + '</h3>';
        html += '<div class="mb-4"><label class="field-label">'+t("searchStudent")+'</label>';
        html += '<input type="text" class="calc-input" id="peerFilterInput" placeholder="Nom ou N°..." oninput="App.student.filterPeerSelect()"></div>';
        html += '<div class="mb-4"><label class="field-label">'+t("selectPeerPrompt")+'</label>';
        html += '<select class="glass-select" id="peerSelect" onchange="App.student.loadPeerComparison(this.value)"><option value="">— Choisir —</option></select></div>';
        html += '<div id="peerComparisonTable"></div>';
        section.innerHTML = html;
        var sel = document.getElementById("peerSelect");
        if (sel) {
          peerData.forEach(function(p){
            var opt = document.createElement("option");
            opt.value = p.numero;
            opt.textContent = p.nom+" "+p.prenom+" (N°"+p.numero+")";
            sel.appendChild(opt);
          });
        }
      })
      .catch(function(){
        section.innerHTML = '';
        var html = '';
        html += '<h3 class="font-bold text-lg mb-4 flex items-center gap-2"><i class="ph-fill ph-users-three" style="color:#818cf8;"></i> ' + t("peerComparison") + '</h3>';
        html += '<div class="mb-4"><label class="field-label">'+t("searchStudent")+'</label>';
        html += '<input type="text" class="calc-input" id="peerFilterInput" placeholder="Nom ou N°..." oninput="App.student.filterPeerSelect()"></div>';
        html += '<div class="mb-4"><label class="field-label">'+t("selectPeerPrompt")+'</label>';
        html += '<select class="glass-select" id="peerSelect" onchange="App.student.loadPeerComparison(this.value)"><option value="">— Choisir —</option></select></div>';
        html += '<div id="peerComparisonTable"></div>';
        section.innerHTML = html;
        var sel = document.getElementById("peerSelect");
        if (sel) {
          peers.forEach(function(pNum){
            var opt = document.createElement("option");
            opt.value = pNum;
            opt.textContent = "N°"+pNum;
            sel.appendChild(opt);
          });
        }
      });
  }
};

App.student.loadPeerComparison = function(peerNum) {
  var tableEl = document.getElementById("peerComparisonTable");
  if (!peerNum) { tableEl.innerHTML = ""; return; }
  tableEl.innerHTML = '<div style="text-align:center;padding:1.5rem;"><div class="spinner" style="margin:0 auto;"></div></div>';
  var url = SUPABASE_URL+"/rest/v1/etudiants?numero=eq." + peerNum + "&limit=1";
  fetch(url, {headers:SB_HEADERS})
    .then(function(r){return r.json();})
    .then(function(d){
      var peer = (Array.isArray(d) && d.length>0) ? d[0] : null;
      if (!peer) { tableEl.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:1rem;">'+t("noResults")+'</p>'; return; }
      App.student.renderPeerComparisonTable(peer, tableEl);
    })
    .catch(function(){
      tableEl.innerHTML='<p style="color:var(--danger);text-align:center;padding:1rem;">'+t("connectionError")+'</p>';
    });
};

App.student.renderPeerComparisonTable = function(peer, container) {
  var me = currentStudent;
  var myMoy  = me.moyenne_generale  ? parseFloat(me.moyenne_generale)  : null;
  var peerMoy = peer.moyenne_generale ? parseFloat(peer.moyenne_generale) : null;
  var peerRank = parseInt(peer.classement)||null;

  var html = '';
  html += '<div class="glass rounded-2xl p-4 mb-3" style="display:flex;gap:1.25rem;flex-wrap:wrap;align-items:center;justify-content:space-between;">';
  html += '<div style="font-weight:700;">'+t("comparisonWith")+' : '+peer.nom+' '+peer.prenom+' <span style="color:var(--text-muted);font-size:0.82rem;">N°'+peer.numero+'</span></div>';
  html += '<div style="display:flex;gap:1.5rem;">';
  html += '<div style="text-align:center;"><div class="mono" style="font-weight:800;font-size:1rem;color:#a5b4fc;">'+(peerMoy?peerMoy.toFixed(3):"—")+'</div><div style="font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;">'+t("average")+'</div></div>';
  html += '<div style="text-align:center;"><div class="mono" style="font-weight:800;font-size:1rem;color:#a5b4fc;">'+(peerRank||"—")+'</div><div style="font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;">'+t("ranking")+'</div></div>';
  if (peerRank) { var pTop=Math.ceil((peerRank/444)*100); html+='<div style="text-align:center;"><div class="mono" style="font-weight:800;font-size:1rem;color:#a5b4fc;">Top '+pTop+'%</div><div style="font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;">'+t("topPercent")+'</div></div>'; }
  html += '</div></div>';

  var expandId = "peer_expand_" + Date.now();
  html += '<div style="margin-bottom:0.75rem;text-align:right;"><button class="btn-ghost btn-sm" id="btn_toggle_' + expandId + '" onclick="App.student.toggleAllPeerDetails(\''+expandId+'\')">' + t("detailExpandAll") + '</button></div>';

  html += '<div style="overflow-x:auto;"><table class="res-table" id="tbl_'+expandId+'"><thead><tr>'+
    '<th>'+t("module")+'</th><th>'+t("coef")+'</th>'+
    '<th style="color:#818cf8;">'+t("yourGrade")+'</th>'+
    '<th style="color:#a5b4fc;">'+peer.nom.split(" ")[0]+'</th>'+
    '<th>'+t("diff")+'</th>'+
    '</tr></thead><tbody>';

  MODULES.forEach(function(mod, idx) {
    var k = mod.key;
    var myVal   = me[k+"_moy_module"]!==undefined   ? me[k+"_moy_module"]   : me["moy_"+k];
    var peerVal = peer[k+"_moy_module"]!==undefined ? peer[k+"_moy_module"] : peer["moy_"+k];
    var myN   = (myVal!==null&&myVal!==undefined&&myVal!=="Abs")   ? parseFloat(myVal)   : null;
    var peerN = (peerVal!==null&&peerVal!==undefined&&peerVal!=="Abs") ? parseFloat(peerVal) : null;
    var diff = (myN!==null&&peerN!==null) ? (myN-peerN) : null;
    var diffStr = diff===null?"—":((diff>=0?"+":"")+diff.toFixed(2));
    var diffColor = diff===null?"var(--text-muted)":diff>0.005?"var(--success)":diff<-0.005?"var(--danger)":"var(--text-muted)";
    html += '<tr style="cursor:pointer;" onclick="App.student.togglePeerDetail(\''+expandId+'\',\''+k+'\')">'+
      '<td style="font-weight:600;">'+mod.nom+'<span class="coef-badge">x'+mod.coef+'</span></td>'+
      '<td class="mono">'+mod.coef+'</td>'+
      '<td class="mono '+nc(myVal)+'">'+fn(myVal)+'</td>'+
      '<td class="mono '+nc(peerVal)+'">'+fn(peerVal)+'</td>'+
      '<td class="mono" style="font-weight:700;color:'+diffColor+';">'+diffStr+'</td>'+
      '</tr>';
    html += '<tr class="detail-row" id="peer_detail_'+expandId+'_'+k+'" style="display:none;"><td colspan="5"><div class="detail-content"><table class="res-table" style="width:100%;">';
    var subFields = [
      {label:"EMD 1",my:me[k+"_emd1"],peer:peer[k+"_emd1"]},
      {label:"EMD 2",my:me[k+"_emd2"],peer:peer[k+"_emd2"]},
      {label:"TD",my:me[k+"_td"],peer:peer[k+"_td"]},
      {label:"TP",my:me[k+"_tp"],peer:peer[k+"_tp"]},
    ];
    subFields.forEach(function(sf){
      var myN = (sf.my!=null&&sf.my!==undefined&&sf.my!=="Abs")?parseFloat(sf.my):null;
      var peerN = (sf.peer!=null&&sf.peer!==undefined&&sf.peer!=="Abs")?parseFloat(sf.peer):null;
      var d = (myN!==null&&peerN!==null)?(myN-peerN):null;
      var dStr = d===null?"—":((d>=0?"+":"")+d.toFixed(2));
      var dColor = d===null?"var(--text-muted)":d>0.005?"var(--success)":d<-0.005?"var(--danger)":"var(--text-muted)";
      html += '<tr><td style="font-weight:500; padding:0.35rem 1rem;">'+sf.label+'</td>'+
        '<td class="mono '+nc(sf.my)+'" style="color:#818cf8;">'+fn(sf.my)+'</td>'+
        '<td class="mono '+nc(sf.peer)+'" style="color:#a5b4fc;">'+fn(sf.peer)+'</td>'+
        '<td class="mono" style="font-weight:700;color:'+dColor+';">'+dStr+'</td></tr>';
    });
    html += '</table></div></td></tr>';
  });

  var overallDiff = (myMoy!==null&&peerMoy!==null) ? (myMoy-peerMoy) : null;
  var oStr = overallDiff===null?"—":((overallDiff>=0?"+":"")+overallDiff.toFixed(3));
  var oColor = overallDiff===null?"var(--text-muted)":overallDiff>0.0005?"var(--success)":overallDiff<-0.0005?"var(--danger)":"var(--text-muted)";
  html += '<tr style="background:var(--table-header);">'+
    '<td style="font-weight:800;">'+t("average")+'</td><td class="mono">—</td>'+
    '<td class="mono note-good" style="font-weight:800;">'+(myMoy?myMoy.toFixed(3):"—")+'</td>'+
    '<td class="mono note-good" style="font-weight:800;">'+(peerMoy?peerMoy.toFixed(3):"—")+'</td>'+
    '<td class="mono" style="font-weight:800;color:'+oColor+';">'+oStr+'</td>'+
    '</tr>';
  html += '</tbody></table></div>';
  container.innerHTML = html;
  window["_expandedState_"+expandId] = {};
};

App.student.togglePeerDetail = function(parentId, moduleKey) {
  var row = document.getElementById("peer_detail_"+parentId+"_"+moduleKey);
  if (!row) return;
  var state = window["_expandedState_"+parentId] || {};
  if (row.style.display === "none" || row.style.display === "") {
    row.style.display = "table-row";
    state[moduleKey] = true;
  } else {
    row.style.display = "none";
    state[moduleKey] = false;
  }
  window["_expandedState_"+parentId] = state;
  App.student.updateToggleButton(parentId);
};

App.student.toggleAllPeerDetails = function(parentId) {
  var state = window["_expandedState_"+parentId] || {};
  var allExpanded = MODULES.length > 0 && MODULES.every(function(m){ return state[m.key] === true; });
  var rows = document.querySelectorAll('[id^="peer_detail_'+parentId+'_"]');
  if (allExpanded) {
    rows.forEach(function(r){ r.style.display = "none"; });
    window["_expandedState_"+parentId] = {};
  } else {
    rows.forEach(function(r){ r.style.display = "table-row"; });
    MODULES.forEach(function(m){ state[m.key] = true; });
    window["_expandedState_"+parentId] = state;
  }
  App.student.updateToggleButton(parentId);
};

App.student.updateToggleButton = function(parentId) {
  var state = window["_expandedState_"+parentId] || {};
  var allExpanded = MODULES.length > 0 && MODULES.every(function(m){ return state[m.key] === true; });
  var btn = document.getElementById("btn_toggle_"+parentId);
  if (btn) {
    btn.textContent = allExpanded ? t("detailCollapseAll") : t("detailExpandAll");
  }
};
