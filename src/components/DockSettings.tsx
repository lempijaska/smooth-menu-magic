import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Settings, Accessibility, LayoutDashboard } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type Section = "general" | "accessibility" | "dock";

interface DockSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const sections: { id: Section; label: string; icon: typeof Settings }[] = [
  { id: "general", label: "General", icon: Settings },
  { id: "accessibility", label: "Accessibility", icon: Accessibility },
  { id: "dock", label: "Dock", icon: LayoutDashboard },
];

const GeneralSettings = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-sm font-medium text-foreground mb-1">Appearance</h3>
      <p className="text-xs text-muted-foreground mb-3">Customize the look and feel</p>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="animations" className="text-sm">Enable animations</Label>
          <Switch id="animations" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="transparency" className="text-sm">Reduce transparency</Label>
          <Switch id="transparency" />
        </div>
      </div>
    </div>
    <div>
      <h3 className="text-sm font-medium text-foreground mb-1">Notifications</h3>
      <p className="text-xs text-muted-foreground mb-3">Manage notification preferences</p>
      <div className="flex items-center justify-between">
        <Label htmlFor="notifications" className="text-sm">Show badge counts</Label>
        <Switch id="notifications" defaultChecked />
      </div>
    </div>
  </div>
);

const AccessibilitySettings = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-sm font-medium text-foreground mb-1">Display</h3>
      <p className="text-xs text-muted-foreground mb-3">Adjust display settings for better visibility</p>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="high-contrast" className="text-sm">Increase contrast</Label>
          <Switch id="high-contrast" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="reduce-motion" className="text-sm">Reduce motion</Label>
          <Switch id="reduce-motion" />
        </div>
      </div>
    </div>
    <div>
      <h3 className="text-sm font-medium text-foreground mb-1">Text Size</h3>
      <p className="text-xs text-muted-foreground mb-3">Adjust the size of text</p>
      <Slider defaultValue={[14]} min={10} max={24} step={1} className="w-full" />
      <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
        <span>Small</span>
        <span>Large</span>
      </div>
    </div>
  </div>
);

const DockSettingsContent = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-sm font-medium text-foreground mb-1">Size</h3>
      <p className="text-xs text-muted-foreground mb-3">Adjust the size of dock icons</p>
      <Slider defaultValue={[48]} min={32} max={80} step={4} className="w-full" />
      <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
        <span>Small</span>
        <span>Large</span>
      </div>
    </div>
    <div>
      <h3 className="text-sm font-medium text-foreground mb-1">Magnification</h3>
      <p className="text-xs text-muted-foreground mb-3">Icon magnification on hover</p>
      <div className="flex items-center justify-between mb-3">
        <Label htmlFor="magnification" className="text-sm">Enable magnification</Label>
        <Switch id="magnification" defaultChecked />
      </div>
      <Slider defaultValue={[80]} min={48} max={128} step={4} className="w-full" />
      <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
        <span>Min</span>
        <span>Max</span>
      </div>
    </div>
    <div>
      <h3 className="text-sm font-medium text-foreground mb-1">Position</h3>
      <p className="text-xs text-muted-foreground mb-3">Position of the dock on screen</p>
      <div className="flex items-center justify-between">
        <Label htmlFor="autohide" className="text-sm">Automatically hide dock</Label>
        <Switch id="autohide" />
      </div>
    </div>
  </div>
);

const DockSettings = ({ open, onOpenChange }: DockSettingsProps) => {
  const [activeSection, setActiveSection] = useState<Section>("general");

  const renderContent = () => {
    switch (activeSection) {
      case "general": return <GeneralSettings />;
      case "accessibility": return <AccessibilitySettings />;
      case "dock": return <DockSettingsContent />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        <div className="flex min-h-[400px]">
          {/* Left sidebar */}
          <div className="w-48 border-r bg-muted/30 p-4 flex flex-col gap-1">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-sm font-semibold">Dock</DialogTitle>
            </DialogHeader>
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors text-left",
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {section.label}
                </button>
              );
            })}
          </div>

          {/* Right content */}
          <div className="flex-1 p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 capitalize">
              {activeSection}
            </h2>
            {renderContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DockSettings;
