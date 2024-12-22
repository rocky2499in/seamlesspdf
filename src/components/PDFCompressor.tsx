import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import FileUpload from './FileUpload';
import { Minimize2 } from 'lucide-react';

const PDFCompressor = () => {
  const { toast } = useToast();

  const handleCompress = () => {
    // TODO: Implement actual PDF compression logic
    toast({
      title: "PDF Compressed",
      description: "Successfully compressed PDF file"
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Compress PDF</h1>
        <p className="text-gray-600">Reduce PDF file size while maintaining quality</p>
      </div>

      <FileUpload />

      <div className="mt-8 flex justify-center">
        <Button onClick={handleCompress} className="flex items-center gap-2">
          <Minimize2 className="w-4 h-4" />
          Compress PDF
        </Button>
      </div>
    </div>
  );
};

export default PDFCompressor;