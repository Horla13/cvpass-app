"use client";

import { useState, useMemo } from "react";
import { AppHeader } from "@/components/AppHeader";
import { cn } from "@/lib/utils";

const SALARY_DATA: Record<string, { junior: [number, number]; confirme: [number, number]; senior: [number, number] }> = {
  "Développeur web": { junior: [28000, 38000], confirme: [40000, 55000], senior: [55000, 75000] },
  "Développeur fullstack": { junior: [30000, 40000], confirme: [42000, 58000], senior: [58000, 80000] },
  "Développeur mobile": { junior: [30000, 40000], confirme: [42000, 58000], senior: [55000, 75000] },
  "Data analyst": { junior: [30000, 38000], confirme: [40000, 52000], senior: [52000, 70000] },
  "Data scientist": { junior: [35000, 42000], confirme: [45000, 60000], senior: [60000, 85000] },
  "Chef de projet digital": { junior: [30000, 38000], confirme: [40000, 52000], senior: [52000, 70000] },
  "Chef de projet IT": { junior: [32000, 40000], confirme: [42000, 55000], senior: [55000, 75000] },
  "Product manager": { junior: [35000, 42000], confirme: [45000, 60000], senior: [60000, 80000] },
  "UX/UI designer": { junior: [28000, 36000], confirme: [38000, 50000], senior: [50000, 65000] },
  "Responsable marketing": { junior: [28000, 36000], confirme: [38000, 52000], senior: [52000, 70000] },
  "Traffic manager / SEA": { junior: [26000, 34000], confirme: [35000, 48000], senior: [48000, 62000] },
  "Responsable SEO": { junior: [27000, 35000], confirme: [36000, 48000], senior: [48000, 60000] },
  "Community manager": { junior: [24000, 30000], confirme: [30000, 40000], senior: [40000, 50000] },
  "Commercial B2B": { junior: [26000, 34000], confirme: [36000, 50000], senior: [50000, 70000] },
  "Business developer": { junior: [28000, 36000], confirme: [38000, 52000], senior: [52000, 70000] },
  "Comptable": { junior: [26000, 32000], confirme: [33000, 42000], senior: [42000, 55000] },
  "Contrôleur de gestion": { junior: [30000, 38000], confirme: [40000, 52000], senior: [52000, 68000] },
  "Responsable RH": { junior: [30000, 38000], confirme: [40000, 52000], senior: [52000, 68000] },
  "Chargé de recrutement": { junior: [26000, 32000], confirme: [33000, 42000], senior: [42000, 55000] },
  "Ingénieur DevOps": { junior: [35000, 45000], confirme: [48000, 62000], senior: [62000, 85000] },
  "Ingénieur cybersécurité": { junior: [35000, 42000], confirme: [45000, 60000], senior: [60000, 80000] },
  "Consultant": { junior: [30000, 38000], confirme: [40000, 55000], senior: [55000, 80000] },
  "Juriste": { junior: [28000, 36000], confirme: [38000, 50000], senior: [50000, 70000] },
  "Infirmier": { junior: [24000, 28000], confirme: [28000, 35000], senior: [35000, 42000] },
};

const CITY_MULTIPLIERS: Record<string, number> = {
  "Paris / Île-de-France": 1.15,
  "Lyon": 1.05,
  "Marseille": 1.0,
  "Toulouse": 1.0,
  "Bordeaux": 1.02,
  "Nantes": 1.0,
  "Lille": 0.98,
  "Strasbourg": 0.98,
  "Rennes": 0.97,
  "Autre ville": 0.95,
};

const JOBS = Object.keys(SALARY_DATA);
const CITIES = Object.keys(CITY_MULTIPLIERS);
const LEVELS = [
  { id: "junior", label: "Junior (0-2 ans)" },
  { id: "confirme", label: "Confirmé (3-5 ans)" },
  { id: "senior", label: "Senior (5+ ans)" },
];

export default function SalairesPage() {
  const [job, setJob] = useState(JOBS[0]);
  const [city, setCity] = useState(CITIES[0]);
  const [level, setLevel] = useState("confirme");
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(() => {
    const base = SALARY_DATA[job]?.[level as keyof typeof SALARY_DATA[string]];
    if (!base) return null;
    const mult = CITY_MULTIPLIERS[city] ?? 1;
    return {
      min: Math.round(base[0] * mult / 100) * 100,
      max: Math.round(base[1] * mult / 100) * 100,
      median: Math.round(((base[0] + base[1]) / 2) * mult / 100) * 100,
    };
  }, [job, city, level]);

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <AppHeader />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-10">
          <span className="inline-block bg-green-50 text-green-600 text-[13px] font-semibold px-4 py-1.5 rounded-full mb-4">Gratuit</span>
          <h1 className="font-display text-[28px] md:text-[36px] font-extrabold tracking-[-1.5px] text-gray-900 mb-3">Simulateur de salaire 2026</h1>
          <p className="text-gray-500 text-[15px] max-w-lg mx-auto">Estimez votre fourchette de salaire brut annuel selon votre poste, votre ville et votre expérience.</p>
        </div>

        <div className="max-w-lg mx-auto bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <div>
            <label className="block text-[14px] font-medium text-gray-700 mb-2">Poste</label>
            <select value={job} onChange={(e) => { setJob(e.target.value); setShowResult(false); }}
              className="w-full px-3 py-2.5 min-h-[44px] text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
              {JOBS.map((j) => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[14px] font-medium text-gray-700 mb-2">Ville</label>
            <select value={city} onChange={(e) => { setCity(e.target.value); setShowResult(false); }}
              className="w-full px-3 py-2.5 min-h-[44px] text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[14px] font-medium text-gray-700 mb-2">Expérience</label>
            <div className="flex gap-2">
              {LEVELS.map((l) => (
                <button key={l.id} onClick={() => { setLevel(l.id); setShowResult(false); }}
                  className={cn("flex-1 py-2.5 min-h-[44px] rounded-lg text-[12px] sm:text-[13px] font-semibold border transition-colors",
                    level === l.id ? "bg-green-500 text-white border-green-500" : "bg-white text-gray-600 border-gray-200"
                  )}>{l.label}</button>
              ))}
            </div>
          </div>

          <button onClick={() => setShowResult(true)}
            className="w-full py-3.5 min-h-[48px] bg-green-500 text-white text-[15px] font-bold rounded-xl hover:bg-green-600 transition-colors">
            Estimer mon salaire
          </button>
        </div>

        {showResult && result && (
          <div className="max-w-lg mx-auto mt-6 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
              <p className="text-[13px] text-gray-400 mb-1">{job} · {city} · {LEVELS.find((l) => l.id === level)?.label}</p>
              <p className="text-[42px] font-extrabold text-green-600 tracking-tight">{result.min.toLocaleString("fr-FR")}€ - {result.max.toLocaleString("fr-FR")}€</p>
              <p className="text-[14px] text-gray-500 mt-1">Salaire brut annuel estimé</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-[18px] font-bold text-gray-700">{Math.round(result.min / 12).toLocaleString("fr-FR")}€</p>
                    <p className="text-[11px] text-gray-400">Brut/mois bas</p>
                  </div>
                  <div>
                    <p className="text-[18px] font-bold text-green-600">{Math.round(result.median / 12).toLocaleString("fr-FR")}€</p>
                    <p className="text-[11px] text-gray-400">Brut/mois médian</p>
                  </div>
                  <div>
                    <p className="text-[18px] font-bold text-gray-700">{Math.round(result.max / 12).toLocaleString("fr-FR")}€</p>
                    <p className="text-[11px] text-gray-400">Brut/mois haut</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[12px] text-gray-400 text-center">Estimations basées sur les données du marché français 2025-2026. Les salaires réels varient selon la taille de l&apos;entreprise, le secteur et les avantages.</p>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
              <p className="text-[14px] text-green-800 font-medium mb-2">Négociez mieux avec un CV optimisé</p>
              <a href="/analyze" className="inline-flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 min-h-[44px] rounded-xl text-[14px] font-bold hover:bg-green-600 transition-colors">
                Scanner mon CV gratuitement
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
