import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import type { CVData } from "@/lib/pdf-restructure";
import { getTemplate } from "@/lib/cv-templates";
import { buildCvPdfBuffer } from "@/lib/pdf-render";

import { ModernTemplate } from "./ModernTemplate";
import { ClassicTemplate } from "./ClassicTemplate";
import { SidebarTemplate } from "./SidebarTemplate";
import { ExecutiveTemplate } from "./ExecutiveTemplate";
import { TimelineTemplate } from "./TimelineTemplate";

function getTemplateComponent(templateId: string) {
  switch (templateId) {
    case "classic": return ClassicTemplate;
    case "sidebar": return SidebarTemplate;
    case "executive": return ExecutiveTemplate;
    case "creative": return TimelineTemplate;
    default: return ModernTemplate;
  }
}

export async function renderCvPdf(cv: CVData, options?: { watermark?: boolean; templateId?: string }): Promise<Buffer> {
  const templateId = options?.templateId ?? "modern";
  const tpl = getTemplate(templateId);
  const Component = getTemplateComponent(templateId);

  try {
    const buffer = await renderToBuffer(
      <Component cv={cv} tpl={tpl} watermark={options?.watermark} />
    );
    return Buffer.from(buffer);
  } catch (e) {
    // Fallback to pdfmake if @react-pdf fails (e.g. serverless cold start timeout)
    console.warn("react-pdf render failed, falling back to pdfmake:", (e as Error).message);
    return buildCvPdfBuffer(cv, options);
  }
}
