interface Props {
  message?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-4",
};

export function LoadingSpinner({ message, size = "md" }: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${sizes[size]} rounded-full border-gray-200 border-t-brand-green animate-spin`}
      />
      {message && <p className="text-sm text-brand-gray">{message}</p>}
    </div>
  );
}
