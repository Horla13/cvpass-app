import React from "react";
import { Page, Document, View, Text, Circle, Svg, Line } from "@react-pdf/renderer";
import type { CVData } from "@/lib/pdf-restructure";
import type { CvTemplate } from "@/lib/cv-templates";
import { contactParts, Photo, SectionTitle, FormationBlock, CompetencesBlock, Watermark, bulletChar } from "./shared";

/** Timeline — colored left bar on header, timeline dots on experiences */
export function TimelineTemplate({ cv, tpl, watermark }: { cv: CVData; tpl: CvTemplate; watermark?: boolean }) {
  const contact = contactParts(cv);
  return (
    <Document>
      <Page size="A4" style={{ fontFamily: "Helvetica", fontSize: tpl.fontSize.body, color: tpl.colors.text, padding: 40, paddingBottom: watermark ? 50 : 40 }}>
        {/* Header with left accent bar */}
        <View style={{ flexDirection: "row", marginBottom: 12 }}>
          <View style={{ width: 5, backgroundColor: tpl.colors.primary, marginRight: 14, borderRadius: 2 }} />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: tpl.fontSize.name, fontFamily: "Helvetica-Bold", color: tpl.colors.heading }}>
                  {cv.nom || "CV"}
                </Text>
                {cv.titre && (
                  <Text style={{ fontSize: tpl.fontSize.title, color: tpl.colors.subtext, marginTop: 4 }}>{cv.titre}</Text>
                )}
              </View>
              <Photo src={cv.photo} size={56} />
            </View>
            {contact.length > 0 && (
              <Text style={{ fontSize: tpl.fontSize.small, color: tpl.colors.subtext, marginTop: 6 }}>{contact.join("  |  ")}</Text>
            )}
          </View>
        </View>

        {/* Profil */}
        {cv.profil && (
          <>
            <SectionTitle title="Profil" tpl={tpl} />
            <Text style={{ fontSize: tpl.fontSize.body, lineHeight: 1.5 }}>{cv.profil}</Text>
          </>
        )}

        {/* Experiences with timeline */}
        {cv.experiences?.length > 0 && (
          <>
            <SectionTitle title="Expériences" tpl={tpl} />
            {cv.experiences.map((exp, i) => (
              <View key={i} style={{ flexDirection: "row", marginBottom: 4 }}>
                {/* Timeline column */}
                <View style={{ width: 20, alignItems: "center", paddingTop: 4 }}>
                  <Svg width={10} height={10}>
                    <Circle cx={5} cy={5} r={4} fill={tpl.colors.primary} />
                  </Svg>
                  {i < cv.experiences.length - 1 && (
                    <Svg width={2} height={50} style={{ marginTop: 2 }}>
                      <Line x1={1} y1={0} x2={1} y2={50} stroke={tpl.colors.primary} strokeWidth={1.5} opacity={0.4} />
                    </Svg>
                  )}
                </View>
                {/* Content */}
                <View style={{ flex: 1, paddingLeft: 6 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
                    <Text style={{ fontSize: tpl.fontSize.section, fontFamily: "Helvetica-Bold", color: tpl.colors.text, flex: 1 }}>{exp.poste || ""}</Text>
                    <Text style={{ fontSize: tpl.fontSize.small, fontStyle: "italic", color: tpl.colors.subtext }}>{exp.periode || ""}</Text>
                  </View>
                  {(exp.entreprise || exp.lieu) && (
                    <Text style={{ fontSize: tpl.fontSize.small, fontStyle: "italic", color: tpl.colors.subtext, marginBottom: 2 }}>
                      {[exp.entreprise, exp.lieu].filter(Boolean).join(" - ")}
                    </Text>
                  )}
                  {exp.missions?.map((m, j) => (
                    <Text key={j} style={{ fontSize: tpl.fontSize.body, color: tpl.colors.text, marginLeft: 4, marginBottom: 1 }}>
                      {bulletChar(tpl)}{m}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
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
        {watermark && <Watermark />}
      </Page>
    </Document>
  );
}
