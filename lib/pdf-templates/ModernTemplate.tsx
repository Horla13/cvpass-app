import React from "react";
import { Page, Document, View, Text } from "@react-pdf/renderer";
import type { CVData } from "@/lib/pdf-restructure";
import type { CvTemplate } from "@/lib/cv-templates";
import { contactParts, Photo, SectionTitle, ExperienceBlock, FormationBlock, CompetencesBlock, Watermark } from "./shared";

/** Modern — dark header, green accents, clean 1-column */
export function ModernTemplate({ cv, tpl, watermark }: { cv: CVData; tpl: CvTemplate; watermark?: boolean }) {
  const contact = contactParts(cv);
  return (
    <Document>
      <Page size="A4" style={{ fontFamily: "Helvetica", fontSize: tpl.fontSize.body, color: tpl.colors.text, paddingBottom: watermark ? 40 : 30 }}>
        {/* Dark header */}
        <View style={{ backgroundColor: tpl.colors.headerBg, paddingHorizontal: 40, paddingVertical: 24 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: tpl.fontSize.name, fontFamily: "Helvetica-Bold", color: tpl.colors.heading === "#111827" ? "#ffffff" : tpl.colors.heading }}>
                {cv.nom || "CV"}
              </Text>
              {cv.titre && (
                <Text style={{ fontSize: tpl.fontSize.title, color: "#d1d5db", marginTop: 4 }}>{cv.titre}</Text>
              )}
            </View>
            <Photo src={cv.photo} size={56} />
          </View>
          {contact.length > 0 && (
            <Text style={{ fontSize: tpl.fontSize.small, color: "#9ca3af", marginTop: 8 }}>{contact.join("  |  ")}</Text>
          )}
        </View>

        {/* Body */}
        <View style={{ paddingHorizontal: 40, paddingTop: 8 }}>
          {cv.profil && (
            <>
              <SectionTitle title="Profil" tpl={tpl} />
              <Text style={{ fontSize: tpl.fontSize.body, color: tpl.colors.text, lineHeight: 1.5 }}>{cv.profil}</Text>
            </>
          )}
          {cv.experiences?.length > 0 && (
            <>
              <SectionTitle title="Expériences professionnelles" tpl={tpl} />
              {cv.experiences.map((exp, i) => <ExperienceBlock key={i} exp={exp} tpl={tpl} />)}
            </>
          )}
          {cv.formation?.length > 0 && (
            <>
              <SectionTitle title="Formation" tpl={tpl} />
              {cv.formation.map((f, i) => <FormationBlock key={i} f={f} tpl={tpl} />)}
            </>
          )}
          {cv.competences?.length > 0 && (
            <>
              <SectionTitle title="Compétences" tpl={tpl} />
              <CompetencesBlock comps={cv.competences} tpl={tpl} />
            </>
          )}
          {cv.centres_interet?.length > 0 && (
            <>
              <SectionTitle title="Centres d'intérêt" tpl={tpl} />
              <Text style={{ fontSize: tpl.fontSize.body, color: tpl.colors.text }}>{cv.centres_interet.join("  |  ")}</Text>
            </>
          )}
          {cv.informations?.length > 0 && (
            <>
              <SectionTitle title="Informations" tpl={tpl} />
              {cv.informations.map((info, i) => (
                <Text key={i} style={{ fontSize: tpl.fontSize.body, color: tpl.colors.text, marginBottom: 1 }}>{info}</Text>
              ))}
            </>
          )}
        </View>
        {watermark && <Watermark />}
      </Page>
    </Document>
  );
}
