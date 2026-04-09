"use client";

/**
 * Displays a suggestion text with the first few words visible
 * and the rest blurred. Once the suggestion is accepted,
 * the full text is shown without blur.
 *
 * Prevents copy-paste of AI suggestions before acceptance.
 */
export function BlurredSuggestion({
  text,
  status,
  previewWords = 4,
}: {
  text: string;
  status: "pending" | "accepted" | "ignored";
  previewWords?: number;
}) {
  // Once accepted or ignored, show full text
  if (status !== "pending") {
    return <span>{text}</span>;
  }

  const words = text.split(" ");
  const visible = words.slice(0, previewWords).join(" ");
  const hidden = words.slice(previewWords).join(" ");

  if (!hidden) {
    // Short text — show it all but prevent selection
    return <span style={{ userSelect: "none", WebkitUserSelect: "none" }}>{text}</span>;
  }

  return (
    <span style={{ userSelect: "none", WebkitUserSelect: "none" }}>
      {visible}{" "}
      <span
        style={{
          filter: "blur(5px)",
          WebkitFilter: "blur(5px)",
          opacity: 0.7,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        {hidden}
      </span>
    </span>
  );
}
