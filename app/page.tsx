"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { NeonButton } from "@/components/ui/NeonButton";
import { useAuth } from "@/context/AuthContext";
import { Key, Mail, Shield, User } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    apiToken: "",
    accountId: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
        const res = await fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (res.ok && data.success) {
            login(formData);
        } else {
            setError(data.errors?.[0]?.message || "Invalid credentials");
        }
    } catch (err) {
        setError("Network error occurred");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/grid.svg')] bg-cover relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-background/90" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]" />

      <GlassCard className="w-full max-w-md mx-4 relative z-10 border-primary/20">
        <div className="text-center mb-8">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 neon-border"
            >
                <Shield className="w-8 h-8 text-primary" />
            </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 neon-text">ZONE WARNING</h1>
          <p className="text-gray-400">Enter your Cloudflare credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                  {error}
              </div>
          )}
          <Input
            icon={<Mail className="w-5 h-5" />}
            placeholder="Cloudflare Email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            icon={<Key className="w-5 h-5" />}
            placeholder="Global API Key / Token"
            type="password"
            required
            value={formData.apiToken}
            onChange={(e) => setFormData({ ...formData, apiToken: e.target.value })}
          />
          <Input
            icon={<User className="w-5 h-5" />}
            placeholder="Account ID"
            type="text"
            required
            value={formData.accountId}
            onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
          />

          <NeonButton type="submit" className="w-full" loading={loading}>
            Access Dashboard
          </NeonButton>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
            <p>Your credentials are stored locally in your browser.</p>
        </div>
      </GlassCard>
    </div>
  );
}
