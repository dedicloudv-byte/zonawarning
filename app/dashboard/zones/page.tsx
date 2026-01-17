"use client";

import { DnsManager } from "@/components/DnsManager";
import { GlassCard } from "@/components/ui/GlassCard";
import { useFetch } from "@/hooks/useFetch";
import { Globe, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Zone {
  id: string;
  name: string;
  status: string;
}

export default function ZonesPage() {
  const { fetchWithAuth } = useFetch();
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  useEffect(() => {
    async function loadZones() {
      try {
        const { res, data } = await fetchWithAuth("/api/zones");
        if (res.ok) {
          setZones(data.result);
        } else {
          setError(data.errors?.[0]?.message || "Failed to load zones");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    }
    loadZones();
  }, [fetchWithAuth]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">DNS Zones</h1>

      {loading && (
        <div className="flex justify-center py-10">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      )}

      {error && (
        <GlassCard className="border-red-500/50 bg-red-500/10 text-red-200">
            Error: {error}
        </GlassCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {zones.map((zone) => (
          <GlassCard
            key={zone.id}
            className={`cursor-pointer transition-all ${selectedZone?.id === zone.id ? 'ring-2 ring-primary bg-white/10' : 'hover:bg-white/5'}`}
            onClick={() => setSelectedZone(zone)}
          >
            <div className="flex items-center space-x-3 mb-2">
                <Globe className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white">{zone.name}</h3>
            </div>
            <div className="flex items-center space-x-2 text-sm">
                <span className={`w-2 h-2 rounded-full ${zone.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="text-gray-400 capitalize">{zone.status}</span>
            </div>
          </GlassCard>
        ))}
      </div>

      {selectedZone && (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={selectedZone.id}
        >
            <DnsManager zoneId={selectedZone.id} zoneName={selectedZone.name} />
        </motion.div>
      )}
    </div>
  );
}
