/**
 * @jest-environment node
 */
import { extractTextFromBuffer } from "./parse-document";

describe("extractTextFromBuffer", () => {
  test("throws on unsupported format", async () => {
    const buffer = Buffer.from("test content");
    await expect(
      extractTextFromBuffer(buffer, "document.txt")
    ).rejects.toThrow("Format non supporté");
  });

  test("throws on missing extension", async () => {
    const buffer = Buffer.from("test content");
    await expect(
      extractTextFromBuffer(buffer, "noextension")
    ).rejects.toThrow("Format non supporté");
  });

  test("accepts .pdf extension without throwing format error", async () => {
    // On mock pdf-parse pour éviter d'avoir besoin d'un vrai PDF
    jest.mock("pdf-parse", () =>
      jest.fn().mockResolvedValue({ text: "CV text from PDF" })
    );
    const buffer = Buffer.from("fake-pdf-content");
    // On vérifie que la fonction ne throw pas "Format non supporté" pour .pdf
    // Elle peut throw autre chose si le buffer est invalide, c'est OK
    try {
      await extractTextFromBuffer(buffer, "cv.pdf");
    } catch (e: unknown) {
      expect((e as Error).message).not.toContain("Format non supporté");
    }
  });

  test("accepts .docx extension without throwing format error", async () => {
    jest.mock("mammoth", () => ({
      extractRawText: jest.fn().mockResolvedValue({ value: "CV text from DOCX" }),
    }));
    const buffer = Buffer.from("fake-docx-content");
    try {
      await extractTextFromBuffer(buffer, "cv.docx");
    } catch (e: unknown) {
      expect((e as Error).message).not.toContain("Format non supporté");
    }
  });
});
