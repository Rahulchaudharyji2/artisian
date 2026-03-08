import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Upload,
  Package,
  BookOpen,
  Share2,
  Globe,
  TrendingUp,
  Mic,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import VoiceAssistantFAB from "@/components/VoiceAssistantFAB";
import kalaLogo from "@/assets/kala-logo.png";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Upload, label: "Upload Product", path: "/dashboard/upload" },
  { icon: Package, label: "My Products", path: "/dashboard/products" },
  { icon: BookOpen, label: "Story Generator", path: "/dashboard/story" },
  { icon: Share2, label: "Social Media", path: "/dashboard/social" },
  { icon: Globe, label: "Market Discovery", path: "/dashboard/markets" },
  { icon: TrendingUp, label: "Smart Pricing", path: "/dashboard/pricing" },
  { icon: Mic, label: "Voice Assistant", path: "/dashboard/voice" },
  { icon: User, label: "Profile", path: "/dashboard/profile" },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 gradient-indigo">
        <div className="p-6 flex items-center gap-3">
          <img src={kalaLogo} alt="KALA AI" className="h-9 w-9" />
          <span className="font-display text-lg font-bold text-sidebar-foreground">KALA AI</span>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground">
              <LogOut className="w-4 h-4" /> Log Out
            </Button>
          </Link>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-64 gradient-indigo z-50 lg:hidden flex flex-col"
            >
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={kalaLogo} alt="KALA AI" className="h-9 w-9" />
                  <span className="font-display text-lg font-bold text-sidebar-foreground">KALA AI</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-sidebar-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 px-3 space-y-1">
                {navItems.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-background">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <img src={kalaLogo} alt="KALA AI" className="h-8 w-8" />
            <span className="font-display font-bold text-foreground">KALA AI</span>
          </div>
          <div className="w-6" />
        </header>
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
        <VoiceAssistantFAB />
      </div>
    </div>
  );
};

export default DashboardLayout;
