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
        <div key={i} className="border-b border-gray-100 dark:border-gray-700">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex justify-between items-center py-5 text-left font-display font-semibold text-[15px] text-brand-black dark:text-gray-100 hover:text-brand-green transition-colors"
            aria-expanded={openIndex === i}
          >
            <span>{item.question}</span>
            <span
              className={`text-lg text-gray-400 dark:text-gray-500 transition-transform duration-300 ${
                openIndex === i ? "rotate-45" : ""
              }`}
            >
              +
            </span>
          </button>
          <div
            className={`text-sm text-brand-gray dark:text-gray-400 leading-relaxed overflow-hidden transition-all duration-300 ${
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
