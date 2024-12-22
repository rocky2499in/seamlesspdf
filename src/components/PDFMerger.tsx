import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import FileUpload from './FileUpload';
import { ArrowDownUp } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { Progress } from '@/components/ui/progress';

const PDFMerger = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast({
        title: "Not enough files",
        description: "Please upload at least 2 PDF files to merge",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsProcessing(true);
      setProgress(0);

      // Create a new PDF document
      const mergedPdf = await PDFDocument.create();
      
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileArrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileArrayBuffer);
        
        // Copy all pages from the current PDF to the merged PDF
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
        
        // Update progress
        setProgress(((i + 1) / files.length) * 100);
      }

      // Save the merged PDF
      const mergedPdfBytes = await mergedPdf.save();
      
      // Create a blob and download the file
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "PDFs merged successfully!"
      });
    } catch (error) {
      console.error('Error merging PDFs:', error);
      toast({
        title: "Error",
        description: "Failed to merge PDFs. Please try again.",
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
        <h1 className="text-3xl font-bold mb-2">Merge PDFs</h1>
        <p className="text-gray-600">Combine multiple PDF files into one document</p>
      </div>

      <FileUpload onFilesSelected={handleFilesSelected} />

      {files.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            {files.length} file{files.length !== 1 ? 's' : ''} selected
          </p>
          {isProcessing && (
            <Progress value={progress} className="w-full mb-4" />
          )}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <Button 
          onClick={handleMerge} 
          className="flex items-center gap-2"
          disabled={isProcessing || files.length < 2}
        >
          <ArrowDownUp className="w-4 h-4" />
          {isProcessing ? 'Merging...' : 'Merge PDFs'}
        </Button>
      </div>
    </div>
  );
};

export default PDFMerger;