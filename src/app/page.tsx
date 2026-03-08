"use client";

import { useState, useEffect } from "react";
import { Link2, Copy, Check, LayoutDashboard, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function Home() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expirationDays, setExpirationDays] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Show expired error from URL param
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "expired") {
      setError("That link has expired.");
    }
  }, []);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const body: Record<string, unknown> = { url };
      if (user && customAlias.trim()) body.customAlias = customAlias.trim();
      if (user && expirationDays) body.expirationDays = parseInt(expirationDays, 10);

      const res = await fetch("/api/shorten", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
      } else if (data.shortCode) {
        setShortUrl(`${window.location.origin}/${data.shortCode}`);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 text-gray-900">
      <nav className="w-full max-w-7xl px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Link2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold">LinkShrink</span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={handleSignIn}
              className="flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-gray-200 text-sm font-bold text-gray-700 hover:border-indigo-600 rounded-xl transition-all shadow-sm"
            >
              <LogIn className="w-4 h-4 text-indigo-600" />
              Sign In
            </button>
          )}
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
              Shrink your <span className="text-indigo-600">Links</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-md mx-auto">
              Powerful URL shortener with real-time analytics, QR codes, and API support.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                required
                placeholder="Paste your long link here..."
                className="flex-1 px-5 py-4 rounded-xl border-gray-200 border-2 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button
                disabled={loading}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-200 disabled:opacity-50"
              >
                {loading ? "Shrinking..." : "Shrink Now"}
              </button>
            </div>

            {user && (
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Custom alias (optional, 3-20 chars)"
                  className="flex-1 px-5 py-3 rounded-xl border-gray-200 border-2 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  minLength={3}
                  maxLength={20}
                  pattern="[a-zA-Z0-9_-]+"
                />
                <input
                  type="number"
                  placeholder="Expires in days (optional)"
                  className="sm:w-56 px-5 py-3 rounded-xl border-gray-200 border-2 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                  value={expirationDays}
                  onChange={(e) => setExpirationDays(e.target.value)}
                  min={1}
                  max={365}
                />
              </div>
            )}

            {error && (
              <p className="text-red-600 text-sm font-medium text-left">{error}</p>
            )}
          </form>

          {shortUrl && (
            <div className="mt-8 p-6 bg-white rounded-2xl border border-indigo-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-500 mb-1">Your shortened URL</p>
                  <p className="text-2xl font-bold text-indigo-600 truncate">{shortUrl}</p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all"
                >
                  {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
