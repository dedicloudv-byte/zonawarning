"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { useFetch } from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import { Loader2, Plus, Terminal } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";
import Link from "next/link";

interface Worker {
  id: string;
  created_on: string;
  modified_on: string;
  etag: string;
}

export default function WorkersPage() {
  const { fetchWithAuth } = useFetch();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWorkers() {
      try {
        const { res, data } = await fetchWithAuth("/api/workers");
        if (res.ok) {
          setWorkers(data.result);
        } else {
          setError(data.errors?.[0]?.message || "Failed to load workers");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    }
    loadWorkers();
  }, [fetchWithAuth]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Cloudflare Workers</h1>
        <Link href="/dashboard/deploy">
            <NeonButton>
                <Plus className="w-4 h-4 mr-2" />
                New Worker
            </NeonButton>
        </Link>
      </div>

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

      {!loading && !error && workers.length === 0 && (
          <div className="text-center py-10 text-gray-400">
              No workers found. Deploy one!
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workers.map((worker) => (
          <GlassCard key={worker.id} className="group cursor-pointer">
            <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Terminal className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{worker.id}</h3>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
                <p>Created: {new Date(worker.created_on).toLocaleDateString()}</p>
                <p>Modified: {new Date(worker.modified_on).toLocaleDateString()}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
