"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { AppHeader } from "@/components/AppHeader";
import { cn } from "@/lib/utils";

interface Application {
  id: string;
  company: string;
  job_title: string;
  url: string | null;
  status: string;
  notes: string | null;
  applied_at: string | null;
  interview_date: string | null;
  created_at: string;
  updated_at: string;
}

const COLUMNS = [
  { id: "wishlist", label: "Souhaitées", icon: "🎯", color: "border-blue-300 bg-blue-50" },
  { id: "applied", label: "Postulées", icon: "📩", color: "border-amber-300 bg-amber-50" },
  { id: "interview", label: "Entretien", icon: "💬", color: "border-purple-300 bg-purple-50" },
  { id: "offer", label: "Offre", icon: "🎉", color: "border-green-300 bg-green-50" },
  { id: "rejected", label: "Refusées", icon: "❌", color: "border-red-300 bg-red-50" },
];

export default function TrackerPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [saveError, setSaveError] = useState("");
  const [search, setSearch] = useState("");
  const [showFollowup, setShowFollowup] = useState<Application | null>(null);
  const [showImportUrl, setShowImportUrl] = useState(false);
  const [weeklyGoal, setWeeklyGoal] = useState(() => {
    if (typeof window === "undefined") return 10;
    return parseInt(localStorage.getItem("cvpass_weekly_goal") ?? "10", 10);
  });

  const fetchApps = useCallback(() => {
    fetch("/api/applications")
      .then((r) => r.json())
      .then((d) => setApps(d.applications ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchApps(); }, [fetchApps]);

  // Filtered apps
  const filtered = useMemo(() => {
    if (!search.trim()) return apps;
    const q = search.toLowerCase();
    return apps.filter((a) => a.company.toLowerCase().includes(q) || a.job_title.toLowerCase().includes(q));
  }, [apps, search]);

  // Stats
  const stats = useMemo(() => {
    const total = apps.length;
    const applied = apps.filter((a) => a.status !== "wishlist").length;
    const interviews = apps.filter((a) => a.status === "interview").length;
    const offers = apps.filter((a) => a.status === "offer").length;
    const rejected = apps.filter((a) => a.status === "rejected").length;
    const responseRate = applied > 0 ? Math.round(((interviews + offers + rejected) / applied) * 100) : 0;
    const needsFollowup = apps.filter((a) => {
      if (a.status !== "applied" || !a.applied_at) return false;
      return (Date.now() - new Date(a.applied_at).getTime()) > 7 * 86400000;
    }).length;
    // Streak: consecutive days with at least one action
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let d = 0; d < 30; d++) {
      const day = new Date(today);
      day.setDate(day.getDate() - d);
      const dayStr = day.toISOString().slice(0, 10);
      const hasAction = apps.some((a) => {
        const created = a.created_at?.slice(0, 10);
        const updated = a.updated_at?.slice(0, 10);
        return created === dayStr || updated === dayStr;
      });
      if (hasAction) streak++;
      else if (d > 0) break; // streak broken
    }

    // This week's applications
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    weekStart.setHours(0, 0, 0, 0);
    const thisWeek = apps.filter((a) => a.status !== "wishlist" && new Date(a.created_at) >= weekStart).length;

    return { total, applied, interviews, offers, responseRate, needsFollowup, streak, thisWeek };
  }, [apps]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setApps((prev) => prev.map((a) => a.id === id ? { ...a, status: newStatus, updated_at: new Date().toISOString() } : a));
    await fetch("/api/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
  };

  const handleDelete = async (id: string) => {
    setApps((prev) => prev.filter((a) => a.id !== id));
    await fetch(`/api/applications?id=${id}`, { method: "DELETE" });
  };

  const handleSave = async (data: { company: string; job_title: string; url: string; notes: string; status: string; interview_date: string; id?: string }) => {
    setSaveError("");
    try {
      const method = data.id ? "PATCH" : "POST";
      const res = await fetch("/api/applications", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setSaveError(err.error ?? "Erreur");
        return;
      }
      const { application } = await res.json();
      if (data.id) {
        setApps((prev) => prev.map((a) => a.id === application.id ? application : a));
      } else {
        setApps((prev) => [application, ...prev]);
      }
      setShowAdd(false);
      setEditingApp(null);
    } catch {
      setSaveError("Erreur réseau");
    }
  };

  const exportCSV = () => {
    const headers = ["Entreprise", "Poste", "Statut", "Date candidature", "Date entretien", "URL", "Notes"];
    const statusLabels: Record<string, string> = { wishlist: "Souhaitée", applied: "Postulée", interview: "Entretien", offer: "Offre", rejected: "Refusée" };
    const rows = apps.map((a) => [
      a.company, a.job_title, statusLabels[a.status] ?? a.status,
      a.applied_at ? new Date(a.applied_at).toLocaleDateString("fr-FR") : "",
      a.interview_date ? new Date(a.interview_date).toLocaleDateString("fr-FR") : "",
      a.url ?? "", (a.notes ?? "").replace(/\n/g, " "),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `candidatures-cvpass-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb]">
        <AppHeader />
        <div className="flex items-center justify-center py-32">
          <span className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <AppHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-[24px] sm:text-[28px] font-extrabold text-gray-900">Mes candidatures</h1>
            <p className="text-gray-500 text-[14px]">{apps.length} candidature{apps.length !== 1 ? "s" : ""} au total</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowImportUrl(true)}
              className="px-4 py-2.5 min-h-[44px] bg-white border border-gray-200 text-gray-600 text-[13px] font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-1.5"
              title="Ajouter depuis un lien d'offre"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
              <span className="hidden sm:inline">Depuis un lien</span>
            </button>
            <button
              onClick={exportCSV}
              className="px-4 py-2.5 min-h-[44px] bg-white border border-gray-200 text-gray-600 text-[13px] font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-1.5"
              title="Exporter en CSV"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              <span className="hidden sm:inline">CSV</span>
            </button>
            <button
              onClick={() => { setEditingApp(null); setShowAdd(true); }}
              className="px-5 py-2.5 min-h-[44px] bg-green-500 text-white text-[14px] font-semibold rounded-xl hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Ajouter
            </button>
          </div>
        </div>

        {/* Streak + Weekly goal */}
        {apps.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            {stats.streak > 0 && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
                <span className="text-[20px]">🔥</span>
                <span className="text-[14px] font-bold text-amber-700">{stats.streak} jour{stats.streak > 1 ? "s" : ""} de suite</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 flex-1">
              <span className="text-[13px] text-gray-500">Objectif semaine :</span>
              <span className="text-[14px] font-bold text-green-600">{stats.thisWeek}/{weeklyGoal}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden ml-2">
                <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${Math.min(100, (stats.thisWeek / weeklyGoal) * 100)}%` }} />
              </div>
              <select value={weeklyGoal} onChange={(e) => { const v = parseInt(e.target.value); setWeeklyGoal(v); localStorage.setItem("cvpass_weekly_goal", String(v)); }}
                className="text-[12px] text-gray-400 bg-transparent border-none focus:outline-none cursor-pointer min-h-[32px]">
                {[5, 10, 15, 20, 30].map((n) => <option key={n} value={n}>{n}/sem</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Stats bar */}
        {apps.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {[
              { label: "Postulées", value: stats.applied, color: "text-amber-600" },
              { label: "Entretiens", value: stats.interviews, color: "text-purple-600" },
              { label: "Offres", value: stats.offers, color: "text-green-600" },
              { label: "Taux réponse", value: `${stats.responseRate}%`, color: "text-gray-700" },
              { label: "À relancer", value: stats.needsFollowup, color: stats.needsFollowup > 0 ? "text-red-500" : "text-gray-400" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-center">
                <p className={cn("text-[22px] font-extrabold", s.color)}>{s.value}</p>
                <p className="text-[11px] text-gray-400 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Search */}
        {apps.length > 3 && (
          <div className="mb-5">
            <div className="relative max-w-sm">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher entreprise ou poste..."
                className="w-full pl-10 pr-4 py-2.5 min-h-[44px] text-[14px] bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        )}

        {/* Kanban board */}
        <div className="flex md:grid md:grid-cols-5 gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:snap-none md:overflow-visible">
          {COLUMNS.map((col) => {
            const colApps = filtered.filter((a) => a.status === col.id);
            return (
              <div key={col.id} className="min-w-[260px] md:min-w-0 snap-start space-y-3">
                <div className={cn("rounded-xl border-2 px-4 py-3 flex items-center justify-between", col.color)}>
                  <span className="text-[14px] font-bold text-gray-800">
                    {col.icon} {col.label}
                  </span>
                  <span className="text-[12px] font-bold text-gray-500 bg-white rounded-full w-6 h-6 flex items-center justify-center">
                    {colApps.length}
                  </span>
                </div>

                <div className="space-y-2 min-h-[100px]">
                  {colApps.map((app) => (
                    <ApplicationCard
                      key={app.id}
                      app={app}
                      onStatusChange={handleStatusChange}
                      onEdit={() => { setEditingApp(app); setShowAdd(true); }}
                      onDelete={() => handleDelete(app.id)}
                      onFollowup={() => setShowFollowup(app)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {showAdd && (
        <ApplicationModal
          app={editingApp}
          onSave={handleSave}
          onClose={() => { setShowAdd(false); setEditingApp(null); setSaveError(""); }}
          error={saveError}
        />
      )}

      {/* Import URL Modal */}
      {showImportUrl && (
        <ImportUrlModal
          onSave={(data) => { handleSave({ ...data, notes: "", interview_date: "" }); setShowImportUrl(false); }}
          onClose={() => setShowImportUrl(false)}
        />
      )}

      {/* Followup Modal */}
      {showFollowup && (
        <FollowupModal
          app={showFollowup}
          onClose={() => setShowFollowup(null)}
        />
      )}
    </div>
  );
}

/* ─── Application Card ─── */
function ApplicationCard({
  app,
  onStatusChange,
  onEdit,
  onDelete,
  onFollowup,
}: {
  app: Application;
  onStatusChange: (id: string, status: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  onFollowup: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const daysSince = app.applied_at
    ? Math.floor((Date.now() - new Date(app.applied_at).getTime()) / 86400000)
    : null;
  const needsFollowup = app.status === "applied" && daysSince !== null && daysSince >= 7;

  // Interview countdown
  const interviewDays = app.interview_date
    ? Math.ceil((new Date(app.interview_date).getTime() - Date.now()) / 86400000)
    : null;

  return (
    <div className={cn("bg-white rounded-xl border p-4 hover:shadow-sm transition-shadow", needsFollowup ? "border-amber-300" : "border-gray-200")}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-gray-900 truncate">{app.job_title}</p>
          <p className="text-[13px] text-gray-500 truncate">{app.company}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded hover:bg-gray-100 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
            </svg>
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-44">
                <button onClick={() => { onEdit(); setMenuOpen(false); }} className="w-full text-left px-4 py-3 min-h-[44px] text-[14px] text-gray-700 hover:bg-gray-50">
                  Modifier
                </button>
                {app.status === "applied" && (
                  <button onClick={() => { onFollowup(); setMenuOpen(false); }} className="w-full text-left px-4 py-3 min-h-[44px] text-[14px] text-green-600 hover:bg-green-50">
                    Générer une relance
                  </button>
                )}
                {COLUMNS.filter((c) => c.id !== app.status).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { onStatusChange(app.id, c.id); setMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 min-h-[44px] text-[14px] text-gray-700 hover:bg-gray-50"
                  >
                    {c.icon} {c.label}
                  </button>
                ))}
                <button onClick={() => { onDelete(); setMenuOpen(false); }} className="w-full text-left px-4 py-3 min-h-[44px] text-[14px] text-red-500 hover:bg-red-50 border-t border-gray-100">
                  Supprimer
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-1">
        {daysSince !== null && (
          <span className="text-[11px] text-gray-400">
            {daysSince === 0 ? "Aujourd'hui" : `Il y a ${daysSince}j`}
          </span>
        )}
        {needsFollowup && (
          <button
            onClick={onFollowup}
            className="text-[10px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full hover:bg-amber-200 transition-colors"
          >
            Relancer ?
          </button>
        )}
        {interviewDays !== null && interviewDays >= 0 && (
          <span className="text-[10px] font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
            {interviewDays === 0 ? "Aujourd'hui !" : interviewDays === 1 ? "Demain" : `Dans ${interviewDays}j`}
          </span>
        )}
      </div>

      {app.notes && (
        <p className="text-[12px] text-gray-400 mt-1 line-clamp-2">{app.notes}</p>
      )}

      {app.url && (
        <a
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-green-500 hover:underline mt-1 block truncate"
        >
          Voir l&apos;offre
        </a>
      )}
    </div>
  );
}

/* ─── Add/Edit Modal ─── */
function ApplicationModal({
  app,
  onSave,
  onClose,
  error,
}: {
  app: Application | null;
  onSave: (data: { company: string; job_title: string; url: string; notes: string; status: string; interview_date: string; id?: string }) => void;
  onClose: () => void;
  error?: string;
}) {
  const [company, setCompany] = useState(app?.company ?? "");
  const [jobTitle, setJobTitle] = useState(app?.job_title ?? "");
  const [url, setUrl] = useState(app?.url ?? "");
  const [notes, setNotes] = useState(app?.notes ?? "");
  const [status, setStatus] = useState(app?.status ?? "wishlist");
  const [interviewDate, setInterviewDate] = useState(app?.interview_date?.slice(0, 10) ?? "");

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-0 sm:px-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-[18px]">
            {app ? "Modifier la candidature" : "Nouvelle candidature"}
          </h2>
          <button onClick={onClose} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-gray-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div>
          <label className="block text-[14px] font-medium text-gray-700 mb-1">Entreprise *</label>
          <input value={company} onChange={(e) => setCompany(e.target.value)}
            className="w-full px-3 py-2.5 min-h-[44px] text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Google, LVMH, Capgemini..."
          />
        </div>
        <div>
          <label className="block text-[14px] font-medium text-gray-700 mb-1">Poste *</label>
          <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
            className="w-full px-3 py-2.5 min-h-[44px] text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Chef de projet, Développeur..."
          />
        </div>
        <div>
          <label className="block text-[14px] font-medium text-gray-700 mb-1">Lien de l&apos;offre</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} type="url"
            className="w-full px-3 py-2.5 min-h-[44px] text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block text-[14px] font-medium text-gray-700 mb-1">Statut</label>
          <div className="flex flex-wrap gap-2">
            {COLUMNS.map((c) => (
              <button key={c.id} onClick={() => setStatus(c.id)}
                className={cn("px-3 py-2 min-h-[40px] rounded-lg text-[13px] font-medium border transition-colors",
                  status === c.id ? "bg-green-500 text-white border-green-500" : "bg-white text-gray-600 border-gray-200"
                )}
              >{c.icon} {c.label}</button>
            ))}
          </div>
        </div>
        {(status === "interview" || interviewDate) && (
          <div>
            <label className="block text-[14px] font-medium text-gray-700 mb-1">Date d&apos;entretien</label>
            <input type="date" value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)}
              className="w-full px-3 py-2.5 min-h-[44px] text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        )}
        <div>
          <label className="block text-[14px] font-medium text-gray-700 mb-1">Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
            className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            placeholder="Contact, remarques..."
          />
        </div>

        {error && <p className="text-[14px] text-red-500">{error}</p>}

        <button
          onClick={() => onSave({ company, job_title: jobTitle, url, notes, status, interview_date: interviewDate, ...(app ? { id: app.id } : {}) })}
          disabled={!company.trim() || !jobTitle.trim()}
          className="w-full py-3.5 min-h-[48px] bg-green-500 text-white text-[15px] font-bold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
        >
          {app ? "Enregistrer" : "Ajouter la candidature"}
        </button>
      </div>
    </div>
  );
}

/* ─── Import from URL Modal ─── */
function ImportUrlModal({
  onSave,
  onClose,
}: {
  onSave: (data: { company: string; job_title: string; url: string; status: string }) => void;
  onClose: () => void;
}) {
  const [url, setUrl] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const handleFetch = async () => {
    if (!url.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/extract-job-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setCompany(data.company ?? "");
        setJobTitle(data.job_title ?? "");
      }
    } catch { /* ignore */ }
    setFetched(true);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-0 sm:px-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-[18px]">Ajouter depuis un lien</h2>
          <button onClick={onClose} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-gray-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div>
          <label className="block text-[14px] font-medium text-gray-700 mb-1">Lien de l&apos;offre d&apos;emploi</label>
          <div className="flex gap-2">
            <input value={url} onChange={(e) => setUrl(e.target.value)} type="url"
              className="flex-1 px-3 py-2.5 min-h-[44px] text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="https://www.indeed.fr/..."
            />
            <button onClick={handleFetch} disabled={loading || !url.trim()}
              className="px-4 py-2.5 min-h-[44px] bg-green-500 text-white text-[13px] font-semibold rounded-xl hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              {loading ? "..." : "Extraire"}
            </button>
          </div>
        </div>

        {fetched && (
          <>
            <div>
              <label className="block text-[14px] font-medium text-gray-700 mb-1">Entreprise</label>
              <input value={company} onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2.5 min-h-[44px] text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-[14px] font-medium text-gray-700 mb-1">Poste</label>
              <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-3 py-2.5 min-h-[44px] text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              onClick={() => onSave({ company, job_title: jobTitle, url, status: "wishlist" })}
              disabled={!company.trim() || !jobTitle.trim()}
              className="w-full py-3.5 min-h-[48px] bg-green-500 text-white text-[15px] font-bold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              Ajouter la candidature
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Followup Email Modal ─── */
function FollowupModal({ app, onClose }: { app: Application; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const daysSince = app.applied_at ? Math.floor((Date.now() - new Date(app.applied_at).getTime()) / 86400000) : 7;
    fetch("/api/generate-followup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company: app.company, job_title: app.job_title, days_since: daysSince }),
    })
      .then(async (r) => {
        if (r.status === 402) { setError("Crédits insuffisants"); return; }
        if (!r.ok) { setError("Erreur génération"); return; }
        const data = await r.json();
        setEmail(data.email ?? "");
        setSubject(data.subject ?? "");
      })
      .catch(() => setError("Erreur réseau"))
      .finally(() => setLoading(false));
  }, [app]);

  const copyAll = () => {
    navigator.clipboard.writeText(`Objet : ${subject}\n\n${email}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-0 sm:px-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-[18px]">Email de relance</h2>
          <button onClick={onClose} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-gray-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <p className="text-[13px] text-gray-500">
          Relance pour le poste de <strong>{app.job_title}</strong> chez <strong>{app.company}</strong>
        </p>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <span className="w-6 h-6 border-3 border-green-500 border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-[14px] text-gray-500">Rédaction en cours (1 crédit)...</span>
          </div>
        )}

        {error && <p className="text-[14px] text-red-500 text-center py-4">{error}</p>}

        {!loading && !error && (
          <>
            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1">Objet</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2.5 min-h-[44px] text-[14px] bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1">Corps de l&apos;email</label>
              <textarea value={email} onChange={(e) => setEmail(e.target.value)} rows={8}
                className="w-full px-3 py-2.5 text-[14px] bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none leading-relaxed"
              />
            </div>
            <button onClick={copyAll}
              className="w-full py-3.5 min-h-[48px] bg-green-500 text-white text-[15px] font-bold rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
              {copied ? "Copié !" : "Copier l'email"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
