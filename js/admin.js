var App = App || {};
App.admin = {};

var adminData = [];
var adminSortKey = "numero";
var adminSortAsc = true;

App.admin.loadAdmin = function () {
  var badge = document.getElementById("adminLiteBadge");
  if (isAdminLite) badge.classList.remove("hidden");
  else badge.classList.add("hidden");

  var leaveBtn = document.getElementById("leaveAdminLiteBtn");
  leaveBtn.style.display = viewingAsAdminLite ? "inline-flex" : "none";

  document.getElementById("adminBody").innerHTML =
    '<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--text-muted);">' +
    t("loading") +
    "</td></tr>";

  fsList("etudiants")
    .then(function (data) {
      if (!data.documents) {
        adminData = [];
        App.admin.renderAdminTable([]);
        return;
      }
      adminData = data.documents.filter(Boolean);
      adminData.sort(function (a, b) {
        return a.numero - b.numero;
      });
      App.admin.renderAdminTable(adminData);

      var sel = document.getElementById("rankModuleSelect");
      sel.innerHTML = '<option value="">—</option>';
      var generalOpt = document.createElement("option");
      generalOpt.value = "general";
      generalOpt.textContent = "Moyenne Générale";
      sel.appendChild(generalOpt);
      MODULES.forEach(function (m) {
        var opt = document.createElement("option");
        opt.value = m.key;
        opt.textContent = m.nom;
        sel.appendChild(opt);
      });
      App.admin.switchTab("etudiants");
    })
    .catch(function (err) {
      console.error(err);
      document.getElementById("adminBody").innerHTML =
        '<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--danger);">Erreur de chargement des étudiants.</td></tr>';
    });

  if (isAdminLite) {
    document.getElementById("tabNotifs").classList.add("hidden");
    document.getElementById("tabComptes").classList.add("hidden");
  } else {
    document.getElementById("tabNotifs").classList.remove("hidden");
    document.getElementById("tabComptes").classList.remove("hidden");
  }

  App.admin.loadNotifs();
  App.admin.loadComptes();
  App.admin.rankModuleChanged();
};

App.admin.renderAdminTable = function (data) {
  var tbody = document.getElementById("adminBody");
  if (!data.length) {
    tbody.innerHTML =
      '<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--text-muted);">' +
      t("noResults") +
      "</td></tr>";
    return;
  }
  tbody.innerHTML = "";
  data.forEach(function (et) {
    var moy = et.moyenne_generale
      ? parseFloat(et.moyenne_generale).toFixed(3)
      : "—";
    var res = et.resultat || "—";
    var resBadge =
      res.indexOf("admis") !== -1 || res.indexOf("Félicitations") !== -1
        ? '<span class="badge badge-success" style="font-size:0.72rem;padding:2px 8px;">' +
          t("admitted") +
          "</span>"
        : res.indexOf("Rattrapage") !== -1
        ? '<span class="badge badge-warning" style="font-size:0.72rem;padding:2px 8px;">' +
          t("catchup") +
          "</span>"
        : '<span style="color:var(--text-muted);font-size:0.85rem;">' +
          res +
          "</span>";

    var accessInfo = getPeerAccessInfo(et);
    var accessCell = accessInfo.html;

    var actionBtn;
    if (isAdminLite) {
      actionBtn =
        '<button class="btn-sm btn-ghost-sm" onclick="App.admin.viewNotes(' +
        et.numero +
        ')"><i class="ph-bold ph-eye"></i> ' +
        t("view") +
        "</button>";
    } else {
      actionBtn =
        '<button class="btn-sm btn-success-sm" onclick="App.admin.openEditNotes(' +
        et.numero +
        ')"><i class="ph-bold ph-pencil"></i> ' +
        t("notes") +
        "</button> " +
        '<button class="btn-sm btn-info-sm" onclick="App.admin.openManagePeers(' +
        et.numero +
        ')" title="' +
        t("managePeers") +
        '"><i class="ph-bold ph-users-three"></i>' +
        (accessInfo.count !== 0
          ? ' <span style="font-size:0.72rem;">' + accessInfo.label + "</span>"
          : "") +
        "</button>";
    }

    var tr = document.createElement("tr");
    tr.innerHTML =
      '<td class="mono" style="font-weight:700;">' +
      et.numero +
      "</td>" +
      '<td style="font-weight:600;">' +
      et.nom +
      "</td>" +
      "<td>" +
      et.prenom +
      "</td>" +
      '<td class="mono ' +
      nc(et.moyenne_generale) +
      '" style="font-weight:700;">' +
      moy +
      "</td>" +
      '<td class="mono">' +
      (et.classement || "—") +
      "</td>" +
      "<td>" +
      resBadge +
      "</td>" +
      "<td>" +
      accessCell +
      "</td>" +
      '<td style="white-space:nowrap;">' +
      actionBtn +
      "</td>";
    tbody.appendChild(tr);
  });
};

App.admin.filterAdmin = function () {
  var q = document.getElementById("adminSearch").value.toLowerCase().trim();
  if (!adminData.length) return;
  var filtered = q
    ? adminData.filter(function (et) {
        return (
          ((et.nom || "") + " " + (et.prenom || ""))
            .toLowerCase()
            .includes(q) ||
          (et.nom || "").toLowerCase().includes(q) ||
          (et.prenom || "").toLowerCase().includes(q) ||
          String(et.numero).includes(q)
        );
      })
    : adminData;
  App.admin.renderAdminTable(filtered);
};

App.admin.sortAdmin = function (key) {
  if (adminSortKey === key) adminSortAsc = !adminSortAsc;
  else {
    adminSortKey = key;
    adminSortAsc = true;
  }
  adminData.sort(function (a, b) {
    var av = a[key],
      bv = b[key];
    if (av === null || av === undefined) av = -Infinity;
    if (bv === null || bv === undefined) bv = -Infinity;
    if (typeof av === "string")
      return adminSortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    return adminSortAsc ? av - bv : bv - av;
  });
  App.admin.renderAdminTable(adminData);
};

App.admin.switchTab = function (tabName) {
  ["etudiants", "notifs", "comptes", "classement"].forEach(function (tabId) {
    var cap = tabId.charAt(0).toUpperCase() + tabId.slice(1);
    var tabBtn = document.getElementById("tab" + cap);
    var panel = document.getElementById("panel" + cap);
    if (tabBtn) tabBtn.classList.toggle("active", tabId === tabName);
    if (panel) panel.classList.toggle("hidden", tabId !== tabName);
  });
  if (tabName === "classement") App.admin.renderModuleRanking();
};

App.admin.loadNotifs = function () {
  fetch(
    SUPABASE_URL +
      "/rest/v1/notifications?select=*&order=created_at.desc&limit=100",
    { headers: SB_HEADERS }
  )
    .then(function (r) {
      return r.json();
    })
    .then(function (notifs) {
      if (!Array.isArray(notifs)) {
        App.admin.renderNotifs([]);
        return;
      }
      var unread = notifs.filter(function (n) {
        return !n.lu;
      }).length;
      if (unread > 0) {
        document.getElementById("notifCount").textContent = unread;
        document.getElementById("notifCount").classList.remove("hidden");
      }
      App.admin.renderNotifs(notifs);
    });
};

App.admin.renderNotifs = function (notifs) {
  var el = document.getElementById("notifsList");
  if (!notifs.length) {
    el.innerHTML =
      '<p class="text-center py-8" style="color:var(--text-muted);">' +
      t("noReports") +
      "</p>";
    return;
  }
  el.innerHTML = "";
  notifs.forEach(function (n) {
    var isCompte =
      n.type === t("accountModification") ||
      n.type === "Modification de compte";
    var isConnexion =
      n.type === t("connection") || n.type === "Connexion";
    var typeColor = isConnexion || isCompte ? "var(--success)" : "var(--warning)";
    var deviceBadge = "";
    if (n.device_info) {
      var dt = n.device_info.split(":")[0].trim();
      var dc =
        dt === "mobile"
          ? "device-mobile"
          : dt === "tablet"
          ? "device-tablet"
          : "device-pc";
      var di =
        dt === "mobile"
          ? "ph-device-mobile"
          : dt === "tablet"
          ? "ph-device-tablet"
          : "ph-desktop";
      deviceBadge =
        '<div class="device-badge ' +
        dc +
        '"><i class="ph-bold ' +
        di +
        '"></i> ' +
        n.device_info +
        "</div>";
    }
    var div = document.createElement("div");
    div.className =
      "notif-card " + (n.lu ? "notif-read" : "notif-unread");
    div.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:0.75rem;flex-wrap:wrap;">' +
      "<div><div style='font-weight:700;'>" +
      n.etudiant_nom +
      " <span style='color:var(--text-muted);font-size:0.85rem;'>N°" +
      n.etudiant_numero +
      "</span></div>" +
      "<div style='margin-top:0.3rem;font-size:0.88rem;'><span style='color:#a5b4fc;'>" +
      n.module +
      "</span> — " +
      "<span style='color:" +
      typeColor +
      ";'>" +
      n.type +
      "</span></div>" +
      (n.message &&
      n.message !== t("noComment") &&
      n.message !== "(aucun commentaire)"
        ? "<div style='margin-top:0.4rem;font-size:0.85rem;color:var(--text-muted);font-style:italic;'>\"" +
          n.message +
          "\"</div>"
        : "") +
      deviceBadge +
      "</div>" +
      "<div style='font-size:0.75rem;color:var(--text-muted);white-space:nowrap;'>" +
      n.date +
      "</div></div>";
    el.appendChild(div);
  });
};

App.admin.loadComptes = function () {
  if (!adminData.length) {
    fsList("etudiants").then(function (data) {
      if (!data.documents) {
        App.admin.renderComptes([]);
        return;
      }
      var all = data.documents.filter(Boolean);
      App.admin.renderComptes(all);
    });
  } else {
    App.admin.renderComptes(adminData);
  }
};

App.admin.renderComptes = function (data) {
  var el = document.getElementById("comptesList");
  if (!data.length) {
    el.innerHTML =
      '<p class="text-center py-8" style="color:var(--text-muted);">' +
      t("noResults") +
      "</p>";
    return;
  }
  var html =
    '<div class="glass rounded-3xl overflow-hidden"><div style="overflow-x:auto;"><table class="res-table"><thead><tr>' +
    "<th>" +
    t("number") +
    "</th><th>" +
    t("lastName") +
    "</th><th>" +
    t("firstName") +
    "</th>" +
    "<th>" +
    t("customIdentifier") +
    "</th><th>" +
    t("customPassword") +
    "</th><th>" +
    t("actions") +
    "</th>" +
    "</tr></thead><tbody>";
  data.forEach(function (et) {
    var identifiant = et.custom_id || "—";
    var motdepasse = "—";
    if (isAdminLite) {
      motdepasse = et.custom_mdp ? "••••••" : "—";
    } else {
      motdepasse = et.custom_mdp ? et.custom_mdp : "—";
    }
    var actionCell = "";
    if (!isAdminLite) {
      actionCell =
        '<button class="btn-sm btn-info-sm" onclick="App.admin.editStudentAccount(' +
        et.numero +
        ')"><i class="ph-bold ph-pencil"></i> ' +
        t("editAccount") +
        "</button> " +
        '<button class="btn-sm btn-danger-sm" onclick="App.admin.resetCompte(' +
        et.numero +
        ')"><i class="ph-bold ph-arrow-counter-clockwise"></i> ' +
        t("reset") +
        "</button>";
    }
    html +=
      "<tr>" +
      '<td class="mono" style="font-weight:700;">' +
      et.numero +
      "</td>" +
      '<td style="font-weight:600;">' +
      et.nom +
      "</td><td>" +
      et.prenom +
      "</td>" +
      '<td class="mono">' +
      identifiant +
      "</td>" +
      '<td class="mono" style="word-break:break-all;">' +
      motdepasse +
      "</td>" +
      "<td>" +
      actionCell +
      "</td>" +
      "</tr>";
  });
  html += "</tbody></table></div></div>";

  // Bloc "Modifier les super-admins" avec champs supplémentaires
  if (!isAdminLite) {
    html += '<div class="glass rounded-3xl p-6 mt-6">';
    html += '<h3 class="font-bold text-lg mb-4 flex items-center gap-2"><i class="ph-bold ph-shield-check"></i> ' + t("editSuperAdmin") + '</h3>';

    // Champ pour le mot de passe admin actuel (vérification)
    html += '<div class="mb-3"><label class="field-label">Mot de passe admin actuel <span style="color:var(--danger);">*</span></label>';
    html += '<input type="password" class="calc-input" id="currentAdminPass" placeholder="Obligatoire pour toute modification"></div>';

    // Section Admin
    html += '<div class="mb-3"><label class="field-label">Admin ID</label><input type="text" class="calc-input" id="superAdminId" value="' + ADMIN_ID + '"></div>';
    html += '<div class="mb-3"><label class="field-label">Nouveau mot de passe Admin</label><input type="password" class="calc-input" id="superAdminPass" placeholder="Laisser vide pour ne pas changer"></div>';
    html += '<div class="mb-3"><label class="field-label">Confirmer le nouveau mot de passe Admin</label><input type="password" class="calc-input" id="superAdminPassConfirm" placeholder="Confirmer"></div>';

    // Section Admin Lite
    html += '<div class="mb-3"><label class="field-label">Admin Lite ID</label><input type="text" class="calc-input" id="superAdminLiteId" value="' + ADMIN_LITE_ID + '"></div>';
    html += '<div class="mb-3"><label class="field-label">Nouveau mot de passe Admin Lite</label><input type="password" class="calc-input" id="superAdminLitePass" placeholder="Laisser vide pour ne pas changer"></div>';
    html += '<div class="mb-3"><label class="field-label">Confirmer le nouveau mot de passe Admin Lite</label><input type="password" class="calc-input" id="superAdminLitePassConfirm" placeholder="Confirmer"></div>';

    html += '<button class="btn-main" style="width:auto;padding:0.6rem 1.8rem;" onclick="App.admin.saveSuperAdmins()"><i class="ph-bold ph-floppy-disk"></i> ' + t("saveChanges") + '</button>';
    html += '</div>';
  }

  el.innerHTML = html;
};

App.admin.editStudentAccount = function (num) {
  var et = adminData.find(function (e) {
    return e.numero === num;
  });
  if (!et) return;
  var d = document.createElement("div");
  d.id = "editAccountModal";
  d.className = "modal-overlay";
  var inner = document.createElement("div");
  inner.className = "modal-box";
  inner.innerHTML =
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;">' +
    '<div style="font-weight:800;font-size:1.1rem;">' +
    et.nom +
    " " +
    et.prenom +
    " — " +
    t("editAccount") +
    "</div>" +
    '<button class="btn-ghost" style="padding:0.4rem 0.8rem;" onclick="document.getElementById(\'editAccountModal\').remove()"><i class="ph-bold ph-x"></i></button>' +
    "</div>" +
    '<div class="mb-4"><label class="field-label">' +
    t("newIdentifier") +
    '</label><input type="text" class="calc-input" id="editAccountId" value="' +
    (et.custom_id || "") +
    '"></div>' +
    '<div class="mb-4"><label class="field-label">' +
    t("newPassword") +
    '</label><input type="text" class="calc-input" id="editAccountPass" value="' +
    (et.custom_mdp || "") +
    '"></div>' +
    '<div style="display:flex;gap:0.75rem;justify-content:flex-end;">' +
    '<button class="btn-ghost" onclick="document.getElementById(\'editAccountModal\').remove()">' +
    t("cancel") +
    "</button>" +
    '<button class="btn-main" style="width:auto;padding:0.6rem 1.5rem;" onclick="App.admin.saveStudentAccount(' +
    num +
    ')"><i class="ph-bold ph-floppy-disk"></i> ' +
    t("save") +
    "</button>" +
    "</div>";
  d.appendChild(inner);
  document.body.appendChild(d);
};

App.admin.saveStudentAccount = function (num) {
  var newId = document.getElementById("editAccountId").value.trim();
  var newPass = document.getElementById("editAccountPass").value;
  var fields = {};
  if (newId !== "") fields.custom_id = newId;
  else fields.custom_id = null;
  if (newPass !== "") fields.custom_mdp = newPass;
  else fields.custom_mdp = null;

  fsPatch("etudiants", String(num), fields)
    .then(function () {
      var et = adminData.find(function (e) {
        return e.numero === num;
      });
      if (et) {
        et.custom_id = fields.custom_id;
        et.custom_mdp = fields.custom_mdp;
      }
      document.getElementById("editAccountModal").remove();
      showToast(t("accountUpdated"), "success");
      App.admin.loadComptes();
    })
    .catch(function () {
      showToast(t("saveError"), "danger");
    });
};

App.admin.resetCompte = function (num) {
  if (!confirm(t("resetAccount") + num + t("confirmReset"))) return;
  fsPatch("etudiants", String(num), { custom_id: null, custom_mdp: null })
    .then(function () {
      showToast(t("accountReset") + num, "success");
      App.admin.loadComptes();
    })
    .catch(function () {
      showToast(t("saveError"), "danger");
    });
};

// NOUVELLE VERSION de saveSuperAdmins avec vérification et confirmations
App.admin.saveSuperAdmins = async function () {
  var currentPass = document.getElementById("currentAdminPass").value.trim();
  var newAdminId = document.getElementById("superAdminId").value.trim();
  var newAdminPass = document.getElementById("superAdminPass").value.trim();
  var newAdminPassConfirm = document.getElementById("superAdminPassConfirm").value.trim();
  var newLiteId = document.getElementById("superAdminLiteId").value.trim();
  var newLitePass = document.getElementById("superAdminLitePass").value.trim();
  var newLitePassConfirm = document.getElementById("superAdminLitePassConfirm").value.trim();

  // Vérification du mot de passe actuel obligatoire
  if (!currentPass) {
    showToast("Veuillez entrer votre mot de passe admin actuel.", "danger");
    return;
  }
  var currentHash = await sha256(currentPass);
  if (currentHash !== ADMIN_MDP_HASH) {
    showToast("Mot de passe actuel incorrect.", "danger");
    return;
  }

  // Vérification des IDs
  if (!newAdminId || !newLiteId) {
    showToast(t("fillAllFields"), "danger");
    return;
  }

  // Vérification des confirmations de nouveau mot de passe
  if (newAdminPass !== newAdminPassConfirm) {
    showToast("Les nouveaux mots de passe Admin ne correspondent pas.", "danger");
    return;
  }
  if (newLitePass !== newLitePassConfirm) {
    showToast("Les nouveaux mots de passe Admin Lite ne correspondent pas.", "danger");
    return;
  }

  // Mise à jour des variables globales
  ADMIN_ID = newAdminId;
  ADMIN_LITE_ID = newLiteId;
  if (newAdminPass) {
    ADMIN_MDP_HASH = await sha256(newAdminPass);
  }
  if (newLitePass) {
    ADMIN_LITE_MDP_HASH = await sha256(newLitePass);
  }

  // Sauvegarde dans le localStorage
  localStorage.setItem("admin_id_v2", ADMIN_ID);
  localStorage.setItem("admin_hash_v2", ADMIN_MDP_HASH);
  localStorage.setItem("admin_lite_id_v2", ADMIN_LITE_ID);
  localStorage.setItem("admin_lite_hash_v2", ADMIN_LITE_MDP_HASH);

  // Upsert vers Supabase
  var upsert = function (role, username, hash) {
    return fetch(SUPABASE_URL + "/rest/v1/admin_accounts", {
      method: "POST",
      headers: {
        ...SB_HEADERS,
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        role: role,
        username: username,
        password_hash: hash,
      }),
    }).then(function (r) {
      if (!r.ok) throw new Error("Erreur upsert admin_accounts");
      return r.json();
    });
  };

  try {
    await upsert("admin", ADMIN_ID, ADMIN_MDP_HASH);
    await upsert("admin_lite", ADMIN_LITE_ID, ADMIN_LITE_MDP_HASH);
    showToast(t("accountUpdated"), "success");
    // Réafficher le formulaire mis à jour
    App.admin.loadComptes();
  } catch (err) {
    console.warn("Sauvegarde Supabase échouée, localStorage utilisé.", err);
    showToast(t("accountUpdated") + " (local only)", "warning");
    App.admin.loadComptes();
  }
};

App.admin.openEditNotes = function (num) {
  var et = adminData.find(function (e) {
    return e.numero === num;
  });
  if (!et) return;
  var d = document.createElement("div");
  d.id = "editModal";
  d.className = "modal-overlay";
  var inner = document.createElement("div");
  inner.className = "modal-box";

  var hdr = document.createElement("div");
  hdr.style =
    "display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;";
  hdr.innerHTML =
    '<div style="font-weight:800;font-size:1.1rem;">' +
    et.nom +
    " " +
    et.prenom +
    " — " +
    t("notes") +
    "</div>";
  var closeBtn = document.createElement("button");
  closeBtn.className = "btn-ghost";
  closeBtn.style = "padding:0.4rem 0.8rem;";
  closeBtn.innerHTML = '<i class="ph-bold ph-x"></i>';
  closeBtn.onclick = function () {
    d.remove();
  };
  hdr.appendChild(closeBtn);
  inner.appendChild(hdr);

  var info = document.createElement("div");
  info.style =
    "background:rgba(129,140,248,0.1);border:1px solid rgba(129,140,248,0.2);border-radius:10px;padding:0.6rem 1rem;margin-bottom:1rem;font-size:0.82rem;color:#a5b4fc;";
  info.innerHTML =
    '<i class="ph-fill ph-info"></i> ' + t("autoCalculateInfo");
  inner.appendChild(info);

  var tableWrap = document.createElement("div");
  tableWrap.style = "overflow-x:auto;";
  var table = document.createElement("table");
  table.className = "res-table";
  var thead = document.createElement("thead");
  thead.innerHTML =
    "<tr><th>" +
    t("module") +
    "</th><th>EMD 1</th><th>EMD 2</th><th>TD</th><th>TP</th><th style='color:#818cf8;'>" +
    t("calculatedMoy") +
    "</th></tr>";
  table.appendChild(thead);
  var tbody = document.createElement("tbody");

  MODULES.forEach(function (mod) {
    var k = mod.key;
    var tr = document.createElement("tr");
    var td0 = document.createElement("td");
    td0.style = "font-weight:600;";
    td0.textContent = mod.nom;
    tr.appendChild(td0);
    ["emd1", "emd2", "td", "tp"].forEach(function (sub) {
      var fk = k + "_" + sub,
        v = et[fk],
        cell = document.createElement("td");
      var inp = document.createElement("input");
      inp.className = "calc-input";
      inp.id = "edit_" + fk;
      inp.value = v !== null && v !== undefined ? v : "";
      inp.placeholder = "—";
      inp.style = "padding:0.4rem 0.6rem;width:80px;";
      inp.oninput = function () {
        App.admin.updateMoyPreview(k, mod);
      };
      cell.appendChild(inp);
      tr.appendChild(cell);
    });
    var moyCell = document.createElement("td");
    moyCell.id = "preview_moy_" + k;
    moyCell.className = "mono";
    moyCell.style = "font-weight:700;color:#818cf8;";
    var mm =
      et[k + "_moy_module"] !== undefined
        ? et[k + "_moy_module"]
        : et["moy_" + k];
    moyCell.textContent =
      mm !== null && mm !== undefined ? parseFloat(mm).toFixed(2) : "—";
    tr.appendChild(moyCell);
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  tableWrap.appendChild(table);
  inner.appendChild(tableWrap);

  var footer = document.createElement("div");
  footer.style =
    "margin-top:1.25rem;display:flex;gap:0.75rem;justify-content:flex-end;";
  var cancelBtn = document.createElement("button");
  cancelBtn.className = "btn-ghost";
  cancelBtn.textContent = t("cancel");
  cancelBtn.onclick = function () {
    d.remove();
  };
  var saveBtn = document.createElement("button");
  saveBtn.className = "btn-main";
  saveBtn.style = "width:auto;padding:0.6rem 1.5rem;";
  saveBtn.innerHTML =
    '<i class="ph-bold ph-floppy-disk"></i> ' + t("save");
  saveBtn.onclick = function () {
    App.admin.saveEditNotes(num, d);
  };
  footer.appendChild(cancelBtn);
  footer.appendChild(saveBtn);
  inner.appendChild(footer);
  d.appendChild(inner);
  document.body.appendChild(d);
};

App.admin.updateMoyPreview = function (key, mod) {
  var getVal = function (sub) {
    var el = document.getElementById("edit_" + key + "_" + sub);
    if (!el || el.value.trim() === "") return null;
    if (el.value.trim() === "Abs") return "Abs";
    return parseFloat(el.value.replace(",", "."));
  };
  var moy = calcMoyModule(
    getVal("emd1"),
    getVal("emd2"),
    getVal("td"),
    getVal("tp")
  );
  var preview = document.getElementById("preview_moy_" + key);
  if (preview) {
    preview.textContent =
      moy !== null ? parseFloat(moy).toFixed(2) : "—";
    preview.style.color =
      moy === null
        ? "var(--text-muted)"
        : moy < 5
        ? "var(--danger)"
        : moy < 10
        ? "var(--warning)"
        : "var(--success)";
  }
};

App.admin.saveEditNotes = function (num, modal) {
  var et = adminData.find(function (e) {
    return e.numero === num;
  });
  if (!et) return;
  var fields = {},
    tempEt = Object.assign({}, et),
    hasChanges = false;
  MODULES.forEach(function (mod) {
    var k = mod.key,
      modChanged = false;
    ["emd1", "emd2", "td", "tp"].forEach(function (sub) {
      var fk = k + "_" + sub,
        el = document.getElementById("edit_" + fk);
      if (!el) return;
      var v = el.value.trim(),
        val;
      if (v === "") {
        val = et[fk];
      } else if (v === "Abs") {
        val = "Abs";
      } else {
        var n = parseFloat(v);
        val = isNaN(n) ? et[fk] : n;
      }
      if (String(val) !== String(et[fk])) {
        fields[fk] = val;
        hasChanges = true;
        modChanged = true;
      }
      tempEt[fk] = val;
    });
    if (modChanged) {
      var e1 = tempEt[k + "_emd1"],
        e2 = tempEt[k + "_emd2"],
        emdVals = [];
      if (e1 !== null && e1 !== undefined && e1 !== "Abs")
        emdVals.push(parseFloat(e1));
      if (e2 !== null && e2 !== undefined && e2 !== "Abs")
        emdVals.push(parseFloat(e2));
      var moyEmd =
        emdVals.length > 0
          ? Math.round(
              (emdVals.reduce(function (a, b) {
                return a + b;
              }, 0) /
                emdVals.length) *
                10000
            ) / 10000
          : null;
      fields[k + "_moy_emd"] = moyEmd;
      tempEt[k + "_moy_emd"] = moyEmd;
      var moyMod = calcMoyModule(
        tempEt[k + "_emd1"],
        tempEt[k + "_emd2"],
        tempEt[k + "_td"],
        tempEt[k + "_tp"]
      );
      fields["moy_" + k] = moyMod;
      fields[k + "_moy_module"] = moyMod;
      tempEt["moy_" + k] = moyMod;
      tempEt[k + "_moy_module"] = moyMod;
    }
  });
  if (!hasChanges) {
    if (modal) modal.remove();
    showToast(t("noChanges"), "info");
    return;
  }
  fields["moyenne_generale"] = calcMoyGenerale(tempEt);
  fsPatch("etudiants", String(num), fields)
    .then(function () {
      for (var k in fields) et[k] = fields[k];
      if (modal) modal.remove();
      showToast(t("notesSaved"), "success");
      App.admin.renderAdminTable(adminData);
    })
    .catch(function () {
      showToast(t("saveError"), "danger");
    });
};

App.admin.viewNotes = function (num) {
  var et = adminData.find(function (e) {
    return e.numero === num;
  });
  if (!et) return;
  var d = document.createElement("div");
  d.className = "modal-overlay";
  var inner = document.createElement("div");
  inner.className = "modal-box";

  var hdr = document.createElement("div");
  hdr.style =
    "display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;";
  hdr.innerHTML =
    '<div style="font-weight:800;font-size:1.1rem;">' +
    et.nom +
    " " +
    et.prenom +
    " — " +
    t("notes") +
    "</div>";
  var closeBtn = document.createElement("button");
  closeBtn.className = "btn-ghost";
  closeBtn.style = "padding:0.4rem 0.8rem;";
  closeBtn.innerHTML = '<i class="ph-bold ph-x"></i>';
  closeBtn.onclick = function () {
    d.remove();
  };
  hdr.appendChild(closeBtn);
  inner.appendChild(hdr);

  var tableWrap = document.createElement("div");
  tableWrap.style = "overflow-x:auto;";
  var table = document.createElement("table");
  table.className = "res-table";
  var thead = document.createElement("thead");
  thead.innerHTML =
    "<tr><th>" +
    t("module") +
    "</th><th>" +
    t("coef") +
    "</th><th>EMD 1</th><th>EMD 2</th><th>TD</th><th>TP</th><th>" +
    t("moyModule") +
    "</th></tr>";
  table.appendChild(thead);
  var tbody = document.createElement("tbody");

  MODULES.forEach(function (mod) {
    var k = mod.key,
      tr = document.createElement("tr");
    var vals = [
      et[k + "_emd1"],
      et[k + "_emd2"],
      et[k + "_td"],
      et[k + "_tp"],
      et[k + "_moy_module"] !== undefined
        ? et[k + "_moy_module"]
        : et["moy_" + k],
    ];
    var td0 = document.createElement("td");
    td0.style = "font-weight:600;";
    td0.textContent = mod.nom;
    tr.appendChild(td0);
    var td1 = document.createElement("td");
    td1.className = "mono";
    td1.textContent = mod.coef;
    tr.appendChild(td1);
    vals.forEach(function (v) {
      var cell = document.createElement("td");
      cell.className = "mono " + nc(v);
      cell.innerHTML = fn(v);
      tr.appendChild(cell);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  tableWrap.appendChild(table);
  inner.appendChild(tableWrap);

  var footer = document.createElement("div");
  footer.style =
    "margin-top:1.25rem;display:flex;justify-content:flex-end;";
  var closeBtn2 = document.createElement("button");
  closeBtn2.className = "btn-ghost";
  closeBtn2.textContent = t("close");
  closeBtn2.onclick = function () {
    d.remove();
  };
  footer.appendChild(closeBtn2);
  inner.appendChild(footer);
  d.appendChild(inner);
  document.body.appendChild(d);
};

// --- Peer management (admin) ---
App.admin.openManagePeers = function (num) {
  var et = adminData.find(function (e) {
    return e.numero === num;
  });
  if (!et) return;

  var isAll = et.peer_view === "ALL";
  var currentPeers = [];
  if (!isAll) {
    try {
      currentPeers = JSON.parse(et.peer_view || "[]");
    } catch (e) {
      currentPeers = [];
    }
    if (!Array.isArray(currentPeers)) currentPeers = [];
  }
  window._editingPeers = {
    num: num,
    peers: currentPeers.map(Number),
    isAll: isAll,
  };

  var d = document.createElement("div");
  d.id = "peersModal";
  d.className = "modal-overlay";
  var inner = document.createElement("div");
  inner.className = "modal-box";

  inner.innerHTML =
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;">' +
    '<div><div style="font-weight:800;font-size:1.1rem;">' +
    t("managePeers") +
    "</div>" +
    '<div style="font-size:0.85rem;color:var(--text-muted);">' +
    et.nom +
    " " +
    et.prenom +
    " — N°" +
    num +
    "</div></div>" +
    '<button class="btn-ghost" style="padding:0.4rem 0.8rem;" onclick="document.getElementById(\'peersModal\').remove()"><i class="ph-bold ph-x"></i></button>' +
    "</div>" +
    '<div style="margin-bottom:1rem;">' +
    '<div class="toggle-wrap ' +
    (isAll ? "active-all" : "") +
    '" id="allAccessWrap" onclick="App.admin.toggleAllAccess()">' +
    '<div class="toggle-knob-track ' +
    (isAll ? "on" : "") +
    '" id="allAccessTrack"><div class="toggle-knob"></div></div>' +
    "<div>" +
    '<div style="font-weight:700;font-size:0.88rem;">' +
    (isAll ? "⭐ " : "") +
    t("seeAllLabel") +
    "</div>" +
    '<div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;" id="allAccessSubtext">' +
    (isAll ? t("seeAllDesc") : "") +
    "</div>" +
    "</div></div></div>" +
    '<div id="peerSpecificSection" class="' +
    (isAll ? "hidden" : "") +
    '">' +
    '<div style="margin-bottom:0.5rem;font-size:0.8rem;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;">' +
    t("authorizedPeers") +
    "</div>" +
    '<div id="peerChipsArea" style="min-height:40px;display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:1rem;"></div>' +
    '<div style="margin-bottom:0.5rem;"><label class="field-label">' +
    t("searchStudent") +
    '</label><input type="text" class="calc-input" id="peerSearchInput" placeholder="Nom ou N°..." oninput="App.admin.searchPeersToAdd(' +
    num +
    ')"></div>' +
    '<div id="peerSearchResults" style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem;min-height:32px;"></div>' +
    "</div>" +
    '<div style="display:flex;gap:0.75rem;justify-content:flex-end;">' +
    '<button class="btn-ghost" onclick="document.getElementById(\'peersModal\').remove()">' +
    t("cancel") +
    "</button>" +
    '<button class="btn-main" style="width:auto;padding:0.6rem 1.5rem;" onclick="App.admin.savePeerView()"><i class="ph-bold ph-floppy-disk"></i> ' +
    t("saveChanges") +
    "</button>" +
    "</div>";

  d.appendChild(inner);
  document.body.appendChild(d);
  App.admin.renderPeerChips();
};

App.admin.toggleAllAccess = function () {
  window._editingPeers.isAll = !window._editingPeers.isAll;
  var isAll = window._editingPeers.isAll;
  var wrap = document.getElementById("allAccessWrap");
  var track = document.getElementById("allAccessTrack");
  var sub = document.getElementById("allAccessSubtext");
  var spec = document.getElementById("peerSpecificSection");
  if (wrap) wrap.classList.toggle("active-all", isAll);
  if (track) track.classList.toggle("on", isAll);
  if (sub) sub.textContent = isAll ? t("seeAllDesc") : "";
  if (spec) spec.classList.toggle("hidden", isAll);
};

App.admin.renderPeerChips = function () {
  var el = document.getElementById("peerChipsArea");
  if (!el) return;
  var peers = window._editingPeers.peers;
  if (!peers.length) {
    el.innerHTML =
      '<span style="font-size:0.82rem;color:var(--text-muted);font-style:italic;">' +
      t("noPeers") +
      "</span>";
    return;
  }
  el.innerHTML = "";
  peers.forEach(function (pNum) {
    var peer = adminData.find(function (e) {
      return Number(e.numero) === Number(pNum);
    });
    var name = peer
      ? peer.nom + " " + peer.prenom + " (N°" + pNum + ")"
      : "N°" + pNum;
    var chip = document.createElement("div");
    chip.className = "peer-chip";
    chip.innerHTML =
      '<span style="font-size:0.82rem;">' +
      name +
      "</span>" +
      '<button onclick="App.admin.removePeerChip(' +
      pNum +
      ')" style="background:none;border:none;cursor:pointer;color:var(--danger);padding:0 2px;"><i class="ph-bold ph-x" style="font-size:0.75rem;"></i></button>';
    el.appendChild(chip);
  });
};

App.admin.searchPeersToAdd = function (excludeNum) {
  var q = document.getElementById("peerSearchInput").value.toLowerCase().trim();
  var el = document.getElementById("peerSearchResults");
  if (!el) return;
  if (!q) {
    el.innerHTML = "";
    return;
  }
  var peers = window._editingPeers.peers;
  var results = adminData
    .filter(function (et) {
      if (Number(et.numero) === Number(excludeNum)) return false;
      if (peers.indexOf(Number(et.numero)) !== -1) return false;
      return (
        (et.nom + " " + et.prenom).toLowerCase().includes(q) ||
        String(et.numero).includes(q)
      );
    })
    .slice(0, 8);
  el.innerHTML = "";
  if (!results.length) {
    el.innerHTML =
      '<span style="font-size:0.82rem;color:var(--text-muted);">' +
      t("noResults") +
      "</span>";
    return;
  }
  results.forEach(function (et) {
    var btn = document.createElement("button");
    btn.className = "btn-sm btn-info-sm";
    btn.innerHTML =
      '<i class="ph-bold ph-plus"></i> ' +
      et.nom +
      " " +
      et.prenom +
      ' <span style="opacity:0.6;">N°' +
      et.numero +
      "</span>";
    btn.onclick = function () {
      window._editingPeers.peers.push(Number(et.numero));
      document.getElementById("peerSearchInput").value = "";
      document.getElementById("peerSearchResults").innerHTML = "";
      App.admin.renderPeerChips();
      showToast(t("peerAdded"), "success");
    };
    el.appendChild(btn);
  });
};

App.admin.removePeerChip = function (pNum) {
  var idx = window._editingPeers.peers.indexOf(Number(pNum));
  if (idx !== -1) window._editingPeers.peers.splice(idx, 1);
  App.admin.renderPeerChips();
};

App.admin.savePeerView = function () {
  var num = window._editingPeers.num;
  var peers = window._editingPeers.peers;
  var isAll = window._editingPeers.isAll;
  var val = isAll
    ? "ALL"
    : peers.length > 0
    ? JSON.stringify(peers)
    : null;

  fsPatch("etudiants", String(num), { peer_view: val })
    .then(function () {
      var et = adminData.find(function (e) {
        return e.numero === num;
      });
      if (et) et.peer_view = val;
      showToast(t("peerSaved"), "success");
      App.admin.renderAdminTable(adminData);
      var modal = document.getElementById("peersModal");
      if (modal) modal.remove();
    })
    .catch(function (err) {
      var msg = String(err && err.message ? err.message : err);
      if (
        msg.indexOf("does not exist") !== -1 ||
        msg.indexOf("column") !== -1 ||
        msg.indexOf("204") !== -1 ||
        msg.indexOf("PGRST") !== -1
      ) {
        showToast(t("peerViewColMissing"), "danger");
      } else {
        showToast(t("saveError") + " (" + msg.slice(0, 60) + ")", "danger");
      }
    });
};

App.admin.rankModuleChanged = function () {
  var val = document.getElementById("rankModuleSelect").value;
  var subWrap = document.getElementById("rankSubSelectWrap");
  if (val === "" || val === "general") {
    subWrap.classList.add("hidden");
  } else {
    subWrap.classList.remove("hidden");
  }
  App.admin.renderModuleRanking();
};

App.admin.renderModuleRanking = function () {
  var sel = document.getElementById("rankModuleSelect");
  var moduleKey = sel.value;
  var container = document.getElementById("moduleRankingTable");
  var searchEl = document.getElementById("rankSearchInput");
  var searchQ = searchEl ? searchEl.value.toLowerCase().trim() : "";
  var subSel = document.getElementById("rankSubSelect");
  var subCrit = subSel ? subSel.value : "moy_module";

  if (!moduleKey) {
    container.innerHTML =
      '<p style="padding:2rem;text-align:center;color:var(--text-muted);">' +
      t("selectModuleRanking") +
      "</p>";
    return;
  }

  if (moduleKey === "general") {
    var allRanked = adminData
      .map(function (et) {
        var moy = et.moyenne_generale ? parseFloat(et.moyenne_generale) : null;
        if (moy !== null && !isNaN(moy))
          return { numero: et.numero, nom: et.nom, prenom: et.prenom, val: moy };
        return null;
      })
      .filter(Boolean)
      .sort(function (a, b) {
        return b.val - a.val;
      });
    allRanked.forEach(function (r, i) {
      r.globalRank = i + 1;
    });
    var results = searchQ
      ? allRanked.filter(function (r) {
          return (
            (r.nom + " " + r.prenom).toLowerCase().includes(searchQ) ||
            String(r.numero).includes(searchQ)
          );
        })
      : allRanked;
    if (!results.length) {
      container.innerHTML =
        '<p style="padding:2rem;text-align:center;color:var(--text-muted);">' +
        (searchQ ? t("noResults") : "Aucun étudiant") +
        "</p>";
      return;
    }
    var html = "";
    if (searchQ)
      html +=
        '<div style="padding:0.5rem 1rem;font-size:0.8rem;color:var(--text-muted);border-bottom:1px solid var(--glass-border);">' +
        results.length +
        " / " +
        allRanked.length +
        " étudiants</div>";
    html +=
      '<table class="res-table"><thead><tr>' +
      "<th>Rang</th><th>" +
      t("number") +
      "</th><th>" +
      t("lastName") +
      "</th><th>" +
      t("firstName") +
      "</th>" +
      "<th>Moyenne Générale</th>" +
      "</tr></thead><tbody>";
    results.forEach(function (r) {
      var topBadge =
        r.globalRank <= 3
          ? '<span class="badge badge-diamond" style="margin-left:6px;padding:2px 6px;font-size:0.7rem;">' +
            t("diamond") +
            "</span>"
          : "";
      html +=
        "<tr>" +
        '<td class="mono" style="font-weight:700;">' +
        r.globalRank +
        topBadge +
        "</td>" +
        '<td class="mono">' +
        r.numero +
        "</td>" +
        '<td style="font-weight:600;">' +
        r.nom +
        "</td>" +
        "<td>" +
        r.prenom +
        "</td>" +
        '<td class="mono ' +
        nc(r.val) +
        '" style="font-weight:700;">' +
        r.val.toFixed(3) +
        getGradeBadge(r.val) +
        "</td>" +
        "</tr>";
    });
    html += "</tbody></table>";
    container.innerHTML = html;
    return;
  }

  var mod = MODULES.find(function (m) {
    return m.key === moduleKey;
  });
  if (!mod) return;

  var fieldKey;
  if (subCrit === "moy_module") fieldKey = "moy_" + moduleKey;
  else fieldKey = moduleKey + "_" + subCrit;

  var allRanked = adminData
    .map(function (et) {
      var val = et[fieldKey];
      if (val !== null && val !== undefined && val !== "Abs")
        return {
          numero: et.numero,
          nom: et.nom,
          prenom: et.prenom,
          val: parseFloat(val),
        };
      return null;
    })
    .filter(Boolean)
    .sort(function (a, b) {
      return b.val - a.val;
    });
  allRanked.forEach(function (r, i) {
    r.globalRank = i + 1;
  });

  var results = searchQ
    ? allRanked.filter(function (r) {
        return (
          (r.nom + " " + r.prenom).toLowerCase().includes(searchQ) ||
          String(r.numero).includes(searchQ)
        );
      })
    : allRanked;

  if (!results.length) {
    var subLabel =
      subCrit === "emd1"
        ? "EMD 1"
        : subCrit === "emd2"
        ? "EMD 2"
        : subCrit.toUpperCase();
    container.innerHTML =
      '<p style="padding:2rem;text-align:center;color:var(--text-muted);">' +
      (searchQ
        ? t("noResults")
        : "Aucun étudiant pour " + mod.nom + " (" + subLabel + ")") +
      "</p>";
    return;
  }

  var subLabel =
    subCrit === "moy_module" ? "Moyenne module" : subCrit.toUpperCase();
  var html = "";
  if (searchQ)
    html +=
      '<div style="padding:0.5rem 1rem;font-size:0.8rem;color:var(--text-muted);border-bottom:1px solid var(--glass-border);">' +
      results.length +
      " / " +
      allRanked.length +
      " étudiants</div>";
  html +=
    '<table class="res-table"><thead><tr>' +
    "<th>Rang</th><th>" +
    t("number") +
    "</th><th>" +
    t("lastName") +
    "</th><th>" +
    t("firstName") +
    "</th>" +
    "<th>" +
    mod.nom +
    " — " +
    subLabel +
    "</th>" +
    "</tr></thead><tbody>";
  results.forEach(function (r) {
    var topBadge =
      r.globalRank <= 3
        ? '<span class="badge badge-diamond" style="margin-left:6px;padding:2px 6px;font-size:0.7rem;">' +
          t("diamond") +
          "</span>"
        : "";
    html +=
      "<tr>" +
      '<td class="mono" style="font-weight:700;">' +
      r.globalRank +
      topBadge +
      "</td>" +
      '<td class="mono">' +
      r.numero +
      "</td>" +
      '<td style="font-weight:600;">' +
      r.nom +
      "</td>" +
      "<td>" +
      r.prenom +
      "</td>" +
      '<td class="mono ' +
      nc(r.val) +
      '" style="font-weight:700;">' +
      r.val.toFixed(2) +
      getGradeBadge(r.val) +
      "</td>" +
      "</tr>";
  });
  html += "</tbody></table>";
  container.innerHTML = html;
};
