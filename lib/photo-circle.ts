import sharp from "sharp";

/**
 * Takes a base64 data URL image and returns a circular-cropped PNG as base64 data URL.
 * The circle mask makes the photo round in PDF renderers that don't support borderRadius.
 */
export async function circularCrop(dataUrl: string, size = 120): Promise<string> {
  // Extract raw buffer from data URL
  const match = dataUrl.match(/^data:image\/\w+;base64,(.+)$/);
  if (!match) return dataUrl; // not a valid data URL, return as-is

  const inputBuffer = Buffer.from(match[1], "base64");

  // Create circular mask SVG
  const r = size / 2;
  const circleMask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${r}" cy="${r}" r="${r}" fill="white"/></svg>`
  );

  // Resize to square, then apply circular mask
  const result = await sharp(inputBuffer)
    .resize(size, size, { fit: "cover", position: "centre" })
    .composite([
      {
        input: circleMask,
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();

  return `data:image/png;base64,${result.toString("base64")}`;
}
