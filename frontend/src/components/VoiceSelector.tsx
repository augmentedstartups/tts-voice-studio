import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic } from "lucide-react";
import { API_ENDPOINTS } from "@/config/api";
import { useToast } from "@/hooks/use-toast";

interface Voice {
  id: string;
  name: string;
  description: string;
  gender: string;
  language: string;
}

interface VoiceSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  modelId: string;
}

export const VoiceSelector = ({ value, onValueChange, modelId }: VoiceSelectorProps) => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (modelId) {
      fetchVoices();
    }
  }, [modelId]);

  const fetchVoices = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.voices(modelId));
      if (!response.ok) throw new Error("Failed to fetch voices");
      
      const data = await response.json();
      setVoices(data.voices);
      
      if (data.voices.length > 0 && !value) {
        onValueChange(data.voices[0].id);
      }
    } catch (error) {
      console.error("Error fetching voices:", error);
      toast({
        title: "Error",
        description: "Could not load voices for this model.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Mic className="h-4 w-4" />
        Voice Selection
      </label>
      <Select value={value} onValueChange={onValueChange} disabled={loading || voices.length === 0}>
        <SelectTrigger className="bg-secondary border-border hover:bg-secondary/80 transition-smooth">
          <SelectValue placeholder={loading ? "Loading voices..." : "Select a voice"} />
        </SelectTrigger>
        <SelectContent>
          {voices.map((voice) => (
            <SelectItem key={voice.id} value={voice.id}>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{voice.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">({voice.gender})</span>
                </div>
                <span className="text-xs text-muted-foreground">{voice.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
