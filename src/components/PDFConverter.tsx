import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import FileUpload from './FileUpload';
import { FileType, Lock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import FormatSelector from './FormatSelector';
import { convertToText, convertToWord, wordToPDF, protectPDF } from '@/utils/pdfOperations';

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
          const text = await convertToText(fileBuffer, setProgress);
          result = new Blob([text], { type: 'text/plain' });
          fileName = file.name.replace('.pdf', '.txt');
          break;

        case 'word':
          const wordBuffer = await convertToWord(fileBuffer, setProgress);
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
          const protectedBuffer = await protectPDF(fileBuffer);
          result = new Blob([protectedBuffer], { type: 'application/pdf' });
          fileName = file.name.replace('.pdf', '_protected.pdf');
          break;

        default:
          throw new Error('Unsupported format');
      }

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
        <FormatSelector value={format} onChange={setFormat} />

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