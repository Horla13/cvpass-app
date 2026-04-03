"use client";

interface Props {
  credits: number;
  unlimited: boolean;
  filename: string;
  onChoose: (type: "ats" | "jd" | "letter") => void;
  onBack: () => void;
}

export default function StepAnalysisType({ credits, unlimited, filename, onChoose, onBack }: Props) {
  return (
    <div className="max-w-[900px] mx-auto">
      {/* Breadcrumb */}
      <button onClick={onBack} className="flex items-center gap-1 text-[14px] text-brand-gray hover:text-brand-black mb-6 transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        Choisir un autre CV
      </button>

      {/* Bandeau CV sélectionné */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 text-[14px]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          <span className="text-green-700 font-medium">CV uploadé : {filename}</span>
        </div>
      </div>

      <h1 className="font-display text-[32px] font-extrabold tracking-[-1.5px] text-center mb-2">
        Que souhaitez-vous faire ?
      </h1>
      <p className="text-brand-gray text-center mb-4">
        Choisissez une option pour commencer
      </p>

      {/* Crédits restants */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-[14px]">
          <span className="text-amber-500">&#9889;</span>
          <span className="font-semibold">{unlimited ? "Illimité" : `${credits} crédits`}</span>
          <span className="text-brand-gray">|</span>
          <span className="text-brand-gray text-[13px]">ATS : 1 &middot; JD : 2 &middot; Lettre : 1 &middot; PDF : 1 crédit</span>
        </div>
      </div>

      {/* 3 cartes */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Analyse ATS générale */}
        <button
          onClick={() => onChoose("ats")}
          className="group text-left border border-gray-200 rounded-2xl p-8 hover:border-brand-green/50 hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
          </div>
          <h3 className="font-display text-[20px] font-bold mb-2">Analyser mon CV</h3>
          <p className="text-brand-gray text-[14px] leading-relaxed mb-6">
            Vérifiez si votre CV est bien lu par les logiciels de recrutement et obtenez des suggestions d&apos;amélioration.
          </p>
          <ul className="space-y-3 mb-8">
            {["Analyse d'impact & résultats", "Clarté & concision", "Format & compatibilité ATS", "Détection de répétitions"].map((f) => (
              <li key={f} className="flex items-center gap-2 text-[14px]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                {f}
              </li>
            ))}
          </ul>
          <div className="w-full bg-brand-black text-white rounded-xl py-3 text-center font-semibold text-[15px] group-hover:bg-gray-800 transition-colors">
            Analyser mon CV (1 crédit)
          </div>
        </button>

        {/* Match offre d'emploi */}
        <button
          onClick={() => onChoose("jd")}
          className="group text-left border border-gray-200 rounded-2xl p-8 hover:border-brand-green/50 hover:shadow-md transition-all relative"
        >
          <div className="absolute -top-3 right-6 bg-brand-green text-white text-[12px] font-bold px-3 py-1 rounded-full">
            Recommandé
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2"><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></svg>
          </div>
          <h3 className="font-display text-[20px] font-bold mb-2">Comparer à une offre</h3>
          <p className="text-brand-gray text-[14px] leading-relaxed mb-6">
            Collez une offre d&apos;emploi et voyez si votre CV correspond — avec des suggestions ciblées pour chaque lacune.
          </p>
          <ul className="space-y-3 mb-8">
            {["Analyse mots-clés ciblée", "Compétences manquantes", "Suggestions personnalisées", "Taux de correspondance"].map((f) => (
              <li key={f} className="flex items-center gap-2 text-[14px]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                {f}
              </li>
            ))}
          </ul>
          <div className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl py-3 text-center font-semibold text-[15px] group-hover:opacity-90 transition-opacity">
            Comparer à une offre (2 crédits)
          </div>
        </button>

        {/* Lettre de motivation */}
        <button
          onClick={() => onChoose("letter")}
          className="group text-left border border-gray-200 rounded-2xl p-8 hover:border-brand-green/50 hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" /></svg>
          </div>
          <h3 className="font-display text-[20px] font-bold mb-2">Générer une lettre</h3>
          <p className="text-brand-gray text-[14px] leading-relaxed mb-6">
            Créez une lettre de motivation personnalisée en quelques secondes, adaptée à l&apos;offre que vous visez.
          </p>
          <ul className="space-y-3 mb-8">
            {["Adaptée à l'offre d'emploi", "Basée sur votre parcours réel", "Format professionnel français", "Export PDF inclus"].map((f) => (
              <li key={f} className="flex items-center gap-2 text-[14px]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                {f}
              </li>
            ))}
          </ul>
          <div className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl py-3 text-center font-semibold text-[15px] group-hover:opacity-90 transition-opacity">
            Générer ma lettre (1 crédit)
          </div>
        </button>
      </div>
    </div>
  );
}
