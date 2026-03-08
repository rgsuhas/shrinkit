"use client";

import { useState } from "react";
import { Link2, Copy, Check } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        body: JSON.stringify({ url }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.shortCode) {
        setShortUrl(`${window.location.origin}/${data.shortCode}`);
      }
    } catch (err) {
      console.error(err);
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
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 text-gray-900">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-indigo-600 rounded-2xl shadow-lg">
            <Link2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Shrink your <span className="text-indigo-600">Links</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Powerful URL shortener with real-time analytics, QR codes, and API support.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col sm:flex-row gap-3">
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
        </form>

        {shortUrl && (
          <div className="mt-8 p-6 bg-white rounded-2xl border border-indigo-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <p className="text-sm font-medium text-gray-500">Your shortened URL</p>
                <p className="text-xl font-bold text-indigo-600 truncate max-w-xs">{shortUrl}</p>
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
    </main>
  );
}
