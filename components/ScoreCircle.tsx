import { cn } from "@/lib/utils";

interface ScoreCircleProps {
  score: number;
  label?: string;
  size?: "sm" | "lg";
}

export function ScoreCircle({
  score,
  label = "Score ATS",
  size = "lg",
}: ScoreCircleProps) {
  const colorClass =
    score < 40
      ? "text-red-500 stroke-red-500"
      : score < 70
      ? "text-orange-500 stroke-orange-500"
      : "text-brand-green stroke-brand-green";

  const radius = size === "lg" ? 54 : 36;
  const strokeWidth = size === "lg" ? 8 : 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(score, 100) / 100) * circumference;
  const svgSize = (radius + strokeWidth) * 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          className="-rotate-90"
        >
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn("transition-all duration-500", colorClass)}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={cn(
              "font-bold",
              size === "lg" ? "text-2xl" : "text-base",
              colorClass
            )}
          >
            {score}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-brand-gray text-sm">{label}</span>
      )}
    </div>
  );
}
