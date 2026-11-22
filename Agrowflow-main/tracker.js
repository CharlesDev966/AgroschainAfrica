// Shared storage layer: Firebase Realtime Database (REST) or localStorage demo mode.
(function () {
  const cfg = window.AGC_CONFIG || {};
  const base = (cfg.FIREBASE_DB_URL || "").replace(/\/$/, "");
  const demo = !base;

  async function fb(path, method, body, query) {
    const url = base + "/" + path + ".json" + (query ? "?" + query : "");
    const r = await fetch(url, {
      method: method,
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  }
  const key = (id) => "agc:" + id;
  function loadLocal(id) {
    try { return JSON.parse(localStorage.getItem(key(id))) || { points: [] }; }
    catch (e) { return { points: [] }; }
  }
  function saveLocal(id, d) {
    try { localStorage.setItem(key(id), JSON.stringify(d)); } catch (e) {}
  }

  window.AGC = {
    demo: demo,
    cleanId: function (s) { return (s || "").toUpperCase().replace(/[^A-Z0-9\-]/g, "").slice(0, 24); },
    async sendPoint(id, p) {
      if (demo) { const d = loadLocal(id); d.points.push(p); d.points = d.points.slice(-300); saveLocal(id, d); return; }
      await fb("trips/" + id + "/points", "POST", p);
    },
    async setStatus(id, state) {
      if (demo) { const d = loadLocal(id); d.status = state; saveLocal(id, d); return; }
      await fb("trips/" + id + "/status", "PUT", { state: state, at: Date.now() });
    },
    async getTrip(id) {
      if (demo) { const d = loadLocal(id); return { status: d.status || null, points: d.points || [] }; }
      const pts = await fb("trips/" + id + "/points", "GET", undefined, 'orderBy=%22%24key%22&limitToLast=200');
      const st = await fb("trips/" + id + "/status", "GET");
      const list = pts ? Object.values(pts).sort((a, b) => a.t - b.t) : [];
      return { status: st ? st.state : null, points: list };
    }
  };
})();
