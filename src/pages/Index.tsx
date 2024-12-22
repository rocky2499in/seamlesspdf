import { FileUp, FileText, FileDown, FileType, FileInput, FilePen, FileImage, FileKey, FileSignature } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '@/components/FileUpload';
import ToolCard from '@/components/ToolCard';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleToolClick = (tool: string) => {
    if (tool === "Edit PDF") {
      navigate('/edit-pdf');
    } else {
      toast({
        title: "Coming Soon",
        description: `${tool} functionality will be implemented in the next iteration!`
      });
    }
  };

  const tools = [
    {
      icon: FileUp,
      title: "Merge PDFs",
      description: "Combine multiple PDFs into one file",
      onClick: () => handleToolClick("Merge PDFs")
    },
    {
      icon: FileInput,
      title: "Split PDF",
      description: "Extract or split pages from your PDF",
      onClick: () => handleToolClick("Split PDF")
    },
    {
      icon: FileDown,
      title: "Compress PDF",
      description: "Reduce PDF file size while maintaining quality",
      onClick: () => handleToolClick("Compress PDF")
    },
    {
      icon: FileText,
      title: "PDF to Word",
      description: "Convert PDF to editable Word document",
      onClick: () => handleToolClick("PDF to Word")
    },
    {
      icon: FileType,
      title: "Word to PDF",
      description: "Convert Word documents to PDF format",
      onClick: () => handleToolClick("Word to PDF")
    },
    {
      icon: FilePen,
      title: "Edit PDF",
      description: "Add text, images, and shapes to your PDF",
      onClick: () => handleToolClick("Edit PDF")
    },
    {
      icon: FileImage,
      title: "PDF to Image",
      description: "Convert PDF pages to JPG or PNG images",
      onClick: () => handleToolClick("PDF to Image")
    },
    {
      icon: FileKey,
      title: "Protect PDF",
      description: "Add password protection to your PDF",
      onClick: () => handleToolClick("Protect PDF")
    },
    {
      icon: FileSignature,
      title: "Sign PDF",
      description: "Add digital signatures to your documents",
      onClick: () => handleToolClick("Sign PDF")
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Free Online PDF Tools
          </h1>
          <p className="text-xl text-gray-600">
            Edit, convert, and manage your PDF files with ease
          </p>
        </div>

        <FileUpload />

        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Available Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.title} {...tool} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;