import { useAuth } from "@/context/AuthContext";
import { useState, useCallback } from "react";

export function useFetch() {
  const { credentials } = useAuth();

  const fetchWithAuth = useCallback(async (url: string, options: RequestInit = {}) => {
    if (!credentials) throw new Error("No credentials");

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...((options.headers as Record<string, string>) || {}),
        "x-cf-email": credentials.email || "",
        "x-cf-key": credentials.apiToken || "",
        "x-cf-account-id": credentials.accountId || "",
    };

    const res = await fetch(url, {
        ...options,
        headers,
    });

    const data = await res.json();
    return { res, data };
  }, [credentials]);

  return { fetchWithAuth };
}
