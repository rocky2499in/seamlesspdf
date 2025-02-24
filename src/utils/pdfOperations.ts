
import { PDFDocument } from 'pdf-lib';
import { Document, Packer, Paragraph } from 'docx';
import mammoth from 'mammoth';

export const convertToText = async (pdfBytes: ArrayBuffer, onProgress: (progress: number) => void): Promise<string> => {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  let text = '';
  
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    text += `Page ${i + 1}\nSize: ${width}x${height}\n\n`;
    onProgress((i + 1) / pages.length * 100);
  }
  
  return text;
};

export const convertToWord = async (pdfBytes: ArrayBuffer, onProgress: (progress: number) => void): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  let text = '';
  
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    text += `Page ${i + 1}\nContent from page ${i + 1}\n`;
    onProgress((i + 1) / pages.length * 100);
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: text
        }),
      ],
    }],
  });

  return await Packer.toBuffer(doc);
};

export const wordToPDF = async (wordFile: File): Promise<Uint8Array> => {
  const arrayBuffer = await wordFile.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const htmlContent = result.value;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  
  page.drawText(htmlContent.replace(/<[^>]*>/g, ''), {
    x: 50,
    y: height - 50,
    size: 12,
  });

  return await pdfDoc.save();
};

export const protectPDF = async (pdfBytes: ArrayBuffer): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  return await pdfDoc.save();
};
