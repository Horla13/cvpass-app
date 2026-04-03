"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";

interface Affiliate {
  id: string;
  code: string;
  email: string;
  commission_rate: number;
  total_earned: number;
  total_paid: number;
  status: string;
  created_at: string;
}

interface Conversion {
  id: string;
  referred_user_id: string;
  amount: number;
  commission: number;
  status: string;
  created_at: string;
}

interface Stats {
  total_conversions: number;
  pending: number;
  approved: number;
  paid: number;
  total_earned: number;
  total_paid: number;
  balance: number;
}

export default function AffiliateDashboardPage() {
  const router = useRouter();
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/affiliate")
      .then((r) => r.json())
      .then((data) => {
        if (!data.affiliate) {
          router.push("/affiliate/join");
          return;
        }
        setAffiliate(data.affiliate);
        setConversions(data.conversions ?? []);
        setStats(data.stats);
      })
      .catch(() => router.push("/affiliate/join"))
      .finally(() => setLoading(false));
  }, [router]);

  const copyLink = () => {
    if (!affiliate) return;
    navigator.clipboard.writeText(`https://cvpass.fr/?ref=${affiliate.code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  if (!affiliate || !stats) return null;

  const referralLink = `https://cvpass.fr/?ref=${affiliate.code}`;

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <AppHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-display text-[28px] font-extrabold text-gray-900 mb-2">Dashboard affilié</h1>
        <p className="text-gray-500 text-[14px] mb-8">Suivez vos performances et vos commissions en temps réel.</p>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Conversions" value={stats.total_conversions} />
          <StatCard label="Commission totale" value={`${stats.total_earned.toFixed(2)}€`} color="text-green-600" />
          <StatCard label="En attente" value={`${stats.balance.toFixed(2)}€`} color="text-amber-500" />
          <StatCard label="Déjà payé" value={`${stats.total_paid.toFixed(2)}€`} />
        </div>

        {/* Referral link */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-3">Votre lien de parrainage</h2>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-50 rounded-lg px-4 py-3 text-[14px] text-gray-700 font-mono truncate border border-gray-200">
              {referralLink}
            </div>
            <button
              onClick={copyLink}
              className="px-5 py-3 min-h-[48px] bg-gray-900 text-white text-[14px] font-semibold rounded-xl hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              {copied ? "Copié !" : "Copier"}
            </button>
          </div>
          <p className="text-[12px] text-gray-400 mt-2">
            Code : <span className="font-mono font-bold text-gray-600">{affiliate.code}</span> — Commission : {(affiliate.commission_rate * 100).toFixed(0)}% sur le 1er achat
          </p>
        </div>

        {/* Conversions table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Historique des conversions</h2>
          </div>

          {conversions.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-400 text-[15px]">Aucune conversion pour le moment.</p>
              <p className="text-gray-400 text-[13px] mt-1">Partagez votre lien pour commencer à gagner des commissions.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <th className="px-6 py-3 text-gray-400 font-semibold text-[12px] uppercase">Date</th>
                    <th className="px-6 py-3 text-gray-400 font-semibold text-[12px] uppercase">Montant</th>
                    <th className="px-6 py-3 text-gray-400 font-semibold text-[12px] uppercase">Commission</th>
                    <th className="px-6 py-3 text-gray-400 font-semibold text-[12px] uppercase">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {conversions.map((c) => (
                    <tr key={c.id}>
                      <td className="px-6 py-3 text-gray-700">
                        {new Date(c.created_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-6 py-3 text-gray-700">{c.amount.toFixed(2)}€</td>
                      <td className="px-6 py-3 font-semibold text-green-600">{c.commission.toFixed(2)}€</td>
                      <td className="px-6 py-3">
                        <StatusBadge status={c.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Payout info */}
        <div className="mt-6 bg-gray-50 rounded-xl p-5 text-[13px] text-gray-500">
          <p><strong>Paiement :</strong> Payout mensuel dès 20€ de solde validé. Les commissions sont validées 30 jours après la conversion (protection remboursement). Contact : contact@cvpass.fr</p>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-[12px] text-gray-400 font-medium mb-1">{label}</p>
      <p className={`text-[24px] font-bold ${color ?? "text-gray-900"}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: "bg-amber-50 text-amber-600 border-amber-200",
    approved: "bg-green-50 text-green-600 border-green-200",
    paid: "bg-blue-50 text-blue-600 border-blue-200",
  };
  const labels = { pending: "En attente", approved: "Validé", paid: "Payé" };
  const s = styles[status as keyof typeof styles] ?? "bg-gray-50 text-gray-500 border-gray-200";
  const l = labels[status as keyof typeof labels] ?? status;

  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${s}`}>
      {l}
    </span>
  );
}
