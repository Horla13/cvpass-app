"use client";

import { useEffect, useState } from "react";
import { CVData } from "@/lib/pdf-builder";

interface CVJsonModalProps {
  analysisId: string;
  onClose: () => void;
}

export function CVJsonModal({ analysisId, onClose }: CVJsonModalProps) {
  const [cvJson, setCvJson] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/history?id=${analysisId}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setCvJson(data.analysis?.cv_json ?? null);
      })
      .catch((e: unknown) => {
        if (e instanceof Error && e.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Erreur");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [analysisId]);

  const handleDownload = async () => {
    if (!cvJson) return;
    setDownloading(true);
    try {
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvJson }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Erreur lors du téléchargement");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cv-optimise-cvpass.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-brand-black">CV optimisé</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-brand-black hover:bg-gray-100 transition-colors"
            aria-label="Fermer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading && (
            <div className="flex justify-center py-12">
              <span className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && error && (
            <p className="text-red-500 text-sm text-center py-8">{error}</p>
          )}

          {!loading && !error && !cvJson && (
            <p className="text-brand-gray text-sm text-center py-8 italic">
              Aperçu non disponible pour cette analyse.<br />
              Téléchargez à nouveau le CV depuis la page Résultats pour l&apos;activer.
            </p>
          )}

          {!loading && !error && cvJson && (
            <div className="space-y-5 text-sm">
              {/* Header */}
              <div>
                <h1 className="text-xl font-bold text-brand-black">{cvJson.nom}</h1>
                {cvJson.titre && <p className="text-[#16a34a] font-medium mt-0.5">{cvJson.titre}</p>}
                {(cvJson.contact?.email || cvJson.contact?.telephone || cvJson.contact?.ville) && (
                  <p className="text-brand-gray text-xs mt-1">
                    {[cvJson.contact.email, cvJson.contact.telephone, cvJson.contact.ville]
                      .filter(Boolean)
                      .join("  |  ")}
                  </p>
                )}
                <div className="h-px bg-[#16a34a] mt-3" />
              </div>

              {/* Profil */}
              {cvJson.profil && (
                <Section title="Profil">
                  <p className="text-brand-black leading-relaxed">{cvJson.profil}</p>
                </Section>
              )}

              {/* Expériences */}
              {cvJson.experiences?.length > 0 && (
                <Section title="Expériences professionnelles">
                  {cvJson.experiences.map((exp, i) => (
                    <div key={i} className="mb-3">
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="font-semibold text-brand-black">{exp.poste}</span>
                        {exp.periode && <span className="text-xs text-brand-gray shrink-0">{exp.periode}</span>}
                      </div>
                      {(exp.entreprise || exp.lieu) && (
                        <p className="text-xs text-brand-gray mb-1">
                          {[exp.entreprise, exp.lieu].filter(Boolean).join(" — ")}
                        </p>
                      )}
                      {exp.missions?.map((m, j) => (
                        <p key={j} className="text-brand-black pl-3 before:content-['–'] before:mr-1.5 before:text-brand-gray">
                          {m}
                        </p>
                      ))}
                    </div>
                  ))}
                </Section>
              )}

              {/* Formation */}
              {cvJson.formation?.length > 0 && (
                <Section title="Formation">
                  {cvJson.formation.map((f, i) => (
                    <div key={i} className="mb-2">
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="font-semibold text-brand-black">{f.diplome}</span>
                        {f.periode && <span className="text-xs text-brand-gray shrink-0">{f.periode}</span>}
                      </div>
                      {f.etablissement && <p className="text-xs text-brand-gray">{f.etablissement}</p>}
                    </div>
                  ))}
                </Section>
              )}

              {/* Compétences */}
              {cvJson.competences?.length > 0 && (
                <Section title="Compétences">
                  <p className="text-brand-black">{cvJson.competences.join("  •  ")}</p>
                </Section>
              )}

              {/* Centres d'intérêt */}
              {cvJson.centres_interet?.length > 0 && (
                <Section title="Centres d'intérêt">
                  <p className="text-brand-black">{cvJson.centres_interet.join("  •  ")}</p>
                </Section>
              )}

              {/* Informations */}
              {cvJson.informations?.length > 0 && (
                <Section title="Informations">
                  {cvJson.informations.map((info, i) => <p key={i} className="text-brand-black">{info}</p>)}
                </Section>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-brand-gray hover:bg-gray-50 transition-colors"
          >
            Fermer
          </button>
          {cvJson && (
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex-1 py-2.5 rounded-xl bg-[#16a34a] text-white text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {downloading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Télécharger PDF
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wide text-[#16a34a] mb-1">{title}</h3>
      <div className="h-px bg-gray-200 mb-2" />
      <div className="space-y-1">{children}</div>
    </div>
  );
}
