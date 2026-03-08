"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Link2, Copy, Check, ArrowLeft, BarChart2, Clock, Globe, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface RecentClick {
  id: number;
  accessTime: string;
  referrer: string | null;
  userAgent: string | null;
  ipAddress: string | null;
}

interface StatsData {
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
  expiresAt: string | null;
  clickCount: number;
  recentClicks: RecentClick[];
}

export default function StatsPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const shortCode = params.shortCode as string;

  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        return;
      }
      try {
        const res = await fetch(`/api/stats/${shortCode}`);
        if (!res.ok) {
          const data = await res.json();
          setError(data.error ?? "Failed to load stats");
        } else {
          setStats(await res.json());
        }
      } catch {
        setError("Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [shortCode]);

  const copyToClipboard = () => {
    if (!stats) return;
    navigator.clipboard.writeText(stats.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium animate-pulse">Loading stats...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-4">{error || "Stats not found"}</p>
          <button onClick={() => router.push("/dashboard")} className="text-indigo-600 font-bold hover:underline">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Link2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">LinkShrink</span>
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Link Stats</h1>

        {/* Summary card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Short URL</p>
              <p className="text-xl font-bold text-indigo-600">{stats.shortUrl}</p>
            </div>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all text-sm"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Original URL</p>
            <a
              href={stats.originalUrl}
              target="_blank"
              className="text-sm text-gray-700 hover:text-indigo-600 break-all transition-colors"
            >
              {stats.originalUrl}
            </a>
          </div>

          <div className="flex flex-wrap gap-6 pt-2 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Created</p>
              <p className="text-sm font-semibold">{new Date(stats.createdAt).toLocaleDateString()}</p>
            </div>
            {stats.expiresAt && (
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Expires</p>
                <p className="text-sm font-semibold">{new Date(stats.expiresAt).toLocaleDateString()}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Clicks</p>
              <p className="text-2xl font-extrabold text-indigo-600">{stats.clickCount}</p>
            </div>
          </div>
        </div>

        {/* Recent clicks table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-600" />
            Recent Clicks
          </h2>

          {stats.recentClicks.length === 0 ? (
            <p className="text-gray-500 text-sm">No clicks recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 font-medium uppercase tracking-wider border-b border-gray-100">
                    <th className="pb-3 pr-4">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Time</span>
                    </th>
                    <th className="pb-3 pr-4">
                      <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Referrer</span>
                    </th>
                    <th className="pb-3">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> User Agent</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.recentClicks.map((click) => (
                    <tr key={click.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 pr-4 text-gray-600 whitespace-nowrap">
                        {new Date(click.accessTime).toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 text-gray-600 max-w-xs truncate">
                        {click.referrer ?? <span className="text-gray-400 italic">Direct</span>}
                      </td>
                      <td className="py-3 text-gray-600 max-w-xs truncate">
                        {click.userAgent ?? <span className="text-gray-400 italic">Unknown</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
