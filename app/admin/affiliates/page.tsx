"use client";

import { useEffect, useState, useCallback } from "react";
import { AppHeader } from "@/components/AppHeader";
import { cn } from "@/lib/utils";

interface Conversion {
  id: string;
  affiliate_id: string;
  referred_user_id: string;
  stripe_payment_id: string;
  amount: number;
  commission: number;
  status: string;
  created_at: string;
}

interface Affiliate {
  id: string;
  code: string;
  email: string;
  commission_rate: number;
  total_earned: number;
  total_paid: number;
  status: string;
  created_at: string;
  conversions: Conversion[];
  total_conversions: number;
  pending_count: number;
  approved_count: number;
  paid_count: number;
  pending_amount: number;
  approved_amount: number;
}

export default function AdminAffiliatesPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    fetch("/api/admin/affiliates")
      .then((r) => {
        if (r.status === 403) throw new Error("Accès refusé — admin uniquement");
        return r.json();
      })
      .then((d) => setAffiliates(d.affiliates ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const doAction = async (action: string, params: Record<string, string>) => {
    const key = `${action}-${params.conversion_id || params.affiliate_id}`;
    setActionLoading(key);
    try {
      const res = await fetch("/api/admin/affiliates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...params }),
      });
      if (res.ok) fetchData();
    } catch { /* ignore */ }
    finally { setActionLoading(null); }
  };

  const totalEarned = affiliates.reduce((s, a) => s + Number(a.total_earned), 0);
  const totalPaid = affiliates.reduce((s, a) => s + Number(a.total_paid), 0);
  const totalPending = affiliates.reduce((s, a) => s + a.pending_amount, 0);
  const totalApproved = affiliates.reduce((s, a) => s + a.approved_amount, 0);
  const totalConversions = affiliates.reduce((s, a) => s + a.total_conversions, 0);

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

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f9fb]">
        <AppHeader />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8">
            <p className="text-red-600 font-semibold text-[16px]">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <AppHeader />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-display text-[28px] font-extrabold text-gray-900 mb-2">Admin — Affiliés</h1>
        <p className="text-gray-500 text-[14px] mb-8">{affiliates.length} affilié{affiliates.length !== 1 ? "s" : ""} inscrits</p>

        {/* Global stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard label="Affiliés" value={affiliates.length} />
          <StatCard label="Conversions" value={totalConversions} />
          <StatCard label="En attente" value={`${totalPending.toFixed(2)}€`} color="text-amber-500" />
          <StatCard label="À payer" value={`${totalApproved.toFixed(2)}€`} color="text-blue-500" />
          <StatCard label="Déjà payé" value={`${totalPaid.toFixed(2)}€`} color="text-green-600" />
        </div>

        {/* Affiliates list */}
        <div className="space-y-4">
          {affiliates.map((aff) => (
            <div key={aff.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Affiliate header */}
              <button
                onClick={() => setExpandedId(expandedId === aff.id ? null : aff.id)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-[14px]">
                    {aff.code.slice(0, 2)}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{aff.code}</span>
                      <span className="text-[12px] text-gray-400">{aff.email}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[13px] text-gray-500 mt-0.5">
                      <span>{aff.total_conversions} conversion{aff.total_conversions !== 1 ? "s" : ""}</span>
                      <span>Gagné : {Number(aff.total_earned).toFixed(2)}€</span>
                      <span>Payé : {Number(aff.total_paid).toFixed(2)}€</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {aff.pending_count > 0 && (
                    <span className="text-[12px] font-semibold bg-amber-50 text-amber-600 border border-amber-200 rounded-full px-3 py-1">
                      {aff.pending_count} en attente
                    </span>
                  )}
                  {aff.approved_count > 0 && (
                    <span className="text-[12px] font-semibold bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-3 py-1">
                      {aff.approved_amount.toFixed(2)}€ à payer
                    </span>
                  )}
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className={cn("text-gray-400 transition-transform", expandedId === aff.id && "rotate-180")}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>

              {/* Expanded: conversions + actions */}
              {expandedId === aff.id && (
                <div className="border-t border-gray-100 px-6 py-5">
                  {/* Actions */}
                  <div className="flex items-center gap-3 mb-5">
                    <button
                      onClick={() => doAction("approve_all", { affiliate_id: aff.id })}
                      disabled={aff.pending_count === 0 || actionLoading !== null}
                      className="px-4 py-2 min-h-[40px] bg-amber-500 text-white text-[13px] font-semibold rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {actionLoading === `approve_all-${aff.id}` && <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                      Valider les +30j ({aff.pending_count})
                    </button>
                    <button
                      onClick={() => doAction("mark_paid", { affiliate_id: aff.id })}
                      disabled={aff.approved_count === 0 || actionLoading !== null}
                      className="px-4 py-2 min-h-[40px] bg-green-500 text-white text-[13px] font-semibold rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {actionLoading === `mark_paid-${aff.id}` && <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                      Marquer payé ({aff.approved_amount.toFixed(2)}€)
                    </button>
                    <span className="text-[12px] text-gray-400 ml-2">
                      Lien : cvpass.fr/?ref={aff.code}
                    </span>
                  </div>

                  {/* Conversions table */}
                  {aff.conversions.length === 0 ? (
                    <p className="text-gray-400 text-[14px] text-center py-6">Aucune conversion</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-[14px]">
                        <thead>
                          <tr className="border-b border-gray-100 text-left">
                            <th className="px-3 py-2 text-gray-400 font-semibold text-[12px] uppercase">Date</th>
                            <th className="px-3 py-2 text-gray-400 font-semibold text-[12px] uppercase">Montant</th>
                            <th className="px-3 py-2 text-gray-400 font-semibold text-[12px] uppercase">Commission</th>
                            <th className="px-3 py-2 text-gray-400 font-semibold text-[12px] uppercase">Statut</th>
                            <th className="px-3 py-2 text-gray-400 font-semibold text-[12px] uppercase">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {aff.conversions.map((c) => {
                            const daysSince = Math.floor((Date.now() - new Date(c.created_at).getTime()) / 86400000);
                            const canApprove = c.status === "pending" && daysSince >= 30;
                            return (
                              <tr key={c.id}>
                                <td className="px-3 py-2.5 text-gray-700">
                                  {new Date(c.created_at).toLocaleDateString("fr-FR")}
                                  <span className="text-gray-400 text-[11px] ml-1">(il y a {daysSince}j)</span>
                                </td>
                                <td className="px-3 py-2.5 text-gray-700">{Number(c.amount).toFixed(2)}€</td>
                                <td className="px-3 py-2.5 font-semibold text-green-600">{Number(c.commission).toFixed(2)}€</td>
                                <td className="px-3 py-2.5">
                                  <StatusBadge status={c.status} />
                                </td>
                                <td className="px-3 py-2.5">
                                  {c.status === "pending" && (
                                    <button
                                      onClick={() => doAction("approve", { conversion_id: c.id })}
                                      disabled={!canApprove || actionLoading !== null}
                                      className="text-[12px] font-semibold text-amber-600 hover:text-amber-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                                      title={canApprove ? "Valider cette conversion" : `Attendre encore ${30 - daysSince}j`}
                                    >
                                      {canApprove ? "Valider" : `${30 - daysSince}j restants`}
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {affiliates.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-gray-400 text-[15px]">Aucun affilié inscrit pour le moment.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-[12px] text-gray-400 font-medium mb-1">{label}</p>
      <p className={`text-[22px] font-bold ${color ?? "text-gray-900"}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-600 border-amber-200",
    approved: "bg-blue-50 text-blue-600 border-blue-200",
    paid: "bg-green-50 text-green-600 border-green-200",
  };
  const labels: Record<string, string> = { pending: "En attente", approved: "Validé", paid: "Payé" };

  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${styles[status] ?? "bg-gray-50 text-gray-500 border-gray-200"}`}>
      {labels[status] ?? status}
    </span>
  );
}
