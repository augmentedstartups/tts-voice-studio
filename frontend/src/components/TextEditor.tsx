import { Textarea } from "@/components/ui/textarea";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const TextEditor = ({ value, onChange }: TextEditorProps) => {
  return (
    <div className="flex-1 flex flex-col space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        Text Input
      </label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter or paste your text here..."
        className="flex-1 min-h-[400px] bg-card border-border resize-none font-mono text-base p-4 transition-smooth focus:ring-2 focus:ring-primary"
      />
      <div className="text-xs text-muted-foreground text-right">
        {value.length} characters
      </div>
    </div>
  );
};
