import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormatSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const FormatSelector = ({ value, onChange }: FormatSelectorProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select output format" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="text">PDF to Text</SelectItem>
        <SelectItem value="word">PDF to Word</SelectItem>
        <SelectItem value="wordToPdf">Word to PDF</SelectItem>
        <SelectItem value="protect">Protect PDF</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default FormatSelector;