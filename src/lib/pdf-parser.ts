// src/lib/pdf-parser.ts
/* eslint-disable @typescript-eslint/no-require-imports */
export async function parsePDF(buffer: Uint8Array): Promise<string> {
  const { PDFParse } = require("pdf-parse");
  const pdfParser = new PDFParse(buffer);
  const data = await pdfParser.getText();
  return data.text;
}
