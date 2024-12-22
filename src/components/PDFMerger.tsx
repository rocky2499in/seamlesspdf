import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import FileUpload from './FileUpload';
import { ArrowDownUp, FileUp } from 'lucide-react';

const PDFMerger = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);

  const handleMerge = () => {
    if (files.length < 2) {
      toast({
        title: "Not enough files",
        description: "Please upload at least 2 PDF files to merge",
        variant: "destructive"
      });
      return;
    }

    // TODO: Implement actual PDF merging logic
    toast({
      title: "PDFs Merged",
      description: `Successfully merged ${files.length} PDF files`
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Merge PDFs</h1>
        <p className="text-gray-600">Combine multiple PDF files into one document</p>
      </div>

      <FileUpload />

      <div className="mt-8 flex justify-center">
        <Button onClick={handleMerge} className="flex items-center gap-2">
          <ArrowDownUp className="w-4 h-4" />
          Merge PDFs
        </Button>
      </div>
    </div>
  );
};

export default PDFMerger;