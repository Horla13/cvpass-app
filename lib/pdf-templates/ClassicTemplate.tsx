import React from "react";
import { Page, Document, View, Text } from "@react-pdf/renderer";
import type { CVData } from "@/lib/pdf-restructure";
import type { CvTemplate } from "@/lib/cv-templates";
import { contactParts, Photo, SectionTitle, ExperienceBlock, FormationBlock, CompetencesBlock, Watermark } from "./shared";

/** Classic — white header, black text, traditional serif-like feel, centered name */
export function ClassicTemplate({ cv, tpl, watermark }: { cv: CVData; tpl: CvTemplate; watermark?: boolean }) {
  const contact = contactParts(cv);
  return (
    <Document>
      <Page size="A4" style={{ fontFamily: "Helvetica", fontSize: tpl.fontSize.body, color: tpl.colors.text, padding: 40, paddingBottom: watermark ? 50 : 40 }}>
        {/* Centered header */}
        <View style={{ alignItems: "center", marginBottom: 8 }}>
          <Photo src={cv.photo} size={64} />
          <Text style={{ fontSize: tpl.fontSize.name, fontFamily: "Helvetica-Bold", color: tpl.colors.heading, marginTop: cv.photo ? 8 : 0, textAlign: "center" }}>
            {cv.nom || "CV"}
          </Text>
          {cv.titre && (
            <Text style={{ fontSize: tpl.fontSize.title, color: tpl.colors.subtext, marginTop: 3, textAlign: "center" }}>{cv.titre}</Text>
          )}
          {contact.length > 0 && (
            <Text style={{ fontSize: tpl.fontSize.small, color: tpl.colors.subtext, marginTop: 6, textAlign: "center" }}>{contact.join("  •  ")}</Text>
          )}
        </View>
        {/* Separator */}
        <View style={{ borderBottomWidth: 2, borderBottomColor: tpl.colors.primary, marginVertical: 6 }} />

        {cv.profil && (
          <>
            <SectionTitle title="Profil" tpl={tpl} />
            <Text style={{ fontSize: tpl.fontSize.body, lineHeight: 1.5 }}>{cv.profil}</Text>
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
            <Text style={{ fontSize: tpl.fontSize.body }}>{cv.centres_interet.join(", ")}</Text>
          </>
        )}
        {cv.informations?.length > 0 && (
          <>
            <SectionTitle title="Informations" tpl={tpl} />
            {cv.informations.map((info, i) => <Text key={i} style={{ fontSize: tpl.fontSize.body, marginBottom: 1 }}>{info}</Text>)}
          </>
        )}
        {watermark && <Watermark />}
      </Page>
    </Document>
  );
}
