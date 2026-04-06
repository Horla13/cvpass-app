"use client";

import { useEffect, useState, useCallback } from "react";
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

  const fetchApps = useCallback(() => {
    fetch("/api/applications")
      .then((r) => r.json())
      .then((d) => setApps(d.applications ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchApps(); }, [fetchApps]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    // Optimistic update
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

  const handleSave = async (data: { company: string; job_title: string; url: string; notes: string; status: string; id?: string }) => {
    setSaveError("");
    try {
      if (data.id) {
        const res = await fetch("/api/applications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setSaveError(err.error ?? "Erreur lors de la mise à jour");
          return;
        }
        const { application } = await res.json();
        setApps((prev) => prev.map((a) => a.id === application.id ? application : a));
      } else {
        const res = await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setSaveError(err.error ?? "Erreur lors de la création");
          return;
        }
        const { application } = await res.json();
        setApps((prev) => [application, ...prev]);
      }
      setShowAdd(false);
      setEditingApp(null);
    } catch {
      setSaveError("Erreur réseau");
    }
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-[28px] font-extrabold text-gray-900">Mes candidatures</h1>
            <p className="text-gray-500 text-[14px]">{apps.length} candidature{apps.length !== 1 ? "s" : ""} au total</p>
          </div>
          <button
            onClick={() => { setEditingApp(null); setShowAdd(true); }}
            className="px-5 py-2.5 min-h-[48px] bg-green-500 text-white text-[14px] font-semibold rounded-xl hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Ajouter
          </button>
        </div>

        {/* Kanban board */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {COLUMNS.map((col) => {
            const colApps = apps.filter((a) => a.status === col.id);
            return (
              <div key={col.id} className="space-y-3">
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
    </div>
  );
}

function ApplicationCard({
  app,
  onStatusChange,
  onEdit,
  onDelete,
}: {
  app: Application;
  onStatusChange: (id: string, status: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const daysSince = app.applied_at
    ? Math.floor((Date.now() - new Date(app.applied_at).getTime()) / 86400000)
    : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-gray-900 truncate">{app.job_title}</p>
          <p className="text-[13px] text-gray-500 truncate">{app.company}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
            </svg>
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-40">
                <button onClick={() => { onEdit(); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50">
                  Modifier
                </button>
                {COLUMNS.filter((c) => c.id !== app.status).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { onStatusChange(app.id, c.id); setMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50"
                  >
                    {c.icon} {c.label}
                  </button>
                ))}
                <button onClick={() => { onDelete(); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-[13px] text-red-500 hover:bg-red-50">
                  Supprimer
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {daysSince !== null && (
        <p className="text-[11px] text-gray-400">
          {daysSince === 0 ? "Postulé aujourd'hui" : `Il y a ${daysSince}j`}
        </p>
      )}

      {app.notes && (
        <p className="text-[12px] text-gray-400 mt-1 line-clamp-2">{app.notes}</p>
      )}

      {app.url && (
        <a
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-blue-500 hover:underline mt-1 block truncate"
        >
          Voir l&apos;offre
        </a>
      )}
    </div>
  );
}

function ApplicationModal({
  app,
  onSave,
  onClose,
  error,
}: {
  app: Application | null;
  onSave: (data: { company: string; job_title: string; url: string; notes: string; status: string; id?: string }) => void;
  onClose: () => void;
  error?: string;
}) {
  const [company, setCompany] = useState(app?.company ?? "");
  const [jobTitle, setJobTitle] = useState(app?.job_title ?? "");
  const [url, setUrl] = useState(app?.url ?? "");
  const [notes, setNotes] = useState(app?.notes ?? "");
  const [status, setStatus] = useState(app?.status ?? "wishlist");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
        <h2 className="font-bold text-gray-900 text-[18px]">
          {app ? "Modifier la candidature" : "Nouvelle candidature"}
        </h2>

        <div>
          <label className="block text-[14px] font-medium text-gray-700 mb-1">Entreprise *</label>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="ex: Google"
            required
          />
        </div>

        <div>
          <label className="block text-[14px] font-medium text-gray-700 mb-1">Poste *</label>
          <input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="ex: Développeur Full-Stack"
            required
          />
        </div>

        <div>
          <label className="block text-[14px] font-medium text-gray-700 mb-1">Lien de l&apos;offre</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-[14px] font-medium text-gray-700 mb-1">Statut</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {COLUMNS.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[14px] font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            placeholder="Notes personnelles..."
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[13px] text-red-600">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 min-h-[48px] border border-gray-300 text-gray-700 text-[14px] font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              if (!company.trim() || !jobTitle.trim()) return;
              onSave({ company, job_title: jobTitle, url, notes, status, id: app?.id });
            }}
            disabled={!company.trim() || !jobTitle.trim()}
            className="flex-1 py-3 min-h-[48px] bg-green-500 text-white text-[14px] font-semibold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {app ? "Enregistrer" : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}
