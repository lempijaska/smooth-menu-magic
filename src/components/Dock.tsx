import { useRef, useState, useCallback } from "react";
import {
  Home,
  Mail,
  Calendar,
  Camera,
  Music,
  Settings,
  MessageSquare,
  Map,
  Clock,
  Calculator,
  BookOpen,
  Cloud,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { DRAG_MIME, encodeDragData, decodeDragData, getIcon } from "@/lib/icon-registry";
import DockSettings from "@/components/DockSettings";

interface DockItem {
  id: string;
  icon: LucideIcon;
  label: string;
  iconName: string;
}

const initialMainItems: DockItem[] = [
  { id: "dock-home", icon: Home, label: "Home", iconName: "Home" },
  { id: "dock-mail", icon: Mail, label: "Mail", iconName: "Mail" },
  { id: "dock-messages", icon: MessageSquare, label: "Messages", iconName: "MessageSquare" },
  { id: "dock-calendar", icon: Calendar, label: "Calendar", iconName: "Calendar" },
  { id: "dock-camera", icon: Camera, label: "Photos", iconName: "Camera" },
  { id: "dock-music", icon: Music, label: "Music", iconName: "Music" },
  { id: "dock-maps", icon: Map, label: "Maps", iconName: "Map" },
  { id: "dock-clock", icon: Clock, label: "Clock", iconName: "Clock" },
  { id: "dock-calculator", icon: Calculator, label: "Calculator", iconName: "Calculator" },
  { id: "dock-books", icon: BookOpen, label: "Books", iconName: "BookOpen" },
  { id: "dock-weather", icon: Cloud, label: "Weather", iconName: "Cloud" },
];

const utilityItems: DockItem[] = [
  { id: "dock-settings", icon: Settings, label: "Settings", iconName: "Settings" },
  { id: "dock-trash", icon: Trash2, label: "Bin", iconName: "Trash2" },
];

const BASE_SIZE = 48;
const MAX_SIZE = 80;
const MAGNIFY_RANGE = 150;

const Dock = () => {
  const dockRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [bouncingId, setBouncingId] = useState<string | null>(null);
  const [mainItems, setMainItems] = useState<DockItem[]>(initialMainItems);
  const [isDragOver, setIsDragOver] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMouseX(e.clientX);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseX(null);
    setHoveredId(null);
  }, []);

  const getScale = useCallback(
    (itemId: string) => {
      if (mouseX === null) return 1;
      const el = itemRefs.current[itemId];
      if (!el) return 1;
      const rect = el.getBoundingClientRect();
      const itemCenterX = rect.left + rect.width / 2;
      const distance = Math.abs(mouseX - itemCenterX);
      if (distance > MAGNIFY_RANGE) return 1;
      const scale = 1 + ((MAX_SIZE - BASE_SIZE) / BASE_SIZE) * (1 - distance / MAGNIFY_RANGE);
      return scale;
    },
    [mouseX]
  );

  const handleClick = (id: string) => {
    if (id === "dock-settings") {
      setSettingsOpen(true);
      return;
    }
    setBouncingId(id);
    setTimeout(() => setBouncingId(null), 600);
  };

  const onDragStart = (e: React.DragEvent, item: DockItem) => {
    const data = encodeDragData({
      id: item.id,
      label: item.label,
      iconName: item.iconName,
      source: "dock",
    });
    e.dataTransfer.setData(DRAG_MIME, data);
    e.dataTransfer.setData("text/plain", data);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const data = decodeDragData(e);
    if (!data || data.source !== "menu") return;

    const icon = getIcon(data.iconName);
    if (!icon) return;

    const dockId = `dock-${data.id}`;
    if (mainItems.some((i) => i.id === dockId)) return;

    setMainItems((prev) => [
      ...prev,
      { id: dockId, icon, label: data.label, iconName: data.iconName },
    ]);
  };

  const onDragEnd = (e: React.DragEvent, item: DockItem) => {
    // If dropped outside (on the menu), remove from dock
    // The menu component handles adding; we listen for a custom event
    // For simplicity, we check dropEffect
    if (e.dataTransfer.dropEffect === "move") {
      // Item was accepted somewhere else — but only remove if it's not a utility item
      const isUtility = utilityItems.some((u) => u.id === item.id);
      if (!isUtility) {
        setMainItems((prev) => prev.filter((i) => i.id !== item.id));
      }
    }
  };

  const renderItem = (item: DockItem) => {
    const scale = getScale(item.id);
    const Icon = item.icon;
    const isBouncing = bouncingId === item.id;
    const isUtility = utilityItems.some((u) => u.id === item.id);
    const isBin = item.id === "dock-trash";

    return (
      <div
        key={item.id}
        className="flex flex-col items-center"
        onMouseEnter={() => setHoveredId(item.id)}
        onMouseLeave={() => setHoveredId(null)}
        onDragOver={isBin ? (e) => { e.preventDefault(); e.stopPropagation(); } : undefined}
        onDrop={isBin ? (e) => {
          e.preventDefault();
          e.stopPropagation();
          const data = decodeDragData(e);
          if (!data) return;
          if (data.source === "dock") {
            const isUtil = utilityItems.some((u) => u.id === data.id);
            if (!isUtil) {
              setMainItems((prev) => prev.filter((i) => i.id !== data.id));
            }
          }
        } : undefined}
      >
        <div
          className="pointer-events-none mb-1 px-2 py-0.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground whitespace-nowrap transition-opacity duration-150"
          style={{ opacity: hoveredId === item.id ? 1 : 0 }}
        >
          {item.label}
        </div>

        <button
          ref={(el) => {
            itemRefs.current[item.id] = el;
          }}
          draggable={!isUtility}
          onDragStart={(e) => onDragStart(e, item)}
          onDragEnd={(e) => onDragEnd(e, item)}
          onClick={() => handleClick(item.id)}
          className="flex items-center justify-center rounded-xl bg-secondary/80 text-foreground transition-colors duration-150 hover:bg-[hsl(var(--menu-glass-hover))] cursor-grab active:cursor-grabbing"
          style={{
            width: BASE_SIZE,
            height: BASE_SIZE,
            transform: `scale(${scale})${isBouncing ? " translateY(-16px)" : ""}`,
            transformOrigin: "bottom center",
            transition: isBouncing
              ? "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
              : "transform 0.15s ease-out",
          }}
        >
          <Icon
            size={BASE_SIZE * 0.5}
            strokeWidth={1.5}
            className="text-foreground"
          />
        </button>
      </div>
    );
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50">
      <div
        ref={dockRef}
        className={`flex items-end gap-1 px-3 py-2 rounded-2xl border bg-[hsl(var(--menu-glass)/0.8)] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-colors ${
          isDragOver
            ? "border-primary/40"
            : "border-[hsl(var(--menu-glass-border))]"
        }`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {/* Main items */}
        {mainItems.map((item) => renderItem(item))}

        {/* Separator */}
        <div className="flex items-end pb-2">
          <div className="w-px h-10 bg-[hsl(var(--menu-separator)/0.4)] mx-1" />
        </div>

        {/* Utility items: Settings + Bin */}
        {utilityItems.map((item) => renderItem(item))}
      </div>

      {/* Reflection / glow */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-2 rounded-full bg-[hsl(var(--menu-glow)/0.15)] blur-md" />
    </div>
  );
};

export default Dock;
