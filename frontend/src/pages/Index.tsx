import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { VoiceSelector } from "@/components/VoiceSelector";
import { ModelSelector } from "@/components/ModelSelector";
import { FileImport } from "@/components/FileImport";
import { TextEditor } from "@/components/TextEditor";
import { SettingsSidebar } from "@/components/SettingsSidebar";
import { Sparkles, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS } from "@/config/api";

const Index = () => {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("");
  const [model, setModel] = useState("");
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(100);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast({
        title: "No Text",
        description: "Please enter some text to convert.",
        variant: "destructive",
      });
      return;
    }

    if (!model || !voice) {
      toast({
        title: "Missing Selection",
        description: "Please select a model and voice.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setAudioUrl(null);

    try {
      const response = await fetch(API_ENDPOINTS.generate, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voice,
          model,
          settings: {
            temperature: model === "higgs-audio-v2" ? 0.7 : 1.0,
            top_k: 50,
            chunk_method: model === "higgs-audio-v2" ? "word" : undefined,
            chunk_max_word_num: model === "higgs-audio-v2" ? 100 : undefined,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Generation failed");
      }

      const data = await response.json();
      
      if (data.success && data.audioUrl) {
        setAudioUrl(data.audioUrl);
        toast({
          title: "Generation Complete!",
          description: `Successfully generated audio with ${voice} voice.`,
        });
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Please ensure the backend server is running.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement("a");
      link.href = `http://localhost:8000${audioUrl}`;
      link.download = `generated_audio_${Date.now()}.wav`;
      link.click();
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <SettingsSidebar
          speed={speed}
          onSpeedChange={(value) => setSpeed(value[0])}
          pitch={pitch}
          onPitchChange={(value) => setPitch(value[0])}
          volume={volume}
          onVolumeChange={(value) => setVolume(value[0])}
        />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-bold text-gradient">
                Augmented AI Voice Generation
              </h1>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Controls Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ModelSelector value={model} onValueChange={setModel} />
                <VoiceSelector value={voice} onValueChange={setVoice} modelId={model} />
              </div>

              {/* Text Editor */}
              <div className="bg-card rounded-lg border border-border p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Text Content</h2>
                  <FileImport onTextExtracted={setText} />
                </div>
                <TextEditor value={text} onChange={setText} />
              </div>

              {/* Generate Button */}
              <div className="flex justify-end gap-4">
                {audioUrl && (
                  <Button
                    onClick={handleDownload}
                    size="lg"
                    variant="outline"
                    className="gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Download Audio
                  </Button>
                )}
                <Button
                  onClick={handleGenerate}
                  size="lg"
                  disabled={isGenerating || !text.trim()}
                  className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-smooth glow"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate Voice
                    </>
                  )}
                </Button>
              </div>

              {/* Audio Player */}
              {audioUrl && (
                <div className="bg-card rounded-lg border border-border p-6">
                  <h3 className="text-lg font-semibold mb-4">Generated Audio</h3>
                  <audio
                    controls
                    className="w-full"
                    src={`http://localhost:8000${audioUrl}`}
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {/* API Documentation Card */}
              <div className="bg-card rounded-lg border border-border p-6 mt-8">
                <h3 className="text-lg font-semibold mb-4">API Integration Guide</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium text-primary mb-2">Generate Voice</h4>
                    <code className="block bg-muted p-3 rounded font-mono text-xs">
                      POST /api/generate<br />
                      Content-Type: application/json<br /><br />
                      {`{
  "text": "Your text here",
  "voice": "aria",
  "model": "tts-1",
  "settings": {
    "speed": 1.0,
    "pitch": 1.0,
    "volume": 100
  }
}`}
                    </code>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary mb-2">List Available Voices</h4>
                    <code className="block bg-muted p-3 rounded font-mono text-xs">
                      GET /api/voices
                    </code>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary mb-2">List Available Models</h4>
                    <code className="block bg-muted p-3 rounded font-mono text-xs">
                      GET /api/models
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
