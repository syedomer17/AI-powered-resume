declare module 'pdf-parse' {
  interface PDFParseResult {
    numpages: number;
    numrender: number;
    info: Record<string, any>;
    metadata?: any;
    text: string;
    version: string;
  }
  function pdfParse(dataBuffer: Buffer | Uint8Array): Promise<PDFParseResult>;
  export default pdfParse;
}
