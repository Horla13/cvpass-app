import React from "react";
import { Page, Document, View, Text } from "@react-pdf/renderer";
import type { CVData } from "@/lib/pdf-restructure";
import type { CvTemplate } from "@/lib/cv-templates";
import { contactParts, Photo, SectionTitle, ExperienceBlock, FormationBlock, CompetencesBlock, Watermark } from "./shared";

/** Executive — large colored banner header, bold section backgrounds */
export function ExecutiveTemplate({ cv, tpl, watermark }: { cv: CVData; tpl: CvTemplate; watermark?: boolean }) {
  const contact = contactParts(cv);
  return (
    <Document>
      <Page size="A4" style={{ fontFamily: "Helvetica", fontSize: tpl.fontSize.body, color: tpl.colors.text, paddingBottom: watermark ? 50 : 30 }}>
        {/* Big banner header */}
        <View style={{ backgroundColor: tpl.colors.headerBg, paddingHorizontal: 44, paddingVertical: 32 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: tpl.fontSize.name, fontFamily: "Helvetica-Bold", color: "#ffffff" }}>
                {cv.nom || "CV"}
              </Text>
              {cv.titre && (
                <Text style={{ fontSize: tpl.fontSize.title + 1, color: "#cbd5e1", marginTop: 6 }}>{cv.titre}</Text>
              )}
            </View>
            <Photo src={cv.photo} size={72} />
          </View>
          {/* Contact bar */}
          {contact.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16, marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.2)" }}>
              {contact.map((c, i) => (
                <Text key={i} style={{ fontSize: 9, color: "#94a3b8" }}>{c}</Text>
              ))}
            </View>
          )}
        </View>

        {/* Body */}
        <View style={{ paddingHorizontal: 44, paddingTop: 10 }}>
          {cv.profil && (
            <>
              <SectionTitle title="Profil" tpl={tpl} />
              <Text style={{ fontSize: tpl.fontSize.body, lineHeight: 1.6 }}>{cv.profil}</Text>
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
              <Text style={{ fontSize: tpl.fontSize.body }}>{cv.centres_interet.join("  |  ")}</Text>
            </>
          )}
          {cv.informations?.length > 0 && (
            <>
              <SectionTitle title="Informations" tpl={tpl} />
              {cv.informations.map((info, i) => <Text key={i} style={{ fontSize: tpl.fontSize.body, marginBottom: 1 }}>{info}</Text>)}
            </>
          )}
        </View>
        {watermark && <Watermark />}
      </Page>
    </Document>
  );
}
