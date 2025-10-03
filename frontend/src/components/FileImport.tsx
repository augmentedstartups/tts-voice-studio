import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS } from "@/config/api";

interface FileImportProps {
  onTextExtracted: (text: string) => void;
}

export const FileImport = ({ onTextExtracted }: FileImportProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isExtracting, setIsExtracting] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    try {
      let extractedText = "";

      if (fileExtension === "txt") {
        extractedText = await file.text();
        
        if (extractedText) {
          onTextExtracted(extractedText);
          toast({
            title: "File Imported",
            description: `Successfully imported ${file.name}`,
          });
        }
      } else if (fileExtension === "pdf" || fileExtension === "docx" || fileExtension === "doc") {
        setIsExtracting(true);
        
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(API_ENDPOINTS.extract, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to extract text from file");
        }

        const data = await response.json();
        
        if (data.success && data.text) {
          onTextExtracted(data.text);
          toast({
            title: "File Imported",
            description: `Successfully extracted text from ${file.name}. ${data.metadata.wordCount} words found.`,
          });
        }
      } else {
        toast({
          title: "Unsupported Format",
          description: "Please upload a TXT, PDF, or DOCX file.",
          variant: "destructive",
        });
        return;
      }
    } catch (error) {
      console.error("File extraction error:", error);
      toast({
        title: "Import Failed",
        description: "Failed to extract text from the file. Please try again or ensure the backend is running.",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.pdf,.docx,.doc"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isExtracting}
      />
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        className="gap-2"
        disabled={isExtracting}
      >
        {isExtracting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Extracting...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Import File
          </>
        )}
      </Button>
    </>
  );
};
