"use client";

import { useFetch } from "@/hooks/useFetch";
import { useState } from "react";
import { GlassCard } from "./ui/GlassCard";
import { Input } from "./ui/Input";
import { NeonButton } from "./ui/NeonButton";
import { Check, Cloud } from "lucide-react";

interface DnsManagerProps {
  zoneId: string;
  zoneName: string;
}

export function DnsManager({ zoneId, zoneName }: DnsManagerProps) {
  const { fetchWithAuth } = useFetch();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [record, setRecord] = useState({
      type: 'A',
      name: '',
      content: '',
      proxied: true
  });

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
        const { res, data } = await fetchWithAuth("/api/dns", {
            method: "POST",
            body: JSON.stringify({
                zoneId,
                ...record
            })
        });

        if (res.ok) {
            setMessage({ type: 'success', text: `Added ${record.type} record for ${record.name}.${zoneName}` });
            setRecord({ ...record, name: '', content: '' });
        } else {
            setMessage({ type: 'error', text: data.errors?.[0]?.message || 'Failed to add record' });
        }
    } catch (err) {
        setMessage({ type: 'error', text: 'Network error' });
    } finally {
        setLoading(false);
    }
  };

  return (
    <GlassCard className="mt-8 border-t-4 border-t-primary">
      <h3 className="text-xl font-bold text-white mb-4">Manage DNS for {zoneName}</h3>
      <form onSubmit={handleAddRecord} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
                className="h-12 rounded-lg border border-white/10 bg-white/5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={record.type}
                onChange={(e) => setRecord({...record, type: e.target.value})}
            >
                <option value="A">A</option>
                <option value="CNAME">CNAME</option>
                <option value="TXT">TXT</option>
                <option value="AAAA">AAAA</option>
            </select>

            <Input
                placeholder="Name (e.g., sub)"
                value={record.name}
                onChange={(e) => setRecord({...record, name: e.target.value})}
                required
            />

            <Input
                placeholder="Content (e.g., 1.2.3.4)"
                value={record.content}
                onChange={(e) => setRecord({...record, content: e.target.value})}
                required
            />

            <div className="flex items-center space-x-2 h-12 px-3 rounded-lg border border-white/10 bg-white/5">
                <input
                    type="checkbox"
                    id="proxied"
                    checked={record.proxied}
                    onChange={(e) => setRecord({...record, proxied: e.target.checked})}
                    className="w-4 h-4 text-primary bg-transparent border-gray-500 rounded focus:ring-primary"
                />
                <label htmlFor="proxied" className="text-sm text-gray-300 flex items-center">
                    <Cloud className={`w-4 h-4 mr-2 ${record.proxied ? 'text-orange-500' : 'text-gray-500'}`} />
                    Proxied
                </label>
            </div>
        </div>

        {message && (
            <div className={`p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {message.text}
            </div>
        )}

        <div className="flex justify-end">
            <NeonButton type="submit" loading={loading}>
                <Check className="w-4 h-4 mr-2" />
                Add Record
            </NeonButton>
        </div>
      </form>
    </GlassCard>
  );
}
