import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Type,
  Image,
  Square,
  Circle,
  Pencil,
  Eraser,
  Undo,
  Redo,
  Save
} from 'lucide-react';

const PDFEditor = () => {
  const { toast } = useToast();
  const [selectedTool, setSelectedTool] = useState<string>('text');
  const [textContent, setTextContent] = useState<string>('');
  const [fontSize, setFontSize] = useState<string>('16');
  const [fontColor, setFontColor] = useState<string>('#000000');

  const tools = [
    { id: 'text', icon: Type, label: 'Add Text' },
    { id: 'image', icon: Image, label: 'Add Image' },
    { id: 'rectangle', icon: Square, label: 'Draw Rectangle' },
    { id: 'circle', icon: Circle, label: 'Draw Circle' },
    { id: 'draw', icon: Pencil, label: 'Free Draw' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' }
  ];

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    toast({
      title: "Tool Selected",
      description: `${toolId.charAt(0).toUpperCase() + toolId.slice(1)} tool is now active`
    });
  };

  const handleSave = () => {
    toast({
      title: "Changes Saved",
      description: "Your PDF has been updated successfully"
    });
  };

  const handleUndo = () => {
    toast({
      description: "Undo action performed"
    });
  };

  const handleRedo = () => {
    toast({
      description: "Redo action performed"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-100 rounded-lg">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant={selectedTool === tool.id ? "default" : "outline"}
                className="flex items-center gap-2"
                onClick={() => handleToolSelect(tool.id)}
              >
                <tool.icon className="w-4 h-4" />
                {tool.label}
              </Button>
            ))}
          </div>

          {/* Properties Panel */}
          <div className="flex gap-4 mb-6">
            {selectedTool === 'text' && (
              <>
                <Input
                  type="number"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="w-24"
                  placeholder="Font Size"
                />
                <Input
                  type="color"
                  value={fontColor}
                  onChange={(e) => setFontColor(e.target.value)}
                  className="w-24"
                />
                <Textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Enter text to add to PDF"
                  className="flex-1"
                />
              </>
            )}
          </div>

          {/* Canvas Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg h-[600px] mb-6 relative">
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              PDF Preview Area
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleUndo}>
                <Undo className="w-4 h-4 mr-2" />
                Undo
              </Button>
              <Button variant="outline" onClick={handleRedo}>
                <Redo className="w-4 h-4 mr-2" />
                Redo
              </Button>
            </div>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFEditor;