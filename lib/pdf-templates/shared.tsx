import React from "react";
import { Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { CVData } from "@/lib/pdf-restructure";
import type { CvTemplate } from "@/lib/cv-templates";

export { React };

/** Contact line as array of strings */
export function contactParts(cv: CVData): string[] {
  const parts: string[] = [];
  if (cv.contact?.email) parts.push(cv.contact.email);
  if (cv.contact?.telephone) parts.push(cv.contact.telephone);
  if (cv.contact?.ville) parts.push(cv.contact.ville);
  if (cv.contact?.linkedin) parts.push(cv.contact.linkedin.replace(/^https?:\/\/(www\.)?/, ""));
  return parts;
}

/** Watermark overlay */
export function Watermark() {
  const s = StyleSheet.create({
    overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center" },
    text: { fontSize: 52, color: "#d1d5db", opacity: 0.12, fontWeight: "bold", transform: "rotate(-35deg)" },
    footer: { position: "absolute", bottom: 12, left: 0, right: 0, textAlign: "center", fontSize: 8, color: "#9ca3af" },
  });
  return (
    <>
      <View style={s.overlay} fixed>
        <Text style={s.text}>APERCU cvpass.fr</Text>
      </View>
      <Text style={s.footer} fixed>APERCU — Telechargez le PDF pour retirer le filigrane | cvpass.fr</Text>
    </>
  );
}

/** Photo component — image arrives already circular-cropped via sharp */
export function Photo({ src, size = 52 }: { src?: string; size?: number }) {
  if (!src) return null;
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image src={src} style={{ width: size, height: size }} />;
}

/** Section title variants */
export function SectionTitle({ title, tpl, width }: { title: string; tpl: CvTemplate; width?: number }) {
  const label = title.toUpperCase();
  const w = width ?? "100%";

  switch (tpl.sectionStyle) {
    case "background":
      return (
        <View style={{ backgroundColor: tpl.colors.primary, paddingHorizontal: 8, paddingVertical: 4, marginTop: 14, marginBottom: 6, width: w }}>
          <Text style={{ fontSize: tpl.fontSize.section, fontFamily: "Helvetica-Bold", color: "#ffffff", letterSpacing: 2 }}>{label}</Text>
        </View>
      );
    case "leftBorder":
      return (
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12, marginBottom: 5 }}>
          <View style={{ width: 3, height: 16, backgroundColor: tpl.colors.primary, marginRight: 8 }} />
          <Text style={{ fontSize: tpl.fontSize.section, fontFamily: "Helvetica-Bold", color: tpl.colors.primary, letterSpacing: 2 }}>{label}</Text>
        </View>
      );
    case "capsule":
      return (
        <View style={{ borderWidth: 1.5, borderColor: tpl.colors.primary, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 3, alignSelf: "flex-start", marginTop: 14, marginBottom: 6 }}>
          <Text style={{ fontSize: tpl.fontSize.section - 1, fontFamily: "Helvetica-Bold", color: tpl.colors.primary, letterSpacing: 2 }}>{label}</Text>
        </View>
      );
    case "dotted":
      return (
        <View style={{ marginTop: 14, marginBottom: 6 }}>
          <Text style={{ fontSize: tpl.fontSize.section, fontFamily: "Helvetica-Bold", color: tpl.colors.primary, letterSpacing: 2 }}>{label}</Text>
          <View style={{ borderBottomWidth: 1, borderBottomColor: tpl.colors.primary, borderStyle: "dashed", marginTop: 2 }} />
        </View>
      );
    case "minimal":
      return (
        <View style={{ marginTop: 16, marginBottom: 6 }}>
          <Text style={{ fontSize: tpl.fontSize.section, fontFamily: "Helvetica-Bold", color: tpl.colors.subtext, letterSpacing: 3 }}>{label}</Text>
        </View>
      );
    default: // underline
      return (
        <View style={{ marginTop: 14, marginBottom: 6 }}>
          <Text style={{ fontSize: tpl.fontSize.section, fontFamily: "Helvetica-Bold", color: tpl.colors.primary, letterSpacing: 2.2 }}>{label}</Text>
          <View style={{ borderBottomWidth: 1.5, borderBottomColor: tpl.colors.primary, marginTop: 3 }} />
        </View>
      );
  }
}

/** Bullet character */
export function bulletChar(tpl: CvTemplate): string {
  switch (tpl.bulletStyle) {
    case "dot": return "\u2022 ";
    case "arrow": return "\u203A ";
    case "square": return "\u25AA ";
    case "none": return "";
    default: return "- ";
  }
}

/** Experience block */
export function ExperienceBlock({ exp, tpl }: { exp: CVData["experiences"][0]; tpl: CvTemplate }) {
  return (
    <View style={{ marginBottom: 6 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
        <Text style={{ fontSize: tpl.fontSize.section, fontFamily: "Helvetica-Bold", color: tpl.colors.text, flex: 1 }}>{exp.poste || ""}</Text>
        <Text style={{ fontSize: tpl.fontSize.small, fontStyle: "italic", color: tpl.colors.subtext }}>{exp.periode || ""}</Text>
      </View>
      {(exp.entreprise || exp.lieu) && (
        <Text style={{ fontSize: tpl.fontSize.small, fontStyle: "italic", color: tpl.colors.subtext, marginBottom: 2 }}>
          {[exp.entreprise, exp.lieu].filter(Boolean).join(" - ")}
        </Text>
      )}
      {exp.missions?.map((m, i) => (
        <Text key={i} style={{ fontSize: tpl.fontSize.body, color: tpl.colors.text, marginLeft: 6, marginBottom: 1 }}>
          {bulletChar(tpl)}{m}
        </Text>
      ))}
    </View>
  );
}

/** Formation block */
export function FormationBlock({ f, tpl }: { f: CVData["formation"][0]; tpl: CvTemplate }) {
  return (
    <View style={{ marginBottom: 4 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
        <Text style={{ fontSize: tpl.fontSize.section, fontFamily: "Helvetica-Bold", color: tpl.colors.text, flex: 1 }}>{f.diplome || ""}</Text>
        <Text style={{ fontSize: tpl.fontSize.small, fontStyle: "italic", color: tpl.colors.subtext }}>{f.periode || ""}</Text>
      </View>
      {f.etablissement && (
        <Text style={{ fontSize: tpl.fontSize.small, fontStyle: "italic", color: tpl.colors.subtext }}>{f.etablissement}</Text>
      )}
    </View>
  );
}

/** Competences display variants */
export function CompetencesBlock({ comps, tpl }: { comps: string[]; tpl: CvTemplate }) {
  switch (tpl.competenceStyle) {
    case "grid":
      return (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 0 }}>
          {comps.map((c, i) => (
            <Text key={i} style={{ fontSize: tpl.fontSize.body, color: tpl.colors.text, width: "33%", marginBottom: 2 }}>
              {bulletChar(tpl)}{c}
            </Text>
          ))}
        </View>
      );
    case "tags":
      return (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
          {comps.map((c, i) => (
            <View key={i} style={{ borderWidth: 0.5, borderColor: "#d1d5db", borderRadius: 3, paddingHorizontal: 6, paddingVertical: 2 }}>
              <Text style={{ fontSize: tpl.fontSize.body, color: tpl.colors.text }}>{c}</Text>
            </View>
          ))}
        </View>
      );
    case "comma":
      return <Text style={{ fontSize: tpl.fontSize.body, color: tpl.colors.text }}>{comps.join(", ")}</Text>;
    default:
      return <Text style={{ fontSize: tpl.fontSize.body, color: tpl.colors.text }}>{comps.join("  |  ")}</Text>;
  }
}
