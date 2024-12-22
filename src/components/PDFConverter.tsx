import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import FileUpload from './FileUpload';
import { FileType } from 'lucide-react';

const PDFConverter = () => {
  const { toast } = useToast();
  const [format, setFormat] = useState<string>('word');

  const handleConvert = () => {
    // TODO: Implement actual PDF conversion logic
    toast({
      title: "PDF Converted",
      description: `Successfully converted PDF to ${format.toUpperCase()}`
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Convert PDF</h1>
        <p className="text-gray-600">Convert your PDF to other formats</p>
      </div>

      <FileUpload />

      <div className="mt-6">
        <Select value={format} onValueChange={setFormat}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select output format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="word">Word Document</SelectItem>
            <SelectItem value="image">Image (JPG/PNG)</SelectItem>
            <SelectItem value="text">Plain Text</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-8 flex justify-center">
        <Button onClick={handleConvert} className="flex items-center gap-2">
          <FileType className="w-4 h-4" />
          Convert PDF
        </Button>
      </div>
    </div>
  );
};

export default PDFConverter;