import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, Home, Search, Bell, Heart, User, Settings, MoreHorizontal,
  Mail, Bookmark, Share2, Camera, Zap, Globe, Music, Video, Image,
  FileText, Folder, Archive, Cloud, Lock, Unlock, Star, Sun, Moon,
  Coffee, Gift, Award, Target, Flag, Map, Compass, Wifi, Battery,
  Monitor, Smartphone, Tablet, Watch, Headphones, Mic, Volume2,
  Download, Upload, Printer, Trash2, Edit, Eye, X, GripVertical,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

const allItems: MenuItem[] = [
  { id: "home", icon: Home, label: "Home" },
  { id: "search", icon: Search, label: "Search" },
  { id: "bell", icon: Bell, label: "Notifications" },
  { id: "heart", icon: Heart, label: "Favorites" },
  { id: "mail", icon: Mail, label: "Messages" },
  { id: "user", icon: User, label: "Profile" },
  { id: "settings", icon: Settings, label: "Settings" },
  { id: "bookmark", icon: Bookmark, label: "Bookmarks" },
  { id: "share", icon: Share2, label: "Share" },
  { id: "camera", icon: Camera, label: "Camera" },
  { id: "zap", icon: Zap, label: "Quick Actions" },
  { id: "globe", icon: Globe, label: "Globe" },
  { id: "music", icon: Music, label: "Music" },
  { id: "video", icon: Video, label: "Video" },
  { id: "image", icon: Image, label: "Images" },
  { id: "filetext", icon: FileText, label: "Documents" },
  { id: "folder", icon: Folder, label: "Folders" },
  { id: "archive", icon: Archive, label: "Archive" },
  { id: "cloud", icon: Cloud, label: "Cloud" },
  { id: "lock", icon: Lock, label: "Lock" },
  { id: "unlock", icon: Unlock, label: "Unlock" },
  { id: "star", icon: Star, label: "Starred" },
  { id: "sun", icon: Sun, label: "Light Mode" },
  { id: "moon", icon: Moon, label: "Dark Mode" },
  { id: "coffee", icon: Coffee, label: "Break" },
  { id: "gift", icon: Gift, label: "Gifts" },
  { id: "award", icon: Award, label: "Awards" },
  { id: "target", icon: Target, label: "Goals" },
  { id: "flag", icon: Flag, label: "Flagged" },
  { id: "map", icon: Map, label: "Maps" },
  { id: "compass", icon: Compass, label: "Navigate" },
  { id: "wifi", icon: Wifi, label: "Network" },
  { id: "battery", icon: Battery, label: "Battery" },
  { id: "monitor", icon: Monitor, label: "Desktop" },
  { id: "smartphone", icon: Smartphone, label: "Mobile" },
  { id: "tablet", icon: Tablet, label: "Tablet" },
  { id: "watch", icon: Watch, label: "Watch" },
  { id: "headphones", icon: Headphones, label: "Audio" },
  { id: "mic", icon: Mic, label: "Microphone" },
  { id: "volume", icon: Volume2, label: "Volume" },
  { id: "download", icon: Download, label: "Downloads" },
  { id: "upload", icon: Upload, label: "Uploads" },
  { id: "printer", icon: Printer, label: "Print" },
  { id: "trash", icon: Trash2, label: "Trash" },
  { id: "edit", icon: Edit, label: "Edit" },
  { id: "eye", icon: Eye, label: "Preview" },
  { id: "zap2", icon: Zap, label: "Power" },
];

const MAX_PINNED = 8;
const DEFAULT_PINNED_IDS = ["home", "search", "bell", "heart", "mail", "user", "settings", "bookmark"];
const TRIGGER_SIZE = 44;
const PALETTE_COLS = 8;
const PALETTE_ITEM_SIZE = 44;
const PALETTE_GAP = 4;
const PALETTE_PAD = 12;

const FloatingMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("home");
  const [pinnedIds, setPinnedIds] = useState<string[]>(DEFAULT_PINNED_IDS);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Drag-and-drop state
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [dropMode, setDropMode] = useState<"replace" | "insert">("insert");
  const [dropOnPalette, setDropOnPalette] = useState(false);

  // Direction states
  const [paletteAbove, setPaletteAbove] = useState(false);
  const [toolbarAbove, setToolbarAbove] = useState(false);

  // Menu position drag state
  const [pos, setPos] = useState({ x: 24, y: 300 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  const pinnedItems = useMemo(
    () => pinnedIds.map((id) => allItems.find((item) => item.id === id)!).filter(Boolean),
    [pinnedIds]
  );

  const paletteItems = useMemo(
    () => allItems.filter((item) => !pinnedIds.includes(item.id)),
    [pinnedIds]
  );

  // Estimate toolbar width for clamping
  const toolbarWidth = useMemo(
    () => TRIGGER_SIZE + 8 + pinnedItems.length * (TRIGGER_SIZE + 4) + 1 + (TRIGGER_SIZE + 4) + 16,
    [pinnedItems.length]
  );

  const TOOLBAR_HEIGHT = 44; // approximate toolbar outer height

  // --- Drag to reposition ---
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    hasMoved.current = false;
    dragStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = { ...pos };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [pos]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved.current = true;
    const maxX = window.innerWidth - TRIGGER_SIZE;
    const maxY = window.innerHeight - TRIGGER_SIZE;
    setPos({
      x: Math.max(0, Math.min(maxX, posStart.current.x + dx)),
      y: Math.max(0, Math.min(maxY, posStart.current.y + dy)),
    });
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    isDragging.current = false;
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setPaletteOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Compute directions based on position
  const computeDirections = useCallback(() => {
    const spaceBelow = window.innerHeight - (pos.y + TRIGGER_SIZE);
    const toolbarFitsBelow = spaceBelow > TOOLBAR_HEIGHT + 16;
    const newToolbarAbove = !toolbarFitsBelow;

    const paletteHeight = Math.ceil(paletteItems.length / PALETTE_COLS) * (PALETTE_ITEM_SIZE + PALETTE_GAP) + PALETTE_PAD * 2;
    // If toolbar is above, palette goes above toolbar; if below, palette goes below toolbar
    const totalBelow = TOOLBAR_HEIGHT + 8 + paletteHeight + 16;
    const newPaletteAbove = newToolbarAbove || spaceBelow < totalBelow;

    return { toolbarAbove: newToolbarAbove, paletteAbove: newPaletteAbove };
  }, [paletteItems.length, pos.y]);

  useEffect(() => {
    const dirs = computeDirections();
    setToolbarAbove(dirs.toolbarAbove);
    setPaletteAbove(dirs.paletteAbove);
  }, [computeDirections]);

  const handleTriggerClick = () => {
    if (hasMoved.current) return;
    if (menuOpen) {
      setMenuOpen(false);
      setPaletteOpen(false);
    } else {
      const dirs = computeDirections();
      setToolbarAbove(dirs.toolbarAbove);
      setPaletteAbove(dirs.paletteAbove);
      setMenuOpen(true);
    }
  };

  const handlePaletteToggle = () => {
    if (hasMoved.current) return;
    setPaletteOpen((v) => !v);
  };

  const handleItemClick = (id: string) => {
    if (hasMoved.current) return;
    setActiveItem(id);
  };

  // --- Item DnD ---
  const onItemDragStart = (e: React.DragEvent, id: string) => {
    e.stopPropagation();
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const onItemDragEnd = () => {
    setDraggedItemId(null);
    setDropTargetIndex(null);
    setDropMode("insert");
    setDropOnPalette(false);
  };

  const onItemDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDropTargetIndex(index);
    setDropMode("replace");
    setDropOnPalette(false);
  };

  const onGapDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDropTargetIndex(index);
    setDropMode("insert");
    setDropOnPalette(false);
  };

  const onPinnedDrop = (e: React.DragEvent, index: number, mode: "replace" | "insert") => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedItemId) return;

    setPinnedIds((prev) => {
      const wasPinned = prev.includes(draggedItemId);
      if (mode === "replace") {
        if (wasPinned) {
          const dragIdx = prev.indexOf(draggedItemId);
          const newList = [...prev];
          newList[dragIdx] = prev[index];
          newList[index] = draggedItemId;
          return newList;
        } else {
          const newList = [...prev];
          newList[index] = draggedItemId;
          return newList;
        }
      } else {
        if (wasPinned) {
          const without = prev.filter((id) => id !== draggedItemId);
          const newList = [...without];
          newList.splice(index, 0, draggedItemId);
          return newList;
        } else {
          const newList = [...prev];
          newList.splice(index, 0, draggedItemId);
          if (newList.length > MAX_PINNED) return newList.slice(0, MAX_PINNED);
          return newList;
        }
      }
    });
    onItemDragEnd();
  };

  const onPaletteDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropOnPalette(true);
    setDropTargetIndex(null);
  };

  const onPaletteDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedItemId) return;
    setPinnedIds((prev) => prev.filter((id) => id !== draggedItemId));
    onItemDragEnd();
  };

  const onToolbarDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDropTargetIndex(pinnedIds.length);
    setDropOnPalette(false);
  };

  const onToolbarDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItemId) return;
    setPinnedIds((prev) => {
      if (prev.includes(draggedItemId)) return prev;
      const newList = [...prev, draggedItemId];
      if (newList.length > MAX_PINNED) return newList.slice(0, MAX_PINNED);
      return newList;
    });
    onItemDragEnd();
  };

  const isDragActive = draggedItemId !== null;

  return (
    <div
      ref={containerRef}
      className="fixed z-50 select-none"
      style={{ left: pos.x, top: pos.y }}
    >
      {/* Trigger — drag handle */}
      <motion.button
        className="relative z-20 flex h-11 w-11 items-center justify-center rounded-[14px] border border-menu-glass-border bg-menu-glass/80 text-muted-foreground backdrop-blur-2xl shadow-lg shadow-black/20 cursor-grab active:cursor-grabbing transition-colors hover:text-foreground"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={handleTriggerClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <AnimatePresence mode="wait">
          {menuOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="h-[18px] w-[18px]" />
            </motion.div>
          ) : (
            <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <Menu className="h-[18px] w-[18px]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Toolbar — horizontal pill */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={`absolute left-0 top-full z-10 mt-2 flex items-center gap-0.5 rounded-2xl border border-menu-glass-border bg-menu-glass/80 px-1.5 py-1.5 backdrop-blur-2xl shadow-xl shadow-black/25 transition-colors ${
              isDragActive && !dropOnPalette ? "border-primary/40" : ""
            }`}
            initial={{ opacity: 0, y: -8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
            onDragOver={onToolbarDragOver}
            onDrop={onToolbarDrop}
          >
            {/* Drag handle indicator */}
            <div className="flex h-8 w-5 items-center justify-center text-muted-foreground/40">
              <GripVertical className="h-3.5 w-3.5" />
            </div>

            <div className="mx-0.5 h-5 w-px bg-menu-separator/40" />

            {pinnedItems.map((item, i) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              const isBeingDragged = draggedItemId === item.id;
              const isInsertTarget = dropTargetIndex === i && dropMode === "insert" && isDragActive;
              const isReplaceTarget = dropTargetIndex === i && dropMode === "replace" && isDragActive;
              const isHovered = hoveredItem === item.id;

              return (
                <div key={item.id} className="flex items-center">
                  {/* Insert gap */}
                  <div
                    className="flex h-8 w-1.5 items-center justify-center"
                    onDragOver={(e) => onGapDragOver(e, i)}
                    onDrop={(e) => onPinnedDrop(e, i, "insert")}
                  >
                    {isInsertTarget && (
                      <div className="h-5 w-0.5 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>

                  {/* Toolbar item */}
                  <motion.button
                    draggable
                    onDragStart={(e) => onItemDragStart(e as unknown as React.DragEvent, item.id)}
                    onDragEnd={onItemDragEnd}
                    onDragOver={(e) => onItemDragOver(e as unknown as React.DragEvent, i)}
                    onDrop={(e) => onPinnedDrop(e as unknown as React.DragEvent, i, "replace")}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`group relative flex h-8 w-8 items-center justify-center rounded-[10px] transition-all duration-150 cursor-grab active:cursor-grabbing ${
                      isBeingDragged ? "opacity-20" : ""
                    } ${
                      isReplaceTarget
                        ? "ring-2 ring-primary/60 bg-primary/15"
                        : isActive
                          ? "bg-menu-active-bg text-foreground"
                          : "text-muted-foreground hover:bg-menu-glass-hover hover:text-foreground"
                    }`}
                    animate={{ opacity: isBeingDragged ? 0.2 : 1, scale: isBeingDragged ? 0.8 : 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 28 }}
                    onClick={() => handleItemClick(item.id)}
                  >
                    <Icon className="pointer-events-none h-[16px] w-[16px]" />

                    {/* iPadOS-style tooltip */}
                    <AnimatePresence>
                      {isHovered && !isDragActive && (
                        <motion.span
                          className="pointer-events-none absolute -top-9 left-1/2 z-30 whitespace-nowrap rounded-lg border border-menu-glass-border bg-menu-glass px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur-2xl shadow-lg shadow-black/20"
                          initial={{ opacity: 0, y: 4, x: "-50%" }}
                          animate={{ opacity: 1, y: 0, x: "-50%" }}
                          exit={{ opacity: 0, y: 4, x: "-50%" }}
                          transition={{ duration: 0.12 }}
                        >
                          {item.label}
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 border-b border-r border-menu-glass-border bg-menu-glass" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              );
            })}

            {/* Trailing insert gap */}
            {isDragActive && (
              <div
                className="flex h-8 w-1.5 items-center justify-center"
                onDragOver={(e) => onGapDragOver(e, pinnedIds.length)}
                onDrop={(e) => onPinnedDrop(e, pinnedIds.length, "insert")}
              >
                {dropTargetIndex === pinnedIds.length && dropMode === "insert" && (
                  <div className="h-5 w-0.5 rounded-full bg-primary animate-pulse" />
                )}
              </div>
            )}

            <div className="mx-0.5 h-5 w-px bg-menu-separator/40" />

            {/* More button */}
            <motion.button
              className={`relative flex h-8 w-8 items-center justify-center rounded-[10px] transition-all duration-150 ${
                paletteOpen
                  ? "bg-menu-active-bg text-foreground"
                  : "text-muted-foreground hover:bg-menu-glass-hover hover:text-foreground"
              }`}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handlePaletteToggle}
            >
              <MoreHorizontal className="h-[16px] w-[16px]" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Palette — grid popover */}
      <AnimatePresence>
        {paletteOpen && menuOpen && (
          <motion.div
            className={`absolute left-0 z-10 rounded-2xl border border-menu-glass-border bg-menu-glass/80 p-3 backdrop-blur-2xl shadow-xl shadow-black/25 max-h-[60vh] overflow-y-auto overflow-x-hidden transition-colors ${
              paletteAbove ? "bottom-full mb-2" : ""
            } ${
              !paletteAbove ? "mt-2" : ""
            } ${
              isDragActive && dropOnPalette ? "border-destructive/40" : ""
            }`}
            style={{
              top: paletteAbove ? undefined : TRIGGER_SIZE + 8 + TRIGGER_SIZE + 8,
              width: PALETTE_COLS * (PALETTE_ITEM_SIZE + PALETTE_GAP) + PALETTE_PAD * 2,
            }}
            initial={{ opacity: 0, y: paletteAbove ? 12 : -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: paletteAbove ? 12 : -12, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 28 }}
            onDragOver={onPaletteDragOver}
            onDrop={onPaletteDrop}
          >
            <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              All Actions
            </div>
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${PALETTE_COLS}, ${PALETTE_ITEM_SIZE}px)` }}
            >
              {paletteItems.length === 0 && (
                <div className="col-span-8 py-6 text-center text-xs text-muted-foreground">
                  All items pinned
                </div>
              )}
              {paletteItems.map((item, i) => {
                const Icon = item.icon;
                const isBeingDragged = draggedItemId === item.id;
                const isHovered = hoveredItem === item.id;
                return (
                  <motion.button
                    key={item.id}
                    draggable
                    onDragStart={(e) => onItemDragStart(e as unknown as React.DragEvent, item.id)}
                    onDragEnd={onItemDragEnd}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`group relative flex h-11 w-11 flex-col items-center justify-center rounded-xl text-muted-foreground transition-all duration-150 hover:bg-menu-glass-hover hover:text-foreground cursor-grab active:cursor-grabbing ${
                      isBeingDragged ? "opacity-20" : ""
                    }`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: isBeingDragged ? 0.2 : 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: i * 0.008, type: "spring", stiffness: 500, damping: 25 }}
                    onClick={() => handleItemClick(item.id)}
                  >
                    <Icon className="pointer-events-none h-[16px] w-[16px]" />
                    <span className="pointer-events-none mt-0.5 text-[9px] font-medium leading-tight opacity-60 truncate max-w-[40px]">
                      {item.label}
                    </span>

                    {/* Tooltip */}
                    <AnimatePresence>
                      {isHovered && !isDragActive && (
                        <motion.span
                          className="pointer-events-none absolute -top-8 left-1/2 z-30 whitespace-nowrap rounded-lg border border-menu-glass-border bg-menu-glass px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur-2xl shadow-lg shadow-black/20"
                          initial={{ opacity: 0, y: 4, x: "-50%" }}
                          animate={{ opacity: 1, y: 0, x: "-50%" }}
                          exit={{ opacity: 0, y: 4, x: "-50%" }}
                          transition={{ duration: 0.12 }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingMenu;
