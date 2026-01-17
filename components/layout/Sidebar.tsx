"use client";

import { cn } from "@/lib/utils";
import { Cloud, Globe, Home, Layers, LogOut, RefreshCw, Settings, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useFetch } from "@/hooks/useFetch";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Workers", href: "/dashboard/workers", icon: Layers },
  { name: "DNS Zones", href: "/dashboard/zones", icon: Globe },
  { name: "Deploy", href: "/dashboard/deploy", icon: Cloud },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // Mobile state
  const { logout } = useAuth();
  const { fetchWithAuth } = useFetch();
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState("");

  const handleUpdate = async () => {
      if (!confirm("Are you sure you want to update the system from GitHub?")) return;
      setUpdating(true);
      setUpdateMsg("Updating...");
      try {
          const { res, data } = await fetchWithAuth("/api/system/update", { method: "POST" });
          if (res.ok) {
              setUpdateMsg("Updated! Restarting...");
              // Ideally reload window after a few seconds
              setTimeout(() => window.location.reload(), 2000);
          } else {
              setUpdateMsg("Update failed");
          }
      } catch (e) {
          setUpdateMsg("Error");
      } finally {
          setTimeout(() => {
             setUpdating(false);
             setUpdateMsg("");
          }, 3000);
      }
  };

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="p-6 flex items-center space-x-3">
          <ShieldAlert className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold tracking-wider text-white">
            ZONE <span className="text-primary">WARNING</span>
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-5 h-5 mr-3 transition-colors", isActive ? "text-primary" : "text-gray-500 group-hover:text-white")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
            <button
              onClick={handleUpdate}
              disabled={updating}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors disabled:opacity-50"
            >
                <RefreshCw className={`w-5 h-5 mr-3 ${updating ? 'animate-spin' : ''}`} />
                {updateMsg || "Update System"}
            </button>

            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
            </button>
        </div>
      </aside>
    </>
  );
}
