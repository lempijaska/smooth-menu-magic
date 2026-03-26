import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
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
];

const FloatingMenu = () => {
  const [moreOpen, setMoreOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex items-center gap-3">
      {/* Secondary menu */}
      <AnimatePresence>
        {moreOpen && (
          <motion.div
            className="flex flex-col gap-2 rounded-2xl border border-menu-glass-border bg-menu-glass/80 p-2 backdrop-blur-xl shadow-[0_0_30px_hsl(var(--menu-glow)/0.15)]"
            initial={{ opacity: 0, scale: 0.3, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.3, x: 40 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {moreItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.label}
                  className="group relative flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                  initial={{
                    opacity: 0,
                    scale: 0,
                    rotate: -180 + i * 45,
                    x: 30,
                    y: (i - 1.5) * 20,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                    x: 0,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0,
                    rotate: 180 - i * 45,
                    x: 30,
                    y: (i - 1.5) * 20,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 22,
                    delay: i * 0.05,
                  }}
                  onClick={() => setActiveItem(item.label)}
                >
                  <Icon className="h-5 w-5" />
                  {/* Tooltip */}
                  <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main menu */}
      <div className="flex flex-col gap-2 rounded-2xl border border-menu-glass-border bg-menu-glass/80 p-2 backdrop-blur-xl shadow-[0_0_40px_hsl(var(--menu-glow)/0.1)]">
        {mainItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.label;
          return (
            <motion.button
              key={item.label}
              className={`group relative flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-[0_0_16px_hsl(var(--menu-glow)/0.4)]"
                  : "text-muted-foreground hover:bg-secondary hover:text-primary"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setActiveItem(item.label);
                setMoreOpen(false);
              }}
            >
              <Icon className="h-5 w-5" />
              {/* Tooltip */}
              <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground opacity-0 transition-opacity group-hover:opacity-100">
                {item.label}
              </span>
            </motion.button>
          );
        })}

        {/* Divider */}
        <div className="mx-auto h-px w-6 bg-border" />

        {/* More button */}
        <motion.button
          className={`group relative flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
            moreOpen
              ? "bg-primary text-primary-foreground shadow-[0_0_16px_hsl(var(--menu-glow)/0.4)]"
              : "text-muted-foreground hover:bg-secondary hover:text-primary"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setMoreOpen(!moreOpen)}
          animate={{ rotate: moreOpen ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <MoreHorizontal className="h-5 w-5" />
          <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground opacity-0 transition-opacity group-hover:opacity-100">
            More
          </span>
        </motion.button>
      </div>
    </div>
  );
};

export default FloatingMenu;
