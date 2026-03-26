import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Home,
  Search,
  Bell,
  Heart,
  User,
  Settings,
  MoreHorizontal,
  Mail,
  Bookmark,
  Share2,
  Camera,
  Zap,
  Globe,
  Music,
  Video,
  Image,
  FileText,
  Folder,
  Archive,
  Cloud,
  Lock,
  Unlock,
  Star,
  Sun,
  Moon,
  Coffee,
  Gift,
  Award,
  Target,
  Flag,
  Map,
  Compass,
  Wifi,
  Battery,
  Monitor,
  Smartphone,
  Tablet,
  Watch,
  Headphones,
  Mic,
  Volume2,
  Download,
  Upload,
  Printer,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";

const mainItems = [
  { icon: Home, label: "Home" },
  { icon: Search, label: "Search" },
  { icon: Bell, label: "Notifications" },
  { icon: Heart, label: "Favorites" },
  { icon: Mail, label: "Messages" },
  { icon: User, label: "Profile" },
  { icon: Settings, label: "Settings" },
];

const moreItems = [
  { icon: Bookmark, label: "Bookmarks" },
  { icon: Share2, label: "Share" },
  { icon: Camera, label: "Camera" },
  { icon: Zap, label: "Quick Actions" },
  { icon: Globe, label: "Globe" },
  { icon: Music, label: "Music" },
  { icon: Video, label: "Video" },
  { icon: Image, label: "Images" },
  { icon: FileText, label: "Documents" },
  { icon: Folder, label: "Folders" },
  { icon: Archive, label: "Archive" },
  { icon: Cloud, label: "Cloud" },
  { icon: Lock, label: "Lock" },
  { icon: Unlock, label: "Unlock" },
  { icon: Star, label: "Starred" },
  { icon: Sun, label: "Light Mode" },
  { icon: Moon, label: "Dark Mode" },
  { icon: Coffee, label: "Break" },
  { icon: Gift, label: "Gifts" },
  { icon: Award, label: "Awards" },
  { icon: Target, label: "Goals" },
  { icon: Flag, label: "Flagged" },
  { icon: Map, label: "Maps" },
  { icon: Compass, label: "Navigate" },
  { icon: Wifi, label: "Network" },
  { icon: Battery, label: "Battery" },
  { icon: Monitor, label: "Desktop" },
  { icon: Smartphone, label: "Mobile" },
  { icon: Tablet, label: "Tablet" },
  { icon: Watch, label: "Watch" },
  { icon: Headphones, label: "Audio" },
  { icon: Mic, label: "Microphone" },
  { icon: Volume2, label: "Volume" },
  { icon: Download, label: "Downloads" },
  { icon: Upload, label: "Uploads" },
  { icon: Printer, label: "Print" },
  { icon: Trash2, label: "Trash" },
  { icon: Edit, label: "Edit" },
  { icon: Eye, label: "Preview" },
  { icon: Zap, label: "Power" },
];

const FloatingMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");

  // Drag state
  const [pos, setPos] = useState({ x: 24, y: 300 });
  const dragRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    hasMoved.current = false;
    dragStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = { ...pos };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [pos]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved.current = true;
    setPos({
      x: posStart.current.x + dx,
      y: posStart.current.y + dy,
    });
  }, []);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Close on canvas click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dragRef.current && !dragRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleTriggerClick = () => {
    if (hasMoved.current) return;
    if (menuOpen) {
      setMenuOpen(false);
      setMoreOpen(false);
    } else {
      setMenuOpen(true);
    }
  };

  const handleMoreClick = () => {
    if (hasMoved.current) return;
    setMoreOpen((v) => !v);
  };

  const handleItemClick = (label: string) => {
    if (hasMoved.current) return;
    setActiveItem(label);
  };

  return (
    <div
      ref={dragRef}
      className="fixed z-50 select-none"
      style={{ left: pos.x, top: pos.y }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div className="flex items-start gap-3">
        {/* Trigger + main menu column */}
        <div className="flex flex-col items-center gap-0">
          {/* Trigger button (always visible) */}
          <motion.button
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-menu-glass-border bg-menu-glass/90 text-foreground backdrop-blur-xl shadow-[0_0_30px_hsl(var(--menu-glow)/0.15)] cursor-grab active:cursor-grabbing"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTriggerClick}
          >
            <Menu className="h-5 w-5" />
          </motion.button>

          {/* Main vertical menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                className="mt-2 flex flex-col gap-1.5 rounded-2xl border border-menu-glass-border bg-menu-glass/90 p-2 backdrop-blur-xl shadow-[0_0_30px_hsl(var(--menu-glow)/0.12)]"
                initial={{ opacity: 0, scaleY: 0, originY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {mainItems.map((item, i) => {
                  const Icon = item.icon;
                  const isActive = activeItem === item.label;
                  return (
                    <motion.button
                      key={item.label}
                      className={`group relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-[0_0_12px_hsl(var(--menu-glow)/0.35)]"
                          : "text-muted-foreground hover:bg-secondary hover:text-primary"
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.03, type: "spring", stiffness: 500, damping: 28 }}
                      onClick={() => handleItemClick(item.label)}
                    >
                      <Icon className="h-4.5 w-4.5" />
                      <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground opacity-0 transition-opacity group-hover:opacity-100">
                        {item.label}
                      </span>
                    </motion.button>
                  );
                })}

                {/* Divider */}
                <div className="mx-auto h-px w-6 bg-border" />

                {/* More button */}
                <motion.button
                  className={`group relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                    moreOpen
                      ? "bg-primary text-primary-foreground shadow-[0_0_12px_hsl(var(--menu-glow)/0.35)]"
                      : "text-muted-foreground hover:bg-secondary hover:text-primary"
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: mainItems.length * 0.03, type: "spring", stiffness: 500, damping: 28 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMoreClick}
                >
                  <MoreHorizontal className="h-4.5 w-4.5" />
                  <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    More
                  </span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* More items grid */}
        <AnimatePresence>
          {moreOpen && menuOpen && (
            <motion.div
              className="mt-14 grid grid-cols-5 gap-1.5 rounded-2xl border border-menu-glass-border bg-menu-glass/90 p-2 backdrop-blur-xl shadow-[0_0_30px_hsl(var(--menu-glow)/0.12)] max-h-[70vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.5, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.5, x: -20 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {moreItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.label + i}
                    className="group relative flex h-10 w-10 flex-col items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                      delay: i * 0.015,
                      type: "spring",
                      stiffness: 500,
                      damping: 22,
                    }}
                    onClick={() => handleItemClick(item.label)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="pointer-events-none absolute top-full mt-1 whitespace-nowrap rounded-lg bg-secondary px-2 py-1 text-[10px] font-medium text-secondary-foreground opacity-0 transition-opacity group-hover:opacity-100 z-10">
                      {item.label}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FloatingMenu;
