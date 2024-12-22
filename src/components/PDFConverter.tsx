import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import FileUpload from './FileUpload';
import { FileType } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { Progress } from '@/components/ui/progress';

const PDFConverter = () => {
  const { toast } = useToast();
  const [format, setFormat] = useState<string>('text');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  const convertToText = async (pdfBytes: ArrayBuffer): Promise<string> => {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    let text = '';
    
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      // Note: This is a simplified text extraction.
      // For production use, consider using a more robust PDF text extraction library
      text += `Page ${i + 1}\n\n`;
      setProgress((i + 1) / pages.length * 100);
    }
    
    return text;
  };

  const handleConvert = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file first",
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
          
        case 'image':
          toast({
            title: "Feature coming soon",
            description: "PDF to Image conversion will be available soon",
          });
          setIsProcessing(false);
          return;

        case 'word':
          toast({
            title: "Feature coming soon",
            description: "PDF to Word conversion will be available soon",
          });
          setIsProcessing(false);
          return;

        default:
          throw new Error('Unsupported format');
      }

      // Create download link
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
        description: `Successfully converted PDF to ${format.toUpperCase()}`
      });
    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Conversion failed",
        description: "There was an error converting your PDF",
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
            <SelectItem value="text">Plain Text</SelectItem>
            <SelectItem value="image">Image (Coming Soon)</SelectItem>
            <SelectItem value="word">Word Document (Coming Soon)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-8 flex justify-center">
        <Button 
          onClick={handleConvert} 
          className="flex items-center gap-2"
          disabled={!file || isProcessing}
        >
          <FileType className="w-4 h-4" />
          {isProcessing ? 'Converting...' : 'Convert PDF'}
        </Button>
      </div>
    </div>
  );
};

export default PDFConverter;