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
    <div className="max-w-[700px] mx-auto border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <div className="grid grid-cols-[1fr_100px_100px] bg-gray-50 dark:bg-[#0f172a] px-5 py-3 border-b border-gray-200 dark:border-gray-700 text-xs font-display font-bold text-brand-gray dark:text-gray-400 uppercase tracking-wider">
        <span>Compétence</span>
        <span className="text-center">Votre CV</span>
        <span className="text-center">Après</span>
      </div>
      {rows.map((row, i) => (
        <div
          key={i}
          className="grid grid-cols-[1fr_100px_100px] px-5 py-3 border-b border-gray-100 dark:border-gray-700/50 last:border-b-0 text-[13px] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="font-semibold text-brand-black dark:text-gray-100">{row.skill}</span>
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
