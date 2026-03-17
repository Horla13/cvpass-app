interface PricingFeature {
  text: string;
  included: boolean;
  bold?: boolean;
}

interface PricingCardProps {
  name: string;
  description: string;
  priceMain: string;
  priceSuffix: string;
  features: PricingFeature[];
  cta: string;
  highlighted?: boolean;
  guarantee?: string;
  onCtaClick: () => void;
  loading?: boolean;
}

export function PricingCard({
  name,
  description,
  priceMain,
  priceSuffix,
  features,
  cta,
  highlighted = false,
  guarantee,
  onCtaClick,
  loading = false,
}: PricingCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl p-7 relative transition-all duration-200 ${
        highlighted
          ? "border-[1.5px] border-brand-green shadow-[0_4px_20px_rgba(22,163,74,0.1)]"
          : "border-[1.5px] border-gray-200 hover:border-gray-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
      }`}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-green text-white px-3.5 py-1 rounded-full text-[11px] font-display font-bold whitespace-nowrap">
          Le plus populaire
        </div>
      )}
      <div className="font-display text-lg font-bold text-brand-black mb-1 tracking-tight">
        {name}
      </div>
      <p className="text-[13px] text-brand-gray mb-5">{description}</p>
      <div className="flex items-baseline font-display text-[40px] font-extrabold text-brand-black tracking-tighter">
        {priceMain}
        <span className="text-base font-medium text-brand-gray tracking-normal">
          {priceSuffix}
        </span>
      </div>
      <ul className="mt-6 mb-6 space-y-1.5">
        {features.map((f) => (
          <li
            key={f.text}
            className={`flex items-center gap-2 text-[13px] py-1.5 ${
              f.included ? "text-brand-gray" : "text-brand-gray/40"
            }`}
          >
            <span
              className={`font-bold text-[13px] ${
                f.included ? "text-brand-green" : "text-gray-300"
              }`}
            >
              {f.included ? "✓" : "✗"}
            </span>
            <span className={f.bold ? "font-semibold text-brand-black" : ""}>
              {f.text}
            </span>
          </li>
        ))}
      </ul>
      <button
        onClick={onCtaClick}
        disabled={loading}
        className={`w-full py-3 rounded-[10px] text-sm font-display font-bold transition-all duration-200 ${
          highlighted
            ? "bg-brand-black text-white hover:bg-black hover:-translate-y-px"
            : "bg-white text-brand-black border-[1.5px] border-gray-200 hover:border-brand-black"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? "Chargement…" : cta}
      </button>
      {guarantee && (
        <p className="text-[11px] text-gray-400 text-center mt-3">
          {guarantee}
        </p>
      )}
    </div>
  );
}
