"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { NeonButton } from "@/components/ui/NeonButton";
import { useFetch } from "@/hooks/useFetch";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Rocket } from "lucide-react";

const DEFAULT_SCRIPT = `export default {
  async fetch(request, env, ctx) {
    return new Response('Hello World from Zone Warning!');
  },
};`;

export default function DeployPage() {
  const { fetchWithAuth } = useFetch();
  const router = useRouter();
  const [name, setName] = useState("");
  const [script, setScript] = useState(DEFAULT_SCRIPT);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { res, data } = await fetchWithAuth("/api/workers/deploy", {
        method: "POST",
        body: JSON.stringify({ name, script }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Worker deployed successfully!' });
        setTimeout(() => router.push("/dashboard/workers"), 1500);
      } else {
        setMessage({ type: 'error', text: data.errors?.[0]?.message || 'Deployment failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white">Deploy Worker</h1>

      <GlassCard>
        <form onSubmit={handleDeploy} className="space-y-6">
          <Input
            placeholder="Worker Name (e.g., my-worker)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-black/30"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Worker Script (ES Module)</label>
            <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="w-full h-96 bg-black/50 border border-white/10 rounded-lg p-4 font-mono text-sm text-green-400 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                spellCheck={false}
            />
          </div>

          {message && (
            <div className={`p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {message.text}
            </div>
          )}

          <NeonButton type="submit" loading={loading} className="w-full">
            <Rocket className="w-4 h-4 mr-2" />
            Deploy to Cloudflare
          </NeonButton>
        </form>
      </GlassCard>
    </div>
  );
}
