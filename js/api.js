var SB_HEADERS = {
  "apikey": SUPABASE_KEY,
  "Authorization": "Bearer "+SUPABASE_KEY,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

function fsGet(col, id) {
  return fetch(SUPABASE_URL+"/rest/v1/"+col+"?numero=eq."+id+"&limit=1", {headers:SB_HEADERS})
    .then(function(r){return r.json();})
    .then(function(d){return (Array.isArray(d)&&d.length>0)?d[0]:null;});
}

function fsList(col) {
  var all = [];
  function page(offset) {
    return fetch(SUPABASE_URL+"/rest/v1/"+col+"?select=*&limit=500&offset="+offset, {headers:SB_HEADERS})
      .then(function(r){return r.json();})
      .then(function(d){
        if (!Array.isArray(d)) return {documents:all};
        all = all.concat(d);
        if (d.length===500) return page(offset+500);
        return {documents:all};
      });
  }
  return page(0);
}

function fsPatch(col, id, fields) {
  return fetch(SUPABASE_URL+"/rest/v1/"+col+"?numero=eq."+id, {
    method:"PATCH", headers:SB_HEADERS, body:JSON.stringify(fields)
  }).then(function(r) {
    if (!r.ok) {
      return r.json().then(function(err) {
        throw new Error((err&&err.message)||("HTTP "+r.status));
      }).catch(function(e) { throw e; });
    }
    return r.json();
  });
}

function fsCreate(col, data) {
  return fetch(SUPABASE_URL+"/rest/v1/"+col, {
    method:"POST", headers:SB_HEADERS, body:JSON.stringify(data)
  }).then(function(r){return r.json();});
}
