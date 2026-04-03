"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";

export default function AffiliateJoinPage() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      router.push("/login?redirect_url=/affiliate/join");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/affiliate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim().toUpperCase(), email: email.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Erreur lors de la création");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/affiliate"), 2000);
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <AppHeader />
      <main className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <span className="inline-block bg-green-50 text-green-600 text-[13px] font-semibold px-4 py-1.5 rounded-full mb-4">
            Programme affilié
          </span>
          <h1 className="font-display text-[36px] md:text-[44px] font-extrabold tracking-[-1.5px] text-gray-900 mb-4">
            Gagnez 50% de commission
          </h1>
          <p className="text-gray-500 text-[16px] max-w-lg mx-auto">
            Partagez votre lien, gagnez 50% sur chaque premier achat.
            Pas de plafond, pas de limite.
          </p>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { step: "1", title: "Inscrivez-vous", desc: "Créez votre code affilié unique en 30 secondes." },
            { step: "2", title: "Partagez", desc: "Diffusez votre lien sur vos réseaux, blog ou newsletter." },
            { step: "3", title: "Gagnez", desc: "50% de commission sur chaque premier achat via votre lien." },
          ].map((item) => (
            <div key={item.step} className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-green-500 text-white font-bold text-[16px] flex items-center justify-center mx-auto mb-3">
                {item.step}
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-[14px] text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Commission details */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-3">Détails du programme</h3>
          <ul className="space-y-2 text-[14px] text-gray-600">
            <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">&#10003;</span> 50% de commission sur le premier achat</li>
            <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">&#10003;</span> Cookie de tracking 30 jours</li>
            <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">&#10003;</span> Paiement mensuel dès 20&#8364; de solde</li>
            <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">&#10003;</span> Dashboard en temps réel</li>
            <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">&#10003;</span> Validation après 30 jours (protection remboursement)</li>
          </ul>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
            <p className="text-green-700 font-semibold text-[16px]">Compte affilié créé !</p>
            <p className="text-gray-500 text-[14px] mt-2">Redirection vers votre dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-gray-900 text-[18px]">Créer votre compte affilié</h3>

            {!isSignedIn && (
              <p className="text-[14px] text-amber-600 bg-amber-50 rounded-lg px-4 py-2">
                Vous devez être connecté pour devenir affilié.{" "}
                <Link href="/login?redirect_url=/affiliate/join" className="underline font-semibold">Se connecter</Link>
              </p>
            )}

            <div>
              <label htmlFor="affiliate-code" className="block text-[14px] font-medium text-gray-700 mb-1">
                Votre code affilié
              </label>
              <input
                id="affiliate-code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                placeholder="ex: GIOVANNI50"
                maxLength={20}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <p className="text-[12px] text-gray-400 mt-1">3-20 caractères, lettres et chiffres uniquement</p>
            </div>

            <div>
              <label htmlFor="affiliate-email" className="block text-[14px] font-medium text-gray-700 mb-1">
                Email de paiement
              </label>
              <input
                id="affiliate-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <p className="text-[12px] text-gray-400 mt-1">Pour recevoir vos paiements de commission</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-[13px] text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !isSignedIn}
              className="w-full py-3.5 min-h-[48px] bg-green-500 text-white text-[15px] font-semibold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Création...
                </>
              ) : (
                "Devenir affilié"
              )}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
