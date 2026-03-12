"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  animate?: boolean;
  label?: string;
  className?: string;
}

export function ScoreGauge({
  score,
  size = 120,
  strokeWidth = 7,
  animate = true,
  label = "Score ATS",
  className,
}: ScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(displayScore, 100) / 100);

  const color =
    displayScore < 40
      ? "#ef4444"
      : displayScore < 70
      ? "#f59e0b"
      : "#16a34a";

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      return;
    }
    let frame: number;
    const start = performance.now();
    const duration = 1500;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score, animate]);

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-display font-extrabold"
            style={{ fontSize: size * 0.27, color }}
          >
            {displayScore}
          </span>
          <span className="text-[11px] text-gray-400">/100</span>
        </div>
      </div>
      {label && (
        <span className="text-xs font-display font-semibold" style={{ color }}>
          {label}
        </span>
      )}
    </div>
  );
}
