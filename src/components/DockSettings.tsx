import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Settings, Accessibility, LayoutDashboard, X } from "lucide-react";
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
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    };
    // Delay to avoid the click that opened it
    const timer = setTimeout(() => document.addEventListener("mousedown", handler), 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handler);
    };
  }, [open, onOpenChange]);

  const renderContent = () => {
    switch (activeSection) {
      case "general": return <GeneralSettings />;
      case "accessibility": return <AccessibilitySettings />;
      case "dock": return <DockSettingsContent />;
    }
  };

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-[560px] rounded-2xl border border-[hsl(var(--menu-glass-border))] bg-[hsl(var(--menu-glass)/0.85)] backdrop-blur-2xl shadow-2xl shadow-black/30 overflow-hidden z-50"
      style={{ animation: "scale-in 0.2s ease-out" }}
    >
      <div className="flex min-h-[360px]">
        {/* Left sidebar */}
        <div className="w-44 border-r border-[hsl(var(--menu-glass-border))] bg-[hsl(var(--menu-glass)/0.5)] p-4 flex flex-col gap-1">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-foreground">Dock</h2>
          </div>
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
                    : "text-muted-foreground hover:bg-[hsl(var(--menu-glass-hover))] hover:text-foreground"
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground capitalize">
              {activeSection}
            </h2>
            <button
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--menu-glass-hover))] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DockSettings;
