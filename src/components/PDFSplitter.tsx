import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import FileUpload from './FileUpload';
import { Scissors } from 'lucide-react';

const PDFSplitter = () => {
  const { toast } = useToast();
  const [pageRanges, setPageRanges] = useState<string>('');

  const handleSplit = () => {
    if (!pageRanges) {
      toast({
        title: "Missing page ranges",
        description: "Please specify the page ranges to split",
        variant: "destructive"
      });
      return;
    }

    // TODO: Implement actual PDF splitting logic
    toast({
      title: "PDF Split",
      description: "Successfully split PDF into specified ranges"
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Split PDF</h1>
        <p className="text-gray-600">Extract pages or split your PDF into multiple files</p>
      </div>

      <FileUpload />

      <div className="mt-6">
        <Input
          placeholder="Enter page ranges (e.g., 1-3, 4-6)"
          value={pageRanges}
          onChange={(e) => setPageRanges(e.target.value)}
          className="mb-4"
        />
      </div>

      <div className="mt-4 flex justify-center">
        <Button onClick={handleSplit} className="flex items-center gap-2">
          <Scissors className="w-4 h-4" />
          Split PDF
        </Button>
      </div>
    </div>
  );
};

export default PDFSplitter;