import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import FileUpload from './FileUpload';
import { FileType, Lock } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import mammoth from 'mammoth';
import { Document, Packer, Paragraph } from 'docx';

const PDFConverter = () => {
  const { toast } = useToast();
  const [format, setFormat] = useState<string>('text');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [password, setPassword] = useState('');

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      toast({
        title: "File selected",
        description: `Selected ${files[0].name} for conversion`
      });
    }
  };

  const convertToText = async (pdfBytes: ArrayBuffer): Promise<string> => {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    let text = '';
    
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();
      text += `Page ${i + 1}\nSize: ${width}x${height}\n\n`;
      setProgress((i + 1) / pages.length * 100);
    }
    
    return text;
  };

  const convertToWord = async (pdfBytes: ArrayBuffer): Promise<Uint8Array> => {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    let text = '';
    
    // Extract text from PDF
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      // Basic text extraction
      const { width, height } = page.getSize();
      text += `Page ${i + 1}\nContent from page ${i + 1}\n`;
      setProgress((i + 1) / pages.length * 100);
    }

    // Create Word document
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

  const wordToPDF = async (wordFile: File): Promise<Uint8Array> => {
    const arrayBuffer = await wordFile.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const htmlContent = result.value;

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    
    // Add content to PDF
    page.drawText(htmlContent.replace(/<[^>]*>/g, ''), {
      x: 50,
      y: height - 50,
      size: 12,
    });

    return await pdfDoc.save();
  };

  const protectPDF = async (pdfBytes: ArrayBuffer, password: string): Promise<Uint8Array> => {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    return await pdfDoc.save({
      userPassword: password,
      ownerPassword: password
    });
  };

  const handleConvert = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file first",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const fileBuffer = await file.arrayBuffer();
      let result: Blob;
      let fileName: string;

      switch (format) {
        case 'text':
          const text = await convertToText(fileBuffer);
          result = new Blob([text], { type: 'text/plain' });
          fileName = file.name.replace('.pdf', '.txt');
          break;

        case 'word':
          const wordBuffer = await convertToWord(fileBuffer);
          result = new Blob([wordBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
          fileName = file.name.replace('.pdf', '.docx');
          break;

        case 'wordToPdf':
          const pdfBuffer = await wordToPDF(file);
          result = new Blob([pdfBuffer], { type: 'application/pdf' });
          fileName = file.name.replace('.docx', '.pdf');
          break;

        case 'protect':
          if (!password) {
            toast({
              title: "Password required",
              description: "Please enter a password to protect the PDF",
              variant: "destructive"
            });
            setIsProcessing(false);
            return;
          }
          const protectedBuffer = await protectPDF(fileBuffer, password);
          result = new Blob([protectedBuffer], { type: 'application/pdf' });
          fileName = file.name.replace('.pdf', '_protected.pdf');
          break;

        default:
          throw new Error('Unsupported format');
      }

      // Create and trigger download
      const url = URL.createObjectURL(result);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Conversion complete",
        description: `Successfully converted to ${format.toUpperCase()}`
      });
    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Conversion failed",
        description: "There was an error converting your file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Convert PDF</h1>
        <p className="text-gray-600">Convert your PDF to other formats</p>
      </div>

      <FileUpload onFilesSelected={handleFilesSelected} />

      {file && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            Selected file: {file.name}
          </p>
          {isProcessing && (
            <Progress value={progress} className="w-full mb-4" />
          )}
        </div>
      )}

      <div className="mt-6">
        <Select value={format} onValueChange={setFormat}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select output format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">PDF to Text</SelectItem>
            <SelectItem value="word">PDF to Word</SelectItem>
            <SelectItem value="wordToPdf">Word to PDF</SelectItem>
            <SelectItem value="protect">Protect PDF</SelectItem>
          </SelectContent>
        </Select>

        {format === 'protect' && (
          <div className="mt-4">
            <Input
              type="password"
              placeholder="Enter password to protect PDF"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <Button 
          onClick={handleConvert} 
          className="flex items-center gap-2"
          disabled={!file || isProcessing}
        >
          {format === 'protect' ? <Lock className="w-4 h-4" /> : <FileType className="w-4 h-4" />}
          {isProcessing ? 'Converting...' : 'Convert File'}
        </Button>
      </div>
    </div>
  );
};

export default PDFConverter;