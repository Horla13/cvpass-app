interface GapRow {
  skill: string;
  hasBefore: boolean;
  hasAfter: boolean;
}

interface KeywordGapTableProps {
  rows: GapRow[];
}

export function KeywordGapTable({ rows }: KeywordGapTableProps) {
  return (
    <div className="max-w-[700px] mx-auto border border-gray-200 rounded-xl overflow-hidden">
      <div className="grid grid-cols-[1fr_100px_100px] bg-gray-50 px-5 py-3 border-b border-gray-200 text-xs font-display font-bold text-brand-gray uppercase tracking-wider">
        <span>Compétence</span>
        <span className="text-center">Votre CV</span>
        <span className="text-center">Après</span>
      </div>
      {rows.map((row, i) => (
        <div
          key={i}
          className="grid grid-cols-[1fr_100px_100px] px-5 py-3 border-b border-gray-100 last:border-b-0 text-[13px] hover:bg-gray-50 transition-colors"
        >
          <span className="font-semibold text-brand-black">{row.skill}</span>
          <span
            className={`text-center font-bold ${
              row.hasBefore ? "text-brand-green" : "text-red-500"
            }`}
          >
            {row.hasBefore ? "✓" : "✗"}
          </span>
          <span
            className={`text-center font-bold ${
              row.hasAfter ? "text-brand-green" : "text-red-500"
            }`}
          >
            {row.hasAfter ? "✓" : "✗"}
          </span>
        </div>
      ))}
    </div>
  );
}
