import React from 'react';
import { Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const FileUpload = () => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length === 0) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF files only",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Files received",
      description: `${pdfFiles.length} PDF files uploaded successfully`
    });
  };

  return (
    <div
      className={`w-full max-w-2xl mx-auto p-8 border-2 border-dashed rounded-lg transition-colors ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <Upload className="w-12 h-12 text-blue-500" />
        <h3 className="text-lg font-semibold">Drag & Drop your PDF files here</h3>
        <p className="text-sm text-gray-500">or click to browse files</p>
      </div>
    </div>
  );
};

export default FileUpload;