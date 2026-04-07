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
  type LucideIcon,
} from "lucide-react";

interface DockItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

const dockItems: DockItem[] = [
  { id: "home", icon: Home, label: "Home" },
  { id: "mail", icon: Mail, label: "Mail" },
  { id: "messages", icon: MessageSquare, label: "Messages" },
  { id: "calendar", icon: Calendar, label: "Calendar" },
  { id: "camera", icon: Camera, label: "Photos" },
  { id: "music", icon: Music, label: "Music" },
  { id: "maps", icon: Map, label: "Maps" },
  { id: "clock", icon: Clock, label: "Clock" },
  { id: "calculator", icon: Calculator, label: "Calculator" },
  { id: "books", icon: BookOpen, label: "Books" },
  { id: "weather", icon: Cloud, label: "Weather" },
  { id: "settings", icon: Settings, label: "Settings" },
];

const BASE_SIZE = 48;
const MAX_SIZE = 80;
const MAGNIFY_RANGE = 150; // px radius of magnification effect

const Dock = () => {
  const dockRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [bouncingId, setBouncingId] = useState<string | null>(null);
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
    setBouncingId(id);
    setTimeout(() => setBouncingId(null), 600);
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50">
      <div
        ref={dockRef}
        className="flex items-end gap-1 px-3 py-2 rounded-2xl border border-[hsl(var(--menu-glass-border))] bg-[hsl(var(--menu-glass)/0.8)] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {dockItems.map((item) => {
          const scale = getScale(item.id);
          const Icon = item.icon;
          const isBouncing = bouncingId === item.id;

          return (
            <div
              key={item.id}
              className="flex flex-col items-center"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Tooltip */}
              <div
                className="pointer-events-none mb-1 px-2 py-0.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground whitespace-nowrap transition-opacity duration-150"
                style={{ opacity: hoveredId === item.id ? 1 : 0 }}
              >
                {item.label}
              </div>

              <button
                ref={(el) => {
                  if (el) itemRefs.current.set(item.id, el);
                }}
                onClick={() => handleClick(item.id)}
                className="flex items-center justify-center rounded-xl bg-secondary/80 text-foreground transition-colors duration-150 hover:bg-[hsl(var(--menu-glass-hover))]"
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
        })}

        {/* Separator before Settings */}
        {/* The separator is built into the items list - Settings is last */}
      </div>

      {/* Reflection / glow */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-2 rounded-full bg-[hsl(var(--menu-glow)/0.15)] blur-md" />
    </div>
  );
};

export default Dock;
