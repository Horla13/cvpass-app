// Barrel re-export — import from pdf-restructure or pdf-render directly for new code
export type { CVData, Experience, Formation, LetterMeta } from "@/lib/pdf-render";
export { restructureWithGPT } from "@/lib/pdf-restructure";
export { buildContent, buildCvPdfBuffer, buildLetterPdfBuffer } from "@/lib/pdf-render";
