import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import FileUpload from './FileUpload';
import { Minimize2, Download } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { Progress } from '@/components/ui/progress';

const PDFCompressor = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);

  const handleFileSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setCompressedUrl(null);
      setProgress(0);
    }
  };

  const compressPDF = async (file: File) => {
    try {
      setCompressing(true);
      setProgress(25);

      // Read the PDF file
      const arrayBuffer = await file.arrayBuffer();
      setProgress(50);

      // Load the PDF document with minimal metadata
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        updateMetadata: false
      });
      
      setProgress(75);

      // Save with optimized options for compression
      const compressedPdfBytes = await pdfDoc.save({
        useObjectStreams: false,
        addDefaultPage: false,
        objectsPerTick: 50,
        updateFieldAppearances: false
      });
      
      setProgress(100);

      // Create a blob URL for the compressed PDF
      const blob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setCompressedUrl(url);

      const originalSize = (file.size / 1024 / 1024).toFixed(2);
      const compressedSize = (compressedPdfBytes.length / 1024 / 1024).toFixed(2);
      const compressionRatio = ((1 - (compressedPdfBytes.length / file.size)) * 100).toFixed(1);

      toast({
        title: "PDF Compressed Successfully",
        description: `Original: ${originalSize}MB → Compressed: ${compressedSize}MB (${compressionRatio}% reduction)`,
      });
    } catch (error) {
      console.error('Compression error:', error);
      toast({
        title: "Compression Failed",
        description: "There was an error compressing your PDF file. Please try again with a different file.",
        variant: "destructive"
      });
    } finally {
      setCompressing(false);
    }
  };

  const handleCompress = () => {
    if (file) {
      compressPDF(file);
    } else {
      toast({
        title: "No File Selected",
        description: "Please upload a PDF file first",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    if (compressedUrl && file) {
      const link = document.createElement('a');
      link.href = compressedUrl;
      link.download = `compressed-${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Compress PDF</h1>
        <p className="text-gray-600">Reduce PDF file size while maintaining quality</p>
      </div>

      <FileUpload onFilesSelected={handleFileSelected} />

      {file && (
        <div className="mt-4 text-sm text-gray-600">
          Selected file: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </div>
      )}

      {compressing && (
        <div className="mt-4">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-600 mt-2">Compressing PDF...</p>
        </div>
      )}

      <div className="mt-8 flex justify-center gap-4">
        <Button
          onClick={handleCompress}
          disabled={!file || compressing}
          className="flex items-center gap-2"
        >
          <Minimize2 className="w-4 h-4" />
          Compress PDF
        </Button>

        {compressedUrl && (
          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Compressed PDF
          </Button>
        )}
      </div>
    </div>
  );
};

export default PDFCompressor;