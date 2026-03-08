import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  color?: "green" | "blue" | "orange" | "purple" | "gray";
  className?: string;
}

const colorMap: Record<NonNullable<BadgeProps["color"]>, string> = {
  green: "bg-green-100 text-green-800",
  blue: "bg-blue-100 text-blue-800",
  orange: "bg-orange-100 text-orange-800",
  purple: "bg-purple-100 text-purple-800",
  gray: "bg-gray-100 text-gray-700",
};

export function Badge({
  children,
  color = "gray",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        colorMap[color],
        className
      )}
    >
      {children}
    </span>
  );
}
