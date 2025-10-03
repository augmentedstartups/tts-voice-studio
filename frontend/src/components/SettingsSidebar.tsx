import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";

interface SettingsSidebarProps {
  speed: number;
  onSpeedChange: (value: number[]) => void;
  pitch: number;
  onPitchChange: (value: number[]) => void;
  volume: number;
  onVolumeChange: (value: number[]) => void;
}

export const SettingsSidebar = ({
  speed,
  onSpeedChange,
  pitch,
  onPitchChange,
  volume,
  onVolumeChange,
}: SettingsSidebarProps) => {
  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Settings</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Audio Settings</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-6 p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="speed" className="text-sm">Speed</Label>
                <span className="text-xs text-muted-foreground">{speed.toFixed(1)}x</span>
              </div>
              <Slider
                id="speed"
                min={0.5}
                max={2}
                step={0.1}
                value={[speed]}
                onValueChange={onSpeedChange}
                className="cursor-pointer"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="pitch" className="text-sm">Pitch</Label>
                <span className="text-xs text-muted-foreground">{pitch.toFixed(1)}</span>
              </div>
              <Slider
                id="pitch"
                min={0.5}
                max={1.5}
                step={0.1}
                value={[pitch]}
                onValueChange={onPitchChange}
                className="cursor-pointer"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="volume" className="text-sm">Volume</Label>
                <span className="text-xs text-muted-foreground">{volume}%</span>
              </div>
              <Slider
                id="volume"
                min={0}
                max={100}
                step={1}
                value={[volume]}
                onValueChange={onVolumeChange}
                className="cursor-pointer"
              />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>API Endpoints</SidebarGroupLabel>
          <SidebarGroupContent className="p-4">
            <div className="space-y-3 text-xs font-mono bg-muted/50 p-3 rounded-lg">
              <div>
                <div className="text-muted-foreground mb-1">Generate:</div>
                <code className="text-primary">POST /api/generate</code>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Voices:</div>
                <code className="text-primary">GET /api/voices</code>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Models:</div>
                <code className="text-primary">GET /api/models</code>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
