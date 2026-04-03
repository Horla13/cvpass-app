// Barrel re-export
export type { CVData, Experience, Formation, LetterMeta } from "@/lib/pdf-render";
export { restructureWithGPT } from "@/lib/pdf-restructure";
export { buildContent, buildCvPdfBuffer, buildLetterPdfBuffer } from "@/lib/pdf-render";
export { renderCvPdf } from "@/lib/pdf-templates";
