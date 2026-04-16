import { useState, useEffect, useCallback, useRef } from "react";

// ─── Config ───────────────────────────────────────────────────────────────────
const API_BASE = "http://snj-global-agency-production.up.railway.app/api";
const AUTO_REFRESH_INTERVAL = 10000; // 10 seconds

// ─── Status Config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending_review: { label: "Pending Review", color: "#92400e", bg: "#fef3c7", dot: "#d97706", border: "#fcd34d" },
  pending:        { label: "Pending",         color: "#92400e", bg: "#fef3c7", dot: "#d97706", border: "#fcd34d" },
  in_progress:    { label: "In Progress",     color: "#1e40af", bg: "#dbeafe", dot: "#3b82f6", border: "#93c5fd" },
  delivering:     { label: "Delivering",      color: "#065f46", bg: "#d1fae5", dot: "#10b981", border: "#6ee7b7" },
  completed:      { label: "Completed",       color: "#14532d", bg: "#dcfce7", dot: "#22c55e", border: "#86efac" },
  cancelled:      { label: "Cancelled",       color: "#7f1d1d", bg: "#fee2e2", dot: "#ef4444", border: "#fca5a5" },
};

const ALL_STATUSES = Object.entries(STATUS_CONFIG).map(([key, val]) => ({ value: key, label: val.label }));

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => (n ?? 0).toLocaleString();
const progressColor = (pct) => {
  if (pct >= 100) return "#22c55e";
  if (pct >= 50)  return "#3b82f6";
  if (pct > 0)    return "#f59e0b";
  return "#e5e7eb";
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || { label: status, color: "#374151", bg: "#f3f4f6", dot: "#9ca3af", border: "#d1d5db" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      letterSpacing: "0.02em", whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
};

const MiniBar = ({ value, total, label, color }) => {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
  const c = color || progressColor(pct);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: c }}>{value ?? 0}/{total}</span>
      </div>
      <div style={{ height: 4, borderRadius: 999, background: "#e5e7eb", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: c, borderRadius: 999, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminWorkerRequests() {
  const [requests, setRequests]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [silentLoad, setSilentLoad] = useState(false);
  const [error, setError]           = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [countdown, setCountdown]   = useState(10);

  const [search, setSearch]               = useState("");
  const [filterStatus, setFilterStatus]   = useState("all");
  const [filterCountry, setFilterCountry] = useState("all");
  const [sortKey, setSortKey]             = useState("created_at");
  const [sortDir, setSortDir]             = useState("desc");
  const [page, setPage]                   = useState(1);
  const PAGE_SIZE = 10;

  const [selected, setSelected]     = useState(null);
  const [modalOpen, setModalOpen]   = useState(false);
  const [updating, setUpdating]     = useState(false);
  const [updateForm, setUpdateForm] = useState({});
  const [updateMsg, setUpdateMsg]   = useState(null);

  const timerRef     = useRef(null);
  const countdownRef = useRef(null);

  // ─── Fetch ────────────────────────────────────────────────────────────────
  const fetchRequests = useCallback(async (silent = false) => {
    if (silent) setSilentLoad(true);
    else { setLoading(true); setError(null); }

    try {
      const res = await fetch(`http://snj-global-agency-production.up.railway.app/api/worker-requests`, {
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error ${res.status}: ${text.slice(0, 120)}`);
      }

      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to load requests");

      setRequests(json.data || []);
      setLastRefresh(new Date());
      setError(null);
      setCountdown(10);
    } catch (e) {
      if (!silent) setError(e.message || "Could not connect to server.");
    } finally {
      setLoading(false);
      setSilentLoad(false);
    }
}, []);

  // ─── Auto-refresh ─────────────────────────────────────────────────────────
  useEffect(() => {
    fetchRequests(false);

    timerRef.current = setInterval(() => fetchRequests(true), AUTO_REFRESH_INTERVAL);

    countdownRef.current = setInterval(() => {
      setCountdown(prev => (prev <= 1 ? 10 : prev - 1));
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(countdownRef.current);
    };
  }, [fetchRequests]);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [search, filterStatus, filterCountry]);

  // ─── Derived ──────────────────────────────────────────────────────────────
  const countries = [...new Set(requests.map(r => r.destination_country).filter(Boolean))].sort();

  const filtered = requests
    .filter(r => {
      if (filterStatus !== "all" && r.status !== filterStatus) return false;
      if (filterCountry !== "all" && r.destination_country !== filterCountry) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          (r.company_name || "").toLowerCase().includes(q) ||
          (r.job_title    || "").toLowerCase().includes(q) ||
          (r.destination_country || "").toLowerCase().includes(q) ||
          String(r.id).includes(q) ||
          (r.employer_company || "").toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 :  1;
      if (va > vb) return sortDir === "asc" ?  1 : -1;
      return 0;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = {
    total:       requests.length,
    totalReq:    requests.reduce((a, r) => a + (r.workers_requested || 0), 0),
    totalDel:    requests.reduce((a, r) => a + (r.workers_delivered || 0), 0),
    pending:     requests.filter(r => r.status === "pending_review" || r.status === "pending").length,
    in_progress: requests.filter(r => r.status === "in_progress").length,
    delivering:  requests.filter(r => r.status === "delivering").length,
    completed:   requests.filter(r => r.status === "completed").length,
    cancelled:   requests.filter(r => r.status === "cancelled").length,
  };

  // ─── Sort toggle ──────────────────────────────────────────────────────────
  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const SortIcon = ({ col }) => (
    <span style={{ marginLeft: 4, opacity: sortKey === col ? 1 : 0.35, fontSize: 9 }}>
      {sortKey === col ? (sortDir === "asc" ? "▲" : "▼") : "⇅"}
    </span>
  );

  // ─── Open modal ───────────────────────────────────────────────────────────
  const openDetail = (row) => {
    setSelected(row);
    setUpdateForm({
      status:             row.status            || "pending_review",
      workers_delivered:  row.workers_delivered  ?? 0,
      workers_submitted:  row.workers_submitted  ?? 0,
      workers_verified:   row.workers_verified   ?? 0,
      workers_selected:   row.workers_selected   ?? 0,
      notes:              row.notes              || "",
    });
    setUpdateMsg(null);
    setModalOpen(true);
  };

  // ─── Submit update ────────────────────────────────────────────────────────
  const handleUpdate = async () => {
    if (!selected) return;
    setUpdating(true);
    setUpdateMsg(null);
    try {
      const res  = await fetch(`http://snj-global-agency-production.up.railway.app/api/worker-requests/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateForm),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Update failed");

      setUpdateMsg({ ok: true, text: "✓ Request updated successfully!" });
      setRequests(prev => prev.map(r => r.id === selected.id ? { ...r, ...updateForm } : r));
      setSelected(prev => ({ ...prev, ...updateForm }));

      // Auto-close after success
      setTimeout(() => setModalOpen(false), 1500);
    } catch (e) {
      setUpdateMsg({ ok: false, text: "✕ " + (e.message || "Update failed.") });
    } finally {
      setUpdating(false);
    }
  };

  // ─── Styles ───────────────────────────────────────────────────────────────
  const S = {
    th: {
      padding: "11px 14px", fontSize: 11, fontWeight: 700,
      color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em",
      textAlign: "left", cursor: "pointer", whiteSpace: "nowrap",
      borderBottom: "2px solid #e5e7eb", userSelect: "none",
      background: "#f9fafb",
    },
    td: {
      padding: "12px 14px", fontSize: 13, color: "#1f2937",
      borderBottom: "1px solid #f1f5f9", verticalAlign: "middle",
    },
    input: {
      width: "100%", padding: "9px 12px", borderRadius: 8,
      border: "1.5px solid #d1d5db", fontSize: 13,
      background: "#f9fafb", outline: "none", boxSizing: "border-box",
      fontFamily: "inherit", transition: "border-color 0.15s",
    },
    label: {
      fontSize: 11, fontWeight: 700, color: "#374151",
      display: "block", marginBottom: 5, textTransform: "uppercase",
      letterSpacing: "0.06em",
    },
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#f1f5f9", minHeight: "100vh", padding: "24px" }}>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: 20, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 4, height: 24, background: "#EAB308", borderRadius: 4 }} />
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0B1F3A", margin: 0, letterSpacing: "-0.02em" }}>
              Worker Requests
            </h1>
            {silentLoad && (
              <span style={{ fontSize: 11, color: "#6b7280", background: "#e0e7ff", padding: "2px 8px", borderRadius: 999, fontWeight: 500 }}>
                Refreshing…
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 14 }}>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>
              {lastRefresh ? `Last updated: ${lastRefresh.toLocaleTimeString("en-GB")}` : "Loading…"}
            </span>
            <span style={{ fontSize: 11, color: "#d1d5db" }}>·</span>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>
              Auto-refresh in
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 20, height: 20, borderRadius: "50%", background: "#0B1F3A",
                color: "#EAB308", fontSize: 10, fontWeight: 700, marginLeft: 4,
              }}>{countdown}</span>s
            </span>
          </div>
        </div>
        <button
          onClick={() => fetchRequests(false)}
          style={{
            display: "flex", alignItems: "center", gap: 6, padding: "9px 18px",
            background: "#0B1F3A", color: "#EAB308", border: "none", borderRadius: 9,
            fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: "0.02em",
          }}
        >
          ↻ Refresh Now
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: 18 }}>
        {[
          { label: "Total Requests", value: stats.total,       accent: "#0B1F3A" },
          { label: "Workers Req.",   value: fmt(stats.totalReq), accent: "#4f46e5" },
          { label: "Delivered",      value: fmt(stats.totalDel), accent: "#059669" },
          { label: "Pending",        value: stats.pending,      accent: "#d97706" },
          { label: "In Progress",    value: stats.in_progress,  accent: "#3b82f6" },
          { label: "Delivering",     value: stats.delivering,   accent: "#10b981" },
          { label: "Completed",      value: stats.completed,    accent: "#22c55e" },
          { label: "Cancelled",      value: stats.cancelled,    accent: "#ef4444" },
        ].map(s => (
          <div key={s.label} style={{
            background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
            padding: "12px 14px", borderTop: `3px solid ${s.accent}`,
          }}>
            <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.accent, lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div style={{
        background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
        padding: "12px 14px", marginBottom: 14,
        display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center",
      }}>
        <div style={{ position: "relative", flex: "1 1 220px", minWidth: 180 }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#9ca3af", pointerEvents: "none" }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search company, job, country, ID…"
            style={{ ...S.input, paddingLeft: 32 }}
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: "9px 12px", borderRadius: 8, border: "1.5px solid #d1d5db", fontSize: 13, background: "#f9fafb", cursor: "pointer", fontFamily: "inherit" }}
        >
          <option value="all">All Statuses</option>
          {ALL_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select
          value={filterCountry}
          onChange={e => setFilterCountry(e.target.value)}
          style={{ padding: "9px 12px", borderRadius: 8, border: "1.5px solid #d1d5db", fontSize: 13, background: "#f9fafb", cursor: "pointer", fontFamily: "inherit" }}
        >
          <option value="all">All Countries</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {(search || filterStatus !== "all" || filterCountry !== "all") && (
          <button
            onClick={() => { setSearch(""); setFilterStatus("all"); setFilterCountry("all"); }}
            style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #fca5a5", background: "#fef2f2", color: "#b91c1c", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
          >
            ✕ Clear
          </button>
        )}
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap" }}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Table ── */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
            <div style={{ fontSize: 14, color: "#6b7280", fontWeight: 500 }}>Loading worker requests…</div>
          </div>
        ) : error ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#b91c1c", marginBottom: 6 }}>Failed to load data</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 8, maxWidth: 400, margin: "0 auto 16px" }}>{error}</div>
            <div style={{ fontSize: 12, color: "#9ca3af", background: "#f1f5f9", borderRadius: 8, padding: "8px 14px", display: "inline-block", marginBottom: 16, textAlign: "left" }}>
              <strong>Debug checklist:</strong><br/>
              • Backend running on port 5000?<br/>
              • Route <code>/api/worker-requests/all</code> registered?<br/>
              • <code>app.use(express.json())</code> in app.js?<br/>
              • CORS enabled?
            </div>
            <br/>
            <button onClick={() => fetchRequests(false)} style={{ padding: "9px 22px", borderRadius: 8, border: "none", background: "#0B1F3A", color: "#EAB308", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              Try Again
            </button>
          </div>
        ) : paginated.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center", color: "#9ca3af" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📋</div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>No requests found</div>
            {(search || filterStatus !== "all" || filterCountry !== "all") && (
              <div style={{ fontSize: 12, marginTop: 6 }}>Try clearing the filters above</div>
            )}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {[
                    { key: "id",                  label: "#ID"       },
                    { key: "company_name",         label: "Company"   },
                    { key: "job_title",            label: "Job"       },
                    { key: "destination_country",  label: "Country"   },
                    { key: "workers_requested",    label: "Workers"   },
                    { key: null,                   label: "Progress"  },
                    { key: "status",               label: "Status"    },
                    { key: "created_at",           label: "Date"      },
                    { key: null,                   label: "Action"    },
                  ].map((col, i) => (
                    <th
                      key={i}
                      style={{ ...S.th, ...(i === 8 ? { textAlign: "center" } : {}), ...(i === 4 ? { textAlign: "center" } : {}) }}
                      onClick={() => col.key && toggleSort(col.key)}
                    >
                      {col.label}{col.key && <SortIcon col={col.key} />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((r, i) => {
                  const delPct = r.workers_requested > 0 ? Math.round(((r.workers_delivered || 0) / r.workers_requested) * 100) : 0;
                  return (
                    <tr
                      key={r.id}
                      style={{ background: i % 2 === 0 ? "#fff" : "#fafafa", transition: "background 0.12s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
                      onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fafafa"}
                    >
                      {/* ID */}
                      <td style={S.td}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#4f46e5", background: "#eef2ff", padding: "2px 7px", borderRadius: 5 }}>
                          REQ-{r.id}
                        </span>
                      </td>

                      {/* Company */}
                      <td style={S.td}>
                        <div style={{ fontWeight: 700, color: "#0B1F3A", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {r.company_name}
                        </div>
                        {r.employer_company && r.employer_company !== r.company_name && (
                          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            👤 {r.employer_company}
                          </div>
                        )}
                      </td>

                      {/* Job */}
                      <td style={{ ...S.td, maxWidth: 150 }}>
                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 150 }}>
                          {r.job_title}
                        </div>
                      </td>

                      {/* Country */}
                      <td style={S.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                          {r.country_flag && (
                            <img
                              src={`https://flagcdn.com/w20/${r.country_flag.toLowerCase()}.png`}
                              alt="" style={{ width: 18, borderRadius: 2, flexShrink: 0 }}
                              onError={e => e.target.style.display = "none"}
                            />
                          )}
                          {r.destination_country}
                        </div>
                      </td>

                      {/* Workers */}
                      <td style={{ ...S.td, textAlign: "center" }}>
                        <span style={{ fontWeight: 800, fontSize: 16, color: "#0B1F3A" }}>{fmt(r.workers_requested)}</span>
                      </td>

                      {/* Progress */}
                      <td style={{ ...S.td, minWidth: 160 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                          <MiniBar value={r.workers_delivered ?? 0} total={r.workers_requested} label="Delivered" />
                          <MiniBar value={r.workers_submitted ?? 0} total={r.workers_requested} label="Submitted" />
                        </div>
                        <div style={{ textAlign: "right", marginTop: 2 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: progressColor(delPct) }}>{delPct}%</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={S.td}><StatusBadge status={r.status} /></td>

                      {/* Date */}
                      <td style={{ ...S.td, whiteSpace: "nowrap", color: "#6b7280", fontSize: 12 }}>
                        {new Date(r.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>

                      {/* Action */}
                      <td style={{ ...S.td, textAlign: "center" }}>
                        <button
                          onClick={() => openDetail(r)}
                          style={{
                            padding: "6px 14px", borderRadius: 7, fontSize: 12, fontWeight: 700,
                            border: "1.5px solid #0B1F3A", background: "transparent",
                            color: "#0B1F3A", cursor: "pointer", whiteSpace: "nowrap",
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = "#0B1F3A"; e.currentTarget.style.color = "#EAB308"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0B1F3A"; }}
                        >
                          Manage →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && !error && filtered.length > PAGE_SIZE && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 16px", borderTop: "1px solid #e5e7eb",
            background: "#f9fafb", flexWrap: "wrap", gap: 10,
          }}>
            <span style={{ fontSize: 12, color: "#6b7280" }}>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              <PagBtn label="«" onClick={() => setPage(1)}          disabled={page === 1} />
              <PagBtn label="‹" onClick={() => setPage(p => p - 1)} disabled={page === 1} />
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && arr[idx - 1] !== p - 1) acc.push("…");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "…"
                    ? <span key={`e${i}`} style={{ padding: "6px 3px", fontSize: 12, color: "#9ca3af", userSelect: "none" }}>…</span>
                    : <PagBtn key={p} label={p} onClick={() => setPage(p)} active={p === page} />
                )}
              <PagBtn label="›" onClick={() => setPage(p => p + 1)} disabled={page === totalPages} />
              <PagBtn label="»" onClick={() => setPage(totalPages)}  disabled={page === totalPages} />
            </div>
          </div>
        )}
      </div>

      {/* ── Detail / Update Modal ── */}
      {modalOpen && selected && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(11,31,58,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div style={{
            background: "#fff", borderRadius: 14, width: "100%", maxWidth: 700,
            maxHeight: "92vh", overflowY: "auto",
            boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
            animation: "slideUp 0.22s ease",
          }}>
            {/* Modal Header */}
            <div style={{ background: "#0B1F3A", padding: "20px 24px", borderRadius: "14px 14px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: "#EAB308", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>REQ-{selected.id}</span>
                  <StatusBadge status={selected.status} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{selected.job_title}</div>
                <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>{selected.company_name} · {selected.destination_country}</div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#94a3b8", borderRadius: 8, width: 34, height: 34, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              >✕</button>
            </div>

            <div style={{ padding: 24 }}>
              {/* Info Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
                {[
                  { label: "Workers Requested", value: fmt(selected.workers_requested) },
                  { label: "Workers Delivered",  value: fmt(selected.workers_delivered) },
                  { label: "Completion",          value: selected.workers_requested > 0 ? Math.round(((selected.workers_delivered || 0) / selected.workers_requested) * 100) + "%" : "0%" },
                  { label: "Employer",            value: selected.employer_company || "—" },
                  { label: "Email",               value: selected.employer_email    || "—" },
                  { label: "Created",             value: new Date(selected.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 13px", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0B1F3A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Progress Bars */}
              <div style={{ background: "#f0f4ff", borderRadius: 10, padding: "14px 16px", marginBottom: 20, border: "1px solid #c7d2fe" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#3730a3", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.07em" }}>Live Progress</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { key: "workers_submitted", label: "Submitted" },
                    { key: "workers_verified",  label: "Verified"  },
                    { key: "workers_selected",  label: "Selected"  },
                    { key: "workers_delivered", label: "Delivered" },
                  ].map(({ key, label }) => (
                    <MiniBar key={key} value={selected[key] || 0} total={selected.workers_requested} label={label} />
                  ))}
                </div>
              </div>

              {selected.notes && (
                <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 8, padding: "10px 14px", marginBottom: 20 }}>
                  <div style={{ fontSize: 10, color: "#92400e", fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Notes</div>
                  <div style={{ fontSize: 13, color: "#78350f", lineHeight: 1.6 }}>{selected.notes}</div>
                </div>
              )}

              {/* ── Update Form ── */}
              <div style={{ borderTop: "2px dashed #e2e8f0", paddingTop: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <div style={{ width: 4, height: 18, background: "#EAB308", borderRadius: 4 }} />
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#0B1F3A", textTransform: "uppercase", letterSpacing: "0.05em" }}>Update Request</div>
                </div>

                {/* Status */}
                <div style={{ marginBottom: 16 }}>
                  <label style={S.label}>Change Status</label>
                  <select
                    value={updateForm.status}
                    onChange={e => setUpdateForm(f => ({ ...f, status: e.target.value }))}
                    style={{ ...S.input }}
                  >
                    {ALL_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>

                {/* Worker Counts */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  {[
                    { key: "workers_submitted", label: "Workers Submitted" },
                    { key: "workers_verified",  label: "Workers Verified"  },
                    { key: "workers_selected",  label: "Workers Selected"  },
                    { key: "workers_delivered", label: "Workers Delivered" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label style={S.label}>{label}</label>
                      <input
                        type="number" min={0} max={selected.workers_requested}
                        value={updateForm[key] ?? 0}
                        onChange={e => setUpdateForm(f => ({ ...f, [key]: Math.max(0, parseInt(e.target.value) || 0) }))}
                        style={S.input}
                        onFocus={e => e.target.style.borderColor = "#EAB308"}
                        onBlur={e => e.target.style.borderColor = "#d1d5db"}
                      />
                      <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>
                        Max: {fmt(selected.workers_requested)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Notes */}
                <div style={{ marginBottom: 18 }}>
                  <label style={S.label}>Admin Notes</label>
                  <textarea
                    value={updateForm.notes}
                    onChange={e => setUpdateForm(f => ({ ...f, notes: e.target.value }))}
                    rows={3}
                    placeholder="Add notes for the employer…"
                    style={{ ...S.input, resize: "vertical", minHeight: 80 }}
                    onFocus={e => e.target.style.borderColor = "#EAB308"}
                    onBlur={e => e.target.style.borderColor = "#d1d5db"}
                  />
                </div>

                {/* Feedback */}
                {updateMsg && (
                  <div style={{
                    padding: "10px 14px", borderRadius: 8, marginBottom: 14, fontSize: 13, fontWeight: 600,
                    background: updateMsg.ok ? "#dcfce7" : "#fee2e2",
                    color: updateMsg.ok ? "#14532d" : "#7f1d1d",
                    border: `1px solid ${updateMsg.ok ? "#86efac" : "#fca5a5"}`,
                  }}>
                    {updateMsg.text}
                  </div>
                )}

                {/* Buttons */}
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button
                    onClick={() => setModalOpen(false)}
                    style={{ padding: "10px 22px", borderRadius: 9, border: "1.5px solid #d1d5db", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#374151" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={updating}
                    style={{
                      padding: "10px 28px", borderRadius: 9, border: "none",
                      background: updating ? "#94a3b8" : "#0B1F3A",
                      color: "#EAB308", fontSize: 13, fontWeight: 800,
                      cursor: updating ? "not-allowed" : "pointer",
                      letterSpacing: "0.03em", transition: "background 0.15s",
                    }}
                  >
                    {updating ? "Saving…" : "Save Changes ✓"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)  scale(1); }
        }
      `}</style>
    </div>
  );
}

// ─── Pagination Button ────────────────────────────────────────────────────────
function PagBtn({ label, onClick, disabled, active }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 32, height: 32, borderRadius: 7,
        border: "1.5px solid",
        borderColor: active ? "#0B1F3A" : disabled ? "#e5e7eb" : "#d1d5db",
        background: active ? "#0B1F3A" : disabled ? "#f9fafb" : "#fff",
        color: active ? "#EAB308" : disabled ? "#d1d5db" : "#374151",
        fontSize: 12, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.12s",
      }}
    >
      {label}
    </button>
  );
}