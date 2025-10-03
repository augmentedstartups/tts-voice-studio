import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cpu } from "lucide-react";
import { API_ENDPOINTS } from "@/config/api";
import { useToast } from "@/hooks/use-toast";

interface Model {
  id: string;
  name: string;
  description: string;
  status: string;
  provider: string;
  voiceCount: number;
}

interface ModelSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const ModelSelector = ({ value, onValueChange }: ModelSelectorProps) => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.models);
      if (!response.ok) throw new Error("Failed to fetch models");
      
      const data = await response.json();
      const activeModels = data.models.filter((m: Model) => m.status === "active");
      setModels(activeModels);
      
      if (activeModels.length > 0 && !value) {
        onValueChange(activeModels[0].id);
      }
    } catch (error) {
      console.error("Error fetching models:", error);
      toast({
        title: "Connection Error",
        description: "Could not connect to backend. Please ensure the server is running on port 8000.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Cpu className="h-4 w-4" />
        Model Selection
      </label>
      <Select value={value} onValueChange={onValueChange} disabled={loading || models.length === 0}>
        <SelectTrigger className="bg-secondary border-border hover:bg-secondary/80 transition-smooth">
          <SelectValue placeholder={loading ? "Loading models..." : "Select a model"} />
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{model.name}</span>
                  <span className="text-xs text-muted-foreground">({model.voiceCount} voices)</span>
                </div>
                <span className="text-xs text-muted-foreground">{model.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
