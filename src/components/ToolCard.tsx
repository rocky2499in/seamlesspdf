import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}

const ToolCard = ({ icon: Icon, title, description, onClick }: ToolCardProps) => {
  return (
    <Card
      className={cn(
        "p-6 cursor-pointer transition-all duration-200",
        "hover:shadow-lg hover:-translate-y-1",
        "flex flex-col items-center text-center space-y-3"
      )}
      onClick={onClick}
    >
      <Icon className="w-8 h-8 text-blue-500" />
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </Card>
  );
};

export default ToolCard;