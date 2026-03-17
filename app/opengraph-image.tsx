import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CVpass — Scanner CV ATS gratuit";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #111827 0%, #1e293b 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "#16a34a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "32px",
              fontWeight: 800,
            }}
          >
            CV
          </div>
          <span
            style={{
              fontSize: "56px",
              fontWeight: 800,
              color: "white",
            }}
          >
            CVpass
          </span>
        </div>
        <div
          style={{
            fontSize: "28px",
            color: "#16a34a",
            fontWeight: 700,
            marginBottom: "16px",
          }}
        >
          Scanner CV ATS gratuit
        </div>
        <div
          style={{
            fontSize: "20px",
            color: "#94a3b8",
            maxWidth: "700px",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Analyse ton CV, calcule ton score ATS et corrige chaque point faible avec l&apos;IA
        </div>
      </div>
    ),
    { ...size }
  );
}
