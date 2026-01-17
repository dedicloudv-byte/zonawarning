"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { useAuth } from "@/context/AuthContext";
import { Cloud, Layers, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { credentials } = useAuth();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back, <span className="text-primary">{credentials?.email}</span></p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard>
            <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-blue-500/20 text-blue-400">
                    <Cloud className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">DNS Zones</h3>
                    <p className="text-gray-400 text-sm">Manage your domains</p>
                </div>
            </div>
        </GlassCard>

        <GlassCard>
            <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-amber-500/20 text-amber-400">
                    <Layers className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Workers</h3>
                    <p className="text-gray-400 text-sm">Deploy serverless scripts</p>
                </div>
            </div>
        </GlassCard>

        <GlassCard>
            <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-green-500/20 text-green-400">
                    <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Security</h3>
                    <p className="text-gray-400 text-sm">Protected by Cloudflare</p>
                </div>
            </div>
        </GlassCard>
      </div>

      <GlassCard className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">System Status</h2>
          <div className="flex items-center space-x-2 text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>All Systems Operational</span>
          </div>
      </GlassCard>
    </div>
  );
}
