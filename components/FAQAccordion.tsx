"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-[700px] mx-auto">
      {items.map((item, i) => (
        <div key={i} className="border-b border-gray-100">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex justify-between items-center py-5 text-left font-display font-semibold text-[15px] text-brand-black hover:text-brand-green transition-colors"
            aria-expanded={openIndex === i}
          >
            <span>{item.question}</span>
            <span
              className={`text-lg text-gray-400 transition-transform duration-300 ${
                openIndex === i ? "rotate-45" : ""
              }`}
            >
              +
            </span>
          </button>
          <div
            className={`text-sm text-brand-gray leading-relaxed overflow-hidden transition-all duration-300 ${
              openIndex === i ? "max-h-[500px] pb-5" : "max-h-0"
            }`}
          >
            {item.answer}
          </div>
        </div>
      ))}
    </div>
  );
}
