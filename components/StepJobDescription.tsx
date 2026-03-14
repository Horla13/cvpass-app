"use client";
import { useState } from "react";

interface Props {
  onSubmit: (jobOffer: string) => void;
  onBack: () => void;
  isAnalyzing: boolean;
}

export default function StepJobDescription({ onSubmit, onBack, isAnalyzing }: Props) {
  const [text, setText] = useState("");

  return (
    <div className="max-w-[700px] mx-auto">
      <button onClick={onBack} className="flex items-center gap-1 text-[14px] text-brand-gray hover:text-brand-black mb-6 transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        Retour
      </button>

      <h1 className="font-display text-[32px] font-extrabold tracking-[-1.5px] text-center mb-2">
        Collez l&apos;offre d&apos;emploi
      </h1>
      <p className="text-brand-gray text-center mb-8 max-w-[500px] mx-auto">
        Notre IA comparera votre CV avec cette offre pour des suggestions sur mesure.
      </p>

      {/* Tab active */}
      <div className="flex justify-center gap-2 mb-6">
        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-full px-5 py-2 text-[14px] font-medium">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /></svg>
          Coller le texte
        </div>
      </div>

      {/* Textarea */}
      <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Collez la description du poste ici..."
          rows={12}
          className="w-full p-4 text-base resize-none focus:outline-none"
        />
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-100">
          <button
            onClick={() => setText("Nous recherchons un développeur full-stack passionné pour rejoindre notre équipe. Compétences requises : React, Node.js, TypeScript, PostgreSQL. Expérience souhaitée : 3-5 ans.")}
            className="text-[13px] text-blue-500 hover:underline"
          >
            Essayer un exemple
          </button>
          <span className="text-[13px] text-brand-gray">{text.length} caractères</span>
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center">
        <button
          onClick={() => onSubmit(text)}
          disabled={text.length < 50 || isAnalyzing}
          className="flex items-center justify-center gap-2 bg-brand-black text-white rounded-xl px-8 py-3 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
        >
          {isAnalyzing ? (
            "Analyse en cours..."
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
              Analyser le match
            </>
          )}
        </button>
      </div>

      {/* Tips */}
      <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
        {["Description complète", "Section exigences", "Liste qualifications"].map((tip) => (
          <span key={tip} className="text-[12px] bg-gray-100 text-brand-gray rounded-full px-3 py-1">
            {tip}
          </span>
        ))}
      </div>
    </div>
  );
}
