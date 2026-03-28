import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, Home, Search, Bell, Heart, User, Settings, MoreHorizontal,
  Mail, Bookmark, Share2, Camera, Zap, Globe, Music, Video, Image,
  FileText, Folder, Archive, Cloud, Lock, Unlock, Star, Sun, Moon,
  Coffee, Gift, Award, Target, Flag, Map, Compass, Wifi, Battery,
  Monitor, Smartphone, Tablet, Watch, Headphones, Mic, Volume2,
  Download, Upload, Printer, Trash2, Edit, Eye,
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

const FloatingMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("home");
  const [pinnedIds, setPinnedIds] = useState<string[]>(DEFAULT_PINNED_IDS);

  // Drag-and-drop state
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [dropMode, setDropMode] = useState<"replace" | "insert">("insert");
  const [dropOnMore, setDropOnMore] = useState(false);

  // Menu direction (up or down)
  const [openDirection, setOpenDirection] = useState<"down" | "up">("down");
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Menu position drag state
  const [pos, setPos] = useState({ x: 24, y: 300 });
  const dragRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  const pinnedItems = useMemo(
    () => pinnedIds.map((id) => allItems.find((item) => item.id === id)!).filter(Boolean),
    [pinnedIds]
  );

  const moreItems = useMemo(
    () => allItems.filter((item) => !pinnedIds.includes(item.id)),
    [pinnedIds]
  );

  // --- Menu position dragging ---
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
    setPos({ x: posStart.current.x + dx, y: posStart.current.y + dy });
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

  // Compute direction based on viewport
  const computeDirection = useCallback(() => {
    const menuHeight = (MAX_PINNED + 1) * 44 + 40;
    const viewportHeight = window.innerHeight;
    const triggerBottom = pos.y + 48;
    const spaceBelow = viewportHeight - triggerBottom;
    const spaceAbove = pos.y;
    return spaceBelow >= menuHeight || spaceBelow >= spaceAbove ? "down" : "up";
  }, [pos.y]);

  // Compute whether the "more" grid should appear on the left
  const [moreOnLeft, setMoreOnLeft] = useState(false);
  const computeMoreSide = useCallback(() => {
    const gridWidth = 5 * 40 + 4 * 6 + 16 + 12 + 56; // 5 cols * 40px + gaps + padding + gap + trigger col
    const viewportWidth = window.innerWidth;
    return pos.x + gridWidth > viewportWidth;
  }, [pos.x]);

  // Update direction and more-side whenever position changes
  useEffect(() => {
    setOpenDirection(computeDirection());
    setMoreOnLeft(computeMoreSide());
  }, [computeDirection, computeMoreSide]);

  const handleTriggerClick = () => {
    if (hasMoved.current) return;
    if (menuOpen) { setMenuOpen(false); setMoreOpen(false); }
    else {
      setOpenDirection(computeDirection());
      setMoreOnLeft(computeMoreSide());
      setMenuOpen(true);
    }
  };

  const handleMoreClick = () => {
    if (hasMoved.current) return;
    setMoreOpen((v) => !v);
  };

  const handleItemClick = (id: string) => {
    if (hasMoved.current) return;
    setActiveItem(id);
  };

  // --- Item drag-and-drop handlers ---
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
    setDropOnMore(false);
  };

  // Drag over a pinned item (replace mode)
  const onItemDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDropTargetIndex(index);
    setDropMode("replace");
    setDropOnMore(false);
  };

  // Drag over the gap between pinned items (insert mode)
  const onGapDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDropTargetIndex(index);
    setDropMode("insert");
    setDropOnMore(false);
  };

  const onPinnedDrop = (e: React.DragEvent, index: number, mode: "replace" | "insert") => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedItemId) return;

    setPinnedIds((prev) => {
      const wasPinned = prev.includes(draggedItemId);
      if (mode === "replace") {
        if (wasPinned) {
          // Swap positions
          const dragIdx = prev.indexOf(draggedItemId);
          const newList = [...prev];
          newList[dragIdx] = prev[index];
          newList[index] = draggedItemId;
          return newList;
        } else {
          // Replace the item at this index, displaced item goes back to "more"
          const newList = [...prev];
          newList[index] = draggedItemId;
          return newList;
        }
      } else {
        // Insert/shift mode
        if (wasPinned) {
          const without = prev.filter((id) => id !== draggedItemId);
          const newList = [...without];
          newList.splice(index, 0, draggedItemId);
          return newList;
        } else {
          // Insert from more, push last item out if at max
          const newList = [...prev];
          newList.splice(index, 0, draggedItemId);
          if (newList.length > MAX_PINNED) {
            return newList.slice(0, MAX_PINNED);
          }
          return newList;
        }
      }
    });
    onItemDragEnd();
  };

  // Drop onto the "more" grid (remove from pinned)
  const onMoreDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropOnMore(true);
    setDropTargetIndex(null);
  };

  const onMoreDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedItemId) return;

    setPinnedIds((prev) => prev.filter((id) => id !== draggedItemId));
    onItemDragEnd();
  };

  // Drop onto the vertical menu container itself (append)
  const onMenuContainerDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDropTargetIndex(pinnedIds.length);
    setDropOnMore(false);
  };

  const onMenuContainerDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItemId) return;

    setPinnedIds((prev) => {
      if (prev.includes(draggedItemId)) return prev;
      const newList = [...prev, draggedItemId];
      if (newList.length > MAX_PINNED) {
        newList.splice(MAX_PINNED - 1, 0, newList.pop()!);
        return newList.slice(0, MAX_PINNED);
      }
      return newList;
    });
    onItemDragEnd();
  };

  const isDragActive = draggedItemId !== null;

  return (
    <div
      ref={dragRef}
      className="fixed z-50 select-none"
      style={{ left: pos.x, top: pos.y }}
    >
      <div className={`flex items-start gap-3 ${moreOnLeft ? "flex-row-reverse" : ""}`}>
        {/* Trigger + main menu column */}
        <div className="flex flex-col items-center gap-0">
          {/* Trigger button */}
          <motion.button
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-menu-glass-border bg-menu-glass/90 text-foreground backdrop-blur-xl shadow-[0_0_30px_hsl(var(--menu-glow)/0.15)] cursor-grab active:cursor-grabbing"
            ref={triggerRef}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTriggerClick}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            <Menu className="h-5 w-5" />
          </motion.button>

          {/* Main vertical menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                className={`flex flex-col gap-1.5 rounded-2xl border p-2 backdrop-blur-xl shadow-[0_0_30px_hsl(var(--menu-glow)/0.12)] transition-colors ${
                  openDirection === "down" ? "mt-2" : "mb-2 order-first"
                } ${
                  isDragActive && !dropOnMore
                    ? "border-primary/50 bg-menu-glass/95"
                    : "border-menu-glass-border bg-menu-glass/90"
                }`}
                initial={{ opacity: 0, scaleY: 0, originY: openDirection === "down" ? 0 : 1 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                onDragOver={onMenuContainerDragOver}
                onDrop={onMenuContainerDrop}
              >
                {pinnedItems.map((item, i) => {
                  const Icon = item.icon;
                  const isActive = activeItem === item.id;
                  const isBeingDragged = draggedItemId === item.id;
                  const isInsertTarget = dropTargetIndex === i && dropMode === "insert" && isDragActive;
                  const isReplaceTarget = dropTargetIndex === i && dropMode === "replace" && isDragActive;

                  return (
                    <div key={item.id}>
                      {/* Gap drop zone before this item (insert mode) */}
                      <div
                        className="h-1.5 w-10 flex items-center justify-center"
                        onDragOver={(e) => onGapDragOver(e, i)}
                        onDrop={(e) => onPinnedDrop(e, i, "insert")}
                      >
                        {isInsertTarget && (
                          <div className="h-1 w-6 rounded-full bg-primary animate-pulse" />
                        )}
                      </div>
                      <motion.button
                        draggable
                        onDragStart={(e) => onItemDragStart(e as unknown as React.DragEvent, item.id)}
                        onDragEnd={onItemDragEnd}
                        onDragOver={(e) => onItemDragOver(e as unknown as React.DragEvent, i)}
                        onDrop={(e) => onPinnedDrop(e as unknown as React.DragEvent, i, "replace")}
                        className={`group relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors cursor-grab active:cursor-grabbing ${
                          isBeingDragged ? "opacity-30" : ""
                        } ${
                          isReplaceTarget
                            ? "ring-2 ring-primary bg-primary/20"
                            : isActive
                              ? "bg-primary text-primary-foreground shadow-[0_0_12px_hsl(var(--menu-glow)/0.35)]"
                              : "text-muted-foreground hover:bg-secondary hover:text-primary"
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: isBeingDragged ? 0.3 : 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: i * 0.03, type: "spring", stiffness: 500, damping: 28 }}
                        onClick={() => handleItemClick(item.id)}
                      >
                        <Icon className="h-4.5 w-4.5 pointer-events-none" />
                        <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground opacity-0 transition-opacity group-hover:opacity-100">
                          {item.label}
                        </span>
                      </motion.button>
                    </div>
                  );
                })}
                {/* Gap drop zone after last item */}
                {isDragActive && (
                  <div
                    className="h-1.5 w-10 flex items-center justify-center"
                    onDragOver={(e) => onGapDragOver(e, pinnedIds.length)}
                    onDrop={(e) => onPinnedDrop(e, pinnedIds.length, "insert")}
                  >
                    {dropTargetIndex === pinnedIds.length && dropMode === "insert" && (
                      <div className="h-1 w-6 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                )}


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
                  transition={{ delay: pinnedItems.length * 0.03, type: "spring", stiffness: 500, damping: 28 }}
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
              className={`mt-14 grid grid-cols-5 gap-1.5 rounded-2xl border p-2 backdrop-blur-xl shadow-[0_0_30px_hsl(var(--menu-glow)/0.12)] max-h-[70vh] overflow-y-auto overflow-x-hidden transition-colors ${
                isDragActive && dropOnMore
                  ? "border-destructive/50 bg-menu-glass/95"
                  : "border-menu-glass-border bg-menu-glass/90"
              }`}
              initial={{ opacity: 0, scale: 0.5, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.5, x: -20 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onDragOver={onMoreDragOver}
              onDrop={onMoreDrop}
            >
              {moreItems.length === 0 && (
                <div className="col-span-5 py-4 text-center text-xs text-muted-foreground">
                  All items pinned
                </div>
              )}
              {moreItems.map((item, i) => {
                const Icon = item.icon;
                const isBeingDragged = draggedItemId === item.id;
                return (
                  <motion.button
                    key={item.id}
                    draggable
                    onDragStart={(e) => onItemDragStart(e as unknown as React.DragEvent, item.id)}
                    onDragEnd={onItemDragEnd}
                    className={`group relative flex h-10 w-10 flex-col items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-primary cursor-grab active:cursor-grabbing ${
                      isBeingDragged ? "opacity-30" : ""
                    }`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: isBeingDragged ? 0.3 : 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ delay: i * 0.015, type: "spring", stiffness: 500, damping: 22 }}
                    onClick={() => handleItemClick(item.id)}
                  >
                    <Icon className="h-4 w-4 pointer-events-none" />
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
