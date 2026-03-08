import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Gap } from "@/lib/store";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 50,
    color: "#111827",
    lineHeight: 1.5,
  },
  line: {
    marginBottom: 3,
  },
  emptyLine: {
    marginBottom: 8,
  },
});

interface CVDocumentProps {
  cvText: string;
  acceptedGaps: Gap[];
}

export function CVDocument({ cvText, acceptedGaps }: CVDocumentProps) {
  let finalText = cvText;
  for (const gap of acceptedGaps) {
    finalText = finalText.replace(gap.texte_original, gap.texte_suggere);
  }

  const lines = finalText.split("\n");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          {lines.map((line, i) => (
            <Text key={i} style={line.trim() === "" ? styles.emptyLine : styles.line}>
              {line || " "}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
