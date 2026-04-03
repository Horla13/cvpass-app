import React from "react";
import { Page, Document, View, Text } from "@react-pdf/renderer";
import type { CVData } from "@/lib/pdf-restructure";
import type { CvTemplate } from "@/lib/cv-templates";
import { contactParts, Photo, SectionTitle, ExperienceBlock, FormationBlock, Watermark, bulletChar } from "./shared";

/** Sidebar — 2-column layout with colored left sidebar */
export function SidebarTemplate({ cv, tpl, watermark }: { cv: CVData; tpl: CvTemplate; watermark?: boolean }) {
  const contact = contactParts(cv);
  const sideW = 170;

  return (
    <Document>
      <Page size="A4" style={{ fontFamily: "Helvetica", fontSize: tpl.fontSize.body, flexDirection: "row" }}>
        {/* ── LEFT SIDEBAR ── */}
        <View style={{ width: sideW, backgroundColor: tpl.colors.sidebarBg || "#f1f5f9", paddingHorizontal: 16, paddingTop: 30, paddingBottom: watermark ? 50 : 30 }}>
          {/* Photo */}
          <View style={{ alignItems: "center", marginBottom: 16 }}>
            <Photo src={cv.photo} size={80} />
          </View>

          {/* Contact */}
          <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: tpl.colors.primary, letterSpacing: 2, marginBottom: 6 }}>CONTACT</Text>
          {contact.map((c, i) => (
            <Text key={i} style={{ fontSize: 8, color: tpl.colors.text, marginBottom: 3, lineHeight: 1.4 }}>{c}</Text>
          ))}

          {/* Compétences */}
          {cv.competences?.length > 0 && (
            <>
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: tpl.colors.primary, letterSpacing: 2, marginTop: 18, marginBottom: 6 }}>COMPÉTENCES</Text>
              {cv.competences.map((c, i) => (
                <View key={i} style={{ marginBottom: 4 }}>
                  <Text style={{ fontSize: 8.5, color: tpl.colors.text }}>{bulletChar(tpl)}{c}</Text>
                </View>
              ))}
            </>
          )}

          {/* Centres d'intérêt */}
          {cv.centres_interet?.length > 0 && (
            <>
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: tpl.colors.primary, letterSpacing: 2, marginTop: 18, marginBottom: 6 }}>INTÉRÊTS</Text>
              {cv.centres_interet.map((c, i) => (
                <Text key={i} style={{ fontSize: 8.5, color: tpl.colors.text, marginBottom: 2 }}>{c}</Text>
              ))}
            </>
          )}

          {/* Informations */}
          {cv.informations?.length > 0 && (
            <>
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: tpl.colors.primary, letterSpacing: 2, marginTop: 18, marginBottom: 6 }}>INFOS</Text>
              {cv.informations.map((info, i) => (
                <Text key={i} style={{ fontSize: 8.5, color: tpl.colors.text, marginBottom: 2 }}>{info}</Text>
              ))}
            </>
          )}
        </View>

        {/* ── MAIN CONTENT ── */}
        <View style={{ flex: 1, paddingHorizontal: 28, paddingTop: 30, paddingBottom: watermark ? 50 : 30 }}>
          {/* Name + Title */}
          <Text style={{ fontSize: tpl.fontSize.name, fontFamily: "Helvetica-Bold", color: tpl.colors.primary }}>
            {cv.nom || "CV"}
          </Text>
          {cv.titre && (
            <Text style={{ fontSize: tpl.fontSize.title, color: tpl.colors.text, marginTop: 3, marginBottom: 6 }}>{cv.titre}</Text>
          )}
          <View style={{ borderBottomWidth: 2, borderBottomColor: tpl.colors.primary, marginBottom: 4 }} />

          {/* Profil */}
          {cv.profil && (
            <>
              <SectionTitle title="Profil" tpl={tpl} />
              <Text style={{ fontSize: tpl.fontSize.body, color: tpl.colors.text, lineHeight: 1.5 }}>{cv.profil}</Text>
            </>
          )}

          {/* Expériences */}
          {cv.experiences?.length > 0 && (
            <>
              <SectionTitle title="Expériences" tpl={tpl} />
              {cv.experiences.map((exp, i) => <ExperienceBlock key={i} exp={exp} tpl={tpl} />)}
            </>
          )}

          {/* Formation */}
          {cv.formation?.length > 0 && (
            <>
              <SectionTitle title="Formation" tpl={tpl} />
              {cv.formation.map((f, i) => <FormationBlock key={i} f={f} tpl={tpl} />)}
            </>
          )}
        </View>

        {watermark && <Watermark />}
      </Page>
    </Document>
  );
}
