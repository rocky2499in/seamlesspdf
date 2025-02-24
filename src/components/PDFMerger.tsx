
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import FileUpload from './FileUpload';
import { ArrowDownUp, MoveUp, MoveDown, File, Image } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface FileWithOrder extends File {
  order: number;
  selected: boolean;
  pageCount?: number;
}

const PDFMerger = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<FileWithOrder[]>([]);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reverseOrder, setReverseOrder] = useState(false);
  const [selectedOnly, setSelectedOnly] = useState(false);
  const [expandedFile, setExpandedFile] = useState<number | null>(null);

  const handleFilesSelected = async (selectedFiles: File[]) => {
    const filesWithOrder = await Promise.all(selectedFiles.map(async (file, index) => {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();
      
      return {
        ...file,
        order: index + 1,
        selected: true,
        pageCount,
      };
    }));
    
    setFiles(filesWithOrder);
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    if (direction === 'up' && index > 0) {
      [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
    } else if (direction === 'down' && index < files.length - 1) {
      [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
    }
    setFiles(newFiles);
  };

  const toggleFileSelection = (index: number) => {
    const newFiles = [...files];
    newFiles[index].selected = !newFiles[index].selected;
    setFiles(newFiles);
  };

  const toggleFileExpansion = (index: number) => {
    setExpandedFile(expandedFile === index ? null : index);
  };

  const handleMerge = async () => {
    const filesToMerge = files.filter(file => !selectedOnly || file.selected);
    
    if (filesToMerge.length < 2) {
      toast({
        title: "Not enough files",
        description: "Please select at least 2 PDF files to merge",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsProcessing(true);
      setProgress(0);

      const mergedPdf = await PDFDocument.create();
      const orderedFiles = reverseOrder ? [...filesToMerge].reverse() : filesToMerge;
      
      for (let i = 0; i < orderedFiles.length; i++) {
        const file = orderedFiles[i];
        const fileArrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileArrayBuffer);
        
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
        
        setProgress(((i + 1) / orderedFiles.length) * 100);
      }

      const mergedPdfBytes = await mergedPdf.save();
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
        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="reverse-order"
                checked={reverseOrder}
                onCheckedChange={setReverseOrder}
              />
              <Label htmlFor="reverse-order">Reverse Order</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="selected-only"
                checked={selectedOnly}
                onCheckedChange={setSelectedOnly}
              />
              <Label htmlFor="selected-only">Merge Selected Only</Label>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 mb-2">
              {files.length} file{files.length !== 1 ? 's' : ''} selected
            </p>
            {files.map((file, index) => (
              <div key={index} className="border rounded-lg mb-4 last:mb-0">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={file.selected}
                      onChange={() => toggleFileSelection(index)}
                      className="rounded border-gray-300"
                    />
                    <File className="h-5 w-5 text-gray-500" />
                    <div>
                      <span className="text-sm font-medium">{file.name}</span>
                      {file.pageCount && (
                        <p className="text-xs text-gray-500">
                          {file.pageCount} page{file.pageCount !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveFile(index, 'up')}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveFile(index, 'down')}
                      disabled={index === files.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

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
